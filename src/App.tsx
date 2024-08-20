import { useCallback, useEffect, useState } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import "./App.scss";
import { useAppContext } from "./providers/AppProvider";
import { defaultRoutes, routes } from "./routes";
import { User } from "./models/user/user.model";
import { PermissionScope } from "./models/office/permission-scope.model";
import { useIdleTimer } from "react-idle-timer";
import { useDataContext } from "./providers/DataProvider";
import { getLocalStorage } from "./functions/LocalStorage";
import { ExtractPayload } from "./functions/ExtractPayload";
import { LssITA27GetTimeOutAPI } from "./data";

const App = () => {
  const { user, logout } = useAppContext();
  const { clearData } = useDataContext();
  const [allowRoutes, setAllowRoutes] = useState(defaultRoutes);
  let element = useRoutes(allowRoutes);
  const [timeOut, setTimeOut] = useState(0);

  const { start } = useIdleTimer({
    startOnMount: false,
    startManually: true,
    // timeout: timeOut,
    events: [
      "mousemove",
      "keydown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "mousedown",
      "touchstart",
      "touchmove",
      "MSPointerDown",
      "MSPointerMove",
      "visibilitychange",
    ],
    onIdle: () => {
      if (localStorage.getItem("__refreshToken")) {
        // logout on idle
        logout().then(() => {
          clearData();
          localStorage.removeItem("_menus");
          localStorage.removeItem("_EX1");
          window.location.reload();
        });
      }
    },
  });

  useEffect(() => {
    // if user logged in
    if (localStorage.getItem("__refreshToken")) {
      //start idle state
      start();
      // LssITA27GetTimeOutAPI().then((data) => {
      //   if(data.VALUE != 0){
      //     var timer = (1000 * 60) * data.VALUE;
      //     setTimeOut(timer);
      //   }
      // });
      // if(timeOut != 0){
      //   start();
      // }
    }
  });

  // Dynamic create routes for permission scope
  const getScopes = useCallback(() => {
    try {
      console.log('start-flow');
      const extractToken = (token: string) => {
        setAllowRoutes((prev) => {
          const ep = new ExtractPayload(token as string);
          const scopes = ep.get("SCOPES") as PermissionScope[];
          let exists = [...prev];
          console.log(exists);
          console.log(scopes);
          scopes.forEach((s) => {
            const route = routes.find((x) =>
              x.path?.trim().includes(s.CODE.trim())
            );
            console.log(route);
            if (
              route &&
              !exists.find((x) =>
                x.path?.trim().includes(route.path?.trim() as string)
              )
            ) {
              exists.push(route);
            }
          });
          return exists;
        });
      };

      console.log(user);

      if (user) {
        extractToken(user?.authToken as string);
      } else {
        const store = getLocalStorage<User>("__refreshToken");
        console.log(store);
        if (store) {
          extractToken(store.authToken as string);
        }else{
          return <Navigate to={"/login"} replace />;
        }
        //throw new Error("Store not found!");
      }
    } catch (err) {
      console.log(err);
      return <Navigate to={"/login"} replace />;
    }
  }, [user]);

  useEffect(() => {
    getScopes();
  }, [getScopes]);

  return element;
};

export default App;
