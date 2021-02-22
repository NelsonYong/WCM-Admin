const { Base64 } = require('js-base64');

export function NoToBase64(data: string) {
  const Data = Base64.decode(data);
  return Data;
}

// Base64编码
export function ToBase64(data: string) {
  const Data = Base64.encode(data);
  return Data;
}
