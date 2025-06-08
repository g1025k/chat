const db = firebase.database();
const chatbox = document.getElementById("chatbox");

firebase.database().ref("messages").on("child_added", function(snapshot) {
  const msg = snapshot.val();
  const div = document.createElement("div");
  div.textContent = msg.name + ": " + msg.text;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
});

function sendMessage() {
  const name = document.getElementById("username").value;
  const text = document.getElementById("message").value;
  if (!name || !text) return;
  firebase.database().ref("messages").push({ name, text });
  document.getElementById("message").value = "";
}
