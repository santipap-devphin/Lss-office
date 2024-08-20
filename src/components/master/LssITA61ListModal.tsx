import { ChangeEvent, FC, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Col, Form, Row, Button, Modal } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { LSS_T_ACCOUNT } from "../../models/office/LSS_T_ACCOUNT.model";
import { LSS_T_SECTION } from "../../models/office/LSS_T_SECTION.model";
import { LSS_T_POSITION } from "../../models/office/LSS_T_POSITION.model";
import { LSS_T_COMPANY } from "../../models/office/LSS_T_COMPANY.model";
import { getLssITA61, LssITA61OnLoad, saveLssITA61 } from "../../data";
import { LSS_T_PREFIX } from "../../models/office/LSS_T_PREFIX.model";
import { parseISO } from "date-fns";
import { Radio } from "antd";
import Swal from "sweetalert2";
import Spinner from "../fragments/Spinner";
import { LSS_T_GROUP_STAFF } from "../../models/office/LSS_T_GROUP_STAFF.model";

export type ModeProps = "EDIT" | "DISPLAY";

const titles = {
  EDIT: "แก้ไขข้อมูล",
  DISPLAY: "แสดงข้อมูล",
};

const initialValues: LSS_T_ACCOUNT = {
  CODE: "",
  ACCOUNT_TYPE_CODE: "",
  COMPANY_CODE: "",
  COMPANY_NAME: "",
  COMPANY_LICENSE: "",
  LOGIN_NAME: "",
  PREFIX_CODE: "",
  FIRSTNAME_EN: "",
  LASTNAME_EN: "",
  FIRSTNAME_TH: "",
  LASTNAME_TH: "",
  IDCARD: "",
  IDCARD_TYPE: "",
  COMPANY_POSITION: "",
  TEL: "",
  FAX: "",
  EMAIL: "",
  REMARK: "",
  RETRY_COUNT: "",
  BANNED: "",
  POSITION_CODE: "",
  SECTION_CODE: "",
  EMPLOYEE_CODE: "",
  GROUP_CODE: "",
  RECOVERY_TOKEN: "",
  GROUP_STAFF_CODE: "",
  IP: "",
  ENABLE: "",
  DEL: "",
  CREATE_USER: "",
  UPDATE_USER: "",
  STATUS: "",
  MOBILE: "",
  REASON: "",
  SIGNATOR1: "",
  SIGNATOR2: "",
  APPROVED_DATE: "",
  CREATED_DATE: "",
  LAST_PASSWORD_CHANGE_DATE: "",
  LAST_LOGIN_DATE: "",
  UPDATED_DATE: "",
  ACTIVED_DATE: "",
  EXPIRED_DATE: "",
  BANNED_DATE: "",
  START_DATE: "",
  END_DATE: "",
};

