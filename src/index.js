const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { body, validationResult } = require("express-validator");

const LogInCollection = require("./login");
const Review = require("./review");
// const adminRoutes = require('./routes/adminRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, '../views');
const publicPath = path.join(__dirname, '../public');

app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.static(publicPath));

mongoose.connect("mongodb://localhost:27017/restaurantBEElogin")
    .then(() => {
        console.log('mongoose connected');
    })
    .catch(() => {
        console.log('failed to connect');
    });

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

const requireLogin = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};




app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/home', requireLogin, (req, res) => {
    const loginSuccess = req.session.loginSuccess;
    req.session.loginSuccess = false; 
    res.render('home', { naming: req.session.name, loginSuccess });
});

// Admin routes
// app.use('/admin', adminRoutes);

app.get('/maharashtra', (req, res) => {
    res.render('maha/maharashtra');
});

app.get('/starters1', (req, res) => {
    res.render('maha/starters1');
});

app.get('/maincourse1', (req, res) => {
    res.render('maha/maincourse1');
});

app.get('/desserts1', (req, res) => {
    res.render('maha/desserts1');
});

app.get('/gujarat', (req, res) => {
    res.render('guju/gujarat');
});

app.get('/starters2', (req, res) => {
    res.render('guju/starters2');
});

app.get('/maincourse2', (req, res) => {
    res.render('guju/maincourse2');
});

app.get('/desserts2', (req, res) => {
    res.render('guju/desserts2');
});

app.get('/southindian', (req, res) => {
    res.render('south/southindian');
});

app.get('/starters3', (req, res) => {
    res.render('south/starters3');
});

app.get('/maincourse3', (req, res) => {
    res.render('south/maincourse3');
});

app.get('/desserts3', (req, res) => {
    res.render('south/desserts3');
});

app.post('/signup', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('signup', { errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
        name,
        email,
        password: hashedPassword,
        role: req.body.role || 'user' // Default to 'user' if role is not provided
    };

    await LogInCollection.insertMany([data]);
    res.redirect('/login');
});

app.post('/login', [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('login', { errors: errors.array() });
    }

    const { email, password, role } = req.body;
    try {
        const user = await LogInCollection.findOne({ email, role });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id;
            req.session.name = user.name;
            // req.session.role = user.role;
            req.session.loginSuccess = true;
            if (role === 'admin') {
                return res.redirect('/admin/items');
            } else {
                return res.redirect('/home');
            }
        } else {
            return res.status(400).render('login', { error: 'Invalid email or password' });
        }
    } catch (e) {
        return res.status(500).send("An error occurred");
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("An error occurred");
        }
        res.redirect('/login');
    });
});

app.post('/review', requireLogin, async (req, res) => {
    try {
        const { name, email, number, date, review } = req.body;
        await Review.create({ name, email, number, date, review });
        res.redirect('/home#review');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(3000, () => {
    console.log('port connected');
});
