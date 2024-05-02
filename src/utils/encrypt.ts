import _sha512 from 'crypto-js/sha512.js';
import _md5 from 'crypto-js/md5.js';
import CryptoJS from 'crypto-js';

const sha512 = (str: string) => _sha512(str).toString();

const md5 = (str: string) => _md5(str).toString();

const cbc_encrypt = (
  content: string,
  key: string,
  iv: string = '',
  hex = false
) => {
  content = CryptoJS.enc.Utf8.parse(content);
  key = CryptoJS.enc.Utf8.parse(md5(key));
  iv = CryptoJS.enc.Utf8.parse((iv && md5(iv)) || md5(key));
  const encrypted = CryptoJS.AES.encrypt(content, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  if (hex) return encrypted.ciphertext.toString();
  return encrypted.toString();
};

const cbc_decrypt = (encrypted: string, key: string, iv = '', hex = false) => {
  if (hex)
    encrypted = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Hex.parse(encrypted)
    );
  key = CryptoJS.enc.Utf8.parse(md5(key));
  iv = CryptoJS.enc.Utf8.parse((iv && md5(iv)) || md5(key));
  const content = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
  return content;
};

const generate_rsa_key_pair = async () => {
  let { privateKey, publicKey } = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );
  publicKey = btoa(
    JSON.stringify(await crypto.subtle.exportKey('jwk', publicKey))
  );
  privateKey = btoa(
    JSON.stringify(await crypto.subtle.exportKey('jwk', privateKey))
  );
  return { publicKey, privateKey };
};

const import_key = async (key, usage) => {
  key = JSON.parse(atob(key));
  return window.crypto.subtle.importKey(
    'jwk',
    key,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    [usage]
  );
};

const rsa_encrypt = async (content: string, publicKey) => {
  if (typeof publicKey === 'string')
    publicKey = await import_key(publicKey, 'encrypt');
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    publicKey,
    new TextEncoder().encode(content)
  );
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
};

const rsa_decrypt = async (encrypted: string, privateKey) => {
  if (typeof privateKey === 'string')
    privateKey = await import_key(privateKey, 'decrypt');
  const _encrypted = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP',
    },
    privateKey,
    _encrypted
  );
  return new TextDecoder().decode(decrypted);
};

export {
  sha512,
  md5,
  cbc_encrypt,
  cbc_decrypt,
  generate_rsa_key_pair,
  import_key,
  rsa_encrypt,
  rsa_decrypt,
};
