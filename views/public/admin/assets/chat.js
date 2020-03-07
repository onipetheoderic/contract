const socket = io();
const log = console.log;

// const form = document.querySelector("#chatForm");
// const ul = document.querySelector("#messages");
const annUl = document.querySelector("#announcement");
const welcomeTextTag = document.querySelector("#welcomeText");
const welcomeTextTag2 = document.querySelector("#welcomeText2");

socket.on("new user", welcomeText => {
  welcomeTextTag.textContent = welcomeText;
});

// form.addEventListener("submit", e => {
//   const input = document.querySelector("#m");
//   const message = e.target.elements.chatMessage.value;
//   socket.emit("chat message", message);

//   input.value = "";

//   e.preventDefault();
// });

// socket.on("chat message", msg => {
//   // Receiving the message and displaying on the screen
//   const list = document.createElement("li");
//   const text = document.createTextNode(msg);
//   list.appendChild(text);

//   ul.appendChild(list);
// });

socket.on("announcement", announcedInfo => {
  // console.log(announcedInfo)
  // // Receiving the announcement and displaying on the screen
  // const list = document.createElement("li");
  // const text = document.createTextNode(announcedInfo);
  // list.appendChild(text);

  // annUl.appendChild(list);
  welcomeTextTag.textContent = announcedInfo;
});
socket.on("unique_count", announcedInfo2 => {
  console.log(announcedInfo2)
  // // Receiving the announcement and displaying on the screen
  // const list = document.createElement("li");
  // const text = document.createTextNode(announcedInfo);
  // list.appendChild(text);

  // annUl.appendChild(list);
  welcomeTextTag2.textContent = announcedInfo2;
});