import { hashSync, compareSync } from "bcryptjs";
import { AES, enc } from "crypto-ts";

export default new (class Encryption {
  public hashData(data: string): string {
    return hashSync(data, 10);
  }

  public compareHash(data: string, hash: string): boolean {
    return compareSync(data, hash);
  }

  public encrypt(data: string): string {
    return AES.encrypt(
      data.replace(/\s/g, "_"),
      process.env.ENCRYPTION_KEY
    ).toString();
  }

  public decrypt(data: string): string {
    return AES.decrypt(data, process.env.ENCRYPTION_KEY)
      .toString(enc.Utf8)
      .replace(/_/g, " ");
  }
})();
