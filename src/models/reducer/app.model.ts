import { LSS_T_MENU } from "../office/LSS_T_MENU.model";
import { User } from "../user/user.model";

export interface App {
  user: User | null;
  menus: LSS_T_MENU[] | null;
  login: (creds: User) => void;
  logout(): Promise<boolean>;
  isLoggedIn: () => void;
  setMenu: (menus: LSS_T_MENU[]) => void;
}
