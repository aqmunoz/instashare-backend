const { response, request } = require("express");

const { uploadFile, getFilesFirebase, downloadFile, deleteFileFirebase, getUrlFileFirebase } = require("../helper/files-firebase");
const { compressFileZip } = require("../helper/compress-file");
const { deleteFileTemp } = require("../helper/get-files-from-temp");
const { zipFile } = require("../services/zip-files");
const Suscription = require('../models/suscription');

/**Add a file to firebase */
const addFile = (req = request, resp = response) => {
    const { file } = req;

    if (file) {
        try {
            uploadFile(file.path, file.originalname)
                .then(() => {
                    deleteTempFiles([file.path])
                        .then((resp) => {
                            if (resp === false) {
                                return resp.status(500).json({
                                    success: false,
                                    msg: 'Contact with administrator please'
                                });
                            }
                        });

                    zipFile(file.originalname);//Start service job to zip file async way

                    resp.status(200).json({
                        success: true,
                        msg: 'File uploaded'
                    });
                });


        } catch (error) {
            console.log(error);
            return resp.status(500).json({
                success: false,
                msg: 'Contact with administrator please'
            });
        }
    } else {
        return resp.status(400).json({
            success: false,
            msg: 'You must define a file'
        });
    }
}

/**Get a list of files */
const getFiles = (req = request, resp = response) => {
    try {
        getFilesFirebase()
            .then((data) => {
                let files = data[0];
                let filesResponse = [];
                for (const file of files) {
                    let { name, size } = file.metadata;
                    let status = 'zipped';
                    let temp = name.split('.');
                    let extention = temp[temp.length - 1];
                    if (extention != 'zip') {
                        status = 'unzipped';
                    }
                    size = (size / 1024).toFixed(2) * 1;// Transforming to B to KB
                    filesResponse.push({ name, status, size });
                }
                resp.status(200).json({
                    success: true,
                    files: filesResponse
                });
            });

    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            success: false,
            msg: 'Contact with administrator please'
        });
    }
}

/**Compress files to zip */
const compressFile = (destFilename, srcFilename) => {
    let pathDestination = `${process.env.PATH_FILES}/${destFilename}`;

    return downloadFile(pathDestination, srcFilename)
        .then(() => {
            return compressFileZip(destFilename);
        })
        .catch((error) => {
            throw new Error(error);
        });
}

/**Give a new name to a file */
const renameFile = (req = request, resp = response) => {
    const { destFilename, srcFilename } = req.body;

    compressFile(destFilename, srcFilename)
        .then((fileCompressed) => {
            let pathDestination = `${process.env.PATH_FILES}/${fileCompressed}`;


            deleteFileFirebase(srcFilename)//Delete file from firebase, to avoid duplications
                .then(() => {
                    uploadFile(pathDestination, fileCompressed)//Upload the zip file
                        .then(() => {
                            let pathDestinationUnZip = `${process.env.PATH_FILES}/${destFilename}`;

                            deleteTempFiles([pathDestination, pathDestinationUnZip])
                                .then((resp) => {
                                    if (resp === false) {
                                        return resp.status(500).json({
                                            success: false,
                                            msg: 'Contact with administrator please'
                                        });
                                    }
                                });

                            resp.status(200).json({
                                success: true,
                                msg: 'File renamed'
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            return resp.status(500).json({
                                success: false,
                                msg: 'Contact with administrator please'
                            });
                        });
                })
                .catch((error) => {
                    console.log(error);
                    return resp.status(500).json({
                        success: false,
                        msg: 'Contact with administrator please'
                    });
                });

        })
        .catch((error) => {
            console.log(error);
            return resp.status(500).json({
                success: false,
                msg: 'Contact with administrator please'
            });
        });

}

/**Delete temporal files */
const deleteTempFiles = async (files) => {
    deleteFileTemp(files)
        .then(() => {
            console.log('Temp files deleted');
            return true;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });
}

const getFileUrl = (req = request, resp = response) => {
    const { fileName } = req.body;

    getUrlFileFirebase(fileName)
        .then((signedUrls) => {
            return resp.status(200).json({
                success: true,
                url: signedUrls[0]
            });
        })
        .catch((error) => {
            console.log(error);
            return resp.status(500).json({
                success: false,
                msg: 'Contact with administrator please'
            });
        });
}

const addSuscription = async (req = request, resp = response) => {
    const suscriptionRequest = req.body;
    try {
        const suscription = new Suscription(suscriptionRequest);
        await suscription.save();
    
        return resp.status(201).json({
            success: true,
            suscription
        });
        
    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            success: false,
            msg: 'Contact with administrator please'
        });
    }
}

module.exports = {
    addFile,
    getFiles,
    getFileUrl,
    renameFile,
    addSuscription
}