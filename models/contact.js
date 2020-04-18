const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    phone : {
        type : Number,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    address : {
        type :String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    }

});

const Contact = mongoose.model('Contact',contactSchema,'contact');

module.exports = Contact;