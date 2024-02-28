import express from "express";
const app = express();
import http from "http";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { get2d, get3d, getJoke, getNews, getQuote } from "./api.js";
dotenv.config();

const TELEGRAM_BOT_API_KEY = process.env.TELEGRAM_BOT_API_KEY;

//ENV
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

const telegramBot = new TelegramBot(TELEGRAM_BOT_API_KEY, { polling: true });

telegramBot.onText(/\/start/, (msg) => {
  telegramBot.sendMessage(msg.chat.id, `Welcome ${msg.chat.first_name}.`);
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

telegramBot.onText(/\/news_(\w+)/, async (msg, match) => {
  const search = match[1];
  const news = await getNews(search);
  if (news.articles.length) {
    news.articles.map((a) => telegramBot.sendMessage(msg.chat.id, `${a.title} \n${a.description} \n${a.url}`));
  } else {
    telegramBot.sendMessage(msg.chat.id, `There is no news about ${search}.`);
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
