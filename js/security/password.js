export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const salt = crypto.getRandomValues(new Uint8Array(16));

  const key = await crypto.subtle.importKey(
    "raw",
    data,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 310000,
      hash: "SHA-256"
    },
    key,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const hashBuffer = await crypto.subtle.exportKey("raw", derivedKey);

  return {
    salt: bufferToHex(salt),
    hash: bufferToHex(new Uint8Array(hashBuffer))
  };
}

export async function verifyPassword(password, saltHex, storedHashHex) {
  const salt = hexToBuffer(saltHex);
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const key = await crypto.subtle.importKey(
    "raw",
    data,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 310000,
      hash: "SHA-256"
    },
    key,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const hashBuffer = await crypto.subtle.exportKey("raw", derivedKey);
  const computedHashHex = bufferToHex(new Uint8Array(hashBuffer));

  return storedHashHex === computedHashHex;
}

function bufferToHex(buffer) {
  return [...buffer].map(b => b.toString(16).padStart(2, "0")).join("");
}

function hexToBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}
