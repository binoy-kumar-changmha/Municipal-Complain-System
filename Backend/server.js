const connectDB = require('./config/dbConnection');
const uploadComplainRoute = require('./routes/uploadComplainRoute');
const userSignupRoute = require('./routes/userSignupRoute');
const userLoginRoute = require('./routes/userLoginRoute');
const fetchComplainRoute = require('./routes/fetchComplainRoute')
const deleteComplainRoute = require('./routes/deleteComplainRoute')
const acceptComplainRoute= require('./routes/acceptComplainRoute')
const rejectComplainRoute= require('./routes/rejectComplainRoute')
const resolveComplainRoute= require('./routes/resolveComplainRoute')
const adminLoginRoute = require('./routes/adminLoginRoute');
const fetchComplainAdminRoute= require('./routes/fetchComplainAdminRoute')
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();

app.use("/", uploadComplainRoute);
app.use("/auth", userSignupRoute);
app.use("/auth", userLoginRoute);
app.use("/", fetchComplainRoute);
app.use("/", deleteComplainRoute);

/*-------------------admin login --------------------*/ 
app.use("/", adminLoginRoute);
app.use("/",acceptComplainRoute);
app.use("/",rejectComplainRoute);
app.use("/",resolveComplainRoute);
app.use("/",fetchComplainAdminRoute);

app.get('/', (req, res) => {
    res.send("Student Api is running");
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});