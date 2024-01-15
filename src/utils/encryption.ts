import { hashSync, compareSync } from "bcryptjs";

export default new (class Encryption {
  public hashData(data: string): string {
    return hashSync(data, 10);
  }

  public compareHash(data: string, hash: string): boolean {
    return compareSync(data, hash);
  }
})();
