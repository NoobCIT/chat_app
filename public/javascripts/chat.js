(function() {

  // Get Elements
  var status = document.getElementById("status");
  var messages = document.getElementById("messages");
  var textarea = document.getElementById("textarea");
  var username = document.getElementById("username");
  var clearBtn = document.getElementById("clear");
  var users = document.getElementById("users");
  var userLi = users.getElementsByClassName("users-li");

  // Set default status
  var statusDefault = status.textContent;

  var setStatus = function(s) {
    // Set status
    status.textContent = s;
    if (s !== statusDefault) {
      var delay = setTimeout(function() {
        setStatus(statusDefault); //server sends message sent, make this message go away after 2sec
      }, 2000);
    }
  }

    // Connect to socket.io
    var socket = io.connect("http://localhost:4000");

    // Check for connection
    if (socket !== undefined) {
      console.log("We are connected to socket...");
      // Handle Output - server emitted output, use socket.on to listen for it and catch 'output'
      socket.on("output", function(data) {
        //console.log(data);
        if (data.length) {
          for (let x = 0; x < data.length; x++) {
            //Build out message div
            var message = document.createElement("div");
            message.setAttribute("class", "chat-message");
            message.textContent = data[x].name + ": " + data[x].message;
            messages.appendChild(message);
            messages.insertBefore(message, messages.lastChild.nextSibling);
          }
        }
      });

      //List registered users
      socket.on("listOfUsers", function(data) {
        if (data.length) {
          for (let x = 0; x < data.length; x++) {
            let someUser = document.createElement("li");
            someUser.setAttribute("class", "users-li");
            someUser.setAttribute("data-userid", `${data[x]._id}` )
            someUser.textContent = data[x].firstname + " " + data[x].lastname;
            users.appendChild(someUser);
          }
        }

        for (let i = 0; i < userLi.length; i++) {
          userLi[i].addEventListener("click", function() {
            let current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace("active", "");
            this.className += " active";
            socket.emit("singleChatLog", { id: this.getAttribute("data-userid") })
          });
        }
      });

      // Get status from server (catch the status from server and use on client side)
      socket.on("status", function(data) {
        // get message status
        setStatus((typeof data === 'object') ? data.message : data);

        // If status is clear, clear text
        if (data.clear) {
          textarea.value = '';
        }
      });

      // Handle Input - sending messages by hitting enter
      textarea.addEventListener("keydown", function(event) {
        if (event.which === 13 && event.shiftKey == false) {
          // Emit to server input - send this message to server
          socket.emit("input", {
            name: username.value,
            message: textarea.value
          });
          event.preventDefault();
        }
      })

      // Handle clearing the chat - send clear to server
      clearBtn.addEventListener("click", function() {
        socket.emit("clear");
      });

      // Clear message - client catch cleared from server
      socket.on('cleared', function() {
        messages.textContent = '';
      });
    }
})();
