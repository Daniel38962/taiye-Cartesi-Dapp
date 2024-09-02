const { hexToString, stringToHex } = require("viem");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;

const exchangeRates = {
  "ETH-USD": 2000,
  "BTC-USD": 30000,
  "ETH-BTC": 0.067,
  "USD-EUR": 0.93,
  "EUR-USD": 1.075,
  "USD-GBP": 0.77,
  "GBP-USD": 1.30,
  "USD-JPY": 145.00,
  "JPY-USD": 0.0069,
  "USD-CAD": 1.36,
  "CAD-USD": 0.74,
  "BTC-EUR": 18700,
  "ETH-GBP": 1540,
  "BTC-GBP": 23100,
  "ETH-JPY": 290000,
  "BTC-JPY": 4350000,
  "ETH-CAD": 2700,
  "BTC-CAD": 41000,
  "XRP-USD": 0.50,
  "XRP-EUR": 0.46,
  "XRP-JPY": 74.00,
  "XRP-GBP": 0.38,
  "XRP-CAD": 0.68,
};

function convertCurrency(amount, fromCurrency, toCurrency) {
  const pair = `${fromCurrency}-${toCurrency}`;
  const reversePair = `${toCurrency}-${fromCurrency}`;

  let rate;
  if (exchangeRates[pair]) {
    rate = exchangeRates[pair];
  } else if (exchangeRates[reversePair]) {
    rate = 1 / exchangeRates[reversePair];
  } else {
    throw new Error("Unsupported currency pair");
  }

  const convertedAmount = amount * rate;
  console.log(`Converted ${amount} ${fromCurrency} to ${convertedAmount.toFixed(2)} ${toCurrency}`);
  return convertedAmount;
}

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  const payloadString = hexToString(data.payload);
  console.log(`Converted payload: ${payloadString}`);

  try {
    const payload = JSON.parse(payloadString);
    console.log(payload.amount, payload.fromCurrency, payload.toCurrency);

    const output = convertCurrency(
      payload.amount,
      payload.fromCurrency,
      payload.toCurrency
    );

    const outputStr = stringToHex(output.toString());

    await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: outputStr }),
    });
  } catch (error) {
    console.error("Error processing request:", error);
  }
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();