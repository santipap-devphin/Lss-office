import { useState, useEffect, useCallback, Fragment } from "react";
import "@sweetalert2/theme-minimal/minimal.scss";
import { downloadFilePost, getCommon, LssIR021List, LssIR021ListWhere } from "../../data";
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
import moment from "moment";
import { toThaiDateString } from "../../functions/Date";
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
  const [sYear, setSYear] = useState<string[]>([yearOptions[0].toString()]);

  useEffect(() => {
    handleOnLoad();
  }, []);

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
      COMPANY_CODE: any;
      COMPANY_NAME: any;
      ITEMS: any[] | null;
      SUM_CREDIT_AMOUNT1: any;
      SUM_DEPT_AMOUNT1: any;
      SUM_DIFF_AMOUNT1: any;
      SUM_CREDIT_AMOUNT2: any;
      SUM_DEPT_AMOUNT2: any;
      SUM_DIFF_AMOUNT2: any;
      SUM_CREDIT_AMOUNT3: any;
      SUM_DEPT_AMOUNT3: any;
      SUM_DIFF_AMOUNT3: any;
      SUM_CREDIT_AMOUNT4: any;
      SUM_DEPT_AMOUNT4: any;
      SUM_DIFF_AMOUNT4: any;
      SUM_CREDIT_TOTAL: any;
      SUM_DEPT_TOTAL: any;
      SUM_DIFF_TOTAL: any;
      SUM_TOTAL: any;
      SUM_DIFF_AMOUNT: any;
    }[]
  >([]);

  const [SumtableData, setSumTableData] = useState<
    {
      id: any;
      COMPANY_NAME: any;
      CREDIT_AMOUNT1: any;
      DEPT_AMOUNT1: any;
      CREDIT_AMOUNT2: any;
      DEPT_AMOUNT2: any;
      CREDIT_AMOUNT3: any;
      DEPT_AMOUNT3: any;
      CREDIT_AMOUNT4: any;
      DEPT_AMOUNT4: any;
      CREDIT_TOTAL: any;
      DEPT_TOTAL: any;
      TOTAL: any;
    }[]
  >([]);

  function PostGraph() {
    fnPost(sType[0], company[0], sYear[0]);
  }
  const fnPost = useCallback(
    async (
      COMPANY_TYPE: string,
      COMPANY_CODE: string,
      YEAR: string
    ) => {
      var para = JSON.parse(
        `{"COMPANY_TYPE_CODE":"${COMPANY_TYPE}","COMPANY_CODE":"${COMPANY_CODE}", "YEAR":"${YEAR}" }`
      );
      //console.log(para);
      LssIR021ListWhere(para).then((data: any) => {
        console.log(data);
        setTableData(data);
      }); //getPayinList
    },
    []
  );

  const fnLoad = () => {
    LssIR021List().then((data: any) => {
      setTableData(data);
    });
  }

  useEffect(() => {
    handleOnLoad();
    fnPost(sType[0], company[0], sYear[0]);
    //fnLoad();
  }, []);

  // const handleDownloadExcel = () => {
  //   let record = {} as Record<string, any>;
  //   if(company[0] != "0"){
  //     record["COMPANY_CODE"] = company[0];
  //   }
  //   // if(sOrder[0] != "0"){
  //   //   record["SORT_AMOUNT"] = sOrder[0];
  //   // }
  //   if(sYear[0] != "0"){
  //     record["YEAR"] = sYear[0];
  //   }
  //   if(sType[0] != "0"){
  //     record["COMPANY_TYPE_CODE"] = sType[0];
  //   }
  //   // if(sTCrr[0] != "0"){
  //   //   record["TYPE"] = sTCrr[0];
  //   // }
  //   // if(sQuarter[0] != "0"){
  //   //   console.log(sQuarter);
  //   //   record["QUARTER"] = sQuarter[0];
  //   // }
  //   downloadFilePost(
  //     `/LSSIR021/LSSIR021Excel`,
  //     "LSS-IR-021_รายงานทะเบียนลูกหนี้/เจ้าหนี้รายตัว_เงินสมทบ.xlsx",
  //     record
  //   );
  // }

  const header = [
    { header: '', key: 'COMPANY_CODE', width: 5, style: { alignment: { horizontal: 'center' }, numFmt: '#' } },
    { header: '', key: 'COMPANY_NAME', width: 50, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
  ];
  
  return (
    <>
      <div>
        <NavMenu />
        <div style={{ width: "100%", marginTop: 100 }}>
          <h5>
            <FaBars size={30} style={{ margin: "auto" }} />
            &nbsp;&nbsp; LSS-IR-021 รายงานทะเบียนลูกหนี้/เจ้าหนี้รายตัว เงินสมทบ
          </h5>
          <div style={{ height: 400, width: "100%" }}>
            <Row style={{ marginBottom: 10, marginTop: 20 }}>
              <Col sm={6} lg={2} style={{ textAlign: "right" }}>ประเภทบริษัท</Col>
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
                  onChange={(e) => {
                    setCompany([e.target.value]);
                  }}
                  value={company[0]}
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
                  <option value="0">เลือกปี</option>
                  {yearOptions.map((y, i) => <option key={i} value={y.toString()}>{y.toString()}</option>)}
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
                  year={sYear[0]}
                  IDPage={"LSS-IR-021"}
                  fileNames={"LSS-IR-021_รายงานทะเบียนลูกหนี้/เจ้าหนี้รายตัว_เงินสมทบ.xlsx"}
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
                <div style={{ width: "115.5rem" }}>
                  <table
                    style={{
                      border: "1px solid black", background: "#ffffff", width: "115.5rem"
                    }}
                  >
                    <thead>
                      <tr className="tbhead">
                        <th rowSpan={2} className="tbcenter" style={{ verticalAlign: "top", width: "3rem" }} >ลำดับ</th>
                        <th rowSpan={2} className="tbcenter" style={{ verticalAlign: "top", width: "3rem" }} >รายละเอียด</th>
                        <th colSpan={2} style={{ verticalAlign: "top", textAlign: "center", width: "16rem" }} >ไตรมาส 1/{sYear}</th>
                        <th colSpan={2} style={{ verticalAlign: "top", textAlign: "center", width: "16rem" }} >ไตรมาส 2/{sYear}</th>
                        <th colSpan={2} style={{ verticalAlign: "top", textAlign: "center", width: "16rem" }} >ไตรมาส 3/{sYear}</th>
                        <th colSpan={2} style={{ verticalAlign: "top", textAlign: "center", width: "16rem" }} >ไตรมาส 4/{sYear}</th>
                        <th colSpan={2} style={{ verticalAlign: "top", textAlign: "center", width: "16rem" }} >รวม</th>
                        <th rowSpan={2} style={{ verticalAlign: "top", textAlign: "center", width: "8rem" }} >เจ้าหนี้/ลูกหนี้</th>
                      </tr>
                      <tr className="tbhead">
                        <th className="tbcenter" style={{ verticalAlign: "top", width: "8rem" }}> ลูกหนี้</th>
                        <th className="tbcenter" style={{ verticalAlign: "top", width: "8rem" }}>เจ้าหนี้ </th>

                        <th className="tbcenter" style={{ verticalAlign: "top", width: "8rem" }}> ลูกหนี้</th>
                        <th className="tbcenter" style={{ verticalAlign: "top", width: "8rem" }}>เจ้าหนี้ </th>

                        <th className="tbcenter" style={{ verticalAlign: "top", width: "8rem" }}> ลูกหนี้</th>
                        <th className="tbcenter" style={{ verticalAlign: "top", width: "8rem" }}>เจ้าหนี้ </th>

                        <th className="tbcenter" style={{ verticalAlign: "top", width: "8rem" }}> ลูกหนี้</th>
                        <th className="tbcenter" style={{ verticalAlign: "top", width: "8rem" }}>เจ้าหนี้ </th>

                        <th className="tbcenter" style={{ verticalAlign: "top", width: "8rem" }}> ลูกหนี้</th>
                        <th className="tbcenter" style={{ verticalAlign: "top", width: "8rem" }}>เจ้าหนี้ </th>

                      </tr>
                    </thead>
                    <tbody>

                      {tableData.map((group, i) => (
                        <Fragment key={i}>
                          <tr style={{ backgroundColor: (`#e6f1e8`) }}>
                            <td className="pt-0 px-1" colSpan={13}>{group.COMPANY_CODE}&nbsp;&nbsp;{group.COMPANY_NAME}</td>
                          </tr>
                          {(group.ITEMS || []).map((item, j) => (
                            <Fragment key={j}>
                              <tr className="" key={i}>
                                <td className="tbcenter" style={{ width: "3rem" }}>{j + 1}</td>
                                <td className="" style={{ width: "10rem" }}>{item.DESCRIPTION}</td>
                                <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(item.CREDIT_AMOUNT1).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(item.DEPT_AMOUNT1).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(item.CREDIT_AMOUNT2).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(item.DEPT_AMOUNT2).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(item.CREDIT_AMOUNT3).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(item.DEPT_AMOUNT3).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(item.CREDIT_AMOUNT4).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(item.DEPT_AMOUNT4).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(item.CREDIT_TOTAL).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(item.DEPT_TOTAL).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(item.TOTAL).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              </tr>
                            </Fragment>
                          ))}
                          <tr className="tbsum" >
                            <td className="tbcenter" colSpan={2} style={{ width: "60.5rem", textAlign: "end", paddingRight: "1rem" }}>รวม</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(group.SUM_CREDIT_AMOUNT1).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(group.SUM_DEPT_AMOUNT1).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(group.SUM_CREDIT_AMOUNT2).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(group.SUM_DEPT_AMOUNT2).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(group.SUM_CREDIT_AMOUNT3).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(group.SUM_DEPT_AMOUNT3).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(group.SUM_CREDIT_AMOUNT4).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(group.SUM_DEPT_AMOUNT4).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(group.SUM_CREDIT_TOTAL).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(group.SUM_DEPT_TOTAL).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{Number(group.SUM_TOTAL).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          </tr>
                        </Fragment>
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
