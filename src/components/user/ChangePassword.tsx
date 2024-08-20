import { FC } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import "./ChangePassword.module.scss";
import NavMenu from "../fragments/NavMenu";

const ChangePassword: FC<{}> = () => {
  const schema = yup.object().shape({
    old: yup.string().nullable().required("กรุณาป้อนรหัสผ่านเดิม"),
    new: yup.string().nullable().required("กรุณาป้อนรหัสผ่านใหม่"),
    confirm: yup
      .string()
      .required("กรุณาป้อนยืนยันรหัสใหม่")
      .oneOf([yup.ref("new"), null], "รหัสผ่านใหม่ไม่ตรงกัน"),
  });

  return (
    <>
      <Card className="card">
        <Card.Body>
          <NavMenu />
          <div style={{ width: "100%", marginTop: 100 }}>
            <h5>Title : LSS-EA-080 เปลี่ยนรหัสผ่าน</h5>
            <Formik
              validationSchema={schema}
              onSubmit={(values) => {
                throw Error("");
              }}
              initialValues={{
                old: "",
                new: "",
                confirm: "",
              }}
            >
              {({
                values,
                errors,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                isValid,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Card> 
                    <Card.Body>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                          ป้อนรหัสผ่านเดิม *
                        </Form.Label>
                        <Col sm="3">
                          <Form.Control
                            type="password"
                            value={values.old}
                            name="old"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="off"
                            isInvalid={!!errors.old}
                          />
                          <Col sm="7"/> 
                          <Form.Control.Feedback type="invalid">
                            {errors.old}
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                          ป้อนรหัสผ่านใหม่ *
                        </Form.Label>
                        <Col sm="3">
                          <Form.Control
                            type="password"
                            name="new"
                            value={values.new}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="off"
                            isInvalid={!!errors.new}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.new}
                          </Form.Control.Feedback>
                        </Col>
                        <Col sm="7"/> 
                      </Form.Group>

                      <Form.Group as={Row}>
                        <Form.Label column sm="2">
                          ยืนยันรหัสผ่านใหม่อีกครั้ง *
                        </Form.Label>
                        <Col sm="3">
                          <Form.Control
                            type="password"
                            name="confirm"
                            value={values.confirm}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="off"
                            isInvalid={!!errors.confirm}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.confirm}
                          </Form.Control.Feedback>
                        </Col>
                        <Col sm="7"/> 
                      </Form.Group>
                    </Card.Body>
                    <Card.Footer>
                      <Button type="submit" disabled={isSubmitting || !isValid}>
                        Save
                      </Button>
                    </Card.Footer>
                  </Card>
                </Form>
              )}
            </Formik>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default ChangePassword;
