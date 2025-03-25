import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
  CipherGCM,
  DecipherGCM,
} from "crypto";
import * as dotenv from "dotenv";

dotenv.config();

export interface EncryptionConfig {
  key: string;
  salt: string;
  algorithm?: string;
  keyLength?: number;
}

export class EncryptionService {
  private readonly key: Buffer;
  private readonly algorithm: string;
  private readonly keyLength: number;
  private readonly salt: string;

  constructor(config: EncryptionConfig) {
    if (!config.key) throw new Error("Encryption key must be provided");
    if (!config.salt) throw new Error("Salt must be provided");

    this.algorithm = config.algorithm || "aes-256-gcm";
    this.keyLength = config.keyLength || 32;
    this.salt = config.salt;

    // Generate a secure key using scrypt
    this.key = scryptSync(config.key, this.salt, this.keyLength);
  }

  /**
   * Encrypts a string or object using AES encryption
   * @param data - The data to encrypt (string or object)
   * @returns Encrypted string (base64 encoded)
   */
  encrypt(data: string | object): string {
    try {
      // Convert data to string if it's an object
      const textToEncrypt =
        typeof data === "string" ? data : JSON.stringify(data);

      // Generate a random IV
      const iv = randomBytes(12);

      // Create cipher
      const cipher = createCipheriv(this.algorithm, this.key, iv) as CipherGCM;

      // Encrypt the data
      let encrypted = cipher.update(textToEncrypt, "utf8", "base64");
      encrypted += cipher.final("base64");

      // Get the auth tag
      const authTag = cipher.getAuthTag();

      // Combine IV, encrypted data, and auth tag
      const result = JSON.stringify({
        iv: iv.toString("base64"),
        encryptedData: encrypted,
        authTag: authTag.toString("base64"),
      });

      return Buffer.from(result).toString("base64");
    } catch (error: unknown) {
      throw new Error(
        `Encryption failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Decrypts an encrypted string
   * @param encryptedText - The base64 encoded encrypted string
   * @param asObject - Whether to parse the result as JSON
   * @returns Decrypted string or object
   */
  decrypt<T = string>(encryptedText: string, asObject = false): T {
    try {
      // Decode the combined string
      const decoded = JSON.parse(
        Buffer.from(encryptedText, "base64").toString()
      );

      // Extract components
      const iv = Buffer.from(decoded.iv, "base64");
      const encryptedData = decoded.encryptedData;
      const authTag = Buffer.from(decoded.authTag, "base64");

      // Create decipher
      const decipher = createDecipheriv(
        this.algorithm,
        this.key,
        iv
      ) as DecipherGCM;
      decipher.setAuthTag(authTag);

      // Decrypt the data
      let decrypted = decipher.update(encryptedData, "base64", "utf8");
      decrypted += decipher.final("utf8");

      return asObject ? (JSON.parse(decrypted) as T) : (decrypted as T);
    } catch (error: unknown) {
      throw new Error(
        `Decryption failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
