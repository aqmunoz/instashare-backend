const { Router } = require('express');
const router = Router();

const { addFile, getFiles, renameFile, getFileUrl, addSuscription } = require('../controllers/files');
const { uploader } = require('../helper/files-upload-server');

router.post('/upload_file', [
        uploader.single('file')
    ], 
    addFile
);

router.get('/get_files', 
    getFiles
);

router.post('/rename', 
    renameFile
);

router.post('/file_url', 
    getFileUrl
);

router.post('/suscription', 
    addSuscription
);

module.exports = router;