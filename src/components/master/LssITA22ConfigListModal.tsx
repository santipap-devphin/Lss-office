import { Radio } from "antd";
import { FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import * as yup from "yup";
import { LssITA22, LssITA22Edit, LssITA22Save } from "../../data";
import { LSS_T_TEMPLATE_MAIL } from "../../models/office/LSS_T_TEMPLATE_MAIL.model";
import { TextEditor } from "../fragments/TextEditor";

export type ITA22ConfigModalProps = "DISPLAY" | "EDIT" | "ADD";

const titles = {
  ADD: "เพิ่มข้อมูล",
  EDIT: "แก้ไขข้อมูล",
  DISPLAY: "แสดงข้อมูล",
};

const initialValues: LSS_T_TEMPLATE_MAIL = {
  CODE: "",
  SUBJECT: "",
  DESCIPTION: "",
  NAME: "",
  TO: "",
  BCC: "",
  BODY: "",
  CC: "",
  FROM: "",
  REPLY: "",
  SEND_REPEAT: "0",
  ENABLE: "Y",
};

const LssITA22ConfigListModal: FC<{
  code: string;
  mode: ITA22ConfigModalProps;
  show: boolean;
  onClose(): void;
}> = ({ code, mode, show, onClose }) => {
  const onLoad = () => {
    if (mode !== "ADD") {
      LssITA22(code).then((data) => {
        setValues({
          ...data,
          DESCIPTION: data.DESCIPTION ?? "",
        } as LSS_T_TEMPLATE_MAIL);
      });
    } else {
      setValues({ ...initialValues });
    }
    setErrors({});
  };

  const formSubmit = (values: LSS_T_TEMPLATE_MAIL) => {
    if (mode === "ADD") {
      LssITA22Save(values as LSS_T_TEMPLATE_MAIL)
        .then((res) => {
          Swal.fire({
            icon: "success",
            text: "บันทึกข้อมูลเรียบร้อยแล้ว",
          }).then(() => {
            onClose();
          });
        })
        .catch((err) => {
          const { data } = err;
          if (data && err.status === 400) {
            for (let key in data as Record<string, any>) {
              setFieldError(key, data[key][0]);
            }

            Swal.fire({
              icon: "error",
              text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบความถูกต้องของข้อมูล!",
            });
          } else {
            Swal.fire({
              icon: "error",
              text: "ไม่สามารถบันทึกข้อมูลได้!",
            });
          }
        });
    }
    if (mode === "EDIT") {
      LssITA22Edit(values as LSS_T_TEMPLATE_MAIL)
        .then((res) => {
          Swal.fire({
            icon: "success",
            text: "บันทึกข้อมูลเรียบร้อยแล้ว",
          }).then(() => {
            onClose();
          });
        })
        .catch((err) => {
          const { data } = err;
          if (data && err.status === 400) {
            for (let key in data as Record<string, any>) {
              setFieldError(key, data[key][0]);
            }

            Swal.fire({
              icon: "error",
              text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบความถูกต้องของข้อมูล!",
            });
          } else {
            Swal.fire({
              icon: "error",
              text: "ไม่สามารถบันทึกข้อมูลได้!",
            });
          }
        });
    }
  };

  const formik = useFormik({
    validationSchema: yup.object().shape(
      mode === "ADD"
        ? {
          CODE: yup
            .string()
            .required("กรุณากรอกรหัส")
            .matches(
              /^[a-zA-Z][a-zA-Z0-9]*$/i,
              "รหัสต้องเป็นภาษาอังกฤษหรือตัวเลขเท่านั้นและต้องไม่เรื่มต้นด้วยตัวเลข"
            ),
          NAME: yup.string().nullable().required("กรุณากรอกชื่อการส่งอีเมล"),
          SUBJECT: yup.string().nullable().required("กรุณากรอกหัวข้อการส่งอีเมล"),
          DESCIPTION: yup.string().nullable().required("กรุณากรอกรายละเอียด"),
          BODY: yup.string().nullable().required("กรุณากรอกข้อความ"),
        }
        : mode === "EDIT"
          ? {
            CODE: yup
              .string()
              .required("กรุณากรอกรหัส")
              .matches(
                /^[a-zA-Z][a-zA-Z0-9]*$/i,
                "รหัสต้องเป็นภาษาอังกฤษหรือตัวเลขเท่านั้นและต้องไม่เรื่มต้นด้วยตัวเลข"
              ),
            NAME: yup.string().nullable().required("กรุณากรอกชื่อการส่งอีเมล"),
            SUBJECT: yup.string().nullable().required("กรุณากรอกหัวข้อการส่งอีเมล"),
            DESCIPTION: yup.string().nullable().required("กรุณากรอกรายละเอียด"),
            BODY: yup.string().nullable().required("กรุณากรอกข้อความ"),
          }
          : {}
    ),
    validateOnBlur: true,
    initialValues,
    onSubmit: formSubmit,
  });

  const {
    handleSubmit,
    handleChange,
    setErrors,
    setValues,
    errors,
    values,
    isValid,
    setFieldError,
    setFieldValue
  } = formik

  return (
    <FormikProvider value={formik}>
      <Modal
        size="xl"
        show={show}
        onShow={onLoad}
        backdrop="static"
        onHide={onClose}
      >
        <Form noValidate onSubmit={handleSubmit}>
          <Modal.Header closeButton>{titles[mode]}</Modal.Header>
          <Modal.Body>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="text-end">
                รหัส:
                {mode === "ADD" ? <span className="text-danger">*</span> : null}
              </Form.Label>
              <Col sm="3">
                <Form.Control
                  type="text"
                  name="CODE"
                  readOnly={mode === "DISPLAY" || mode === "EDIT"}
                  value={values.CODE || ""}
                  onChange={handleChange}
                  isInvalid={!!errors.CODE}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.CODE}
                </Form.Control.Feedback>
              </Col>
              <Form.Label column sm="2" className="text-end">
                ชื่อการส่งอีเมล:
                {mode !== "DISPLAY" ? (
                  <span className="text-danger">*</span>
                ) : null}
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  name="NAME"
                  value={values.NAME || ""}
                  readOnly={mode === "DISPLAY"}
                  isInvalid={!!errors.NAME}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.NAME}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="text-end">
                หัวข้อการส่งอีเมล:
                {mode !== "DISPLAY" ? (
                  <span className="text-danger">*</span>
                ) : null}
              </Form.Label>
              <Col>
                <Form.Control
                  as={"textarea"}
                  rows={3}
                  name="SUBJECT"
                  readOnly={mode === "DISPLAY"}
                  value={values.SUBJECT}
                  isInvalid={!!errors.SUBJECT}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.SUBJECT}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="text-end">
                รายละเอียด:
                {mode !== "DISPLAY" ? (
                  <span className="text-danger">*</span>
                ) : null}
              </Form.Label>
              <Col>
                <Form.Control
                  as={"textarea"}
                  rows={3}
                  name="DESCIPTION"
                  readOnly={mode === "DISPLAY"}
                  onChange={handleChange}
                  value={values.DESCIPTION}
                  isInvalid={!!errors.DESCIPTION}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.DESCIPTION}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="text-end">
                สำเนาการส่งอีเมล:
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  name="CC"
                  value={values.CC || ""}
                  readOnly={mode === "DISPLAY"}
                  isInvalid={!!errors.CC}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.CC}
                </Form.Control.Feedback>
              </Col>

              <Form.Label column sm="2" className="text-end">
                สำเนา BCC:
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  name="BCC"
                  value={values.BCC || ""}
                  readOnly={mode === "DISPLAY"}
                  isInvalid={!!errors.BCC}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.BCC}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="text-end">
                อีเมลตอบกลับ:
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  name="REPLY"
                  value={values.REPLY || ""}
                  readOnly={mode === "DISPLAY"}
                  isInvalid={!!errors.REPLY}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.BCC}
                </Form.Control.Feedback>
              </Col>
              <Form.Label column sm="2" className="text-end">
                การส่ง:
              </Form.Label>
              <Col className="d-flex align-items-center">
                <Radio.Group
                  name="SEND_REPEAT"
                  disabled={mode === "DISPLAY"}
                  value={values.SEND_REPEAT}
                  onChange={handleChange}
                >
                  <Radio value={"0"}>ครั้งเดียว</Radio>
                  <Radio value={"1"}>ส่งซ้ำ</Radio>
                </Radio.Group>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="text-end">
                ข้อความ:
                {mode !== "DISPLAY" ? (
                  <span className="text-danger">*</span>
                ) : null}
              </Form.Label>
              <Col>
                <div style={{ height: "300px" }}>
                  <TextEditor
                    onChange={(val: String) => {
                      setFieldValue("BODY", val)
                    }}
                    value={values.BODY || ""}
                    isInvalid={!!errors.BODY}
                    readOnly={mode === "DISPLAY"}>
                  </TextEditor>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.BODY}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2" className="text-end">
                สถานะ:
                {mode !== "DISPLAY" ? (
                  <span className="text-danger">*</span>
                ) : null}
              </Form.Label>
              <Col className="d-flex align-items-center">
                <Radio.Group
                  name="ENABLE"
                  disabled={mode === "DISPLAY"}
                  value={values.ENABLE}
                  onChange={handleChange}
                >
                  <Radio value={"Y"}>ใช้งาน</Radio>
                  <Radio value={"N"}>ไม่ใช้งาน</Radio>
                </Radio.Group>
              </Col>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            {mode !== "DISPLAY" ? (
              <Button disabled={!isValid} type="submit" variant={"primary"}>
                บันทึก
              </Button>
            ) : null}
            <Button type="button" variant={"danger"} onClick={onClose}>
              ยกเลิก
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </FormikProvider>
  );
};

export default LssITA22ConfigListModal;
