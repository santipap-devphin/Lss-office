import { useState, useEffect, useCallback, ChangeEvent, SyntheticEvent, FC, Fragment } from "react";
import "@sweetalert2/theme-minimal/minimal.scss";
import { LssITA70List, LSSIR019DynamicReport, LSSIR019DynamicReportExcel, getCommon } from "../../data";
import { Card, Col, Form, FormGroup, FormLabel, Row } from "react-bootstrap";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import Downloading from "@mui/icons-material/Downloading";
import NavMenu from "../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
import * as yup from "yup";
import "./default.scss";
import { DatePicker, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Field, FormikProvider, useFormik } from "formik";
import { LSS_T_DR_PARAMETER, LSS_T_DYNAMIC_REPORT } from "../../models/office/LSS_T_DYNAMIC_REPORT.model";
import { dynamicReportParameterType } from "../../functions/DynamicReport";
import { toThaiDateString } from "../../functions/Date";
import moment from "moment";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
const currentYear = new Date().getFullYear();
const yearOptions = Array(10).fill("").map((x, i) => currentYear - i);
const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

interface Company {
  CODE: string;
  NAME: string;
  COMPANY_TYPE_CODE: string;
}

const styles = {
  datpicker: {
    width: "100%",
    height: "100%",
    verticalAlign: "middle",
  },
};

