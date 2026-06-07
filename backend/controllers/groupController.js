import groupModel from "../models/groupModel.js";
import { io } from "../socket/socket.js";

export const createGroup = async (req, res) => {
  try {
    const { groupName, groupImage, members } = req.body;
    const admin = req.user.id;

    if (!groupName) {
      return res.status(400).json({ success: false, message: "Group name is required" });
    }

    const uniqueMembers = [...new Set([...(members || []), admin])];

    const group = await groupModel.create({
      groupName,
      groupImage,
      admin,
      members: uniqueMembers,
    });

    let populatedGroup = await groupModel.findById(group._id).populate("admin", "name email profilePic").populate("members", "name email profilePic isOnline");

    populatedGroup.members.forEach((member) => {
      io.to(member._id.toString()).emit("groupCreated", populatedGroup);
    });

    return res.status(201).json({ success: true, message: "Group created successfully", group: populatedGroup });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });

  }
};


export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await groupModel.find({ members: userId }).populate("admin", "name profilePic").populate("members", "name profilePic").sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, groups });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });

  }
};



export const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await groupModel.findById(groupId).populate("admin", "name email profilePic").populate("members", "name email profilePic isOnline");

    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    return res.status(200).json({ success: true, group });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });

  }
};


export const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const userId = req.user.id;

    if (!memberId) {
      return res.status(400).json({ success: false, message: "memberId required" });
    }

    let group = await groupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    if (group.admin.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Only admin can add members" });
    }

    if (group.members.some((m) => m.toString() === memberId)) {
      return res.status(400).json({ success: false, message: "User already in group" });
    }

    group.members.push(memberId);
    await group.save();

    let updatedGroup = await groupModel.findById(groupId).populate("admin", "name email profilePic").populate("members", "name email profilePic isOnline");

    io.to(memberId).emit("addedToGroup", updatedGroup);

    updatedGroup.members.forEach((member) => {
      io.to(member._id.toString()).emit("groupUpdated", updatedGroup);
    });

    return res.status(200).json({ success: true, message: "Member added successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });

  }
};


export const removeMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const userId = req.user.id;

    let group = await groupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    if (group.admin.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Only admin can remove members" });
    }

    group.members = group.members.filter((m) => m.toString() !== memberId);
    await group.save();

    let updatedGroup = await groupModel.findById(groupId).populate("admin", "name email profilePic").populate("members", "name email profilePic isOnline");

    io.to(memberId).emit("removedFromGroup", {
      groupId, message: "You were removed from group"
    });

    updatedGroup.members.forEach((member) => {
      io.to(member._id.toString()).emit("groupUpdated", updatedGroup);
    });

    return res.status(200).json({ success: true, message: "Member removed successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });

  }
};



export const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { groupName, groupImage } = req.body;
    const userId = req.user.id;

    let group = await groupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    if (group.admin.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Only admin can update group" });
    }

    if (groupName) group.groupName = groupName;
    if (groupImage) group.groupImage = groupImage;
    await group.save();

    let updatedGroup = await groupModel.findById(groupId).populate("admin", "name email profilePic").populate("members", "name email profilePic isOnline");

    updatedGroup.members.forEach((member) => {
      io.to(member._id.toString()).emit("groupUpdated", updatedGroup);
    });

    return res.status(200).json({ success: true, message: "Group updated successfully", group: updatedGroup });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });

  }
};



export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await groupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    if (group.admin.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Only admin can delete group" });
    }

    let members = group.members.map((m) => m.toString());
    await groupModel.findByIdAndDelete(groupId);

    members.forEach((memberId) => {
      io.to(memberId).emit("groupDeleted", groupId);
    });

    return res.status(200).json({ success: true, message: "Group deleted successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });

  }
};



export const getAllGroups = async (req, res) => {
  try {

    const groups = await groupModel.find().sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, groups });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });

  }
};