const express = require('express'); // Neste caso, só para fazer a tratativa de mostrar um arquivo estático.
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server); // WSS (WebSockets over SSL/TLS)

const staticFilesPath = path.join(__dirname, 'public');
app.use(express.static(staticFilesPath));
app.set('views', staticFilesPath);
app.engine('html', require('ejs').renderFile); // Configura views para serem HTML, uma vez que por padrão o Node usa EJS.
app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('index.html');
});

let messages = [];

io.on('connection', (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.emit('previousMessages', messages);

  socket.on('sendMessage', (data) => {
    console.log('Novo evento de mensagem recebido no socket (sendMessage):', data)
    messages.push(data);

    socket.broadcast.emit('receivedMessage', data);
    console.log('Mensagens transmitidas para clients conectados no socket (receivedMessage):', data)
  }); // Mesmo nome do evento enviado pelo frontend deve ser escutado aqui.
});

server.listen(3000);