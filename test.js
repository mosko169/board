const DbConn = require('./db_conn');

const Lessons = require('./data/lessons');
const Users = require('./data/users');
const Courses = require('./data/courses');



async function main() {

    let dbConn = await DbConn.getDBConn();


    let lessonsMgr = new Lessons(dbConn);
    let coursesMgr = new Courses(dbConn);

    let courses = await coursesMgr.getUserCourses("yarden");
    console.log(courses[0])

}


main();