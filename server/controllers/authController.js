import bcrypt from "bcrypt";

export const signUp = async (req, res) => {
  try {
    const { username, password, email, dob, address } = req.body;

    if (!username || !password || !email || !dob || !address) {
      return res.status(400).json({
        message:
          "Some required information is missing. Please review and complete the form.",
      });
    }

    const duplicate = await User.findOne({ email });

    if (duplicate) {
      return res.status(409).json({
        message:
          "This email address is already associated with an existing account.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      hashedPassword,
      email,
      dob,
      address,
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error("Registration failed", error);
    return res
      .status(500)
      .json({ message: "A system error occurred. Please try again later." });
  }
};
