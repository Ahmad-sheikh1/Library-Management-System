require("dotenv").config({path:'../../.env'});
const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.json({ message: "notoen" });

    jwt.verify(token, process.env.JWT_SECRET , (err, decodedToken) => {
        if (err) return res.json(err.message);


        req.user = decodedToken;
        next()

    })

}

const adminMiddleware = (req, res, next) => {
    console.log(req.user , "usel");
    
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, proceed to the next middleware or route handler
    } else {
        res.sendStatus(403); // Forbidden if user is not admin
    }
};


module.exports = {requireAuth , adminMiddleware};