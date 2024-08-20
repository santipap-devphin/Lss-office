import { FC, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { Radio } from "antd";
import {
  LssGetGroupStaff,
  LssITA63EditAPI,
  LssITA63SaveAPI,
} from "../../../data";
import Spinner from "../../fragments/Spinner";
import { LSS_T_GROUP_STAFF } from "../../../models/office/LSS_T_GROUP_STAFF.model";
import { parseISO } from "date-fns";
import Swal from "sweetalert2";

export const EditModalProps = {
  Add: "ADD",
  Edit: "EDIT",
  Display: "DISPLAY",
};

const titles = {
  ADD: "เพิ่มข้อมูล",
  EDIT: "แก้ไขข้อมูล",
  DISPLAY: "แสดงข้อมูล",
} as Record<string, string>;

const initialValues: LSS_T_GROUP_STAFF = {
  CODE: "",
  NAME: "",
  DESCRIPTION: "",
  ENABLE: "N",
  DEL: "N",
  CREATE_USER: "",
  UPDATE_USER: "",
  UPDATED_DATE: new Date(),
  CREATED_DATE: new Date(),
};

const EditModal: FC<{
  code: string;
  show: boolean;
  mode: string;
  onClose(): void;
}> = ({ code, show, onClose, mode }) => {
  const [isBusy, setIsBusy] = useState<boolean>(true);

  const {
    handleSubmit,
    values,
    handleChange,
    setValues,
    errors,
    isValid,
    isValidating,
    setFieldError,
  } = useFormik({
    initialValues: initialValues,
    validateOnBlur: true,
    validationSchema: yup.object().shape({
      CODE: yup.string().nullable().required("กรุณาระบุรหัสกลุ่มผู้ใช้"),
      NAME: yup.string().nullable().required("กรุณาระบุชื่อกลุ่มผู้ใช้"),
      ENABLE: yup.string().nullable().required("กรุณาระบุสถานะ"),
    }),
    onSubmit: (values) => {
      if (mode === "EDIT") {
        LssITA63EditAPI(values)
          .then(() => {
            Swal.fire({
              icon: "success",
              text: "บันทึกข้อมูลเรียบร้อยแล้ว",
            }).then(() => {
              onClose();
            });
          })
          .catch((resp) => {
            for (const key in resp?.data?.errors) {
              setFieldError(key, resp?.data?.errors[key]);
            }
            Swal.fire({
              icon: "warning",
              text: "กรุณากรอกข้อมูลให้ครบ",
            });
          });
      }

      if (mode === "ADD") {
        LssITA63SaveAPI(values)
          .then(() => {
            Swal.fire({
              icon: "success",
              text: "เพิ่มข้อมูลเรียบร้อยแล้ว",
            }).then(() => {
              onClose();
            });
          })
          .catch((resp) => {
            for (const key in resp?.data?.errors) {
              setFieldError(key, resp?.data?.errors[key]);
            }
            Swal.fire({
              icon: "warning",
              text: "กรุณากรอกข้อมูลให้ครบ",
            });
          });
      }
    },
  });

  const onShow = () => {
    if (mode !== "ADD")
      LssGetGroupStaff(code)
        .then((data: LSS_T_GROUP_STAFF) => {
          setValues({ ...data });
        })
        .finally(() => {
          setIsBusy(false);
        });
    else {
      setValues(initialValues);
      setIsBusy(false);
    }
  };

  return (
    <Modal
      centered
      size="lg"
      show={show}
      onShow={onShow}
      onHide={onClose}
      backdrop="static"
    >
      <Form noValidate onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{titles[mode]} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isBusy ? (
            <Spinner />
          ) : (
            <>
              <Row className="mb-3">
                <Col>
                  <Form.Group as={Row}>
                    <Form.Label column sm="6" className="text-end">
                      รหัสกลุ่มผู้ใช้:
                    </Form.Label>
                    <Col>
                      <Form.Control
                        required
                        type="text"
                        className="text-center"
                        name="CODE"
                        readOnly={mode !== "ADD"}
                        value={values?.CODE}
                        onChange={handleChange}
                        isInvalid={!!errors?.CODE}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors?.CODE}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group as={Row}>
                    <Form.Label column sm="5" className="text-end">
                      ชื่อกลุ่มผู้ใช้:
                    </Form.Label>
                    <Col>
                      <Form.Control
                        required
                        type="text"
                        name="NAME"
                        readOnly={mode === "DISPLAY"}
                        value={values?.NAME}
                        onInput={handleChange}
                        isInvalid={!!errors?.NAME}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors?.NAME}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Group as={Row}>
                    <Form.Label column sm="3" className="text-end">
                      คำอธิบาย:
                    </Form.Label>
                    <Col>
                      <Form.Control
                        required
                        as="textarea"
                        rows={7}
                        readOnly={mode === "DISPLAY"}
                        name="DESCRIPTION"
                        value={values?.DESCRIPTION}
                        onInput={handleChange}
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Group as={Row}>
                    <Form.Label column sm="3" className="text-end">
                      สถานะการใช้งาน:
                    </Form.Label>
                    <Col className="d-flex align-items-center">
                      <Radio.Group
                        name="ENABLE"
                        disabled={mode === "DISPLAY"}
                        value={values?.ENABLE}
                        onChange={handleChange}
                        
                      >
                        <Radio value={"Y"}>ใช้งาน</Radio>
                        <Radio value={"N"}>ไม่ใช้งาน</Radio>
                      </Radio.Group>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              {mode === "ADD" ? null : (
                <Row className="mb-3">
                  <Col>
                    <Form.Group as={Row}>
                      <Form.Label column sm="6" className="text-end">
                        วันที่สร้าง:
                      </Form.Label>
                      <Col>
                        <Form.Control
                          readOnly
                          className="w-100"
                          value={parseISO(
                            values?.CREATED_DATE.toString()
                          ).toLocaleTimeString("th-TH", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                          onChange={() => {}}
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group as={Row}>
                      <Form.Label column sm="6" className="text-end">
                        แก้ไขล่าสุด:
                      </Form.Label>
                      <Col>
                        <Form.Control
                          readOnly
                          value={parseISO(
                            values?.UPDATED_DATE.toString()
                          ).toLocaleTimeString("th-TH", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                          onChange={() => {}}
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center gap-3">
          {mode === "DISPLAY" ? null : (
            <Button
              type="submit"
              disabled={!isValid || isValidating}
              variant={"success"}
            >
              บันทึก
            </Button>
          )}
          <Button type="button" variant={"danger"} onClick={() => onClose()}>
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditModal;
