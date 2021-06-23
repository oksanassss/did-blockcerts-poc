import btoa from 'btoa';

function arrayBufferToBase64(arrayBuffer) {
  const byteArray = new Uint8Array(arrayBuffer);
  let byteString = '';
  for(let i = 0; i < byteArray.byteLength; i++) {
    byteString += String.fromCharCode(byteArray[i]);
  }
  const b64 = btoa(byteString);

  return b64;
}

function addNewLines(str) {
  let finalString = '';
  while(str.length > 0) {
    finalString += str.substring(0, 64) + '\n';
    str = str.substring(64);
  }

  return finalString;
}

export default function toPem(privateKey) {
  const b64 = addNewLines(arrayBufferToBase64(privateKey));
  const pem = "-----BEGIN PRIVATE KEY-----\n" + b64 + "-----END PRIVATE KEY-----";

  console.log('private key to pem', pem);
  return pem;
}
