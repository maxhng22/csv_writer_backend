const express = require("express");
const bodyParser = require("body-parser");
const cdr = require("./controllers/cdrController");
const cors = require("cors");
const log = require("./utils/logger.js");
const conf = require("./utils/conf.js");
const csv = require("./utils/csv_writer.js");
const app = express();
const fs = require("fs");
const path = require('path');

const directoryPath = conf.dest_folder;

// Check if the directory exists
if (!fs.existsSync(directoryPath)) {
  // Create the directory
  fs.mkdirSync(directoryPath, { recursive: true });
  console.log("Directory created successfully.");
} else {
  console.log("Directory already exists.");
}



csv.initHeader();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(bodyParser.json());

log.init(
  conf.version,
  conf.log_path,
  conf.log_name,
  conf.log_extension,
  conf.log_size,
  conf.log_transactionIdLength,
  conf.log_moduleIdLength
);



app.use((req, res, next) => {
  var hrTime = process.hrtime();
  req.tid = hrTime[0] * 1000000 + hrTime[1];
  log.logIn(
    req.tid,
    "",
    `${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`
  );

  const defaultWrite = res.write;
  const defaultEnd = res.end;
  const chunks = [];

  res.write = (...restArgs) => {
    defaultWrite.apply(res, restArgs);
    chunks.push(Buffer.from(restArgs[0]));
  };

  res.end = (...restArgs) => {
    defaultEnd.apply(res, restArgs);
    if (restArgs[0] && chunks.length === 0) {
      chunks.push(Buffer.from(restArgs[0]));
    }
    const body = Buffer.concat(chunks).toString("utf8");
    let temp = body || "";
    log.logOut(req.tid, "", `${req.method} ${req.originalUrl} ${temp}`);
  };

  next();
});


app.post("/createCdr", cdr.createCdr);



app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(conf.http_port, () =>
  console.log(`Server started on port ${conf.http_port}`)
);
