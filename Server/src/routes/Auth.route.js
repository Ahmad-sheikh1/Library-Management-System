const express = require("express");
const router = express.Router();
const {
    RegisterUserController,
    LoginUserController,
    VerifyTokenController,
    GetAllUsersController,
    DeleteUserController,
    UpdateUserController,
} = require("../controllers/Auth.controller")



router.post("/RegisterUser", RegisterUserController)
router.post("/LoginUser", LoginUserController)
router.post("/VerifyTokenUser", VerifyTokenController)
router.get("/Allusers", GetAllUsersController)
router.delete("/DeleteUser/:id" , DeleteUserController)
router.put("/UpdateUser/:id" , UpdateUserController)


module.exports = router;