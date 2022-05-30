const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jsSHA = require('jssha');
const app = express();

app.use(cors());
require('dotenv').config();

app.listen(5000);

// Route + Controller
app.get('/', function(req, res) {
  res.send('123');
})

app.get('/api/operators', async function(req, res) {
  const apiHeader = getAuthorizationHeader();
  const operatorsData =  await getOperators(apiHeader);
  const routesData = await getRoutes(apiHeader);

  let operatorMap = {};
  routesData?.forEach(route => {
    route.Operators.forEach(operator => {
      if(operatorMap[operator.OperatorID] === undefined){
        operatorMap[operator.OperatorID] = [];
      }
      operatorMap[operator.OperatorID].push(route)
    })
  });

  let data = operatorsData?.map(operator => {
    operator.routes = operatorMap[operator.OperatorID];
    return operator;
  })

  if( data === undefined ){
    data = []
  }
  res.send(data);
})


const getAuthorizationHeader = function(){
  const AppID = process.env.APP_ID;
  const AppKey = process.env.APP_KEY;
  const GMTString = new Date().toGMTString();

  const ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);

  const HMAC = ShaObj.getHMAC('B64');
  const Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';

  return { 'Authorization': Authorization, 'X-Date': GMTString };
}

const getOperators= async(headers) => {
  const response = await axios.get('https://ptx.transportdata.tw/MOTC/v2/Bus/Operator/City/Taipei?format=JSON', {
          headers: headers
        }).catch(function (error) {
          console.log(error);
        });
  // const data = await response.json();
  return response?.data;
}

const getRoutes = async(headers) => {
  const response = await axios.get('https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/Taipei?format=JSON', {
    headers: headers
  }).catch(function (error) {
    console.log(error);
  });

  return response?.data;
}