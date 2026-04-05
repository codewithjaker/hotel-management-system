import { Router } from "express";
import { UserController } from "./user.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
  userIdParamSchema,
} from "./user.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Admin/manager only
router.get(
  "/",
  roleMiddleware(["admin", "manager"]),
  UserController.getAllUsers
);

router.get(
  "/:id",
  validate(userIdParamSchema, "params"),
  UserController.getUserById
);

router.post(
  "/",
  roleMiddleware(["admin", "manager"]),
  validate(createUserSchema),
  UserController.createUser
);

router.patch(
  "/:id",
  validate(userIdParamSchema, "params"),
  validate(updateUserSchema),
  UserController.updateUser
);

router.delete(
  "/:id",
  roleMiddleware(["admin"]),
  validate(userIdParamSchema, "params"),
  UserController.deleteUser
);

router.post(
  "/change-password",
  validate(changePasswordSchema),
  UserController.changePassword
);

export default router;