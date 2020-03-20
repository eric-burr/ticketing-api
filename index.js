const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const rjwt = require('restify-jwt-community');

const server = restify.createServer();

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