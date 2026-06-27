import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveChatHistory, loadChatHistory } from './chat-history.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let messageId = 1;

let chat = {
    users: [],
    history: []
};

const chatHistory = await loadChatHistory();
if (chatHistory) {
    chat = chatHistory;
    messageId = Math.max(...chat.history.map(his => his.id)) + 1;
}

app.post('/join', async (req, res) => {
    const nickname = req.body.nickname;
    chat.users.push(nickname);
    const userJoinMessageId = messageId++;
    chat.history.push({
        id: userJoinMessageId,
        nickname: 'System',
        message: `Welcome ${nickname} to join the chat.`,
        datetime: new Date(),
    });
    await saveChatHistory(chat);
    res.render('chat', { chat, nickname, userJoinMessageId });
});

app.get('/poll', (req, res) => {
    const lastMessageId = Number(req.query.lastMessageId);
    res.status(200).json({
        history: chat.history.filter(his => his.id > lastMessageId)
    });
});

app.get('/nickname-exists', (req, res) => {
    res.status(200).json({
        exists: chat.users.map(u => u.toLowerCase()).includes(req.query.n.toLowerCase())
    });
});

app.post('/send', async (req, res) => {
    const msg = req.body.messageContent;
    const nickname = req.body.nickname;
    console.log(msg, ' ', nickname);
    chat.history.push({
        id: messageId++,
        nickname: nickname,
        message: msg,
        datetime: new Date(),
    });
    await saveChatHistory(chat);
    res.send('OK');
});

const port = process.argv[2] ? Number(process.argv[2]) : 3000;
if (!Number.isInteger(port)) {
    throw new Error('Invalid port number ' + process.argv[2]);
}

app.listen(port, () => {
    console.log('Server is running on http://localhost:'+port);
});