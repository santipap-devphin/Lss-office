import { useState, useEffect, FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
//import Recapcha from "react-google-recaptcha";
import { Card, Col, Form, Row, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  LssITA02Search,
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

const LssITA02Modal: FC<{
  CODE: any;
  ACTIONCLICK: any;
  onFetchData: any;
  onModal: any;
  showBtn: any;
  showReadOnly: any;
}> = (CODE, ACTIONCLICK) => {
  //console.log(CODE);

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
      COMPANY_CODE: any;
      COMPANY_NAME: any;
      CREATED_DATE: any;
      CREATE_USER: any;
      DEL: any;
      ENABLE: any;
      ISSUER: any;
      NOT_AFTER: any;
      NOT_BEFORE: any;
      SERIAL_NUMBER: any;
      SIGNATURE_ALGORITHM: any;
      STATUS: any;
      SUBJECT: any;
      THUMB_PRINT: any;
      UPDATED_DATE: any;
      UPDATE_USER: any;
      VERSION: any;
    }[]
  >([]);

  const fnFetchData = () => {
    if (CODE.ACTIONCLICK === "Edit" || CODE.ACTIONCLICK === "Display") {
      LssITA02Search(CODE).then((data: any) => {
        let tmpSchema = [];
        for (let i = 0; i < data.length; i++) {
          var parts = data[i].NOT_BEFORE.split("-");
          var year = parseFloat(parts[0]) + 543; 
          var date = parts[2].split("T");
          var strBefor = date[0] + "/" + parts[1] + "/" + String(year);
          data[i].NOT_BEFORE = strBefor;

          var parts = data[i].NOT_AFTER.split("-");
          var year = parseFloat(parts[0]) + 543; 
          var date = parts[2].split("T");
          var strAfter = date[0] + "/" + parts[1] + "/" + String(year);
          data[i].NOT_AFTER = strAfter;
          
          tmpSchema.push({
            id: data[i].CODE,
            CODE: data[i].CODE,
            COMPANY_CODE: data[i].COMPANY_CODE,
            COMPANY_NAME: data[i].COMPANY_NAME,
            CREATED_DATE: data[i].CREATED_DATE,
            CREATE_USER: data[i].CREATE_USER,
            DEL: data[i].DEL,
            ENABLE: data[i].ENABLE,
            ISSUER: data[i].ISSUER,
            NOT_AFTER: data[i].NOT_AFTER,
            NOT_BEFORE: data[i].NOT_BEFORE,
            SERIAL_NUMBER: data[i].SERIAL_NUMBER,
            SIGNATURE_ALGORITHM: data[i].SIGNATURE_ALGORITHM,
            STATUS: data[i].STATUS,
            SUBJECT: data[i].SUBJECT,
            THUMB_PRINT: data[i].THUMB_PRINT,
            UPDATED_DATE: data[i].UPDATED_DATE,
            UPDATE_USER: data[i].UPDATE_USER,
            VERSION: data[i].VERSION,
          });
          //console.log(data[0])
          form.setValues(data[0]);
        }
        setTableDataSearch(tmpSchema);

      });
    } //EDIT
  };

  useEffect(() => {
    fnFetchData();
  }, []);

  const initValue = {
    CODE: "",
    COMPANY_CODE: "",
    COMPANY_NAME: "",
    CREATED_DATE: "",
    CREATE_USER: "",
    DEL: "",
    ENABLE: "",
    ISSUER: "",
    NOT_AFTER: "",
    NOT_BEFORE: "",
    SERIAL_NUMBER: "",
    SIGNATURE_ALGORITHM: "",
    STATUS: "",
    SUBJECT: "",
    THUMB_PRINT: "",
    UPDATED_DATE: "",
    UPDATE_USER: "",
    VERSION: "",
  };

  const form = useFormik({
    validationSchema: yup.object().shape({
      SIGNATOR2: yup.string().nullable(),
      CODE: yup.string().nullable().required("กรุณาป้อนรหัสข้อมูล"),
      NAME: yup.string().nullable().required("กรุณาป้อนข้อมูลตัวแปร"),
      DESCRIPTION: yup.string().nullable().required("กรุณาป้อนข้อมูลคำอธิบาย"),
      VALUE: yup.string().nullable().required("กรุณาป้อนค่าข้อมูล"),

    }),
    validateOnBlur: false,
    initialValues: initValue,
    enableReinitialize: true,
    onSubmit: (data: Record<string, any>) => {

    }
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
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={8}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="4">
                                เลขใบรับรอง
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Control
                                  type="text"
                                  name="SERIAL_NUMBER"
                                  value={form.values.SERIAL_NUMBER}
                                />

                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}>

                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={8}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="4">
                                บริษัท
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Control
                                  type="text"
                                  name="COMPANY_CODE: "
                                  value={form.values.COMPANY_NAME}
                                />

                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            ประเภทธุรกิจ
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="text"
                              name="SUBJECT: "
                              value={form.values.SUBJECT}
                            />
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
                                วันที่สมัคร
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Control
                                  type="text"
                                  name="NOT_BEFORE"
                                  value={form.values.NOT_BEFORE}
                                />

                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            วันที่หมดอายุ
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="text"
                              name="NOT_AFTER"
                              defaultValue={form.values.NOT_AFTER}
                            />
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
                                ลายมือชื่ออิเล็กทรอนิคส์
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Control
                                  type="text"
                                  name="THUMB_PRINT"
                                  value={form.values.THUMB_PRINT}
                                />

                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}>

                      </Col>
                    </Row>




                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={8}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="4">
                                อัลกอริทึม
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Control
                                  type="text"
                                  name="SIGNATURE_ALGORITHM"
                                  value={form.values.SIGNATURE_ALGORITHM}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            ลายมือชื่ออิเล็กทรอนิกส์
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="text"
                              name="SIGNATURE_ALGORITHM"
                              value={form.values.SIGNATURE_ALGORITHM}
                            />
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
                                สถานะ
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Control
                                  type="text"
                                  name="STATUS"
                                  value={form.values.STATUS}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">

                          </Form.Label>
                          <Col sm={8}>

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
                                  checked={form.values.ENABLE === "Y"}
                                />
                                <Form.Check
                                  inline
                                  label="ไม่ใช้งาน"
                                  name="ENABLE1"
                                  type="radio"
                                  id={`inline-radio-2`}
                                  value="N"
                                  disabled={CODE.showReadOnly}
                                  checked={form.values.ENABLE === "N"}
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

export default LssITA02Modal;
