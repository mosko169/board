const socketio = require('socket.io');
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sessions = require('client-sessions');

const EventEmitter = require('events');
const Bluebird = require('bluebird');
const fs = require('fs');
const path = require('path');
const parseRange = require('range-parser');

fs.readdirP = Bluebird.promisify(fs.readdir);
fs.statP = Bluebird.promisify(fs.stat);

const RecorderPovider = require('./board/record/recorder_provider');
const BoardServer = require('./board_server');
const Board = require('./board/board');
const BoardCanvas = require('./board/board_canvas');
const Client = require('./client')
const log = require('./common/logger');
const Encoder = require('./board/record/ffmpeg_encoder');

const DbConn = require('./db_conn');
const Auth = require('./auth/auth');

const Lessons = require('./data/lessons');
const Users = require('./data/users');
const Courses = require('./data/courses');
const Boards = require('./data/boards');

const RECORDS_PATH = path.join(process.cwd(), "records", "artifacts");



function initializeAuth(users) {
    let auth = new Auth(users);
    passport.use(new LocalStrategy(auth.authenticate.bind(auth)));
    passport.serializeUser(auth.serializeSession.bind(auth));
    passport.deserializeUser(auth.deserializeSession.bind(auth));
}


async function main() {

    if (!fs.existsSync(RECORDS_PATH)) {
        fs.mkdirSync(RECORDS_PATH);
    }

    let dbConn = await DbConn.getDBConn();

    // LIVE SESSIONS HANDLING
    let clientsMgr = new EventEmitter();
    let boardsMgr = new EventEmitter();

    let lessonsMgr = new Lessons(dbConn);
    let coursesMgr = new Courses(dbConn);
    let boardsData = new Boards(dbConn);

    let boardServer = new BoardServer(boardsMgr, clientsMgr, lessonsMgr);

    let s = socketio({
        path: '/socket.io',
    });

    let clientsSocket = s.of('/clients');
    let boardsSocket = s.of('/boards');

    clientsSocket.on('connection', clientSocket => {
        let query = clientSocket.handshake.query;
        let clientId = query.clientId;
        log.info('client ' + clientId + ' connected from ' + clientSocket.handshake.address);

        clientSocket.on('disconnect', () => {
            log.info('client ' + clientId + ' disconnected');
            clientsMgr.emit('clientDisconnected', clientId)
        });

        clientsMgr.emit('newClient', new Client(clientSocket, clientId, query.sessionId));
    })

    let recorderPovider = new RecorderPovider(RECORDS_PATH);

    boardsSocket.on('connection', boardSocket => {
        let boardId = boardSocket.handshake.query.boardId;
        let boardCanvas = new BoardCanvas();
        log.info('board ' + boardId + ' connected from ' + boardSocket.handshake.address);

        boardSocket.on('disconnect', () => {
            log.info('board ' + boardId +' disconnected');
            boardsMgr.emit('boardDisconnected', boardId);
        })
        
        boardsMgr.emit('newBoard', new Board(boardSocket, boardCanvas, recorderPovider, boardId));
    })

    s.listen(4000);


    // WEB APPLICATION
    const app = express()
    let apiRouter = express.Router();

    app.use('/static', express.static('build/static'))
    app.use('/bla', express.static('build'));
    app.use('/api', apiRouter);
    app.use('/', apiRouter);
    
    apiRouter.use(express.json());
    apiRouter.use(express.urlencoded({ extended: true }));
    apiRouter.use(sessions({
        cookieName: 'session',
        secret: 'secret'
    }));
    apiRouter.use(passport.initialize());
    apiRouter.use(passport.session());

    let users = new Users(dbConn);
    initializeAuth(users);

    apiRouter.post('/login', passport.authenticate('local'), (req, res) => {
        let userId = req.body.userId;
        let boardId = req.body.boardId;
        let board = boardServer.getBoard(boardId);
        res.send({
            sessionId: board.sessionId,
            canvasProperties: board.getCanvasProperties()
        });
    });

    apiRouter.get('/liveSessions'/* , Auth.parseUser */, async (req, res) => {
        let userId = req.user;
        let userLiveSessions = await lessonsMgr.getLiveSessions(userId);
        res.send(userLiveSessions);
    });

    apiRouter.get('/liveSessions/:sessionId'/* , Auth.parseUser */, async (req, res) => {
        let sessionId = req.params.sessionId;
        let board = boardServer.getSessionBoard(sessionId);
        let boardMetadata = await boardsMgr.getBoardMetadata(board.boardId);
        const boardData = {
            room: boardMetadata.room,
            boardId: board.boardId,
            canvasProperties: board.getCanvasProperties()
        }
        res.send(boardData);
    });

    
    apiRouter.get('/liveSessions/anotherEndpoint'/* , Auth.parseUser */, async (req, res) => {
        const anotherEndpoint = 123
        do something
        ...
        ...
        ...
        res.send()
    });


    apiRouter.post('/liveSessions/start', (req, res) => {
        let boardId = Number(req.body.boardId);
        let courseId = Number(req.body.courseId);
        let lessonName = req.body.lessonName;
        boardServer.startSession(boardId, {courseId: courseId, lessonName: lessonName});
        res.send();
    });

    apiRouter.post('/liveSessions/stop', async (req, res) => {
        let sessionId = req.body.sessionId;
        await boardServer.stopSession(sessionId);
        res.send();
    });

    apiRouter.get('/courses'/* , Auth.parseUser */, async (req, res) => {
        let userId = "yarden";//req.user;
        let courses = await coursesMgr.getUserCourses(userId);
        res.send(courses);
    });

    apiRouter.get('/courses/:courseId'/* , Auth.parseUser */, async (req, res) => {
        let courseId = req.params.courseId;
        let lessons = await coursesMgr.getCourseLessons(courseId);
        res.send(lessons);
    });

    apiRouter.get('/lessons'/* , Auth.parseUser */, async (req, res) => {
        let userId = req.user;
        let lessons = await lessonsMgr.getLessons(userId);
        res.send(lessons.map(lesson => {
            return {
                lessonId: lesson.lessonId,
                lessonName: lesson.lessonName,
                courseName: lesson.courseName
            }
        }))
    });

    function foo() {
        let start = range.start;
        let end = range.end;
        let chunksize = (end-start)+1
        let file = fs.createReadStream(lessonVideoPath, {start, end})
        let head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/' + Encoder.FORMAT,
        }
        return head
    }

    apiRouter.get('/lessons/:lessonId', async (req, res) => {
            let lessonVideoPath = path.join(RECORDS_PATH, req.params.lessonId +'.' + Encoder.FORMAT);
            let stat = await fs.statP(lessonVideoPath)
            let fileSize = stat.size;
            let range = parseRange(fileSize, req.headers.range)[0];
            head = foo()
            res.writeHead(206, head);
            file.pipe(res);
    });

    log.info("starting server");
    app.listen(8080);

}

main();