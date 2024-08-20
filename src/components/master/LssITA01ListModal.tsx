import { useState, useEffect, FC, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Card,
  Col,
  Form,
  Row,
  Button,
  Container,
} from "react-bootstrap";
import Swal from "sweetalert2";
import {
  LssITA27SaveAPI,
  LssITA01SearchAPI,
  LssITA27EditAPI,
  getAccountRequestFile,
  getAccountChangeFile
  // getDocTypes,
  // getCommon,
} from "../../data";

import FileBrowser from "../fragments/filebrowser/FileBrowser";
import { FileBrowserSchema } from "../../models/schemas/filebrowser/file-browser-schema.model";
import { Attachment } from "../../models/schemas/filebrowser/attachment.model";

const LssITA01Modal: FC<{
  CODE: any;
  ACTIONCLICK: any;
  onFetchData: any;
  onModal: any;
  showBtn: any;
  showReadOnly: any;
  ChangeOrRequest: any;
}> = (CODE, ACTIONCLICK) => {
  const [senable, setSenable] = useState("");

  const [fileSchema, setFileSchema] = useState<FileBrowserSchema[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [tableDataSearch, setTableDataSearch] = useState<
    {
      id: any;
      ACCOUNT_CODE: any;
      ACCOUNT_TYPE_CODE: any;
      ACTIVED_DATE: any;
      APPROVED_DATE: any;
      BANNED: any;
      BANNED_DATE: any;
      CODE: any;
      COMPANY_CODE: any;
      COMPANY_LICENSE: any;
      COMPANY_NAME: any;
      COMPANY_POSITION: any;
      CREATED_DATE: any;
      CREATE_USER: any;
      DEL: any;
      EMAIL: any;
      EMPLOYEE_CODE: any;
      ENABLE: any;
      END_DATE: any;
      EXPIRED_DATE: any;
      FAX: any;
      FIRSTNAME_EN: any;
      FIRSTNAME_TH: any;
      GROUP_CODE: any;
      GROUP_STAFF_CODE: any;
      IDCARD: any;
      IDCARD_TYPE: any;
      IP: any;
      LASTNAME_EN: any;
      LASTNAME_TH: any;
      LAST_LOGIN_DATE: any;
      LAST_PASSWORD_CHANGE_DATE: any;
      LOGIN_NAME: any;
      MOBILE: any;
      PASSWORD: any;
      POSITION_CODE: any;
      PREFIX_CODE: any;
      PREFIX_NAME: any;
      REASON: any;
      RECOVERY_TOKEN: any;
      REMARK: any;
      RETRY_COUNT: any;
      SECTION_CODE: any;
      SIGNATOR1: any;
      SIGNATOR2: any;
      START_DATE: any;
      STATUS: any;
      STATUS_NAME: any;
      TEL: any;
      TYPE_FILLING: any;
      UPDATED_DATE: any;
      UPDATE_USER: any;
    }[]
  >([]);

  const initValue = {
    ACCOUNT_CODE: "",
    ACCOUNT_TYPE_CODE: "",
    ACTIVED_DATE: "",
    APPROVED_DATE: "",
    BANNED: "",
    BANNED_DATE: "",
    CODE: "",
    COMPANY_CODE: "",
    COMPANY_LICENSE: "",
    COMPANY_NAME: "",
    COMPANY_POSITION: "",
    CREATED_DATE: "",
    CREATE_USER: "",
    DEL: "",
    EMAIL: "",
    EMPLOYEE_CODE: "",
    ENABLE: "",
    END_DATE: "",
    EXPIRED_DATE: "",
    FAX: "",
    FIRSTNAME_EN: "",
    FIRSTNAME_TH: "",
    GROUP_CODE: "",
    GROUP_STAFF_CODE: "",
    IDCARD: "",
    IDCARD_TYPE: "",
    IP: "",
    LASTNAME_EN: "",
    LASTNAME_TH: "",
    LAST_LOGIN_DATE: "",
    LAST_PASSWORD_CHANGE_DATE: "",
    LOGIN_NAME: "",
    MOBILE: "",
    PASSWORD: "",
    POSITION_CODE: "",
    PREFIX_CODE: "",
    PREFIX_NAME: "",
    REASON: "",
    RECOVERY_TOKEN: "",
    REMARK: "",
    RETRY_COUNT: "",
    SECTION_CODE: "",
    SIGNATOR1: "",
    SIGNATOR2: "",
    START_DATE: "",
    STATUS: "",
    STATUS_NAME: "",
    TEL: "",
    TYPE_FILLING: "",
    UPDATED_DATE: "",
    UPDATE_USER: "",
  };

  const form = useFormik({
    validationSchema: yup.object().shape({
      SIGNATOR2: yup.string().nullable(),
      CODE: yup.string().nullable().required("กรุณาป้อนรหัสข้อมูล"),
      NAME: yup.string().nullable().required("กรุณาป้อนข้อมูลตัวแปร"),
      DESCRIPTION: yup.string().nullable().required("กรุณาป้อนข้อมูลคำอธิบาย"),
      VALUE: yup.string().nullable().required("กรุณาป้อนค่าข้อมูล"),
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
        LssITA27EditAPI(data)
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
        LssITA27SaveAPI(data)
          .then((res) => {
            Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(() => {
              CODE.onFetchData();
              CODE.onModal(false);
            });
          })
          .catch((err) => {
            if (err.response.data.status === 400) {
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

  const fnFetchData = useCallback(() : Promise<any> => {
    return new Promise((resolve) => {
      if (CODE.ACTIONCLICK === "Edit" || CODE.ACTIONCLICK === "Display") {
        var para = JSON.parse(`{"CODE":"${CODE.CODE}"}`);
        LssITA01SearchAPI(para).then((data: any) => {
          //console.log(data)
          let tmpSchema = [];
          for (let i = 0; i < data.length; i++) {
            tmpSchema.push({
              id: data[i].CODE,
              ACCOUNT_CODE: data[i].ACCOUNT_CODE,
              ACCOUNT_TYPE_CODE: data[i].ACCOUNT_TYPE_CODE,
              ACTIVED_DATE: data[i].ACTIVED_DATE,
              APPROVED_DATE: data[i].APPROVED_DATE,
              BANNED: data[i].BANNED,
              BANNED_DATE: data[i].BANNED_DATE,
              CODE: data[i].CODE,
              COMPANY_CODE: data[i].COMPANY_CODE,
              COMPANY_LICENSE: data[i].COMPANY_LICENSE,
              COMPANY_NAME: data[i].COMPANY_NAME,
              COMPANY_POSITION: data[i].COMPANY_POSITION,
              CREATED_DATE: data[i].CREATED_DATE,
              CREATE_USER: data[i].CREATE_USER,
              DEL: data[i].DEL,
              EMAIL: data[i].EMAIL,
              EMPLOYEE_CODE: data[i].EMPLOYEE_CODE,
              ENABLE: data[i].ENABLE,
              END_DATE: data[i].END_DATE,
              EXPIRED_DATE: data[i].EXPIRED_DATE,
              FAX: data[i].FAX,
              FIRSTNAME_EN: data[i].FIRSTNAME_EN,
              FIRSTNAME_TH: data[i].FIRSTNAME_TH,
              GROUP_CODE: data[i].GROUP_CODE,
              GROUP_STAFF_CODE: data[i].GROUP_STAFF_CODE,
              IDCARD: data[i].IDCARD,
              IDCARD_TYPE: data[i].IDCARD_TYPE,
              IP: data[i].IP,
              LASTNAME_EN: data[i].LASTNAME_EN,
              LASTNAME_TH: data[i].LASTNAME_TH,
              LAST_LOGIN_DATE: data[i].LAST_LOGIN_DATE,
              LAST_PASSWORD_CHANGE_DATE: data[i].LAST_PASSWORD_CHANGE_DATE,
              LOGIN_NAME: data[i].LOGIN_NAME,
              MOBILE: data[i].MOBILE,
              PASSWORD: data[i].PASSWORD,
              POSITION_CODE: data[i].POSITION_CODE,
              PREFIX_CODE: data[i].PREFIX_CODE,
              PREFIX_NAME: data[i].PREFIX_NAME,
              REASON: data[i].REASON,
  
              RECOVERY_TOKEN: data[i].RECOVERY_TOKEN,
              REMARK: data[i].REMARK,
              RETRY_COUNT: data[i].RETRY_COUNT,
              SECTION_CODE: data[i].SECTION_CODE,
              SIGNATOR1: data[i].SIGNATOR1,
              SIGNATOR2: data[i].SIGNATOR2,
              START_DATE: data[i].START_DATE,
              STATUS: data[i].STATUS,
              STATUS_NAME: data[i].STATUS_NAME,
              TEL: data[i].TEL,
              TYPE_FILLING: data[i].TYPE_FILLING,
              UPDATED_DATE: data[i].UPDATED_DATE,
              UPDATE_USER: data[i].UPDATE_USER,
            });
          }
          setTableDataSearch(tmpSchema);
          setSenable(data[0].ENABLE);
          form.setValues(tmpSchema[0]);
        });
      } //EDIT
      if(CODE.ChangeOrRequest == "Request"){
        getAccountRequestFile(CODE.CODE)
        .then((data) => {
          setFileSchema(data.SCHEMAS);
          setAttachments(data.ATTACHMENTS);
        })
      }else{
        getAccountChangeFile(CODE.CODE)
        .then((data) => {
          setFileSchema(data.SCHEMAS);
          setAttachments(data.ATTACHMENTS);
        })
      }
      

      resolve(true)
    })
  }, [CODE.ACTIONCLICK, CODE.CODE, form]);

  useEffect(() => {
    fnFetchData();
  }, []);



  return (
    <>
      <div style={{ width: "100%" }}>
        <Container>
          <Row>
            <Col>
              <Form onSubmit={form.handleSubmit}>
                <Card className="mt-3">
                  <Card.Header>
                    รายละเอียดการขอใช้ระบบของบริษัทประกันภัย
                  </Card.Header>
                  <Card.Body>
                    {/* <Form.Group as={Row} className="mb-3">
                      <Col>
                        <Alert variant="danger">
                          มีคำขอเปลี่ยนแปลงบัญชีอยู่แล้ว กรุณารอการอนุมัติ...
                        </Alert>
                      </Col>
                    </Form.Group> */}
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">
                        บัญชีผู้ใช้งาน
                      </Form.Label>
                      <Col sm={4}>
                        <Form.Control
                          name="LOGIN_NAME"
                          value={form.values.LOGIN_NAME}
                          disabled
                        />
                      </Col>
                    </Form.Group>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            บริษัทประกันภัย{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              name="COMPANY_NAME"
                              value={form.values.COMPANY_NAME}
                              disabled
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            เลขที่ทะเบียนนิติบุคคล{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="text"
                              disabled
                              name="COMPANY_LICENSE"
                              value={form.values.COMPANY_LICENSE}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            คำนำหน้า <span className="text-danger">*</span>
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              name="PREFIX_NAME"
                              value={form.values.PREFIX_NAME}
                              disabled
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col md={6} className="d-sm-none"></Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            ชื่อ(ภาษาไทย) <span className="text-danger">*</span>
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              disabled
                              type="text"
                              name="FIRSTNAME_TH"
                              value={form.values.FIRSTNAME_TH}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            นามสกุล(ภาษาไทย){" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              disabled
                              type="text"
                              name="LASTNAME_TH"
                              value={form.values.LASTNAME_TH}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            ชื่อ(ภาษาอังกฤษ){" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              disabled
                              type="text"
                              name="FIRSTNAME_EN"
                              value={form.values.FIRSTNAME_EN}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            นามสกุล(ภาษาอังกฤษ){" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              disabled
                              type="text"
                              name="LASTNAME_EN"
                              value={form.values.LASTNAME_EN}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            อีเมล <span className="text-danger">*</span>
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              disabled
                              type="text"
                              name="EMAIL"
                              value={form.values.EMAIL}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col md={6} className="d-sm-none"></Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            ประเภทบัตร <span className="text-danger">*</span>
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Group className="align-items-center" as={Row}>
                              <Col>
                                <Form.Check
                                  disabled
                                  type="radio"
                                  label="บัตรประชาชน"
                                  checked={form.values.IDCARD_TYPE === "1"}
                                  name="IDCARD_TYPE"
                                  value="1"
                                />
                              </Col>
                              <Col>
                                <Form.Check
                                  disabled
                                  type="radio"
                                  label="หนังสือเดินทาง"
                                  name="IDCARD_TYPE"
                                  checked={form.values.IDCARD_TYPE === "2"}
                                  value="2"
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Group
                          as={Row}
                          className="align-items-center mb-3"
                        >
                          <Form.Label column sm="4">
                            เลขที่บัตร <span className="text-danger">*</span>
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              disabled
                              type="text"
                              name="IDCARD"
                              value={form.values.IDCARD}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            ตำแหน่ง
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              disabled
                              type="text"
                              name="COMPANY_POSITION"
                              value={form.values.COMPANY_POSITION}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            เบอร์โทรศัพท์มือถือ{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              disabled
                              type="text"
                              name="MOBILE"
                              value={form.values.MOBILE}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            เบอร์โทรศัพท์ <span className="text-danger">*</span>
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              disabled
                              type="text"
                              name="TEL"
                              value={form.values.TEL}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            เบอร์โทรสาร
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              disabled
                              type="text"
                              name="FAX"
                              value={form.values.FAX}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            เหตุผลการขอใช้ระบบ
                          </Form.Label>
                          <Col sm={8}>
                          <Form.Control
                              disabled
                              type="text"
                              name="REASON"
                              value={form.values.REASON}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col md={6} className="d-sm-none"></Col>
                    </Row>
                  </Card.Body>
                </Card>
                <Card className="mt-3">
                  <Card.Header>
                    ข้อมูลกรรมการผู้ลงนามในแบบนำส่งเงินสมทบ
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            ลำดับที่ 1 <span className="text-danger">*</span>
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              disabled
                              type="text"
                              name="SIGNATOR1"
                              value={form.values.SIGNATOR1}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            ลำดับที่ 2
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              disabled
                              type="text"
                              name="SIGNATOR2"
                              value={form.values.SIGNATOR2}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                {/* <Card className="mt-5">
                  <Card.Header>ดำเนินการ</Card.Header>
                  <Card.Body>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={8}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="4">
                                รหัสตัวแปร*
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
                            ชื่อตัวแปร*
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
                                ค่าตัวแปร *
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Control
                                  type="text"
                                  name="VALUE"
                                  readOnly={CODE.showReadOnly}
                                  value={form.values.VALUE}
                                  onChange={form.handleChange}
                                  isInvalid={!!form.errors.VALUE}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {form.errors.VALUE}
                                </Form.Control.Feedback>
                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm="4">
                            คำอธิบาย *
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="text"
                              name="DESCRIPTION"
                              value={form.values.DESCRIPTION}
                              disabled={CODE.showReadOnly}
                              onChange={form.handleChange}
                              isInvalid={!!form.errors.DESCRIPTION}
                            />
                            <Form.Control.Feedback type="invalid">
                              {form.errors.DESCRIPTION}
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
                </Card> */}
                <FileBrowser
                  schema={fileSchema}
                  attachments={attachments}
                  readonly={true}
                  onFileChanged={(code: string, files: FileList | null) => {}}
                  onRemoveFile={(code: string, id: string) => {}}
                />

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

export default LssITA01Modal;
