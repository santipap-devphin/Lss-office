import React from "react";
import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import Downloading from "@mui/icons-material/Downloading";
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { LssIQ010List, LssIQ010ListWhere, getCommon, downloadFilePost, Getdatayear } from "../../data";
import NavMenu from "../fragments/NavMenu";
import payin from "../../assets/images/payin.png";
import payment_order from "../../assets/images/payment_order.png";
import printcer from "../../assets/images/printcer.png";
import { FaBars } from "react-icons/fa";
import Search from "@mui/icons-material/Search";
import { Col, Row, Container, Card } from "react-bootstrap";
import Button from "@mui/material/Button";
import { DataResponse } from "../../models/common/data-response.model";
import { PrefixSelect } from "../../models/common/prefix-select.model";
import { CompanySelect } from "../../models/common/company-select.model";
import { parse } from "date-fns";
import { PdfViewer } from "../fragments/PdfViewer";
import { apiUrlBase } from "../../configs/urls";
import _ from "lodash";
import ExportExcel from "../report/shared/ExportExcel";

export default function DeliveryList() {
  const [sType, setSType] = useState<string[]>(["0"]);
  const [company, setCompany] = useState<string[]>(["0"]);
  const [sQuarter, setSQuarter] = useState<string[]>(["1"]);
  const [sYear, setSYear] = useState<string[]>(["0"]);
  const [, setRows] = React.useState([]);

  const [showReceive, setShowReceive] = useState<boolean>(false);
  const [showSlip, setShowSlip] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showPayin, setShowPayin] = useState<boolean>(false);
  const [payKey, setPayKey] = useState("");
  const [seleteYear, setSeleteYear] = useState<number[]>([0]);
  const [common, setCommon] = useState<DataResponse>({
    COMPANIES: [],
    PREFIXES: [],
  });
  // const _companyOptions = common.COMPANIES.filter(x => x.COMPANY_TYPE_CODE === sType[0]);
  const PrintPayinfile = React.useCallback(
    (id: any, idall: any) => () => {
      setTimeout(() => {
        setRows((prevRows) =>
          prevRows.filter((row: any) => row?.DOCUMENT_HEAD_CODE !== id)
        );
        Swal.fire(
          "Alert",
          idall.DOCUMENT_HEAD_CODE,
          idall.DOCUMENT_HEAD_CODE
        ).then(() => {
          //navigate("/RegisterCer");
        });
      });
    },
    []
  );

  const columns: GridColDef[] = [
    { field: "QUARTER", headerName: "ไตรมาส/ปี", minWidth: 70, align: "left", headerAlign: "center" },
    {
      field: "DATE",
      headerName: "วันที่นำส่ง เงินสมทบ",
      align: "center",
      headerAlign: "center",
      minWidth: 180,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        if (params.value != null) {
          var parts = params.value.split("-");
          var parts2 = parts[2].split("T");
          var calyear = Number.parseInt(parts[0]) + 543;
          var mydate = new Date(parts2[0], parts[1], calyear);
          var Sumdate = parts2[0] + "/" + parts[1] + "/" + calyear;
          return Sumdate;
        }
      },
    },
    {
      field: "DOCUMENT_HEAD_CODE",
      headerName: "เลขที่นำส่งเงินสมทบ",
      minWidth: 200,
      align: "left",
      headerAlign: "center",
    },
    { field: "COMPANY_NAME", headerName: "บริษัท", minWidth: 400, align: "left", headerAlign: "center", },
    { field: "DOCTYPE_NAME", headerName: "ประเภท", minWidth: 125, align: "center", headerAlign: "center" },
    {
      field: "DUE_DATE",
      headerName: "วันที่ครบ กำหนดชำระเงิน",
      align: "center",
      headerAlign: "center",
      minWidth: 180,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        if (params.value != null) {
          var parts = params.value.split("-");
          var parts2 = parts[2].split("T");
          var calyear = Number.parseInt(parts[0]) + 543;
          var mydate = new Date(parts2[0], parts[1], calyear);
          var Sumdate = parts2[0] + "/" + parts[1] + "/" + calyear;
          return Sumdate;
        }
      },
    },
    {
      field: "AMOUNT",
      headerName: "จำนวนเงิน นำส่งเงินสมทบ",
      minWidth: 150,
      align: "right",
      headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "TOTAL_FINE_RATE",
      headerName: "เงินเพิ่ม ตามกฎหมาย",
      minWidth: 150,
      align: "right",
      headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    //{ field: "PAYMENT_STATUS", headerName: "การชำระเงิน", minWidth: 150, align: "center", headerAlign: "center" },
    { field: "STATUS_NAME", headerName: "สถานะ", minWidth: 125, align: "center", headerAlign: "center" },
    {
      field: "col11",
      headerName: "พิมพ์ใบแจ้งหนี้",
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      renderCell: (params1: any) => {
        if (params1?.row?.STATE_CODE === "BLANK" || params1?.row?.STATE_CODE === "DRAFT" || params1?.row?.STATE_CODE === "CANCELED" || params1?.row?.RECEIPT_PATHFILE === "IMPORT" || params1?.row?.TOTAL_FINE_RATE === 0 && params1?.row?.TOTAL_PAY === 0) {
          return (
            <>
              <a href="#FnDraff">
                <img
                  className="align-self-center"
                  src={payin}
                  alt="พิมพ์ใบแจ้งหนี้"
                  style={{ width: "30px", height: "30px", opacity: "0.1" }}
                // onClick={oPenfile(params1, "payin")}
                />{" "}
              </a>
            </>
          );
        } else {
          return (
            <>
              <a href="#FnDraff">
                <img
                  className="align-self-center"
                  src={payin}
                  alt="พิมพ์ใบแจ้งหนี้"
                  style={{ width: "30px", height: "30px" }}
                  onClick={oPenfile(params1, "payin")}
                />{" "}
              </a>
            </>
          );
        }
      },
    },
    {
      field: "col12",
      headerName: "พิมพ์ฟอร์มส่ง",
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      renderCell: (params2: any) => {
        if (params2?.row?.STATE_CODE != "DRAFT" && params2?.row?.STATE_CODE != "BLANK" && params2?.row?.RECEIPT_PATHFILE != "IMPORT") {
          return (
            <>
              <a href="#FnDraff">
                <img
                  className="align-self-center"
                  src={payment_order}
                  alt="พิมพ์ฟอร์มส่ง"
                  style={{ width: "30px", height: "30px" }}
                  onClick={oPenfile(params2, "form")}
                />
              </a>
            </>
          );
        } else {
          return (
            <>
              <a href="#FnDraff">
                <img
                  className="align-self-center"
                  src={payment_order}
                  alt="พิมพ์ฟอร์มส่ง"
                  style={{ width: "30px", height: "30px", opacity: "0.1" }}
                />
              </a>
            </>
          );
        }
      },
    },
    {
      field: "col13",
      headerName: "พิมพ์ใบเสร็จ",
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      renderCell: (params3: GridRenderCellParams<any, any, any>) => {
        if (params3?.row?.RECEIPT_PATHFILE === null || params3?.row?.RECEIPT_PATHFILE === ""
          || params3?.row?.RECEIPT_PATHFILE === "0" || params3?.row?.RECEIPT_PATHFILE === "IMPORT") {
          return (
            <>
              <a href="#OpenFile">
                <img
                  className="align-self-center"
                  src={printcer}
                  alt="พิมพ์ใบเสร็จ"
                  style={{ width: "30px", height: "30px", opacity: "0.1" }}
                // onClick={oPenfile(params3, "invoice")}
                />
              </a>
            </>
          );
        } else {
          return (
            <>
              <a href="#OpenFile">
                <img
                  className="align-self-center"
                  src={printcer}
                  alt="พิมพ์ใบเสร็จ"
                  style={{ width: "30px", height: "30px", }}
                  onClick={() => {
                    window.open(params3?.row?.RECEIPT_PATHFILE);
                  }}
                />
              </a>
            </>
          );
        }
      },
    },
  ];

  const [tableData, setTableData] = useState<
    {
      id: any;
      QUARTER: any;
      DATE: any;
      DOCUMENT_HEAD_CODE: any;
      COMPANY_NAME: any;
      DOCTYPE_NAME: any;
      DUE_DATE: any;
      AMOUNT: any;
      TOTAL_FINE_RATE: any;
      PAYMENT_CODE: any;
      PAYMENT_STATUS: any;
      STATUS_NAME: any;
      STATE_CODE: any;
      PAYINCODE: any;
      RECEIPT_PATHFILE: any;
    }[]
  >([]);

  const handleOnLoad = () => {
    return new Promise((resolve, reject) => {
      getCommon().then((data: DataResponse) => {
        setCommon({
          COMPANIES: [...data.COMPANIES] as CompanySelect[],
          PREFIXES: [...data.PREFIXES] as PrefixSelect[],
        });
      });
    });
  };

  const fnPost = useCallback(
    async (
      COMPANY_TYPE: string,
      COMPANY_CODE: string,
      YEAR: string,
      QUARTER: string
    ) => {
      // COMPANY_TYPE = COMPANY_TYPE == "0" ? "" : COMPANY_TYPE;
      // COMPANY_CODE = COMPANY_CODE == "0" ? "" : COMPANY_CODE;
      // YEAR = YEAR == "0" ? "" : YEAR;
      // QUARTER = QUARTER == "0" ? "" : QUARTER;
      Getdatayear().then((data: any) => {
        setSeleteYear(data);
      });
      var para = JSON.parse(
        `{"COMPANY_TYPE_CODE":"${COMPANY_TYPE}","COMPANY_CODE":"${COMPANY_CODE}", "YEAR":"${YEAR}",  "QUARTER":"${QUARTER}"  }`
      );

      LssIQ010ListWhere(para).then((data: any) => {
        let tmpSchema = [];
        for (let i = 0; i < data.length; i++) {
          tmpSchema.push({
            id: i + 1,
            QUARTER: data[i].QUARTER + "/" + data[i].YEAR,
            DATE: data[i].DATE,
            DOCUMENT_HEAD_CODE: data[i].DOCUMENT_HEAD_CODE,
            COMPANY_NAME: data[i].COMPANY_NAME,
            DOCTYPE_NAME: data[i].DOCTYPE_NAME,
            DUE_DATE: data[i].DUE_DATE,
            AMOUNT: data[i].AMOUNT,
            TOTAL_FINE_RATE: data[i].TOTAL_FINE_RATE,
            PAYMENT_CODE: data[i].PAYMENT_CODE,
            PAYMENT_STATUS: data[i].PAYMENT_STATUS,
            STATUS_NAME: data[i].STATUS_NAME,
            STATE_CODE: data[i].STATE_CODE,
            PAYINCODE: data[i].PAYINCODE,
            RECEIPT_PATHFILE: data[i].RECEIPT_PATHFILE,
            YEAR: data[i].YEAR
          });
        } //loop i
        setTableData(tmpSchema);
      }); //getPayinList
    },
    []
  );

  const fnLoad = useCallback(async () => {
    LssIQ010List().then((data: any) => {
      let tmpSchema = [];
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: i + 1,
          QUARTER: data[i].QUARTER + "/" + data[i].YEAR,
          DATE: data[i].DATE,
          DOCUMENT_HEAD_CODE: data[i].DOCUMENT_HEAD_CODE,
          COMPANY_NAME: data[i].COMPANY_NAME,
          DOCTYPE_NAME: data[i].DOCTYPE_NAME,
          DUE_DATE: data[i].DUE_DATE,
          AMOUNT: data[i].AMOUNT,
          TOTAL_FINE_RATE: data[i].TOTAL_FINE_RATE,
          PAYMENT_CODE: data[i].PAYMENT_CODE,
          PAYMENT_STATUS: data[i].PAYMENT_STATUS,
          STATUS_NAME: data[i].STATUS_NAME,
          STATE_CODE: data[i].STATE_CODE,
          PAYINCODE: data[i].PAYINCODE,
          RECEIPT_PATHFILE: data[i].RECEIPT_PATHFILE
        });
      } //loop i
    }); //getPayinList
  }, []);

  function PostSearch() {
    setTableData([]);
    fnPost(sType[0], company[0], sYear[0], sQuarter[0]);
  }

  useEffect(() => {
    handleOnLoad();
    fnPost(sType[0], company[0], sYear[0], sQuarter[0]);
  }, []);

  const oPenfile = useCallback(
    (id: any, type: any) => () => {
      let msg = "";
      if (type === "payin") {
        msg = "เปิดไฟล์ใบแจ้งหนี้ (Pay in)";

        setPayKey(id.row.PAYINCODE);
        setShowPayin(true);
      }
      if (type === "form") {
        msg = "เปิดไฟล์ฟอร์มการนำส่งเงินสมทบ";

        setPayKey(id.row.DOCUMENT_HEAD_CODE);
        setShowForm(true);
      }
      if (type === "invoice") {
        msg = "เปิดไฟล์ใบเสร็จรับเงิน";

        setPayKey(id.row.DOCUMENT_HEAD_CODE);
        setShowReceive(true);
      }
      //Swal.fire(msg, "ID : " + id.id, "warning");
    },
    []
  );

  // const handleDownloadExcel = () => {
  //   let record = {} as Record<string, any>;
  //   if(sType[0] != "0")
  //     record["COMPANY_TYPE_CODE"] = sType[0];
  //   if(company[0] != "0")
  //     record["COMPANY_CODE"] = company[0];

  //   record["YEAR"] = sYear[0];
  //   record["QUARTER"] = sQuarter[0];

  //   downloadFilePost(
  //     `/LSSIQ010/LSSIQ010Excel`,
  //     "LSS-IQ-010_รายการนำส่งเงินสมทบ.xlsx",
  //     record
  //   );
  // };
  
  const header = [
    { header: 'ไตรมาส/ปี', key: 'QUARTER', width: 10, style: {alignment: { horizontal: 'left'},numFmt:'Text'} },
    { header: 'วันที่นำส่ง เงินสมทบ', key: 'DATE', width: 20, style: {alignment: { horizontal: 'center'},numFmt:'Date'}},
    { header: 'เลขที่นำส่งเงินสมทบ', key: 'DOCUMENT_HEAD_CODE', width: 20, style: {alignment: { horizontal: 'left'},numFmt:'Text'} },
    { header: 'บริษัท', key: 'COMPANY_NAME', width: 50, style: {alignment: { horizontal: 'left'},numFmt:'Text'} },
    { header: 'ประเภท', key: 'DOCTYPE_NAME', width: 10, style: {alignment: { horizontal: 'center'},numFmt:'Text'} },
    { header: 'วันที่ครบ กำหนดชำระเงิน', key: 'DUE_DATE', width: 20, style: {alignment: { horizontal: 'center'},numFmt:'Date'} },
    { header: 'จำนวนเงิน นำส่งเงินสมทบ', key: 'AMOUNT', width: 20, style: {alignment: { horizontal: 'right'},numFmt:'#,##0.00'} },
    { header: 'เงินเพิ่ม ตามกฎหมาย', key: 'TOTAL_FINE_RATE', width: 20, style: {alignment: { horizontal: 'right'},numFmt:'#,##0.00'} },
    { header: 'สถานะ', key: 'STATUS_NAME', width: 20, style: {alignment: { horizontal: 'center'},numFmt:'Text'} },
  ];

  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <NavMenu />
            <Card style={{ marginTop: "9rem" }}>
              <Card.Header>Title : LSS-IQ-010 รายการนำส่งเงินสมทบ</Card.Header>
              <Card.Body>
                <div>
                  <Row style={{ marginBottom: 10, marginTop: 20 }}>
                    <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                      ประเภท
                    </Col>
                    <Col sm={6} lg={2}>
                      <select
                        className="form-select"
                        name="COMPANY_TYPE_CODE"
                        id="COMPANY_TYPE_CODE"
                        onChange={(e) => {
                          setSType([e.target.value]);
                          setCompany(["0"]);
                          setSYear(["0"]);
                          setSQuarter(["0"])
                        }}
                        value={sType[0]}
                      >
                        <option value="0">ทั้งหมด</option>
                        <option value="LIFE">บริษัทประกันชีวิต</option>
                        <option value="NONLIFE">บริษัทประกันวินาศภัย</option>
                      </select>
                    </Col>
                    <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                      บริษัท
                    </Col>
                    <Col sm={6} lg={2}>
                      <select
                        className="form-select"
                        name="COMPANY"
                        onChange={(e) => {
                          setCompany([e.target.value]);
                        }}
                        value={company[0]}
                      >
                        <option value="0">ทั้งหมด</option>
                        {common.COMPANIES.filter(x => x.COMPANY_TYPE_CODE === sType[0] || !sType[0] || sType[0] === "0").map((c) => (
                          <option key={c.CODE} value={c.CODE}>
                            {c.NAME}
                          </option>
                        ))}
                      </select>
                    </Col>
                    <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                      ปี
                    </Col>
                    <Col sm={6} lg={1}>
                      <select
                        className="form-select"
                        name="YEAR"
                        id="YEAR"
                        onChange={(e) => {
                          setSYear([e.target.value]);
                        }}
                        value={sYear}
                      >
                        <option value="0">ทั้งหมด</option>
                        {
                          seleteYear.map(el => <option value={el} key={el}> {el} </option>)
                        }
                      </select>
                    </Col>
                    <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                      ไตรมาส
                    </Col>
                    <Col sm={6} lg={1}>
                      <select
                        className="form-select"
                        name="QUARTER"
                        id="QUARTER"
                        onChange={(e) => {
                          setSQuarter([e.target.value]);
                        }}
                        value={sQuarter}
                      >
                        <option value="0">ทั้งหมด</option>
                        {/* ปรับให้ดึงจาก table Lss_t_company_quarter */}
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
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
                        onClick={() => PostSearch()}
                      >
                        {" "}
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
                      <ExportExcel
                        data={tableData}
                        headers={header}
                        fileNames={"LSS-IQ-010_รายการนำส่งเงินสมทบ.xlsx"}
                      ></ExportExcel>
                      {/* <Button
                        style={{ marginRight: 5 }}
                        variant="contained"
                        startIcon={<Downloading />}
                        onClick={handleDownloadExcel}
                      >
                        {" "}
                        Excel
                      </Button> */}
                    </Col>
                  </Row>
                </div>
                <div style={{ height: 500, width: "100%" }}>
                  <DataGrid
                    sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                    rows={tableData}
                    columns={columns}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <PdfViewer
          show={showForm}
          title={"Form"}
          url={`${apiUrlBase}/data/getOIC-form-pdf?code=${payKey}`}
          onClose={() => setShowForm(false)}
        />
        <PdfViewer
          show={showReceive}
          title={"Slip"}
          url={`${apiUrlBase}/data/getOIC-receive-pdf?code=${payKey}`}
          onClose={() => setShowReceive(false)}
        />
        <PdfViewer
          show={showPayin}
          url={`${apiUrlBase}/data/getOIC-payin-pdf?code=${payKey}`}
          title={"Bill Payment"}
          onClose={() => setShowPayin(false)}
        />
      </Container>
    </>
  );
}
