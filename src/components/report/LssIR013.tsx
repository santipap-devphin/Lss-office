import { useState, useEffect, useCallback, Fragment } from "react";
import "@sweetalert2/theme-minimal/minimal.scss";
import { downloadFilePost, getCommon, LssIR013List, LssIR013ListWhere } from "../../data";
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
  const [sType, setType] = useState<string[]>(["0"]);
  const [company, setCompany] = useState<string[]>(["0"]);
  const [sQuarter, setSQuarter] = useState<string[]>(["1"]);
  const [sYear, setSYear] = useState<string[]>([yearOptions[0].toString()]);


  const [tableData, setTableData] = useState<
    {
      id: any;
      COMPANY_CODE: any;
      COMPANY_NAME: any;
      Q1_AMOUNT: any;
      Q1_CRR_AMOUNT: any;
      Q1_DIFF: any;
      Q2_AMOUNT: any;
      Q2_CRR_AMOUNT: any;
      Q2_DIFF: any;
      Q3_AMOUNT: any;
      Q3_CRR_AMOUNT: any;
      Q3_DIFF: any;
      Q4_AMOUNT: any;
      Q4_CRR_AMOUNT: any;
      Q4_DIFF: any;
      SUM_AMOUNT: any;
      SUM_CRR_AMOUNT: any;
      SUM_DIFF: any;
    }[]
  >([]);

  const [SumtableData, setSumTableData] = useState<
    {
      id: any;
      COMPANY_NAME: any;
      Q1_AMOUNT: any;
      Q1_CRR_AMOUNT: any;
      Q1_DIFF: any;
      Q2_AMOUNT: any;
      Q2_CRR_AMOUNT: any;
      Q2_DIFF: any;
      Q3_AMOUNT: any;
      Q3_CRR_AMOUNT: any;
      Q3_DIFF: any;
      Q4_AMOUNT: any;
      Q4_CRR_AMOUNT: any;
      Q4_DIFF: any;
      SUM_AMOUNT: any;
      SUM_CRR_AMOUNT: any;
      SUM_DIFF: any;
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

  function PostGraph() {
    fnPost(sType[0], company[0], sYear[0], sQuarter[0]);
  }

  const fnPost = useCallback(async (COMPANY_TYPE: string, COMPANY_CODE: string, YEAR: string, QUARTER: string) => {

    var para = JSON.parse(
      `{"COMPANY_TYPE_CODE":"${COMPANY_TYPE}", "COMPANY_CODE":"${COMPANY_CODE}", "YEAR":"${YEAR}",  "QUARTER":"${QUARTER}" }`
    );
    console.log(para);
    LssIR013ListWhere(para).then((data: any) => {
      let tmpSchema = [];
      let tmpSchemaSum = [];
      console.log(data);
      var TempCode = "";
      var Tempid = 1;
      //ใช้สำหรับเก็บค่า รวมยอด ล่างสุด
      var TmpQ1_AMOUNT = 0; var TmpQ1_CRR_AMOUNT = 0; var TmpQ1_DIFF = 0;
      var TmpQ2_AMOUNT = 0; var TmpQ2_CRR_AMOUNT = 0; var TmpQ2_DIFF = 0;
      var TmpQ3_AMOUNT = 0; var TmpQ3_CRR_AMOUNT = 0; var TmpQ3_DIFF = 0;
      var TmpQ4_AMOUNT = 0; var TmpQ4_CRR_AMOUNT = 0; var TmpQ4_DIFF = 0;
      var TmpSUM_AMOUNT = 0; var TmpSUM_CRR_AMOUNT = 0; var TmpSUM_DIFF = 0;
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: i + 1,
          COMPANY_CODE: data[i].COMPANY_CODE,
          COMPANY_NAME: data[i].COMPANY_NAME,
          Q1_AMOUNT: parseFloat(data[i].Q1_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q1_CRR_AMOUNT: parseFloat(data[i].Q1_CRR_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q1_DIFF: parseFloat(data[i].Q1_DIFF).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q2_AMOUNT: parseFloat(data[i].Q2_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q2_CRR_AMOUNT: parseFloat(data[i].Q2_CRR_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q2_DIFF: parseFloat(data[i].Q2_DIFF).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q3_AMOUNT: parseFloat(data[i].Q3_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q3_CRR_AMOUNT: parseFloat(data[i].Q3_CRR_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q3_DIFF: parseFloat(data[i].Q3_DIFF).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q4_AMOUNT: parseFloat(data[i].Q4_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q4_CRR_AMOUNT: parseFloat(data[i].Q4_CRR_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q4_DIFF: parseFloat(data[i].Q4_DIFF).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          SUM_AMOUNT: parseFloat(data[i].Q1_AMOUNT + data[i].Q2_AMOUNT + data[i].Q3_AMOUNT + data[i].Q4_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          SUM_CRR_AMOUNT: parseFloat(data[i].Q1_CRR_AMOUNT + data[i].Q2_CRR_AMOUNT + data[i].Q3_CRR_AMOUNT + data[i].Q4_CRR_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          SUM_DIFF: parseFloat(data[i].Q1_DIFF + data[i].Q2_DIFF + data[i].Q3_DIFF + data[i].Q4_DIFF).toLocaleString(undefined, { minimumFractionDigits: 2, }),
        });

        TmpQ1_AMOUNT = TmpQ1_AMOUNT + parseFloat(data[i].Q1_AMOUNT);
        TmpQ1_CRR_AMOUNT = TmpQ1_CRR_AMOUNT + parseFloat(data[i].Q1_CRR_AMOUNT);
        TmpQ1_DIFF = TmpQ1_DIFF + parseFloat(data[i].Q1_DIFF);
        TmpQ2_AMOUNT = TmpQ1_AMOUNT + parseFloat(data[i].Q2_AMOUNT);
        TmpQ2_CRR_AMOUNT = TmpQ1_CRR_AMOUNT + parseFloat(data[i].Q2_CRR_AMOUNT);
        TmpQ2_DIFF = TmpQ1_DIFF + parseFloat(data[i].Q2_DIFF);
        TmpQ3_AMOUNT = TmpQ1_AMOUNT + parseFloat(data[i].Q3_AMOUNT);
        TmpQ3_CRR_AMOUNT = TmpQ1_CRR_AMOUNT + parseFloat(data[i].Q3_CRR_AMOUNT);
        TmpQ3_DIFF = TmpQ1_DIFF + parseFloat(data[i].Q3_DIFF);
        TmpQ4_AMOUNT = TmpQ1_AMOUNT + parseFloat(data[i].Q4_AMOUNT);
        TmpQ4_CRR_AMOUNT = TmpQ1_CRR_AMOUNT + parseFloat(data[i].Q4_CRR_AMOUNT);
        TmpQ4_DIFF = TmpQ1_DIFF + parseFloat(data[i].Q4_DIFF);
        TmpSUM_AMOUNT = TmpSUM_AMOUNT + parseFloat(data[i].Q1_AMOUNT + data[i].Q2_AMOUNT + data[i].Q3_AMOUNT + data[i].Q4_AMOUNT);
        TmpSUM_CRR_AMOUNT = TmpSUM_CRR_AMOUNT + parseFloat(data[i].Q1_CRR_AMOUNT + data[i].Q2_CRR_AMOUNT + data[i].Q3_CRR_AMOUNT + data[i].Q4_CRR_AMOUNT);
        TmpSUM_DIFF = TmpSUM_DIFF + parseFloat(data[i].Q1_DIFF + data[i].Q2_DIFF + data[i].Q3_DIFF + data[i].Q4_DIFF);
      } //loop i
      console.log(tmpSchema);
      setTableData(tmpSchema);
      tmpSchemaSum.push({
        id: 1,
        COMPANY_NAME: "รวม",
        Q1_AMOUNT: TmpQ1_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q1_CRR_AMOUNT: TmpQ1_CRR_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q1_DIFF: TmpQ1_DIFF.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q2_AMOUNT: TmpQ2_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q2_CRR_AMOUNT: TmpQ2_CRR_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q2_DIFF: TmpQ2_DIFF.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q3_AMOUNT: TmpQ3_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q3_CRR_AMOUNT: TmpQ3_CRR_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q3_DIFF: TmpQ3_DIFF.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q4_AMOUNT: TmpQ4_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q4_CRR_AMOUNT: TmpQ4_CRR_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q4_DIFF: TmpQ4_DIFF.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SUM_AMOUNT: TmpSUM_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SUM_CRR_AMOUNT: TmpSUM_CRR_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SUM_DIFF: TmpSUM_DIFF.toLocaleString(undefined, { minimumFractionDigits: 2, }),
      });
      setSumTableData(tmpSchemaSum);
    }); //getPayinList
  }, []);

  const fnLoad = useCallback(async () => {
    LssIR013List().then((data: any) => {
      console.log(data);
      setTableData([]);
      setSumTableData([]);
      let tmpSchema = [];
      let tmpSchemaSum = [];
      var TempCode = "";
      var Tempid = 1;
      //ใช้สำหรับเก็บค่า รวมยอด ล่างสุด
      var TmpQ1_AMOUNT = 0; var TmpQ1_CRR_AMOUNT = 0; var TmpQ1_DIFF = 0;
      var TmpQ2_AMOUNT = 0; var TmpQ2_CRR_AMOUNT = 0; var TmpQ2_DIFF = 0;
      var TmpQ3_AMOUNT = 0; var TmpQ3_CRR_AMOUNT = 0; var TmpQ3_DIFF = 0;
      var TmpQ4_AMOUNT = 0; var TmpQ4_CRR_AMOUNT = 0; var TmpQ4_DIFF = 0;
      var TmpSUM_AMOUNT = 0; var TmpSUM_CRR_AMOUNT = 0; var TmpSUM_DIFF = 0;
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: i + 1,
          COMPANY_CODE: data[i].COMPANY_CODE,
          COMPANY_NAME: data[i].COMPANY_NAME,
          Q1_AMOUNT: parseFloat(data[i].Q1_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q1_CRR_AMOUNT: parseFloat(data[i].Q1_CRR_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q1_DIFF: parseFloat(data[i].Q1_DIFF).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q2_AMOUNT: parseFloat(data[i].Q2_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q2_CRR_AMOUNT: parseFloat(data[i].Q2_CRR_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q2_DIFF: parseFloat(data[i].Q2_DIFF).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q3_AMOUNT: parseFloat(data[i].Q3_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q3_CRR_AMOUNT: parseFloat(data[i].Q3_CRR_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q3_DIFF: parseFloat(data[i].Q3_DIFF).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q4_AMOUNT: parseFloat(data[i].Q4_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q4_CRR_AMOUNT: parseFloat(data[i].Q4_CRR_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q4_DIFF: parseFloat(data[i].Q4_DIFF).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          SUM_AMOUNT: parseFloat(data[i].Q1_AMOUNT + data[i].Q2_AMOUNT + data[i].Q3_AMOUNT + data[i].Q4_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          SUM_CRR_AMOUNT: parseFloat(data[i].Q1_CRR_AMOUNT + data[i].Q2_CRR_AMOUNT + data[i].Q3_CRR_AMOUNT + data[i].Q4_CRR_AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          SUM_DIFF: parseFloat(data[i].Q1_DIFF + data[i].Q2_DIFF + data[i].Q3_DIFF + data[i].Q4_DIFF).toLocaleString(undefined, { minimumFractionDigits: 2, }),
        });

        TmpQ1_AMOUNT = TmpQ1_AMOUNT + parseFloat(data[i].Q1_AMOUNT);
        TmpQ1_CRR_AMOUNT = TmpQ1_CRR_AMOUNT + parseFloat(data[i].Q1_CRR_AMOUNT);
        TmpQ1_DIFF = TmpQ1_DIFF + parseFloat(data[i].Q1_DIFF);
        TmpQ2_AMOUNT = TmpQ1_AMOUNT + parseFloat(data[i].Q2_AMOUNT);
        TmpQ2_CRR_AMOUNT = TmpQ1_CRR_AMOUNT + parseFloat(data[i].Q2_CRR_AMOUNT);
        TmpQ2_DIFF = TmpQ1_DIFF + parseFloat(data[i].Q2_DIFF);
        TmpQ3_AMOUNT = TmpQ1_AMOUNT + parseFloat(data[i].Q3_AMOUNT);
        TmpQ3_CRR_AMOUNT = TmpQ1_CRR_AMOUNT + parseFloat(data[i].Q3_CRR_AMOUNT);
        TmpQ3_DIFF = TmpQ1_DIFF + parseFloat(data[i].Q3_DIFF);
        TmpQ4_AMOUNT = TmpQ1_AMOUNT + parseFloat(data[i].Q4_AMOUNT);
        TmpQ4_CRR_AMOUNT = TmpQ1_CRR_AMOUNT + parseFloat(data[i].Q4_CRR_AMOUNT);
        TmpQ4_DIFF = TmpQ1_DIFF + parseFloat(data[i].Q4_DIFF);
        TmpSUM_AMOUNT = TmpSUM_AMOUNT + parseFloat(data[i].Q1_AMOUNT + data[i].Q2_AMOUNT + data[i].Q3_AMOUNT + data[i].Q4_AMOUNT);
        TmpSUM_CRR_AMOUNT = TmpSUM_CRR_AMOUNT + parseFloat(data[i].Q1_CRR_AMOUNT + data[i].Q2_CRR_AMOUNT + data[i].Q3_CRR_AMOUNT + data[i].Q4_CRR_AMOUNT);
        TmpSUM_DIFF = TmpSUM_DIFF + parseFloat(data[i].Q1_DIFF + data[i].Q2_DIFF + data[i].Q3_DIFF + data[i].Q4_DIFF);
      } //loop i
      console.log('Data input grid');
      console.log(tmpSchema);
      setTableData(tmpSchema);
      tmpSchemaSum.push({
        id: 1,
        COMPANY_NAME: "รวม",
        Q1_AMOUNT: TmpQ1_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q1_CRR_AMOUNT: TmpQ1_CRR_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q1_DIFF: TmpQ1_DIFF.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q2_AMOUNT: TmpQ2_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q2_CRR_AMOUNT: TmpQ2_CRR_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q2_DIFF: TmpQ2_DIFF.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q3_AMOUNT: TmpQ3_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q3_CRR_AMOUNT: TmpQ3_CRR_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q3_DIFF: TmpQ3_DIFF.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q4_AMOUNT: TmpQ4_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q4_CRR_AMOUNT: TmpQ4_CRR_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q4_DIFF: TmpQ4_DIFF.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SUM_AMOUNT: TmpSUM_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SUM_CRR_AMOUNT: TmpSUM_CRR_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SUM_DIFF: TmpSUM_DIFF.toLocaleString(undefined, { minimumFractionDigits: 2, }),
      });
      setSumTableData(tmpSchemaSum);
    }); //getPayinList
  }, []);

  useEffect(() => {
    handleOnLoad();
    fnPost(sType[0], company[0], sYear[0], sQuarter[0]);
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
  //   if (sType[0] != "0") {
  //     record["COMPANY_TYPE_CODE"] = sType[0];
  //   }
  //   // if(sDOC_TYPE[0] != "0"){
  //   //   record["DOC_TYPE"] = sDOC_TYPE[0];
  //   // }
  //   if (sQuarter[0] != "0") {
  //     console.log(sQuarter);
  //     record["QUARTER"] = sQuarter[0];
  //   }
  //   downloadFilePost(
  //     `/LSSIR013/LSSIR013Excel`,
  //     "LSS-IR-013_รายงานสรุปการเปรียบเทียบข้อมูลเงินสมทบ(ยื่นแบบนำส่งเงินสมทบขาด/เกิน)ระหว่างยอดเงินสมทบ_ตามการยื่นแบบกับยอดเงินสมทบที่คำนวณได้จากเบี้ยประกันภัยรับโดยตรงจากระบบ.xlsx",
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
  
  ];

  return (
    <>
      <div>
        <NavMenu />
        <div style={{ width: "100%", marginTop: 100 }}>
          <h5>
            <FaBars size={30} style={{ margin: "auto" }} />
            &nbsp;&nbsp; LSS-IR-013 รายงานสรุปการเปรียบเทียบข้อมูลเงินสมทบ
            (ยื่นแบบนำส่งเงินสมทบขาด/เกิน) ระหว่างยอดเงินสมทบ
            <br />
            ตามการยื่นแบบกับยอดเงินสมทบที่คำนวณได้จากเบี้ยประกันภัยรับโดยตรงจากระบบ
          </h5>
          <div style={{ height: 400, width: "100%" }}>
            <Row style={{ marginBottom: 10, marginTop: 20 }}>
              <Col sm={6} lg={1} style={{ textAlign: "right" }}>ประเภทบริษัท</Col>
              <Col sm={6} lg={2}>
                <select
                  className="form-select"
                  name="COMPANY_TYPE_CODE"
                  id="COMPANY_TYPE_CODE"
                  onChange={(e) => {
                    setType([e.target.value]);
                    setCompany(["0"])
                  }}
                  value={sType[0]}
                >
                  <option value="0">ทุกประเภท</option>
                  <option value="LIFE">บริษัทประกันชีวิต</option>
                  <option value="NONLIFE">บริษัทประกันวินาศภัย</option>
                </select>

              </Col>
              <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                บริษัทประกัน
              </Col>
              <Col sm={6} lg={2}>
                <select
                  className="form-select"
                  name="COMPANY"
                  value={company[0]}
                  onChange={(e) => {
                    setCompany([e.target.value]);
                  }}
                >
                  <option value="0">ทุกบริษัท</option>
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
                  value={sYear[0]}
                >
                  {/* <option value="0">เลือกปี</option> */}
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
                  quarterAndYear={`เงินสมทบไตรมาส ${sQuarter[0]}/${sYear[0]}`}
                  IDPage={"LSS-IR-013"}
                  fileNames={"LSS-IR-013_รายงานสรุปการเปรียบเทียบข้อมูลเงินสมทบ(ยื่นแบบนำส่งเงินสมทบขาด/เกิน)ระหว่างยอดเงินสมทบ_ตามการยื่นแบบกับยอดเงินสมทบที่คำนวณได้จากเบี้ยประกันภัยรับโดยตรงจากระบบ.xlsx"}
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
                        {/* <th className="tbcenter" rowSpan={2} style={{ verticalAlign: "top", width: "50px" }} >ลำดับ</th>
                      <th className="tbcenter" rowSpan={2} style={{ verticalAlign: "top", width: "50px" }}  >รหัส</th>
                      <th rowSpan={2} style={{ verticalAlign: "top", textAlign: "center", width: "200px" }} >บริษัท</th> */}
                        <th rowSpan={2} style={{ verticalAlign: "top", textAlign: "center", width: "3rem" }} >ลำดับ</th>
                        <th rowSpan={2} style={{ verticalAlign: "top", textAlign: "center", width: "4.5rem" }}  >รหัส</th>
                        <th rowSpan={2} style={{ verticalAlign: "top", textAlign: "center", width: "20rem" }} >บริษัท</th>
                        {sQuarter[0] === "1" || sQuarter[0] === "0" ? <th colSpan={3} style={{ textAlign: "center", width: "14.4rem" }}> เงินสมทบไตรมาส  1/{sYear[0]}</th> : <></>}
                        {sQuarter[0] === "2" || sQuarter[0] === "0" ? <th colSpan={3} style={{ textAlign: "center", width: "14.4rem" }}> เงินสมทบไตรมาส  2/{sYear[0]}</th> : <></>}
                        {sQuarter[0] === "3" || sQuarter[0] === "0" ? <th colSpan={3} style={{ textAlign: "center", width: "14.4rem" }}> เงินสมทบไตรมาส  3/{sYear[0]}</th> : <></>}
                        {sQuarter[0] === "4" || sQuarter[0] === "0" ? <th colSpan={3} style={{ textAlign: "center", width: "14.4rem" }}> เงินสมทบไตรมาส  4/{sYear[0]}</th> : <></>}
                        {sQuarter[0] === "0" ? <th colSpan={3} style={{ textAlign: "center", width: "14.4rem" }}> รวมเงินสมทบไตรมาส {sYear[0]}</th> : <></>}
                      </tr>
                      <tr className="tbhead">
                        {sQuarter[0] === "1" || sQuarter[0] === "0" ? <Fragment>
                          <th style={{ textAlign: "center", width: "8rem" }}> ยอดตาม<br />แบบนำส่ง</th>
                          <th style={{ textAlign: "center", width: "8rem" }}> ตามยอด<br />การคำนวณ</th>
                          <th style={{ textAlign: "center", width: "8rem" }}> ส่งเกิน<br />(ขาด)</th>
                        </Fragment> : <></>}
                        {sQuarter[0] === "2" || sQuarter[0] === "0" ? <Fragment>
                          <th style={{ textAlign: "center", width: "8rem" }}> ยอดตาม<br />แบบนำส่ง</th>
                          <th style={{ textAlign: "center", width: "8rem" }}> ตามยอด<br />การคำนวณ</th>
                          <th style={{ textAlign: "center", width: "8rem" }}> ส่งเกิน<br />(ขาด)</th>
                        </Fragment> : <></>}
                        {sQuarter[0] === "3" || sQuarter[0] === "0" ? <Fragment>
                          <th style={{ textAlign: "center", width: "8rem" }}> ยอดตาม<br />แบบนำส่ง</th>
                          <th style={{ textAlign: "center", width: "8rem" }}> ตามยอด<br />การคำนวณ</th>
                          <th style={{ textAlign: "center", width: "8rem" }}> ส่งเกิน<br />(ขาด)</th>
                        </Fragment> : <></>}
                        {sQuarter[0] === "4" || sQuarter[0] === "0" ? <Fragment>
                          <th style={{ textAlign: "center", width: "8rem" }}> ยอดตาม<br />แบบนำส่ง</th>
                          <th style={{ textAlign: "center", width: "8rem" }}> ตามยอด<br />การคำนวณ</th>
                          <th style={{ textAlign: "center", width: "8rem" }}> ส่งเกิน<br />(ขาด)</th>
                        </Fragment> : <></>}
                        {sQuarter[0] === "0" ? <Fragment>
                          <th style={{ textAlign: "center", width: "8rem" }}> ยอดตาม<br />แบบนำส่ง</th>
                          <th style={{ textAlign: "center", width: "8rem" }}> ตามยอด<br />การคำนวณ</th>
                          <th style={{ textAlign: "center", width: "8rem" }}> ส่งเกิน<br />(ขาด)</th>
                        </Fragment> : <></>}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((item, i) => (
                        <tr className="" key={i}>
                          <td className="tbcenter" style={{ width: "3rem" }}>{item.id}</td>
                          <td className="tbcenter" style={{ width: "4.5rem" }}>{item.COMPANY_CODE}</td>
                          <td className="" style={{ width: "20rem" }}>{item.COMPANY_NAME}</td>
                          {sQuarter[0] === "1" || sQuarter[0] === "0" ? <Fragment>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.Q1_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.Q1_CRR_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.Q1_DIFF}</td>
                          </Fragment> : <></>}
                          {sQuarter[0] === "2" || sQuarter[0] === "0" ? <Fragment>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.Q2_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.Q2_CRR_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.Q2_DIFF}</td>
                          </Fragment> : <></>}
                          {sQuarter[0] === "3" || sQuarter[0] === "0" ? <Fragment>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.Q3_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.Q3_CRR_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.Q3_DIFF}</td>
                          </Fragment> : <></>}
                          {sQuarter[0] === "4" || sQuarter[0] === "0" ? <Fragment>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.Q4_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.Q4_CRR_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.Q4_DIFF}</td>
                          </Fragment> : <></>}
                          {sQuarter[0] === "0" ? <Fragment>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.SUM_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.SUM_CRR_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item.SUM_DIFF}</td>
                          </Fragment> : <></>}

                        </tr>
                      ))}
                      {SumtableData.map((item2, i) => (
                        <tr className="tbsum" key={i}>
                          <td className="tbcenter" colSpan={3} style={{ width: "27.5rem" }}>{item2.COMPANY_NAME}</td>
                          {sQuarter[0] === "1" || sQuarter[0] === "0" ? <Fragment>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.Q1_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.Q1_CRR_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.Q1_DIFF}</td>
                          </Fragment> : <></>}
                          {sQuarter[0] === "2" || sQuarter[0] === "0" ? <Fragment>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.Q2_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.Q2_CRR_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.Q2_DIFF}</td>
                          </Fragment> : <></>}
                          {sQuarter[0] === "3" || sQuarter[0] === "0" ? <Fragment>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.Q3_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.Q3_CRR_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.Q3_DIFF}</td>
                          </Fragment> : <></>}
                          {sQuarter[0] === "4" || sQuarter[0] === "0" ? <Fragment>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.Q4_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.Q4_CRR_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.Q4_DIFF}</td>
                          </Fragment> : <></>}
                          {sQuarter[0] === "0" ? <Fragment>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.SUM_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.SUM_CRR_AMOUNT}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{item2.SUM_DIFF}</td>
                          </Fragment> : <></>}
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
