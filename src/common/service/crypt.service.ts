import { createHash, webcrypto } from 'node:crypto';
import * as dotenv from 'dotenv';
import { BadRequestException } from '@nestjs/common';

dotenv.config();

export async function encrypt(data) {
  const key = process.env.AES_SECRET;

  try {
    // Генерируем случайный вектор инициализации
    const iv = await webcrypto.getRandomValues(new Uint8Array(12));

    // Импортируем ключ
    const cryptoKey = await webcrypto.subtle.importKey(
      'raw',
      new Uint8Array(key.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))),
      { name: 'AES-GCM' },
      false,
      ['encrypt'],
    );

    // Шифруем данные
    const encrypted = await webcrypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      cryptoKey,
      new TextEncoder().encode(data),
    );

    // Возвращаем зашифрованные данные с вектором инициализации в виде строк
    return {
      encrypted: Array.from(new Uint8Array(encrypted))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join(''),
      iv: Array.from(iv)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join(''),
    };
  } catch (e) {
    throw new BadRequestException(`Error encrypting data: ${e.message}`);
  }
}

export async function decrypt(encryptedData, iv) {
  const key = process.env.AES_SECRET;

  try {
    // Импортируем ключ
    const cryptoKey = await webcrypto.subtle.importKey(
      'raw',
      new Uint8Array(key.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))),
      { name: 'AES-GCM' },
      false,
      ['decrypt'],
    );

    // Расшифровываем данные
    const decrypted = await webcrypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(
          iv.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
        ),
      },
      cryptoKey,
      new Uint8Array(
        encryptedData.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
      ),
    );

    // Возвращаем расшифрованные данные в виде строки
    return new TextDecoder().decode(new Uint8Array(decrypted));
  } catch (e) {
    throw new BadRequestException(`Error decrypting data: ${e.message}`);
  }
}

export function hash(data, type = 'md5') {
  return createHash(type).update(data).copy().digest('hex');
}
