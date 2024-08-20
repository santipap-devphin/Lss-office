import React from "react";
import { Link, Navigate } from "react-router-dom";
//import admin_search from "../../assets/images/admin_search.png";
//import admin_report from "../../assets/images/admin_report.png";

// import dashbaordImg from "../../assets/images/dashboard.png";
// import papernpencil from "../../assets/images/papernpencil.png";
// import magnifier from "../../assets/images/magnifier.png";
// //import report from "../../assets/images/report.png";
// import user from "../../assets/images/user.png";
import { useAppContext } from "../../providers/AppProvider";
import { useDataContext } from "../../providers/DataProvider";
import { BsArrowDownCircle } from "react-icons/bs";

import { FaCog, FaSearch, FaChartLine, FaReceipt } from "react-icons/fa";
import "./NavMenu.scss";

import { Navbar, Container, Nav, NavDropdown, Col } from "react-bootstrap";
import LoginPng from "../../assets/images/logo_db.png";
import { parseISO } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { PermissionScope } from "../../models/office/permission-scope.model";
import { User } from "../../models/user/user.model";
import Spinner from "./Spinner";
import Swal from "sweetalert2";
import { getLocalStorage, setLocalStorage } from "../../functions/LocalStorage";
import { ExtractPayload } from "../../functions/ExtractPayload";
import { getAllMenu } from "../../data";

