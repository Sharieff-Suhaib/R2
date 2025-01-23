const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const fs = require('fs');
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region : "auto",
    signatureVersion: 'v4',
    endpoint: process.env.AWS_ENDPOINT
});
module.exports = {
    uploadToR2 : async (filePath,fileName) => {
        console.log(filePath);
        console.log(fileName);
        const fileStats = fs.statSync(filePath);
        if(fileStats.size < 52428888){
            const file = fs.readFileSync(filePath);
            const params = {
                Bucket : "fileupload",
                Key : fileName,
                Body : file,
            };
            s3.putObject(params ,(err,data) => {
                if(err) throw err;
                console.log(`File uploaded successfully. ${data}`);
            });
        } else {
            const params = {
                Bucket : "fileupload",
                Key : fileName,
                Body : fs.createReadStream(filePath),
            };
            const data = await s3.upload(params).promise();
            console.log(`File uploaded successfully. ${data}`);
        }
}}