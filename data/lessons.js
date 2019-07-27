
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

    getLessons(userId) {
        return this.dbConn.query("SELECT lessons.lesson_id as lessonId, lessons.lesson_name as lessonName, courses.name as courseName FROM \
                                lessons \
                                JOIN courses on lessons.course_id=courses.course_id \
                                JOIN users_courses on courses.course_id=users_courses.course_id \
                                WHERE users_courses.user_id=$1", [userId]);
    }

}

module.exports = Lessons;
