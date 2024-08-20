import { useState, useEffect, useCallback } from "react";
import "@sweetalert2/theme-minimal/minimal.scss";
import { getCancelAuto, getCommon, ProcessReRunCancelPayment } from "../../data";
import { getPayinListAll ,LSSIP020ListCancelPayin} from "../../data";
import { Card, Col, Row, Container,Form } from "react-bootstrap";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import Downloading from "@mui/icons-material/Downloading";
import Swal from "sweetalert2";
import NavMenu from "../fragments/NavMenu";
import { DataResponse } from "../../models/common/data-response.model";
import { useAppContext } from "../../providers/AppProvider";
import { CompanySelect } from "../../models/common/company-select.model";
import { PrefixSelect } from "../../models/common/prefix-select.model";
import attIcon from "../../assets/images/attachment.png";
import "./Dashboard.tsx";
import { FaBars } from "react-icons/fa";
import { Chart } from "react-google-charts";
import payinIcon from "../../assets/images/payin.png";
import formIcon from "../../assets/images/payment_order.png";
import play from "../../assets/images/play.png";
import invoiceIcon from "../../assets/images/printcer.png";
import { DatePicker, DatePickerProps } from "antd";
import { DataGrid, GridRowsProp, GridColDef, GridValueFormatterParams } from "@mui/x-data-grid";
import moment,{ Moment } from "moment";
import CachedIcon from '@mui/icons-material/Cached';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import React from "react";
import { toThaiDateString } from "../../functions/Date";
import ExportExcel from "../report/shared/ExportExcel";

const styles = {
  datpicker: {
    width: "100%",
    height: "100%",
    verticalAlign: "middle",
  },
};

