import { Buffer } from "buffer";
export class ExtractPayload {
  private jwtObject: Object | null = null;
  constructor(token: string) {
    try {
      this.jwtObject = JSON.parse(
        Buffer.from(token.split(".").at(1) as string, "base64").toString("utf8")
      );
    } catch (err) {
      console.error("ExtractPayload:", err);
    }
  }

  get<T>(key: string): T | null {
    if (this.jwtObject?.hasOwnProperty(key)) {
      return (this.jwtObject as Record<string, any>)[key] as T;
    }
    return null;
  }

  has(key: string): boolean {
    return this.jwtObject?.hasOwnProperty(key) === true;
  }
}
