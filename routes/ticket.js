//receiving from server in index
const errors = require('restify-errors');

const Ticket = require('../models/Ticket')

module.exports = server => {
    //get
    server.get('/ticket', async (req, res, next) => {
        try{
        const ticket = await Ticket.find({}); 
        res.send(ticket);
        //restify needs to end on a next function
        next();
        } catch (err) {
            return next(new errors.InvalidContentError(err));
        }
    });

 //add
    server.post('/ticket', async (req, res, next) => {
        if(!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }
        //creates a new ticket object 
        const {title, subject, completed } = req.body
        const ticket = new Ticket({
            title,
            subject,
            completed
        });
        try {
            const newTicket = await ticket.save();
            //201 means something was created
            res.send(201);
            next();
        } catch (err) {
            return next(new errors.InternalError(err.message));
        }
    });

    //delete
    //restify uses del instad of delete
    server.del('/ticket/:id', async (req, res, next) => {
        try {
            const ticket = await Ticket.findOneAndRemove({ _id: req.params.id });
            res.sent(204);
            next();
        } catch(err) {
            new errors.ResourceNotFoundError(`there is nothing with id ${req.params.id}`)
        };
    })

};