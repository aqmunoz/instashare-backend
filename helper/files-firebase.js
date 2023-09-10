const admin = require('firebase-admin');
const serviceAccountKey = require('../cert/instashare-72ccf-firebase-adminsdk-fvmqj-fddf9f7858.json');

//initialize the app
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    storageBucket: process.env.STORAGE_BUCKET
});
//get the firebase bucket
let bucket = admin.storage().bucket();

//function to upload file
const uploadFile = async (filePath, fileName) => {

    await bucket.upload(filePath, {
        destination: fileName
    });
}

//get files
const getFilesFirebase = async () => {
    return await admin.storage().bucket().getFiles();
}

/**Download a file */
const downloadFile = async (destFilename, srcFilename) => {
    const options = {
        // The path to which the file should be downloaded, e.g. "./file.txt"
        destination: destFilename,
    };

    // Downloads the file
    await bucket.file(srcFilename).download(options);

}

/**Delete a file from firebase */
async function deleteFileFirebase(fileName) {
    await bucket.file(fileName).delete();
}

/**Get File URL */
function getUrlFileFirebase(fileName) {
    const file = bucket.file(fileName);
    return file.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
    });
}

module.exports = {
    deleteFileFirebase,
    downloadFile,
    getFilesFirebase,
    getUrlFileFirebase,
    uploadFile
}