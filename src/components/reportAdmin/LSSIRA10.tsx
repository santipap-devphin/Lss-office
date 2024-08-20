import React, { ChangeEvent } from "react";
import { useState, useEffect, useCallback } from "react";
import { Col, Row, Card, Container } from "react-bootstrap";
import { DataGrid, GridColDef, GridRenderCellParams, GridValueFormatterParams } from "@mui/x-data-grid";
import NavMenu from "../fragments/NavMenu";
import "./LssEt030CompareCrr.scss";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import { FaBars } from "react-icons/fa";
import { DatePicker, DatePickerProps } from "antd";
import { Moment } from "moment";
import { LSS_T_MENU } from "../../models/office/LSS_T_MENU.model";
import { LSS_T_FUNCTION } from "../../models/office/LSS_T_FUNCTION.model";
import { LSS_T_ACCOUNT } from "../../models/office/LSS_T_ACCOUNT.model";
import { LSS_T_SECTION } from "../../models/office/LSS_T_SECTION.model";
import { donwloadFile, downloadFilePost, getLSSIRA10, getLSSIRA10OnLoad } from "../../data";
import { LSS_V_LSSIRA10 } from "../../models/office/LSS_V_LSSIRA10.model";
import { Downloading } from "@mui/icons-material";
import { toThaiDateString } from "../../functions/Date";
import { parseISO } from "date-fns";

const styles = {
  datpicker: {
    width: "100%",
    height: "100%",
    verticalAlign: "middle",
  },
};

