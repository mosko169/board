const crypto = require('crypto');

class Users {
    constructor(dbConn) {
        this.dbConn = dbConn;
    }

    async getUser(userId) {

    }

    async userAuthenticated(userId, password) {
        let user = await this.dbConn.query("SELECT * from users where user_id=$1", [userId]);
        if (user.rowCount == 0) {
            return false;
        }
        user = user[0];
        let passHash = crypto.createHash('sha256');
        passHash.update(password + user.salt);
        return user.password == passHash.digest('hex');
    }
}

module.exports = Users;
