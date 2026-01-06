import prisma from "../prismaClient.js";
import { supabase } from "../libs/client.js";

export const addDescription = async (productID, productDescription) => {
  if (!productID || !productDescription) {
    throw new Error("Add description failed: Data fields are missing!");
  }

  const product = await prisma.product.findUnique({
    where: { id: productID },
    include: {
      seller: true,
    },
  });

  if (!product) {
    throw new Error("Add description failed: Product not found!");
  }

  const description = await prisma.productDescription.create({
    data: {
      productID,
      productDescription,
    },
  });

  // for (const bid of bidders) {
  //   const bidder = await supabase.auth.admin;
  //   const email = bid.bidder?.email;
  //   if (!email) continue;

  //   await sendMailTo(
  //     email,
  //     `New update for "${product.productName}"`,
  //     `The seller has updated the product description.`,
  //     `
  //       <p>The seller has updated the product description.</p>
  //       <p><b>Product:</b> ${product.productName}</p>
  //       <p>Please check the product page for more details.</p>
  //     `
  //   );
  // }

  return description;
};
