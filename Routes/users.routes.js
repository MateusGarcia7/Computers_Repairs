const express = require("express");
const {
  userExist,
  protectToken,
  protectAccountOwner,
} = require("../middlewares/users.middlewares");
const {
  createUserValidations,
  checkValidations,
} = require("../middlewares/validators.middlewares");
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
} = require("../Controllers/users.controller");

const router = express.Router();

//router.get("/:id",getUserById);

router.post("/", createUserValidations, checkValidations, createUser);
router.post("/login", login);

//router.patch("/:id", updateUser)
//router.delete("/:id", deleteUser)

router.use(protectToken);
router.get("/", getAllUsers);
router
  .route("/:id")
  .get(userExist, getUserById)
  .patch(protectAccountOwner, userExist, updateUser)
  .delete(protectAccountOwner, userExist, deleteUser);

module.exports = { userRouter: router };
