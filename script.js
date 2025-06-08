const db = firebase.database();
const chatbox = document.getElementById("chatbox");

function sendMessage() {
  const name = document.getElementById("username").value.trim();
  const text = document.getElementById("message").value.trim();
  if (!name || !text) return;

  const timestamp = Date.now();
  db.ref("messages/" + timestamp).set({ from: name, msg: text });
  document.getElementById("message").value = "";
}

// 表示更新
firebase.database().ref("messages").on("child_added", function(snapshot) {
  const msg = snapshot.val();
  const currentUser = document.getElementById("username").value.trim();
  const div = document.createElement("div");
  div.className = "message" + (msg.from === currentUser ? " own" : "");
  div.textContent = msg.from + ": " + msg.msg;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
});

// 全メッセージ削除
function clearMessages() {
  if (confirm("本当に全てのメッセージを削除しますか？")) {
    db.ref("messages").remove();
    chatbox.innerHTML = "";
  }
}
