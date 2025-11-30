const FIREBASE_BASE = 'https://arduino-r4-wifi-default-rtdb.firebaseio.com/';

function updateFirebase(path, value) {
  fetch(`${FIREBASE_BASE}${path}.json`, {
    method: 'PUT',
    body: JSON.stringify(value),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log(`${path} updated to ${value}`);
  })
  .catch(err => console.error(err));
}

// Optional: auto-fetch and show values (if you want live UI updates)
async function fetchFirebase(path) {
  const res = await fetch(`${FIREBASE_BASE}${path}.json`);
  return await res.json();
}
