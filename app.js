if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const dbUrl = process.env.dbUrl;
// console.log(process.env.secret);
const express = require("express");
const mongoose = require('mongoose');
const listing = require("./models/listing")
const Review = require("./models/review")
const path = require("path");
const methodOverride = require('method-override')
const expressError = require("./expressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const app = express();
const port = 8080;
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});
store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        return res.redirect("/login");
    }
    next();
}
async function isOwner(req, res, next) {
    const listingData = await listing.findById(req.params.id);
    if (!req.user || !req.user._id.equals(listingData.owner._id))
        return res.redirect(`/listings/${req.params.id}`);
    next();
}
async function isAuthor(req, res, next) {
    const review = await Review.findById(req.params.reviewId);
    if (!req.user || !req.user._id.equals(review.createdBy._id))
        return res.redirect(`/listings/${req.params.id}`);
    next();
}
function saveRedirectUrl(req, res, next) {
    if (req.session.redirectUrl)
        res.locals.redirectUrl = req.session.redirectUrl;
    next();
}
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride('_method'))
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
mongoose.connect(dbUrl)
    .then(() => console.log('Connected!'));


function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => { next(err) });
    }
};

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    // console.log(req.user);
    next();
})
app.listen(port, () => {
    console.log(`app is listening at port ${port}`);
});
app.get("/", (req, res) => {
    res.redirect("/listings")
});
app.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});
app.post("/signup", wrapAsync(async (req, res) => {
    let user = new User({
        email: req.body.email,
        username: req.body.username
    });
    const output = await User.register(user, req.body.password);
    req.login(output, (err) => {
        if (err) {
            return next(err);
        }
        console.log(output);
        res.redirect("/listings");
    });

}));
app.get("/login", (req, res) => {
    res.render("users/login.ejs");
});
app.post("/login", saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login" }),
    (req, res) => {
        let redirectUrl = res.locals.redirectUrl;
        if (!redirectUrl) redirectUrl = "/listings";
        res.redirect(redirectUrl);
    });
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/listings");
    });
})
app.get("/listings", wrapAsync(async (req, res) => {
    const listings = await listing.find().populate("owner");
    res.render("listings/listings.ejs", { listings });
}));
app.get("/listings/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
    // res.send("ok");
});
app.get("/listings/:id", wrapAsync(async (req, res) => {
    const data = await listing.findById(req.params.id)
        .populate({
            path: "reviews", populate: {
                path: "createdBy"
            }
        })
        .populate("owner");
    console.log(data);
    res.render("listings/listing.ejs", { data });
}));
// app.get("/listing/:id", (req, res) => {
//     res.render("listings/test.ejs");
// })
app.post("/listings", isLoggedIn, wrapAsync(async (req, res) => {
    const temp = new listing({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        location: req.body.location,
        country: req.body.country
    });
    temp.owner = req.user._id;
    console.log(temp);
    await temp.save();
    res.redirect("/listings");
}));

app.get("/listings/:id/edit", isLoggedIn, wrapAsync(async (req, res, next) => {
    const data = await listing.findById(req.params.id);
    res.render("listings/edit.ejs", { data });
}));

app.put("/listings/:id", isOwner, wrapAsync(async (req, res) => {
    const temp = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        location: req.body.location,
        country: req.body.country
    };
    await listing.findByIdAndUpdate(req.params.id, temp);
    res.redirect(`/listings/${req.params.id}`);
}));

app.delete("/listings/:id", isOwner, wrapAsync(async (req, res, next) => {
    await listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
}));

app.get("/listings/:id/reviews/new", isLoggedIn, (req, res) => {
    console.log(req.params.id);
    res.render("reviews/new.ejs", { id: req.params.id });
});

app.post("/listings/:id/reviews", wrapAsync(async (req, res) => {
    // res.send("ok");
    const review = new Review({
        rating: req.body.rating,
        comment: req.body.comment,
    });
    if (!req.user)
        return res.redirect("/listings");
    review.createdBy = req.user._id;
    console.log(review);
    await review.save();
    const listingData = await listing.findById(req.params.id);
    listingData.reviews.push(review);
    await listingData.save();
    res.redirect(`/listings/${req.params.id}`);
}));
app.get("/listings/:id/reviews/:reviewId/edit", isLoggedIn, wrapAsync(async (req, res) => {
    const data = await Review.findById(req.params.reviewId);
    const ID = req.params.id;
    res.render("reviews/edit.ejs", { data, ID });
}));
// "/listings/:id/reviews/:reviewId"
app.put("/listings/:id/reviews/:reviewId", isAuthor, wrapAsync(async (req, res) => {
    const temp = {
        rating: req.body.rating,
        comment: req.body.comment,
    };
    await Review.findByIdAndUpdate(req.params.reviewId, temp);
    console.log(req.params.id);
    res.redirect(`/listings/${req.params.id}`);
}));
app.delete("/listings/:id/reviews/:reviewId", isAuthor, wrapAsync(async (req, res) => {
    let review = await Review.findByIdAndDelete(req.params.reviewId);
    console.log(review);
    let listingData = await listing.findById(req.params.id);
    console.log(listingData);
    const index = listingData.reviews.indexOf(req.params.reviewId);
    if (index > -1) {
        listingData.reviews.splice(index, 1);
    }
    console.log(listingData);
    listingData.save();
    res.redirect(`/listings/${req.params.id}`);
}));
app.get("/dikhado", async (req, res) => {

    res.render("listings/test.ejs");
});
app.all("*", (req, res, next) => {
    try {
        throw new expressError(404, "The requested URL was not found");
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    // console.log("i am here");
    let status = err.status;
    if (!status)
        status = 404;
    let message = err.message;
    res.render("error/error.ejs", { status, message });
});

