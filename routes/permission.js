const express = require("express");

const router = express.Router();

const {
    createPermission,
    getAllPermissions,
    getPermissionById,
    updatePermission,
    deletePermission
} = require("../controllers/permission");

router.post("/create", createPermission);
router.get("/", getAllPermissions);
router.get("/:id", getPermissionById);
router.put("/:id", updatePermission);
router.delete("/:id", deletePermission);

module.exports = router;