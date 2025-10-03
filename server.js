const express   = require("express")
const mongoose   = require("mongoose")  
const bodyParser = require('body-parser');
const cors = require('cors');



require('dotenv').config(); // For loading environment variables


// Load environment variables from .env file
const { MONGODB_URI_DEV, PORT } = process.env;
console.log(process.env)
// Connecting to MongoDB Database
//mongoose.set("useNewUrlParser","true")
//mongoose.set("useUnifiedTopology","true")
mongoose.connect(MONGODB_URI_DEV, {})
    .then(() => {
        console.log('Database successfully connected!');
        app.listen(PORT, ()=>{
            console.log("Hello")
        })        
    })
    .catch((error) => {
        console.log('Could not connect to database: ' + error);
    });

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    res.send('Hello node API')
})


// Import Express Routes
const measuresRoute = require('./routes/measures.route');
app.use(cors())
app.use('/api/measures', measuresRoute);

const patientRoute = require('../backend-api/routes/patients.route');
app.use(cors())
app.use('/api/patients', patientRoute);

const userProfileRoute = require('./routes/userProfiles.route');
app.use(cors())
app.use('/api/userProfiles', userProfileRoute);

const patientFeedbackRoute = require('../backend-api/routes/patientFeedback.route');
app.use(cors())
app.use('/api/patientFeedback', patientFeedbackRoute);
