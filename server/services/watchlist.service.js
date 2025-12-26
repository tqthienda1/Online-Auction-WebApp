import prisma from '../prismaClient.js';

export const getWatchlist = async (userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.watchList.findMany({
        where: { userID: userId },
        skip,
        take: limit,
        include: {
          product: {
            select: {
              id: true,
              productName: true,
              productAvt: true,
              categoryID: true,
              startingPrice: true,
              currentPrice: true,
              buyNowPrice: true,
              startTime: true,
              endTime: true,
              sold: true,
              sellerID: true,
              highestBidderID: true,
            }
          }
        },
        orderBy: {
            createdAt: 'desc'
        }
      }),
      prisma.watchList.count({ where: { userID: userId } })
    ]);

    return {
      products: products.map(item => ({
        ...item.product,
        addedToWatchlistAt: item.createdAt
      })),
      total
    };
  } catch (error) {
    throw {
      status: 500,
      message: error.message || 'Failed to fetch watchlist'
    };
  }
};

export const addToWatchlist = async (userId, productId) => {
  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw {
        status: 404,
        message: 'Product not found'
      };
    }

    // Check if already in watchlist
    const existingEntry = await prisma.watchList.findUnique({
      where: {
        userID_productID: {
          userID: userId,
          productID: productId
        }
      }
    });

    if (existingEntry) {
      throw {
        status: 409,
        message: 'Product is already in your watchlist'
      };
    }

    // Add to watchlist
    const watchlistEntry = await prisma.watchList.create({
      data: {
        userID: userId,
        productID: productId
      },
      include: {
        product: {
          select: {
            id: true,
            productName: true,
            productAvt: true,
            categoryID: true,
            startingPrice: true,
            currentPrice: true,
            buyNowPrice: true,
            startTime: true,
            endTime: true,
            sold: true
          }
        }
      }
    });

    return watchlistEntry;
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw {
      status: 500,
      message: error.message || 'Failed to add product to watchlist'
    };
  }
};

export const removeFromWatchlist = async (userId, productId) => {
  try {
    // Check if entry exists
    const existingEntry = await prisma.watchList.findUnique({
      where: {
        userID_productID: {
          userID: userId,
          productID: productId
        }
      }
    });

    if (!existingEntry) {
      throw {
        status: 404,
        message: 'Product not found in your watchlist'
      };
    }

    // Remove from watchlist
    await prisma.watchList.delete({
      where: {
        userID_productID: {
          userID: userId,
          productID: productId
        }
      }
    });

    return true;
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw {
      status: 500,
      message: error.message || 'Failed to remove product from watchlist'
    };
  }
};

export const checkWatchlist = async (userId, productId) => {
  try {
    const entry = await prisma.watchList.findUnique({
      where: {
        userID_productID: {
          userID: userId,
          productID: productId
        }
      }
    });

    return !!entry; // Return true if exists, false otherwise
  } catch (error) {
    throw {
      status: 500,
      message: error.message || 'Failed to check watchlist'
    };
  }
};
