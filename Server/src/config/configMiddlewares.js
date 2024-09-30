require("dotenv").config();
const cors = require("cors")
const express = require("express")
const compression = require("compression")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")

module.exports = function (app) {
    app.use(cors())
    app.options("*", cors())
    app.use(helmet({ contentSecurityPolicy: false }))
    app.use(compression())
    app.use(express.json({ limit: "30mb" }))
    app.use(express.urlencoded({ limit: "50mb", extended: true }))
    app.use(mongoSanitize())
    const limiter = rateLimit({
        max: 90000,
        windowMs: 15 * 60 * 1000, 
        message: "Too many requests from this IP, please try again in 15 mintues!"
    })
}