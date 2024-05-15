const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors middleware

const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB
mongoose.connect('mongodb+srv://abdulhadik370:vZjINQ0neYv57Gfa@cluster0.7myolv5.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB database');
});

// Define Mongoose Schemas
const studentSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    subjectName: { type: String, required: true }, // Change subjectKey to subjectName and set type to String
    grade: { type: Number, required: true },
    remarks: { type: String, required: true }
});

const subjectSchema = new mongoose.Schema({
    subjectName: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);
const Subject = mongoose.model('Subject', subjectSchema);

// CRUD API Endpoints

// Fetch all students with subject names
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find().populate('subjectName', 'subjectName');
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new student
app.post('/api/students', async (req, res) => {
    const { studentName, subjectName, grade } = req.body;
    const remarks = grade >= 75 ? 'PASS' : 'FAIL';
  
    try {
        const newStudent = new Student({
            studentName,
            subjectName, // Use subjectName instead of subjectKey
            grade,
            remarks
        });
  
        await newStudent.save();
        res.json({ message: 'Student added successfully', student: newStudent });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});