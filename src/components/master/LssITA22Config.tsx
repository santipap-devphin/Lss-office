import { useState, useEffect, FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
//import Recapcha from "react-google-recaptcha";
import { Card, Col, Form, Row, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  LssITA22List,
  LssITA22Save,
  LssITA22Edit,
  LssITA22Search,
  // getDocTypes,
  // getCommon,
} from "../../data";
import { LSS_T_TEMPLATE_MAIL } from "../../models/office/LSS_T_TEMPLATE_MAIL.model";

const LssITA22Config: FC<{
  CODE: any;
  ACTIONCLICK: any;
  onFetchData: any;
  onModal: any;
  showBtn: any;
  showReadOnly: any;
}> = (CODE, ACTIONCLICK) => {


  useEffect(() => {
   
  }, []);

  const initValue : LSS_T_TEMPLATE_MAIL = {
    CC: "",
    CODE: "",
    BCC: "",
    BODY: "",
    FROM: "",
    TO: "",
    SEND_REPEAT: "",
    NAME: "",
    DESCIPTION: "",
    REPLY: "",
    SUBJECT: "",
    ENABLE: "",
  };

  const form = useFormik({
    validationSchema: yup.object().shape({
      SIGNATOR2: yup.string().nullable(),
      SUBJECT: yup.string().nullable().required("กรุณาป้อนหัวข้อการส่งเมลล์"),
      BODY: yup.string().nullable().required("กรุณาป้อนข้อความ"),
      CODE: yup.string().nullable().required("กรุณาป้อนรหัสข้อมูล"),
      NAME: yup.string().nullable().required("กรุณาป้อนข้อมูลตัวแปร"),
      DESCIPTION: yup.string().nullable().required("กรุณาป้อนรายละเอียดเพิ่มเติม"),
      CC: yup.string().nullable(),
      REPLY: yup.string().nullable(),
      // VALUE: yup.string().nullable().required("กรุณาป้อนค่าข้อมูล"),
      // ENABLE: yup.string().nullable(),
      //ENABLE1: yup.string().nullable().required("กรุณาเลือกข้อมูล"),
      // CONDITION2: yup.string().nullable(),
      // CONDITION3: yup.string().nullable()
    }),
    validateOnBlur: false,
    initialValues: initValue,
    enableReinitialize: true,
    onSubmit: (data: Record<string, any>) => {
      if (CODE.ACTIONCLICK === "Edit") {
        LssITA22Edit(data)
          .then((res) => {
            Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(() => {
              CODE.onFetchData();
              CODE.onModal(false);
            });
          })
          .catch((err) => {
            if (err.response.data.status === 404) {
              Swal.fire(
                "รหัสไม่ถูกต้อง",
                "รหัสรหัสคีย์ไม่มีในระบบตรวจสอบการกรอกข้อมูลอีกครั้ง ",
                "warning"
              );
            }
            if (err.status === 400) {
              Swal.fire("แจ้งเตือน", "ตรวจสอบการกรอกข้อมูลอีกครั้ง", "warning");
            }
          });
      }
      if (CODE.ACTIONCLICK === "Add") {
        LssITA22Save(data)
          .then((res) => {
            Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(() => {
              CODE.onFetchData();
              CODE.onModal(false);
            });
          })
          .catch((err) => {
            if (err.response.data.status === 404) {
              Swal.fire(
                "รหัสซ้ำ",
                "รหัสคีย์หลักซ้ำตรวจสอบการกรอกข้อมูลอีกครั้ง ",
                "warning"
              );
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
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            ชื่อการส่งอีเมล*
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
                    </Row>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={8}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="4">
                                หัวข้อการส่งอีเมล *
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Control
                                  type="text"
                                  name="SUBJECT"
                                  readOnly={CODE.showReadOnly}
                                  value={form.values.SUBJECT}
                                  onChange={form.handleChange}
                                  isInvalid={!!form.errors.SUBJECT}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {form.errors.SUBJECT}
                                </Form.Control.Feedback>
                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            รายละเอียด *
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="textarea"
                              name="DESCIPTION"
                              value={form.values.DESCIPTION}
                              disabled={CODE.showReadOnly}
                              onChange={form.handleChange}
                              isInvalid={!!form.errors.DESCIPTION}
                            />
                            <Form.Control.Feedback type="invalid">
                              {form.errors.DESCIPTION}
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    {/* test */}
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={8}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="4">
                                สำเนาการส่งอีเมล
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Control
                                  type="text"
                                  name="CC"
                                  readOnly={CODE.showReadOnly}
                                  value={form.values.CC}
                                  onChange={form.handleChange}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            อีเมลตอบกลับ
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="textarea"
                              name="REPLY"
                              value={form.values.REPLY}
                              disabled={CODE.showReadOnly}
                              onChange={form.handleChange}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    {/* test */}
                    <Row>
                      <Col sm={12} md={12}>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={8}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="4">
                                ข้อความ *
                              </Form.Label>
                              <Col sm={12}>
                                <Form.Control
                                  type="textarea"
                                  name="BODY"
                                  value={form.values.BODY}
                                  disabled={CODE.showReadOnly}
                                  onChange={form.handleChange}
                                  isInvalid={!!form.errors.BODY}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {form.errors.BODY}
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
                                  // checked={senable === "Y"}
                                  // onChange={(event) => {
                                  //   form.values.ENABLE = event.target.value;
                                  //   setSenable(event.target.value);
                                  // }}
                                />
                                <Form.Check
                                  inline
                                  label="ไม่ใช้งาน"
                                  name="ENABLE1"
                                  type="radio"
                                  id={`inline-radio-2`}
                                  value="N"
                                  disabled={CODE.showReadOnly}
                                  // checked={senable === "N"}
                                  // onChange={(event) => {
                                  //   form.values.ENABLE = event.target.value;
                                  //   setSenable(event.target.value);
                                  // }}
                                />
                                <Form.Control
                                  name="ENABLE"
                                  // value={senable}
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

export default LssITA22Config;
