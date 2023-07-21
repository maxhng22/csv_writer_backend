const csv = require("csv-writer").createObjectCsvWriter;
const conf = require("./conf.js");

var csvWriter;
var header = [];

function initHeader() {
  header = [];
  var configObject = getParameter();
  for (const key in configObject) {
    if(configObject[key]!==undefined&&configObject[key]!=="")
    header.push({ title: key, id: configObject[key].toLowerCase() });
  }
}

async function writeFile(callDetail) {
  const fileName = getOutputFileName(1, ".csv");
  csvWriter = csv({
    path: `${conf.dest_folder}/${fileName}`,
    header: header,
    append: true,
  });

  try {
    await csvWriter.writeRecords([callDetail]);
    console.log("Wrote data to file:", fileName);
    return { errorCode: "000", errorMessage: "success" };
  } catch (error) {
    console.error("Failed to write data:", error);
    return { errorCode: "001", errorMessage: error.toString() };
  }
  // csvWriter
  //   .writeRecords([callDetail])
  //   .then(() => {
  //     console.log("Wrote data to file:", callDetail);
  //     resolve({ errorCode: "000", errorMessage: "success" });
  //   })
  //   .catch((error) => {
  //     console.error("Failed to write data:", error);
  //     reject({ errorCode: "001", errorMessage: error.toString() });
  //   });
}

function getParameter() {
  var result = {};
  try {
    const dynamicParameters = Object.keys(conf);
    dynamicParameters.forEach((parameter) => {
      if (parameter !== undefined && parameter.includes("param")) {
        result[parameter] = conf[parameter];
      }
    });
  } catch (e) {
    console.log(e);
    result = { errorCode: "", errorMessage: e.toString() };
  }

  return result;
}

function getOutputFileName(fileCount, fileType) {
  const now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();

  if (minute >= 30) {
    hour = (hour + 1) % 24;
  }

  return `${conf.file_name}-${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now
    .getDate()
    .toString()
    .padStart(2, "0")}-${hour}-${fileCount}${fileType}`;
}

module.exports = {
  initHeader,
  writeFile,
};
