if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const listingsRoute = require("./routes/listing");
const reviewsRoute = require("./routes/review");
const userRoute = require("./routes/user");
const path = require("path");
const ejsMate = require('ejs-mate');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user");

let port = 8000;

// 1. GLOBAL MIDDLEWARE SETUP
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(flash());

// 2. Database Connection
const db_URL = process.env.ATLASDB_URL;

async function main() {
    try {
        await mongoose.connect(db_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}
main();

const mongoStore = MongoStore.create({
    client: mongoose.connection.getClient(),  // ✅ safer & reuse connection
    crypto: { secret: process.env.SECRET },
    touchAfter: 24 * 3600
});

mongoStore.on("error", (err) => {
    console.log("error are in sessionStore", err);
});

const sessionMgmt = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true // prevent cross script attacks
    }
};

app.use(session(sessionMgmt));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 3. ROUTES
app.use("/", listingsRoute);
app.use("/", reviewsRoute);
app.use("/", userRoute);


app.get('/PremiumSite', (req, res) => {
    res.render("listings/fontsHandling");
});

app.get("/privacys", (req, res) => {
    res.render("listings/privacy");
});

// 4. GENERAL ERROR HANDLING MIDDLEWARE (LAST)
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("listings/Error", { message }); // ✅ pass message
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
