import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMailTo = async (email, subject, text, html) => {
  const msg = {
    to: email,
    from: "auctionweb03@gmail.com",
    subject: subject,
    text: text,
    html: html,
  };

  try {
    await sgMail.send(msg);
    console.log("Mail sent to:", email);
  } catch (err) {
    console.error("Send mail error:", err);
  }
};
