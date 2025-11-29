// Firebase Realtime Database URL
const FIREBASE_DB_URL = "https://arduino-r4-wifi-default-rtdb.firebaseio.com/lcd/text.json";

const sendBtn = document.getElementById("sendBtn");
const lcdInput = document.getElementById("lcdMessage");
const statusEl = document.getElementById("status");

sendBtn.addEventListener("click", async () => {
  const text = lcdInput.value || "";
  const trimmed = text.substring(0, 32); // limit to 32 chars

  statusEl.textContent = "Sending...";

  try {
    const response = await fetch(FIREBASE_DB_URL, {
      method: "PUT",  // replaces the value at /lcd/text
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trimmed)
    });

    if (!response.ok) throw new Error("HTTP " + response.status);

    statusEl.textContent = `Sent: "${trimmed}"`;
    console.log("Sent to LCD:", trimmed);
  } catch (err) {
    statusEl.textContent = "Error sending message!";
    console.error(err);
  }
});
