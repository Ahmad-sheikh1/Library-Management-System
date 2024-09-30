const express = require("express");
const router = express.Router();
const {
    BorrowBookController,
    ReturnBookController,
    GetAllBorrowsController,
    BorrowRequestsController,
    getAllBorrowRequests,
    AdminApproveBorrowRequestesController,
} = require("../controllers/BorrowManag.controller");
const { requireAuth } = require("../middlewares/auth.middleware")



router.post("/ReturnBook", requireAuth, ReturnBookController)
router.get("/DetailofBorrows", requireAuth, GetAllBorrowsController)
router.post("/borrow-requests", requireAuth, BorrowRequestsController)
router.get("/get-borrow-requests", requireAuth, getAllBorrowRequests)
router.put("/adminapprove/:id", AdminApproveBorrowRequestesController)



module.exports = router;