export default function LSSIT010() {
  const [start_ ,setStart_] = useState("");
  const [datestart ,setDatestart] = useState(moment().format("DD/MM/YYYY"));
  const [dateend ,setDateend] = useState(moment().format("DD/MM/YYYY"));
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
  const columns: GridColDef[] = /*React.useMemo(() =>*/[
    {
      field: "DATE",
      headerName: "วันที่ประมวลผล",
      minWidth: 250,
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
      field: "TYPE",
      headerName: "ประเภทประมวลผล",
      minWidth: 150,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "CODE",
      headerName: "หมายเลข Batch",
      minWidth: 250,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "MESSSAGE",
      headerName: "KEY",
      minWidth: 200,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "NAME",
      headerName: "ชื่อบริษัท",
      minWidth: 200,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "DOC_CODE",
      headerName: "เลขที่ใบแจ้งนี้",
      minWidth: 200,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "AMOUNT_TOTALPAY",
      headerName: "จำนวนเงิน",
      minWidth: 200,
      align: "right", 
      headerAlign: "center",
      headerClassName: "headgrid",
      renderCell: (params) => {
          return (
            <>
              <p>{params.row.AMOUNT_TOTALPAY.toLocaleString()}</p>
            </>
          )
      },
    },
    // {
    //   field: "STATUS",
    //   headerName: "สถานะ",
    //   minWidth: 150,
    //   headerClassName: "headgrid",
    // },
    {
      field: "col11",
      headerName: "สถานะ",
      minWidth: 150,
      align: "center", 
      headerAlign: "center",
      renderCell: (params3: any) => {
        let _label= "";
        if(params3.row.STATUS ==="S") {_label = " สำเร็จ";}
        if(params3.row.STATUS ==="Q") {_label = " รอดำเนินการ ";}
        if(params3.row.STATUS ==="F") {_label = " ไม่สำเร็จ ";}
        return (
          <><b>{_label}</b>
          </>
        );
      },
    },  
 
    {
      field: "col12",
      headerName: "ประมวลผลใหม่",
      minWidth: 150,
      align: "center", 
      headerAlign: "center",
      renderCell: (params3: any) => {
        let _button = "";
        if (params3.row.STATUS === "Q") {
          return (
            <>
              <Button
                variant={"contained"}
                startIcon={<PauseCircleOutlineIcon />}
                onClick={oPenfile(params3, "invoice",datestart)}
                color={"warning"}
              >
                {_button}
              </Button>
            </>
          );
        } else if (params3.row.STATUS === "F") {
          return (
            <>
              <Button
                variant={"contained"}
                startIcon={<CachedIcon />}
                onClick={oPenfile(params3, "invoice",datestart)}
                color={"error"}
              >
                {_button}
              </Button>
            </>
          );
        }

        //  if(params3.row.STATUS ==="S") {return " ";}
        // return (
        //   <>
        //     <a href="#OpenFile">
        //       <img
        //         className="align-self-center"
        //         src={play}
        //         alt="พิมพ์ใบเสร็จรับเงิน"
        //         style={{ width: "30px", height: "30px" }}
        //         onClick={oPenfile(params3, "invoice")}
        //       />
        //     </a>
        //   </>
        // );
      },
    },
  ];
  const oPenfile = useCallback(
    (id: any, type: any,st:any) => () => {
      let para  ={CODE:id.row.CODE};
      setStart_(st);
      console.log("para date start");
      console.log(st);
      console.log("when response");
      console.log(datestart);
      ProcessReRunCancelPayment(para)
      .then((res) => {
        Swal.fire("การประมวลผล", "การประมวลผลเสร็จเรียบร้อย", "success").then(() => {
          console.log("start_");
          
          setTimeout(() => {
            console.log(start_);
          }, 3000);
          fnFetchData(datestart,dateend);
        });
      })
      .catch((err) => {
    
          Swal.fire("มีข้อผิดพลาด", "กรุณาตรวจสอบข้อมูลอีกครั้ง ", "warning");
 
      });
  
    },
    []
  );

  const [newData, setNewData] = useState<
    { id :any;
      CODE: any;
      NAME: any;
      DOC_CODE: any
      AMOUNT_TOTALPAY: any;
      DATE: any;
      SUBJECT: any;
      TYPE: any;
      STATUS: any;
      MESSSAGE: any;
      INFORMATION: any;
      COMPANY_TYPE: any;
      COMPANY_CODE: any;
  
    }[]
  >([]);
  
  const fnProcess = () => {
    getCancelAuto().then((data: any) => {
      console.log("Start function fnProcess");
      console.log(data);
      var para = JSON.parse(
        `{"DATESTART":"${datestart}","DATEEND":"${dateend}"  }`
      );
      LSSIP020ListCancelPayin(para).then((data: any) => {
        let tmpSchema = [];
        for (let i = 0; i < data.length; i++) {
          tmpSchema.push({
            id: data[i].CODE,
            CODE: data[i].CODE,
            NAME: data[i].NAME,
            DOC_CODE: data[i].DOC_CODE,
            AMOUNT_TOTALPAY: data[i].AMOUNT_TOTALPAY,
            DATE: data[i].DATE,
            TYPE: data[i].TYPE,
            SUBJECT: data[i].SUBJECT,
            STATUS: data[i].STATUS,
            MESSSAGE: data[i].MESSSAGE,
            INFORMATION: data[i].INFORMATION,
            COMPANY_TYPE: data[i].COMPANY_TYPE,
            COMPANY_CODE: data[i].COMPANY_CODE,
  
          });
        } //loop i
        setNewData(tmpSchema);
      }); //getPayinList
    })
  }

  const fnFetchData = (  st :string,  ed : string) => {
    var para = JSON.parse(
      `{"DATESTART":"${st}","DATEEND":"${ed}"  }`
    );
    LSSIP020ListCancelPayin(para).then((data: any) => {
      let tmpSchema = [];
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: data[i].CODE,
          CODE: data[i].CODE,
          NAME: data[i].NAME,
          DOC_CODE: data[i].DOC_CODE,
          AMOUNT_TOTALPAY: data[i].AMOUNT_TOTALPAY,
          DATE: data[i].DATE,
          TYPE: data[i].TYPE,
          SUBJECT: data[i].SUBJECT,
          STATUS: data[i].STATUS,
          MESSSAGE: data[i].MESSSAGE,
          INFORMATION: data[i].INFORMATION,
          COMPANY_TYPE: data[i].COMPANY_TYPE,
          COMPANY_CODE: data[i].COMPANY_CODE,

        });
      } //loop i
      setNewData(tmpSchema);
    }); //getPayinList
  }
  function PostSearch(st:any,ed:any) {
    fnFetchData(st,ed);
  }

  useEffect(() => {    
    fnFetchData(datestart,dateend);
  }, []);

  const header = [
    { header: 'วันที่ประมวลผล', key: 'DATE', width: 20, style: { alignment: { horizontal: 'center' }, numFmt: 'Date' } },
    { header: 'ประเภทประมวลผล', key: 'TYPE', width: 20, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'หมายเลข Batch', key: 'CODE', width: 20, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'KEY', key: 'MESSSAGE', width: 20, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'ชื่อบริษัท', key: 'NAME', width: 50, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'เลขที่ใบแจ้งนี้', key: 'DOC_CODE', width: 20, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'จำนวนเงิน', key: 'AMOUNT_TOTALPAY', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'สถานะ', key: 'STATUS', width: 10, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },
    // { header: 'ประมวลผลใหม่', key: 'col7', width: 20, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },
  ];

  return (
    <Container fluid>
      <Row>
        <Col>
          <NavMenu />
          <Card style={{ marginTop: "7rem", marginBottom: "2rem" }}>
            <Card.Header>LSS-IP-010 ประมวลผลยกเลิกใบแจ้งหนี้อัตโนมัติ</Card.Header>
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
                <Col sm={3} lg={1}>
                <Button
                    style={{ marginRight: 5,backgroundColor: "#198754",width: 100 }}
                    variant="contained"
                    onClick={() =>{  
                      fnProcess();}}
                  >
                    {" "}
                    ประมวลผล
                  </Button>
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
                    onClick={() =>{  
                      PostSearch(datestart,dateend);}}
                    
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
                    data={newData}
                    headers={header}
                    fileNames={"LSS-IP-010-ประมวลผลยกเลิกใบแจ้งหนี้อัตโนมัติ.xlsx"}
                    // tableType={"TableCal"}
                    IDMenu={"LSSIT010"}
                  ></ExportExcel>
                  {/* <Button
                    style={{ marginRight: 5 }}
                    variant="contained"
                    startIcon={<Downloading />}
                  >
                    {" "}
                    Excel
                  </Button> */}
                </Col>
              </Row>
            </Card.Body>
          </Card>
 
          <Row>
            <Col>
              <div style={{ height: 500, width: "100%"}}>
                <div style={{ display: "flex", height: "100%" }}>
                  <div style={{ flexGrow: 1 }}>
                  <DataGrid
                  sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2}}
                      rows={newData}
                      columns={columns}
                      getCellClassName={(params) => {
                        return "DD/MM/YY";
                      }}
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flexGrow: 1 }}></div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
