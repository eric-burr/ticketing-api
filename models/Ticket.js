const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

TicketSchema.plugin(timestamp);

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;