import express from "express";
const app = express();
import http from "http";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { get2d, get3d, getCoinPrice, getImages, getJoke, getMessages, getMovie, getNews, getPassword, getQuote, getWeather } from "./api.js";
dotenv.config();

const TELEGRAM_BOT_API_KEY = process.env.TELEGRAM_BOT_API_KEY;

//ENV
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

const telegramBot = new TelegramBot(TELEGRAM_BOT_API_KEY, { polling: true });

telegramBot.onText(/\/start/, (msg) => {
  telegramBot.sendMessage(msg.chat.id, `Welcome ${msg.chat.first_name} ${msg.chat.last_name}.\nJust ask anything you want.`);
});

telegramBot.onText(/\/joke/, async (msg) => {
  const joke = await getJoke();
  telegramBot.sendMessage(msg.chat.id, `${joke.setup} \n${joke.delivery}`);
});

telegramBot.onText(/\/quote/, async (msg) => {
  const quote = await getQuote();
  telegramBot.sendMessage(msg.chat.id, `${quote[0].q} \n${quote[0].a}`);
});

telegramBot.onText(/\/2d/, async (msg) => {
  const num = await get2d();
  telegramBot.sendMessage(msg.chat.id, `${num}`);
});

telegramBot.onText(/\/3d/, async (msg) => {
  const num = await get3d();
  telegramBot.sendMessage(msg.chat.id, `${num}`);
});

telegramBot.onText(/\/password_(\w+)/, async (msg, match) => {
  const num = match[1];
  const password = await getPassword(num);
  telegramBot.sendMessage(msg.chat.id, `${password}`);
});

telegramBot.onText(/\/coinprice_(\w+)/, async (msg, match) => {
  const name = match[1];
  const coin = await getCoinPrice(name);
  if (coin) {
    telegramBot.sendMessage(msg.chat.id, `Name: ${coin.Name} \nPrice: ${coin.Price}`);
  } else {
    telegramBot.sendMessage(msg.chat.id, `There is no prices about ${name}.`);
  }
});

telegramBot.onText(/\/news_(\w+)/, async (msg, match) => {
  const search = match[1];
  const news = await getNews(search);
  if (news.articles.length) {
    news.articles.map((a) => telegramBot.sendMessage(msg.chat.id, `${a.title} \n${a.description} \n${a.url}`));
  } else {
    telegramBot.sendMessage(msg.chat.id, `There is no news about ${search}.`);
  }
});

telegramBot.on("message", async (msg) => {
  if (msg.text && msg.text[0] !== "/") {
    const messages = await getMessages(msg.text);
    telegramBot.sendMessage(msg.chat.id, `${messages}`);
  }
  return;
});

telegramBot.onText(/\/quoteimage/, async (msg) => {
  telegramBot.sendPhoto(msg.chat.id, "https://zenquotes.io/api/image");
});

telegramBot.onText(/\/images_(\w+)/, async (msg, match) => {
  const search = match[1];
  const photos = await getImages(search);

  if (photos.length) {
    photos.map((a) => telegramBot.sendPhoto(msg.chat.id, a));
  } else {
    telegramBot.sendMessage(msg.chat.id, `There is no photo about ${search}.`);
  }
});

telegramBot.onText(/\/weather_(\w+)/, async (msg, match) => {
  const search = match[1];
  const data = await getWeather(search);

  if (data) {
    telegramBot.sendMessage(msg.chat.id, `${data.location.name} - ${data.location.country} \nTemperature : ${data.current.temp_c}*C \nWind : ${data.current.wind_mph}mph \nCloud : ${data.current.cloud}% \nHumidity : ${data.current.humidity} `);
  } else {
    telegramBot.sendMessage(msg.chat.id, `There is no info about ${search}.`);
  }
});

telegramBot.onText(/\/movie_(\w+)/, async (msg, match) => {
  const search = match[1];

  const data = await getMovie(search);
  if (data.results) {
    data.results.map((movie) => {
      if (movie.poster_path) {
        telegramBot.sendMessage(msg.chat.id, `Title : ${movie.original_title} \nOverview : ${movie.overview} \nUrl : https://www.themoviedb.org/movie/${movie.id}`);
      }
    });
  } else {
    telegramBot.sendMessage(msg.chat.id, `There is no info about ${search}.`);
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
