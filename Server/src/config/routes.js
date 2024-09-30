const {
    AuthRoute,
    BookManagment,
    BorrowRoute,
} = require("../routes");



module.exports = function (app) {
    app.use("/api/auth", AuthRoute)
    app.use("/api/bookmanagment", BookManagment)
    app.use("/api/boorowmanagment", BorrowRoute)
}