const express = require("express");
const app = express();
const path = require("path");
//defined
const filePath = path.join(__dirname, "src/nfe/");
const readdir = require('./src/handlerFiles/readerXml')
const removeFiles = require('./src/handlerFiles/clearXml')
//config
const { configUpload, processFiles } = require("./src/utils/xmlFileHandler");
const upload = configUpload(filePath);


app.post("/", upload.array("xmlFiles", 50), async (req, res) => {
  const xmlFiles = req.files;
  try {
    await processFiles(xmlFiles, filePath);
    const total = await readdir();
    await removeFiles()
    res.status(200).json({
      message: total,
    });
    return 

  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

module.exports = app
