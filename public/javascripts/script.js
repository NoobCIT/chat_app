const send = document.getElementById("send");
const name = document.getElementById("txtName");
const msg = document.getElementById("txtMessage");

//send.addEventListener("click", sendChatMsg);

function sendChatMsg() {
  var chatMessage = {
    name: name.value,
    chat: msg.value
  }
  console.log(chatMessage);
}
