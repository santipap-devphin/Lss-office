import { useState, useEffect, useCallback } from "react";
import "@sweetalert2/theme-minimal/minimal.scss";
import { downloadFilePost, getCommon, LssIR015List, LssIR015ListWhere } from "../../data";
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
import { number } from "yup/lib/locale";
import ExportExcelVarious from "./shared/ExportExcelVarious";

export default function LssIR011() {
  const [common, setCommon] = useState<DataResponse>({
    COMPANIES: [],
    PREFIXES: [],
  });

  const currentYear = new Date().getFullYear();
  const yearOptions = Array(10).fill("").map((x, i) => currentYear - i + 543);

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
      COL12: any;
      COL13: any;
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
      COL12: any;
      COL13: any;
    }[]
  >([]);

  function PostGraph() {
    fnPost(company[0], sYear[0], sQuarter[0]);
  }

  const fnPost = useCallback(async (COMPANY_CODE: string, YEAR: string, QUARTER: string) => {
    var para = JSON.parse(
      `{"COMPANY_CODE":"${COMPANY_CODE}", "YEAR":"${YEAR}",  "QUARTER":"${QUARTER}" }`
    );
    LssIR015ListWhere(para).then((data: any) => {
      setTableData([]);
      setSumTableData([]);
      let tmpSchema = [];
      let tmpSchemaSum = [];
      //ใช้สำหรับเก็บค่า รวมยอด ล่างสุด
      var TmpCOL1 = 0; var TmpCOL2 = 0; var TmpCOL3 = 0; var TmpCOL4 = 0; var TmpCOL5 = 0; var TmpCOL6 = 0; var TmpCOL7 = 0; var TmpCOL8 = 0; var TmpCOL9 = 0; var TmpCOL10 = 0;
      var TmpCOL11 = 0; var TmpCOL12 = 0; var TmpCOL13 = 0;
      var sumAM1 = Number(((data as Array<{ COL1: number }>) ?? []).reduce((p, c) => p + c.COL1, 0));
      var sumAM2 = Number(((data as Array<{ COL2: number }>) ?? []).reduce((p, c) => p + c.COL2, 0));
      console.log('reduce-sumAM1 :' + sumAM1);
      console.log('reduce-sumAM2 :' + sumAM2);
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
          COL11: parseFloat(String(Number(data[i].COL9 || 0) - Number(data[i].COL10 || 0))).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL12: (sumAM1 == 0 ? 0 : 100 * (data[i].COL1 || 0) / sumAM1).toLocaleString(undefined, { minimumFractionDigits: 2 }),
          COL13: (sumAM2 == 0 ? 0 : 100 * (data[i].COL2 || 0) / sumAM2).toLocaleString(undefined, { minimumFractionDigits: 2, }),

        });
        console.log('i = ' + i + '| value-COL12 :' + Number(100 * (data[i].COL1 || 0) / sumAM1));
        console.log('i = ' + i + '| value-COL13 :' + Number(100 * (data[i].COL2 || 0) / sumAM2));
        TmpCOL1 = TmpCOL1 + Number(data[i].COL1);
        TmpCOL2 = TmpCOL2 + Number(data[i].COL2);
        TmpCOL3 = TmpCOL3 + parseFloat(data[i].COL3);
        TmpCOL4 = TmpCOL4 + parseFloat(data[i].COL4);
        TmpCOL5 = TmpCOL5 + parseFloat(data[i].COL5);
        TmpCOL6 = TmpCOL6 + parseFloat(data[i].COL6);
        TmpCOL7 = TmpCOL7 + parseFloat(data[i].COL7);
        TmpCOL8 = TmpCOL8 + parseFloat(data[i].COL8);
        TmpCOL9 = TmpCOL9 + parseFloat(data[i].COL9);
        TmpCOL10 = TmpCOL10 + parseFloat(data[i].COL10);
        TmpCOL11 = TmpCOL11 + (Number(data[i].COL9 || 0) - Number(data[i].COL10 || 0));
        TmpCOL12 = TmpCOL12 + parseFloat(data[i].COL12);
        TmpCOL13 = TmpCOL13 + parseFloat(data[i].COL13);
      } //loop i
      console.log(data[0].COL1);
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
        COL11: TmpCOL11.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL12: TmpCOL12.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL13: TmpCOL13.toLocaleString(undefined, { minimumFractionDigits: 2, }),
      });
      tmpSchemaSum[0].COL12 = "100.00";
      tmpSchemaSum[0].COL13 = "100.00";
      setSumTableData(tmpSchemaSum);
    }); //getPayinList
  }, []);

  const fnLoad = useCallback(async () => {
    LssIR015List().then((data: any) => {
      setTableData([]);
      setSumTableData([]);
      let tmpSchema = [];
      let tmpSchemaSum = [];
      //ใช้สำหรับเก็บค่า รวมยอด ล่างสุด
      var TmpCOL1 = 0; var TmpCOL2 = 0; var TmpCOL3 = 0; var TmpCOL4 = 0; var TmpCOL5 = 0; var TmpCOL6 = 0; var TmpCOL7 = 0; var TmpCOL8 = 0; var TmpCOL9 = 0; var TmpCOL10 = 0;
      var TmpCOL11 = 0; var TmpCOL12 = 0; var TmpCOL13 = 0;
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
          COL12: parseFloat(data[i].COL12 == null ? 0 : data[i].COL12).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          COL13: parseFloat(data[i].COL13 == null ? 0 : data[i].COL13).toLocaleString(undefined, { minimumFractionDigits: 2, }),
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
        TmpCOL12 = TmpCOL12 + parseFloat(data[i].COL12);
        TmpCOL13 = TmpCOL13 + parseFloat(data[i].COL13);
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
        COL11: TmpCOL11.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL12: TmpCOL12.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        COL13: TmpCOL13.toLocaleString(undefined, { minimumFractionDigits: 2, }),
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
  //   if (company[0] != "0") {
  //     record["COMPANY_CODE"] = company[0];
  //   }
  //   if (sYear[0] != "0") {
  //     record["YEAR"] = sYear[0];
  //   }
  //   // if(sType[0] != "0"){
  //   //   record["COMPANY_TYPE_CODE"] = sType[0];
  //   // }
  //   // if(sDOC_TYPE[0] != "0"){
  //   //   record["DOC_TYPE"] = sDOC_TYPE[0];
  //   // }
  //   if (sQuarter[0] != "0") {
  //     console.log(sQuarter);
  //     record["QUARTER"] = sQuarter[0];
  //   }
  //   downloadFilePost(
  //     `/LSSIR015/LSSIR015Excel`,
  //     "LSS-IR-015_รายงานแสดงข้อมูลเบี้ยประกันภัยรับโดยตรงของบริษัท_พร้อมแสดงสัดส่วนเบี้ยประกันภัยรับโดยตรง_ต่อเบี้ยประกันภัยรับโดยตรงรวมทุกบริษัท_แยกเป็นรายบริษัทฯ_ประกันวินาศภัย.xlsx",
  //     record
  //   );
  // }

  const header = [
    { header: '', key: 'id', width: 5, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },
    { header: '', key: 'col1', width: 10, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },
    { header: '', key: 'col1', width: 65, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
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
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
  ];

  return (
    <>
      <div>
        <NavMenu />
        <div style={{ width: "100%", marginTop: 100 }}>
          <h5>
            <FaBars size={30} style={{ margin: "auto" }} />
            &nbsp;&nbsp; LSS-IR-015 รายงานแสดงข้อมูลเบี้ยประกันภัยรับโดยตรงของบริษัท
            พร้อมแสดงสัดส่วนเบี้ยประกันภัยรับโดยตรง
            <br />
            ต่อเบี้ยประกันภัยรับโดยตรงรวมทุกบริษัท แยกเป็นรายบริษัทฯ
            ประกันวินาศภัย
          </h5>
          <div style={{ height: 400, width: "100%" }}>
            <Row style={{ marginBottom: 10, marginTop: 20 }}>
              <Col sm={6} lg={1} style={{ textAlign: "right" }}> </Col>
              <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                บริษัทประกันวินาศภัย
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
                  {common.COMPANIES.filter(x => x.COMPANY_TYPE_CODE === "NONLIFE").map((c) => (
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
                  IDPage={"LSS-IR-015"}
                  fileNames={"LSS-IR-015_รายงานแสดงข้อมูลเบี้ยประกันภัยรับโดยตรงของบริษัท_พร้อมแสดงสัดส่วนเบี้ยประกันภัยรับโดยตรง_ต่อเบี้ยประกันภัยรับโดยตรงรวมทุกบริษัท_แยกเป็นรายบริษัทฯ_ประกันวินาศภัย.xlsx"}
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
                <div style={{ width: "138.5rem" }}>
                  <table
                    style={{
                      border: "1px solid black", background: "#ffffff", width: "138.5rem"
                    }}
                  >
                    <thead>
                      <tr className="tbhead">
                        <th className="tbcenter" rowSpan={2} style={{ verticalAlign: "top", width: "3rem" }} >ลำดับ</th>
                        <th className="tbcenter" rowSpan={2} style={{ verticalAlign: "top", width: "4.5rem" }}  >รหัส</th>
                        <th rowSpan={2} style={{ verticalAlign: "top", textAlign: "center", width: "20rem" }} >บริษัท</th>
                        <th className="tbcenter" rowSpan={2} style={{ verticalAlign: "top", width: "8rem" }}  >
                          เบี้ยประกันภัย<br />รับโดยตรง<br />ในไตรมาสนี้<br />(1) </th>
                        <th className="tbcenter" rowSpan={2} style={{ verticalAlign: "top", width: "8rem" }}  >
                          จำนวนเบี้ย<br />ประกันภัยรับ<br />โดยตรงรวมจาก<br />ต้นปีจนถึง<br />ไตรมาสนี้<br />(2)</th>

                        <th className="tbcenter" colSpan={2} style={{ verticalAlign: "top", width: "16rem" }}  >
                          ไม่เกิน 1,000 ล้านบาท <br />(ร้อยละ 0.30) </th>
                        <th colSpan={2} style={{ textAlign: "center", verticalAlign: "top", width: "8rem" }}  >
                          1,001 - 5,000 ล้านบาท<br />(ร้อยละ 0.25)

                        </th>
                        <th className="tbcenter" colSpan={2} style={{ verticalAlign: "top", width: "16rem" }}  >
                          5,000 ล้านบาทขึ้นไป <br />(ร้อยละ 0.20)
                        </th>
                        <th className="tbcenter" rowSpan={2} style={{ verticalAlign: "top", width: "16rem" }}  >
                          รวมเงิน<br />สมทบสะสม<br />จนถึงไตรมาสนี้<br />(9) = (4)+(6)+(8)

                        </th>
                        <th className="tbcenter" rowSpan={2} style={{ verticalAlign: "top", width: "8rem" }}  >
                          เงินสมทบสะสม<br />ในไตรมาสที่แล้ว <br />(10)

                        </th>
                        <th className="tbcenter" rowSpan={2} style={{ verticalAlign: "top", width: "8rem" }}  >
                          เงินสมทบที่<br />ต้องนำส่ง<br />ในไตรมาสนี้ <br />(11)=(9)-(10)

                        </th>
                        <th className="tbcenter" rowSpan={2} style={{ verticalAlign: "top", width: "16rem" }}  >
                          สัดส่วนเบี้ย<br />ประกันภัยรับ<br />โดยตรงต่อเบี้ย<br />ประกันภัยรับโดยตรง<br />รวมทุกบริษัท <br />
                          (12)

                        </th>
                        <th className="tbcenter" rowSpan={2} style={{ verticalAlign: "top", width: "16rem" }}  >
                          สัดส่วนเบี้ย<br />ประกันภัยรับ<br />โดยตรงต่อเบี้ย<br />ประกันภัยรับโดยตรง<br />รวมทุกบริษัท <br />(จากต้นปีจน<br />ถึงไตรมาสนี้)<br />(13)

                        </th>

                      </tr>
                      <tr className="tbhead">
                        <th className="colauto" style={{ width: "8rem" }}>จำนวนเบี้ย<br />ประกันภัยรับ<br />โดยตรง<br />(3)</th>
                        <th className="colauto" style={{ width: "8rem" }}> จำนวนเงินสมทบ<br />(4)</th>

                        <th className="colauto" style={{ width: "8rem" }}> จำนวนเบี้ย<br />ประกันภัย<br />รับโดยตรง<br /> (5)</th>
                        <th className="colauto" style={{ width: "8rem" }}> จำนวน<br />เงินสมทบ<br />(6)</th>
                        <th className="colauto" style={{ width: "8rem" }}> จำนวนเบี้ย<br />ประกันภัย<br />รับโดยตรง <br />(7)</th>

                        <th className="colauto" style={{ width: "8rem" }}> จำนวน<br />เงินสมทบ<br />(8)</th>

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
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.COL11}</td>
                          <td className="tbcentbnumter" style={{ width: "16rem" }}>{item.COL12.toLocaleString(undefined, { minimumFractionDigits: 2, })}%</td>
                          <td className="tbcentbnumter" style={{ width: "16rem" }}>{item.COL13.toLocaleString(undefined, { minimumFractionDigits: 2, })}%</td>
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
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.COL11}</td>
                          <td className="tbcentbnumter" style={{ width: "16rem" }}>{item2.COL12}%</td>
                          <td className="tbcentbnumter" style={{ width: "16rem" }}>{item2.COL13}%</td>
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
      </div >
    </>
  );
}
