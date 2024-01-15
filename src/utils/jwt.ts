import { JwtPayload, sign, SignOptions, verify } from "jsonwebtoken";

export interface jwtValue extends JwtPayload {
  _id: string;
}

export default new (class JWT {
  public createToken(data: { _id: string }, options?: SignOptions) {
    return sign({ ...data }, process.env.SECRET, options);
  }

  public verifyToken<T = jwtValue>(token: string) {
    return verify(token, process.env.SECRET) as T;
  }
})();
