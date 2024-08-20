import React, {
  useEffect,
  FC,
  ReactElement,
  useState,
  useCallback,
} from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAppContext } from "../../providers/AppProvider";
import { User } from "../../models/user/user.model";
import Spinner from "./Spinner";
import { logoutAccount } from "../../data";
import { LSS_T_MENU } from "../../models/office/LSS_T_MENU.model";
import { getLocalStorage } from "../../functions/LocalStorage";
import { ExtractPayload } from "../../functions/ExtractPayload";
//import { PermissionScope } from "../../models/office/permission-scope.model";

const RequireAuth: FC<{ children: ReactElement }> = ({ children }) => {
  let location = useLocation();
  const [isBusy, setIsBusy] = useState<boolean>(true);
  const { user, login, setMenu } = useAppContext();

  // const checkPermission = (
  //   token: string,
  //   element: ReactElement
  // ): ReactElement => {
  //   try {
  //     const payload = token.split(".").at(1);

  //     const scopes = JSON.parse(
  //       Buffer.from(payload as string, "base64").toString()
  //     )?.SCOPES as PermissionScope[];

  //     if (scopes.find((x) => x.CODE === children.key)) return element;
  //     else return <Navigate to="/Forbidden" replace />;
  //   } catch {
  //     return <Navigate to="/Forbidden" replace />;
  //   }
  // };

  const restore = useCallback((): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const userData = getLocalStorage<User>("__refreshToken");
      const menuData = getLocalStorage<LSS_T_MENU[]>("__menus");

      if (userData && menuData) {
        setMenu(menuData as LSS_T_MENU[]);
      }
      if (userData) {
        const ep = new ExtractPayload(userData.authToken as string);

        if (ep.has("exp") && (ep.get("exp") as number) > Date.now() / 1000) {
          login(userData);
          resolve(true);
        } else {
          logoutAccount(userData.authToken as string);
        }
      } else {
        localStorage.removeItem("__refreshToken");
        reject(false);
      }
    });
  }, [login, setMenu]);

  useEffect(() => {
    restore();
    setIsBusy(() => false);
  }, [restore]);

  if (isBusy) return <Spinner />;

  return user === null ? (
    <Navigate to="/login" state={{ from: location }} replace />
  ) : (
    children
  );
};

export default RequireAuth;
