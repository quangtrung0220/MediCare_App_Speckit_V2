import { ValueTransformer } from 'typeorm';
import * as crypto from 'crypto';

export class EncryptionTransformer implements ValueTransformer {
  private readonly algorithm = 'aes-256-cbc';
  private readonly ivLength = 16;
  private readonly key: Buffer;

  constructor() {
    // Falls back to a default secure string for testing if ENCRYPTION_KEY is not defined.
    // Ensure key generation works reliably using scrypt to derive a 32-byte key from any input string.
    const secret = process.env.ENCRYPTION_KEY || 'medicare-default-secret-encryption-key-string-32-chars';
    this.key = crypto.scryptSync(secret, 'medicare-salt', 32);
  }

  /**
   * Encrypts the plain text value before saving it to the database.
   */
  to(value: string | null | undefined): string | null | undefined {
    if (value === null || value === undefined) {
      return value;
    }

    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
      let encrypted = cipher.update(value, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Store as iv:encryptedText
      return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
      console.error('Failed to encrypt value:', error);
      return value;
    }
  }

  /**
   * Decrypts the encrypted database value back to plain text.
   */
  from(value: string | null | undefined): string | null | undefined {
    if (value === null || value === undefined) {
      return value;
    }

    const parts = value.split(':');
    // If it doesn't match the iv:encryptedText pattern, return raw value (handles unencrypted legacy records)
    if (parts.length !== 2) {
      return value;
    }

    try {
      const iv = Buffer.from(parts[0], 'hex');
      const encryptedText = parts[1];
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      // Return raw value instead of crashing (allows smooth migration/key transition)
      return value;
    }
  }
}
