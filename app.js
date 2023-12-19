 //  const socket = io("https://basic-chat-back-end-production.up.railway.app/");
 const socket = io("ws://localhost:8000");

 const msgInput = document.querySelector("#message");
 const nameInput = document.querySelector("#name");
 const chatRoom = document.querySelector("#room");
 const activity = document.querySelector(".activity");
 const usersList = document.querySelector(".user-list");
 const roomList = document.querySelector(".room-list");
 const chatDisplay = document.querySelector(".chat-display");
 
 function sendMessage(e) {
   e.preventDefault();
   if (nameInput.value && msgInput.value && chatRoom.value) {
     socket.emit("message", {
       name: nameInput.value,
       text: msgInput.value,
     });
     msgInput.value = "";
   }
   msgInput.focus();
 }

//  new code
  function uploadFile(){
   const fileInput = document.getElementById('file')
   const file = fileInput.files[0];

   if (file){
    const reader = new FileReader ();
    reader.onload =(e)=>{
      const fileData = e.target.result;
      socket.emit('file', {
        name : nameInput.value,
        room : chatRoom.value,
        fileData : fileData,
        fileName : file.name,
       });
      };

      reader.readAsDataURL(file);
      fileInput.value ='';
   }
  }

  // new code ends here

  
 function enterRoom(e) {
   e.preventDefault();
   if (nameInput.value && chatRoom.value) {
     socket.emit("enterRoom", {
       name: nameInput.value,
       room: chatRoom.value,
     });
   }
 }
 
 document.querySelector(".form-msg").addEventListener("submit", sendMessage);
 
 document.querySelector(".form-join").addEventListener("submit", enterRoom);
 
 msgInput.addEventListener("keypress", () => {
   socket.emit("activity", nameInput.value);
 });
 
 // Listen for messages
 socket.on("message", (data) => {
   activity.textContent = "";
   const { name, text, time } = data;
 
   // Format date to local time
   let options = {
     // year: "numeric",
     // month: "long",
     // day: "numeric",
     hour: "2-digit",
     minute: "2-digit",
     // second: "2-digit",
   };
   const formattedTimeString = new Date(time).toLocaleDateString("en-US", options);
 
   const li = document.createElement("li");
   li.className = "post";
   if (name === nameInput.value) li.className = "post post--left";
   if (name !== nameInput.value && name !== "Admin")
     li.className = "post post--right";
   if (name !== "Admin") {
     li.innerHTML = `<div class="post__header ${
       name === nameInput.value ? "post__header--user" : "post__header--reply"
     }">
         <span class="post__header--name">${name}</span> 
         <span class="post__header--time">${formattedTimeString}</span> 
         </div>
         <div class="post__text">${text}</div>`;
   } else {
     li.innerHTML = `<div class="post__text">${text}</div>`;
   }
   document.querySelector(".chat-display").appendChild(li);
 
   chatDisplay.scrollTop = chatDisplay.scrollHeight;
 });
 
 let activityTimer;
 socket.on("activity", (name) => {
   activity.textContent = `${name} is typing...`;
 
   // Clear after 3 seconds
   clearTimeout(activityTimer);
   activityTimer = setTimeout(() => {
     activity.textContent = "";
   }, 3000);
 });
 
 socket.on("userList", ({ users }) => {
   showUsers(users);
 });
 
 socket.on("roomList", ({ rooms }) => {
   showRooms(rooms);
 });
 
 function showUsers(users) {
   usersList.textContent = "";
   if (users) {
     usersList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`;
     users.forEach((user, i) => {
       usersList.textContent += ` ${user.name}`;
       if (users.length > 1 && i !== users.length - 1) {
         usersList.textContent += ",";
       }
     });
   }
 }
 
 function showRooms(rooms) {
   roomList.textContent = "";
   if (rooms) {
     roomList.innerHTML = "<em>Active Rooms:</em>";
     rooms.forEach((room, i) => {
       roomList.textContent += ` ${room}`;
       if (rooms.length > 1 && i !== rooms.length - 1) {
         roomList.textContent += ",";
       }
     });
   }
 }
 
 
  
 // run process
 
 //Clone the repository to your local machine.
 // Navigate to the project directory.
 // Run npm install to install the required dependencies.
 // Running the Server
 // In the project directory, run npm start.
 //  The server will start and listen on the port defined in the environment variable PORT or default to 8000.//     where to change the javascript provide by you on above