import { ChangeEvent, FC, useRef } from "react";
import { FormikHelpers, useFormik } from "formik";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import * as yup from "yup";
import { LSS_T_STATE } from "../../../models/office/LSS_T_STATE.model";
import { Radio } from "antd";
import { LssITA24, LssITA24EditAPI, LssITA24SaveAPI, LssITA24UploadFile } from "../../../data";

import Swal from "sweetalert2";

export type ModelProps = "DISPLAY" | "EDIT" | "ADD";

const titles = {
  ADD: "เพิ่มข้อมูล",
  EDIT: "แก้ไขข้อมูล",
  DISPLAY: "แสดงข้อมูล",
};

const initialValues: LSS_T_STATE = {
  CODE: "",
  NAME: "",
  OIC_SHOW: "",
  COMPANY_SHOW: "",
  ENABLE: "Y",
  DEL: "N",
  CREATE_USER: "",
  UPDATE_USER: "",
  CREATED_DATE: new Date(),
  UPDATED_DATE: new Date(),
};

const PanelModal: FC<{
  code: string;
  show: boolean;
  mode: ModelProps;
  onClose(): void;
}> = ({ code, show, mode, onClose }) => {
  const handleOnShow = () => {
    if (mode !== "ADD") {
      LssITA24(code).then((data) => {
        setValues({ ...data });
        setErrors({});
      });
    } else {
      setValues(initialValues);
      setErrors({});
    }
  };

  const refIconFile = useRef<HTMLInputElement>()

  const onIconFileChang = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileType = file.type
      if (!/^image/.test(fileType)) {
        Swal.fire({
          text: `รองรับไฟล์ประรูปภาพเท่านั้น`,
          icon: "error",
        })
        e.preventDefault()
        e.target.value = ""
      }
    }
  }

  const uploadIcon = (code: string) => {
    const file = refIconFile.current?.files?.[0]
    if (file) {
      ///API upload here
      return LssITA24UploadFile({ CODE: code, fileName: file.name, formFile: file })
    }
    return Promise.resolve(true)
  }

  const onFormSubmit = (
    values: LSS_T_STATE,
    formikHelpers: FormikHelpers<LSS_T_STATE>
  ) => {
    if (mode === "ADD") {
      LssITA24SaveAPI(values)
        .then(() => {
          uploadIcon(values.CODE).then(() => {
            Swal.fire({
              text: `บันทึกข้อมูลเรียบร้อยแล้ว`,
              icon: "success",
            }).then(() => {
              onClose();
            });
          }).catch(() => {
            Swal.fire({
              text: `อัพโหลดไม่สำเร็จ`,
              icon: "error",
            })
          })
        })
        .catch((err) => {
          console.log(err);
          if (err?.status === 409) {
            Swal.fire({
              text: `รหัส '${values.CODE}' ไม่สามารถใช้งานได้`,
              icon: "warning",
            }).then(() => {
              setFieldError("CODE", `รหัส '${values.CODE}' ไม่สามารถใช้งานได้`);
            });
          } else if (err?.status === 400) {
            Swal.fire({
              text: `กรุณาตรวจสอบข้อมูลให้ถูกต้อง`,
              icon: "warning",
            });
          } else {
            Swal.fire({
              text: `Unexpected error!`,
              icon: "error",
            });
          }
        });
    }

    if (mode === "EDIT") {
      LssITA24EditAPI(values)
        .then(() => {
          uploadIcon(values.CODE).then(() => {
            Swal.fire({
              text: `บันทึกข้อมูลเรียบร้อยแล้ว`,
              icon: "success",
            }).then(() => {
              onClose();
            });
          }).catch(() => {
            Swal.fire({
              text: `อัพโหลดไม่สำเร็จ`,
              icon: "error",
            })
          })
        })
        .catch((err) => {
          if (err?.status === 400) {
            Swal.fire({
              text: `กรุณาตรวจสอบข้อมูลให้ถูกต้อง`,
              icon: "warning",
            });
          } else {
            Swal.fire({
              text: `Unexpected error!`,
              icon: "error",
            });
          }
        });
    }
  };

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    setErrors,
    setValues,
    setFieldError,
    isValid,
  } = useFormik({
    validationSchema: yup.object().shape(
      mode === "ADD"
        ? {
          CODE: yup
            .string()
            .required("กรุณากรอกรหัส")
            .matches(
              /^[a-zA-Z][a-zA-Z0-9]*$/i,
              "รหัสต้องเป็นภาษาอังกฤษหรือตัวเลขเท่านั้นและต้องไม่เรื่มต้นด้วยตัวเลข"
            )
            .min(4, "รหัสต้องมีอย่างน้อย 4 ตัวอักษร"),
          NAME: yup.string().nullable().required("กรุณากรอกชื่อสถานะ"),
          COMPANY_SHOW: yup.string().nullable().required("กรุณากรอกคำอธิบาย"),
        }
        : {
          NAME: yup.string().nullable().required("กรุณากรอกชื่อสถานะ"),
          COMPANY_SHOW: yup.string().nullable().required("กรุณากรอกคำอธิบาย"),
        }
    ),
    initialValues,
    validateOnChange: true,
    onSubmit: onFormSubmit,
  });

  return (
    <Modal
      show={show}
      onShow={handleOnShow}
      backdrop={"static"}
      onHide={onClose}
      size="lg"
    >
      <Form noValidate onSubmit={handleSubmit}>
        <Modal.Header closeButton>{titles[mode]}</Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2" className="text-end">
              รหัส:
              {mode === "ADD" ? <span className="text-danger">*</span> : null}
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                name="CODE"
                readOnly={mode === "EDIT" || mode === "DISPLAY"}
                value={values?.CODE}
                onChange={handleChange}
                isInvalid={!!errors?.CODE}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.CODE}
              </Form.Control.Feedback>
            </Col>
            <Form.Label column sm="2" className="text-end">
              ชื่อสถานะ:
              {mode === "ADD" || mode === "EDIT" ? (
                <span className="text-danger">*</span>
              ) : null}
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                name="NAME"
                readOnly={mode === "DISPLAY"}
                value={values?.NAME}
                onChange={handleChange}
                isInvalid={!!errors?.NAME}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.NAME}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2" className="text-end">
              คำอธิบาย:
              {mode === "ADD" || mode === "EDIT" ? (
                <span className="text-danger">*</span>
              ) : null}
            </Form.Label>
            <Col>
              <Form.Control
                readOnly={mode === "DISPLAY"}
                name="COMPANY_SHOW"
                as={"textarea"}
                rows={4}
                value={values?.COMPANY_SHOW}
                onChange={handleChange}
                isInvalid={!!errors?.COMPANY_SHOW}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.COMPANY_SHOW}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          {(mode === "ADD" || mode === "EDIT") &&
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="text-end">
                อัพโหลดไอคอน:
              </Form.Label>
              <Col className="d-flex align-items-center">
                <Form.Control type="file" accept="image/*" ref={(e: HTMLInputElement) => refIconFile.current = e} onChange={onIconFileChang}></Form.Control>
              </Col>
            </Form.Group>
          }
          {mode === "ADD" ? null : (
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="text-end">
                สถานะ:
              </Form.Label>
              <Col className="d-flex align-items-center">
                <Radio.Group
                  onChange={handleChange}
                  disabled={mode === "DISPLAY"}
                  name="ENABLE"
                  value={values?.ENABLE}
                >
                  <Radio value="Y">ใช้งาน</Radio>
                  <Radio value="N">ไม่ใช้งาน</Radio>
                </Radio.Group>
              </Col>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          {mode !== "DISPLAY" ? (
            <Button type="submit" variant="primary" disabled={!isValid}>
              บันทีก
            </Button>
          ) : null}
          <Button type="button" variant="danger" onClick={onClose}>
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PanelModal;
