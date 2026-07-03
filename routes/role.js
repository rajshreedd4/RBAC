const express = require("express");

const router = express.Router();

const {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
    assignPermissions
} = require("../controllers/role");


router.post("/create", createRole);
router.get("/", getAllRoles);
router.get("/:id", getRoleById);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);
router.put("/assign-permissions", assignPermissions);

module.exports = router;