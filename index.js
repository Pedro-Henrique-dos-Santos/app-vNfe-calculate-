/*
const fs = require("fs");
const path = require("path");
const xml2js = require('xml2js')
let soma = 0
const folderPath = (__dirname+"/nfe");
console.log(folderPath)
const regex = /\.xml$/i; 

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error("Erro ao ler a pasta:", err);
    return;
  }

  // Filtrar os arquivos pelo final ".xml"
  const xmlFiles = files.filter((file) => regex.test(file));

  // Percorrer os arquivos XML
  xmlFiles.forEach((xmlFile) => {
    const filePath = path.join(folderPath, xmlFile);

    // Ler o conteúdo do arquivo XML
    fs.readFile(filePath, "utf-8", (err, xml) => {
      if (err) {
        console.error("Erro ao ler o arquivo XML:", err);
        return;
      }
      // Fazer o parse do XML com xml2js
      
    xml2js.parseString(xml, (err, results)=>{
         // Acessar e processar as informações desejadas do XML
         const objJson = JSON.stringify(results)
         const objJavascript = JSON.parse(objJson)
         //const vPagContent = objJavascript.nfeProc.NFe;
         const vPag = objJavascript.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vNF[0];
         const total = parseFloat(vPag)
         soma+=total
    })
   
    });

    const somaFormatter = soma.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    console.log(somaFormatter)
    
  });
});*/

const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

const folderPath = path.join(__dirname, "nfe");
const regex = /\.xml$/i;

// Função para ler o conteúdo do arquivo XML
const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, xml) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(xml);
    });
  });
};

// Função para fazer o parse do XML
const parseXML = (xml) => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      const objJson = JSON.stringify(results);
      const objJavascript = JSON.parse(objJson);
      const vPag =
        objJavascript.nfeProc.NFe[0].infNFe[0].total[0].ICMSTot[0].vNF[0];
      const total = parseFloat(vPag);
      resolve(total);
    });
  });
};

// Ler os arquivos da pasta
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error("Erro ao ler a pasta:", err);
    return;
  }

  // Filtrar os arquivos pelo final ".xml"
  const xmlFiles = files.filter((file) => regex.test(file));

  // Cria um array de Promises para cada arquivo XML
  const promises = xmlFiles.map((xmlFile) => {
    const filePath = path.join(folderPath, xmlFile);
    return readFile(filePath).then((xml) => parseXML(xml));
  });

  // Executa todas as Promises e aguarda a conclusão
  Promise.all(promises)
    .then((totals) => {
      const soma = totals.reduce((acc, curr) => acc + curr, 0);
      const somaFormatter = soma.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      console.log(somaFormatter);
    })
    .catch((err) => {
      console.error("Erro ao ler os arquivos XML:", err);
    });
});
