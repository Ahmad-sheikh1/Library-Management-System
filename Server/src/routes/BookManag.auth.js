const express = require("express");
const router = express.Router();
const {
    AddBookController,
    UpdatebookController,
    GetAllBooksController,
    DeleteBookController,
} = require("../controllers/BookManag.controller")
const { requireAuth, adminMiddleware } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware")


router.post("/AddBook",upload.single('image') ,requireAuth, adminMiddleware, AddBookController)
router.put("/UpdateBook/:id", requireAuth, adminMiddleware, UpdatebookController)
router.get("/AllBooks", requireAuth, GetAllBooksController)
router.delete("/DeleteBook/:id", requireAuth, adminMiddleware, DeleteBookController)




module.exports = router;