const fs = require('fs');

const getFiles = () => {
    fs.readdir(process.env.PATH_FILES, (error, result) => {
        if (error) {
            throw new Error(error.message);
        }

        console.log(result);
    });
}

const deleteFileTemp = async (fileNames) => {

    for (const fileTemp of fileNames) {
        if (fs.existsSync(fileTemp)) {
            await fs.unlink(fileTemp, (error) => { 
                if (error) throw error; 
            });
        }
    }

    return true;
}

module.exports = {
    getFiles,
    deleteFileTemp
}