const DynamicControl: FC<{ parameter: LSS_T_DR_PARAMETER, formik: any, companyOptions: Company[] }> = ({ parameter, formik, companyOptions }) => {
  companyOptions = companyOptions ?? []
  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    setErrors,
    setValues,
    setFieldValue,
    setFieldError,
    resetForm
  } = formik;
  if (parameter.TYPE_CODE === dynamicReportParameterType.Text) {
    return (
      <Col lg={4} md={6}>
        <FormGroup>
          <FormLabel>{parameter.DISPLAY_NAME}</FormLabel>
          <Form.Control
            name={parameter.NAME}
            onChange={handleChange}
            isInvalid={!!errors[parameter.NAME || ""]}
          />
          <Form.Control.Feedback type="invalid">
            {errors[parameter.NAME || ""]}
          </Form.Control.Feedback>
        </FormGroup>
      </Col>
    )
  } else if (parameter.TYPE_CODE === dynamicReportParameterType.Number) {
    return (
      <Col lg={2} md={4}>
        <FormGroup>
          <FormLabel>{parameter.DISPLAY_NAME}</FormLabel>
          <Form.Control
            type="number"
            name={parameter.NAME}
            onChange={handleChange}
            isInvalid={!!errors[parameter.NAME || ""]}
          />
          <Form.Control.Feedback type="invalid">
            {errors[parameter.NAME || ""]}
          </Form.Control.Feedback>
        </FormGroup>
      </Col>
    )
  } else if (parameter.TYPE_CODE === dynamicReportParameterType.FlagYN) {
    return (
      <Col lg={2} md={4}>
        <FormGroup>
          <FormLabel>{parameter.DISPLAY_NAME}</FormLabel>
          <Form.Control
            as={"select"}
            name={parameter.NAME}
            onChange={handleChange}
            isInvalid={!!errors[parameter.NAME || ""]}
          >
            <option value="">ทั้งหมด</option>
            <option value="Y">ใช่</option>
            <option value="N">ไม่ใช่</option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors[parameter.NAME || ""]}
          </Form.Control.Feedback>
        </FormGroup>
      </Col>
    )
  }
  else if (parameter.TYPE_CODE === dynamicReportParameterType.BEYearOptions) {
    return (
      <Col lg={2} md={4}>
        <FormGroup>
          <FormLabel>{parameter.DISPLAY_NAME}</FormLabel>
          <Form.Control
            as={"select"}
            name={parameter.NAME}
            onChange={handleChange}
            isInvalid={!!errors[parameter.NAME || ""]}
          >
            <option value="">ทั้งหมด</option>
            {
              yearOptions.map(x => <option key={x} value={x + 543}>{x + 543}</option>)
            }
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors[parameter.NAME || ""]}
          </Form.Control.Feedback>
        </FormGroup>
      </Col>
    )
  } if (parameter.TYPE_CODE === dynamicReportParameterType.CEYearOptions) {
    return (
      <Col lg={2} md={4}>
        <FormGroup>
          <FormLabel>{parameter.DISPLAY_NAME}</FormLabel>
          <Form.Control
            as={"select"}
            name={parameter.NAME}
            onChange={handleChange}
            isInvalid={!!errors[parameter.NAME || ""]}
          >
            <option value="">ทั้งหมด</option>
            {
              yearOptions.map(x => <option key={x} value={x}>{x + 543}</option>)
            }
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors[parameter.NAME || ""]}
          </Form.Control.Feedback>
        </FormGroup>
      </Col>
    )
  } else if (parameter.TYPE_CODE === dynamicReportParameterType.QuarterOptions) {
    return (
      <Col lg={2} md={4}>
        <FormGroup>
          <FormLabel>{parameter.DISPLAY_NAME}</FormLabel>
          <Form.Control
            as={"select"}
            name={parameter.NAME}
            onChange={handleChange}
            isInvalid={!!errors[parameter.NAME || ""]}
          >
            <option value="">ทั้งหมด</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors[parameter.NAME || ""]}
          </Form.Control.Feedback>
        </FormGroup>
      </Col>
    )
  } else if (parameter.TYPE_CODE === dynamicReportParameterType.MonthOptions) {
    return (
      <Col lg={2} md={4}>
        <FormGroup>
          <FormLabel>{parameter.DISPLAY_NAME}</FormLabel>
          <Form.Control
            as={"select"}
            name={parameter.NAME}
            onChange={handleChange}
            isInvalid={!!errors[parameter.NAME || ""]}
          >
            <option value="">ทั้งหมด</option>
            {
              new Array(12).fill("").map((x, i) => i + 1).map(x => <option key={x} value={x}>{monthNames[x - 1]}</option>)
            }
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors[parameter.NAME || ""]}
          </Form.Control.Feedback>
        </FormGroup>
      </Col>
    )
  } else if (parameter.TYPE_CODE === dynamicReportParameterType.AccountTypeOptions) {
    return (
      <Col lg={2} md={4}>
        <FormGroup>
          <FormLabel>{parameter.DISPLAY_NAME}</FormLabel>
          <Form.Control
            as={"select"}
            name={parameter.NAME}
            onChange={handleChange}
            isInvalid={!!errors[parameter.NAME || ""]}
          >
            <option value="">ทั้งหมด</option>
            <option value="0">บริษัทฯ</option>
            <option value="1">เจ้าหน้าที่</option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors[parameter.NAME || ""]}
          </Form.Control.Feedback>
        </FormGroup>
      </Col>
    )
  } else if (parameter.TYPE_CODE === dynamicReportParameterType.CompanyOptions) {
    return (
      <Col lg={2} md={4}>
        <FormGroup>
          <FormLabel>{parameter.DISPLAY_NAME}</FormLabel>
          <Form.Control
            as={"select"}
            name={parameter.NAME}
            onChange={handleChange}
            isInvalid={!!errors[parameter.NAME || ""]}
          >
            <option value="">ทั้งหมด</option>
            {
              companyOptions.map(x => <option key={x.CODE} value={x.CODE}>{x.NAME}</option>)
            }
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors[parameter.NAME || ""]}
          </Form.Control.Feedback>
        </FormGroup>
      </Col>
    )
  } else if (parameter.TYPE_CODE === dynamicReportParameterType.Date) {
    return (
      <Col lg={2} md={4}>
        <FormGroup>
          <FormLabel>{parameter.DISPLAY_NAME}</FormLabel>
          <DatePicker
            allowClear={true}
            format={(val) => val ? toThaiDateString(val.toDate(), "DD/MM/YYYY") : ""}
            className="form-control"
            value={values[parameter.NAME || ""] ? moment(values[parameter.NAME || ""]) : null}
            onChange={(val) => { setFieldValue(parameter.NAME, val?.toDate().toISOString()) }}
            style={styles.datpicker}
            status={!!errors[parameter.NAME || ""] ? "error" : ""}
          />
          <Form.Control
            type="hidden"
            isInvalid={!!errors[parameter.NAME || ""]}
            name={parameter.NAME}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            {errors[parameter.NAME || ""]}
          </Form.Control.Feedback>
        </FormGroup>
      </Col>
    )
  } else if (parameter.TYPE_CODE === dynamicReportParameterType.DateTime) {
    return (
      <Col lg={2} md={4}>
        <FormGroup>
          <FormLabel>{parameter.DISPLAY_NAME}</FormLabel>
          <DatePicker
            showTime
            allowClear={true}
            //name={parameter.NAME}
            format={(val) => val ? toThaiDateString(val.toDate(), "DD/MM/YYYY HH:mm:ss") : ""}
            className="form-control"
            value={values[parameter.NAME || ""] ? moment(values[parameter.NAME || ""]) : null}
            status={!!errors[parameter.NAME || ""] ? "error" : ""}
            onChange={(val) => {
              const iso = val?.toDate().toISOString();
              setFieldValue(parameter.NAME, iso);
            }}
            style={styles.datpicker}
          />
          <Form.Control
            type="hidden"
            isInvalid={!!errors[parameter.NAME || ""]}
            name={parameter.NAME}
            onChange={handleChange} />
          <Form.Control.Feedback type="invalid">
            {errors[parameter.NAME || ""]}
          </Form.Control.Feedback>
        </FormGroup>
      </Col>
    )
  }

  return (
    <>
    </>
  )
}

