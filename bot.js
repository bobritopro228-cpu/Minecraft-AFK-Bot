const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// Веб-сервер для прохождения проверки хостинга Render
app.get('/', (req, res) => {
  res.send('Бот успешно работает 24/7!');
});

app.listen(PORT, () => {
  console.log(`🚀 Веб-сервер запущен на порту ${PORT}`);
});

// Основной код бота Mineflayer
const mineflayer = require('mineflayer');
const config = require('./config.json');

const bot = mineflayer.createBot({
  host: config.serverHost,
  port: config.serverPort,
  username: config.botUsername,
  auth: 'offline',
  version: config.version || "1.20.1", // Берёт версию из конфига, либо ставит 1.20.1 по умолчанию
  viewDistance: config.botChunk
});

let movementPhase = 0;
const STEP_INTERVAL = 1500;
const JUMP_DURATION = 500;

bot.on('spawn', () => {
  setTimeout(() => {
    bot.setControlState('sneak', true);
    console.log(`✅ ${config.botUsername} успешно вошёл на сервер и готов!`);
  }, 3000);

  setTimeout(movementCycle, STEP_INTERVAL);
});

function movementCycle() {
  if (!bot.entity) return;

  switch (movementPhase) {
    case 0:
      bot.setControlState('forward', true);
      bot.setControlState('back', false);
      bot.setControlState('jump', false);
      break;
    case 1:
      bot.setControlState('forward', false);
      bot.setControlState('back', true);
      bot.setControlState('jump', false);
      break;
    case 2:
      bot.setControlState('forward', false);
      bot.setControlState('back', false);
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
      }, JUMP_DURATION);
      break;
    case 3:
      bot.setControlState('forward', false);
      bot.setControlState('back', false);
      bot.setControlState('jump', false);
      break;
  }

  movementPhase = (movementPhase + 1) % 4;
  setTimeout(movementCycle, STEP_INTERVAL);
}

bot.on('error', (err) => {
  console.error('⚠️ Ошибка бота:', err);
});

bot.on('end', () => {
  console.log('⛔️ Бот отключился от сервера!');
});

