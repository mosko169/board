
/**
 * Passport callbacks implementation
 */
class Auth {
    constructor(users) {
        this.users = users;
    }

    async authenticate(user, password, done) {
        try {
            if (await this.users.userAuthenticated(user, password)) {
                done(null, user);
            } else {
                done(null, false, "invalid username or password");
            }
        } catch (err) {
            done("failed to authenticate user " + user + ", error: " + err);
        }
    }

    serializeSession(user, done) {
        done(null, user);
    }

    deserializeSession(id, done) {
        done(null, id);
    }

    static parseUser(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.sendStatus(401);
        }
    }

}

module.exports = Auth;