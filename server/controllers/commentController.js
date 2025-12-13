import { CommentService } from "../services/comment.service.js";

export const replyComment = async (req, res) => {
  try {
    const { commentID } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    const parentComment = await CommentService.getById(commentID);

    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const reply = await CommentService.create({
      userID: req.user,
      productID: parentComment.productID,
      content: content,
      parentID: parentComment.id,
      createdAt: new Date(),
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
    const { productID } = req.params;
    const { content, parentID } = req.body;

    console.log(productID);

    if (!content) {
      return res.status(400).json({
        message: "Missing userID or content.",
      });
    }

    const product = await CommentService.getProductById(productID);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (parentID) {
      const parentComment = await CommentService.getById(parentID);

      if (!parentComment || parentComment.productID !== Number(productID)) {
        return res.status(400).json({ message: "Invalid parent comment" });
      }
    }

    const comment = await CommentService.create({
      userID: req.user,
      productID: productID,
      content,
      parentID,
      createdAt: new Date(),
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error("Create comment failed:", error);
    return res.status(500).json({ message: "A system error occurred." });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentID } = req.params;
    const { content } = req.body;

    if (!commentID || !content) {
      return res.status(400).json({
        message: "Missing information",
      });
    }

    const existingComment = await CommentService.getById(commentID);
    if (!existingComment) {
      return res.status(404).json({ message: "Comment not exist." });
    }

    await CommentService.update(commentID, { content });

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
    const { commentID } = req.params;

    if (!commentID) {
      return res.status(400).json({ message: "Missing ID" });
    }

    const existingComment = await CommentService.getById(commentID);
    if (!existingComment) {
      return res.status(404).json({ message: "Comment not exist." });
    }

    await CommentService.delete(commentID);

    return res.status(200).json({ message: "Deleted successfully." });
  } catch (error) {
    console.error("Delete comment failed:", error);
    return res.status(500).json({
      message: "A system error occurred. Please try again later.",
    });
  }
};
