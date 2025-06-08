const db = firebase.database();
const chatbox = document.getElementById("chatbox");

function sendMessage() {
  const name = document.getElementById("username").value.trim();
  const to = document.getElementById("toUser").value.trim();
  const text = document.getElementById("message").value.trim();
  if (!name || !text) return;

  const timestamp = Date.now();
  db.ref("messages/" + timestamp).set({ from: name, to: to, msg: text });
  document.getElementById("message").value = "";
}

// 受信処理
firebase.database().ref("messages").on("child_added", function(snapshot) {
  const msg = snapshot.val();
  const currentUser = document.getElementById("username").value.trim();
  if (!msg.to || msg.to === "" || msg.to === currentUser || msg.from === currentUser) {
    const div = document.createElement("div");
    const toPart = msg.to ? ` → ${msg.to}` : "";
    div.textContent = `${msg.from}${toPart}: ${msg.msg}`;
    chatbox.appendChild(div);
    chatbox.scrollTop = chatbox.scrollHeight;
  }
});
