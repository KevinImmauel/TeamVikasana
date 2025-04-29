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
  const usersData = Array.isArray(req.body) ? req.body : [req.body];
  const createdUsers = [];
  const errors = [];

  for (const userData of usersData) {
    const { email, password, name, role,station_id,phone } = userData;

    try {
      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        errors.push({ email, message: 'User already exists' });
        continue; // Skip this user and continue with the next one
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        email,
        password: hashedPassword,
        name,
        phone,
        role, // Role should be set (e.g., "SHO", "CONSTABLE")
        station_id
      });

      // Save the user to the database
      await newUser.save();

      const userDataToReturn = { id: newUser._id, role: newUser.role };
      const token = await generateJwt.generateToken(userDataToReturn);

      const userResponse = newUser.toObject();
      delete userResponse.password;

      createdUsers.push({ user: userResponse, token });
    } catch (error) {
      console.error(error);
      errors.push({ email, message: 'Error creating user' });
    }
  }

  // If we have any successful user creations, return them
  if (createdUsers.length > 0) {
    return res.status(201).json({ users: createdUsers });
  }

  // If no users were created, return the errors
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Fallback if no data was processed
  res.status(500).json({ message: 'No users processed' });
};
