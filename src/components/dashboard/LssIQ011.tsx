import { useState, useEffect, useCallback } from "react";
import "@sweetalert2/theme-minimal/minimal.scss";
import {
  getCommon,
  getCrrData,
  LssIQ011ListWhere,
  LssIQ011List,
  downloadFilePost,
  Getdatayear,
} from "../../data";
import { Card, Col, Container, Row } from "react-bootstrap";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import Downloading from "@mui/icons-material/Downloading";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridValueFormatterParams,
} from "@mui/x-data-grid";

import NavMenu from "../fragments/NavMenu";
import { DataResponse } from "../../models/common/data-response.model";
import { useAppContext } from "../../providers/AppProvider";
import { CompanySelect } from "../../models/common/company-select.model";
import { PrefixSelect } from "../../models/common/prefix-select.model";
import "./Dashboard.tsx";
import { FaBars } from "react-icons/fa";
import { Chart } from "react-google-charts";
import { parse } from "date-fns";
import "./LssIQ011";
import ExportExcel from "../report/shared/ExportExcel";

export default function LssIQ011() {
  const [common, setCommon] = useState<DataResponse>({
    COMPANIES: [],
    PREFIXES: [],
  });

  const [sType, setSType] = useState("0");
  const [company, setCompany] = useState("0");
  const [sQuarter, setSQuarter] = useState("1");
  const [sYear, setSYear] = useState("2565");
  const [sNQuarter, setSNQuarte] = useState("ทุกไตรมาส");
  const [seleteYear, setSeleteYear] = useState<any[]>([0]);

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

  const [tableData, setTableData] = useState<
    {
      id: any;
      NAME: any;
      AMOUNT_TOTAL_IN_QUARTER_NOW: any;
      AMOUNT_TOTAL: any;
    }[]
  >([]);

  const fnPost = useCallback(
    async (
      COMPANY_TYPE: string,
      YEAR: string,
      QUARTER: string,
      TYPE_DATA: string
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
        `{"COMPANY_TYPE_CODE":"${COMPANY_TYPE}", "YEAR":"${YEAR}",  "QUARTER":"${QUARTER}" , "TYPEDATA":"${TYPE_DATA}" }`
      );
      LssIQ011ListWhere(para).then((data: any) => {

        let tmpSchema = [];
        var tmpATQ = 0.0;
        var tmpAT = 0.0;
        var tmpMax = 0.0;
        for (let i = 0; i < data.length; i++) {
          data[i].AMOUNT_TOTAL_IN_QUARTER_NOW = data[i].AMOUNT_TOTAL_IN_QUARTER_NOW === null ? 0 : data[i].AMOUNT_TOTAL_IN_QUARTER_NOW;
          tmpATQ = tmpATQ + data[i].AMOUNT_TOTAL_IN_QUARTER_NOW;
        }
        for (let i = 0; i < data.length; i++) {
          data[i].AMOUNT_TOTAL_IN_QUARTER_NOW = data[i].AMOUNT_TOTAL_IN_QUARTER_NOW === null ? 0 : data[i].AMOUNT_TOTAL_IN_QUARTER_NOW;
          data[i].MAXQ = data[i].MAXQ === null ? 0 : data[i].MAXQ;
          
          //tmpATQ = tmpATQ + data[i].AMOUNT_TOTAL_IN_QUARTER_NOW;
          var temp = String((data[i].AMOUNT_TOTAL_IN_QUARTER_NOW / data[i].MAXQ) * 100);
          if(temp === 'NaN'){
            tmpAT = tmpAT + 0;
            tmpSchema.push({
              id: i + 1,
              NAME: data[i].NAME,
              AMOUNT_TOTAL_IN_QUARTER_NOW: data[i].AMOUNT_TOTAL_IN_QUARTER_NOW,
              AMOUNT_TOTAL: 0,
              YEARS: data[i].DATE
            });
          }else{
            tmpSchema.push({
              id: i + 1,
              NAME: data[i].NAME,
              AMOUNT_TOTAL_IN_QUARTER_NOW: data[i].AMOUNT_TOTAL_IN_QUARTER_NOW,
              AMOUNT_TOTAL: Math.round(((data[i].AMOUNT_TOTAL_IN_QUARTER_NOW * 100) / tmpATQ + Number.EPSILON) * 100) / 100,
              YEARS: data[i].DATE
            });
            tmpAT += Math.round(((data[i].AMOUNT_TOTAL_IN_QUARTER_NOW * 100) / tmpATQ + Number.EPSILON) * 100) / 100;
            
          }
        } //loop i
        // var tmpID = 0;
        // for (let i = 0; i < tmpSchema.length; i++) {
        //   if(tmpMax > tmpSchema[i].AMOUNT_TOTAL){
        //     tmpMax = tmpSchema[i].AMOUNT_TOTAL;
        //     tmpID = i;
        //   }
        // }

        // for (let i = 0; i < tmpSchema.length; i++) {
        //   if(i = tmpID){
        //      tmpSchema[i].AMOUNT_TOTAL = Math.abs((tmpAT - tmpMax)) + tmpMax;
        //   }
        // }
        tmpSchema.push({
          id: "",
          NAME: "รวม",
          AMOUNT_TOTAL_IN_QUARTER_NOW: tmpATQ,
          AMOUNT_TOTAL: 100,
        });

        setTableData(tmpSchema);
        if (YEAR == "0" && QUARTER != "0") {
          setSNQuarte("ไตรมาส " + YEAR + " ของทุกปี");
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
      }); //getPayinList
    },
    []
  );

  const fnLoad = useCallback(async () => {
    LssIQ011List().then((data: any) => {
      let tmpSchema = [];
      var tmpATQ = 0.0;
      var tmpAT = 0.0;
      for (let i = 0; i < data.length; i++) {
        data[i].AMOUNT_TOTAL_IN_QUARTER_NOW = data[i].AMOUNT_TOTAL_IN_QUARTER_NOW === null ? 0 : data[i].AMOUNT_TOTAL_IN_QUARTER_NOW;
        tmpATQ = tmpATQ + data[i].AMOUNT_TOTAL_IN_QUARTER_NOW;
      }

      for (let i = 0; i < data.length; i++) {
        data[i].AMOUNT_TOTAL_IN_QUARTER_NOW = data[i].AMOUNT_TOTAL_IN_QUARTER_NOW === null ? 0 : data[i].AMOUNT_TOTAL_IN_QUARTER_NOW;
        data[i].MAXQ = data[i].MAXQ === null ? 0 : data[i].MAXQ;
        
        //tmpATQ = tmpATQ + data[i].AMOUNT_TOTAL_IN_QUARTER_NOW;
        var temp = String((data[i].AMOUNT_TOTAL_IN_QUARTER_NOW / data[i].MAXQ) * 100);
        if(temp === 'NaN'){
          tmpAT = tmpAT + 0;
          tmpSchema.push({
            id: i + 1,
            NAME: data[i].NAME,
            AMOUNT_TOTAL_IN_QUARTER_NOW: data[i].AMOUNT_TOTAL_IN_QUARTER_NOW,
            AMOUNT_TOTAL: 0,
            YEAR: data[i].DATE
          });
        }else{
          tmpSchema.push({
            id: i + 1,
            NAME: data[i].NAME,
            AMOUNT_TOTAL_IN_QUARTER_NOW: data[i].AMOUNT_TOTAL_IN_QUARTER_NOW,
            AMOUNT_TOTAL: Math.round(((data[i].AMOUNT_TOTAL_IN_QUARTER_NOW * 100) / tmpATQ) * 100) / 100,
            YEAR: data[i].DATE
          });
          //tmpAT = tmpAT + (data[i].AMOUNT_TOTAL_IN_QUARTER_NOW * 100) / tmpATQ;
        }
      } //loop i
      tmpSchema.push({
        id: data.length + 1,
        NAME: "รวม",
        AMOUNT_TOTAL_IN_QUARTER_NOW: tmpATQ,
        AMOUNT_TOTAL: 100,
      });
      setTableData(tmpSchema);
    }); //getPayinList
  }, []);

  useEffect(() => {
    handleOnLoad();
    //setTableData([]);
    fnPost(company, sYear, sQuarter, sType);
    //fnLoad();
  }, [fnLoad]);



  function PostGraph(name: string) {
    setTableData([]);
    fnPost(company, sYear, sQuarter, sType);
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ลำดับ", width: 100, align: "center", headerAlign: "center" },
    { field: "NAME", headerName: "ชื่อบริษัท", width: 500, align: "left", headerAlign: "center" },
    {
      field: "AMOUNT_TOTAL_IN_QUARTER_NOW",
      headerName: sNQuarter,
      width: 400,
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
      field: "AMOUNT_TOTAL",
      headerName: "สัดส่วนของเงินสมทบต่อเงินสมทบรวมทุกบริษัท",
      width: 400,
      align: "right", 
      headerAlign: "center",
      // valueFormatter: (params: GridValueFormatterParams<any>) => {
      //   return (params.value as number)?.toLocaleString(undefined, {
      //     minimumFractionDigits: 2,
      //     maximumFractionDigits: 2,
      //   });
      // },
    },
  ];

  // const handleDownloadExcel = () => {
  //   let record = {} as Record<string, any>;
  //   if(company != "0"){
  //     record["COMPANY_TYPE_CODE"] = company;
  //   }
  //   if(sType != "0"){
  //     record["TYPEDATA"] = sType;
  //   }
  //   if(sYear != "0"){
  //     record["YEAR"] = sYear;
  //   }
  //   if(sQuarter != "0"){
  //     record["QUARTER"] = sQuarter;
  //   }

  //   downloadFilePost(
  //     `/LSSIQ011/LSSIQ011Excel`,
  //     "LSS-IQ-011_สัดส่วนเงินสมทบต่อเงินสมทบรวมทุกบริษัท.xlsx",
  //     record
  //   );
  // };

  const header = [
    { header: 'ลำดับ', key: 'id', width: 5, style: {alignment: { horizontal: 'center'}} },
    { header: 'บริษัท', key: 'NAME', width: 50, style: {alignment: { horizontal: 'left'},numFmt:'Text'}},
    { header: `ไตรมาส${sQuarter}/${sYear}`, key: 'AMOUNT_TOTAL_IN_QUARTER_NOW', width: 40, style: {alignment: { horizontal: 'right'},numFmt:'#,##0.00'} },
    { header: 'สัดส่วนของเงินสมทบต่อเงินสมทบรวมทุกบริษัท', key: 'AMOUNT_TOTAL', width: 40, style: {alignment: { horizontal: 'right'},numFmt:'#,##0.00'} },
  ];

  return (
    <Container fluid>
      <Row>
        <Col>
          <NavMenu />
          <Card style={{ marginTop: "9rem", marginBottom: "2rem" }}>
            <Card.Header>
              LSS-IQ-011 แสดงสัดส่วนเงินสมทบต่อเงินสมทบรวมทุกบริษัท
            </Card.Header>
            <Card.Body>
              <Row style={{ marginBottom: 10, marginTop: 0 }}>
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  ประเภท
                </Col>
                <Col sm={6} lg={2}>
                  <select
                    className="form-select"
                    name="COMPANY_TYPE_CODE"
                    id="COMPANY_TYPE_CODE"
                    onChange={(e) => {
                      setCompany(e.target.value.toString());
                    }}
                    value={company}
                  >
                    <option value="0">ทั้งหมด</option>
                    <option value="LIFE">บริษัทประกันชีวิต</option>
                    <option value="NONLIFE">บริษัทประกันวินาศภัย</option>
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
                <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                  การแสดงข้อมูล
                </Col>
                <Col sm={6} lg={2}>
                  <select
                    className="form-select"
                    name="QUARTER"
                    id="QUARTER"
                    onChange={(e) => {
                      setSType(e.target.value);
                    }}
                    value={sType}
                  >
                    {" "}
                    <option value="0">ทั้งหมด</option>
                    <option value="2">
                      ยอดตามการคำนวณเงินสมทบจากเบี้ยประกัยภัยรับโดยตรงของรายงานทางการเงิน
                    </option>
                    <option value="1">ยอดตามแบบนำส่งเงินสมทบ</option>
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
                        fileNames={"LSS-IQ-011_สัดส่วนเงินสมทบต่อเงินสมทบรวมทุกบริษัท.xlsx"}
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
                <Col>
                  <div style={{ height: 600, width: "100%" }}>
                    <DataGrid
                      sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                      rows={tableData}
                      columns={columns}
                    />
                  </div>
                </Col>
              </Row>
              <div style={{ display: "flex", height: "100%" }}>
                <div style={{ flexGrow: 1 }}></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
