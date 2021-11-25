export async function getHashedPassword(password: string, salt: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const base64Hash = btoa(String.fromCharCode(...new Uint8Array(hash)) + salt);

  return base64Hash;
}