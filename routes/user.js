const express = require("express");

const router = express.Router();

const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    assignRole
} = require("../controllers/user");

router.post("/create", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/assign-role", assignRole);

module.exports = router;