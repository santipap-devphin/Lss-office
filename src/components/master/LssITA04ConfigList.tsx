import { useState, useEffect, FC, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
//import Recapcha from "react-google-recaptcha";
import { Card, Col, Form, Row, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  LssITA04SaveDetail,
  LssITA04SearchAPI,
  LssITA04EditAPI,
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
import { DatePicker, DatePickerProps, TimePicker } from "antd";
import moment,{ Moment } from "moment";
import { toThaiDateString } from "../../functions/Date";
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

const styles = {
  datpicker: {
    width: "100%",
    height: "100%",
    verticalAlign: "middle",
  },
};

const LssITA04Modal: FC<{
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

  const [Sdate, setFrom] = useState<Moment | null>(null);

  const customDateFormat: DatePickerProps["format"] = (date: Moment) => {
    return toThaiDateString(date.toDate(), "DD/MM/YYYY");
  };

  const handleFromChanged = useCallback((date: Moment | null) => {
    setFrom(date);
    //form.values.DATE = String(date);
  }, []);


  const handleLogout = () => {
    clearData().then(() => {
      logout();
    });
  };


  const fnFetchData = () => {
    if (CODE.ACTIONCLICK === "Edit" || CODE.ACTIONCLICK === "Display") {
      LssITA04SearchAPI(CODE).then((data: any) => {
        let tmpSchema = [];
        for (let i = 0; i < data.length; i++) {
          tmpSchema.push({
            CODE: data[i].CODE,
            DATE: data[i].DATE,
            NAME: data[i].DF_NAME,
            ENABLE: data[i].ENABLE,
          });
        }
        handleFromChanged(moment(data[0].DATE))
        setSenable(data[0].ENABLE);
        form.setValues(tmpSchema[0]);
      });
    } //EDIT
  };

  useEffect(() => {
    fnFetchData();
    if(CODE.ACTIONCLICK === "Add"){
      setSenable("Y");
    }
  }, []);

  const initValue = {
    CODE: "",
    NAME: "",
    DATE: "",
    ENABLE: "",
  };

  const form = useFormik({
    validationSchema: yup.object().shape({
      //CODE: yup.string().nullable().required("กรุณาป้อนรหัส"),
      NAME: yup.string().nullable().required("กรุณาป้อนชื่อวันหยุด"),
      DATE: yup.string().nullable(),
      ENABLE: yup.string().nullable(),
      //ENABLE1: yup.string().nullable().required("กรุณาเลือกข้อมูล"),
      // CONDITION2: yup.string().nullable(),
      // CONDITION3: yup.string().nullable()
    }),
    validateOnBlur: false,
    initialValues: initValue,
    enableReinitialize: true,
    onSubmit: (data: Record<string, any>) => {
      console.log('on Submit -->');
      data.DATE = String(moment(Sdate).format("DD/MM/YYYY"));
      data.ENABLE = senable;
      console.log(data);
      if(data.DATE == "Invalid date"){
        Swal.fire("แจ้งเตือน", "กรุณาใส่วันที่", "warning");
        return;
      }else if(data.NAME == ""){
        Swal.fire("แจ้งเตือน", "กรุณาใส่ชื่อวันหยุด", "warning");
        return;
      }
      else if(data.ENABLE == "" && senable == ""){
        Swal.fire("แจ้งเตือน", "กรุณาใส่สถานะ", "warning");
        return;
      }
      if (CODE.ACTIONCLICK === "Edit") {
        LssITA04SaveDetail(data)
          .then((res) => {
            Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(() => {
              CODE.onFetchData();
              CODE.onModal(false);
            });
          })
          .catch((err) => {
            // if (err.response.data.status === 404) {
            //   Swal.fire("รหัสไม่ถูกต้อง", "รหัสรหัสคีย์ไม่มีในระบบตรวจสอบการกรอกข้อมูลอีกครั้ง ", "warning");
            // }
            // if (err.status === 400) {
              Swal.fire("แจ้งเตือน", "ตรวจสอบการกรอกข้อมูลอีกครั้ง", "warning");
            // }
          });
      }
      if (CODE.ACTIONCLICK === "Add") {
        data.CODE = "0";
        LssITA04SaveDetail(data)
          .then((res) => {
            Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(() => {
              CODE.onFetchData();
              CODE.onModal(false);
            });
          })
          .catch((err) => {

            // if (err.response.data.status === 400) {
            //   Swal.fire("รหัสซ้ำ", "รหัสคีย์หลักซ้ำตรวจสอบการกรอกข้อมูลอีกครั้ง ", "warning");
            // }
            // if (err.status === 400) {
              Swal.fire("แจ้งเตือน", "ตรวจสอบการกรอกข้อมูลอีกครั้ง", "warning");
            // }
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
                    {/* <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={8}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="4">
                                รหัส*
                              </Form.Label>
                              <Col sm={8}>
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
                    </Row> */}
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={8}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="4">
                                ชื่อวันหยุด*
                              </Form.Label>
                              <Col sm={8}>
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
                    </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group as={Row} className="mb-3">
                        <Col sm={8}>
                          <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="4">
                              วันที่ *
                            </Form.Label>
                            <Col sm={8}>
                            <DatePicker
                              name="DATE"
                              allowClear={true}
                              format={customDateFormat}
                              value={Sdate}
                              onChange={handleFromChanged}
                              className="form-control"
                              style={styles.datpicker}
                              disabled={CODE.showReadOnly}
                            />
                              {/* <Form.Control
                                type="text"
                                name="VALUE"
                                readOnly={CODE.showReadOnly}
                                value={form.values.DATE}
                                onChange={form.handleChange}
                                isInvalid={!!form.errors.DATE}
                              />*/}
                              <Form.Control.Feedback type="invalid">
                                {form.errors.DATE}
                              </Form.Control.Feedback> 
                            </Col>
                          </Form.Group>
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

export default LssITA04Modal;
