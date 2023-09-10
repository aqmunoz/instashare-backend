/**This is the configuration of multer 
 * it is used to upload files to a temporal folder
 */

const multer = require('multer');

const configUploadDir = multer.diskStorage({
    destination: (req, file, callBak) => {
        callBak(null, process.env.PATH_FILES);
    },
    filename: (req, file, callBak) => {
        callBak(null, file.originalname);
    }
});

const uploader = multer({storage: configUploadDir});


module.exports = {
    uploader
}