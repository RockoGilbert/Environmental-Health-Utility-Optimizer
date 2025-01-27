require('dotenv').config(); // Load environment variables
const express = require('express');
const { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');  // AWS SDK v3 imports
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 5000; // Default port or use the PORT variable from .env

// AWS SDK v3 Setup
const dynamoDbClient = new DynamoDBClient({
  region: 'us-east-2', // Set your AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// API endpoint to create new health data
app.post('/data', async (req, res) => {
  const { id, name, value, timestamp } = req.body;

  if (!id || !name || !value || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const params = {
    TableName: 'HealthData', // Ensure this matches your DynamoDB table name
    Item: {
      id: { S: id },
      name: { S: name },
      value: { N: value.toString() },
      timestamp: { S: timestamp },
    },
  };

  try {
    await dynamoDbClient.send(new PutItemCommand(params));
    res.status(201).json({ message: 'Data created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating data' });
  }
});

// API endpoint to get health data by ID
app.get('/data/:id', async (req, res) => {
  const params = {
    TableName: 'HealthData', // Ensure this matches your DynamoDB table name
    Key: {
      id: { S: req.params.id },
    },
  };

  try {
    const data = await dynamoDbClient.send(new GetItemCommand(params));
    if (!data.Item) {
      return res.status(404).json({ error: 'Data not found' });
    }
    res.json(data.Item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// API endpoint to update health data by ID
app.put('/data/:id', async (req, res) => {
  const { name, value, timestamp } = req.body;

  if (!name || !value || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const params = {
    TableName: 'HealthData', // Ensure this matches your DynamoDB table name
    Key: {
      id: { S: req.params.id },
    },
    UpdateExpression: 'set #name = :name, #value = :value, #timestamp = :timestamp',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#value': 'value',
      '#timestamp': 'timestamp',
    },
    ExpressionAttributeValues: {
      ':name': { S: name },
      ':value': { N: value.toString() },
      ':timestamp': { S: timestamp },
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const data = await dynamoDbClient.send(new UpdateItemCommand(params));
    res.json(data.Attributes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating data' });
  }
});

// API endpoint to delete health data by ID
app.delete('/data/:id', async (req, res) => {
  const params = {
    TableName: 'HealthData', // Ensure this matches your DynamoDB table name
    Key: {
      id: { S: req.params.id },
    },
  };

  try {
    await dynamoDbClient.send(new DeleteItemCommand(params));
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting data' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
