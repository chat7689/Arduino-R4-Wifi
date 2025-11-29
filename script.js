document.addEventListener("DOMContentLoaded", () => {
  const FIREBASE_URL = "https://arduino-r4-wifi-default-rtdb.firebaseio.com/lcd/text.json";

  const input = document.getElementById("textInput");
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");
  const currentLCDText = document.getElementById("currentLCDText");

  let typingTimer;
  const TYPING_DELAY = 150; // Live update delay

  function updateStatus(color, text) {
    statusDot.style.background = color;
    statusText.textContent = text;
  }

  function sendToFirebase(text) {
    updateStatus("#2a84ff", "Sending...");

    fetch(FIREBASE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(text)
    })
    .then(r => r.text())
    .then(() => {
      updateStatus("#2ecc71", "Live");
      setTimeout(() => updateStatus("#2a84ff", "Idle"), 400);
    })
    .catch(() => {
      updateStatus("#e74c3c", "Error");
    });
  }

  input.addEventListener("input", () => {
    updateStatus("#f1c40f", "Typing...");
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      sendToFirebase(input.value);
    }, TYPING_DELAY);
  });

  // Poll Firebase every 500ms to update current LCD text live
  async function updateCurrentText() {
    try {
      const response = await fetch(FIREBASE_URL);
      if (!response.ok) throw new Error("HTTP " + response.status);
      const text = await response.json();
      currentLCDText.textContent = text || "";
    } catch(err) {
      currentLCDText.textContent = "Error loading text";
      console.error(err);
    }
  }

  setInterval(updateCurrentText, 500);
  updateCurrentText();
});
