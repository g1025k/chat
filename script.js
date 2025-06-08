const db = firebase.database();
const storage = firebase.storage();
const chatbox = document.getElementById("chatbox");

function sendMessage() {
  const name = document.getElementById("username").value.trim();
  const text = document.getElementById("message").value.trim();
  if (!name || !text) {
    alert("名前とメッセージを入力してください。");
    return;
  }

  const timestamp = Date.now();
  db.ref("messages/" + timestamp).set({ from: name, msg: text });
  document.getElementById("message").value = "";
  updateSendButtonState();
}

firebase.database().ref("messages").on("child_added", function(snapshot) {
  const msg = snapshot.val();
  const currentUser = document.getElementById("username").value.trim();
  const div = document.createElement("div");
  div.className = "message" + (msg.from === currentUser ? " own" : "");
  div.innerHTML = `<strong>${msg.from}:</strong><br>${msg.msg}`;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
});

document.getElementById("media").addEventListener("change", async function(e) {
  const file = e.target.files[0];
  const name = document.getElementById("username").value.trim();
  if (!file || !name) return;

  const timestamp = Date.now();
  const ref = storage.ref("uploads/" + timestamp + "_" + file.name);
  await ref.put(file);
  const url = await ref.getDownloadURL();

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  let msg = "";
  if (isImage) {
    msg = `<img src="${url}">`;
  } else if (isVideo) {
    msg = `<video controls src="${url}"></video>`;
  } else {
    msg = `<a href="${url}" target="_blank">ファイル</a>`;
  }

  db.ref("messages/" + timestamp).set({ from: name, msg });
  document.getElementById("media").value = "";
});

function clearMessages() {
  if (confirm("本当に全てのメッセージを削除しますか？")) {
    db.ref("messages").remove();
    chatbox.innerHTML = "";
  }
}

function updateSendButtonState() {
  const name = document.getElementById("username").value.trim();
  const text = document.getElementById("message").value.trim();
  document.getElementById("sendBtn").disabled = !(name && text);
}

document.getElementById("username").addEventListener("input", updateSendButtonState);
document.getElementById("message").addEventListener("input", updateSendButtonState);
