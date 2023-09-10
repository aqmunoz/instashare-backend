const admZip = require('adm-zip');

const compressFileZip = (fileName) => {
    let path = process.env.PATH_FILES;

    try {
        const zip = new admZip();
        let temp = fileName.split('.');
        let planeName = temp.slice(0, (temp.length - 1));
        const outputFile = `${path}/${planeName}.zip`;

        let localFolder = `${path}/${fileName}`;

        zip.addLocalFile(localFolder);
        zip.writeZip(outputFile);

        return `${planeName}.zip`;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    compressFileZip
}