const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const AWS = require('aws-sdk');
require('dotenv').config(); // Load the environment variables from .env file

// Set AWS credentials
AWS.config.update({
    accessKeyId: 'ASIA3N3IDT54FPGTOYV7',
    secretAccessKey: 'bPl49b6Ob+C3tpfLAo3aXU1OJ2P70f6rUnyVdcNU',
    sessionToken: 'FwoGZXIvYXdzEEsaDPTOJKhafPlmPqp64CLAAYWsJvUcUbg+7ZJuQLudRlMePH6SQbbFdvYnmPg2BQfMz84j0DxTsSw8Mk8Q3SFX6rhR+gnqt/zWwnNKLQHGtlW/OVw2xv6/KC3kQfxD7/665m3ClEmiufyeUV/4wZngjGArALwmYQZ+XA7KuP6E8Kw7UEqqeBfqTiPmjTeWoo2sal69tw+/WL68zu+9jRE6piS5vxcAZ6KzcmkZCPIDVUOqRcDIlm/r7ReNVTFO9avguO7vc7Xz8oBjRyXXoSPkZCi3h4qkBjIt+6X+7qWLmXBI/5kMC+pxjPus27GUn2fmmkRnIkX0XxOBI2bGTPmBIjjCyqLu'
});

//This code is been refered from an online youtube video link:https://www.youtube.com/watch?v=Yw4rkaTc0f8
// Load the protobuf file
const packageDefinition = protoLoader.loadSync('computeandstorage.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const computeAndStorage = protoDescriptor.computeandstorage;

// Create an AWS S3 client
const s3 = new AWS.S3();

// Implement the gRPC methods
const server = new grpc.Server();

// Start the gRPC server
server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());


//Services created

server.addService(computeAndStorage.EC2Operations.service, {
    StoreData: (call, callback) => {
        const { data } = call.request;
        console.log("This is the data +++++++", data)

        // Generate a unique filename for the S3 object
        const fileName = `shubh11.txt`;

        // Upload the data to S3
        s3.upload({
            Bucket: 'grpcassignment',
            Key: fileName,
            Body: data,
        }, (error, data) => {
            if (error) {
                console.error('Error uploading file to S3:', error);
                callback(error);
            } else {
                console.log('File uploaded to S3:', data.Location);
                const response = {
                    s3uri: data.Location,
                };
                callback(null, response);
            }
        });
    },
    AppendData: (call, callback) => {
        const newdata = call.request.data;
        console.log("This is new data got from client", newdata)
        const fileName = 'shubh11.txt';

        // Retrieve the existing content from S3
        const params = { Bucket: 'grpcassignment', Key: fileName };
        s3.getObject(params, (err, data) => {
            if (err) {
                console.error('Error retrieving file from S3:', err);
                callback(err);
            } else {
                const existingContent = data.Body.toString();
                console.log("This is existing body", existingContent)
                // Append the new data to the existing content
                const updatedContent = existingContent + newdata;
                console.log("This is updated content", updatedContent)

                // Upload the updated content back to S3
                const updatedParams = { Bucket: 'grpcassignment', Key: fileName, Body: updatedContent };
                s3.upload(updatedParams, (err) => {
                    if (err) {
                        console.error('Error appending data to file:', err);
                        callback(err);
                    } else {
                        callback(null, {});
                    }
                });
            }
        });
    },

    DeleteFile: (call, callback) => {
        const s3uri = call.request.s3uri;

        // Get the object's key from the S3 URI
        const key = s3uri.substring(s3uri.lastIndexOf('/') + 1);

        // Delete the object from S3
        s3.deleteObject({ Bucket: 'grpcassignment', Key: key }, (error) => {
            if (error) {
                console.error('Error deleting file from S3:', error);
                callback(error);
            } else {
                console.log('File deleted from S3:', key);
                callback(null, {});
            }
        });
    },
});
server.start();
console.log('gRPC server started on port 50051');


