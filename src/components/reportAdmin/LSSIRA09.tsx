import React, { ChangeEvent } from "react";
import { useState, useEffect, useCallback } from "react";
import { Col, Row, Card, Container, Form } from "react-bootstrap";
import { DataGrid, GridColDef, GridRenderCellParams, GridValueFormatterParams } from "@mui/x-data-grid";
import { donwloadFile, downloadFilePost, getCommon, getLSSIRA09 } from "../../data";
import NavMenu from "../fragments/NavMenu";
import "./LssEt030CompareCrr.scss";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import { DataResponse } from "../../models/common/data-response.model";
import { CompanySelect } from "../../models/common/company-select.model";
import { FaBars } from "react-icons/fa";
import { DatePicker, DatePickerProps } from "antd";
import { Moment } from "moment";
import QuaterSearchPanel from "./shared/QuaterSearchPanel";
import { LSS_V_LSSIRA09 } from "../../models/office/LSS_V_LSSIRA09.model";
import { parseISO, format } from "date-fns";
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

export default function LSSIRA09() {
  const [common, setCommon] = useState<{ COMPANIES: CompanySelect[] }>({
    COMPANIES: [],
  });

  const accountTypes: { value: string; label: string }[] = [
    {
      label: "บริษัทฯ",
      value: "0",
    },
    {
      label: "เจ้าหน้าที่",
      value: "1",
    },
  ];

  const [gridData, setGridData] = useState<LSS_V_LSSIRA09[]>([]);

  const [from, setFrom] = useState<Moment | null>(null);
  const [to, setTo] = useState<Moment | null>(null);

  const [quarter, setQuarter] = useState<number>(0);
  const [year, setYear] = useState<number>(0);
  const [month, setMonth] = useState<number>(0);

  const [selectedAccountTypeCode, setSelectedAccountTypeCode] =
    useState<string>("");
  const [selectedCompanyCode, setSelectedCompanyCode] = useState<string>("");
  const [loginName, setLoginName] = useState<string>("");

  const customDateFormat: DatePickerProps["format"] = (date: Moment) => {
    return toThaiDateString(date.toDate(), "DD/MM/YYYY");
  };

  const handleFromChanged = useCallback((date: Moment | null) => {
    setFrom(date);
  }, []);

  const handleToChanged = useCallback((date: Moment | null) => {
    setTo(date);
  }, []);

  const handleSearchQuarter = useCallback((y: number, q: number, m: number) => {
    setYear(y);
    setQuarter(q);
    setMonth(m);
  }, []);

  const handleOnLoad = () => {
    return new Promise((resolve) => {
      getCommon().then((data: DataResponse) => {
        setCommon({
          COMPANIES: [...data.COMPANIES] as CompanySelect[],
        });
      });

      getLSSIRA09(null).then((data) => setGridData(data));

      resolve(true);
    });
  };

  const handleSearch = () => {
    let record = {} as Record<string, any>;
    if (from && to && from.diff(to) <= 0) {
      record["FROM"] = from.toDate().toISOString();
      record["TO"] = to.toDate().toISOString();
    }

    if (selectedAccountTypeCode.length > 0)
      record["ACCOUNT_TYPE"] = selectedAccountTypeCode;

    if (selectedCompanyCode.length > 0)
      record["COMPANY_CODE"] = selectedCompanyCode;

    if (loginName.length > 0) record["LOGIN_NAME"] = loginName;

    if (year > 0) record["YEAR"] = year;

    if (quarter > 0) record["QUARTER"] = quarter;

    if (month > 0) record["MONTH"] = month;

    getLSSIRA09(record).then((data) => setGridData(data));
  };

  const handleDownloadExcel = () => {
    let record = {} as Record<string, any>;
    if (from && to && from.diff(to) <= 0) {
      record["FROM"] = from.toDate().toISOString();
      record["TO"] = to.toDate().toISOString();
    }

    if (selectedAccountTypeCode.length > 0)
      record["ACCOUNT_TYPE"] = selectedAccountTypeCode;

    if (selectedCompanyCode.length > 0)
      record["COMPANY_CODE"] = selectedCompanyCode;

    if (loginName.length > 0) record["LOGIN_NAME"] = loginName;

    if (year > 0) record["YEAR"] = year;

    if (quarter > 0) record["QUARTER"] = quarter;

    if (month > 0) record["MONTH"] = month;
    downloadFilePost(
      `/LssIRA09/LSSIRA09Excel`,
      "LSS-IR-A09_รายงานสรุปบัญชีผู้ใช้งานที่ใส่รหัสผ่านผิดเกินจำนวนครั้งที่กำหนด.xlsx",
      record
    );
  };

  useEffect(() => {
    handleOnLoad();
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ลำดับ", width: 50, align: "center", headerAlign: "center", },
    {
      field: "TRANS_DATE",
      headerName: "วันที่/เวลา",
      width: 170,
      align: "left",
      headerAlign: "center",
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        const date = parseISO(params.value);
        return date.toLocaleTimeString("th-TH", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      },
    },
    { field: "LOGIN_NAME", 
      headerName: "ชื่อบัญชีผู้ใช้งาน", 
      width: 120,
      align: "left",
      headerAlign: "center", 
    },
    {
      field: "ACCOUNT_TYPE_NAME",
      headerName: "ประเภท Account",
      width: 250,
      align: "left",
      headerAlign: "center"
    },
    { field: "COMPANY_NAME", 
      headerName: "ชื่อบริษัท", 
      width: 500,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "QTY",
      align: "right",
      headerAlign: "center",
      headerName: "จำนวนการใส่รหัสผ่านผิด",
      width: 170,
    },
  ];

  return (
    <Container fluid>
      <Row>
        <Col>
          <NavMenu />
          <h5 style={{ marginTop: "7rem" }}>
            <FaBars size={30} style={{ margin: "auto" }} />
            &nbsp;&nbsp;LSS-IR-A09
            รายงานสรุปบัญชีผู้ใช้งานที่ใส่รหัสผ่านผิดเกินจำนวนครั้งที่กำหนด
          </h5>
          <Card>
            <Card.Header>
              LSS-IR-A09
              รายงานสรุปบัญชีผู้ใช้งานที่ใส่รหัสผ่านผิดเกินจำนวนครั้งที่กำหนด
            </Card.Header>
            <Card.Body>
              <Row style={{ marginBottom: 10, marginTop: 20 }}>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}></Col>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  ช่วงวันที่
                </Col>
                <Col sm={6} lg={2}>
                  <DatePicker
                    allowClear={true}
                    format={customDateFormat}
                    className="form-control"
                    value={from ?? null}
                    onChange={handleFromChanged}
                    style={styles.datpicker}
                  />
                </Col>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  ถึงวันที่
                </Col>
                <Col sm={6} lg={2}>
                  <DatePicker
                    allowClear={true}
                    format={customDateFormat}
                    className="form-control"
                    value={to ?? null}
                    onChange={handleToChanged}
                    style={styles.datpicker}
                  />
                </Col>
                <Col sm={6} lg={2} style={{ textAlign: "right" }}>
                  ประเภท Account
                </Col>
                <Col sm={6} lg={2}>
                  <select
                    className="form-select"
                    value={selectedAccountTypeCode}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSelectedAccountTypeCode(e.target.value)
                    }
                  >
                    <option value="">ทั้งหมด</option>
                    {accountTypes.map((at, i) => (
                      <option key={i} value={at.value}>
                        {at.label}
                      </option>
                    ))}
                  </select>
                </Col>
              </Row>
              {/* <Row style={{ marginBottom: 10, marginTop: 20 }}>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  ประเภทข้อมูล :
                </Col>
                <QuaterSearchPanel onChanged={handleSearchQuarter} />
              </Row> */}
              <Row style={{ marginBottom: 10, marginTop: 20 }}>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}></Col>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  ชื่อบัญชีผู้ใช้งาน
                </Col>
                <Col sm={6} lg={2}>
                  <Form.Control
                    type="text"
                    value={loginName}
                    onInput={(e: ChangeEvent<HTMLInputElement>) => {
                      setLoginName(e.target.value);
                    }}
                  />
                </Col>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  บริษัท
                </Col>
                <Col sm={6} lg={2}>
                  <select
                    className="form-select"
                    value={selectedCompanyCode}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSelectedCompanyCode(e.target.value)
                    }
                  >
                    <option value="">ทั้งหมด</option>
                    {common.COMPANIES.map((c) => (
                      <option key={c.CODE} value={c.CODE}>
                        {c.NAME}
                      </option>
                    ))}
                  </select>
                </Col>

                <Col
                  lg={1}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    textAlign: "right",
                  }}
                >
                  <Button
                    style={{ marginRight: 5 }}
                    variant="contained"
                    startIcon={<Search />}
                    onClick={handleSearch}
                  >
                    ค้นหา
                  </Button>
                </Col>
                <Col
                  md={1}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    textAlign: "right",
                  }}
                >
                  <Button
                    style={{ marginRight: 5 }}
                    variant="contained"
                    startIcon={<Downloading />}
                    onClick={handleDownloadExcel}
                  >
                    Excel
                  </Button>
                </Col>
              </Row>
              <div style={{ height: 500, width: "100%" }}>
                <DataGrid rows={gridData} columns={columns} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
