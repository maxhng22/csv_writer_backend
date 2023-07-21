const fs = require("fs");
const configFilePath = "./conf/app.conf";

const defaultConfig = `
http_host=0.0.0.0
http_port=3000
appName=Kamailio_backend
version=1.0.0
LMD=2023-07-16

project_name=U2systems_kamailio_cdr_csv_file
dest_folder=csv
file_name=kamailio_cdr_csv

log_path=./log
log_name=kamailio_backend
log_extension=.txt
log_size=10
log_transactionIdLength=15
log_moduleIdLength=5

param_CallerIDNumber=CallerIDNumber
param_CalledNumber=CalledNumber
param_SIPCallID=SIPCallID
param_RemoteIPAddress=RemoteIPAddress
param_Direction=Direction
param_CallStartDatetime=CallStartDatetime
param_CallAnswerDatetime=CallAnswerDatetime
param_CallEndDatetime=CallEndDatetime
param_Duration=Duration
param_BillSecond=BillSecond
param_ProgressSecond=ProgressSecond
param_AnswerSecond=AnswerSecond
param_WaitSecond=WaitSecond
param_HangupCause=HangupCause
param_HangupCauseQ850=HangupCauseQ850
param_SipHangupDisposition=SipHangupDisposition
param_UUID=UUID
param_BLegUUID=BLegUUID`;

const directoryPath = "conf";

// Check if the directory exists
if (!fs.existsSync(directoryPath)) {
  // Create the directory
  fs.mkdirSync(directoryPath, { recursive: true });
  console.log("Directory created successfully.");
} else {
  console.log("Directory already exists.");
}


if (!fs.existsSync(configFilePath)) {
  fs.writeFileSync(configFilePath, defaultConfig);
  console.log("app.conf file created with default values.");
} else {
  console.log("app.conf file already exists.");
}


const confString = fs.readFileSync("./conf/app.conf").toString();
var conf = {};

confString
  .replace(/\r/g, "")
  .split("\n")
  .forEach((c, index) => {
    if (c.trim() !== "" && c.trim()[0] !== "#") {
      c = c.trim().split(/=(.+)/);
      if (c[1].trim() === "true" || c[1].trim() === "false") {
        conf[c[0].trim()] = c[1].trim() == "true";
      } else if (/^\d+$/.test(c[1].trim())) {
        conf[c[0].trim()] = parseInt(c[1].trim());
      } else {
        conf[c[0].trim()] = c[1].trim().replace(/"/g, "").toString();
      }
    }
  });

module.exports = conf;
