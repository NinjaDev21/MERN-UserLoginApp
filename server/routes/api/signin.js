const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
module.exports = (app) => {

    /**
     * API for user sign up /registration
     */
    app.post('/api/account/signup',(req, res, next) =>{
        const {body} = req;
        const {name, password } = body;
        let {email} = body;
        if(!name) {
            return res.send({
                success : false,
                message : 'Error : Name cannot be blank.'
            });
        }
        if(!email) {
            return res.send({
                success : false,
                message : 'Error :  Email cannot be blank.'
            });
        }
        if(!password) {
            return res.send({
                success : false,
                message : 'Error : Password cannot be blank.'
            });
        }
        email = email.toLowerCase();        // make email lowerCase for checking of the Email exist or not .

        User.find({
            email : email
        },(err, previousUsers) => {
            if(err) {
                return res.send({
                    success : false,
                    message : 'Error : Server error.'
                });
            } else if (previousUsers.length > 0 ){
                return res.send({
                    success : false,
                    message : 'Error : Account already exist.'
                });
            }
            // save the user
            const newUser = new User();
            newUser.name = name;
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            newUser.save((err, user) => {
                if(err){
                    return res.send({
                        success : false,
                        message : 'Error : Server error.'
                    });
                }
                return res.send({
                    success : true,
                    message : 'Thanks for the signup.'
                });
            });
        });
    });


    /***
     * API for user login
     */
    app.post('/api/account/signin',(req, res, next) =>{
        const { body } = req;
        const { password } = body;
        let { email } = body;

        if(!email) {
            return res.send({
                success : false,
                message : 'Error :  Email cannot be blank.'
            });
        }
        if(!password) {
            return res.send({
                success : false,
                message : 'Error : Password cannot be blank.'
            });
        }

        email = email.toLowerCase();

        User.find({
            email : email
        },(err, users) => {
            if(err) {
                return res.send({
                    success : false,
                    message : 'Error : Server error.'
                });
            } else if (users.length !=1 ){
                return res.send({
                    success : false,
                    message : 'Error : Invalid email .'
                });
            }
            const user = users[0];
            console.log(user);
            if(!user.validPassword(password)) {
                return res.send({
                    success : false,
                    message : 'Error : Invalid password .'
                });
             }
            /* create a new session for the user and log the user in to the system */
            const newUserSession = new UserSession();
            newUserSession.userId = user._id;
            newUserSession.save((err, doc)=>{
                if(err) {
                    return res.send({
                        success : false,
                        message : 'Error : Server error.'
                    });
                }
                return res.send({
                    success : true,
                    message : 'You are logged in.',
                    token : doc._id
                });
            });
        });
        });

    /**
     * API for verify the token of a user
     */
    app.get('/api/account/verify',(req, res, next) => {
        const { query } = req;
        const { token } = query;

        UserSession.find({
            _id : token,
            isActive : true
        },(err, session) =>{
            if(err){
                return res.send({
                    success : false,
                    message : 'Error : Server error.'
                });
            }
            if(session.length != 1 ){
                return res.send({
                    success : false,
                    message : 'Error : Server error.'
                });
            }else{
                return res.send({
                    success : true,
                    message : 'Token Verified.'
                });
            }
        });
    });

    /**
     * API for logout a user
     */
    app.get('/api/account/logout',(req, res, next) => {
        const { query } = req;
        const { token } = query;

        UserSession.findOneAndUpdate({
            _id : token,
            isActive : true
        }, { $set: {isActive : false} }, null, (err, session) =>{
            if(err){
                return res.send({
                    success : false,
                    message : 'Error : Server error.'
                });
            }else{
                return res.send({
                    success : true,
                    message : 'You are logged out,Thanks for using me bye.'
                });
            }
        });
    });

};