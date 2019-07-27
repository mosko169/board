
class Courses {
    constructor(dbConn) {
        this.dbConn = dbConn;
    }

    async getUserCourses(user_id) {
        return this.dbConn.query('SELECT * FROM \
                                    public.users_courses \
	                                JOIN courses on users_courses.course_id=courses.course_id \
	                                where users_courses.user_id =$1', [user_id]);
    }
    
    async getCourseLessons(course_id) {
        return this.dbConn.query('SELECT * FROM \
                                    public.lessons \
                                    where course_id =$1', [course_id]);
    }
}

module.exports = Courses;