export default function LssIR019() {
  const [selectedReport, setSelectedReport] = useState<LSS_T_DYNAMIC_REPORT | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [reportOptions, setReportOptions] = useState<LSS_T_DYNAMIC_REPORT[]>([]);
  const [showQuery, setShowQuery] = useState(false);
  const [companyOptions, setCompanyOptions] = useState<Company[]>([]);
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [resultData, setResultData] = useState<any[]>([]);

  const initValues: any = {};
  (selectedReport?.PARAMETERS || []).forEach(p => {
    initValues[p.NAME || ""] = null;
  });

  const validationSchema: any = {};

  (selectedReport?.PARAMETERS || []).filter(p => p.IS_REQUIRE === "Y").forEach(p => {
    validationSchema[p.NAME || ""] = yup.string().nullable().required("จำเป็นต้องระบุ");
  });

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: yup.object().shape(validationSchema),
    onSubmit: (data) => {
      const mode = data.MODE;
      delete data.MODE
      if (mode === "EXPORT") {
        LSSIR019DynamicReportExcel({ ID: selectedReport?.ID || 0, PARAMS: data, SORT_BY: sortBy, SORT_DIRECTION: sortDirection }, `${selectedReport?.REPORT_NAME}.xlsx`)
      } else if (mode === "SEARCH") {
        LSSIR019DynamicReport({ ID: selectedReport?.ID || 0, PARAMS: data, SORT_BY: sortBy, SORT_DIRECTION: sortDirection })
          .then((res) => {
            const result = (res.DATA || []).map((x, i) => ({ id: i, ...x }))
            setResultData(result);
          })
      }
    },
  });

  const columns: GridColDef[] = (selectedReport?.FIELDS || []).map(x => ({ field: x.NAME || "", headerName: x.DISPLAY_NAME || "", resizable: true, width: 185, minWidth: 150, maxWidth: 250, align: 'right',headerAlign: 'center' }));

  useEffect(() => {
    const selectedItem = reportOptions.find(x => x.ID === selectedReportId) ?? null;
    setSelectedReport(selectedItem);
    setShowQuery(false)
    setSortBy("");
    setSortDirection("");
  }, [selectedReportId])

  useEffect(() => {
    LssITA70List().then(data => {
      setReportOptions(data);
    })

    getCommon().then((data) => {
      setCompanyOptions(data.COMPANIES)
    })
  }, [])

  return (
    <>
      <div>
        <NavMenu />
        <div style={{ width: "100%", marginTop: 100 }}>
          <h5>
            <FaBars size={30} style={{ margin: "auto" }} />
            &nbsp;&nbsp; รายงานสำหรับแสดงข้อมูล ในลักษณะ DYNAMIC
            REPORT ต่อ 1 เมนู <br /> ตามเงื่อนไขที่สำนักงาน คปภ. กำหนด
          </h5>
          <div className="mt-4">
            <Row>
              <Col md="2"></Col>
              <Col md="8">
                <FormGroup as={Row} className="align-items-center">
                  <FormLabel className="col-md-2 mb-0">รายงาน</FormLabel>
                  <Col md="10">
                    <select
                      className="form-select"
                      value={selectedReportId || ""}
                      onChange={(e) => {
                        setSelectedReportId(() => Number(e.target.value || ""));
                      }}
                    >
                      <option value="">เลือกรายงาน</option>
                      {reportOptions.map((r) => (
                        <option key={r.ID} value={r.ID}>
                          {r.REPORT_NAME}
                        </option>
                      ))}
                    </select>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
            <div className="d-flex justify-content-center mt-3">
              <Button color="primary" variant="contained" disabled={!selectedReport}
                onClick={() => {
                  formik.setFieldValue("MODE", "SEARCH")
                  formik.handleSubmit();
                }}>ค้นหา</Button>&nbsp;&nbsp;&nbsp;
              <Button color="info" variant="contained" disabled={!selectedReport} onClick={() => setShowQuery(!showQuery)}>{showQuery ? "ซ่อน" : "แสดง"} Query</Button>
            </div>
            <hr />
            <div className="px-4">
              <FormikProvider value={formik}>
                <Form>
                  <input type="hidden" name="MODE" value={formik.values.MODE || ""} />
                  <Row>
                    {
                      selectedReport && <Fragment>
                        {(selectedReport?.PARAMETERS || []).map(p => <DynamicControl key={p.ID} formik={formik} parameter={p} companyOptions={companyOptions} />)}
                        <Col lg={2} md={4}>
                          <FormGroup>
                            <FormLabel>จัดเรียงตาม</FormLabel>
                            <Form.Control
                              as={"select"}
                              value={sortBy}
                              onChange={(e) => {
                                setSortBy(e.target.value)
                              }}
                            >
                              <option value="">เลือกจัดเรียงตาม</option>
                              {
                                (selectedReport?.FIELDS || []).map(f => <option value={f.NAME} key={f.NAME}>{f.DISPLAY_NAME}</option>)
                              }
                            </Form.Control>
                          </FormGroup>
                        </Col>
                        <Col lg={2} md={4}>
                          <FormGroup>
                            <FormLabel>การจัดเรียง</FormLabel>
                            <Form.Control
                              as={"select"}
                              value={sortDirection}
                              onChange={(e) => {
                                setSortDirection(e.target.value)
                              }}
                            >
                              <option value="">เลือกการจัดเรียง</option>
                              <option value="ASC">จากน้อยไปมาก</option>
                              <option value="DESC">จากมากไปน้อย</option>
                            </Form.Control>
                          </FormGroup>
                        </Col>
                      </Fragment>
                    }
                  </Row>
                </Form>
              </FormikProvider>
            </div>
            {
              showQuery && (<Fragment>
                <hr />
                <div className="px-4">
                  <FormGroup>
                    <FormLabel>Query</FormLabel>
                    <Form.Control
                      as={"textarea"}
                      rows={5}
                      readOnly={true}
                      value={selectedReport?.QUERY || ""}
                    />
                  </FormGroup>
                </div>
              </Fragment>)
            }
            {
              selectedReport && <Fragment>
                <hr />
                <Row>

                  <Col>
                    <Card style={{ marginTop: "1rem", marginBottom: "2rem" }}>
                      <Card.Header>
                        <div className="d-flex justify-content-between align-items-center">
                          <div> ผลลัพธ์</div>
                          <div>
                            <Button
                              style={{ marginRight: 5 }}
                              variant="contained"
                              startIcon={<Downloading />}
                              onClick={() => {
                                formik.setFieldValue("MODE", "EXPORT")
                                formik.handleSubmit();
                              }}
                            >
                              {" "}
                              Excel
                            </Button>
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <div style={{ height: 500, width: "100%" }}>
                          <DataGrid rows={resultData} columns={columns} />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Fragment>
            }
          </div>
        </div>
      </div>
    </>
  );
}
