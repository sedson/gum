const CHARS = 'abcdefghijfklmnopqrstuvwxyzABCDEFGHIJFKLMNOPQRSTUVWXYZ0123456789_@!';
const buffer = new Uint8Array(128);
let index = buffer.byteLength;

function fillBuffer () {
  crypto.getRandomValues(buffer);
  index = 0;
}

export function uuid (length = 6) {
  if (index + length >= buffer.byteLength) fillBuffer();
  let id = '';
  while(id.length < length) {
    id += CHARS[buffer[index] % CHARS.length];
    ++ index;
  }
  return id;
}