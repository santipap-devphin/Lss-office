import { useFormik } from "formik";
import * as yup from "yup";
import { Card, Col, Form, Row, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { LssITA05Save } from "../../data";
import NavMenu from "../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
const _LssITA05Config = () => {
  let navigate = useNavigate();
  const form = useFormik({
    validationSchema: yup.object().shape({
      SIGNATOR2: yup.string().nullable(),
      DESCRIPTION: yup.string().nullable().required("กรุณาป้อนข้อความที่แสดง"),
      ANOUNCE_GROUP_CODE: yup.string().nullable().required("กรุณาป้อนข้อมูลกลุ่มประกาศ"),
      CODE: yup.string().nullable().required("กรุณาป้อนรหัสข้อมูล"),
      NAME: yup.string().nullable().required("กรุณาป้อนข้อมูลชื่อประกาศ"),
    }),
    validateOnBlur: false,
    initialValues: {
      id: "",
      CODE: "",
      NAME: "",
      // SQE: "",
      DESCRIPTION: "",
      ANOUNCE_GROUP_CODE: "",
      // TPYE_DISPLAY: "",
      ENABLE: "",
      COMMENT: "",
      CREATED_DATE: "",
    },
    onSubmit: (data: Record<string, any>) => {
      LssITA05Save(data)
        .then((res) => {
          Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(() => {
            navigate("/LSS-IT-A05");
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
                                รหัสประกาศ *
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
                            ชื่อประกาศ *
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
                                กลุ่มประกาศ *
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Control
                                  type="text"
                                  name="ANOUNCE_GROUP_CODE"
                                  value={form.values.ANOUNCE_GROUP_CODE}
                                  onChange={form.handleChange}
                                  isInvalid={!!form.errors.ANOUNCE_GROUP_CODE}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {form.errors.ANOUNCE_GROUP_CODE}
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
                                  name="DESCRIPTION"
                                  value={form.values.DESCRIPTION}
                                  onChange={form.handleChange}
                                  isInvalid={!!form.errors.DESCRIPTION}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {form.errors.DESCRIPTION}
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
export default _LssITA05Config;