const LssITA61Modal: FC<{
  code: string;
  mode: ModeProps;
  show: boolean;
  onClose(): void;
}> = ({ code, mode, show, onClose }) => {
  const [isBusy, setIsBusy] = useState<boolean>(true);

  const [sections, setSections] = useState<LSS_T_SECTION[]>([]);
  const [positions, setPositions] = useState<LSS_T_POSITION[]>([]);
  const [companies, setCompanies] = useState<LSS_T_COMPANY[]>([]);
  const [prefixes, setPrefixes] = useState<LSS_T_PREFIX[]>([]);
  const [staffGroup, setStaffGroup] = useState<LSS_T_GROUP_STAFF[]>([]);

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    setErrors,
    setValues,
    setFieldValue,
    setFieldError,
  } = useFormik({
    validationSchema: yup.object().shape(
      mode !== "DISPLAY"
        ? {
            PREFIX_CODE: yup.string().nullable().required("กรุณาเลือกคำนำหน้าชื่อ"),
            FIRSTNAME_TH: yup.string().nullable().required("กรุณากรอกชื่อ(ภาษาไทย)"),
            LASTNAME_TH: yup.string().nullable().required("กรุณากรอกนามสกุล(ภาษาไทย)"),
            FIRSTNAME_EN: yup.string().nullable().required("กรุณากรอกชื่อ(ภาษาอังกฤษ)"),
            LASTNAME_EN: yup.string().nullable().required("กรุณากรอกนามสกุล(ภาษาอังกฤษ)"),
            COMPANY_CODE: yup.string().nullable().required("กรุณาเลือกบริษัท"),
            //SECTION_CODE: yup.string().nullable().required("กรุณาเลือกหน่วยงาน"),
            MOBILE: yup.string().nullable().required("กรุณาเลือกหน่วยงาน"),
            EMAIL: yup.string().nullable().required("กรุณากรอกอีเมล").email("รูปแบบอีเมล์ไม่ถูกต้อง"),
          }
        : {}
    ),
    validateOnBlur: false,
    initialValues,
    enableReinitialize: true,
    onSubmit: (data: LSS_T_ACCOUNT) => {
      if (mode === "EDIT") {
        saveLssITA61(data)
          .then((status) => {
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
    },
  });

  const handleOnShow = () => {
    LssITA61OnLoad().then((data) => {
      setSections(data.SECTIONS);
      setPositions(data.POSITIONS);
      setCompanies(data.COMPANIES);
      setPrefixes(data.PREFIXES);
      setStaffGroup(data.STAFF_GROUP);
    });
    
    getLssITA61(code)
      .then((data) => {
        setValues({
          ...data,
        });
      })
      .finally(() => {
        setErrors({});
        setIsBusy(false);
      });
      console.log(values);
  };

  return (
    <Modal
      size="xl"
      backdrop="static"
      show={show}
      onShow={handleOnShow}
      onHide={onClose}
    >
      <Form noValidate onSubmit={handleSubmit}>
        <Modal.Header closeButton>{titles[mode]}</Modal.Header>
        <Modal.Body>
          {isBusy ? (
            <Spinner />
          ) : (
            <>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2" className="text-end">
                  รหัสผู้ใช้งาน:
                </Form.Label>
                <Col sm="4">
                  <Form.Control
                    type="text"
                    readOnly
                    defaultValue={values.CODE}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.CODE}
                  </Form.Control.Feedback>
                </Col>
                <Form.Label column sm="1" className="text-end">
                  บัญชีผู้ใช้:
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    type="text"
                    readOnly
                    defaultValue={values.LOGIN_NAME}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2" className="text-end">
                  คำนำหน้าชื่อ:
                </Form.Label>
                <Col sm={4}>
                  <Form.Select
                    name="PREFIX_CODE"
                    disabled={mode === "DISPLAY"}
                    value={values.PREFIX_CODE}
                    onChange={handleChange}
                    isInvalid={!!errors.PREFIX_CODE}
                  >
                    <option value="">กรุณาเลือก</option>
                    {prefixes.map((el, i) => (
                      <option key={i} value={el.CODE}>
                        {el.NAME}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.PREFIX_CODE}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2" className="text-end">
                  ชื่อ(ภาษาไทย):
                </Form.Label>
                <Col>
                  <Form.Control
                    type="text"
                    name="FIRSTNAME_TH"
                    readOnly={mode === "DISPLAY"}
                    value={values.FIRSTNAME_TH}
                    onChange={handleChange}
                    isInvalid={!!errors.FIRSTNAME_TH}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.FIRSTNAME_TH}
                  </Form.Control.Feedback>
                </Col>
                <Form.Label column sm="2" className="text-end">
                  นามสกุล(ภาษาไทย):
                </Form.Label>
                <Col>
                  <Form.Control
                    type="text"
                    name="LASTNAME_TH"
                    readOnly={mode === "DISPLAY"}
                    value={values.LASTNAME_TH}
                    onChange={handleChange}
                    isInvalid={!!errors.LASTNAME_TH}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.LASTNAME_TH}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2" className="text-end">
                  ชื่อ(ภาษาอังกฤษ):
                </Form.Label>
                <Col>
                  <Form.Control
                    type="text"
                    name="FIRSTNAME_EN"
                    readOnly={mode === "DISPLAY"}
                    value={values.FIRSTNAME_EN}
                    onChange={handleChange}
                    isInvalid={!!errors.FIRSTNAME_EN}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.FIRSTNAME_EN}
                  </Form.Control.Feedback>
                </Col>
                <Form.Label column sm="2" className="text-end">
                  นามสกุล(ภาษาอังกฤษ):
                </Form.Label>
                <Col>
                  <Form.Control
                    type="text"
                    name="LASTNAME_EN"
                    readOnly={mode === "DISPLAY"}
                    value={values.LASTNAME_EN}
                    onChange={handleChange}
                    isInvalid={!!errors.LASTNAME_EN}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.LASTNAME_EN}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2" className="text-end">
                  บริษัท:
                </Form.Label>
                <Col>
                  <Form.Select
                    name="COMPANY_CODE"
                    value={values.COMPANY_CODE}
                    onChange={handleChange}
                    isInvalid={!!errors.COMPANY_CODE}
                    disabled={mode === "DISPLAY"}
                  >
                    <option value="">กรุณาเลือก</option>
                    {companies.map((el, i) => (
                      <option key={i} value={el.CODE}>
                        {el.NAME}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.COMPANY_CODE}
                  </Form.Control.Feedback>
                </Col>
                <Col sm="2"></Col>
                <Col></Col>
                {/* <Form.Label column sm="2" className="text-end">
                  หน่วยงาน:
                </Form.Label>
                <Col>
                  <Form.Select
                    name="SECTION_CODE"
                    value={values.SECTION_CODE ?? ""}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      if (e.target.value === "00000" || e.target.value === "") {
                        setFieldValue("ACCOUNT_TYPE_CODE", "0");
                      } else {
                        setFieldValue("ACCOUNT_TYPE_CODE", "1");
                      }
                      setFieldValue("SECTION_CODE",e.target.value);
                    }}
                    isInvalid={!!errors.SECTION_CODE}
                    disabled={mode === "DISPLAY"}
                  >
                    <option value="">กรุณาเลือก</option>
                    {sections.map((el, i) => (
                      <option key={i} value={el.CODE}>
                        {el.DESCRIPTION}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.SECTION_CODE}
                  </Form.Control.Feedback>
                </Col> */}
              </Form.Group>
              {values?.ACCOUNT_TYPE_CODE === "0" ? null : (
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2" className="text-end">
                    ตำแหน่ง:
                  </Form.Label>
                  <Col className="pe-0">
                    <Form.Select
                      name="POSITION_CODE"
                      value={values.POSITION_CODE ?? ""}
                      onChange={handleChange}
                      disabled={mode === "DISPLAY"}
                    >
                      <option value="">กรุณาเลือก</option>
                      {positions.map((el, i) => (
                        <option key={i} value={el.CODE}>
                          {el.NAME_TH}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Form.Label
                    column
                    sm="3"
                    className="text-end px-0"
                    style={{ maxWidth: "208px" }}
                  >
                    กลุ่มสิทธิการใช้งานรายบุคคล:
                  </Form.Label>
                  <Col>
                    <Form.Select
                      name="GROUP_CODE"
                      value={values.GROUP_CODE ?? ""}
                      onChange={handleChange}
                      disabled={mode === "DISPLAY"}
                    >
                      <option value="">กรุณาเลือก</option>
                      {staffGroup.map((el, i) => (
                        <option key={i} value={el.CODE}>
                          {el.NAME}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Form.Group>
              )}

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2" className="text-end">
                  เบอร์โทรศัพท์:
                </Form.Label>
                <Col>
                  <Form.Control
                    type="text"
                    name="MOBILE"
                    readOnly={mode === "DISPLAY"}
                    value={values.MOBILE}
                    onChange={handleChange}
                    isInvalid={!!errors.MOBILE}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.MOBILE}
                  </Form.Control.Feedback>
                </Col>
                <Form.Label column sm="2" className="text-end">
                  อีเมล:
                </Form.Label>
                <Col>
                  <Form.Control
                    type="text"
                    name="EMAIL"
                    readOnly={mode === "DISPLAY"}
                    value={values.EMAIL}
                    onChange={handleChange}
                    isInvalid={!!errors.EMAIL}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.EMAIL}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              {/* <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2" className="text-end">
              สถานะพนักงาน:
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                name="STATUS"
                readOnly
                defaultValue={values.STATUS}
              />
              <Form.Control.Feedback type="invalid">
                {errors.STATUS}
              </Form.Control.Feedback>
            </Col>
            <Form.Label column sm="2" className="text-end">
              จำนวน Login ผิด:
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                name="RETRY_COUNT"
                value={values.RETRY_COUNT}
                readOnly={true}
              />
              <Form.Control.Feedback type="invalid">
                {errors.RETRY_COUNT}
              </Form.Control.Feedback>
            </Col>
          </Form.Group> */}
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2" className="text-end">
                  สถานะการใช้งาน:
                </Form.Label>
                <Col className="d-flex align-items-center">
                  <Radio.Group
                    name="ENABLE"
                    disabled={mode === "DISPLAY"}
                    value={values.ENABLE}
                    onChange={handleChange}
                  >
                    <Radio value="Y">ใช้งาน</Radio>
                    <Radio value="N">ไม่ใช้งาน</Radio>
                  </Radio.Group>
                </Col>
                <Form.Label column sm="2" className="text-end">
                  ระงับสิทธิ์การใช้งาน:
                </Form.Label>
                <Col className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    label="ระงับ"
                    disabled={mode === "DISPLAY"}
                    checked={values?.BANNED === "1"}
                    onChange={() =>
                      setFieldValue("BANNED", values.BANNED === "0" ? "1" : "0")
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2" className="text-end">
                  วันที่เริ่มต้นใช้งาน:
                </Form.Label>
                <Col>
                  <Form.Control
                    readOnly
                    defaultValue={parseISO(
                      values.START_DATE ?? new Date().toISOString()
                    ).toLocaleTimeString("th-TH", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  />
                </Col>
                <Form.Label column sm="2" className="text-end">
                  วันที่สิ้นสุดการใช้งาน:
                </Form.Label>
                <Col>
                  <Form.Control
                    readOnly
                    defaultValue={parseISO(
                      values.END_DATE ?? new Date().toISOString()
                    ).toLocaleTimeString("th-TH", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2" className="text-end">
                  วันที่บันทึก:
                </Form.Label>
                <Col>
                  <Form.Control
                    readOnly
                    type="text"
                    defaultValue={parseISO(
                      values.CREATED_DATE ?? new Date().toISOString()
                    ).toLocaleTimeString("th-TH", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  />
                </Col>
                <Form.Label column sm="2" className="text-end">
                  ผู้บันทึก:
                </Form.Label>
                <Col>
                  <Form.Control
                    readOnly
                    type="text"
                    value={values.CREATE_USER}
                    isInvalid={!!errors.CREATE_USER}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.CREATE_USER}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2" className="text-end">
                  วันที่แก้ไขล่าสุด:
                </Form.Label>
                <Col>
                  <Form.Control
                    readOnly
                    type="text"
                    defaultValue={parseISO(
                      values.UPDATED_DATE ?? new Date().toISOString()
                    ).toLocaleTimeString("th-TH", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  />
                </Col>
                <Form.Label column sm="2" className="text-end">
                  ผู้แก้ไขล่าสุด:
                </Form.Label>
                <Col>
                  <Form.Control
                    readOnly
                    type="text"
                    defaultValue={values.UPDATE_USER}
                    isInvalid={!!errors.UPDATE_USER}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.UPDATE_USER}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          {mode === "DISPLAY" ? null : (
            <Button className="mt-2" type="submit" variant="primary">
              บันทึก
            </Button>
          )}
          <Button className="mt-2" variant="danger" onClick={onClose}>
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default LssITA61Modal;
