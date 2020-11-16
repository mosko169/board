
class Courses {
    constructor(dbConn) {
        this.dbConn = dbConn;
    }

    async getUserCourses(userId) {
        let courseRecords = await this.dbConn.query('SELECT courses.course_id as "courseId", courses.name as "courseName" FROM \
                                    public.users_courses \
	                                JOIN courses on users_courses.course_id=courses.course_id \
                                    where users_courses.user_id =$1', [userId]);
        return courseRecords.rows;
    }
    
    async getCourseLessons(courseId) {
        let lessonRecords = await this.dbConn.query('SELECT lesson_id as "lessonId", \
                                                            course_id as "courseId", \
                                                            board_id as "boardId",   \
                                                            lesson_name as "lessonName" \
                                                            status  \
                                                    FROM public.lessons \
                                                    where course_id =$1', [courseId]);
        return lessonRecords.rows;
    }
}

module.exports = Courses;
