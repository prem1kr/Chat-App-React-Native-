import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addMember, createGroup, deleteGroup, getGroupById, getUserGroups, removeMember, updateGroup } from "../controllers/groupController.js";

const groupRouter = express.Router();

groupRouter.post("/create", authMiddleware, createGroup);
groupRouter.get("/my-groups", authMiddleware, getUserGroups);
groupRouter.get("/:groupId", authMiddleware, getGroupById);
groupRouter.put("/:groupId/add-member", authMiddleware, addMember);
groupRouter.put("/:groupId/remove-member", authMiddleware, removeMember);
groupRouter.put("/:groupId/update", authMiddleware, updateGroup);
groupRouter.delete("/:groupId", authMiddleware, deleteGroup);

export default groupRouter;