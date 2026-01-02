import prisma from "../prismaClient.js";
import { supabase } from "../libs/client.js";
import { generateMagicLink } from "./supabase.service.js";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const CommentService = {
  async getById(id) {
    return await prisma.comment.findUnique({
      where: { id: id },
    });
  },

  async create(data) {
    const { userID, productID, content, parentID } = data;

    const comment = await prisma.comment.create({
      data: { userID, productID, content, parentID },
      include: { user: { select: { username: true } } },
    });

    if (!parentID) {
      const product = await prisma.product.findUnique({
        where: { id: productID },
        include: { seller: true },
      });

      if (!product?.seller?.supabaseId) {
        throw new Error("Cannot find seller supabaseId");
      }

      const { data: userData, error } = await supabase.auth.admin.getUserById(
        product.seller.supabaseId
      );
      if (error || !userData?.user?.email) {
        throw new Error("Cannot find seller email");
      }

      const sellerEmail = userData.user.email;

      const magicLink = await generateMagicLink(sellerEmail, productID);

      const msg = {
        to: sellerEmail,
        from: "auctionweb03@gmail.com",
        subject: `New comment on your product "${product.productName}"`,
        text: `${comment.user.username}: "${content}" on "${product.productName}". See detail here: ${magicLink}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #facc15;">You have new comment on your product.</h2>
            <p><strong>${comment.user.username}</strong> has commented:</p>
            <blockquote style="background: #f5f5f5; padding: 10px 15px; border-left: 4px solid #facc15;">
              ${content}
            </blockquote>
            <p>On: <strong>${product.productName}</strong></p>
            <a href="${magicLink}" 
              style="
                display: inline-block; 
                padding: 10px 20px; 
                background-color: #facc15; 
                color: white; 
                text-decoration: none; 
                border-radius: 5px; 
                margin-top: 10px;
                font-weight: 600;
              ">
              See detail
            </a>
          </div>
        `,
      };

      try {
        await sgMail.send(msg);
        console.log("Mail sent to seller:", sellerEmail);
      } catch (err) {
        console.error("Send mail error:", err);
      }
    }

    return comment;
  },

  async update(id, data) {
    return await prisma.comment.update({
      where: { id: id },
      data,
    });
  },

  async delete(id) {
    return await prisma.comment.delete({
      where: { id: id },
    });
  },

  async getProductById(productId) {
    return await prisma.product.findUnique({
      where: { id: productId },
    });
  },
};
