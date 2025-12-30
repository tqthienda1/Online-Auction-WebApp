export const useProductPermission = (user, product) => {
  if (!user || !product) {
    return {
      canBid: false,
      canEditDescription: false,
    };
  }

  const isSeller = user.data.role === "SELLER";
  const isOwner = product.seller?.id === user.data.id;

  return {
    canBid: !(isSeller && isOwner), // Nếu là không phải seller hoặc không phải owner thì được quyền bid
    canEditDescription: isSeller && isOwner,
  };
};
