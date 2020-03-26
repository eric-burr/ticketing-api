const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../auth');
const config = require('../config')
const index = require('../index')

// const corsMiddleware = require('restify-cors-middleware');

// const cors = corsMiddleware({
//     preflightMaxAge: 5, //Optional
//     origins: ['*', 'http://localhost:3001'],
//     allowHeaders: ['Authorization'],
//     exposeHeaders: ['Authorization'],
//   })

//   const server = restify.createServer();

// server.pre(cors.preflight)
// server.use(cors.actual)
     
module.exports = server => {
    //Register User
    server.post('/register', (req, res, next) => {
        console.log(req.body)
        //send email + password, destruction from req.body
        const { email, password } = req.body;
        //create user from User Model brought (line 2)
        //not saved just creating 
        const user = new User({
            email,
            password
        });
        //hasing password
        bcrypt.genSalt(10, (err, salt) => {
            //these lines encrypt the password in the collection
            bcrypt.hash(user.password, salt, async (err, hash) => {
                //hash password
                user.password = hash;
                //save user (from lines 9-15)
                try {
                    //using mongoose to save the user
                    const newUser = await user.save(); 
                    res.send(201);
                    next();
                } catch(err) {
                    return next(new errors.InternalError(err.message));
                }
            });
        });
    });

//authorize a user
server.post('/auth', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // pulling in payload
        const user = await auth.authenticate(email, password);
        
        //creating jwt
        //user is payload
        const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
            expiresIn: '20m'
        }); 

        //iat means "issued at" exp means "expiration"
        const { iat, exp } = jwt.decode(token);
        //respond with token
        res.send({iat, exp, token})

        next();
    } catch(err) {
        //not authorized
        return next(new errors.UnauthorizedError(err));
    }
})

};
