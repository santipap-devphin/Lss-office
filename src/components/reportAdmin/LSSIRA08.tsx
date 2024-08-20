import React, { ChangeEvent } from "react";
import { useState, useEffect, useCallback } from "react";
import { Col, Row, Card, Container, Form } from "react-bootstrap";

import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { donwloadFile, downloadFilePost, getLSSIRA08, getLSSIRA08OnLoad } from "../../data";
import NavMenu from "../fragments/NavMenu";
import "./LssEt030CompareCrr.scss";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import { FaBars } from "react-icons/fa";
import { DatePicker, DatePickerProps, TimePicker } from "antd";
import { Moment } from "moment";
import { LSS_V_LSSIRA08 } from "../../models/office/LSS_V_LSSIRA08.model";
import { LSS_T_TRANSACTION } from "../../models/office/LSS_T_TRANSACTION.model";
import { parseISO } from "date-fns/esm";
import { Downloading } from "@mui/icons-material";
import { toThaiDateString } from "../../functions/Date";

const styles = {
  datpicker: {
    width: "100%",
    height: "100%",
    verticalAlign: "middle",
  },
};

export default function LSSIRA08() {
  const format = "HH:mm";

  const [gridData, setGridData] = useState<LSS_V_LSSIRA08[]>([]);
  const [transactions, setTransactions] = useState<LSS_T_TRANSACTION[]>([]);

  const [from, setFrom] = useState<Moment | null>(null);
  const [to, setTo] = useState<Moment | null>(null);

  const [selectedTransactionCode, setSelectedTransactionCode] =
    useState<string>("");

  const [description, setDescription] = useState<string>("");

  const [fromTime, setFromTime] = useState<Moment | null>(null);
  const [toTime, setToTime] = useState<Moment | null>(null);

  const customDateFormat: DatePickerProps["format"] = (date: Moment) => {
    return toThaiDateString(date.toDate(), "DD/MM/YYYY");
  };

  const handleFromChanged = useCallback((date: Moment | null) => {
    setFrom(date);
  }, []);

  const handleToChanged = useCallback((date: Moment | null) => {
    setTo(date);
  }, []);

  const handleFromTimeChanged = useCallback((date: Moment | null) => {
    setFromTime(date);
  }, []);

  const handleToTimeChanged = useCallback((date: Moment | null) => {
    setToTime(date);
  }, []);

  const handleOnLoad = () => {
    return new Promise((resolve) => {
      getLSSIRA08OnLoad().then((data) => setTransactions(data));
      getLSSIRA08(null).then((data) => setGridData(data));
      resolve(true);
    });
  };

  const handleSearch = () => {
    let record = {} as Record<string, any>;

    if (from && to && from.diff(to) <= 0) {
      record["FROM"] = from.toDate().toISOString();
      record["TO"] = to.toDate().toISOString();
    }

    if (fromTime && toTime && fromTime.diff(toTime) <= 0) {
      record["FROM_TIME"] = fromTime.toDate().toISOString();
      record["TO_TIME"] = toTime.toDate().toISOString();
    }

    if (selectedTransactionCode.length > 0)
      record["TRANSACTION_CODE"] = selectedTransactionCode;

    if (description.length > 0) record["DESCRIPTION"] = description;

    getLSSIRA08(record).then((data) => setGridData(data));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ลำดับ", align: "center", headerAlign: "center", },
    {
      field: "TRANS_DATE",
      headerName: "วันที่",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return toThaiDateString(parseISO(params.value), "DD/MM/YYYY");
      },
    },
    {
      field: "Time",
      headerName: "เวลา",
      flex: 1,
      align: "left",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<any, LSS_V_LSSIRA08, any>) => {
        return parseISO(params.row.TRANS_DATE.toString()).toLocaleTimeString(
          "th-TH",
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }
        );
      },
    },
    { field: "MENU_CODE", 
      headerName: "รหัส Function", 
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    { field: "TRANSACTION_NAME", 
      headerName: "ประเภท Transaction", 
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    { field: "DESCRIPTION", 
    headerName: "รายละเอียด", 
    flex: 2,
    align: "left",
    headerAlign: "center",
    renderCell: (params: any) => {
      console.log(params.row);
      return (
        <>
            <p title={params.row.DESCRIPTION}>{params.row.DESCRIPTION}</p>
        </>
      );
    },
  },
    {
      field: "QTY",
      flex: 1,
      align: "right",
      headerAlign: "center",
      headerName: "จำนวน  Transaction",
    },
  ];


  const handleDownloadExcel = () => {
    let record = {} as Record<string, any>;

    if (from && to && from.diff(to) <= 0) {
      record["FROM"] = from.toDate().toISOString();
      record["TO"] = to.toDate().toISOString();
    }

    if (fromTime && toTime && fromTime.diff(toTime) <= 0) {
      record["FROM_TIME"] = fromTime.toDate().toISOString();
      record["TO_TIME"] = toTime.toDate().toISOString();
    }

    if (selectedTransactionCode.length > 0)
      record["TRANSACTION_CODE"] = selectedTransactionCode;

    if (description.length > 0) record["DESCRIPTION"] = description;
    downloadFilePost(
      `/LssIRA08/LSSIRA08Excel`,
      "LSS-IR-A08 รายงานสรุปจำนวน_Transaction_ที่สำคัญ_ในแต่ละช่วงเวลา.xlsx",
      record
    );
  };

  useEffect(() => {
    handleOnLoad();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col>
          <NavMenu />
          <h5 style={{ marginTop: "7rem" }}>
            <FaBars size={30} style={{ margin: "auto" }} />
            &nbsp;&nbsp;LSS-IR-A08 รายงานสรุปจำนวน Transaction ที่สำคัญ
            ในแต่ละช่วงเวลา แยกตามรายชั่วโมง/รายวัน
          </h5>
          <Card>
            <Card.Header>
              LSS-IR-A08 รายงานสรุปจำนวน Transaction ที่สำคัญ ในแต่ละช่วงเวลา
              แยกตามรายชั่วโมง/รายวัน
            </Card.Header>
            <Card.Body>
              <Row style={{ marginBottom: 10, marginTop: 20 }}>
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
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  ประเภท
                </Col>
                <Col sm={6} lg={2}>
                  <select
                    className="form-select"
                    value={selectedTransactionCode}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      setSelectedTransactionCode(() => e.target.value);
                    }}
                  >
                    <option value="">ทั้งหมด</option>
                    {transactions.map((t, i) => (
                      <option key={i} value={t.CODE}>
                        {t.NAME}
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
              <Row style={{ marginBottom: 10, marginTop: 20 }}>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  ช่วงเวลา
                </Col>
                <Col sm={6} lg={2}>
                  <TimePicker
                    onChange={handleFromTimeChanged}
                    className="form-control"
                    allowClear={true}
                    value={fromTime}
                    format={format}
                  />
                </Col>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  ถึงเวลา
                </Col>
                <Col sm={6} lg={2}>
                  <TimePicker
                    onChange={handleToTimeChanged}
                    allowClear={true}
                    className="form-control"
                    value={toTime}
                    format={format}
                  />
                </Col>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  รายละเอียด
                </Col>
                <Col sm={6} lg={4}>
                  <Form.Control
                    type="text"
                    value={description}
                    onInput={(e: ChangeEvent<HTMLInputElement>) =>
                      setDescription(e.target.value)
                    }
                  />
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
