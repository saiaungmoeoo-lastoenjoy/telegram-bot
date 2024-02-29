import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const getJoke = async () => {
  try {
    const response = await axios.get("https://v2.jokeapi.dev/joke/Any?type=twopart");
    return response.data;
  } catch (error) {
    console.log(error);
    return "No Jokes";
  }
};

export const getQuote = async () => {
  try {
    const response = await axios.get("https://zenquotes.io/api/random");
    return response.data;
  } catch (error) {
    console.log(error);
    return "No Quotes";
  }
};

export const get2d = async () => {
  try {
    const response = await generateRandomNumber(0, 99);
    return response;
  } catch (error) {
    console.log(error);
    return "No Numbers";
  }
};

export const get3d = async () => {
  try {
    const response = await generateRandomNumber(0, 999);
    return response.toString().length === 2 ? response.toString().padStart(3, "0") : response;
  } catch (error) {
    console.log(error);
    return "No Numbers";
  }
};

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getPassword = async (length = 6) => {
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numChars = "0123456789";
  const specialChars = "!@#$%^&*";
  const allChars = lowerCaseChars + upperCaseChars + numChars + specialChars;
  const lowerCasePart = lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];
  const upperCasePart = upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
  const numPart = numChars[Math.floor(Math.random() * numChars.length)];
  const specialPart = specialChars[Math.floor(Math.random() * specialChars.length)];
  const restPartLength = length < 6 ? 2 : length - 4;
  const restPartChars = new Array(restPartLength).fill(null).map(() => allChars.charAt(Math.floor(Math.random() * allChars.length)));
  return lowerCasePart + upperCasePart + numPart + specialPart + restPartChars.join("");
};

export const getCoinPrice = async (coin) => {
  try {
    const response = await axios.get(`https://www.worldcoinindex.com/apiservice/ticker?key=${process.env.CRYPTO_API_KEY}&label=${coin}btc&fiat=usdt`);
    return response.data.Markets[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getNews = async (search) => {
  try {
    let url = "https://newsapi.org/v2/top-headlines?" + `country=us&` + `pageSize=3&` + `page=1&` + `apiKey=${process.env.NEWS_API_KEY}`;

    if (search.length > 0) url = "https://newsapi.org/v2/everything?" + `q=${search}&` + `language=en&` + `pageSize=3&` + `page=1&` + `apiKey=${process.env.NEWS_API_KEY}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
    return "No More News";
  }
};
