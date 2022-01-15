const socket = io();

const urlSearchParams = new URLSearchParams(window.location.search);
const username = urlSearchParams.get("username");
const room = urlSearchParams.get("selected-room");

console.log(username, room);

const usernameDiv = document.getElementById("username");
usernameDiv.innerHTML = `Olá ${username} - Você está na sala ${room}`;

socket.emit("select-room", { username, room }, (messages) => {
  console.log("Callback from event select-room", messages);
  messages.forEach((message) => createMessage(message));
});

document
  .getElementById("message-input")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const text = event.target.value;

      var message = { text, username, room };

      socket.emit("send-message", message);

      event.target.value = "";
    }
  });

socket.on("send-message", (message) => {
  console.log("[Event send-message]", message);
  createMessage(message);
});

function createMessage(message) {
  const messageDiv = document.getElementById("messages");
  const newMessage = `

<div class="card mt-2 p-2">
  <label class="form-label">
    <strong>${message.username}:</strong
    ><span>
      ${message.text} - ${dayjs(message.createdAt).format("DD/MM HH:mm")}</span>
  </label>
</div>
  `;

  messageDiv.innerHTML += newMessage;
}

document.getElementById("logout").addEventListener("click", (event) => {
  window.location.href = "index.html";
});
