import { RouteObject } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import CompareCrr from "./components/dashboard/LssEt030CompareCrr";
import LssIQ010 from "./components/dashboard/LssEt040DeliveryList";
import LssIQ011 from "./components/dashboard/LssIQ011";
import LssIQ051 from "./components/dashboard/LssIQ051";
import LssIQ053 from "./components/dashboard/LssIQ053";
import LSSIQ070 from "./components/dashboard/LSSIQ070";
import LSSIT010 from "./components/dashboard/LSSIT010";
import LSSIT020 from "./components/dashboard/LSSIT020";
import LSSIT030 from "./components/dashboard/LSSIT030";
import Forbidden from "./components/Forbidden";
import RequireAuth from "./components/fragments/RequireAuth";
import LssITA01ConfigList from "./components/master/LssITA01ConfigList";
import LssITA02ConfigList from "./components/master/LssITA02ConfigList";
import LssITA03Config from "./components/master/LssITA03Config";
import LssITA04List from "./components/master/LssITA04List";
import LssITBatchCRR from "./components/master/LssITBatchCRR";
import LssITBatchCRRLIFE from "./components/master/LssITBatchCRRLIFE";


import LssITA05ConfigList from "./components/master/LssITA05ConfigList";
import LssITA20List from "./components/master/LssITA20List";
import LssITA21List from "./components/master/LssITA21List";
import LssITA22ConfigList from "./components/master/LssITA22ConfigList";
import LssITA23List from "./components/master/LssITA23List";
import LssITA24List from "./components/master/LssITA24List";
import LssITA26List from "./components/master/LssITA26List";
import LssITA27List from "./components/master/LssITA27List";
import LssITA28List from "./components/master/LssITA28List";
import LssITA60List from "./components/master/LssITA60List";
import LssITA61List from "./components/master/LssITA61List";
import LssITA62List from "./components/master/LssITA62List";
import LssITA63List from "./components/master/LssITA63List";
import LssITA64List from "./components/master/LssITA64List";
import LssITA65List from "./components/master/LssITA65List";
import LssITA70List from "./components/master/LssITA70List";
import LssITA80List from "./components/master/LssITA80List";
import LssITA05Config from "./components/master/_LssITA05Config";
import LssITA22Config from "./components/master/_LssITA22Config";
import LssITA27Config from "./components/master/_LssITA27Config";
import NotFound from "./components/NotFound";
import PayList from "./components/payin/PayList";
import LssIR010 from "./components/report/LssIR010";
import LssIR011 from "./components/report/LssIR011";
import LssIR012 from "./components/report/LssIR012";
import LssIR013 from "./components/report/LssIR013";
import LssIR014 from "./components/report/LssIR014";
import LssIR015 from "./components/report/LssIR015";
import LssIR016 from "./components/report/LssIR016";
import LssIR017 from "./components/report/LssIR017";
import LssIR019 from "./components/report/LssIR019";
import LssIR020 from "./components/report/LssIR020";
import LssIR021 from "./components/report/LssIR021";
import LssIR030 from "./components/report/LssIR030";
import LSSRECEIPT from "./components/report/LssRec";
import LSSIRA01 from "./components/reportAdmin/LSSIRA01";
import LSSIRA02 from "./components/reportAdmin/LSSIRA02";
import LSSIRA03 from "./components/reportAdmin/LSSIRA03";
import LSSIRA04 from "./components/reportAdmin/LSSIRA04";
import LSSIRA05 from "./components/reportAdmin/LSSIRA05";
import LSSIRA06 from "./components/reportAdmin/LSSIRA06";
import LSSIRA07 from "./components/reportAdmin/LSSIRA07";
import LSSIRA08 from "./components/reportAdmin/LSSIRA08";
import LSSIRA09 from "./components/reportAdmin/LSSIRA09";
import LSSIRA10 from "./components/reportAdmin/LSSIRA10";
import ConfirmUnlockLogin from "./components/user/ConfirmUnlockLogin";
import Login from "./components/user/Login";

