const express = require("express");
const { pendingRepairExist } = require("../middlewares/repairs.middlewares");
const {protectToken, protectEmployee} = require('../middlewares/users.middlewares')
const {
  createRepairValidations,
  checkValidations,
} = require("../middlewares/validators.middlewares");
const {
  createRepair,
  getRepairById,
  updateRepair,
  deleteRepair,
  getAllCompletedRepair,
  getAllPendingRepair,
} = require("../Controllers/repair.controller");

const { upload } = require('../utils/multer');

const router = express.Router();
router.use(protectToken)
router.get("/completed", getAllCompletedRepair);
router.get("/pending",protectEmployee, getAllPendingRepair);

router.get("/:id", protectEmployee, pendingRepairExist, getRepairById);

router.post("/", upload.single('imgPath'),createRepairValidations, checkValidations, createRepair);

router.patch("/:id", protectEmployee, pendingRepairExist, updateRepair);

router.delete("/id", protectEmployee, pendingRepairExist, deleteRepair);

module.exports = { repairRouter: router };
