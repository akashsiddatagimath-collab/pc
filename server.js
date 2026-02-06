const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// Ensure uploads directory exists on startup
const startUploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(startUploadDir)) {
    fs.mkdirSync(startUploadDir);
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, startUploadDir);
    },
    filename: function (req, file, cb) {
        // Use timestamp to avoid name collisions
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// NOTE: /upload endpoint is defined below after authentication middleware

// Endpoint to list images
app.get('/api/images', (req, res) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
        return res.json([]);
    }

    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        // Filter for image files only
        const images = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
        res.json(images);
    });
});

// Email sending configuration
const nodemailer = require('nodemailer');
const session = require('express-session');
const bodyParser = require('body-parser');

app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'patil-construction-secret-key', // Change this in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Access Control Middleware
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

// Login Route (commented out - admin removed)
// app.post('/login', (req, res) => { ... });

// Protected routes removed - admin panel deleted

// Protect Upload Endpoint
app.post('/upload', isAuthenticated, upload.single('projectImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send({ message: 'File uploaded successfully!', filename: req.file.filename });
});

app.post('/send-email', async (req, res) => {
    const { name, email, phone, message } = req.body;

    // ⚠️ IMPORTANT: YOU MUST CONFIGURE YOUR EMAIL DETAILS HERE
    // For Gmail, you often need to use an "App Password" if 2FA is enabled.
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'patilprajwal022@gmail.com', // Prajwal's Gmail
            pass: 'YOUR_APP_PASSWORD'          // ⚠️ REPLACE WITH APP PASSWORD FROM GOOGLE
        }
    });

    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: 'patilprajwal022@gmail.com', // Prajwal Patil's email
        subject: `New Contact Form Submission from ${name}`,
        text: `
            Name: ${name}
            Email: ${email}
            Phone: ${phone}
            
            Message:
            ${message}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).send({ message: 'Failed to send email. Check server logs.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Admin Login: http://localhost:${PORT}/login.html`);
});
