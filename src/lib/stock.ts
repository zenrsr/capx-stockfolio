import axios from "axios";

async function fetchTodayPrice() {
  try {
    const url = `https://api.binance.com/api/v3/ticker/price`;
    const response = await axios.get(url, {
      params: {
        symbol: "ETHUSDT",
      },
    });

    const data = response.data;
    console.log("Price:", data.price);
  } catch (error) {
    console.error("Error fetching data from Binance:", error);
  }
}

fetchTodayPrice();
