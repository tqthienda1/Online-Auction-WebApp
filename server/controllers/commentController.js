import prisma from "../prismaClient.js";

export const replyComment = async (req, res) => {
  try {
    const { commentID } = req.params;
    const { userID, content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    const parentComment = await prisma.comment.findUnique({
      where: { id: commentID },
    });
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const reply = await prisma.comment.create({
      data: {
        userID,
        productID: parentComment.productID,
        content,
        parentID: parentComment.id,
        createdAt: new Date(),
      },
    });

    return res.status(201).json(reply);
  } catch (error) {
    console.error("Reply comment failed:", error);
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

    const product = await prisma.product.findUnique({
      where: { id: productID },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (parentID) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentID },
      });
      if (!parentComment || parentComment.productID !== productID) {
        return res.status(400).json({ message: "Invalid parent comment" });
      }
    }

    if (content.trim().length === 0) {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    const comment = await prisma.comment.create({
      data: {
        userID,
        productID,
        content,
        parentID,
        createdAt: new Date(),
      },
    });

    return res.status(201).json(comment);
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

    return res.sendStatus(204);
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
