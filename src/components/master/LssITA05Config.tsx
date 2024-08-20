import { useState, useEffect, FC, ChangeEvent } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
//import Recapcha from "react-google-recaptcha";
import { Card, Col, Form, Row, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { PdfViewer } from "../fragments/PdfViewer";
import {
  // LssITA05List,
  LssITA05Save,
  LssITA05Edit,
  LssITA05GROUPANOUCEList,
  // LssITA05Delete,
  LssITA05Search,
  LssITA05uploadfiles,
  LssITA05files,
  LssITA05Seq,
  LssITA05uploadfileDelete
} from "../../data";

import { useAppContext } from "../../providers/AppProvider";
import { useDataContext } from "../../providers/DataProvider";
import { apiUrlBase } from "../../configs/urls";
import { dark } from "@mui/material/styles/createPalette";

const LssITA05Config: FC<{
  CODE: any;
  ACTIONCLICK: any;
  onFetchData: any;
  onModal: any;
  showBtn: any;
  showReadOnly: any;
}> = (CODE, ACTIONCLICK) => {

  const [senable, setSenable] = useState("");
  const [sdisplay, setSdisplay] = useState("");
  const [sAGC_Value, setAGC_Value] = useState("");
  const [stypelink, setStypelink] = useState("");
  const [showSlip, setShowSlip] = useState<boolean>(false);
  const [payKey, setPayKey] = useState("");
  // select data api

  const [current, setCurrent] = useState("");
  const [currentValue = "DEFAULT"] = useState("");
  const { logout } = useAppContext();
  const { clearData } = useDataContext();
  // let navigate = useNavigate();

  // attibute for upload file
  const [, setSelectedFile] = useState<File | null | undefined>(null);
  const [, setIsSelected] = useState(true);
  const [formFile, setFormFile] = useState([]);
  const [fileName, setFileName] = useState("");
  const [attFile, setAttFile] = useState("");
  const [onDisable, setOnDisable] = useState<boolean>(false);
  const [onDelete, setOnDelete] = useState<boolean>(false);

  const handleLogout = () => {
    clearData().then(() => {
      logout();
    });
  };
  const [groupdata, setGroupdate] = useState<
    {
      id: any;
      ANOUNCE_GROUP_CODE: any;
      CODE: string;
      COMMENT: any;
      DEL: any;
      DESCRIPTION: any;
      ENABLE: any;
      NAME: any;
      PARENT_CODE: any;
      SEQ: any;
      TYPE_DISPLAY: any;
      TYPE_LINK: any;
      CREATED_DATE: any;
    }[]
  >([]);

  const [tableDataSearch, setTableDataSearch] = useState<
    {
      id: any;
      ANOUNCE_GROUP_CODE: any;
      CODE: any;
      COMMENT: any;
      DEL: any;
      DESCRIPTION: any;
      ENABLE: any;
      NAME: any;
      PARENT_CODE: any;
      SEQ: any;
      TYPE_DISPLAY: any;
      TYPE_LINK: any;
      CREATED_DATE: any;
    }[]
  >([]);

  const fnFetchData = () => {
    if (CODE.ACTIONCLICK === "Edit" || CODE.ACTIONCLICK === "Display") {
      LssITA05Search(CODE).then((data: any) => {
        let tmpSchema = [];
        for (let i = 0; i < data.length; i++) {
          tmpSchema.push({
            id: data[i].CODE,
            CODE: data[i].CODE,
            DEL: data[i].DEL,
            ANOUNCE_GROUP_CODE: data[i].ANOUNCE_GROUP_CODE,
            COMMENT: data[i].COMMENT,
            DESCRIPTION: data[i].DESCRIPTION,
            ENABLE: data[i].ENABLE,
            NAME: data[i].NAME,
            PARENT_CODE: data[i].PARENT_CODE,
            SEQ: data[i].SEQ,
            TYPE_LINK: data[i].TYPE_LINK,
            TYPE_DISPLAY: data[i].TYPE_DISPLAY,
            CREATE_USER: data[i].CREATE_USER,
            CREATED_DATE: data[i].CREATED_DATE,
            UPDATE_USER: data[i].UPDATE_USER,
            UPDATED_DATE: data[i].UPDATED_DATE,
          });
        }
        setTableDataSearch(tmpSchema);
        setSenable(data[0].ENABLE);
        setSdisplay(data[0].TYPE_DISPLAY);
        setStypelink(data[0].TYPE_LINK);
        setAGC_Value(data[0].ANOUNCE_GROUP_CODE);
        form.setValues(tmpSchema[0]);
        if(data[0].TYPE_LINK === "Y"){
          setOnDisable(false)
        }else{
          setOnDisable(true)
        }
        setAttFile("");
        let para = {
          c: data[0].CODE
        };
        LssITA05files(para).then((result) => {
          setAttFile(result.ORIGINAL_FILENAME);
        });
      });
    } else if (CODE.ACTIONCLICK === "Add") {
      LssITA05Seq().then(data => {
        var payload = Number(data?.SEQ) + 1;
        form.setFieldValue("SEQ", payload || "")
      })
    }

  };

  const fnGroupData = () => {
    LssITA05GROUPANOUCEList().then((data: any) => {
      let dataArr: any = [];
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          dataArr.push({
            id: data[i].CODE,
            CODE: data[i].CODE,
            DEL: data[i].DEL,
            ANOUNCE_GROUP_CODE: data[i].ANOUNCE_GROUP_CODE,
            COMMENT: data[i].COMMENT,
            DESCRIPTION: data[i].DESCRIPTION,
            ENABLE: data[i].ENABLE,
            NAME: data[i].NAME,
            PARENT_CODE: data[i].PARENT_CODE,
            SEQ: data[i].SEQ,
            TYPE_LINK: data[i].TYPE_LINK,
            TYPE_DISPLAY: data[i].TYPE_DISPLAY,
            CREATE_USER: data[i].CREATE_USER,

            CREATED_DATE: data[i].CREATED_DATE,
            UPDATE_USER: data[i].UPDATE_USER,
            UPDATED_DATE: data[i].UPDATED_DATE,
          });
        }
        setGroupdate(dataArr);
        fnFetchData();
      }
    });
  };

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.item(0));
    setIsSelected(true);
    let data = event.target.files?.item(0);
    let filename = event.target.files?.[0].name;
    setFormFile(data as any);
    setFileName(filename as string);
  };

  useEffect(() => {
    fnGroupData();
  }, []);

  const initValue = {
    // id: "",
    CODE: "",
    NAME: "",
    SEQ: "",
    DESCRIPTION: "",
    ANOUNCE_GROUP_CODE: "",
    TYPE_DISPLAY: "",
    ENABLE: "",
    COMMENT: "",
    DEL: "N",
    CREATE_USER: "",
    CREATED_DATE: "",
    UPDATE_USER: "",
    UPDATED_DATE: "",
    PARENT_CODE: "",
    TYPE_LINK: "",
    // CONDITION3:"",
  };

  const form = useFormik({
    validationSchema: yup.object().shape({
      SIGNATOR2: yup.string().nullable(),
      DESCRIPTION: yup.string().nullable().required("กรุณาป้อนข้อความที่แสดง"),
      ANOUNCE_GROUP_CODE: yup.string().nullable(),
      // TYPE_DISPLAY: yup.string().required("กรุณาเลือกข้อมูล"),
      // .max(1, "รหัส กลุ่มประกาศต้องเป็น 1 ตัว"),
      CODE: yup.string().nullable().required("กรุณาป้อนรหัสข้อมูล"),
      NAME: yup.string().nullable().required("กรุณาป้อนข้อมูลชื่อประกาศ"),
      SEQ: yup.number(),
      TYPE_LINK: yup.string().nullable(),
      CREATED_DATE: yup.string().nullable(),
      // TYPE_DISPLAY: yup.int()
    }),
    validateOnBlur: false,
    initialValues: initValue,
    enableReinitialize: true,
    onSubmit: (data: Record<string, any>) => {
      if (CODE.ACTIONCLICK === "Edit") {
        if (data.TYPE_DISPLAY == null || "") {
          data.TYPE_DISPLAY = sAGC_Value;
        }
        data.COMMENT = "";
        data.CREATE_USER = "";
        data.PARENT_CODE = "";
        LssITA05Edit(data)
          .then((res) => {
            const formData = new FormData();
            formData.append("formFile", formFile as any);
            formData.append("fileName", fileName as string);
            formData.append("c", data.CODE as string);
            console.log(formData);
            if (formFile.length === 0) {
              if(onDelete){
                LssITA05uploadfileDelete(data.CODE).then((res) => {
                  Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(() => {
                    CODE.onFetchData();
                    CODE.onModal(false);
                  });
                }).catch((err) => {
                  Swal.fire("บันทึกข้อมูล", "บันทึกไฟล์อัพโหลดไม่สำเร็จ", "warning").then(() => {
                    CODE.onFetchData();
                    CODE.onModal(false);
                  });
                });
              }else{
                Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(() => {
                  CODE.onFetchData();
                  CODE.onModal(false);
                });
              }

            } else {
              LssITA05uploadfiles(formData)
                .then((res) => {
                  Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(() => {
                    CODE.onFetchData();
                    CODE.onModal(false);
                  });
                })
                .catch((err) => {
                  Swal.fire("บันทึกข้อมูล", "บันทึกไฟล์อัพโหลดไม่สำเร็จ", "warning").then(() => {
                    CODE.onFetchData();
                    CODE.onModal(false);
                  });
                });
            }

          })
          .catch((err) => {
            if (err.response.data.status === 404) {
              Swal.fire(
                "รหัสไม่ถูกต้อง",
                "รหัสรหัสคีย์ไม่มีในระบบตรวจสอบการกรอกข้อมูลอีกครั้ง ",
                "warning"
              ).then(() => {
                CODE.onFetchData();
                CODE.onModal(false);
              });
            }
            if (err.status === 400) {
              Swal.fire("แจ้งเตือน", "ตรวจสอบการกรอกข้อมูลอีกครั้ง", "warning").then(() => {
                CODE.onFetchData();
                CODE.onModal(false);
              });
            }
          });
      }
      if (CODE.ACTIONCLICK === "Add") {

        if (data.ENABLE === "") {
          data.ENABLE = "Y";
        }
        if (data.TYPE_LINK === "") {
          data.TYPE_LINK = "N";
        }
        LssITA05Save(data)
          .then((res) => {
            const formData = new FormData();
            formData.append("formFile", formFile as any);
            formData.append("fileName", fileName as string);
            formData.append("c", data.CODE as string);
            console.log(formFile);
            if (formFile.length === 0) {
              Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(() => {
                CODE.onFetchData();
                CODE.onModal(false);
              });
            } else {
              LssITA05uploadfiles(formData)
                .then((res) => {
                  Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(() => {
                    CODE.onFetchData();
                    CODE.onModal(false);
                  });
                })
                .catch((err) => {
                  Swal.fire("บันทึกข้อมูล", "บันทึกไฟล์อัพโหลดไม่สำเร็จ", "warning").then(() => {
                    CODE.onFetchData();
                    CODE.onModal(false);
                  });
                });
            }


          })
          .catch((err) => {
            if (err.response.data.status === 404) {
              Swal.fire(
                "รหัสซ้ำ",
                "รหัสคีย์หลักซ้ำตรวจสอบการกรอกข้อมูลอีกครั้ง ",
                "warning"
              ).then(() => {
                CODE.onFetchData();
                CODE.onModal(false);
              });
            }
            if (err.status === 400) {
              Swal.fire("แจ้งเตือน", "ตรวจสอบการกรอกข้อมูลอีกครั้ง", "warning").then(() => {
                CODE.onFetchData();
                CODE.onModal(false);
              });
            }
          });
      }
    },
  });

  const onCheckEnable = () => {
    setOnDisable(false)
  }

  const onCheckDisable = () => {
    setOnDisable(true)
  }

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
                      <Col sm={12} md={8}>
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
                                  readOnly={CODE.showReadOnly || CODE.ACTIONCLICK === "Edit"}
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
                    </Row>

                    <Row>
                      <Col sm={12} md={8}>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={8}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="4">
                                กลุ่มประกาศ *
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Select
                                  required
                                  disabled={CODE.showReadOnly}
                                  onChange={(event: any) => {
                                    form.values.ANOUNCE_GROUP_CODE =
                                      event.target.value;
                                    setAGC_Value(event.target.value);
                                  }}
                                  value={sAGC_Value}
                                  name="ANOUNCE_GROUP_CODE"
                                >
                                  <option value="">กรุณาเลือกรายการ</option>
                                  {groupdata.map((item, index) => (
                                    <option value={item.CODE} key={index}>
                                      {item.NAME}
                                    </option>
                                  ))}
                                </Form.Select>

                                <Form.Control.Feedback type="invalid">
                                  {form.errors.ANOUNCE_GROUP_CODE}
                                </Form.Control.Feedback>
                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={8}>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={8}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="4">
                                ประเภทการแสดง *
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Select
                                  required
                                  disabled={CODE.showReadOnly}
                                  onChange={(event: any) => {
                                    form.values.TYPE_DISPLAY =
                                      event.target.value;
                                    setSdisplay(event.target.value);
                                  }}
                                  value={sdisplay}
                                  name="TYPE_DISPLAY"
                                >
                                  <option value="">
                                    กรุณาเลือกรายการ
                                  </option>
                                  <option value="0">Both - ทั้งสองฝั่ง</option>
                                  <option value="1">EX -ภายนอก</option>
                                  <option value="2">IN - ภายใน</option>
                                </Form.Select>
                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    {/* รูปแบบการแสดง */}
                    <Row>
                      <Col sm={12} md={8}>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={8}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="4">
                                รูปแบบการแสดง *
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Check
                                  inline
                                  label="URL"
                                  name="TYPE_LINK"
                                  type="radio"
                                  id={`inline-radio-1`}
                                  value="Y"
                                  disabled={CODE.showReadOnly}
                                  checked={stypelink === "Y"}
                                  onChange={(event) => {
                                    form.values.TYPE_LINK = event.target.value;
                                    setStypelink(event.target.value);
                                    onCheckEnable();
                                  }}
                                />
                                <Form.Check
                                  required
                                  inline
                                  label="ข้อความธรรมดา"
                                  name="TYPE_LINK"
                                  type="radio"
                                  id={`inline-radio-2`}
                                  value="N"
                                  disabled={CODE.showReadOnly}
                                  checked={stypelink === "N"}
                                  onChange={(event) => {
                                    form.values.TYPE_LINK = event.target.value;
                                    setStypelink(event.target.value);
                                    onCheckDisable();
                                  }}
                                />
                                <Form.Control
                                  name="TYPE_DISPLAY"
                                  value={stypelink}
                                  id="TYPE_DISPLAY"
                                  type="hidden"
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    {/* ชื่อประกาศ */}
                    <Row>
                      <Col sm={12} md={8}>
                        <Col sm={8}>
                          <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="4">
                              ชื่อประกาศ*
                            </Form.Label>
                            <Col sm={8}>
                              <Form.Control
                                type="text"
                                name="NAME"
                                disabled={CODE.showReadOnly}
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
                      </Col>
                    </Row>
                    {/* อัพโหลด */}
                    <Row>
                      <Col sm={12} md={8}>
                        <Col sm={8}>
                          <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="4">
                              อัพโหลด*
                            </Form.Label>
                            <Col sm={8}>
                              <Form.Control
                                disabled={onDisable || CODE.showReadOnly}
                                type="file"
                                name="file"
                                onChange={changeHandler}
                              />
                            </Col>
                          </Form.Group>
                        </Col>
                      </Col>
                    </Row>
                    {/* ไฟล์ที่บันทีกแล้ว */}
                    <Row>
                      <Col sm={6} md={6}>
                        <Col sm={9}>
                          <Form.Group as={Row} className="mb-1">
                            <Form.Label column sm="5">
                              ไฟล์ที่บันทีกแล้ว*
                            </Form.Label>
                            <Col sm={7}>
                              <a href="#files"
                                onClick={() => {
                                  window.open(
                                    `${apiUrlBase}/data/dn?_ann=${form.values.CODE}`
                                  );
                                  setPayKey(form.values.CODE);
                                  //setShowSlip(true);
                                }}
                              >   {attFile} </a>
                            </Col>
                          </Form.Group>
                        </Col>
                      </Col>
                      <Col sm="1" className="d-flex justify-content-center">
                          <Button
                            className="mt-2"
                            disabled={CODE.showReadOnly}
                            variant="danger"
                            onClick={() => {
                              setOnDelete(true);
                              setAttFile("");
                            }}
                          >
                            ลบ
                          </Button>
                        </Col>
                    </Row>
                    {/* รายละเอียด */}
                    <Row>
                      <Col sm={12} md={12}>
                        <Col sm={12}>
                          <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="4">
                              รายละเอียด *
                            </Form.Label>
                            <Col sm={12}>
                              <Form.Control
                                type="textarea"
                                name="DESCRIPTION"
                                value={form.values.DESCRIPTION}
                                disabled={CODE.showReadOnly}
                                onChange={form.handleChange}
                                isInvalid={!!form.errors.DESCRIPTION}
                                as="textarea"
                                rows={3}
                              />
                              <Form.Control.Feedback type="invalid">
                                {form.errors.DESCRIPTION}
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>
                        </Col>
                      </Col>
                    </Row>
                    {/* ลำดับการแสดง */}
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Col sm={8}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm="4">
                                ลำดับการแสดง *
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Control
                                  type="text"
                                  name="SEQ"
                                  readOnly={CODE.showReadOnly}
                                  value={form.values.SEQ}
                                  onChange={form.handleChange}
                                  isInvalid={!!form.errors.SEQ}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {form.errors.SEQ}
                                </Form.Control.Feedback>
                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    {/* สถานะ */}
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
                                  required
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
                                  name="CREATED_DATE"
                                  value={current}
                                  id="CREATED_DATE"
                                  type="hidden"
                                />
                                <Form.Control
                                  name="ENABLE"
                                  value={senable}
                                  id="ENABLE"
                                  type="hidden"
                                />
                                <Form.Control
                                  name="TYPE_LINK"
                                  value="Y"
                                  type="hidden"
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                        </Form.Group>
                      </Col>
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
      <PdfViewer
        show={showSlip}
        title={attFile}
        url={`${apiUrlBase}/document/get-file-ann?code=${payKey}`}
        onClose={() => setShowSlip(false)}
      />
    </>
  );
};

export default LssITA05Config;
