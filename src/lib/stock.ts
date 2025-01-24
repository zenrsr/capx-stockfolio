import axios from "axios";

async function fetchTodayPrice() {
  try {
    const url = "https://query1.finance.yahoo.com/v8/finance/chart/BTC-USD?interval=1d&range=1y";
    const response = await axios.get(url);

    const data = response.data;
    // console.log("Price:", data.chart?.result?.[0]?.meta?.regularMarketPrice);
    console.log(response.data.chart.result[0].indicators.quote[0].close);
  } catch (error) {
    console.error("Error fetching data from Yahoo:", error);
  }
}

fetchTodayPrice();
