const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
   const { name, email, password } = req.body;
   console.log(`Registering user ${name}...`);

   try {
       const user = new User({ name, email, password });
       await user.save();
       res.status(200).json({ message: `Registered user: ${name}` });
   } catch (e) {
       res.status(500).json({ message: `User registration failed: ${e}` })
   }
};

const loginUser = async (req, res) => {
   const { email, password } = req.body;
   const user = await User.findOne({ email });

   if (!user) return res.status(400).json({ message: "There is no account using this email." });

   const isMatch = await user.matchPassword(password);
   if (!isMatch) return res.status(400).json({ message: "Incorrect password." });

   const token = jwt.sign(
       { id: user._id },
       process.env.JWT_SECRET,
       { expiresIn: '1h' }
   );

   res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000
   }).json({message: "Login successful"});
}

module.exports = { registerUser, loginUser };