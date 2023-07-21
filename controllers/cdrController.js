const conf = require("../utils/conf.js");
const csv = require("../utils/csv_writer.js");

module.exports = {
  initialCreditControl: function (req, res) {
    const ccrInitial = req.body["CCR-Initial"];
    const multipleServiceCreditControl =
      req.body["Multiple-Service-Credit-Control"];
    const serviceInformation = req.body["Service-Information"];

    // const message = req.body.message
    res.json();
  },
  createCdr:async function (req, res)  {
    const callDetails=req.body;
    var lowerCaseBody={}
    for(var key in callDetails){
        lowerCaseBody[key.toLowerCase()]=callDetails[key];
    }
   var response= await csv.writeFile(lowerCaseBody);
   res.send(response)
//    return res.send(response);
  },
};

