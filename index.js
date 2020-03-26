const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
var corsOne = require('cors')

// const rjwt = require('restify-jwt-community');

const corsMiddleware = require('restify-cors-middleware');

//allowHeaders wasn't including the headers being sent from
//UI. * is the wildcard that makes it work now.
const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: ['*', 'http://localhost:3001'],
    allowHeaders: ['*'],
    exposeHeaders: ['Authorization'],
  })

const server = restify.createServer();

server.pre(cors.preflight)
server.use(cors.actual)

server.use(corsOne())

//middleware

server.use(restify.plugins.bodyParser());

//protect routes
// server.use(rjwt({secret: config.JWT_SECRET}).unless({path: ['/auth']}));

server.listen(config.PORT, () => {
    //remove the deprecated message in console
    mongoose.set('useFindAndModify', false)
    
    mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true});
});

const db = mongoose.connection;

db.on('error', (err) => console.log(err));

db.once('open', () => {
    //seperate routing files for each resource, instead of endpoints here
    require('./routes/ticket')(server);
    require('./routes/users')(server);
    console.log(`Server started on port ${config.PORT}`);
})