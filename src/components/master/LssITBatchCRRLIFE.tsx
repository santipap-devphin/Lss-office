import { useState, useEffect, useCallback } from "react";
import { Card, Col, Modal,   Container, Row, Form } from "react-bootstrap";
import { 
  DataGrid,
  GridColDef,
  GridValueFormatterParams
 } from "@mui/x-data-grid";
 import { parseISO } from "date-fns";
import { useFormik } from "formik";
import { getCommon, CRR_LIFE_LIST ,BatchCRR ,CompanyList} from "../../data";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import NavMenu from "../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
import Swal from "sweetalert2";
import ObjOpen from "./LssITA04ConfigList";
import "./LssITA04ConfigList.scss";
import {   DatePickerProps  } from "antd";
import { Moment } from "moment";
import { useLocation, Navigate } from "react-router-dom";
import { routerUrlBaseLink } from "../../configs/urls";
 

import { CompanySelect } from "../../models/common/company-select.model";
import { PrefixSelect } from "../../models/common/prefix-select.model";
import { DataResponse } from "../../models/common/data-response.model";

import moment from "moment";
 
// import TimePicker from 'react-time-picker';

const styles = {
  datpicker: {
    width: "100%",
    height: "100%",
    verticalAlign: "middle",
  },
};

const LssITBatchCRRLIFE = () => {
  const [sAction, setSAction] = useState("");
  const [sCode, setSCode] = useState("");
  const [sTitle, setStitle] = useState("");
  const [sTitleIMG, setSTitleIMG] = useState("");
  const [sBtn, setSBtn] = useState("");
  const [sReadOnly, setSReadOnly] = useState(true);
  const [stypelink, setStypelink] = useState("");
  const [WeekEnd, setWeekEnd] = useState("");
  const [holiday, setholiday] = useState("");
  const [startdate, setstartdate] = useState("");
  const [StartTimeOpen, setTo] = useState<Moment | null>(null);
  const [EndTimeClose, setEndTimeClose] = useState<Moment | null>(null);
  const [endtime, setendtime] = useState("Y");

  const [valueS, setvalueS] = useState<Moment | null>(null);
  const [valueE, setvalueE] = useState<Moment | null>(null);

  const [sType, setType] = useState<string[]>(["0"]);
  const [company, setCompany] = useState<string[]>(["0"]);
  const [sQuarter, setSQuarter] = useState<string[]>(["1"]);
  const [sYear, setSYear] = useState<string[]>(["2565"]);

  

  const format = 'HH:mm';
  const [common, setCommon] = useState<DataResponse>({
    COMPANIES: [],
    PREFIXES: [],
  });

  const TitleData = {
    Add: "เพิ่มข้อมูล",
    Edit: "แก้ไขข้อมูล",
    Display: "แสดงข้อมูล",
  };

  const handleOnLoad = () => {
    return new Promise((resolve, reject) => {
      let para = JSON.parse( `{"CODE":"LIFE"}`  );
      CompanyList(para).then((data) => {
       let tmpSchema = [];
       for (let i = 0; i < data.length; i++) {
         tmpSchema.push({
           id: data[i].CODE, 
           CODE: data[i].CODE,
           NAME: data[i].NAME,
         });
       }
       setTableCompany(tmpSchema);
     });
    });
  };


  const onChangeS = useCallback((date: Moment | null) => {
    setvalueS(date);
    form.values.STARTTIME_VALUE = String(date);
  }, []);

  const onChangeE = useCallback((date: Moment | null) => {
    setvalueE(date);
    form.values.ENDTIME_VALUE = String(date);
  }, []);

  const handleToChanged = useCallback((date: Moment | null) => {
    setTo(date);
  }, []);

  const handleEndTimeCloseChanged = useCallback((date: Moment | null) => {
    setEndTimeClose(date);
  }, []);

  const customDateFormat: DatePickerProps["format"] = (date: Moment) => {
    return `${date.toDate().toLocaleDateString("us-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })}`;
  };

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const columns: GridColDef[] = [
 
    {
      field: "YEAR",
      headerName: "ปี",
      minWidth: 100,
      headerClassName: "headgrid",
    },
    {
      field: "QUARTER",
      headerName: "ไตรมาส",
      minWidth: 70,
      headerClassName: "headgrid",
    },
    {
      field: "COMPANY_CODE",
      headerName: "รหัสบริษัท",
      minWidth: 70,
      headerClassName: "headgrid",
    },
    {
      field: "COMPARE_LIFE_CODE",
      headerName: "รหัสประมวลผล",
      minWidth: 240,
      headerClassName: "headgrid",
    },
 
    {
      field: "FIRST_YEAR_AMOUNT",
      headerName: "เบี้ยประกันภัยปีแรก",
      minWidth: 180,
      align: "right",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
 
    
    {
      field: "NEXT_YEAR_AMOUNT",
      headerName: "เบี้ยประกันภัยปีต่อไป",
      minWidth: 180,
      align: "right",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
 
    {
      field: "ONE_TIME_AMOUNT",
      headerName: "เบี้ยประกันภัยชำระครั้งเดียว",
      minWidth: 250,
      align: "right",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
 
    {
      field: "INVESTMENT_AMOUNT",
      headerName: "กรมธรรม์ประกันภัยแบบควบลงทุน",
      minWidth: 270,
      align: "right",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "ENABLE",
      headerName: "สถานะ",
       minWidth: 200,
      headerClassName: "headgrid",
    },

 
  ];

   
  const columnsHead: GridColDef[] = [
 
    {
      field: "YEAR",
      headerName: "ปี",
      minWidth: 100,
      headerClassName: "headgrid",
    },
    {
      field: "QUARTER",
      headerName: "ไตรมาส",
      minWidth: 70,
      headerClassName: "headgrid",
    },
    {
      field: "COMPANY_CODE",
      headerName: "รหัสบริษัท",
      minWidth: 70,
      headerClassName: "headgrid",
    },
    {
      field: "CODE",
      headerName: "รหัสประมวลผล",
      minWidth: 150,
      headerClassName: "headgrid",
    },
    {
      field: "DATE",
      headerName: "วันที่ประมวลผล",
      flex: 1,
      minWidth: 180,
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
    {
      field: "SUM_DELIVER_AMOUNT",     
      headerName: "ยอดนำส่ง",
      minWidth: 170,
      align: "right",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "SUM_CRR_AMOUNT",     
      headerName: "ยอดคำนวณจาก CRR",
      minWidth: 170,
      align: "right",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "DIFF_AMOUNT",     
      headerName: "ส่วนต่าง",
      minWidth: 170,
      align: "right",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "TYPE",     
      headerName: "ขาด/เกิน",
      minWidth: 120,
      headerClassName: "headgrid",
    },
    {
      field: "STATUS",     
      headerName: "การดำเนินการ",
      minWidth: 140,
      headerClassName: "headgrid",
    },
    {
      field: "CRR_ID",
      headerName: "CRR ID",
      minWidth: 100,
      headerClassName: "headgrid",
    },
    {
      field: "CRR_CREATED_DT",
      headerName: "CRR DATE/TIME",
      flex: 1,
      minWidth: 200,
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
    {
      field: "ENABLE",
      headerName: "สถานะ",
      minWidth: 140,
      headerClassName: "headgrid",
    },
 
  ];

 

  const fnLoad  = useCallback(async (para:any) => {
    CRR_LIFE_LIST(para).then((data) => {
       console.log(data);
      let tmpSchema = [];
      for (let i = 0; i < data.CRR_DETAIL.length; i++) {
        tmpSchema.push({
          id: data.CRR_DETAIL[i].CODE, 
          CODE: data.CRR_DETAIL[i].CODE,
          COMPARE_LIFE_CODE: data.CRR_DETAIL[i].COMPARE_LIFE_CODE,
          FIRST_YEAR_AMOUNT: data.CRR_DETAIL[i].FIRST_YEAR_AMOUNT,
          NEXT_YEAR_AMOUNT: data.CRR_DETAIL[i].NEXT_YEAR_AMOUNT,
          ONE_TIME_AMOUNT: data.CRR_DETAIL[i].ONE_TIME_AMOUNT,
          INVESTMENT_AMOUNT: data.CRR_DETAIL[i].INVESTMENT_AMOUNT,
          QUARTER: data.CRR_DETAIL[i].QUARTER,
          YEAR: data.CRR_DETAIL[i].YEAR,
          COMPANY_CODE: data.CRR_DETAIL[i].COMPANY_CODE ,
          ENABLE: data.CRR_DETAIL[i].ENABLE 
        });
      }
      setTableData(tmpSchema);
    });
  }, []);


  const fnLoadHead = useCallback(async (para:any) => {
 
    CRR_LIFE_LIST(para).then((data) => {
       console.log(data);
      let tmpSchema = [];
      for (let i = 0; i < data.CRR_DETAIL.length; i++) {
        tmpSchema.push({
          id: data.CRR_HEAD[i].CODE, 
          CODE:data.CRR_HEAD[i].CODE, 
          DATE:data.CRR_HEAD[i].DATE, 
          QUARTER  : data.CRR_HEAD[i].QUARTER, 
          YEAR  :data.CRR_HEAD[i].YEAR, 
          QUARTER_YEAR  :data.CRR_HEAD[i].QUARTER_YEAR, 
          SUM_DELIVER_AMOUNT  :data.CRR_HEAD[i].SUM_DELIVER_AMOUNT, 
          SUM_CRR_AMOUNT  :data.CRR_HEAD[i].SUM_CRR_AMOUNT, 
          DIFF_AMOUNT  :data.CRR_HEAD[i].DIFF_AMOUNT, 
          TYPE  :data.CRR_HEAD[i].TYPE, 
          STATUS  :data.CRR_HEAD[i].STATUS, 
          ENABLE  :data.CRR_HEAD[i].ENABLE, 
          CREATED_DATE  :data.CRR_HEAD[i].CREATED_DATE, 
          COMPANY_CODE  :data.CRR_HEAD[i].COMPANY_CODE, 
          COMPANY_QUATER_CODE  :data.CRR_HEAD[i].COMPANY_QUATER_CODE, 
          COMPANY_TYPE_CODE  :data.CRR_HEAD[i].COMPANY_TYPE_CODE, 
          CRR_ID  :data.CRR_HEAD[i].CRR_ID, 
          CRR_CREATED_DT  :data.CRR_HEAD[i].CRR_CREATED_DT  

        });
      }
      setTableDataHead(tmpSchema);
    });
  }, []);


  const [tableCompany, setTableCompany] = useState<
  {
    id: any;
    CODE:any;
    NAME:any;
  }[]
>([]);


  const [tableData, setTableData] = useState<
    {
      id: any;
      CODE:any;
      COMPARE_LIFE_CODE:any;
      FIRST_YEAR_AMOUNT: any;
      NEXT_YEAR_AMOUNT: any;
      ONE_TIME_AMOUNT: any;
      INVESTMENT_AMOUNT: any; 
      QUARTER:any;
      YEAR: any;
      COMPANY_CODE:any; 
      ENABLE:any; 
    }[]
  >([]);


  const [tableDataHead, setTableDataHead] = useState<
  {
    id: any;
    CODE:any;
    DATE:any;
    QUARTER  : any;
    YEAR  :any;
    QUARTER_YEAR  : any;
    SUM_DELIVER_AMOUNT  :any; 
    SUM_CRR_AMOUNT  :any; 
    DIFF_AMOUNT  :any; 
    TYPE  :any; 
    STATUS  :any; 
    ENABLE  :any; 
    CREATED_DATE  :any; 
    COMPANY_CODE  :any; 
    COMPANY_QUATER_CODE  :any; 
    COMPANY_TYPE_CODE  :any; 
    CRR_ID  :any; 
    CRR_CREATED_DT  :any; 
  

  }[]
>([]);

 
  useEffect(() => {
    handleOnLoad();
    var para = JSON.parse(
      `{"COMPANY_TYPE_CODE":"${sType}", "COMPANY_CODE":"${company}", "YEAR":"${sYear}",  "QUARTER":"${sQuarter}" }`
    );
    fnLoad(para);
    fnLoadHead(para);
  }, []);

  const [show, setShow] = useState(false);

  const fnModal = (flag: any) => {
    setShow(flag);
  };

  const initValue = {
    SYSTEMLOGIN: "",
    WEEKEND: "",
    HOLIDAY: "",
    STARTTIME: "",
    ENDTIME: "",
    STARTTIME_VALUE: "",
    ENDTIME_VALUE: "",
  };

  function Process() {
    var paracrr = JSON.parse(
      `{"COMPANY_CODE":"${company}","COMPANY_TYPE_CODE":"LIFE","YEAR":"${sYear}",  "QUARTER":"${sQuarter}" }`
    );
    BatchCRR(paracrr)
    .then((res: any) => {
      Swal.fire("ประมวลผล CRR", "เรียบร้อย", "success");
      var para = JSON.parse(
        `{"COMPANY_TYPE_CODE":"${sType}", "COMPANY_CODE":"${company}", "YEAR":"${sYear}",  "QUARTER":"${sQuarter}" }`
      );
      fnLoad(para);
      fnLoadHead(para);
    })
    .catch((err: any) => {
 
        Swal.fire("แจ้งเตือน", "เกิดข้อผิดพลาด", "warning");
 
    });
  }

  function SearchNow() {
    var para = JSON.parse(
      `{"COMPANY_TYPE_CODE":"${sType}", "COMPANY_CODE":"${company}", "YEAR":"${sYear}",  "QUARTER":"${sQuarter}" }`
    );

    fnLoad(para);
    fnLoadHead(para);
  }

 

  const linknew = useCallback((date: Moment | null) => {
    return <Navigate to={"/login"} replace />;
  }, []);

  const form = useFormik({
    validateOnBlur: false,
    initialValues: initValue,
    enableReinitialize: true,
    onSubmit: (data: Record<string, any>) => {
      console.log('on Submit -->');
      data.SYSTEMLOGIN = stypelink;
      data.WEEKEND = WeekEnd;
      data.HOLIDAY = holiday;
      data.STARTTIME = startdate;
      data.ENDTIME = endtime;
      if(valueS === null){
        data.STARTTIME_VALUE = "";
      }else{
        data.STARTTIME_VALUE = String(moment(valueS).format("HH:mm"));
      }
      if(valueE === null){
        data.ENDTIME_VALUE =  "";
      }else{
        data.ENDTIME_VALUE =  String(moment(valueE).format("HH:mm"));
      }
      
 
    },
  });

  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <NavMenu />
            <Card style={{ marginTop: "7rem" }}>
              <Card.Header>
               <div style={{textAlign:"right"}}> 
               <a  href={`${routerUrlBaseLink}LSS-IT-BATCHLIFE`}    > การประมวล CRR [ประกันชีวิต]</a> / 
               <a  href={`${routerUrlBaseLink}LSS-IT-BATCH`}    > การประมวล CRR [ประกันวินาศภัย]</a> </div> 
              </Card.Header>
              <Card.Body>
                <Form onSubmit={form.handleSubmit}>
                  <Row>
                    <Col md="12" style={{ paddingTop: "10px" }}>
                      <Col md="6" style={{ display: "flex" }}>
                        <Col xs="6" md="5"> </Col>
                        <Col xs="12" md="6">
 
                          
                        </Col>
                        <Col md="6">
                        </Col>
                      </Col>
                    </Col>
                     
                  </Row>
                  {/* <Row style={{ textAlign: "center", marginTop: "1rem" }}>
                    <Col md="12">
 
                      <Button
                  style={{ marginRight: 5 }}
                  variant="contained"
                  startIcon={<Search />}
                    onClick={() => Process()}
                >
                  {" "}
                  ประมวลผล CRR บริษัทประกันชีวิต
                </Button>

                    </Col>
                  </Row> */}
                </Form>
              </Card.Body>
            </Card>
            <Card style={{ marginTop: "0.5rem" }}>
              <Card.Header>

                {/* <Row style={{ display: "flex", flexDirection: "row" }}>
                  <Col md="6" style={{ lineHeight: "45px" }}>
                    ข้อมูล CRR ที่มีการประมวลผล  แล้ว
                  </Col>
                  <Col md="6" style={{ display: "flex", flexDirection: "row" }}>
                    <Col md="6">

                    </Col>
                    <Col md="6" style={{ display: "flex", flexDirection: "row", textAlign: "end" }}>
                      <Col md="6">

                      </Col>
                      <Col md="6" style={{ textAlign: "start" }}>
 
                      </Col>


                    </Col>
                  </Col>
                </Row> */}
                <Row style={{ marginBottom: 10, marginTop: 20 }}>
              {/* <Col sm={6} lg={1} style={{ textAlign: "right" }}>ประเภทบริษัท</Col> */}
              {/* <Col sm={6} lg={2}>
                <select
                  className="form-select"
                  name="COMPANY_TYPE_CODE"
                  id="COMPANY_TYPE_CODE"
                  onChange={(e) => {
                    setType([e.target.value]);
                  }}
                  value={sType}
                >
                  <option value="0">ทุกประเภท</option>
                  <option value="LIFE">บริษัทประกันชีวิต</option>
                  <option value="NONLIFE">บริษัทประกันวินาศภัย</option>
                </select>

              </Col> */}
              <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                บริษัทประกัน
              </Col>
              <Col sm={6} lg={2}>
                <select
                  className="form-select"
                  name="COMPANY"
                  onChange={(e) => {
                    setCompany([e.target.value]);
                  }}
                >
                  <option value="0">ทุกบริษัท</option>
                  {tableCompany.map((c : any) => (
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
                  <option value="0">เลือกปี</option>
                  <option value="2568" selected>2568</option>
                  <option value="2567">2567</option>
                  <option value="2566">2566</option>
                  <option value="2565">2565</option>
                  <option value="2564">2564</option>
                  <option value="2563">2563</option>
                  <option value="2562">2562</option>
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
                  {/* ปรับให้ดึงจาก table Lss_t_company_quarter */}
                  <option value="9">ทุกไตรมาส</option>
                  <option value="1" >     1
                  </option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="0">รอบปี</option>
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
                  onClick={() =>SearchNow()}
                >
                  {" "}
                  ค้นหา
                </Button>
              </Col>
              <Col
                md={2}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  textAlign: "right",
                }}
              >
                {/* <Button
                  style={{ marginRight: 5 }}
                  variant="contained"
                  startIcon={<Downloading />}
                >
                  {" "}
                  Excel
                </Button> */}
                                      <Button
                  style={{ marginRight: 5 }}
                  variant="contained"
                  startIcon={<Search />}
                    onClick={() => Process()}
                >
                  {" "}
                  ประมวลผล CRR บริษัทประกันชีวิต
                </Button>
              </Col>
            </Row>
              </Card.Header>
              <Card.Body>
                <b>ข้อมูลการประมวลผล</b>
                <div style={{ height: 300, width: "100%" }}>
                  <div style={{ display: "flex", height: "100%" }}>
                    <div style={{ flexGrow: 1 }}>
                      <DataGrid
                        className=""
                        sx={{
                          fontFamily: "kanit",
                          fontSize: 18,
                          boxShadow: 2,
                        }}
                        rows={tableDataHead}
                        columns={columnsHead}
                      />
                    </div>
                  </div>
                </div>
                <hr></hr>
                <b>รายละเอียดการประมวลผล</b>
                <div style={{ height: 300, width: "100%" }}>
                  <div style={{ display: "flex", height: "100%" }}>
                    <div style={{ flexGrow: 1 }}>
                      <DataGrid
                        className=""
                        sx={{
                          fontFamily: "kanit",
                          fontSize: 18,
                          boxShadow: 2,
                        }}
                        rows={tableData}
                        columns={columns}
                      />
                    </div>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer>
                <Modal
                  size="xl"
                  show={show}
                  onHide={() => setShow(false)}
                  dialogClassName="modal-90w"
                  aria-labelledby="example-custom-modal-styling-title"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                      <img
                        className="align-self-center"
                        src={sTitleIMG}
                        alt="แก้ไขข้อมูล"
                        style={{ width: "30px", height: "30px" }}
                      />
                      {sTitle}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <ObjOpen
                      CODE={sCode}
                      ACTIONCLICK={sAction}
                      onFetchData={fnLoad}
                      onModal={fnModal}
                      showBtn={sBtn}
                      showReadOnly={sReadOnly}
                    />
                  </Modal.Body>
                </Modal>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <div style={{ display: "flex", height: "2rem" }}>
          <div style={{ flexGrow: 1 }}></div>
        </div>
      </Container>
    </>
  );
};

export default LssITBatchCRRLIFE;

