const User = require('../../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/config');
const generateJwt = require('../../util/generateToken')


exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  // const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  let userData = { id: user._id, role: user.role }
  const token = await generateJwt.generateToken(userData)
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  res.json({ token, userWithoutPassword });
};


exports.signup = async (req, res) => {
  const { email, password, name, role } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    email,
    password: hashedPassword,
    name,
    role, // Role should be set (e.g., "SHO", "Constable")
  });

  try {
    // Save the new user
    await newUser.save();
    const userData = { id: newUser._id, role: newUser.role };
    const token = await generateJwt.generateToken(userData);

    const userResponse = newUser.toObject();
    delete userResponse.password;
    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};
