const router = require('express').Router();
const Contact = require('../models/contact');

router.post('/add',(req,res)=>{  // Adding Contact to MongoDb
    const newContact = new Contact(req.body);
    newContact.save().then((response) => {
        res.status(200).json({
            class  : "success",
            alert : 'Success !!!',
            msg : 'contact added successfully !!!'
        });
    }).catch((err) => {
        console.log(err);
    });
});

router.post('/fetch',(req,res) => {  // Fetch Data From mongoDb
    Contact.find({}).sort({date : -1})
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
        });
});

router.post('/view',(req,res)=>{ // View by ID
    Contact.findById(req.body.id).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
    });
});


router.post('/remove',(req,res)=>{ // Delete By Id
    Contact.findByIdAndDelete(req.body.id).then((result) => {
        res.status(200).json({
            type : 'success',
            alert : 'Success !!!',
            msg : 'Contact Successfully Removed!!! '
        });
    }).catch((err) => {
        console.log(err);
    });
});

router.post('/getdata',(req,res)=>{ // For Populating Input box
    Contact.findById(req.body.id).then((result) => {
       res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
    });
});


router.post('/update',(req,res)=>{
    Contact.findByIdAndUpdate(req.body.id,{
        $set : {
            name : req.body.name,
            phone : req.body.phone,
            email : req.body.email,
            address : req.body.address
        }
    }).then((result) => {
        res.status(200).json({
            class : 'info',
            alert : 'Updated !!!',
            msg : 'Contact has been updated successfully !!!'
        });
    }).catch((err) => {
        console.log(err);
    });
});

module.exports = router;