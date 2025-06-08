const db = firebase.database();
const chatbox = document.getElementById("chatbox");

function updateSendButtonState() {
  const name = document.getElementById("username").value.trim();
  const text = document.getElementById("message").value.trim();
  document.getElementById("sendBtn").disabled = !(name && text);
}
document.getElementById("username").addEventListener("input", updateSendButtonState);
document.getElementById("message").addEventListener("input", updateSendButtonState);

function sendMessage() {
  const name = document.getElementById("username").value.trim();
  const text = document.getElementById("message").value.trim();
  if (!name || !text) return;

  const timestamp = Date.now();
  db.ref("messages/" + timestamp).set({ from: name, msg: text, time: timestamp });
  document.getElementById("message").value = "";
  updateSendButtonState();
}

function formatTimestamp(ts) {
  const date = new Date(ts);
  return date.toLocaleString(); // 例: "2025/6/8 10:15:23"
}

firebase.database().ref("messages").on("child_added", function(snapshot) {
  const msg = snapshot.val();
  const currentUser = document.getElementById("username").value.trim();
  const div = document.createElement("div");
  div.className = "message" + (msg.from === currentUser ? " own" : "");
  const time = msg.time ? formatTimestamp(msg.time) : "";
  div.innerHTML = `<strong>${msg.from}:</strong><br>${msg.msg}<br><small>${time}</small>`;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
});

function clearMessages() {
  const pw = prompt("管理者パスワードを入力してください:");
  if (pw === "1025") {
    if (confirm("本当に全てのメッセージを削除しますか？")) {
      db.ref("messages").remove();
      chatbox.innerHTML = "";
    }
  } else {
    alert("パスワードが違います。");
  }
}
