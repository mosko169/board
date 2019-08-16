const PG = require('pg');
const Pool = PG.Pool;
const Client = PG.Client;

const CREATE_USERS_TABLE = "CREATE TABLE IF NOT EXISTS public.users            \
                            (                                   \
                                user_id character varying NOT NULL,       \
                                password character varying,     \
                                name character varying,         \
                                PRIMARY KEY (user_id)           \
                            )";

const CREATE_COURSES_TABLE = "CREATE TABLE IF NOT EXISTS public.courses             \
                                (                                                   \
                                    course_id integer NOT NULL,                     \
                                    name character varying,                         \
                                    PRIMARY KEY (course_id)                         \
                                )";

const CREATE_LESSONS_TABLE = "CREATE TABLE IF NOT EXISTS public.lessons   \
(                                                           \
    lesson_id character varying NOT NULL,                             \
    course_id integer NOT NULL,                             \
    board_id integer NOT NULL,                              \
    lesson_name character varying,                          \
    record_path character varying,                          \
    status integer,                                         \
    PRIMARY KEY (lesson_id),                              \
    FOREIGN KEY (course_id) REFERENCES public.courses,       \
    FOREIGN KEY (board_id) REFERENCES public.boards         \
)";

const CREATE_BOARDS_TABLE = "CREATE TABLE IF NOT EXISTS public.boards             \
                            (                                                   \
                                board_id integer NOT NULL,                     \
                                room character varying,                         \
                                PRIMARY KEY (board_id)                         \
                            )";

const CREATE_USERS_COURSES_TABLE = "CREATE TABLE IF NOT EXISTS public.users_courses      \
(                                                                                       \
    user_id character varying NOT NULL,                                                           \
    course_id integer NOT NULL,                                                         \
    PRIMARY KEY (user_id, course_id),                                   \
    FOREIGN KEY (course_id) REFERENCES public.courses,                                   \
    FOREIGN KEY (user_id) REFERENCES public.users                                        \
)";

class DbConn {
    static async getDBConn() {
        const pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'board',
            password: '1',
        });
        
        await pool.query(CREATE_USERS_TABLE);
        await pool.query(CREATE_BOARDS_TABLE);
        await pool.query(CREATE_COURSES_TABLE);
        await pool.query(CREATE_LESSONS_TABLE);
        await pool.query(CREATE_USERS_COURSES_TABLE);

        return pool;
    }
}

module.exports = DbConn;
