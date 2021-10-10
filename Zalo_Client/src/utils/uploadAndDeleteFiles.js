const AWS = require('aws-sdk');

const S3 = new AWS.S3({
    accessKeyId: 'AKIATJALXNYWDPCCEMWV',
    secretAccessKey: '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'
})

function uploadFiles(files, uuid) {
    if (files.length > 1) {
        upload(files, uuid);
        return files;
    } else {
        let myFiles = [files];
        upload(myFiles, uuid);
        return myFiles;
    }
}

function upload(files, uuid) {
    files.forEach((file) => {
        const params = {
            Bucket: process.env.AWSBUCKETNAME,
            Key: `${uuid}.${file.name}`,
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

function deleteFile(fileName) {
    const params = {
        Bucket: process.env.AWSBUCKETNAME,
        Key: fileName
    }
    S3.deleteObject(params, function (err, data) {
        if (err) console.log(err);
        else data; 
    });
}

module.exports = {
    uploadFiles: uploadFiles,
    deleteFile: deleteFile
};