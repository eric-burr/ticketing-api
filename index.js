const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');

const server = restify.createServer();

//middleware

server.use(restify.plugins.bodyParser());

server.listen(config.PORT, () => {
    mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true});
});

const db = mongoose.connection;

db.on('error', (err) => console.log(err));

db.once('open', () => {
    //seperate routing files for each resource, instead of endpoints here
    require('./routes/customer')(server);
    console.log(`Server started on port ${config.PORT}`);
})