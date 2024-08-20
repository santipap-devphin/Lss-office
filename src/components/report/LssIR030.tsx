import { useState, useEffect, useCallback } from "react";
import { Card, Container, Row, Col } from 'react-bootstrap';
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { downloadFilePost, getPayinListAll, IR030ListPayin } from "../../data";
import Button from "@mui/material/Button";
import { DatePicker, DatePickerProps } from "antd";
import moment, { Moment } from "moment";
import NavMenu from "../fragments/NavMenu";
import "./PayList.scss";
import attIcon from "../../assets/images/attachment.png";
// import RecPDf from "../../assets/receipt/receipt.pdf"; 
import payinIcon from "../../assets/images/payin.png";
import formIcon from "../../assets/images/payment_order.png";
import invoiceIcon from "../../assets/images/printcer.png";
import { PdfViewer } from "../fragments/PdfViewer";
import { apiUrlBase } from "../../configs/urls";
import { toThaiDateString } from "../../functions/Date";
import { Downloading, Search } from "@mui/icons-material";
import ExportExcel from "./shared/ExportExcel";
const styles = {
  datpicker: {
    width: "100%",
    height: "100%",
    verticalAlign: "middle",
  },
};
export default function LSSIR030() {
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

  const columns: GridColDef[] = /*React.useMemo(() =>*/[

    {
      field: "NUM",
      headerName: "ลำดับ",
      minWidth: 30,
      align: "center",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "col1",
      headerName: "เลขที่ใบแจ้งหนี้",
      minWidth: 200,
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
          var parts2 = parts[2].split("T");
          var calyear = Number.parseInt(parts[0]) + 543;
          var mydate = new Date(parts2[0], parts[1], calyear);
          var Sumdate = parts2[0] + "/" + parts[1] + "/" + calyear;
          return Sumdate;
        }
      },
    },
    { field: "CY_NAME", headerName: "บริษัท", minWidth: 300, align: "left", headerAlign: "center", },
    {
      field: "DOCUMENT_HEAD",
      headerName: "เลขที่อ้างอิง",
      minWidth: 180,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
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
      align: "right",
      headerAlign: "center",
      headerClassName: "headgrid",
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
      field: "col12",
      headerName: "ใบเสร็จ",
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      renderCell: (params3: any) => {
        if (params3?.row?.col7 !== " " && params3?.row?.col7 !== null && params3?.row?.RECEIPT_PATHFILE !== "IMPORT") {
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
      CY_NAME: any;
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
      RECEIPT_PATHFILE: any;
      PAYINFILE_ATTACHMENT_CODE: any;
    }[]
  >([]);

  function PostSearch(st: any, ed: any) {
    fnFetchData(st, ed);
  }

  useEffect(() => {
    fnFetchData(datestart, dateend);
  }, []);

  const fnFetchData = (st: string, ed: string) => {
    var para = JSON.parse(
      `{"DATESTART":"${st}","DATEEND":"${ed}"  }`
    );
    IR030ListPayin(para).then((data: any) => {
      let tmpSchema = [];
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        var Sumdate = "";
        //console.log(data[i].RECEIPT_DATE);
        if (
          data[i].RECEIPT_DATE !== undefined &&
          data[i].RECEIPT_DATE !== " "
        )

          tmpSchema.push({
            NUM: i + 1,
            id: data[i].CODE,
            col1: data[i].CODE,
            CY_NAME: data[i].CY_NAME,
            col2: data[i].DATE /*moment(data[i].DATE).format("DD/MM/YYYY"),*/,
            col3: data[i].AMOUNT_FINE,
            col4: data[i].AMOUNT_PAY,
            col5: data[i].AMOUNT_TOTALPAY,
            col6: data[i].PAYMENT_STATUS,
            col7: data[i].RECEIPT_NO,
            col8: data[i].RECEIPT_DATE,
            DOCUMENT_HEAD: data[i].DOCUMENT_CODE,
            REF1: data[i].REF1,
            REF2: data[i].REF2,
            UPSLIP_COMMENT: data[i].UPSLIP_COMMENT,
            RECEIPT_PATHFILE: data[i].RECEIPT_PATHFILE,
            PAYINFILE_ATTACHMENT_CODE: data[i].PAYINFILE_ATTACHMENT_CODE
          });
      } //loop i
      setTableData(tmpSchema);
    }); //getPayinList
  }
  // useEffect(() => {
  //   getPayinListAll().then((data: any) => {
  //     let tmpSchema = [];
  //     console.log(data);
  //     for (let i = 0; i < data.length; i++) {
  //       var Sumdate = "";
  //       //console.log(data[i].RECEIPT_DATE);
  //       if (
  //         data[i].RECEIPT_DATE !== undefined &&
  //         data[i].RECEIPT_DATE !== " "
  //       ) {
  //         //console.log(data[i].RECEIPT_DATE);
  //         var parts = data[i].RECEIPT_DATE.split("-");
  //         var parts2 = parts[2].split(" ");
  //         var calyear = Number.parseInt(parts2[0]) + 543;
  //         Sumdate = parts[0] + "/" + parts[1] + "/" + calyear;
  //       }

  //       tmpSchema.push({
  //         NUM: i + 1,
  //         id: data[i].CODE,
  //         col1: data[i].CODE,
  //         CY_NAME: data[i].CY_NAME,
  //         col2: data[i].DATE /*moment(data[i].DATE).format("DD/MM/YYYY"),*/,
  //         col3: data[i].AMOUNT_FINE,
  //         col4: data[i].AMOUNT_PAY,
  //         col5: data[i].AMOUNT_TOTALPAY,
  //         col6: data[i].PAYMENT_STATUS,
  //         col7: data[i].RECEIPT_NO,
  //         col8: Sumdate,
  //         DOCUMENT_HEAD: data[i].DOCUMENT_CODE,
  //         REF1: data[i].REF1,
  //         REF2: data[i].REF2,
  //         UPSLIP_COMMENT: data[i].UPSLIP_COMMENT,
  //         RECEIPT_PATHFILE: data[i].RECEIPT_PATHFILE,
  //         PAYINFILE_ATTACHMENT_CODE: data[i].PAYINFILE_ATTACHMENT_CODE
  //       });
  //     } //loop i
  //     setTableData(tmpSchema);
  //   }); //getPayinList
  // }, []);

  const [start_, setStart_] = useState("");
  const [datestart, setDatestart] = useState(moment().format("DD/MM/YYYY"));
  const [dateend, setDateend] = useState(moment().format("DD/MM/YYYY"));
  const [from, setFrom] = useState<Moment | null>(null);
  const [to, setTo] = useState<Moment | null>(null);

  const customDateFormat: DatePickerProps["format"] = (date: Moment) => {
    return toThaiDateString(date.toDate(), "DD/MM/YYYY");
  };

  const handleFromChanged = useCallback((date: Moment | null) => {
    setDatestart(moment(date).format("DD/MM/YYYY"));
    setFrom(date);
  }, []);

  const handleToChanged = useCallback((date: Moment | null) => {
    setDateend(moment(date).format("DD/MM/YYYY"));
    setTo(date);
  }, []);

  // const handleDownloadExcel = () => {
  //   console.log(datestart);
  //   let record = {} as Record<string, any>;
  //     record["STARTDATE"] = datestart;
  //     record["ENDDATE"] = dateend;
  //   downloadFilePost(
  //     `/Payin/IR030PayinExcel`,
  //     "LSS-IR-030_ใบเสร็จรับเงินอิเล็กทรอนิกส์.xlsx",
  //     record
  //   );
  // };
  
  const header = [
    { header: 'ลำดับ', key: 'running', width: 5, style: { alignment: { horizontal: 'center' }, numFmt: '##0' } },
    { header: 'เลขที่ใบแจ้งหนี้', key: 'col1', width: 20, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'วันที่ใบแจ้งหนี้', key: 'col2', width: 20, style: { alignment: { horizontal: 'center' }, numFmt: 'Date' } },
    { header: 'บริษัท', key: 'CY_NAME', width: 50, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'เลขที่อ้างอิง', key: 'DOCUMENT_HEAD', width: 20, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'เงินสมทบ', key: 'col4', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'เงินเพิ่ม', key: 'col3', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'เงินที่ชำระ', key: 'col5', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'สถานะ', key: 'col6', width: 10, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },
    { header: 'เลขที่ใบเสร็จรับเงิน', key: 'col7', width: 20, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'วันที่ใบเสร็จรับเงิน', key: 'col8', width: 20, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },

  ];

  return (
    <Container fluid>
      <Row>
        <Col>
          <NavMenu />
          <Card style={{ marginTop: "9rem" }}>
            <Card.Header>
              LSS-IR-030 ใบเสร็จรับเงินอิเล็กทรอนิกส์
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

                </Col>
                <Col sm={6} lg={1}>

                </Col>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>

                </Col>
                <Col sm={6} lg={1}>

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
                    onClick={() => {
                      PostSearch(datestart, dateend);
                    }}

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
                    fileNames={"LSS-IR-030_ใบเสร็จรับเงินอิเล็กทรอนิกส์.xlsx"}
                    // tableType={"TableCal"}
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

