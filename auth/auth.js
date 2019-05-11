
/**
 * Passport callbacks implementation
 */
class Auth {
    constructor(users) {
        this.users = users;
    }

    async authenticate(user, password, done) {
        try {
            if (await users.userAuthenticated(user, password)) {
                done(null, user);
            } else {
                done(null, false, "invalid username or password");
            }
        } catch (err) {
            done("error while trying to authenticate");
        }
    }

    serializeSession(user, done) {
        done(null, user.user_id);
    }

    deserializeSession(id, done) {
        done(null, id);
    }

    static parseUser(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.send(401);
        }
    }

}

module.exports = Auth;