/**This function is executed every time the user add a file to firebase
 * asynchronosly
 */

const webpush = require('web-push');

const { compressFileZip } = require("../helper/compress-file");
const { downloadFile, deleteFileFirebase, uploadFile } = require("../helper/files-firebase");
const { deleteFileTemp } = require("../helper/get-files-from-temp");


const zipFile = (fileName) => {
    let pathDestination = `${process.env.PATH_FILES}/${fileName}`;
    let pathDestinationZip = null;
    let fileCompressedTemp = null;

    downloadFile(pathDestination, fileName, subscriptionPushNotification = null)//Download file from firebase
        .then(() => {
            return compressFileZip(fileName);//Compress file to zip
        })
        .then((fileCompressed) => {
            fileCompressedTemp = fileCompressed;
            return deleteFileFirebase(fileName);//Delete file from firebase, to avoid duplication
        })
        .then(() => {
            pathDestinationZip = `${process.env.PATH_FILES}/${fileCompressedTemp}`;
            return uploadFile(pathDestinationZip, fileCompressedTemp);//Upload file zip to firebase
        })
        .then(() => {
            /**Push notification to client */
            if (subscriptionPushNotification) {
                const payload = JSON.stringify({
                    title: 'Finished Operation',
                    body: `${fileName} zipped successfully`
                });
                webpush.sendNotification(subscriptionPushNotification, payload).catch(console.log);
            }
            /**End push notification */
            return deleteFileTemp([pathDestination, pathDestinationZip]);//Delete temporal files
        })
        .catch((error) => {
            throw new Error(error);
        });
}

module.exports = {
    zipFile
}