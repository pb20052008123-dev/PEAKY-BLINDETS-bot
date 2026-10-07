import crypto from 'crypto';
import fs from 'fs/promises';

const FILE = 'database/digix2/shadow.enc';
const SECRET = process.env.OWNER_KEY || 'Digix-crew';

const ALGO = 'aes-256-cbc';

function getKey() {
  return crypto.createHash('sha256').update(SECRET).digest();
}

export async function encryptOwners(ownerArray) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);

  let encrypted = cipher.update(JSON.stringify(ownerArray), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const payload = iv.toString('h