const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", "nfe");

function readdir(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      return resolve(files);
    });
  });
}

function removeFiles() {
  return new Promise(async (resolve, reject) => {
    const files = await readdir(dir);
    for (const file of files) {
      const dirFile = path.join(dir, file)
      fs.unlink(dirFile, (err) => {
        if (err) {
          return reject(err);
        }
        console.log(file + " removida com sucesso!");
      });
    }
    return resolve();
  });
}

module.exports = removeFiles;
