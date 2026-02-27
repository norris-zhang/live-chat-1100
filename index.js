import express from 'express';
import path from 'path';

const app = express();

app.use(express.static('public'));


app.get('/chat', (req, res) => {
    res.send('Welcome to chat');
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});