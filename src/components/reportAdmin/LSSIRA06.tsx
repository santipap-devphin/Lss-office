import React, { ChangeEvent, SyntheticEvent, useCallback } from "react";
import { useState, useEffect } from "react";
import { Col, Row, Card, Container, Form, FormGroup, FormLabel } from "react-bootstrap";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { donwloadFile, getCommon, getLSSIRA06, getSectionList, LssITA60ListAPI, getCompanyList, downloadFilePost } from "../../data";
//import moment from "moment";
import NavMenu from "../fragments/NavMenu";
import "./LssEt030CompareCrr.scss";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import { CompanySelect } from "../../models/common/company-select.model";
import { FaBars } from "react-icons/fa";
import { DatePicker, DatePickerProps } from "antd";
import { Moment } from "moment";
import { format, parseISO } from "date-fns";
import { LSS_V_LSSIRA06 } from "../../models/office/LSS_V_LSSIRA06.model";
import QuaterSearchPanel from "./shared/QuaterSearchPanel";
import th from "date-fns/locale/th";
import { Downloading } from "@mui/icons-material";
import { toThaiDateString } from "../../functions/Date";

const styles = {
  datpicker: {
    width: "100%",
    height: "100%",
    verticalAlign: "middle",
  },
};

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentQuater = currentMonth >= 10 ? 4 : currentMonth >= 7 ? 3 : currentMonth >= 4 ? 2 : 1;
const currentQuaters = new Array(currentQuater).fill("").map((x, i) => i + 1);
const currentQuaterMonths = [1, 2, 3].map(x => x + (3 * (currentQuater - 1))).filter(x => x <= currentMonth);
const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

