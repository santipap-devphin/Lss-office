// LSS-IR-A04 รายงานการใช้งานของเจ้าหน้าที่ผู้ใช้งานระบบของสำนักงาน คปภ
import React, { ChangeEvent, SyntheticEvent, useCallback } from "react";
import { useState, useEffect } from "react";
import { Col, Row, Card, Container, FormGroup, FormLabel } from "react-bootstrap";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { donwloadFile, downloadFilePost, getLSSIRA05, getLSSIRA05OnLoad } from "../../data";
//import moment from "moment";
import NavMenu from "../fragments/NavMenu";
import "./LssEt030CompareCrr.scss";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import { FaBars } from "react-icons/fa";
import { DatePicker, DatePickerProps } from "antd";
import { Moment } from "moment";
import { LSS_T_MENU } from "../../models/office/LSS_T_MENU.model";
import { LSS_T_FUNCTION } from "../../models/office/LSS_T_FUNCTION.model";
import { LSS_V_LSSIRA05 } from "../../models/office/LSS_V_LSSIRA05.model";
import QuaterSearchPanel from "./shared/QuaterSearchPanel";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
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

export default function LSSIRA05() {
  const [gridData, setGridData] = useState<LSS_V_LSSIRA05[]>([]);
  const [yearOptions, setYearOptions] = useState<number[]>(Array(10).fill("").map((x, i) => currentYear - i));

  const [from, setFrom] = useState<Moment | null>(null);
  const [to, setTo] = useState<Moment | null>(null);
  const [func, setFunc] = useState<string>("");
  const [accountType, setAccountType] = useState<string>("0");
  const [year, setYear] = useState<number>(0);
  const [quarter, setQuarter] = useState<number>(0);
  const [month, setMonth] = useState<number>(0);

  const [programs, setPrograms] = useState<LSS_T_MENU[]>([]);
  const [functions, setFunctions] = useState<LSS_T_FUNCTION[]>([]);

  const [subProgram, setSubProgram] = useState<string>("");
  const [selectedProgramCode, setSelectedProgramCode] = useState<string>("0");

  const quaterOptions = !year || year > currentYear ? [] : year === currentYear ? currentQuaters : [1, 2, 3, 4]
  const monthOptions = !quarter ? new Array(12).fill("").map((x, i) => i + 1) : year === currentYear && quarter === currentQuater ? currentQuaterMonths : [1, 2, 3].map(x => x + (3 * (quarter - 1)));

  const handleOnLoad = useCallback(() => {
    return new Promise((resolve) => {
      getLSSIRA05OnLoad().then((data) => {
        setPrograms(data.MENUS);
        setFunctions(data.FUNCTIONS);
      });

      // getLSSIRA05(null).then((data) => {
      //   setGridData(() => data);
      // });
      handleSearch()

      resolve(true);
    });
  }, []);

  const columns: GridColDef<any, LSS_V_LSSIRA05, any>[] = [
    { field: "id", headerName: "ลำดับ", minWidth: 10, align: "center", headerAlign: "center" },
    {
      field: "TRANS_DATE",
      headerName: "ปี",
      flex: 1,
      minWidth: 60,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        const date = parseISO(params.value);
        return date.getFullYear() + 543;
      },
    },

    {
      field: "QUARTER",
      headerName: "ไตรมาส",
      minWidth: 60,
      flex: 1,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "MONTH",
      headerName: "เดือน",
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<any, LSS_V_LSSIRA05, any>) => {
        return format(parseISO(params?.row?.TRANS_DATE.toString()), "LLLL", {
          locale: th,
        });
      },
      flex: 1,
      align: "left",
      headerAlign: "center"
    },
    { field: "SYSTEM_CODE", 
      headerName: "รหัสระบบงานหลัก", 
      flex: 1, 
      minWidth: 120, 
      align: "left", 
      headerAlign: "center", 
    },
    {
      field: "ACCOUNT_TYPE_CODE",
      headerName: "รหัสระบบงานย่อย",
      flex: 1,
      minWidth: 120,
      align: "left",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<any, LSS_V_LSSIRA05, any>) => {
        return params?.row?.ACCOUNT_TYPE_CODE === "0" ? (
          <>ฝั่งบริษัท</>
        ) : (
          <>ฝั่งเจ้าหน้าที</>
        );
      },
    },
    {
      field: "MENU_CODE",
      headerName: "รหัสโปรแกรม",
      flex: 1,
      minWidth: 150,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "MENU_NAME",
      headerName: "ชื่อโปรแกรม",
      minWidth: 350,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "FUNCTION_NAME",
      headerName: "ฟังก์ชัน",
      minWidth: 350,
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    { field: "QTY", 
      headerName: "จำนวนปัญหาการใช้งาน", 
      flex: 1, 
      minWidth: 100, 
      align: "right", 
      headerAlign: "center",
    },
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

    if (selectedProgramCode !== "" && selectedProgramCode !== "0")
      record["MENU_CODE"] = selectedProgramCode;

    if (func !== "" && func !== "0") record["FUNCTION_CODE"] = func;

    if (year > 0)
      record["YEAR"] = year;

    if (quarter > 0)
      record["QUARTER"] = quarter;

    if (month > 0)
      record["MONTH"] = month;

    if (accountType !== "") record["ACCOUNT_TYPE_CODE"] = accountType;

    getLSSIRA05(record).then((data) => {
      setGridData(data);
    });
  };

  const handleFromChanged = (date: Moment | null) => {
    setFrom(() => date);
  };

  const handleToChanged = (date: Moment | null) => {
    setTo(() => date);
  };

  const handleProgramChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProgramCode(e.target.value);
    setFunc("");
  };

  const handleSearchChanged = useCallback(
    (y: number, q: number, m: number) => {
      setYear(() => y);
      setQuarter(() => q);
      setMonth(() => m);
    },
    []
  );

  const handleDownloadExcel = () => {
    let record = {} as Record<string, any>;

    if (from && to && from.diff(to) <= 0) {
      record["FROM"] = from.toDate().toISOString();
      record["TO"] = to.toDate().toISOString();
    }

    if (selectedProgramCode !== "" && selectedProgramCode !== "0")
      record["MENU_CODE"] = selectedProgramCode;

    if (func !== "" && func !== "0") record["FUNCTION_CODE"] = func;

    if (year > 0)
      record["YEAR"] = year;

    if (quarter > 0)
      record["QUARTER"] = quarter;

    if (month > 0)
      record["MONTH"] = month;

    if (accountType !== "") record["ACCOUNT_TYPE_CODE"] = accountType;
    downloadFilePost(
      `/LssIRA05/LSSIRA05Excel`,
      "LSS-IR-A05_รายงานสรุปจำนวนปัญหาการใช้งานของแต่ละฟังก์ชัน.xlsx",
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
            LSS-IR-A05 รายงานสรุปจำนวนปัญหาการใช้งานของแต่ละฟังก์ชัน
            แยกรายเดือน/ไตรมาส/ปี
          </h5>
          <Card>
            <Card.Header>
              LSS-IR-A05 รายงานสรุปจำนวนปัญหาการใช้งานของแต่ละฟังก์ชัน
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
                        <FormLabel className="col-md-4 label-right mb-0">รหัสโปรแกรม</FormLabel>
                        <Col md="8">
                          <select
                            className="form-select"
                            value={selectedProgramCode}
                            onChange={handleProgramChanged}
                          >
                            <option value="0">ทั้งหมด</option>
                            {programs.map((pro: LSS_T_MENU, i: number) => (
                              <option key={i} value={pro.CODE}>
                                {pro.NAME}
                              </option>
                            ))}
                          </select>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                      <FormGroup as={Row} className="align-items-center">
                        <FormLabel className="col-md-4 label-right mb-0">ฟังก์ชัน</FormLabel>
                        <Col md="8">
                          <select
                            className="form-select"
                            disabled={
                              selectedProgramCode === "0" ||
                              !functions.some(
                                (x) => x.MENU_CODE === selectedProgramCode
                              )
                            }
                            value={func}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                              setFunc(() => e.target.value);
                            }}
                          >
                            <option value="0">ทั้งหมด</option>
                            {functions
                              .filter((func) => func.MENU_CODE === selectedProgramCode)
                              .map((func, i) => (
                                <option key={i} value={func.CODE}>
                                  {func.NAME}
                                </option>
                              ))}
                          </select>
                        </Col>
                      </FormGroup>
                    </Col>
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
