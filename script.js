// ---------- CONFIG ----------
const FIREBASE_BASE = "https://arduino-r4-wifi-default-rtdb.firebaseio.com/";
const PATH_LCD_TEXT = FIREBASE_BASE + "lcd/text.json";
const PATH_LED_GREEN = FIREBASE_BASE + "leds/green.json";
const PATH_LED_RED   = FIREBASE_BASE + "leds/red.json";
const PATH_BTN1      = FIREBASE_BASE + "buttons/b1.json";
const PATH_BTN2      = FIREBASE_BASE + "buttons/b2.json";

// ---------- UI refs ----------
const lcdInput = document.getElementById("lcdInput");
const forceSendBtn = document.getElementById("forceSend");
const lcdStatus = document.getElementById("lcdStatus");

const greenOn = document.getElementById("greenToggle");
const greenOff = document.getElementById("greenToggleOff");
const redOn = document.getElementById("redToggle");
const redOff = document.getElementById("redToggleOff");

const connectSerialBtn = document.getElementById("connectSerial");
const serialStatus = document.getElementById("serialStatus");

const currentLCD = document.getElementById("currentLCD");
const btn1State = document.getElementById("btn1State");
const btn2State = document.getElementById("btn2State");
const ledGreenState = document.getElementById("ledGreenState");
const ledRedState = document.getElementById("ledRedState");

// ---------- WebSerial state ----------
let port = null;
let reader = null;
let writer = null;

// ---------- Debounce LCD typing ----------
let typingTimer = null;
const TYPING_DELAY = 150; // ms

function setLCDStatus(text) { lcdStatus.textContent = "Status: " + text; }

// ---------- Firebase helpers ----------
async function firebasePut(url, value) {
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value)
    });
    return res.ok;
  } catch (e) {
    console.error("Firebase PUT error", e);
    return false;
  }
}

async function firebaseGet(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  } catch (e) {
    console.error("Firebase GET error", e);
    return null;
  }
}

// ---------- LCD input handling ----------
lcdInput.addEventListener("input", () => {
  setLCDStatus("Typing...");
  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    sendLCD(lcdInput.value);
  }, TYPING_DELAY);
});

forceSendBtn.addEventListener("click", () => sendLCD(lcdInput.value));

async function sendLCD(text) {
  setLCDStatus("Sending...");
  await firebasePut(PATH_LCD_TEXT, text.substring(0, 64));
  setLCDStatus("Live");
  setTimeout(()=> setLCDStatus("Idle"), 600);
}

// ---------- LED controls (write to Firebase) ----------
greenOn.addEventListener("click", async () => {
  await firebasePut(PATH_LED_GREEN, 1);
});
greenOff.addEventListener("click", async () => {
  await firebasePut(PATH_LED_GREEN, 0);
});
redOn.addEventListener("click", async () => {
  await firebasePut(PATH_LED_RED, 1);
});
redOff.addEventListener("click", async () => {
  await firebasePut(PATH_LED_RED, 0);
});

// ---------- Poll Firebase for current states (display) ----------
async function pollFirebaseStates() {
  // lcd text
  const lcdText = await firebaseGet(PATH_LCD_TEXT);
  currentLCD.textContent = lcdText ?? "—";

  // leds
  const g = await firebaseGet(PATH_LED_GREEN);
  ledGreenState.textContent = (g === 1 || g === "1") ? "ON" : "OFF";
  const r = await firebaseGet(PATH_LED_RED);
  ledRedState.textContent = (r === 1 || r === "1") ? "ON" : "OFF";
}

// poll every 700ms
setInterval(pollFirebaseStates, 700);
pollFirebaseStates();

// ---------- WebSerial: connect and read Arduino button states ----------
async function connectSerial() {
  if (!("serial" in navigator)) {
    alert("WebSerial not supported in this browser. Use Chrome/Edge.");
    return;
  }

  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    serialStatus.textContent = "connected";
    connectSerialBtn.textContent = "Connected";
    connectSerialBtn.disabled = true;

    writer = port.writable.getWriter();

    // continuously read
    while (port.readable) {
      reader = port.readable.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) {
            const text = new TextDecoder().decode(value);
            handleSerialText(text);
          }
        }
      } catch (e) {
        console.error("Read error:", e);
      } finally {
        reader.releaseLock();
      }
    }

  } catch (err) {
    console.error("Serial connection failed", err);
    serialStatus.textContent = "error";
  }
}

connectSerialBtn.addEventListener("click", connectSerial);

// Parse incoming serial lines from Arduino and update Firebase + UI
// Expected chunk examples: "BTN1:1 BTN2:0\n" or repeating lines
let serialBuffer = "";
function handleSerialText(chunk) {
  serialBuffer += chunk;
  const lines = serialBuffer.split(/\r?\n/);
  // keep last partial
  serialBuffer = lines.pop();

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Attempt to parse "BTN1:1 BTN2:0" style
    const parts = trimmed.split(/\s+/);
    let parsed = {};
    parts.forEach(p => {
      const m = p.match(/BTN([12]):([01])/i);
      if (m) parsed["b"+m[1]] = m[2];
    });

    // If parsed, update UI and Firebase
    if (Object.keys(parsed).length) {
      if (parsed.b1 !== undefined) {
        btn1State.textContent = parsed.b1 === "0" ? "PRESSED" : "RELEASED";
        firebasePut(PATH_BTN1, parsed.b1 === "0" ? 1 : 0); // store 1 when pressed (inverted because using INPUT_PULLUP)
      }
      if (parsed.b2 !== undefined) {
        btn2State.textContent = parsed.b2 === "0" ? "PRESSED" : "RELEASED";
        firebasePut(PATH_BTN2, parsed.b2 === "0" ? 1 : 0);
      }
    } else {
      // if not formatted, just show raw
      console.log("Serial:", trimmed);
    }
  }
}

// ---------- On load: read initial firebase states to set UI ----------
window.addEventListener("load", async () => {
  // set initial lcd input to current DB value
  const initial = await firebaseGet(PATH_LCD_TEXT);
  if (initial) lcdInput.value = initial;
  pollFirebaseStates();
});
