export const useProductPermission = (user, product) => {
  if (!user || !product) {
    return {
      canBid: false,
      canEditDescription: false,
      canBanBidder: false,
    };
  }

  const isSeller = user.data.role === "SELLER";
  const isOwner = product.seller?.id === user.data.id;
  const isAuctionEnded = product.sold;

  return {
    canBid: !(isSeller && isOwner) && !isAuctionEnded,
    canEditDescription: isSeller && isOwner,
    canBanBidder: isSeller && isOwner && !isAuctionEnded,
  };
};