export const routes: RouteObject[] = [
  {
    path: "/LSS-IQ-010",
    element: (
      <RequireAuth>
        <LssIQ010 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IQ-011",
    element: (
      <RequireAuth>
        <LssIQ011 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IQ-020",
    element: (
      <RequireAuth>
        <PayList />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IQ-050",
    element: (
      <RequireAuth>
        <CompareCrr />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IQ-051",
    element: (
      <RequireAuth>
        <LssIQ051 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IQ-053",
    element: (
      <RequireAuth>
        <LssIQ053 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IQ-070",
    element: (
      <RequireAuth>
        <LSSIQ070 />
      </RequireAuth>
    ),
  },
  // {
  //   path: "/LSS-IT-010",
  //   element: (
  //     <RequireAuth>
  //       <LSSIT010 />
  //     </RequireAuth>
  //   ),
  // },
  {
    path: "/LSS-IP-010",
    element: (
      <RequireAuth>
        <LSSIT010 />
      </RequireAuth>
    ),
  },
  
  {
    path: "/LSS-IT-020",
    element: (
      <RequireAuth>
        <LSSIT020 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IP-020",
    element: (
      <RequireAuth>
        <LSSIT020 />
      </RequireAuth>
    ),
  },
  // {
  //   path: "/LSS-IT-030",
  //   element: (
  //     <RequireAuth>
  //       <LSSIT030 />
  //     </RequireAuth>
  //   ),
  // },
  {
    path: "/LSS-IP-030",
    element: (
      <RequireAuth>
        <LSSIT030 />
      </RequireAuth>
    ),
  },
  
  {
    path: "/LSS-IR-010",
    element: (
      <RequireAuth>
        <LssIR010 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-011",
    element: (
      <RequireAuth>
        <LssIR011 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-012",
    element: (
      <RequireAuth>
        <LssIR012 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-013",
    element: (
      <RequireAuth>
        <LssIR013 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-014",
    element: (
      <RequireAuth>
        <LssIR014 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-015",
    element: (
      <RequireAuth>
        <LssIR015 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-016",
    element: (
      <RequireAuth>
        <LssIR016 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A65",
    element: (
      <RequireAuth>
        <LssITA65List />
      </RequireAuth>
    ),
  },

  
  {
    path: "/LSS-IT-A64",
    element: (
      <RequireAuth>
        <LssITA64List />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-017",
    element: (
      <RequireAuth>
        <LssIR017 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-019",
    element: (
      <RequireAuth>
        <LssIR019 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-020",
    element: (
      <RequireAuth>
        <LssIR020 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-021",
    element: (
      <RequireAuth>
        <LssIR021 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-030",
    element: (
      <RequireAuth>
        <LssIR030 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSSRECEIPTS",
    element: (
      <RequireAuth>
        <LSSRECEIPT />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A01",
    element: (
      <RequireAuth>
        <LssITA01ConfigList />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A02",
    element: (
      <RequireAuth>
        <LssITA02ConfigList />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A03",
    element: (
      <RequireAuth>
        <LssITA03Config />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A04",
    element: (
      <RequireAuth>
        <LssITA04List />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-BATCH",
    element: (
      <RequireAuth>
        <LssITBatchCRR/>
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-BATCHLIFE",
    element: (
      <RequireAuth>
        <LssITBatchCRRLIFE/>
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A05",
    element: (
      <RequireAuth>
        <LssITA05ConfigList />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A05-CONFIG",
    element: (
      <RequireAuth>
        <LssITA05Config />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A22",
    element: (
      <RequireAuth>
        <LssITA22ConfigList />
      </RequireAuth>
    ),
  },
  
  {
    path: "/LSS-IT-A20",
    element: (
      <RequireAuth>
        <LssITA20List />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A70",
    element: (
      <RequireAuth>
        <LssITA70List />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A80",
    element: (
      <RequireAuth>
        <LssITA80List />
      </RequireAuth>
    ),
  },
  // {
  //   path: "/LSS-IT-A22",
  //   element: (
  //     <RequireAuth>
  //       <LssITA22ConfigList />
  //     </RequireAuth>
  //   ),
  // },
  {
    path: "/LSS-IT-A21",
    element: (
      <RequireAuth>
        <LssITA21List />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A23",
    element: (
      <RequireAuth>
        <LssITA23List />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A24",
    element: (
      <RequireAuth>
        <LssITA24List />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A26",
    element: (
      <RequireAuth>
        <LssITA26List />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A28",
    element: (
      <RequireAuth>
        <LssITA28List />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A60",
    element: (
      <RequireAuth>
        <LssITA60List />
      </RequireAuth>
    ),
  },
  // {
  //   path: "/LSS-IT-A27-CONFIG",
  //   element: (
  //     <RequireAuth>
  //       <LssITA27Config />
  //     </RequireAuth>
  //   ),
  // },
  {
    path: "/LSS-IT-A27",
    element: (
      <RequireAuth>
        <LssITA27List />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A61",
    element: (
      <RequireAuth>
        <LssITA61List />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A62",
    element: (
      <RequireAuth>
        <LssITA62List />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IT-A63",
    element: (
      <RequireAuth>
        <LssITA63List />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-A01",
    element: (
      <RequireAuth>
        <LSSIRA01 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-A02",
    element: (
      <RequireAuth>
        <LSSIRA02 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-A03",
    element: (
      <RequireAuth>
        <LSSIRA03 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-A04",
    element: (
      <RequireAuth>
        <LSSIRA04 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-A05",
    element: (
      <RequireAuth>
        <LSSIRA05 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-A06",
    element: (
      <RequireAuth>
        <LSSIRA06 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-A07",
    element: (
      <RequireAuth>
        <LSSIRA07 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-A08",
    element: (
      <RequireAuth>
        <LSSIRA08 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-A09",
    element: (
      <RequireAuth>
        <LSSIRA09 />
      </RequireAuth>
    ),
  },
  {
    path: "/LSS-IR-A10",
    element: (
      <RequireAuth>
        <LSSIRA10 />
      </RequireAuth>
    ),
  },
];

export const defaultRoutes: RouteObject[] = [
  {
    path: "/Forbidden",
    element: <Forbidden />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/confirm-unlock-login/:token",
    element: <ConfirmUnlockLogin />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
