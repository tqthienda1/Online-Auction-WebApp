import prisma from "../prismaClient.js";
import { v4 as uuidv4 } from "uuid";

export const getAllComment = async (req, res) => {
  try {
    const allComments = await prisma.comment.findMany();
    return res.status(200).json(allComments);
  } catch (error) {
    console.error("Get all comments failed:", error);
    return res.status(500).json({
      message: "A system error occurred. Please try again later.",
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { userID, productID, content, parentID } = req.body;
    console.log(userID, productID, content, parentID);

    if (!userID || !productID || !content) {
      return res.status(400).json({
        message:
          "Some required information is missing. Please review and complete the form.",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        id: uuidv4(),
        userID,
        productID,
        content,
        parentID,
        createdAt: new Date(),
      },
    });

    return res.sendStatus(201);
  } catch (error) {
    console.error("Create comment failed:", error);
    return res.status(500).json({
      message: "A system error occurred. Please try again later.",
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!id || !content) {
      return res.status(400).json({
        message:
          "Some required information is missing. Please review and complete the form.",
      });
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return res.status(404).json({
        message: "Comment is not exist.",
      });
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    return res.status(200).json({
      message: "Updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Update comment failed:", error);
    return res.status(500).json({
      message: "A system error occurred. Please try again later.",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return (
        res.status(400),
        json({
          message:
            "Some required information is missing. Please review and complete the form.",
        })
      );
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return res.status(404).json({
        message: "Comment is not exist.",
      });
    }

    await prisma.comment.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Deleted successfully.",
    });
  } catch (error) {
    console.error("Delete comment failed:", error);
    return res.status(500).json({
      message: "A system error occurred. Please try again later.",
    });
  }
};