const NavMenu = () => {
  const { logout, menus: allMenus } = useAppContext();
  const { clearData } = useDataContext();
  const { user } = useAppContext();
  const [isBusy, setIsBusy] = useState<boolean>(true);
  const [menus, setMenus] = useState<{
    IQ: string[];
    IR: string[];
    IP: string[];
    ITA: string[];
    IRA: string[];
    IN: string[];
    EX: string[];
  }>({ IQ: [], IR: [], IP: [], ITA: [], IRA: [], IN: [], EX: [] });
  const getScopes = useCallback(() => {
    try {
      const extractToken = (token: string) => {
          const ep = new ExtractPayload(token);
          //  = getLocalStorage<any>("_menus");
          var account = getLocalStorage("_account");
          var menuData: any = [];
          getAllMenu(account).then(async (res: any) => {
            menuData = await res;
            const scopesArr = [];
            for (let index = 0; index < menuData.length; index++) {
              scopesArr.push(menuData[index].CODE);
            }
            // if(menuData != null){
            //   for (let index = 0; index < menuData.length; index++) {
            //     scopesArr.push(menuData[index].CODE);
            //   }
            // }else{
            //   getAllMenu(account);
            // }
            // scopesArr.filter((value,i) => { scopesArr.indexOf(value) === i });
            var scopesFliter = scopesArr.filter(function(elem, index, self) {
              return index === self.indexOf(elem);
            })
            var memu = {
              IQ: scopesFliter
                .filter((x) => x.startsWith("LSS-IQ-"))
                .map((el) => el)
                .sort((a, b) => a.localeCompare(b)),
              IP: scopesFliter
                .filter((x) => x.startsWith("LSS-IP-"))
                .map((el) => el)
                .sort((a, b) => a.localeCompare(b)),
              IR: scopesFliter
                .filter((x) => x.startsWith("LSS-IR-0"))
                .map((el) => el)
                .sort((a, b) => a.localeCompare(b)),
              IRA: scopesFliter
                .filter((x) => x.startsWith("LSS-IR-A"))
                .map((el) => el)
                .sort((a, b) => a.localeCompare(b)),
              ITA: scopesFliter
                .filter((x) => x.startsWith("LSS-IT-"))
                .map((el) => el)
                .sort((a, b) => a.localeCompare(b)),
              IN: scopesFliter
              .filter((x) => x.startsWith("IN1"))
              .map((el) => el)
              .sort((a, b) => a.localeCompare(b)),
              EX: scopesFliter
              .filter((x) => x.startsWith("EX1"))
              .map((el) => el)
              .sort((a, b) => a.localeCompare(b)),
            };
            setMenus(memu)
          });
      };
      if (user) {
        extractToken(user?.authToken as string);
      } else {
        const store = getLocalStorage<User>("__refreshToken");
        if (store) {
          extractToken(store.authToken as string);
        }
        throw new Error("Store not found!");
      }
    } catch (err) {
      return <Navigate to={"/login"} replace />;
    }
  }, [user]);
  const handleLogout = () => {
    logout()
      .then((result) => {
        clearData();
      })
      .catch((err) => {
        Swal.fire({
          icon: "warning",
          text: "ไม่สามารถออกจากระบบได้",
        });
      });
  };
  setLocalStorage("_EX1",menus.EX);
  const renderMenu = (code: string) => {
    const menu = allMenus?.find((x) => x.CODE === code);
    if (menu) {
      return (
        <NavDropdown.Item as={Link} to={`/${menu.CODE}`}>
          {menu.NAME}
        </NavDropdown.Item>
      );
    }
    return null;
  };

  const renderMenuReport = (code: string) => {
    const menu = allMenus?.find((x) => x.CODE === code);
    if (menu) {
      return (
        <NavDropdown.Item as={Link} to={`/${menu.CODE}`} style={{whiteSpace: "normal"}}>
          {menu.NAME}
        </NavDropdown.Item>
      );
    }
    return null;
  };

  useEffect(() => {
    getScopes();
    setIsBusy(() => false);
  }, [getScopes]);

  if (isBusy) return <Spinner />;

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="md"
        variant="dark"
        fixed="top"
        style={{
          backgroundColor: "#66615B",
          boxShadow: "0px 5px 19px 3px rgb(0 0 0 / 34%)",
        }}
      >
        <Container fluid>
          {menus.IN.length > 0 ? (
                      <Navbar.Brand
                      as={Link}
                      to="/"
                      className="d-flex align-items-center px-1"
                      style={{ fontSize: "1rem", marginLeft: "0.5rem" }}
                    >
                      <div className="align-seft-center">
                        <img src={LoginPng} alt="Logo" style={{ width: "17rem" }} />
                      </div>
                    </Navbar.Brand>
          ) : null}
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav
              className="me-auto w-100 d-flex"
              style={{ justifyContent: "flex-end" }}
            >
              {menus.IQ.length > 0 ? (
                <NavDropdown
                  className="d-flex align-items-center"
                  title={
                    <div className="align-seft-center">
                      <FaSearch size={30} style={{ margin: "auto" }} />
                      <span className="align-self-center">การค้นหา</span>
                    </div>
                  }
                >
                  {menus.IQ.map((code, i) => (
                    <React.Fragment key={i}>
                      {renderMenu(code)}
                      {i < menus.IQ.length - 1 ? <NavDropdown.Divider /> : null}
                    </React.Fragment>
                  ))}
                </NavDropdown>
              ) : null}
              {menus.IR.length > 0 ? (
                <NavDropdown
                  className="d-flex align-items-center"
                  title={
                    <div>
                      <FaChartLine size={30} style={{ margin: "auto" }} />
                      <span className="align-self-center">รายงาน</span>
                    </div>
                  }
                >
                  <Col
                    className="set_DDL"
                    style={{ maxHeight: "30rem", overflowX: "auto", width: "45rem" }}
                  >
                    {menus.IR.map((code, i) => (
                      <React.Fragment key={i}>
                        {renderMenuReport(code)}
                        {i < menus.IR.length - 1 ? (
                          <NavDropdown.Divider />
                        ) : null}
                      </React.Fragment>
                    ))}
                  </Col>
                </NavDropdown>
              ) : null}
              {menus.IP.length > 0 ? (
                <NavDropdown
                  className="d-flex align-items-center"
                  title={
                    <div>
                      <FaCog size={30} style={{ margin: "auto" }} />
                      <span className="align-self-center">ผู้ดูแลระบบ</span>
                    </div>
                  }
                >
                  {menus.IP.map((code, i) => (
                    <React.Fragment key={i}>
                      {renderMenu(code)}
                      {i < menus.IP.length - 1 ? <NavDropdown.Divider /> : null}
                    </React.Fragment>
                  ))}
                </NavDropdown>
              ) : null}
              {menus.ITA.length > 0 ? (
                <NavDropdown
                  className="d-flex align-items-center"
                  title={
                    <div>
                      <FaCog size={30} style={{ margin: "auto" }} />
                      <span className="align-self-center">
                        ผู้ดูแลระบบ Master Data{" "}
                      </span>
                    </div>
                  }
                >
                  <Col
                    className="set_DDL"
                    style={{ maxHeight: "30rem", overflowY: "scroll" }}
                  >
                    {menus.ITA.map((code, i) => (
                      <React.Fragment key={i}>
                        {renderMenu(code)}
                        {i < menus.ITA.length - 1 ? (
                          <NavDropdown.Divider />
                        ) : null}
                      </React.Fragment>
                    ))}
                  </Col>
                </NavDropdown>
              ) : null}
              {menus.IRA.length > 0 ? (
                <NavDropdown
                  className="d-flex align-items-center"
                  title={
                    <div>
                      <FaReceipt size={30} style={{ margin: "auto" }} />
                      <span className="align-self-center">
                        รายงานผู้ดูแลระบบ
                      </span>
                    </div>
                  }
                  align={{ lg: "end" }}
                >
                  <Col
                    className="set_DDL"
                    style={{  maxHeight: "20rem", overflowY: "scroll"  }}
                  >
                    {menus.IRA.map((code, i) => (
                      <React.Fragment key={i}>
                        {renderMenu(code)}
                        {i < menus.IRA.length - 1 ? (
                          <NavDropdown.Divider />
                        ) : null}
                      </React.Fragment>
                    ))}
                  </Col>
                </NavDropdown>
              ) : null}
              <NavDropdown
                className="d-flex align-items-center"
                title={
                  // <div>
                  //   <FaRunning size={30} style={{ margin: "auto" }} />
                  //   <span className="align-self-center">ออกจากระบบ</span>
                  // </div>
                  <div>
                    <label
                      className="align-self-end"
                      style={{ margin: "auto", color: "#ffb74d" }}
                    >
                      คุณ {user?.name} {user?.lastName}
                      <BsArrowDownCircle
                        style={{ marginLeft: "2%", color: "#ffb74d" }}
                      />
                    </label>
                    <span className="align-self-end">
                      {parseISO(
                        user?.loginDate?.toString() as string
                      ).toLocaleTimeString("th-TH", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                }
                align={{ lg: "end" }}
              >
                {/* <NavDropdown.Item as={Link} to="/ChangePassword">
                  LSS-EA-050 Administrator
                </NavDropdown.Item>
                <NavDropdown.Divider /> */}
                <NavDropdown.Item as={Link} to="/" onClick={handleLogout}>
                  ออกจากระบบ
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavMenu;
