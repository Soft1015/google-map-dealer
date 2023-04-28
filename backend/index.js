const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const { XMLParser } = require("fast-xml-parser");
const port = process.env.PORT || 3300;
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
// app.use(express.static(path.resolve(__dirname, '../build')));
const getData = async (param) => {
  const parser = new XMLParser();
  var type = [];
  var xmlType = await fetch(`http://rubixgroup.co/smg-api/getTypes.php?brand=${param}`)
    .then((response) => response.text())
    .catch((error) => {
      console.error(error);
    });
  const json = parser.parse(xmlType);
  const result = json?.results?.type;
  if(typeof result == 'string'){
    type.push(result);
  }else{
    type = json?.results?.type;
  }
  var allPromises = [];
  var res = [];
  for (let i = 0; i < type.length; i++) {
      var xml = fetch(
        `http://rubixgroup.co/smg-api/getDealers.php?type=${type[i]}&brand=${param}`
      )
        .then((response) => response.text())
        .then((xmlString) => {
          const jsonMap = parser.parse(xmlString);
          if (jsonMap?.results) {
            jsonMap?.results.result.map((item) => {
              item.type = type[i];
              item.brand = param;
              res.push(item);
            });
          }
        })
        .catch((error) => {
          //   console.error(error);
        });
      allPromises.push(xml);
  }
  await Promise.all(allPromises);

  const obj = {
    type: type,
    mapInfo:res
  }
  return obj;
};


const getBrand = async () => {
  const parser = new XMLParser();
  var brand = ["All Brands"];

  var xmlBrand = await fetch("http://rubixgroup.co/smg-api/getBrands.php")
    .then((response) => response.text())
    .catch((error) => {
      console.error(error);
    });
  const jsonBrand = parser.parse(xmlBrand);
  brand = brand.concat( jsonBrand?.results?.brand );
  return brand;
};

const sendMessage = async (phone, accountNo) => {
  var response = await fetch(`http://rubixgroup.co/smg-api/sendSMS.php?tel=${phone}&dealer=${accountNo}`)
    .catch((error) => {
      console.error(error);
    });
  return {status: response.statusText};
};

app.get("/getBrand", async (req, res, next) => {
  var response = await getBrand();
  res.json(response);
});

app.post("/sendSMS", async (req, res, next) => {
  const response = await sendMessage(req.body.phone, req.body.accountNo);
  res.json(response);
});


app.post("/getType", async (req, res, next) => {
  const response = await getData(req.body.param);
  res.json(response);
});

