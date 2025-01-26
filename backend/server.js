// server.js

require('dotenv').config();  // Loads environment variables from .env file
const express = require('express');
const AWS = require('aws-sdk');

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;  // Default port or use the PORT variable from .env

// AWS SDK Setup (make sure your credentials are in the .env file)
AWS.config.update({
  region: 'us-east-1',  // Set your AWS region here
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Initialize DynamoDB client
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Example route to test backend functionality
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Add more routes for your backend logic (like interacting with DynamoDB)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
