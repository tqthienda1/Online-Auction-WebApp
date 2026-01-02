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
    const { id } = req.params;
    const userID = req.user.id;
    const { content, parentID } = req.body;

    console.log(req.body);
    console.log(content);

    if (!content) {
      return res.status(400).json({ message: "Content is required." });
    }

    const product = await CommentService.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (parentID) {
      const parentComment = await CommentService.getById(parentID);
      if (!parentComment || parentComment.productID !== id) {
        return res.status(400).json({ message: "Invalid parent comment" });
      }
    }

    const comment = await CommentService.create({
      userID,
      productID: id,
      content,
      parentID,
    });

    return res.status(201).json({ data: comment });
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
