import { useState, useEffect, useCallback } from "react";
import "@sweetalert2/theme-minimal/minimal.scss";
import { downloadFilePost, getCommon, LssIR014List, LssIR014ListWhere } from "../../data";
import { Col, Row } from "react-bootstrap";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import Downloading from "@mui/icons-material/Downloading";
import Swal from "sweetalert2";
import NavMenu from "../fragments/NavMenu";
import { DataResponse } from "../../models/common/data-response.model";
import { CompanySelect } from "../../models/common/company-select.model";
import { PrefixSelect } from "../../models/common/prefix-select.model";
import { FaBars } from "react-icons/fa";
import "./default.scss";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridColumnHeaderParams,
} from "@mui/x-data-grid";
import ExportExcelVarious from "./shared/ExportExcelVarious";

const currentYear = new Date().getFullYear();
const yearOptions = Array(10).fill("").map((x, i) => currentYear - i + 543);

export default function LssIR011() {
  const [common, setCommon] = useState<DataResponse>({
    COMPANIES: [],
    PREFIXES: [],
  });
  const [company, setCompany] = useState<string[]>(["0"]);
  const [sQuarter, setSQuarter] = useState<string[]>(["1"]);
  const [sYear, setSYear] = useState<string[]>([yearOptions[0].toString()]);

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
      COMPANY_CODE: any;
      COMPANY_NAME: any;
      COL1: any;
      COL2: any;
      COL3: any;
      COL4: any;
      COL5: any;
      COL6: any;
      COL7: any;
      COL8: any;
      COL9: any;
      COL10: any;
      COL11: any;
    }[]
  >([]);

  const [SumtableData, setSumTableData] = useState<
    {
      id: any;
      COMPANY_NAME: any;
      COL1: any;
      COL2: any;
      COL3: any;
      COL4: any;
      COL5: any;
      COL6: any;
      COL7: any;
      COL8: any;
      COL9: any;
      COL10: any;
      COL11: any;
    }[]
  >([]);

  function PostGraph() {
    fnPost(company[0], sYear[0], sQuarter[0]);
  }

  const fnPost = useCallback(async (COMPANY_CODE: string, YEAR: string, QUARTER: string) => {
    var para = JSON.parse(
      `{"COMPANY_CODE":"${COMPANY_CODE}", "YEAR":"${YEAR}",  "QUARTER":"${QUARTER}" }`
    );
    console.log(para);
    LssIR014ListWhere(para).then((data: any) => {
      setTableData([]);
      setSumTableData([]);
      let tmpSchema = [];
      let tmpSchemaSum = [];
      //ใช้สำหรับเก็บค่า รวมยอด ล่างสุด
      const sumAM = ((data as Array<{ COL9: number }>) ?? []).reduce((p, c) => p + c.COL9, 0)
      var TmpCOL1 = 0; var TmpCOL2 = 0; var TmpCOL3 = 0; var TmpCOL4 = 0; var TmpCOL5 = 0; var TmpCOL6 = 0; var TmpCOL7 = 0; var TmpCOL8 = 0; var TmpCOL9 = 0; var TmpCOL10 = 0; var TmpCOL11 = 0;
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: i + 1,
          COMPANY_CODE: data[i].COMPANY_CODE,
          COMPANY_NAME: data[i].COMPANY_NAME,
          COL1: parseFloat(data[i].COL1 == null ? 0 : data[i].COL1).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL2: parseFloat(data[i].COL2 == null ? 0 : data[i].COL2).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL3: parseFloat(data[i].COL3 == null ? 0 : data[i].COL3).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL4: parseFloat(data[i].COL4 == null ? 0 : data[i].COL4).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL5: parseFloat(data[i].COL5 == null ? 0 : data[i].COL5).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL6: parseFloat(data[i].COL6 == null ? 0 : data[i].COL6).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL7: parseFloat(data[i].COL7 == null ? 0 : data[i].COL7).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL8: parseFloat(data[i].COL8 == null ? 0 : data[i].COL8).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL9: parseFloat(data[i].COL9 == null ? 0 : data[i].COL9).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL10: parseFloat(data[i].COL10 == null ? 0 : data[i].COL10).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL11: (sumAM == 0 ? 0 : 100 * (data[i].COL9 || 0) / sumAM).toLocaleString(undefined, { minimumFractionDigits: 2, }),
        });

        TmpCOL1 = TmpCOL1 + parseFloat(data[i].COL1);
        TmpCOL2 = TmpCOL2 + parseFloat(data[i].COL2);
        TmpCOL3 = TmpCOL3 + parseFloat(data[i].COL3);
        TmpCOL4 = TmpCOL4 + parseFloat(data[i].COL4);
        TmpCOL5 = TmpCOL5 + parseFloat(data[i].COL5);
        TmpCOL6 = TmpCOL6 + parseFloat(data[i].COL6);
        TmpCOL7 = TmpCOL7 + parseFloat(data[i].COL7);
        TmpCOL8 = TmpCOL8 + parseFloat(data[i].COL8);
        TmpCOL9 = TmpCOL9 + parseFloat(data[i].COL9);
        TmpCOL10 = TmpCOL10 + parseFloat(data[i].COL10);
        TmpCOL11 = sumAM == 0 ? 0 : 100 * (data[i].COL9 || 0) / sumAM;
      } //loop i
      tmpSchemaSum.push({
        id: 1,
        COMPANY_NAME: "รวม",
        COL1: TmpCOL1.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL2: TmpCOL2.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL3: TmpCOL3.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL4: TmpCOL4.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL5: TmpCOL5.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL6: TmpCOL6.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL7: TmpCOL7.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL8: TmpCOL8.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL9: TmpCOL9.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL10: TmpCOL10.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL11: TmpCOL11.toLocaleString(undefined, { minimumFractionDigits: 2, }),
      });
      tmpSchemaSum[0].COL11 = "100.00";
      setSumTableData(tmpSchemaSum);
      setTableData(tmpSchema);
    }); //getPayinList
  }, []);

  const fnLoad = useCallback(async () => {
    LssIR014List().then((data: any) => {
      setTableData([]);
      setSumTableData([]);
      let tmpSchema = [];
      let tmpSchemaSum = [];
      //ใช้สำหรับเก็บค่า รวมยอด ล่างสุด
      var TmpCOL1 = 0; var TmpCOL2 = 0; var TmpCOL3 = 0; var TmpCOL4 = 0; var TmpCOL5 = 0; var TmpCOL6 = 0; var TmpCOL7 = 0; var TmpCOL8 = 0; var TmpCOL9 = 0; var TmpCOL10 = 0; var TmpCOL11 = 0;
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: i + 1,
          COMPANY_CODE: data[i].COMPANY_CODE,
          COMPANY_NAME: data[i].COMPANY_NAME,
          COL1: parseFloat(data[i].COL1 == null ? 0 : data[i].COL1).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL2: parseFloat(data[i].COL2 == null ? 0 : data[i].COL2).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL3: parseFloat(data[i].COL3 == null ? 0 : data[i].COL3).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL4: parseFloat(data[i].COL4 == null ? 0 : data[i].COL4).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL5: parseFloat(data[i].COL5 == null ? 0 : data[i].COL5).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL6: parseFloat(data[i].COL6 == null ? 0 : data[i].COL6).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL7: parseFloat(data[i].COL7 == null ? 0 : data[i].COL7).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL8: parseFloat(data[i].COL8 == null ? 0 : data[i].COL8).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL9: parseFloat(data[i].COL9 == null ? 0 : data[i].COL9).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL10: parseFloat(data[i].COL10 == null ? 0 : data[i].COL10).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL11: parseFloat(data[i].COL11 == null ? 0 : data[i].COL11).toLocaleString(undefined, { minimumFractionDigits: 2, }),
        });

        TmpCOL1 = TmpCOL1 + parseFloat(data[i].COL1);
        TmpCOL2 = TmpCOL2 + parseFloat(data[i].COL2);
        TmpCOL3 = TmpCOL3 + parseFloat(data[i].COL3);
        TmpCOL4 = TmpCOL4 + parseFloat(data[i].COL4);
        TmpCOL5 = TmpCOL5 + parseFloat(data[i].COL5);
        TmpCOL6 = TmpCOL6 + parseFloat(data[i].COL6);
        TmpCOL7 = TmpCOL7 + parseFloat(data[i].COL7);
        TmpCOL8 = TmpCOL8 + parseFloat(data[i].COL8);
        TmpCOL9 = TmpCOL9 + parseFloat(data[i].COL9);
        TmpCOL10 = TmpCOL10 + parseFloat(data[i].COL10);
        TmpCOL11 = TmpCOL11 + parseFloat(data[i].COL11);
      } //loop i
      setTableData(tmpSchema);
      tmpSchemaSum.push({
        id: 1,
        COMPANY_NAME: "รวม",
        COL1: TmpCOL1.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL2: TmpCOL2.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL3: TmpCOL3.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL4: TmpCOL4.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL5: TmpCOL5.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL6: TmpCOL6.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL7: TmpCOL7.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL8: TmpCOL8.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL9: TmpCOL9.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL10: TmpCOL10.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL11: 100.00,
      });
      setSumTableData(tmpSchemaSum);
    }); //getPayinList
  }, []);

  useEffect(() => {
    handleOnLoad();
    fnPost(company[0], sYear[0], sQuarter[0]);
    //fnLoad();
  }, []);

  // const handleDownloadExcel = () => {
  //   let record = {} as Record<string, any>;
  //   if(company[0] != "0"){
  //     record["COMPANY_CODE"] = company[0];
  //   }
  //   if(sYear[0] != "0"){
  //     record["YEAR"] = sYear[0];
  //   }
  //   // if(sType[0] != "0"){
  //   //   record["COMPANY_TYPE_CODE"] = sType[0];
  //   // }
  //   // if(sDOC_TYPE[0] != "0"){
  //   //   record["DOC_TYPE"] = sDOC_TYPE[0];
  //   // }
  //   if(sQuarter[0] != "0"){
  //     console.log(sQuarter);
  //     record["QUARTER"] = sQuarter[0];
  //   }
  //   downloadFilePost(
  //     `/LSSIR014/LSSIR014Excel`,
  //     "LSS-IR-014_รายงานแสดงข้อมูลเบี้ยประกันภัยรับโดยตรงของบริษัท_พร้อมแสดงสัดส่วนเบี้ยประกันภัยรับโดยตรง_ต่อเบี้ยประกันภัยรับโดยตรงรวมทุกบริษัท_แยกเป็นรายบริษัทฯ_ประกันชีวิต.xlsx",
  //     record
  //   );
  // };

  const header = [
    { header: '', key: 'id', width: 5, style: { alignment: { horizontal: 'center' }, numFmt: '#00' } },
    { header: '', key: 'COMPANY_CODE', width: 10, style: { alignment: { horizontal: 'center' }, numFmt: '#00' } },
    { header: '', key: 'COMPANY_NAME', width: 65, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
  ];
  
  return (
    <>
      <div className="d-flex justify-content-center">
        <NavMenu />
        <div style={{ width: "95%", marginTop: 100 }}>
          <h5>
            <FaBars size={30} style={{ margin: "auto" }} />
            &nbsp;&nbsp; LSS-IR-014 รายงานแสดงข้อมูลเบี้ยประกันภัยรับโดยตรงของบริษัท
            พร้อมแสดงสัดส่วนเบี้ยประกันภัยรับโดยตรง
            <br />
            ต่อเบี้ยประกันภัยรับโดยตรงรวมทุกบริษัท แยกเป็นรายบริษัทฯ
            ประกันชีวิต
          </h5>
          <div style={{ height: 400, width: "100%" }}>
            <Row style={{ marginBottom: 10, marginTop: 20 }}>
              <Col sm={6} lg={1} style={{ textAlign: "right" }}> </Col>
              <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                บริษัทประกันชีวิต
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
                  {common.COMPANIES.filter(x => x.COMPANY_TYPE_CODE === "LIFE").map((c) => (
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
                  value={sYear[0]}
                >
                  <option value="0">เลือกปี</option>
                  {yearOptions.map((y, i) => <option key={i} value={y.toString()}>{y.toString()}</option>)}
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
                  <option value="0">ทุกไตรมาส</option>
                  <option value="1" >     1
                  </option>
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
                  onClick={() => PostGraph()}
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
                <ExportExcelVarious
                  data={tableData}
                  dataSum={SumtableData}
                  headers={header}
                  // quarterAndYear={`เงินสมทบไตรมาส ${sQuarter[0]}/${sYear[0]}`}
                  IDPage={"LSS-IR-014"}
                  fileNames={"LSS-IR-014_รายงานแสดงข้อมูลเบี้ยประกันภัยรับโดยตรงของบริษัท_พร้อมแสดงสัดส่วนเบี้ยประกันภัยรับโดยตรง_ต่อเบี้ยประกันภัยรับโดยตรงรวมทุกบริษัท_แยกเป็นรายบริษัทฯ_ประกันชีวิต.xlsx"}
                ></ExportExcelVarious>
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
              <Col className="d-flex justify-content-center">
                <div style={{ width: "132.5rem" }}>
                  <table
                    style={{
                      border: "1px solid black", background: "#ffffff", width: "132.5rem"
                    }}
                  >
                    <thead>
                    <tr className="tbhead">
                      <th className="tbcenter" rowSpan={2} style={{ verticalAlign: "top", width: "3rem" }} >ลำดับ</th>
                      <th className="tbcenter" rowSpan={2} style={{ verticalAlign: "top", width: "4.5rem" }}  >รหัส</th>
                      <th rowSpan={2} style={{ verticalAlign: "top", textAlign: "center", width: "20rem" }} >บริษัท</th>
                      <th colSpan={2} style={{ textAlign: "center", width: "16rem" }}>ปีแรก (ร้อยละ 0.30)</th>
                      <th colSpan={2} style={{ textAlign: "center", width: "16rem" }}> ปีต่อไป (ร้อยละ 0.15)</th>
                      <th colSpan={2} style={{ textAlign: "center", width: "16rem" }}> ชำระเบี้ยครั้งเดียว (ร้อยละ 0.15)</th>
                      <th colSpan={2} style={{ textAlign: "center", width: "16rem" }}> ควบการลงทุน (ร้อยละ 0.10)</th>
                      <th className="colauto" rowSpan={2} style={{ verticalAlign: "top", width: "16rem" }}  >รวมเบี้ยประกันภัย<br />รับโดยตรง<br />(9)=(1)+(3)+(5)+(7)</th>
                      <th className="colauto" rowSpan={2} style={{ verticalAlign: "top", width: "16rem" }}  >รวมเงินสมทบ<br />
                        (10)=(2)+(4)+<br />(6)+(8)</th>
                      <th rowSpan={2} style={{ textAlign: "center",verticalAlign: "top", width: "16rem" }}  >
                        สัดส่วนเบี้ยประกันภัย<br />รับโดยตรงต่อเบี้ย<br />ประกันภัยรับโดยตรง<br />รวมทุกบริษัท<br />(11)</th>
                    </tr>
                    <tr className="tbhead">
                      <th className="colauto" style={{ width: "8rem" }}> จำนวนเบี้ย<br />ประกันภัย<br />รับโดยตรง<br />(1)</th>
                      <th className="colauto" style={{ width: "8rem" }}> จำนวนเงินสมทบ<br />(2)</th>

                      <th className="colauto" style={{ width: "8rem" }}> จำนวนเบี้ย<br />ประกันภัย<br />รับโดยตรง<br />(3)</th>
                      <th className="colauto" style={{ width: "8rem" }}> จำนวนเงินสมทบ<br />(4)</th>

                      <th className="colauto" style={{ width: "8rem" }}> จำนวนเบี้ย<br />ประกันภัย<br />รับโดยตรง<br />(5)</th>
                      <th className="colauto" style={{ width: "8rem" }}> จำนวนเงินสมทบ<br />(6)</th>

                      <th className="colauto" style={{ width: "8rem" }}> จำนวนเบี้ย<br />ประกันภัย<br />รับโดยตรง<br />(7)</th>
                      <th className="colauto" style={{ width: "8rem" }}> จำนวนเงินสมทบ<br />(8)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableData.map((item) => (
                        <tr className="">
                          <td className="tbcenter" style={{ width: "3rem" }}>{item.id}</td>
                          <td className="tbcenter" style={{ width: "4.5rem" }}>{item.COMPANY_CODE}</td>
                          <td className="" style={{ width: "20rem" }}>{item.COMPANY_NAME}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.COL1}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.COL2}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.COL3}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.COL4}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.COL5}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.COL6}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.COL7}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.COL8}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.COL9}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.COL10}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.COL11.toLocaleString(undefined, { minimumFractionDigits: 2, })}%</td>
                        </tr>
                      ))}
                      {SumtableData.map((item2) => (
                        <tr className="tbsum">
                          <td className="tbcenter" colSpan={3} style={{ width: "27.5rem" }}>{item2.COMPANY_NAME}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.COL1}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.COL2}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.COL3}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.COL4}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.COL5}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.COL6}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.COL7}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.COL8}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.COL9}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.COL10}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.COL11}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>

            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ flexGrow: 1 }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
