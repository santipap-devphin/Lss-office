import {
  createContext,
  useContext,
  useCallback,
  useReducer,
  FC,
  ReactNode,
} from "react";
import { App } from "../models/reducer/app.model";
import { UserReducer, UserActionType } from "../reducers/user.reducer";
import { User } from "../models/user/user.model";
import { logoutAccount } from "../data";
import { MenuActionType, MenuReducer } from "../reducers/menu.reducer";
import { LSS_T_MENU } from "../models/office/LSS_T_MENU.model";

export const AppContext = createContext<App>({
  user: null,
  menus: [],
  login: (creds: User) => {},
  logout: (): Promise<boolean> => Promise.reject(),
  isLoggedIn: () => {},
  setMenu: (menus: LSS_T_MENU[]) => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, dispatch] = useReducer(UserReducer, null);
  const [menus, menuDispatch] = useReducer(MenuReducer, []);

  const login = useCallback((credentials: User) => {
    dispatch({ type: UserActionType.Login, payload: credentials });
  }, []);

  const logout = useCallback(async (): Promise<boolean> => {
    try {
      const status = await logoutAccount(auth?.authToken as string);
      if (status === 200) {
        dispatch({ type: UserActionType.Logout, payload: null });
      }
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }, [auth?.authToken]);

  const isLoggedIn = useCallback(() => {
    dispatch({ type: UserActionType.Check });
  }, []);

  const setMenu = useCallback((menus: LSS_T_MENU[]) => {
    menuDispatch({ type: MenuActionType.Set, payload: menus });
  }, []);

  return (
    <AppContext.Provider
      value={{
        user: auth,
        menus,
        login,
        logout,
        isLoggedIn,
        setMenu,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
