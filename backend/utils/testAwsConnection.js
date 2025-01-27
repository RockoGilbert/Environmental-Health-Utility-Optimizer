const AWS = require('./awsClient');  // Import the AWS SDK client configuration

const s3 = new AWS.S3();  // Create an S3 client

// Test AWS connection by listing S3 buckets
s3.listBuckets((err, data) => {
  if (err) {
    console.error('Error connecting to AWS:', err);  // Handle errors
  } else {
    console.log('Buckets:', data.Buckets);  // Print the list of S3 buckets if the connection is successful
  }
});
