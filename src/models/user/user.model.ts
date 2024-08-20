export interface User {
  name: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  authToken: string | null;
  loginDate?: Date | null;
}
