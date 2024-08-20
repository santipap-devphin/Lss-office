import { lazy, StrictMode, Suspense } from "react";
import { useAuthProvider } from "./hooks/auth-provider";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./providers/AppProvider";
import { DataProvider } from "./providers/DataProvider";
import { routerUrlBase } from "./configs/urls";
import { ConfigProvider } from "antd";

import moment from 'moment'
import th_TH from "antd/lib/locale/th_TH";

import "./index.scss";

import reportWebVitals from "./reportWebVitals";


moment.locale("th");

const { AuthProvider } = useAuthProvider();
const Spinner = lazy(() => import("./components/fragments/Spinner"));
const App = lazy(() => import("./App"));

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StrictMode>
    
    {/* <BrowserRouter basename="/iLSS" > */}
    <ConfigProvider locale={th_TH}>
      <BrowserRouter basename={routerUrlBase}>
        <AppProvider>
          <DataProvider>
            <Suspense fallback={<Spinner />}>
              <AuthProvider>
                  <App />
              </AuthProvider>
            </Suspense>
          </DataProvider>
        </AppProvider>
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(//console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
