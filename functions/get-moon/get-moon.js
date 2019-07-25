/* eslint-disable */
const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  try {
    let app_id = process.env.HERE_APP_ID;
    let app_code = process.env.HERE_APP_CODE;

    const response = await fetch(`https://weather.api.here.com/weather/1.0/report.json?app_id=${app_id}&app_code=${app_code}&product=forecast_astronomy&name=Lafayette,LA`, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();

    let results = data.astronomy.astronomy.map(r => {
      return {
        moonRise:r.moonrise,
        moonSet:r.moonset,
        moonPhase:r.moonPhase,
        moonPhaseDesc:r.moonPhaseDesc,
        time:r.utcTime
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ data:results })
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
};