export default function LSSIRA06() {
  const [gridData, setGridData] = useState<LSS_V_LSSIRA06[]>([]);
  const [common, setCommon] = useState<{
    COMPANIES: CompanySelect[];
  }>({
    COMPANIES: [],
  });

  const [from, setFrom] = useState<Moment | null>(null);
  const [to, setTo] = useState<Moment | null>(null);
  const [loginName, setLoginName] = useState<string>("");
  const [company, setCompany] = useState<string>("");

  const [year, setYear] = useState<number>(0);
  const [quarter, setQuarter] = useState<number>(0);
  const [month, setMonth] = useState<number>(0);
  const [section, setSection] = useState<string>("");
  const [sectionOptions, setSectionOptions] = useState<any[]>([]);
  const [companyOptions, setCompanyOptions] = useState<any[]>([]);
  const [companyType, setCompanyType] = useState<string>("0");
  const [accountType, setAccountType] = useState<string>("0");
  const [yearOptions, setYearOptions] = useState<number[]>(Array(10).fill("").map((x, i) => currentYear - i));

  const _companyOptions = companyOptions.filter(x => x.COMPANY_TYPE_CODE === companyType || companyType === "0")
  const quaterOptions = !year || year > currentYear ? [] : year === currentYear ? currentQuaters : [1, 2, 3, 4]
  const monthOptions = !quarter ? new Array(12).fill("").map((x, i) => i + 1) : year === currentYear && quarter === currentQuater ? currentQuaterMonths : [1, 2, 3].map(x => x + (3 * (quarter - 1)));

  const handleOnLoad = useCallback(() => {
    return new Promise((resolve) => {
      getCommon().then((data: any) => {
        setCommon({
          COMPANIES: [...data.COMPANIES] as CompanySelect[],
        });
      });

      getCompanyList({}).then((data) => {
        setCompanyOptions(data)
      })
      getSectionList({}).then((data) => {
        setSectionOptions(data)
      })


      getLSSIRA06(null).then((data) => {
        setGridData(data);
      });

      resolve(true);
    });
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ลำดับที่", minWidth: 10, align: "center", headerAlign: "center" },
    {
      field: "YEAR",
      headerName: "ปี",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<any, LSS_V_LSSIRA06, any>) => {
        return Number(params?.row?.YEAR) + 543;
      },
    },
    {
      field: "QUARTER",
      headerName: "ไตรมาส",
      flex: 1,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "MONTH",
      headerName: "เดือน",
      renderCell: (params: GridRenderCellParams<any, LSS_V_LSSIRA06, any>) => {
        return monthNames[Number(params?.row?.MONTH) - 1]
      },
      flex: 1,
      align: "left",
      headerAlign: "center"
    },
    {
      field: "LOGIN_NAME",
      headerName: "ชื่อบัญชีผู้ใช้งาน",
      flex: 1,
      align: "left",
      headerAlign: "center"
    },
    {
      field: "ACCOUNT_TYPE_NAME",
      headerName: "ประเภท Account",
      flex: 1,
      align: "left",
      headerAlign: "center"
    },
    {
      field: "COMPANY_NAME",
      headerName: "ชื่อบริษัท / ชื่อสังกัด",
      flex: 1,
      align: "left",
      headerAlign: "center"
    },
    { field: "QTY", headerName: "จำนวนการเข้าใช้ระบบ", flex: 1, align: "right", headerAlign: "center" },
  ];

  const customDateFormat: DatePickerProps["format"] = (date: Moment) => {
    return toThaiDateString(date.toDate(), "DD/MM/YYYY");
  };

  const handleSearch = () => {
    let record = {} as Record<string, any>;

    if (from && to && from.diff(to) <= 0) {
      record["FROM"] = from.toDate().toISOString();
      record["TO"] = to.toDate().toISOString();
    }

    if (loginName.length > 0) record["LOGIN_NAME"] = loginName;

    if (year > 0) record["YEAR"] = year;

    if (quarter > 0) record["QUARTER"] = quarter;

    if (month > 0) record["MONTH"] = month;

    if (accountType !== "") record["ACCOUNT_TYPE_CODE"] = accountType;

    if (company !== "0" && company !== "" && accountType === "0") record["COMPANY_CODE"] = company;

    if (section !== "0" && section !== "" && accountType === "1") record["SECTION_CODE"] = section;

    if (companyType !== "0" && companyType !== "") record["COMPANY_TYPE_CODE"] = companyType;

    getLSSIRA06(record).then((data) => {
      setGridData(data);
    });
  };

  const handleFromChanged = (date: Moment | null) => {
    setFrom(() => date);
  };

  const handleToChanged = (date: Moment | null) => {
    setTo(() => date);
  };

  const handleSearchChanged = useCallback((y: number, q: number, m: number) => {
    setYear(() => y);
    setQuarter(() => q);
    setMonth(() => m);
  }, []);

  const handleDownloadExcel = () => {
    let record = {} as Record<string, any>;

    if (from && to && from.diff(to) <= 0) {
      record["FROM"] = from.toDate().toISOString();
      record["TO"] = to.toDate().toISOString();
    }

    if (loginName.length > 0) record["LOGIN_NAME"] = loginName;

    if (year > 0) record["YEAR"] = year;

    if (quarter > 0) record["QUARTER"] = quarter;

    if (month > 0) record["MONTH"] = month;

    if (accountType !== "") record["ACCOUNT_TYPE_CODE"] = accountType;

    if (company !== "0" && company !== "" && accountType === "0") record["COMPANY_CODE"] = company;

    if (section !== "0" && section !== "" && accountType === "1") record["SECTION_CODE"] = section;

    if (companyType !== "0" && companyType !== "") record["COMPANY_TYPE_CODE"] = companyType;
    downloadFilePost(
      `/LssIRA06/LSSIRA06Excel`,
      "LSS-IR-A06_รายงานสรุปจำนวนการเข้าใช้ระบบของแต่บัญชีผู้ใช้งาน.xlsx",
      record
    );
  };

  useEffect(() => {
    handleOnLoad();
  }, [handleOnLoad]);

  return (
    <Container fluid>
      <Row>
        <Col>
          <NavMenu />
          <h5 style={{ marginTop: "7rem" }}>
            <FaBars size={30} style={{ margin: "auto" }} />
            LSS-IR-A06 รายงานสรุปจำนวนการเข้าใช้ระบบของแต่บัญชีผู้ใช้งาน
            แยกรายเดือน/ไตรมาส/ปี
          </h5>
          <Card>
            <Card.Header>
              LSS-IR-A06 รายงานสรุปจำนวนการเข้าใช้ระบบของแต่บัญชีผู้ใช้งาน
              แยกรายเดือน/ไตรมาส/ปี
            </Card.Header>
            <Card.Body>
              <Row className="flex-column flex-md-row mb-2">
                <Col>
                  <Row>
                    <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                      <FormGroup as={Row} className="align-items-center">
                        <FormLabel className="col-md-4 label-right mb-0">ตั้งแต่วันที่</FormLabel>
                        <Col md="8">
                          <DatePicker
                            allowClear={true}
                            format={customDateFormat}
                            className="form-control"
                            value={from ?? null}
                            onChange={handleFromChanged}
                            style={styles.datpicker}
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                      <FormGroup as={Row} className="align-items-center">
                        <FormLabel className="col-md-4 label-right mb-0">ถึงวันที่</FormLabel>
                        <Col md="8">
                          <DatePicker
                            allowClear={true}
                            format={customDateFormat}
                            className="form-control"
                            value={to ?? null}
                            onChange={handleToChanged}
                            style={styles.datpicker}
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                      <FormGroup as={Row} className="align-items-center">
                        <FormLabel className="col-md-4 label-right mb-0">ปี</FormLabel>
                        <Col md="8">
                          <select
                            className="form-select"
                            value={year}
                            onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
                              setYear(() => Number(e.currentTarget.value));
                              setQuarter(0)
                              setMonth(0)
                            }}
                          >
                            <option value="">ทั้งหมด</option>
                            {yearOptions.map((x: number, i: number) => (
                              <option key={i} value={x}>
                                {x + 543}
                              </option>
                            ))}
                          </select>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                      <FormGroup as={Row} className="align-items-center">
                        <FormLabel className="col-md-4 label-right mb-0">ไตรมาส</FormLabel>
                        <Col md="8">
                          <select
                            className="form-select"
                            value={quarter}
                            onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
                              setQuarter(() => Number(e.currentTarget.value));
                              setMonth(0)
                            }}
                          >
                            <option value="">ทั้งหมด</option>
                            {quaterOptions.map((x: number, i: number) => (
                              <option key={i} value={x}>
                                {x}
                              </option>
                            ))}
                          </select>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                      <FormGroup as={Row} className="align-items-center">
                        <FormLabel className="col-md-4 label-right mb-0">เดือน</FormLabel>
                        <Col md="8">
                          <select
                            className="form-select"
                            value={month}
                            onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
                              setMonth(() => Number(e.currentTarget.value));
                            }}
                          >
                            <option value="">ทั้งหมด</option>
                            {monthOptions.map((x: number, i: number) => (
                              <option key={i} value={x}>
                                {monthNames[x - 1]}
                              </option>
                            ))}
                          </select>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                      <FormGroup as={Row} className="align-items-center">
                        <FormLabel className="col-md-4 label-right mb-0">ประเภทผู้ใช้งาน</FormLabel>
                        <Col md="8">
                          <select
                            className="form-select"
                            value={accountType}
                            onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
                              setAccountType(() => e.currentTarget.value);
                              setCompany("")
                              setSection("")
                            }}
                          >
                            <option value="0">บริษัทฯ</option>
                            <option value="1">เจ้าหน้าที่</option>
                          </select>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                      <FormGroup as={Row} className="align-items-center">
                        <FormLabel className="col-md-4 label-right mb-0">ประเภทบริษัท</FormLabel>
                        <Col md="8">
                          <select
                            className="form-select"
                            value={companyType}
                            onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
                              setCompanyType(() => e.currentTarget.value);
                              setCompany("")
                            }}
                          >
                            <option value="0">ทั้งหมด</option>
                            <option value="LIFE">บริษัทประกันชีวิต</option>
                            <option value="NONLIFE">บริษัทประกันวินาศภัย</option>
                          </select>
                        </Col>
                      </FormGroup>
                    </Col>
                    {
                      accountType === "0" && <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                        <FormGroup as={Row} className="align-items-center">
                          <FormLabel className="col-md-4 label-right mb-0">บริษัท</FormLabel>
                          <Col md="8">
                            <select
                              className="form-select"
                              value={company}
                              onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
                                setCompany(() => e.currentTarget.value);
                              }}
                            >
                              <option value="">ทั้งหมด</option>
                              {_companyOptions.map((c) => (
                                <option key={c.CODE} value={c.CODE}>
                                  {c.NAME}
                                </option>
                              ))}
                            </select>
                          </Col>
                        </FormGroup>
                      </Col>
                    }
                    {
                      accountType === "1" && <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                        <FormGroup as={Row} className="align-items-center">
                          <FormLabel className="col-md-4 label-right mb-0">สังกัด</FormLabel>
                          <Col md="8">
                            <select
                              className="form-select"
                              value={section}
                              onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
                                setSection(() => e.currentTarget.value);
                              }}
                            >
                              <option value="0">ทั้งหมด</option>
                              {sectionOptions.map((c) => (
                                <option key={c.CODE} value={c.CODE}>
                                  {c.DESCRIPTION}
                                </option>
                              ))}
                            </select>
                          </Col>
                        </FormGroup>
                      </Col>
                    }
                  </Row>
                </Col>
                <Col xs="auto">
                  <div className="d-flex align-items-start flex-nowrap">
                    <Button
                      style={{ marginRight: 5 }}
                      variant="contained"
                      startIcon={<Search />}
                      onClick={handleSearch}
                    >
                      {" "}
                      ค้นหา
                    </Button>
                    <Button
                      style={{ marginRight: 5 }}
                      variant="contained"
                      startIcon={<Downloading />}
                      onClick={handleDownloadExcel}
                    >
                      {" "}
                      Excel
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col xs="12">
                  <div style={{ height: 500, width: "100%" }}>
                    <DataGrid rows={gridData} columns={columns} />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
