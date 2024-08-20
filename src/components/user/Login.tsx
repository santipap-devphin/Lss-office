import { useNavigate, useLocation } from "react-router-dom";
import {AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { loginRequest } from "../../configs/authConfig";
import { useState, useEffect } from "react";
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import * as yup from "yup";
import { Formik } from "formik";
import { Col, Container, Form, FormGroup, Row, Button } from "react-bootstrap";
import { getAnnou_office, loginOffice, getAllMenu, getDayoff, getLssITA27 } from "../../data";
import { useAppContext } from "../../providers/AppProvider";
import { useDataContext } from "./../../providers/DataProvider";
import { AccountActionType } from "../../reducers/account.reducer";
import { CompanyActionType } from "../../reducers/company.reducer";
import { LocationState } from "../../models/router/location-state.model";
import LoginPng from "../../assets/images/logo.png";
import BGLogin from "../../assets/images/bg_pic.jpg";
import { apiUrlBase } from "../../configs/urls";
import { PdfViewer } from "../fragments/PdfViewer";
import icon_new from '../../assets/images/icon-new.gif'
import icon_list from '../../assets/images/icon-list.png'

import "@sweetalert2/theme-minimal/minimal.scss";
import "./Login.scss";
import ConcurrencyModal from "../fragments/ConcurrencyModal";
import { ConcurrencyError } from "../../models/office/ConcurrencyError.model";
import newIcon from "../../assets/images/new.gif";
import { setLocalStorage } from "../../functions/LocalStorage";
const Swal = withReactContent(swal);

const Login = () => {

  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  //const AccountUsername = instance.getActiveAccount().username;


  let navigate = useNavigate();
  let location = useLocation();
  const { login, setMenu } = useAppContext();

  const [showConcurrencyModal, setShowConcurrencyModal] =
    useState<boolean>(false);
  const [error, setError] = useState<ConcurrencyError | null>(null);

  const [payKey, SetPayKey] = useState("");
  const [annouse, SetAnnouse] = useState<boolean>(false);
  const [newAnnScope, setNewAnnScope] = useState<Date | null>(null)
  const { accountDispatch, companyDispatch } = useDataContext();

  const [isDayoff, setIsDayoff] = useState(() => false)

  const schema = yup.object().shape({
    userName: yup.string().nullable().required("กรุณาระบุชื่อผู้ใช้"),
    password: yup.string().nullable().required("กรุณาระบุรหัสผ่าน"),
  });
  const [tableData, setTableData] = useState<
    {
      id: any;
      col1: any;
      col2: any;
      checkNew: any;
      created: Date | null;
      typeLink: any;
    }[]
  >([]);

  const RetiveData = () => {
    localStorage.removeItem("_menus");
    getAnnou_office().then((data) => {
      let tmpSchema = [];
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: data[i].CODE,
          col1: data[i].NAME,
          col2: data[i].DESCRIPTION,
          checkNew: data[i].CHECK_NEW,
          created: data[i].CREATED_DATE ? new Date(data[i].CREATED_DATE) : null,
          typeLink: data[i].TYPE_LINK
        });
      } //loop i
      setTableData(tmpSchema);
      console.log(data)
    }); //getPayinList
    //setIsDayoff(true)
    getDayoff().then(data => {
      //setIsDayoff(data === 0)
    })
    getLssITA27({ CODE: "DAYNEWS" }).then(data => {
      const day = Number(data)
      if (day) {
        const scope = new Date();
        scope.setDate(scope.getDate() - day);
        setNewAnnScope(scope);
      }
    })

    const usr = localStorage.getItem("__refreshToken");
    console.log(usr);
  };

  useEffect(() => {
    RetiveData();
  }, []);

  const handleLogin = (values: { userName: string; password: string }) => {

    if (isDayoff) {
      Swal.fire(
        "เข้าสู่ระบบ",
        "ไม่สามารถใช้ระบบได้เนื่องจากไม่อยู่ในช่วงทำการ",
        "warning"
      );
      return;
    }

    loginOffice(values.userName, values.password)
      .then((cred) => {
        setLocalStorage("_account", cred.DATA.ACCOUNT?.GROUP_STAFF_CODE);
        getAllMenu(cred.DATA.ACCOUNT?.GROUP_STAFF_CODE).then((menus) => {
          // await setLocalStorage("_menus", menus)
          setMenu(menus);
        });

        login({
          name: cred.NAME,
          lastName: cred.LASTNAME,
          email: cred.EMAIL,
          authToken: cred.TOKEN,
          loginDate: cred?.DATA.ACCOUNT?.LAST_LOGIN_DATE,
        });



        accountDispatch({
          type: AccountActionType.Replace,
          payload: cred?.DATA?.ACCOUNT,
        });

        companyDispatch({
          type: CompanyActionType.Replace,
          payload: cred?.DATA?.COMPANY,
        });

        if (
          (location.state as LocationState)?.from &&
          !(location.state as LocationState)?.from.pathname.includes("/login")
        ) {
          // redirect to previous page
          return navigate((location.state as LocationState)?.from?.pathname);
        } else {
          // redirect to home page
          return navigate("/");
        }
      })
      .catch((err) => {
        if (err?.status === 409) {
          setError(() => err?.data as ConcurrencyError);
          setShowConcurrencyModal(true);
        } else {
          Swal.fire(
            "เข้าสู่ระบบ",
            "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
            "warning"
          );
        }
      });
  };

  
  const handdleLoginMs = () => {
    instance
        .loginPopup({
            ...loginRequest,
            prompt: 'create',
        })
        .catch((error) => console.log(error));
    };

    const handleLogoutRedirect = () => {
      instance.logoutRedirect({
          postLogoutRedirectUri:'/'
      });

      //setChklogin(false);
      window.location.reload();

  }
  

  return (
    <>
     
      <Formik
        validationSchema={schema}
        onSubmit={handleLogin}
        initialValues={{
          userName: "61-1-015",
          password: "61-1-015",
        }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Container
            fluid
            className="bd_box"
            style={{
              background:
                "linear-gradient(0deg, rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.10)),url(" +
                BGLogin +
                ")",
            }}
          >
            <Container>
              <div className="h-100 d-flex flex-column justify-content-center">
                <Row>
                  <Col md="2"></Col>
                  <Col
                    xs="12" md="8"
                    style={{
                      backgroundColor: "#FFF",
                      boxShadow: "0px 0px 50px 20px rgb(0 0 0 / 25%)",
                      borderRadius: "20px",
                    }}
                  >
                    {/* <Col lg="6">
                  <Row className="justify-content-center">
                     <Col lg="11" px="2" className="py-3">
                            <img src={LoginPng} alt="Logo" style={{ width: "100%" }} />
                     </Col>
                  </Row>
                </Col> */}
                    <Row>
                      <Col lg="6">
                        <Form
                          noValidate
                          onSubmit={handleSubmit}
                          className="col-md-12 animate__animated animate__fadeInUp"
                        >
                          <div className="my-2">
                            <div
                              className="header"
                              style={{ textAlign: "center", marginTop: "5%" }}
                            >
                              <h3>เข้าสู่ระบบ</h3>

                              
                              <AuthenticatedTemplate>
                                      {activeAccount ? (
                                          <>
                                          <button type="button" onClick={handleLogoutRedirect}> Logout </button>
                                          <p> You are login username {activeAccount.username}</p>
                                          </>
                                      ) : null}
                                  </AuthenticatedTemplate>
                                   <UnauthenticatedTemplate>
                                      {
                                      activeAccount ? 
                                         'คุณ login อยู่แล้ว'
                                         :  <Button variant="secondary" type="button" onClick={handdleLoginMs}>Microsoft Account </Button>
                                      }

                                      
                                    </UnauthenticatedTemplate>
                                  
                               
                            </div>
                            <Col
                              lg="12"
                              px="2"
                              className="py-2"
                              style={{ textAlign: "center" }}
                            >
                              <img
                                src={LoginPng}
                                alt="Logo"
                                style={{ width: "90%" }}
                              />
                            </Col>

                           

                            <div className="body px-2 py-3">
                              <FormGroup as={Row} className="mb-3">
                                <Form.Label column sm="4">
                                  ชื่อผู้ใช้งาน:
                                </Form.Label>
                                <Col sm="8">
                                  <Form.Control
                                    value={values.userName}
                                    onChange={handleChange}
                                    name="userName"
                                    type="text"
                                    placeholder="username@example.com"
                                    isInvalid={
                                      touched.userName && !!errors.userName
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.userName}
                                  </Form.Control.Feedback>
                                </Col>
                              </FormGroup>
                              <FormGroup as={Row} className="mb-3">
                                <Form.Label column sm="4">
                                  รหัสผ่าน:
                                </Form.Label>
                                <Col sm="8">
                                  <Form.Control
                                    value={values.password}
                                    onChange={handleChange}
                                    name="password"
                                    type="password"
                                    isInvalid={
                                      touched.password && !!errors.password
                                    }
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                  </Form.Control.Feedback>
                                </Col>
                              </FormGroup>

                              <Row>
                                <Col className="d-flex justify-content-center">
                                  <Button
                                    type="submit"
                                    className="btn btn-warning col-md-5"
                                  >
                                    เข้าสู่ระบบ
                                  </Button>
                                 
                                 
                                </Col>
                               
                              </Row>
                            
                              <FormGroup as={Row} style={{ marginTop: "5%" }}>
                                <a
                                  href="https://www.oic.or.th/sites/default/files/privacy_policy.pdf"
                                  rel="noreferrer"
                                  target="_blank"
                                  className="aLabel_policy"
                                  style={{ textAlign: "center" }}
                                >
                                  นโยบายคุ้มครองข้อมูลส่วนบุคคล
                                </a>
                              </FormGroup>
                            </div>
                          </div>
                        </Form>
                      </Col>
                      <Col lg="6">
                        <div className="col-md-12 panel_addition">
                          <div className="header_label_addition">ประกาศจากระบบ</div>
                          <div className="box_report scroll-list">
                            <div className="App" style={{ paddingLeft: "5px", margin: "5px" }}>
                              {tableData.map((todo) => (
                                <div className="d-flex" key={todo.id}>
                                  {todo?.checkNew == "Y" && <img
                                    src={icon_new}
                                    style={{ width: "20px", height: "10px", marginTop: "2%", marginRight: "5px" }}
                                  ></img>}
                                  {todo?.checkNew == "N" && <img
                                    src={icon_list}
                                    style={{ width: "20px", height: "10px", marginTop: "2%", marginRight: "5px" }}
                                  ></img>}
                                  {todo?.typeLink == "Y" && <p><a
                                    href="#FileAnn"
                                    onClick={() => {
                                      window.open(
                                        `${apiUrlBase}/data/dn?_ann=${todo.id}`
                                      );
                                      SetPayKey(todo.id);
                                      // SetAnnouse(true);
                                    }}
                                  >
                                    {todo.col1}
                                  </a></p>}
                                  {todo?.typeLink == "N" && <p
                                  // href="#FileAnn"
                                  // onClick={() => {
                                  //   window.open(
                                  //     `${apiUrlBase}/data/dn?_ann=${todo.id}`
                                  //   );
                                  //   SetPayKey(todo.id);
                                  //   // SetAnnouse(true);
                                  // }}
                                  >
                                    {todo.col1}
                                  </p>}
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* <label style={{textAlign: "center",marginTop: "3%"}}>เงื่อนนโยบายความเป็นส่วนตัว</label>
                      <label style={{textAlign: "center"}}>ติดต่อเรา</label> */}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="2"></Col>
                </Row>
              </div>
            </Container>
            <PdfViewer
              show={annouse}
              title={"File"}
              url={`${apiUrlBase}/data/dn?_ann=${payKey}`}
              onClose={() => SetAnnouse(false)}
            />
          </Container>
        )}
      </Formik>
      <ConcurrencyModal
        error={error}
        show={showConcurrencyModal}
        onClose={() => {
          setShowConcurrencyModal(false);
        }}
      />
    </>
  );
};

export default Login;
