const fs = require("fs");
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

function generateUniqueCode() {
  const timestamp = new Date().getTime().toString();
  const randomBytes = crypto.randomBytes(4).toString("hex");
  return timestamp + randomBytes;
}

function configUpload(filePath){
 return multer({
    dest: filePath,
    fileFilter: (req, file, cb) => {
      if (path.extname(file.originalname) !== ".xml") {
        return cb(new Error("somente arquivos xml são permitidos!"), false);
      }
      cb(null, true);
    },
  });
}

function processFiles(xmlFiles, filePath) {
  return new Promise((resolve, reject) => {
    for (const xmlFile of xmlFiles) {
      const uniqueCode = generateUniqueCode();
      const newFileName = uniqueCode + '_' + xmlFile.originalname;
      const newFilePath = path.join(filePath, newFileName) 
      fs.rename(xmlFile.path,newFilePath, (error) => {
        if (error) {
          return reject(error);
        }
      });
    }
    resolve()
  });
}

module.exports = {configUpload, processFiles}
