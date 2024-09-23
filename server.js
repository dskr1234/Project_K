const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // MySQL username
    password: 'your_password', // MySQL password
    database: 'registration_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Serve login page on root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle registration
app.post('/register', (req, res) => {
    const { name, phonenumber, email, password } = req.body;
    const sql = 'INSERT INTO users (name, phonenumber, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, phonenumber, email, password], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=
    , initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <form class="form-container" action="/register" method="POST">
    <div>
    <div class="each-feild">
    <label for="name" class="label-name">Name:</label>
    <input type="text" placeholder="Enter your Name" class="input-box" name="name"/>
    </div>
    <div class="each-feild">
        <label for="phonenumber" class="label-name">Phone Number:</label>
        <input type="text" placeholder="Enter your Number" class="input-box" name="phonenumber"/>
    </div>
    <div class="each-feild">
        <label for="email" class="label-name">Email:</label>
        <input type="email" placeholder="Enter your Email" class="input-box" name="email"/>
    </div>
    <div class="each-feild">
        <label for="password" class="label-name">Set Password:</label>
        <input type="password" placeholder="Set your Password" class="input-box" name="password"/>
    </div>
    <button class="login-button" type="submit">Register</button>
    <p class="new-user-para">User Already Exists!!</p>
    <div class="new-user-container">
        <p class="new-user-para">Back to Login?</p>
        <a href="login.html" class="new-user-link">Login Here!</a>
    </div>
    </div>
    <div>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPpbYWaVuQKeO9sUNttyLCBt7qpv9E9cjr7w&s" class="login-image" alt="login-logo"/>
        </div>
</form>
    </div>

</body>
</html>`);
        }
        res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=
    , initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <form class="form-container" action="/register" method="POST">
    <div>
    <div class="each-feild">
    <label for="name" class="label-name">Name:</label>
    <input type="text" placeholder="Enter your Name" class="input-box" name="name"/>
    </div>
    <div class="each-feild">
        <label for="phonenumber" class="label-name">Phone Number:</label>
        <input type="text" placeholder="Enter your Number" class="input-box" name="phonenumber"/>
    </div>
    <div class="each-feild">
        <label for="email" class="label-name">Email:</label>
        <input type="email" placeholder="Enter your Email" class="input-box" name="email"/>
    </div>
    <div class="each-feild">
        <label for="password" class="label-name">Set Password:</label>
        <input type="password" placeholder="Set your Password" class="input-box" name="password"/>
    </div>
    <button class="login-button" type="submit">Register</button>
    <p class="new-user-para">Resgistration Successfull!!</p>
    <div class="new-user-container">
        <p class="new-user-para">Back to Login?</p>
        <a href="login.html" class="new-user-link">Login Here!</a>
    </div>
    </div>
    <div>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPpbYWaVuQKeO9sUNttyLCBt7qpv9E9cjr7w&s" class="login-image" alt="login-logo"/>
        </div>
</form>
    </div>

</body>
</html>`);
    });
});

// Handle login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).send('Internal server error');
        }
        if (results.length > 0) {
            // Login successful
            res.redirect('/welcome.html'); // Redirect to welcome page
        } else {
            // Login failed
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Login</title>
                    <link rel="stylesheet" href="style.css">
                </head>
                <body>
                    <div class="container">
                        <form class="form-container" action="/login" method="POST">
                            <div>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIcpZtS76Z240-eZOBcm1PRiGh1siQFD4fLQ&s" class="login-image" alt="login-logo"/>
                            </div>
                            <div>
                                <div class="each-feild">
                                    <label for="email" class="label-name">E-mail:</label>
                                    <input type="email" placeholder="Enter your email" class="input-box" name="email"/>
                                </div>
                                <div class="each-feild">
                                    <label for="password" class="label-name">Password:</label>
                                    <input type="password" placeholder="Enter your Password" class="input-box" name="password"/>
                                </div>
                                <div id="error-message" style="color: red;">Invalid email or password</div> <!-- Error message -->
                                <button class="login-button">Login</button>
                                <div class="new-user-container">
                                    <p class="new-user-para">New User?</p>
                                    <a href="index.html" class="new-user-link">Register Here!</a>
                                </div>
                            </div>
                        </form>
                    </div>
                </body>
                </html>
            `);
        }
    });
});

// Serve welcome page
app.get('/welcome.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
