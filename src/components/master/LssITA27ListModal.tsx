import { useState, useEffect, FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
//import Recapcha from "react-google-recaptcha";
import { Card, Col, Form, Row, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  LssITA27SaveAPI,
  LssITA27SearchAPI,
  LssITA27EditAPI,
  // getDocTypes,
  // getCommon,
} from "../../data";
// import FileBrowser from "../fragments/filebrowser/FileBrowser";
// import { DataResponse } from "../../models/common/data-response.model";
// import { CompanySelect } from "../../models/common/company-select.model";
// import { PrefixSelect } from "../../models/common/prefix-select.model";
// import { FileBrowserSchema } from "../../models/schemas/filebrowser/file-browser-schema.model";
// import { FileSchema } from "../../models/schemas/filebrowser/file-schema.model";
// import NavMenu from "../fragments/NavMenu";
// import { FaBars } from "react-icons/fa";
import { useAppContext } from "../../providers/AppProvider";
import { useDataContext } from "../../providers/DataProvider";

// import {
//   FaCog,
//   FaChalkboard,
//   FaSearch,
//   FaChartLine,
//   FaRunning,
//   FaReceipt,
// } from "react-icons/fa";
// import { Navbar, Nav, NavDropdown } from "react-bootstrap";
// import { Code, ConnectedTvOutlined } from "@mui/icons-material";
// import { formatMuiErrorMessage } from "@mui/utils";
// import { KeyValuePair } from "./../../models/reducer/KeyValuePair.model";

const LssITA27Modal: FC<{
  CODE: any;
  ACTIONCLICK: any;
  onFetchData: any;
  onModal: any;
  showBtn: any;
  showReadOnly: any;
}> = (CODE, ACTIONCLICK) => {
  // //console.log(CODE);

  const [senable, setSenable] = useState("");
  const { logout } = useAppContext();
  const { clearData } = useDataContext();
  let navigate = useNavigate();
  const handleLogout = () => {
    clearData().then(() => {
      logout();
    });
  };

  const [tableDataSearch, setTableDataSearch] = useState<
    {
      id: any;
      CODE: any;
      NAME: any;
      VALUE: any;
      DESCRIPTION: any;
      CONDITION1: any;
      ENABLE: any;
    }[]
  >([]);

  const fnFetchData = () => {
    if (CODE.ACTIONCLICK === "Edit" || CODE.ACTIONCLICK === "Display") {
      LssITA27SearchAPI(CODE).then((data: any) => {
        let tmpSchema = [];
        for (let i = 0; i < data.length; i++) {
          tmpSchema.push({
            id: data[i].CODE,
            CODE: data[i].CODE,
            NAME: data[i].NAME,
            VALUE: data[i].VALUE,
            DESCRIPTION: data[i].DESCRIPTION,
            CONDITION1: data[i].CONDITION1,
            ENABLE: data[i].ENABLE,
          });
        }
        setTableDataSearch(tmpSchema);
        setSenable(data[0].ENABLE);
        form.setValues(tmpSchema[0]);
      });
    } //EDIT
  };

  useEffect(() => {
    fnFetchData();
  }, []);

  const initValue = {
    CODE: "",
    NAME: "",
    DESCRIPTION: "",
    VALUE: "",
    ENABLE: "",
     CONDITION1:"",
    // CONDITION3:"",
  };

  const form = useFormik({
    validationSchema: yup.object().shape({
      SIGNATOR2: yup.string().nullable(),
      CODE: yup.string().nullable().required("กรุณาป้อนรหัสข้อมูล"),
      NAME: yup.string().nullable().required("กรุณาป้อนข้อมูลตัวแปร"),
      DESCRIPTION: yup.string().nullable().required("กรุณาป้อนข้อมูลคำอธิบาย"),
      VALUE: yup.string().nullable().required("กรุณาป้อนค่าข้อมูล"),
      // ENABLE: yup.string().nullable(),
      //ENABLE1: yup.string().nullable().required("กรุณาเลือกข้อมูล"),
       CONDITION1: yup.string().nullable(),
      // CONDITION3: yup.string().nullable()
    }),
    validateOnBlur: false,
    initialValues: initValue,
    enableReinitialize: true,
    onSubmit: (data: Record<string, any>) => {
      if (CODE.ACTIONCLICK === "Edit") {
        LssITA27EditAPI(data)
          .then((res) => {
            Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(() => {
              CODE.onFetchData();
              CODE.onModal(false);
            });
          })
          .catch((err) => {
            if (err.response.data.status === 404) {
              Swal.fire("รหัสไม่ถูกต้อง", "รหัสรหัสคีย์ไม่มีในระบบตรวจสอบการกรอกข้อมูลอีกครั้ง ", "warning");
            }
            if (err.status === 400) {
              Swal.fire("แจ้งเตือน", "ตรวจสอบการกรอกข้อมูลอีกครั้ง", "warning");
            }
          });
      }
      if (CODE.ACTIONCLICK === "Add") {
        LssITA27SaveAPI(data)
          .then((res) => {
            Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(() => {
              CODE.onFetchData();
              CODE.onModal(false);
            });
          })
          .catch((err) => {

            if (err.response.data.status === 400) {
              Swal.fire("รหัสซ้ำ", "รหัสคีย์หลักซ้ำตรวจสอบการกรอกข้อมูลอีกครั้ง ", "warning");
            }
            if (err.status === 400) {
              Swal.fire("แจ้งเตือน", "ตรวจสอบการกรอกข้อมูลอีกครั้ง", "warning");
            }
          });
      }
    },
  });

  return (
    <>
      <div style={{ width: "100%" }}>
        <Container>
          <Row>
            <Col>
              <Form onSubmit={form.handleSubmit}>
                <Card className="mt-5">
                  <Card.Header>ดำเนินการ</Card.Header>
                  <Card.Body>
                    <Row>
                      <Col>
                        <Form.Group as={Row} className="mb-3">
                          <Col>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="2">
                                รหัสตัวแปร*
                              </Form.Label>
                              <Col sm={10}>
                                <Form.Control
                                  type="text"
                                  name="CODE"
                                  value={form.values.CODE}
                                  readOnly={CODE.showReadOnly}
                                  onChange={form.handleChange}
                                  isInvalid={!!form.errors.CODE}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {form.errors.CODE}
                                </Form.Control.Feedback>
                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
 
                    </Row>

                    <Row>
    
                      <Col>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="2">
                            ชื่อตัวแปร*
                          </Form.Label>
                          <Col sm={10}>
                            <Form.Control
                              type="text"
                              name="NAME"
                              value={form.values.NAME}
                              readOnly={CODE.showReadOnly}
                              onChange={form.handleChange}
                              isInvalid={!!form.errors.NAME}
                            />
                            <Form.Control.Feedback type="invalid">
                              {form.errors.NAME}
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>


                    


                    <Row>
                      <Col>
                        <Form.Group as={Row} className="mb-3">
                          <Col>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="2">
                                ค่าตัวแปร *
                              </Form.Label>
                              <Col sm={10}>
                                <Form.Control
                                  as={"textarea"}
                                  name="VALUE"
                                  readOnly={CODE.showReadOnly}
                                  value={form.values.VALUE}
                                  onChange={form.handleChange}
                                  isInvalid={!!form.errors.VALUE}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {form.errors.VALUE}
                                </Form.Control.Feedback>
                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
 
                    </Row>


                    <Row>
 
                      <Col>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="2">
                            คำอธิบาย *
                          </Form.Label>
                          <Col sm={10}>
                            <Form.Control
                             as={"textarea"}
                              type="text"
                              name="DESCRIPTION"
                              value={form.values.DESCRIPTION}
                              disabled={CODE.showReadOnly}
                              onChange={form.handleChange}
                              isInvalid={!!form.errors.DESCRIPTION}
                            />
                            <Form.Control.Feedback type="invalid">
                              {form.errors.DESCRIPTION}
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
 
                      <Col>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="2">
                            เงื่อนไข
                          </Form.Label>
                          <Col sm={10}>
                            <Form.Control
                             as={"textarea"}
                              type="text"
                              name="CONDITION1"
                              value={form.values.CONDITION1}
                              disabled={CODE.showReadOnly}
                              onChange={form.handleChange}
                              isInvalid={!!form.errors.CONDITION1}
                            />
                            <Form.Control.Feedback type="invalid">
                              {form.errors.CONDITION1}
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={8}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="4">
                                สถานะ *
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Check
                                  inline
                                  label="ใช้งาน"
                                  name="ENABLE1"
                                  type="radio"
                                  id={`inline-radio-1`}
                                  value="Y"
                                  disabled={CODE.showReadOnly}
                                  checked={senable === "Y"}
                                  onChange={(event) => {
                                    form.values.ENABLE = event.target.value;
                                    setSenable(event.target.value);
                                  }}
                                />
                                <Form.Check
                                  inline
                                  label="ไม่ใช้งาน"
                                  name="ENABLE1"
                                  type="radio"
                                  id={`inline-radio-2`}
                                  value="N"
                                  disabled={CODE.showReadOnly}
                                  checked={senable === "N"}
                                  onChange={(event) => {
                                    form.values.ENABLE = event.target.value;
                                    setSenable(event.target.value);
                                  }}
                                />
                                <Form.Control
                                  name="ENABLE"
                                  value={senable}
                                  id="ENABLE"
                                  type="hidden"
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}></Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Row className="justify-content-center my-3">
                  <Col sm="1" className="d-flex justify-content-center">
                    <Button
                      className="mt-2"
                      disabled={!form.isValid || form.isValidating}
                      type="submit"
                      variant="primary"
                      style={{ display: `${CODE.showBtn}` }}
                    >
                      บันทึก
                    </Button>
                  </Col>
                  <Col sm="1" className="d-flex justify-content-center">
                    <Button
                      className="mt-2"
                      variant="danger"
                      onClick={() => {
                        CODE.onModal(false);
                      }}
                    >
                      ยกเลิก
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default LssITA27Modal;
