//receiving from server in index
const errors = require('restify-errors');

const Customer = require('../models/Customers')

module.exports = server => {
    //get
    server.get('/customers', async (req, res, next) => {
        try{
        const customers = await Customer.find({}); 
        res.send(customers);
        //restify needs to end on a next function
        next();
        } catch (err) {
            return next(new errors.InvalidContentError(err));
        }
    });

 //add
    server.post('/customers', async (req, res, next) => {
        if(!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }
        //creates a new customer object 
        const {name, email, balance } = req.body
        const customer = new Customer({
            name,
            email,
            balance
        });
        try {
            const newCustomer = await customer.save();
            //201 means something was created
            res.send(201);
            next();
        } catch (err) {
            return next(new errors.InternalError(err.message));
        }
    });

};