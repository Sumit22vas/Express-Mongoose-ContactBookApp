const epxpress = require('express');
const mongoose =  require('mongoose');
const handleBars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const contactRouters = require('./routes/contactRoute');

const app = epxpress(); // init  express app

app.use(epxpress.static(path.join(__dirname,'public'))); // Make Public folder as static

app.set('view engine','hbs'); // setting view engine
app.engine('hbs',handleBars({ // configuring view engine
    defaultLayout : 'main',
    partialsDir : path.join(__dirname,'views/partials'),
    layoutsDir : path.join(__dirname,'views/layouts'),
    extname : 'hbs'
}));

// Coonection to mongodb
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ContactBook',{useNewUrlParser:true,useUnifiedTopology : true });
db = mongoose.connection;

//Check if connected
db.once('open',()=>{
    console.log('connected to database');
})
//check if any datebase connection error
db.on('error',(err)=>{
    console.log(err);
});

// BodyParser Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get('/',(req,res)=> {
    res.render('index');
});

app.get('*',(req,res)=>{
    res.render('index');
});


app.use('/contact',contactRouters);

// Server Creation
const PORT =  process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`);
});