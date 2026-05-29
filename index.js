import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let messageId = 1;

const chat = {
    users: [],
    history: []
};

app.post('/join', (req, res) => {
    const nickname = req.body.nickname;
    chat.users.push(nickname);
    const userJoinMessageId = messageId++;
    chat.history.push({
        id: userJoinMessageId,
        nickname: 'System',
        message: `Welcome ${nickname} to join the chat.`,
        datetime: new Date(),
    });
    res.render('chat', { chat, nickname, userJoinMessageId });
});

app.get('/poll', (req, res) => {
    const lastMessageId = Number(req.query.lastMessageId);
    res.status(200).json({
        history: chat.history.filter(his => his.id > lastMessageId)
    });
});

app.post('/send', (req, res) => {
    const msg = req.body.messageContent;
    const nickname = req.body.nickname;
    console.log(msg, ' ', nickname);
    chat.history.push({
        id: messageId++,
        nickname: nickname,
        message: msg,
        datetime: new Date(),
    });
    res.send('OK');
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});