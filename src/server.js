'use strict';

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MySQLSessionStore = require('express-mysql-session');
const layouts = require('express-ejs-layouts');
const flash = require('connect-flash');
require('dotenv').config();
const app = express();

require('./db');
require('./auth/local.auth');

const { database: dbOpts } = require('./db');
const storeSession = new MySQLSessionStore(dbOpts);

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(session({
    secret: 'qiwhr0iqwhfadb1141-014124_',
    store: storeSession,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(layouts);
app.use((req, res, next) => {
    app.locals.err = req.flash('err');
    app.locals.user = req.user;
    next();
});

// Routes
app.use('/', require('./routes/index.routes'));
app.use('/job', require('./routes/jobs.routes'));
app.use('/api/v1', require('./routes/dev-api.v1.routes'));
app.use('/adm', require('./routes/admin.routes'));

// Error 404
app.use((req, res, next) => {
    res.status(404).render('error-404', {
        layout: 'layouts/M'
    });
});

// Starting server
app.listen(app.get('port'), () => console.log(`Server on port ${app.get('port')}`))