export default function LSSIRA10() {
  const [loadData, setloadData] = useState<{
    MENUS: LSS_T_MENU[];
    FUNCTIONS: LSS_T_FUNCTION[];
    ACCOUNTS: LSS_T_ACCOUNT[];
    SECTIONS: LSS_T_SECTION[];
  }>();

  const sumMenus = [
    {
      value: "0",
      label: "ฝั่งบริษัท",
    },
    {
      value: "1",
      label: "ฝั่งเจ้าหน้าที่",
    },
  ];

  const [from, setFrom] = useState<Moment | null>(null);
  const [to, setTo] = useState<Moment | null>(null);
  const [gridData, setGridData] = useState<LSS_V_LSSIRA10[]>([]);

  const [selectedFunctionCode, setSelectedFunctionCode] = useState<string>("");
  const [selectedAccountCode, setSelectedAccountCode] = useState<string>("");
  const [selectedMenuCode, setSelectedMenuCode] = useState<string>("");
  const [selectedSectionCode, setSelectedSectionCode] = useState<string>("");
  const [selectedSubMenuCode, setSelectedSubMenuCode] = useState<string>("");

  const customDateFormat: DatePickerProps["format"] = (date: Moment) => {
    return toThaiDateString(date.toDate(), "DD/MM/YYYY");
  };

  const handleFromChanged = useCallback((date: Moment | null) => {
    setFrom(date);
  }, []);

  const handleToChanged = useCallback((date: Moment | null) => {
    setTo(date);
  }, []);

  const handleOnLoad = () => {
    return new Promise((resolve) => {
      getLSSIRA10OnLoad().then((data) => setloadData(data));
      getLSSIRA10(null).then((data) => setGridData(data));
      resolve(true);
    });
  };

  const handleSearch = () => {
    let record = {} as Record<string, any>;
    if (from && to && from.diff(to) <= 0) {
      record["FROM"] = from.toDate().toISOString();
      record["TO"] = to.toDate().toISOString();
    }

    if (selectedAccountCode.length > 0)
      record["LOGIN_NAME"] = selectedAccountCode;

    if (selectedFunctionCode.length > 0)
      record["FUNCTION_CODE"] = selectedFunctionCode;

    if (selectedMenuCode.length > 0) record["MENU_CODE"] = selectedMenuCode;

    if (selectedSectionCode.length > 0)
      record["SECTION_CODE"] = selectedSectionCode;

    if (selectedSubMenuCode.length > 0)
      record["ACCOUNT_TYPE_CODE"] = selectedSubMenuCode;

    getLSSIRA10(record).then((data) => setGridData(data));
  };

  const handleDownloadExcel = () => {
    let record = {} as Record<string, any>;
    if (from && to && from.diff(to) <= 0) {
      record["FROM"] = from.toDate().toISOString();
      record["TO"] = to.toDate().toISOString();
    }

    if (selectedAccountCode.length > 0)
      record["LOGIN_NAME"] = selectedAccountCode;

    if (selectedFunctionCode.length > 0)
      record["FUNCTION_CODE"] = selectedFunctionCode;

    if (selectedMenuCode.length > 0) record["MENU_CODE"] = selectedMenuCode;

    if (selectedSectionCode.length > 0)
      record["SECTION_CODE"] = selectedSectionCode;

    if (selectedSubMenuCode.length > 0)
      record["ACCOUNT_TYPE_CODE"] = selectedSubMenuCode;
    downloadFilePost(
      `/LssIRA10/LSSIRA10Excel`,
      "LSS-IR-A10_รายงานสรุป_Activity_ของผู้ดูแลระบบแยกเป็นรายฟังก์ชันและActivity_ที่สำคัญ.xlsx",
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
      headerName: "วันที่", 
      minWidth: 200 ,
      align: "left",
      headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        const date = parseISO(params.value);
        return toThaiDateString(date, "DD/MM/YYYY HH:mm:ss");
      },
    },
    { field: "LOGIN_NAME", 
      headerName: "ชื่อบัญชีผู้ใช้งาน", 
      minWidth: 150,
      align: "left",
      headerAlign: "center",
    },
    { field: "SECTION_NAME", 
      headerName: "ชื่อสังกัด", 
      minWidth: 300,
      align: "left",
      headerAlign: "center", 
    },
    {
      field: "NK1",
      headerName: "รหัสระบบงานหลัก",
      width: 150,
      align: "left",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<any, any, any>) => {
        return <>LSS</>;
      },
    },
    {
      field: "NK2",
      headerName: "รหัสระบบงานย่อย",
      width: 150,
      align: "left",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<any, any, any>) => {
        return (
          <>
            {params?.row?.ACCOUNT_TYPE_CODE === "0"
              ? "ฝั่งบริษัท"
              : "ฝั่งเจ้าหน้าที่"}
          </>
        );
      },
    },
    { field: "MENU_CODE", 
      headerName: "รหัสโปรแกรม", 
      width: 150,
      align: "left",
      headerAlign: "center", 
    },
    { field: "MENU_NAME", 
      headerName: "ชื่อโปรแกรม", 
      width: 300,
      align: "left",
      headerAlign: "center", 
    },
    { field: "FUNCTION_NAME", 
      headerName: "ฟังก์ชัน", 
      width: 100,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "QTY",
      headerName: "จำนวน activity ที่สำคัญ",
      width: 150,
      align: "right",
      headerAlign: "center",
    },
  ];

  return (
    <Container fluid>
      <Row>
        <Col>
          <NavMenu />
          <h5 style={{ marginTop: "7rem" }}>
            <FaBars size={30} style={{ margin: "auto" }} />
            &nbsp;&nbsp;LSS-IR-A10 รายงานสรุป Activity ของผู้ดูแลระบบ
            แยกเป็นรายฟังก์ชันและ Activity ที่สำคัญ (เพิ่ม/บันทึก/แก้ไข/ลบ)
          </h5>
          <Card>
            <Card.Header>
              LSS-IR-A10 รายงานสรุป Activity ของผู้ดูแลระบบ
              แยกเป็นรายฟังก์ชันและ Activity ที่สำคัญ (เพิ่ม/บันทึก/แก้ไข/ลบ)
            </Card.Header>
            <Card.Body>
              <Row style={{ marginBottom: 10, marginTop: 20 }}>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  ช่วงวันที่
                </Col>
                <Col sm={6} lg={1}>
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
                <Col sm={6} lg={1}>
                  <DatePicker
                    allowClear={true}
                    format={customDateFormat}
                    className="form-control"
                    value={to ?? null}
                    onChange={handleToChanged}
                    style={styles.datpicker}
                  />
                </Col>
                <Col
                  sm={6}
                  lg={2}
                  style={{ textAlign: "right" }}
                  value={selectedSubMenuCode}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setSelectedSubMenuCode(e.target.value)
                  }
                >
                  รหัสระบบงานย่อย
                </Col>
                <Col sm={6} lg={2}>
                  <select className="form-select">
                    <option value=""></option>
                    {sumMenus.map((f, i) => (
                      <option key={i} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col sm={6} lg={2} style={{ textAlign: "right" }}>
                  ฟังก์ชัน
                </Col>
                <Col sm={6} lg={2}>
                  <select
                    className="form-select"
                    value={selectedFunctionCode}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSelectedFunctionCode(e.target.value)
                    }
                  >
                    <option value=""></option>
                    {loadData?.FUNCTIONS.map((f, i) => (
                      <option key={i} value={f.CODE}>
                        {f.NAME}
                      </option>
                    ))}
                  </select>
                </Col>
              </Row>
              <Row style={{ marginBottom: 10, marginTop: 20 }}>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  ชื่อบัญชีผู้ใช้งาน
                </Col>
                <Col sm={6} lg={2}>
                  <select
                    className="form-select"
                    value={selectedAccountCode}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSelectedAccountCode(e.target.value)
                    }
                  >
                    <option value=""></option>
                    {loadData?.ACCOUNTS.map((a, i) => (
                      <option key={i} value={a.CODE}>
                        {a.LOGIN_NAME}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  รหัสโปรแกรม
                </Col>
                <Col sm={6} lg={2}>
                  <select
                    className="form-select"
                    value={selectedMenuCode}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSelectedMenuCode(e.target.value)
                    }
                  >
                    <option value=""></option>
                    {loadData?.MENUS.map((m, i) => (
                      <option key={i} value={m.CODE}>
                        {m.CODE}
                      </option>
                    ))}
                  </select>
                </Col>
              </Row>
              <Row style={{ marginBottom: 10, marginTop: 20 }}>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  ชื่อสังกัด
                </Col>
                <Col sm={6} lg={2}>
                  <select
                    className="form-select"
                    value={selectedSectionCode}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSelectedSectionCode(e.target.value)
                    }
                  >
                    <option value=""></option>
                    {loadData?.SECTIONS.map((s, i) => (
                      <option key={i} value={s.CODE}>
                        {s.DESCRIPTION}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  ชื่อโปรแกรม
                </Col>
                <Col sm={6} lg={2}>
                  <select
                    className="form-select"
                    name="COMPANY"
                    value={selectedMenuCode}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSelectedMenuCode(e.target.value)
                    }
                  >
                    <option value=""></option>
                    {loadData?.MENUS.map((m, i) => (
                      <option key={i} value={m.CODE}>
                        {m.NAME}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col sm={6} lg={2} style={{ textAlign: "right" }}></Col>
                <Col sm={6} lg={1}></Col>
                <Col
                  md={2}
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
