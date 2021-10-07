const {
    v4: uuidv4
} = require('uuid');
const AWS = require('aws-sdk');

const S3 = new AWS.S3({
    accessKeyId: 'AKIATJALXNYWDPCCEMWV',
    secretAccessKey: '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'
})

function uploadFiles(files) {
    if (files.length > 1) {
        upload(files);
        return files;
    } else {
        let myFiles = [files];
        upload(myFiles);
        return myFiles;
    }
}

function upload(files) {
    files.forEach((file) => {
        const params = {
            Bucket: process.env.AWSBUCKETNAME,
            Key: `${uuidv4()}.${file.name}`,
            Body: file.data, //(buffer file)
            ACL: 'public-read'
        }
        S3.upload(params, (error, data) => {
            if (error) {
                return error;
            }
            return data;
        });
    });
}

module.exports = {
    uploadFiles: uploadFiles
};