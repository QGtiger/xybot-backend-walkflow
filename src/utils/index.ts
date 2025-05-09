import { v4 as uuidv4 } from 'uuid';

export function generateUuid() {
  return uuidv4().replace(/-/g, '');
  const uuidBuffer = Buffer.from(uuidv4().replace(/-/g, ''), 'hex');
  const base64Id = uuidBuffer.toString('base64').replace(/=/g, '');
  // .substring(0, 22);
  return base64Id;
}
