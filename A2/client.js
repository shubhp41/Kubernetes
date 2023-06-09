const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = './computeandstorage.proto';

// Load the protobuf definition
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const { computeandstorage } = grpc.loadPackageDefinition(packageDefinition);

// Create a gRPC client
const client = new computeandstorage.EC2Operations('localhost:50051', grpc.credentials.createInsecure());

// Function to store data in S3
const storeData = (data) => {
    const request = { data };
    client.StoreData(request, (error, response) => {
        if (error) {
            console.error('Error storing data:', error);
        } else {
            console.log('Data stored successfully. S3 URI:', response.s3uri);
            // Call the appendData function after storing data
            // appendData('Appended data');
        }
    });
};

// Function to append data to the file in S3
const appendData = (data) => {
    console.log("This is the data", data)
    const request = { data };
    client.AppendData(request, (error) => {
        if (error) {
            console.error('Error appending data:', error);
        } else {
            console.log('Data appended successfully.');
            // Call the deleteFile function after appending data
            // deleteFile();
        }
    });
};

// Function to delete the file from S3
const deleteFile = () => {
    const s3uri = 'https://grpcassignment.s3.amazonaws.com/shubh11.txt';
    const request = { s3uri };
    client.DeleteFile(request, (error) => {
        if (error) {
            console.error('Error deleting file:', error);
        } else {
            console.log('File deleted successfully.');
        }
    });
};

// Test the gRPC server methods
// storeData('Sample data');
// appendData('Appended data');
deleteFile();

// ??Testing code

// const grpc = require('grpc');
// const protoLoader = require('@grpc/proto-loader');

// // Load the protobuf definition
// const protoFile = 'computeandstorage.proto';
// const protoDefinition = protoLoader.loadSync(protoFile);
// const protoPackage = grpc.loadPackageDefinition(protoDefinition).computeandstorage;

// // Create a gRPC client
// const client = new protoPackage.EC2Operations(
//     'localhost:50051',
//     grpc.credentials.createInsecure()
// );

// // Make requests to the gRPC server
// async function storeData() {
//     const request = {
//         data: 'Data to store locally',
//     };

//     client.storeData(request, (error, response) => {
//         if (error) {
//             console.error('Error storing data:', error);
//         } else {
//             console.log('File stored locally:', JSON.stringify(response));
//         }
//     });
// }
// async function appendData() {
//     const request = {
//         data: 'New data',
//     };

//     const metadata = new grpc.Metadata();
//     metadata.set('s3uri', 'storage\\file.txt');

//     client.appendData(request, metadata, (error, response) => {
//         if (error) {
//             console.error('Error appending data:', error);
//         } else {
//             console.log('Data appended locally', response);
//         }
//     });
// }

// async function deleteFile() {
//     const request = {
//         s3uri: 'storage\\file.txt',
//     };

//     client.deleteFile(request, (error, response) => {
//         if (error) {
//             console.error('Error deleting file:', error);
//         } else {
//             console.log('File deleted locally');
//         }
//     });
// }

// // Call the gRPC methods
// (async () => {
//     await storeData();
//     await appendData();
//     await deleteFile();

// })()
