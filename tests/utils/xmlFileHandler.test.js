const assert = require("assert");
const fs = require("fs");
const express = require("express");
const FormData = require("form-data");
const {
  configUpload,
  processFiles,
} = require("../../src/utils/xmlFileHandler");
const path = require("path");

describe("Teste de upload de arquivos", () => {
  const app = express();
  const filePath = path.join(__dirname, "..", "nfe");

  // Configurar o multer
  const upload = configUpload(filePath);
  // Rota de upload
  app.post("/upload", upload.array("files"), async (req, res) => {
    if (!req.files) {
      console.log("Arquivos não foram enviados!");
      res.status(500).send("Arquivos não foram enviados");
      return;
    }
    console.log(req.files);
    try {
      await processFiles(req.files, filePath);
      res.status(200).send("Arquivos processados com sucesso!");
    } catch (err) {
      console.log(err);
      res.status(500).send("Erro ao processar arquivos: " + err);
    }
  });

  // Iniciar o servidor de teste
  const server = app.listen(3000);

  // Após cada teste, remover os arquivos gerados
  afterEach(() => {
    fs.readdir(filePath, (err, files) => {
      if (err) {
        console.error("Erro ao ler diretório de arquivos:", err);
        return;
      }

      for (const file of files) {
        fs.unlink(path.join(filePath, file), (err) => {
          if (err) {
            console.error("Erro ao remover arquivo:", err);
          }
        });
      }
    });
  });

  // Encerrar o servidor após todos os testes
  after(() => {
    server.close();
  });

  it("deve fazer o upload e processar os arquivos XML", function (done) {
    this.timeout(10000);
    // Aqui você pode usar o supertest para simular uma solicitação de upload
    const request = require("supertest");
    const xmlFilePath = path.join(__dirname, "..", "files");
    const xmlDirFiles = fs.readdirSync(xmlFilePath, "utf-8");
    let xmlFiles = [];
    for (const xmlFileName of xmlDirFiles) {
      const currentFile = {
        fieldname: "files",
        originalname: xmlFileName,
        buffer: fs.readFileSync(path.join(xmlFilePath, xmlFileName)),
      };

      xmlFiles.push(currentFile);
    }

    request(app, { http2: false })
      .post("/upload")
      .attach("files", xmlFiles[0].buffer, xmlFiles[0].originalname)
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.log(err);
          done(err);
          return;
        }
        assert.equal(res.text, "Arquivos processados com sucesso!");
        done();
      });
  });
});
