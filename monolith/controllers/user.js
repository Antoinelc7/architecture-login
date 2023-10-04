const Datastore = require("nedb");
const db = new Datastore({filename: __dirname + "/../.db/user", autoload: true})

class User {
    /** 
     *  @url=/user/auth
     *  @method=POST
     */
    static auth(req, res) {
        const { login, password } = req.body;
    
        db.findOne({
            login: login,
            password: password
        }, (err, doc) => {
            if (doc) {
                // Stocker l'information de login dans la session
                req.session.login = login;
                console.log(req.session.login); // Vérifiez si le nom d'utilisateur est correctement stocké dans la session
                res.redirect("/index");
            } else {
                res.redirect("/login?error=1");
            }
        });
    }
    

    /** 
     *  @url=/user
     *  @method=POST
     */
    static register(req, res) {

        //  Securise les données
        db.findOne({
            login:      req.body.login,
            password:   req.body.password
        },(err, doc) => {
            if(!doc){
                db.insert(req.body,(err) => {
                    res.redirect(err ? "/register" : "/login")
                })
                return
            }
            res.redirect("/login")
        })
    }
}

module.exports = User