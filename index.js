const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();
const port = 3010;
const dotenv= require('dotenv');

dotenv.config();
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log("Error connecting toDatabase:", err));

  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

 
  if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new User({
          username,
          email,
          password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
      res.status(500).json({ message: 'An error occurred during registration.' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


