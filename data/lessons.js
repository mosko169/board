
const LESSON_STATUS = {
    IN_PROGRESS: 0,
    FINISHED:1
}

class Lessons {
    constructor(dbConn) {
        this.dbConn = dbConn;
    }

    addLesson(lessonId, courseId, boardId, name, recordPath) {
        return this.dbConn.query("INSERT INTO lessons VALUES($1, $2, $3, $4, $5, $6)",
                                    [lessonId, courseId, boardId, name, recordPath, LESSON_STATUS.IN_PROGRESS])
    }

    lessonFinished(lessonId) {
        return this.dbConn.query("UPDATE lessons SET status=$1 WHERE lesson_id=$2",
                                    [LESSON_STATUS.FINISHED, lessonId]);
    }

    getLesson(lessonId) {

    }

}

module.exports = Lessons;
