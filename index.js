const express = require("express");
const app = express();
const path = require("path");
//defined
const rootDir = process.cwd();
const filePath = path.join(rootDir, "nfe/");
const PORT = process.env.PORT || 5000;
//config
const {configUpload, processFiles} = require('./utils/xmlFileHandler')
const upload = configUpload(filePath);

app.post("/", upload.array("xmlFiles", 50),async(req, res) => {
  const xmlFiles = req.files;
  try{
    await processFiles(xmlFiles, filePath)
  }catch(error){
    res.status(500).json({
      message: error
    })
  }
});

app.listen(PORT, () => {
  console.log("server runing at " + PORT);
});
