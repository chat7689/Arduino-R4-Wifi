// ===== CONFIG =====
const FIREBASE_DB_URL = "https://arduino-r4-wifi-default-rtdb.firebaseio.com/lcd/text.json";
// Poll interval (ms) for reading current text
const POLL_MS = 700;
// Debounce pause (smart-live)
const DEBOUNCE_MS = 150;

// ===== UI refs =====
const input = document.getElementById("lcdMessage");
const sendNowBtn = document.getElementById("sendNow");
const statusText = document.getElementById("statusText");
const currentTextBox = document.getElementById("currentText");
const lastUpdatedEl = document.getElementById("lastUpdated");
const vline1 = document.getElementById("vline1");
const vline2 = document.getElementById("vline2");
const deviceIP = document.getElementById("deviceIP");
const onlineDot = document.getElementById("onlineDot");
const onlineText = document.getElementById("onlineText");

// ===== internal state =====
let debounceTimer = null;
let lastSent = null;
let lastFetched = null;

// Trim, pad and split into two 16-char lines for preview
function formatLCD(str) {
  const s = (str || "").substring(0,32);
  const line1 = s.substring(0,16).padEnd(16, " ");
  const line2 = s.substring(16,32).padEnd(16, " ");
  return [line1, line2];
}

function updatePreview(text) {
  const [l1, l2] = formatLCD(text);
  vline1.textContent = l1;
  vline2.textContent = l2;
}

// send to firebase (PUT)
async function sendToFirebase(text) {
  const trimmed = (text||"").substring(0,32);
  if (trimmed === lastSent) {
    statusText.textContent = "No change — not sent";
    return;
  }
  statusText.textContent = "Sending…";
  try {
    const res = await fetch(FIREBASE_DB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trimmed)
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    lastSent = trimmed;
    statusText.textContent = `Sent: "${trimmed}"`;
  } catch (err) {
    console.error("Send error:", err);
    statusText.textContent = "Send error";
  }
}

// Smart debounce handler
input.addEventListener("input", () => {
  updatePreview(input.value);
  statusText.textContent = "Typing…";

  // reset debounce
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    sendToFirebase(input.value);
    debounceTimer = null;
  }, DEBOUNCE_MS);
});

// Force-send button
sendNowBtn.addEventListener("click", () => {
  if (debounceTimer) { clearTimeout(debounceTimer); debounceTimer = null; }
  sendToFirebase(input.value);
});

// Poll Firebase for current text + optionally device IP
async function pollCurrent() {
  try {
    const res = await fetch(FIREBASE_DB_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.json(); // expects a JSON string
    currentTextBox.textContent = text || "";
    updatePreview(text);
    lastFetched = Date.now();
    lastUpdatedEl.textContent = new Date(lastFetched).toLocaleTimeString();
    // assume device IP is embedded? we attempt to fetch /device/ip maybe later
    // For now show online indicator if fetch succeeded recently
    onlineDot.classList.remove("offline");
    onlineDot.classList.add("online");
    onlineText.textContent = "online";
    // set device IP if Firebase has special key (not used now)
  } catch (err) {
    console.error("Fetch error:", err);
    // mark offline if repeated failures
    onlineDot.classList.remove("online");
    onlineDot.classList.add("offline");
    onlineText.textContent = "offline";
    currentTextBox.textContent = "—";
  }
}

// initial load
updatePreview("");
pollCurrent();
setInterval(pollCurrent, POLL_MS);
