# AWSRekognitionExample

Uses NodeJS to build an example of using AWS Rekognition.

Throws up a basic form upload page on :3000/, and shows some data from Rekognition after uploading.

### To Build the Project

1. Clone the repo
2. npm install to install the requirements
3. Build the awsconfig.json file with your accessKeyId, secretAccessKey, and region
```
echo '{ "accessKeyId": "YOUR_ACCESS_KEY_ID", "secretAccessKey": "YOUR_SECRET_ACCESS_KEY", "region": "us-west-2" }' > awsconfig.json
```
