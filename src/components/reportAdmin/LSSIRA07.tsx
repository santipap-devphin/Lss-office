import React, { ChangeEvent, useCallback } from "react";
import { useState, useEffect } from "react";
import { Col, Row, Card, Container, Form } from "react-bootstrap";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { donwloadFile, downloadFilePost, getLSSIRA07, getLSSIRA07OnLoad } from "../../data";
//import moment from "moment";
import NavMenu from "../fragments/NavMenu";
import "./LssEt030CompareCrr.scss";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import { FaBars } from "react-icons/fa";
import { DatePicker, DatePickerProps } from "antd";
import { Moment } from "moment";
import { LSS_V_LSSIRA07 } from "../../models/office/LSS_V_LSSIRA07.model";
import QuaterSearchPanel from "./shared/QuaterSearchPanel";
import { format, parseISO } from "date-fns";
import { LSS_T_ERROR_GROUP } from "../../models/office/LSS_T_ERROR_GROUP.model";
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

export default function LSSIRA07() {
  const [gridData, setGridData] = useState<LSS_V_LSSIRA07[]>([]);
  const [errorGroup, setErrorGroup] = useState<LSS_T_ERROR_GROUP[]>([]);

  const [from, setFrom] = useState<Moment | null>(null);
  const [to, setTo] = useState<Moment | null>(null);
  const [year, setYear] = useState<number>(0);
  const [quarter, setQuarter] = useState<number>(0);
  const [month, setMonth] = useState<number>(0);
  const [selectedErrorCode, setSelectedErrorCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleOnLoad = useCallback(() => {
    return new Promise((resolve) => {
      getLSSIRA07OnLoad().then((data) => setErrorGroup(() => data));
      getLSSIRA07(null).then((data) => setGridData(data));
      resolve(true);
    });
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ลำดับที่", minWidth: 10, align: "center", headerAlign: "center", },
    {
      field: "LOG_DATE",
      headerName: "ปี",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return parseISO(params.value.toString()).getFullYear() + 543;
      },
    },
    {
      field: "QUARTER",
      headerName: "ไตรมาส",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "MONTH",
      headerName: "เดือน",
      renderCell: (params: GridRenderCellParams<any, LSS_V_LSSIRA07, any>) => {
        return format(parseISO(params?.row?.LOG_DATE.toString()), "LLLL", {
          locale: th,
        });
      },
      flex: 1,
      align: "left",
      headerAlign: "center"
    },
    {
      field: "ERRORGROUP_NAME",
      headerName: "ประเภทข้อผิดพลาด",
      flex: 1,
      align: "left",
      headerAlign: "center"
    },
    {
      field: "DESCRIPTION",
      headerName: "รายละเอียด / เหตุการณ์ / กิจกรรม",
      flex: 3,
      align: "left",
      headerAlign: "center",
      renderCell: (params) => {
          return (
            <>
              <p title={params.row.DESCRIPTION}>{params.row.DESCRIPTION}</p>
            </>
          )
      },
    },
    {
      field: "QTY",
      headerName: "จำนวนข้อผิดพลาด",
      flex: 1,
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

    if (year > 0) record["YEAR"] = year;
    if (quarter > 0) record["QUARTER"] = quarter;
    if (month > 0) record["MONTH"] = month;
    if (description.length > 0) record["DESCRIPTION"] = description;
    if (selectedErrorCode !== "") record["ERRORGROUP_CODE"] = selectedErrorCode;

    getLSSIRA07(record).then((data) => {
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
    setYear(y);
    setQuarter(q);
    setMonth(m);
  }, []);

  const handleDownloadExcel = () => {
    let record = {} as Record<string, any>;

    if (from && to && from.diff(to) <= 0) {
      record["FROM"] = from.toDate().toISOString();
      record["TO"] = to.toDate().toISOString();
    }

    if (year > 0) record["YEAR"] = year;
    if (quarter > 0) record["QUARTER"] = quarter;
    if (month > 0) record["MONTH"] = month;
    if (description.length > 0) record["DESCRIPTION"] = description;
    if (selectedErrorCode !== "") record["ERRORGROUP_CODE"] = selectedErrorCode;
    downloadFilePost(
      `/LssIRA07/LSSIRA07Excel`,
      "LSS-IR-A07_รายงานสรุปจำนวนข้อผิดพลาด_แยกตามประเภทข้อผิดพลาด.xlsx",
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
            LSS-IR-A07 รายงานสรุปจำนวนข้อผิดพลาด แยกตามประเภทข้อผิดพลาด
            แยกตามรายเดือน/ไตรมาส/ปี
          </h5>
          <Card>
            <Card.Header>
              LSS-IR-A07 รายงานสรุปจำนวนข้อผิดพลาด แยกตามประเภทข้อผิดพลาด
              แยกตามรายเดือน/ไตรมาส/ปี
            </Card.Header>
            <Card.Body>
              <Row style={{ marginBottom: 10, marginTop: 20 }}>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  ตั้งแต่วันที่
                </Col>
                <Col sm={6} lg={1}>
                  {/* <Form.Control type="text" name="COMPANY_LICENSE" /> */}
                  <DatePicker
                    allowClear={true}
                    format={customDateFormat}
                    value={from}
                    onChange={handleFromChanged}
                    className="form-control"
                    style={styles.datpicker}
                  />
                </Col>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  ถึงวันที่
                </Col>
                <Col sm={6} lg={1}>
                  {/* <Form.Control type="text" name="COMPANY_LICENSE" /> */}
                  <DatePicker
                    allowClear={true}
                    format={customDateFormat}
                    value={to}
                    onChange={handleToChanged}
                    className="form-control"
                    style={styles.datpicker}
                  />
                </Col>
                <QuaterSearchPanel onChanged={handleSearchChanged} />
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
                    onClick={() => handleSearch()}
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
              <Row style={{ marginBottom: 10, marginTop: 20 }}>
                <Col sm={6} lg={2} style={{ textAlign: "right" }}>
                  รายละเอียด / เหตุการณ์ / กิจกรรม
                </Col>
                <Col sm={6} lg={2}>
                  <Form.Control
                    type="text"
                    value={description}
                    onInput={(e: ChangeEvent<HTMLInputElement>) =>
                      setDescription(e.target.value)
                    }
                  />
                </Col>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  ประเภทข้อผิดพลาด
                </Col>
                <Col sm={6} lg={2}>
                  <select
                    className="form-select"
                    value={selectedErrorCode}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSelectedErrorCode(e.target.value)
                    }
                  >
                    <option value=""></option>
                    {errorGroup.map((er, i) => (
                      <option key={i} value={er.EGP_CODE}>
                        {er.EGP_NAME}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}></Col>
                <Col sm={6} lg={1}></Col>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}></Col>
                <Col sm={6} lg={2}></Col>
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
