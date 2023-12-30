import forge from 'node-forge'

export async function generateRsaKeyPair() {
  const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 })
  const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey)
  const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey)
  localStorage.setItem('userPrivateKey', privateKeyPem)
  return publicKeyPem
}

export async function encryptAesKey(aesKey, rsaUserPublicKey) {
  const publicKey = forge.pki.publicKeyFromPem(rsaUserPublicKey)
  //console.log(publicKey)
  const aesKeyBytes = forge.util.createBuffer(aesKey)
  const encryptedAesKey = publicKey.encrypt(aesKeyBytes.getBytes(), 'RSA-OAEP')
  const encryptedAesKeyBase64 = forge.util.encode64(encryptedAesKey)
  return encryptedAesKeyBase64
}
  
  // decifrar a chave AES usando a chave privada do destinatário
  async function decryptAesKey(encryptedAesKey, privateKey) {
    const keyBuffer = Buffer.from(privateKey, "base64");
    const key = await crypto.subtle.importKey(
      "pkcs8",
      keyBuffer,
      { name: "RSA-OAEP", hash: { name: "SHA-256" } },
      false,
      ["decrypt"]
    );
  
    const decryptedAesKey = await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      key,
      Buffer.from(encryptedAesKey, "base64")
    );
  
    return Buffer.from(decryptedAesKey).toString("base64");
  }
  
  // cifrar uma mensagem usando a chave AES
  async function encryptMessage(message, aesKey) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await crypto.subtle.importKey(
      "raw",
      Buffer.from(aesKey, "base64"),
      { name: "AES-GCM" },
      true,
      ["encrypt"]
    );
  
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(message)
    );
  
    const tag = new Uint8Array(await crypto.subtle.exportKey("raw", key));
  
    return {
      ciphertext: Buffer.from(ciphertext).toString("base64"),
      nonce: Buffer.from(iv).toString("base64"),
      tag: Buffer.from(tag).toString("base64"),
    };
  }
  
  // decifrar uma mensagem usando a chave AES
  async function decryptMessage(nonce, ciphertext, tag, aesKey) {
    const iv = Buffer.from(nonce, "base64");
    const key = await crypto.subtle.importKey(
      "raw",
      Buffer.from(aesKey, "base64"),
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
  
    const decryptedMessage = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, additionalData: new Uint8Array(0), tagLength: 128 },
      key,
      Buffer.from(ciphertext, "base64")
    );
  
    return new TextDecoder().decode(decryptedMessage);
  }

  