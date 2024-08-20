import { useState, useEffect, useCallback } from "react";
import { Card, Container, Row, Col } from 'react-bootstrap';
import { DataGrid, GridColDef, GridValueFormatterParams } from "@mui/x-data-grid";
import { getPayinListAllSearch, fnPin, getCommon, downloadFilePost, Getdatayear } from "../../data";
import moment from "moment";
import NavMenu from "../fragments/NavMenu";
import "./PayList.scss";
import attIcon from "../../assets/images/attachment.png";
import payinIcon from "../../assets/images/payin.png";
import formIcon from "../../assets/images/payment_order.png";
import invoiceIcon from "../../assets/images/printcer.png";
import payment from "../../assets/images/icon-payment.png";
import Swal from "sweetalert2";
import { PdfViewer } from "../fragments/PdfViewer";
import { apiUrlBase } from "../../configs/urls";
import { DataResponse } from "../../models/common/data-response.model";
import { PrefixSelect } from "../../models/common/prefix-select.model";
import { CompanySelect } from "../../models/common/company-select.model";
import Search from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Downloading from "@mui/icons-material/Downloading";
import ExportExcel from "../report/shared/ExportExcel";

export default function PayList() {

  const [showReceive, setShowReceive] = useState<boolean>(false);
  const [showSlip, setShowSlip] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showPayin, setShowPayin] = useState<boolean>(false);
  const [payKey, setPayKey] = useState("");
  const [ref1, setRef1] = useState("");
  const [ref2, setRef2] = useState("");
  const [documentHead, setDocumentHead] = useState("");
  const [attFile, setAttFile] = useState("");
  const [codeAttFile, setCodeAttFile] = useState("");
  const [, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [code, setCode] = useState("");
  const [company, setCompany] = useState<string>("0");
  const [sQuarter, setSQuarter] = useState<string>("1");
  const [sYear, setSYear] = useState<string>("0");
  const [sNQuarter, setSNQuarte] = useState("ทุกไตรมาส");
  const [sDOC_TYPE, setDOC_TYPE] = useState("0");
  const [seleteYear, setSeleteYear] = useState<any[]>([0]);

  const [common, setCommon] = useState<DataResponse>({
    COMPANIES: [],
    PREFIXES: [],
  });

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

  const columns: GridColDef[] = /*React.useMemo(() =>*/[
    {
      field: "NUM",
      headerName: "ลำดับ",
      minWidth: 40,
      align: "center",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "CY_NAME",
      headerName: "บริษัท",
      minWidth: 200,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    { field: "QUARTER", headerName: "ไตรมาส/ปี", minWidth: 70, align: "center", headerAlign: "center" },
    { field: "NAME_TYPE", headerName: "ประเภทการยื่น", minWidth: 70, align: "left", headerAlign: "center" },
    {
      field: "col1",
      headerName: "เลขที่ใบแจ้งหนี้",
      minWidth: 200,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "DOCUMENT_HEAD",
      headerName: "เลขที่อ้างอิง",
      minWidth: 180,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "col2",
      headerName: "วันที่ใบแจ้งหนี้",
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "headgrid",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        if (params.value != null) {
          var parts = params.value.split("-");
          var parts2 = parts[2].split(" ");
          var calyear = Number.parseInt(parts2[0]) + 543;
          var Sumdate = parts[0] + "/" + parts[1] + "/" + calyear;
          return Sumdate;
        }
      },
    },
    {
      field: "col4",
      headerName: "เงินสมทบ",
      minWidth: 125,
      headerClassName: "headgrid",
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
      field: "col3",
      headerName: "เงินเพิ่ม",
      minWidth: 125,
      headerClassName: "headgrid",
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
      field: "col5",
      headerName: "เงินที่ชำระ",
      minWidth: 125,
      headerClassName: "headgrid",
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
      field: "col6",
      headerName: "สถานะ",
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "col7",
      headerName: "เลขที่ใบเสร็จรับเงิน",
      minWidth: 220,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "col8",
      headerName: "วันที่ใบเสร็จรับเงิน",
      minWidth: 170,
      align: "center",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "col9",
      headerName: "ไฟล์แนบชำระ",
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        if (params.row.PAYINFILE_ATTACHMENT_CODE === " ") {
          return (
            <>
              <a href="#OpenFile">
                <img
                  className="iconGrid"
                  src={payment}
                  alt="พิมพ์สลิปส์"
                  style={{ width: "30px", height: "30px", opacity: "0.1" }}
                // onClick={oPenfile(params, "slip")}
                />
              </a>
            </>
          );
        } else {
          return (
            <>
              <a href="#OpenFile">
                <img
                  className="iconGrid"
                  src={payment}
                  alt="พิมพ์สลิปส์"
                  style={{ width: "30px", height: "30px" }}
                  onClick={oPenfile(params, "slip")}
                />
              </a>
            </>
          );
        }
      },
    },
    {
      field: "col10",
      headerName: "ใบแจ้งหนี้",
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      renderCell: (params1: any) => {
        // let para = {
        //   c: params1.row.col1,
        //   d: params1.row.DOCUMENT_CODE,
        //   t: "PAYIN",
        // };
        // setPayKey(params1.row.id);
        //   AttachKey(para).then((result) => { setPayKey(result.CODE);  });
        return (
          <>
            <a href="#OpenFileKey">
              <img
                className="align-self-center"
                src={payinIcon}
                alt="พิมพ์ใบแจ้งหนี้"
                style={{ width: "30px", height: "30px" }}
                // onClick={() =>  {  setShowPayin(true);}}
                onClick={oPenfile(params1, "payin")}
              />{" "}
            </a>
          </>
        );

      },
    },
    {
      field: "col11",
      headerName: "ฟอร์มส่ง",
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      renderCell: (params2: any) => {
        return (
          <>
            <a href="#OpenFile">
              <img
                className="align-self-center"
                src={formIcon}
                alt="พิมพ์ฟอร์มนำส่งเงินสมทบ"
                style={{ width: "30px", height: "30px" }}
                onClick={oPenfile(params2, "form")}
              />
            </a>
          </>
        );
      },
    },
    {
      field: "col12",
      headerName: "ใบเสร็จ",
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      renderCell: (params3: any) => {
        if (params3?.row?.RECEIPT_PATHFILE !== " "
          && params3?.row?.RECEIPT_PATHFILE !== null
          && params3?.row?.RECEIPT_PATHFILE !== "0") {
          return (
            <>
              <a href="#OpenFile">
                <img
                  className="align-self-center"
                  src={invoiceIcon}
                  alt="พิมพ์ใบเสร็จรับเงิน"
                  style={{ width: "30px", height: "30px" }}
                  onClick={oPenfile(params3, "invoice")}
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
                  src={invoiceIcon}
                  alt="พิมพ์ใบเสร็จรับเงิน"
                  style={{ width: "30px", height: "30px", opacity: "0.1" }}
                // onClick={oPenfile(params3, "invoice")}
                />
              </a>
            </>
          );
        }

      },
    },
  ];


  const oPenfile = useCallback(
    (id: any, type: any) => () => {
      //let msg = "";
      if (type === "slip") {
        //msg = "เปิดไฟล์สลิปหลักฐานการโอนเงิน";
        //check file ว่ามีหรือยัง
        console.log(id.row.id);
        setPayKey(id.row.id);
        setShowSlip(true);
        return;
      }
      if (type === "payin") {
        //msg = "เปิดไฟล์ใบแจ้งหนี้ (Pay in)";

        // AttachKey(para).then((result) => { setPayKey(result.CODE);  });
        setPayKey(id.row.id);
        setShowPayin(true);
      }
      if (type === "form") {
        //msg = "เปิดไฟล์ฟอร์มการนำส่งเงินสมทบ";
        // AttachKey(para).then((result) => { setPayKey(result.CODE);  });
        setPayKey(id.row.DOCUMENT_HEAD);
        setShowForm(true);
      }
      if (type === "invoice") {
        //msg = "เปิดไฟล์ใบเสร็จรับเงิน";
        // setPayKey(id.row.id);
        // setShowReceive(true);
        window.open(id.row.RECEIPT_PATHFILE)
      }
      //Swal.fire(msg, "ID : " + id.id, "warning");
    },
    []
  );


  const [tableData, setTableData] = useState<
    {
      NUM: any;
      id: any;
      col1: any;
      col2: any;
      col3: any;
      col4: any;
      col5: any;
      col6: any;
      col7: any;
      col8: any;
      REF1: any;
      REF2: any;
      DOCUMENT_HEAD: any;
      UPSLIP_COMMENT: any;
      QUARTER: any;
      CY_NAME: any;
      NAME_TYPE: any;
      PAYINFILE_ATTACHMENT_CODE: any;
      RECEIPT_PATHFILE: any;
    }[]
  >([]);

  useEffect(() => {
    handleOnLoad();
    fnPost(company, sYear, sQuarter, sDOC_TYPE);
  }, []);

  const fnPost = useCallback(
    async (
      COMPANY_CODE: string,
      YEAR: string,
      QUARTER: string,
      DOC_TYPE: string
    ) => {
      if (YEAR == "1") {
        YEAR = "2565";
      } else if (YEAR == "2") {
        YEAR = "2564";
      } else if (YEAR == "3") {
        YEAR = "2563";
      } else if (YEAR == "4") {
        YEAR = "2562";
      }
      Getdatayear().then((data: any) => {
        setSeleteYear(data);
      });
      var para = JSON.parse(
        `{"COMPANY_CODE":"${COMPANY_CODE}", "YEAR":"${YEAR}",  "QUARTER":"${QUARTER}",  "DOC_TYPE":"${DOC_TYPE}" }`
      );
      //console.log(para);
      getPayinListAllSearch(para).then((data: any) => {
        let tmpSchema = [];
        for (let i = 0; i < data.length; i++) {
          var Sumdate = "";
          //console.log(data[i].RECEIPT_DATE);
          if (
            data[i].RECEIPT_DATE !== undefined &&
            data[i].RECEIPT_DATE !== " "
          ) {
            //console.log(data[i].RECEIPT_DATE);
            var parts = data[i].RECEIPT_DATE.split("-");
            var parts2 = parts[2].split(" ");
            var calyear = Number.parseInt(parts2[0]) + 543;
            Sumdate = parts[0] + "/" + parts[1] + "/" + calyear;
          }

          tmpSchema.push({
            NUM: i + 1,
            id: data[i].CODE,
            col1: data[i].CODE,
            col2: data[i].DATE /*moment(data[i].DATE).format("DD/MM/YYYY"),*/,
            col3: data[i].AMOUNT_FINE,
            col4: data[i].AMOUNT_PAY,
            col5: data[i].AMOUNT_TOTALPAY,
            col6: data[i].PAYMENT_STATUS,
            col7: data[i].RECEIPT_NO,
            col8: Sumdate,
            DOCUMENT_HEAD: data[i].DOCUMENT_CODE,
            REF1: data[i].REF1,
            REF2: data[i].REF2,
            UPSLIP_COMMENT: data[i].UPSLIP_COMMENT,
            QUARTER: data[i].QUARTER,
            CY_NAME: data[i].CY_NAME,
            NAME_TYPE: data[i].NAME_TYPE,
            PAYINFILE_ATTACHMENT_CODE: data[i].PAYINFILE_ATTACHMENT_CODE,
            RECEIPT_PATHFILE: data[i].RECEIPT_PATHFILE
          });
        } //loop i
        if (YEAR == "0" && QUARTER != "0") {
          setSNQuarte("ไตรมาส " + QUARTER + " ของทุกปี");
        }
        if (YEAR != "0" && QUARTER == "0") {
          setSNQuarte("ไตรมาส " + YEAR);
        }
        if (YEAR != "0" && QUARTER != "0") {
          setSNQuarte("ไตรมาส " + QUARTER + "/" + YEAR);
        }
        if (YEAR == "0" && QUARTER == "0") {
          setSNQuarte("ทุกไตรมาส");
        }
        setTableData(tmpSchema);
      }); //getPayinList
    },
    []
  );

  function PostGraph(name: string) {
    fnPost(company, sYear, sQuarter, sDOC_TYPE);
  }

  const handleDownloadExcel = () => {
    console.log(company);
    let record = {} as Record<string, any>;
    if (company != "0") {
      record["COMPANY_CODE"] = company;
    }
    if (sYear != "0") {
      record["YEAR"] = sYear;
    }
    if (sDOC_TYPE != "0") {
      record["DOC_TYPE"] = sDOC_TYPE;
    }
    if (sQuarter != "0") {
      console.log(sQuarter);
      record["QUARTER"] = sQuarter;
    }
    downloadFilePost(
      `/Payin/LSSIQ020Excel`,
      "LSS-IQ-020_รายการใบสั่งจ่าย(ใบแจ้งหนี้)และแนบหลักฐานการชำระเงิน.xlsx",
      record
    );
  };

  const header = [
    { header: 'ลำดับ', key: 'NUM', width: 5, style: { alignment: { horizontal: 'center' }, numFmt: '##0' } },
    { header: 'บริษัท', key: 'CY_NAME', width: 50, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'ไตรมาส/ปี', key: 'QUARTER', width: 10, style: { alignment: { horizontal: 'center' }, numFmt: '##0' } },
    { header: 'ประเภทการยื่น', key: 'NAME_TYPE', width: 20, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'เลขที่ใบแจ้งหนี้', key: 'col1', width: 30, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'เลขที่อ้างอิง', key: 'DOCUMENT_HEAD', width: 30, style: { alignment: { horizontal: 'left' }, numFmt: 'Date' } },
    { header: 'วันที่ใบแจ้งหนี้', key: 'col2', width: 20, style: { alignment: { horizontal: 'center' }, numFmt: 'Date' } },
    { header: 'เงินสมทบ', key: 'col4', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'เงินเพิ่ม', key: 'col3', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'เงินที่ชำระ', key: 'col5', width: 30, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'สถานะ', key: 'col6', width: 20, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },
    { header: 'เลขที่ใบเสร็จรับเงิน', key: 'col7', width: 30, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'วันที่ใบเสร็จรับเงิน', key: 'col8', width: 20, style: { alignment: { horizontal: 'center' }, numFmt: 'Date' } },
  ];

  return (
    <Container fluid>
      <Row>
        <Col>
          <NavMenu />
          <Card style={{ marginTop: "9rem" }}>
            <Card.Header>

              LSS-IQ-020
              รายการใบสั่งจ่าย(ใบแจ้งหนี้)และแนบหลักฐานการชำระเงิน

            </Card.Header>
            <Card.Body>
              <Row style={{ marginBottom: 10, marginTop: 0 }}>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  บริษัท
                </Col>
                <Col sm={6} lg={2}>
                  <select
                    className="form-select"
                    name="COMPANY"
                    onChange={(e) => {
                      console.log(e.target.value);
                      setCompany(e.target.value);
                    }}
                    value={company}
                  >
                    <option value="0">ทั้งหมด</option>
                    {common.COMPANIES.map((c) => (
                      <option key={c.CODE} value={c.CODE}>
                        {c.NAME}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col sm={6} lg={2} style={{ textAlign: "right" }}>
                  ประเภทการยื่น
                </Col>
                <Col sm={6} lg={1}>
                  <select
                    className="form-select"
                    name="DOC_TYPE"
                    id="DOC_TYPE"
                    onChange={(e) => {
                      setDOC_TYPE(e.target.value);
                    }}
                    value={sDOC_TYPE}
                  >
                    {/* ปรับให้ดึงจาก table Lss_t_company_quarter */}
                    <option value="0">ทั้งหมด</option>
                    <option value="N">ยื่นปกติ</option>
                    <option value="A">ยื่นเพิ่มเติม</option>
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
                      setSYear(e.target.value);
                    }}
                    value={sYear}
                  >
                    <option value="0" selected>ทั้งหมด</option>
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
                      setSQuarter(e.target.value);
                    }}
                    value={sQuarter}
                  >
                    {/* ปรับให้ดึงจาก table Lss_t_company_quarter */}
                    <option value="0">ทั้งหมด</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
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
                    startIcon={<Search />}
                    onClick={() => PostGraph("James")}
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
                    fileNames={"LSS-IQ-020_รายการใบสั่งจ่าย(ใบแจ้งหนี้)และแนบหลักฐานการชำระเงิน.xlsx"}
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
              <Row>
                <div style={{ height: 500, width: "100%" }}>
                  <div style={{ display: "flex", height: "100%" }}>
                    <div style={{ flexGrow: 1 }}>
                      <DataGrid
                        rows={tableData}
                        columns={columns}
                        getCellClassName={(params) => {
                          return "DD/MM/YY";
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Row>

            </Card.Body>
          </Card>
        </Col>
      </Row>
      <PdfViewer
        show={showPayin}
        url={`${apiUrlBase}/document/getOIC-payin-pdf?code=${payKey}`}
        title={"Bill Payment"}
        onClose={() => setShowPayin(false)}
      />

      <PdfViewer
        show={showForm}
        title={"Form"}
        url={`${apiUrlBase}/document/getOIC-form-pdf?code=${payKey}`}
        onClose={() => setShowForm(false)}
      />
      <PdfViewer
        show={showSlip}
        title={"Slip"}
        url={`${apiUrlBase}/document/get-slip-pdf?code=${payKey}`}
        onClose={() => setShowSlip(false)}
      />
      <PdfViewer
        show={showReceive}
        title={"Slip"}
        url={`${payKey}`}
        onClose={() => setShowReceive(false)}
      />
    </Container>
  );
}
