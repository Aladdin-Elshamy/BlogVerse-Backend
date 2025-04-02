const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")

router.post("/register",userController.register)
router.post("/login",userController.login)
router.get("/getAll",userController.getAllUsers)
router.delete("/delete",userController.deleteUser)
router.patch("/edit",userController.editUser)

module.exports = router