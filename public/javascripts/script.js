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

//Sign up page error message
const password = document.getElementById("password");
const passwordConfirmation = document.getElementById("passwordConfirmation");
const signup = document.getElementById("signup-button");

function checkPasswords(event) {
  if (password.value !== passwordConfirmation.value) {
    const error = document.getElementById("errorMessage");
    error.innerHTML = "Fill all fields & check matching passwords!";
    error.classList.add("flash-container");
    event.preventDefault();
  }
}

signup.addEventListener("click", checkPasswords);
