import { useFormik } from "formik";
import * as yup from "yup";
import { Card, Col, Form, Row, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { LssITA22Save } from "../../data";
import NavMenu from "../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
const _LssITA22Config = () => {
  let navigate = useNavigate();
  const form = useFormik({
    validationSchema: yup.object().shape({
      SIGNATOR2: yup.string().nullable(),
      BODY: yup.string().nullable().required("กรุณาป้อนข้อความ"),
      CODE: yup.string().nullable(),
      NAME: yup.string().nullable().required("กรุณาป้อนข้อมูลตัวแปร"),
      DESCIPTION: yup.string().nullable().required("กรุณาป้อนข้อมูลคำอธิบาย"),
      SUBJECT: yup.string().nullable().required("กรุณาป้อนค่าหัวเรื่องการส่งเมลล์"),
      CC: yup.string().nullable(),
      REPLY: yup.string().nullable(),
    }),
    validateOnBlur: false,
    initialValues: {
      id: "",
      BODY: "",
      CC: "",
      FROM: "",
      TO: "",
      REPLY: "",
      CODE: "",
      DESCIPTION: "",
      NAME: "",
      SUBJECT: "",
      ENABLE: "",
      SEND_REPEAT: "",
      BCC: "",
    },
    onSubmit: (data: Record<string, any>) => {
      LssITA22Save(data)
        .then((res) => {
          Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(() => {
            navigate("/LSS-IT-A22");
          });
        })
        .catch((err) => {
          if (err.status === 400) {
            Swal.fire("แจ้งเตือน", "ตรวจสอบการกรอกข้อมูลอีกครั้ง", "warning");
          }
        });
    },
  });

  return (
    <>
      <NavMenu />
      <div style={{ width: "100%", marginTop: 100 }}>
        <h5>
          <FaBars size={30} style={{ margin: "auto" }} />
          &nbsp;&nbsp;LSS-IT-A22 TEMPLATE E-MAIL{" "}
        </h5>
        <Container>
          <Row>
            <Col>
              <Form onSubmit={form.handleSubmit}>
                <Card className="mt-5">
                  <Card.Header>เพิ่มข้อมูลใหม่</Card.Header>
                  <Card.Body>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={8}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="4">
                                รหัส *
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Control
                                  type="text"
                                  name="CODE"
                                  value={form.values.CODE}
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
                            ชื่อการส่งเมลล์ *
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="text"
                              name="NAME"
                              value={form.values.NAME}
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
                                หัวข้อการส่งเมลล์ *
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Control
                                  type="text"
                                  name="SUBJECT"
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
                      <Col sm={12} md={6}></Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={8}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="4">
                                รายละเอียด *
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Control
                                  type="text"
                                  name="DESCIPTION"
                                  value={form.values.DESCIPTION}
                                  onChange={form.handleChange}
                                  isInvalid={!!form.errors.DESCIPTION}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {form.errors.DESCIPTION}
                                </Form.Control.Feedback>
                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}></Col>
                    </Row>
                  </Card.Body>
                </Card>
                <Row>
                  <Col sm={12} md={6}>
                    <Form.Group as={Row} className="mb-3">
                      <Col sm={8}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            สำเนาการส่งเมลล์
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="text"
                              name="CC"
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
                        เมลตอบกลับ
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="textarea"
                          name="REPLY"
                          value={form.values.REPLY}
                          onChange={form.handleChange}
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
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
                <Row className="justify-content-center my-3">
                  <Col sm="1" className="d-flex justify-content-center">
                    <Button
                      className="mt-2"
                      disabled={!form.isValid || form.isValidating}
                      type="submit"
                      variant="primary"
                    >
                      บันทึก
                    </Button>
                  </Col>
                  <Col sm="1" className="d-flex justify-content-center">
                    <Button
                      className="mt-2"
                      disabled={!form.isValid || form.isValidating}
                      type="submit"
                      variant="danger"
                      onClick={() => {
                        navigate("/LSS-IT-A27-CONFIG");
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
export default _LssITA22Config;
