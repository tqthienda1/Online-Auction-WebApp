import * as watchlistService from "../services/watchlist.service.js";

export const getWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await watchlistService.getWatchlist(userId, page, limit);
    return res.status(200).json({
      data: result.products,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
      message: "Watchlist retrieved successfully",
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
};

export const addToWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const result = await watchlistService.addToWatchlist(userId, productId);
    return res.status(201).json({
      data: result,
      message: "Product added to watchlist successfully",
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    await watchlistService.removeFromWatchlist(userId, productId);
    return res.status(200).json({
      message: "Product removed from watchlist successfully",
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
};

export const checkWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const isLiked = await watchlistService.checkWatchlist(userId, productId);
    return res.status(200).json({
      data: { isLiked },
      message: "Watchlist check completed",
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
};
