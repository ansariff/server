// Import necessary libraries and models
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
const mongoUrl = 'mongodb+srv://ashitasri0405:0405@cluster0.cuf5xns.mongodb.net/your-database?retryWrites=true&w=majority';

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to the database'))
  .catch((error) => console.error('Error connecting to the database:', error.message));

// Import User schema
const UserDetails = require('./models/UserDetails');

// Middleware
app.use(express.json());
app.use(cors());

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Endpoint to handle user login
app.post('/login', async (req, res) => {
  try {
    const { username } = req.body;

    // Check if the user exists in the database
    let user = await UserDetails.findOne({ username });

    if (!user) {
      // If the user does not exist, create a new user in the database
      user = new UserDetails({ username });
      await user.save();
    }

    // Create a JWT token
    const token = jwt.sign({ username }, JWT_SECRET);

    // Return the token to the client
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to handle updating task1 when the user plays the game
app.post('/updateTask1', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const { username } = decodedToken;

    // Fetch the current task1 value for the user
    const user = await UserDetails.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Increment the task1 value by 5
    user.task1 += 2.5;

    // Save the updated user to the database
    await user.save();

    res.json({ message: 'Task1 updated successfully' });
  } catch (error) {
    console.error("Error updating task1:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/updateTask3', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const { username } = decodedToken;

    // Fetch the current task1 value for the user
    const user = await UserDetails.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Increment the task1 value by 5
    user.task3 += 5;

    // Save the updated user to the database
    await user.save();

    res.json({ message: 'Task3 updated successfully' });
  } catch (error) {
    console.error("Error updating task1:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/updateTask2', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const { username } = decodedToken;

    // Fetch the current task1 value for the user
    const user = await UserDetails.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Increment the task1 value by 5
    user.task2 += 4;

    // Save the updated user to the database
    await user.save();

    res.json({ message: 'Task2 updated successfully' });
  } catch (error) {
    console.error("Error updating task1:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// New endpoint for fetching tasks
app.get('/getTasks', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const { username } = decodedToken;

    // Fetch the user details including task information
    const user = await UserDetails.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user's task details
    res.json({
      task1: user.task1,
      task2: user.task2,
      task3: user.task3,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add this endpoint to handle fetching task completion data
app.get('/getTaskCompletionData', async (req, res) => {
  try {
    // Extract the user information from the token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const username = decodedToken.username;

    // Retrieve the user's task completion data from the database
    const user = await UserDetails.findOne({ username });

    if (user) {
      const taskCompletionData = {
        task1: user.task1,
        task2: user.task2,
        task3: user.task3,
      };

      res.json(taskCompletionData);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching task completion data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/dashboard', async (req, res) => {
  try {
    // Fetch all users
    const users = await UserDetails.find();

    // Calculate the total percentage for each task
    const totalPercentage = users.reduce((total, user) => {
      const task1Percentage = user.totalTasksPlayed > 0 ? (user.task1 / user.totalTasksPlayed) * 100 : 0;
      const task2Percentage = user.totalTasksPlayed > 0 ? (user.task2 / user.totalTasksPlayed) * 100 : 0;
      const task3Percentage = user.totalTasksPlayed > 0 ? (user.task3 / user.totalTasksPlayed) * 100 : 0;

      return {
        task1: total.task1 + task1Percentage,
        task2: total.task2 + task2Percentage,
        task3: total.task3 + task3Percentage,
      };
    }, { task1: 0, task2: 0, task3: 0 });

    res.json(totalPercentage);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server Started');
});
