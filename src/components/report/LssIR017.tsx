import { useState, useEffect, useCallback } from "react";
import "@sweetalert2/theme-minimal/minimal.scss";
import { downloadFilePost, getCommon, LssIR017List, LssIR017ListWhere } from "../../data";
import { Col, FormLabel, Row } from "react-bootstrap";
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
import { Label } from "@mui/icons-material";
import ExportExcel from "./shared/ExportExcel";
import ExportExcelVarious from "./shared/ExportExcelVarious";


const currentYear = new Date().getFullYear();
const yearOptions = Array(10).fill("").map((x, i) => currentYear - i + 543);

export default function LssIR011() {
  const [common, setCommon] = useState<DataResponse>({
    COMPANIES: [],
    PREFIXES: [],
  });
  const [sType, setType] = useState<string[]>(["0"]);
  const [sQuarter, setSQuarter] = useState<string[]>(["1"]);
  const [sYear, setSYear] = useState<string[]>([yearOptions[0].toString()]);

  const [sTCrr, setTCrr] = useState<string[]>(["1"]);
  const [sOrder, setOrder] = useState<string[]>(["2"]);

  const [tableData, setTableData] = useState<
    {
      id: any;
      COMPANY_CODE: any;
      COMPANY_NAME: any;
      AMOUNT: any;
      PERCENT: any;
    }[]
  >([]);

  const [SumtableData, setSumTableData] = useState<
    {
      id: any;
      COMPANY_CODE: any;
      COMPANY_NAME: any;
      AMOUNT: any;
      PERCENT: any;
    }[]
  >([]);

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
  function PostGraph() {
    fnPost(sType[0], sYear[0], sQuarter[0], sTCrr[0], sOrder[0]);
  }
  const fnPost = useCallback(
    async (
      COMPANY_TYPE: string,
      YEAR: string,
      QUARTER: string,
      TYPE: string,
      SORT_AMOUNT: string
    ) => {
      var para = JSON.parse(
        `{"COMPANY_TYPE_CODE":"${COMPANY_TYPE}", "YEAR":"${YEAR}",  "QUARTER":"${QUARTER}",  "TYPE":"${TYPE}", "SORT_AMOUNT":"${SORT_AMOUNT}"  }`
      );
      //console.log(para);
      LssIR017ListWhere(para).then((data: any) => {
        let tmpSchema = [];
        let tmpSchemaSum = [];
        var tmpAM = 0;
        var tmpPC = 0;
        const sumAM = ((data as Array<{ AMOUNT: number }>) ?? []).reduce((p, c) => p + c.AMOUNT, 0)
        for (let i = 0; i < data.length; i++) {
          tmpSchema.push({
            id: i + 1,
            COMPANY_CODE: data[i].COMPANY_CODE,
            COMPANY_NAME: data[i].COMPANY_NAME,
            AMOUNT: parseFloat(data[i].AMOUNT == null ? 0 : data[i].AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
            PERCENT: sumAM == 0 ? 0 : 100 * (data[i].AMOUNT || 0) / sumAM //parseFloat(data[i].PERCENT == null ? 0 : data[i].PERCENT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          });
          //tmpAM += data[i].AMOUNT == null ? 0 : data[i].AMOUNT;
          //tmpPC = data[i].PERCENT == null ? 0 : data[i].PERCENT;
        } //loop i
        setTableData(tmpSchema);
        tmpSchemaSum.push({
          id: 1,
          COMPANY_CODE: "",
          COMPANY_NAME: "รวม",
          AMOUNT: sumAM.toLocaleString(undefined, { minimumFractionDigits: 2 }),
          PERCENT: 100.00//tmpPC.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        });
        setSumTableData(tmpSchemaSum);
      }); //getPayinList
    },
    []
  );

  const fnLoad = useCallback(async () => {
    LssIR017List().then((data: any) => {
      //console.log(data);
      let tmpSchema = [];
      let tmpSchemaSum = [];
      const sumAM = ((data as Array<{ AMOUNT: number }>) ?? []).reduce((p, c) => p + c.AMOUNT, 0)
      var tmpAM = 0;
      var tmpPC = 0;
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: i + 1,
          COMPANY_CODE: data[i].COMPANY_CODE,
          COMPANY_NAME: data[i].COMPANY_NAME,
          AMOUNT: parseFloat(data[i].AMOUNT == null ? 0 : data[i].AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          PERCENT: sumAM == 0 ? 0 : 100 * (data[i].AMOUNT || 0) / sumAM//parseFloat(data[i].PERCENT == null ? 0 : data[i].PERCENT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
        });
        //tmpAM += data[i].AMOUNT == null ? 0 : data[i].AMOUNT;
        //tmpPC = data[i].PERCENT == null ? 0 : data[i].PERCENT;
      } //loop i
      setTableData(tmpSchema);
      tmpSchemaSum.push({
        id: 1,
        COMPANY_CODE: "",
        COMPANY_NAME: "รวม",
        AMOUNT: sumAM.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        PERCENT: 100.00//tmpPC.toLocaleString(undefined, { minimumFractionDigits: 2, }),
      });
      setSumTableData(tmpSchemaSum);
    }); //getPayinList
  }, []);

  useEffect(() => {
    handleOnLoad();
    fnPost(sType[0], sYear[0], sQuarter[0], sTCrr[0], sOrder[0]);
    //fnLoad();
  }, []);

  // const handleDownloadExcel = () => {
  //   let record = {} as Record<string, any>;

  //   if (sOrder[0] != "0") {
  //     record["SORT_AMOUNT"] = sOrder[0];
  //   }
  //   if (sYear[0] != "0") {
  //     record["YEAR"] = sYear[0];
  //   }
  //   if (sType[0] != "0") {
  //     record["COMPANY_TYPE_CODE"] = sType[0];
  //   }
  //   if (sTCrr[0] != "0") {
  //     record["TYPE"] = sTCrr[0];
  //   }
  //   if (sQuarter[0] != "0") {
  //     console.log(sQuarter);
  //     record["QUARTER"] = sQuarter[0];
  //   }
  //   downloadFilePost(
  //     `/LSSIR017/LSSIR017Excel`,
  //     "LSS-IR-017_รายงานแสดงข้อมูลเงินสมทบโดยเรียงลำดับตามมูลค่าเงินสมทบ.xlsx",
  //     record
  //   );
  // }

  const header = [
    { header: 'ลำดับ', key: 'id', width: 5, style: { alignment: { horizontal: 'center' }, numFmt: '##0' } },
    { header: 'รหัส', key: 'COMPANY_CODE', width: 20, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },
    { header: 'บริษัท', key: 'COMPANY_NAME', width: 50, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'ข้อมูลเงินสมทบ', key: 'AMOUNT', width: 30, style: { alignment: { horizontal: 'right' }, numFmt: 'Text' } },
    { header: 'สัดส่วนของเงินสมทบต่อเงินสมทบรวมทุกบริษัท', key: 'PERCENT', width: 30, style: { alignment: { horizontal: 'right' }, numFmt: '#0.00' } },
  ];

  return (
    <>
      <div>
        <NavMenu />
        <div style={{ width: "100%", marginTop: 100 }}>
          <h5>
            <FaBars size={30} style={{ margin: "auto" }} />
            &nbsp;&nbsp;LSS-IR-017
            รายงานแสดงข้อมูลเงินสมทบโดยเรียงลำดับตามมูลค่าเงินสมทบ
          </h5>
          <div style={{ height: 400, width: "100%" }}>
            <Row style={{ marginBottom: 10, marginTop: 20 }}>
              <Col sm={6} lg={1} style={{ textAlign: "right" }}>ประเภทบริษัท </Col>
              <Col sm={6} lg={2}>
                <select
                  className="form-select"
                  name="COMPANY_TYPE_CODE"
                  id="COMPANY_TYPE_CODE"
                  onChange={(e) => {
                    setType([e.target.value]);
                  }}
                  value={sType[0]}
                >
                  <option value="0">ทุกประเภท</option>
                  <option value="LIFE">บริษัทประกันชีวิต</option>
                  <option value="NONLIFE">บริษัทประกันวินาศภัย</option>
                </select>

              </Col>

              <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                ปี
              </Col>
              <Col sm={6} lg={2}>
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
              <Col sm={6} lg={2}>
                <select
                  className="form-select"
                  name="QUARTER"
                  id="QUARTER"
                  onChange={(e) => {
                    setSQuarter([e.target.value]);
                  }}
                  value={sQuarter[0]}
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
                  IDPage={"LSS-IR-017"}
                  fileNames={"LSS-IR-017_รายงานแสดงข้อมูลเงินสมทบโดยเรียงลำดับตามมูลค่าเงินสมทบ.xlsx"}
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

            {/* condition #2 */}
            <Row style={{ marginBottom: 10, marginTop: 20 }}>
              <Col sm={6} lg={1} style={{ textAlign: "right" }}></Col>
              <Col sm={6} lg={2}>
              </Col>
              <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                <FormLabel className="label-right">ข้อมูลเงินสมทบตาม</FormLabel>
              </Col>
              <Col sm={6} lg={2}>
                <select
                  className="form-select"
                  name="YEAR"
                  id="YEAR"
                  onChange={(e) => {
                    setTCrr([e.target.value]);
                  }}
                  value={sTCrr[0]}
                >
                  <option value="0">เลือก</option>
                  <option value="1">แบบนำส่งเงินสมทบ</option>
                  <option value="2">การคำนวณเงินสมทบจากระบบ CRR</option>

                </select>
              </Col>
              <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                <FormLabel className="label-right">เรียงลำดับมูลค่า</FormLabel>
              </Col>
              <Col sm={6} lg={2}>
                <select
                  className="form-select"
                  name="QUARTER1"
                  id="QUARTER1"
                  onChange={(e) => {
                    setOrder([e.target.value]);
                  }}
                  value={sOrder[0]}
                >
                  {/* ปรับให้ดึงจาก table Lss_t_company_quarter */}
                  <option value="0">เลือก</option>
                  <option value="1"> น้อยไปหามาก</option>
                  <option value="2">มากไปหาน้อย</option>
                </select>
              </Col>
              <Col>
              </Col>
              <Col  >
              </Col>
            </Row>
            <Row>
              <Col>
                <div style={{ width: "98%" }}>
                  <table
                    id="table"
                    style={{
                      border: "1px solid black", background: "#ffffff", width: "98%"
                    }}
                  >
                    <thead>
                      <tr className="tbhead">
                        <th className="tbcenter" style={{ verticalAlign: "top", width: "3rem" }} >ลำดับ</th>
                        <th className="tbcenter" style={{ verticalAlign: "top", width: "4.5rem" }}  >รหัส</th>
                        <th style={{ verticalAlign: "top", textAlign: "center", width: "20rem" }} >บริษัท</th>

                        <th className="tbcenter" style={{ verticalAlign: "top", width: "10rem" }}  >
                          ข้อมูลเงินสมทบ
                        </th>
                        <th className="tbcenter" style={{ verticalAlign: "top", width: "10rem" }}  >
                          สัดส่วนของเงินสมทบต่อเงินสมทบรวมทุกบริษัท
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((item, i) => (
                        <tr className="" key={i}>
                          <td className="tbcenter" style={{ width: "3rem" }}>{item.id}</td>
                          <td className="tbcenter" style={{ width: "4.5rem" }}>{item.COMPANY_CODE}</td>
                          <td className="" style={{ width: "20rem" }}>{item.COMPANY_NAME}</td>
                          <td className="tbcentbnumter" style={{ width: "10rem" }}>{item.AMOUNT}</td>
                          <td className="tbcentbnumter" style={{ width: "10rem" }}>{parseFloat(item.PERCENT).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</td>
                        </tr>
                      ))}
                      {SumtableData.map((item2, i) => (
                        <tr className="tbsum" key={i}>
                          <td className="tbcenter" colSpan={3} style={{ width: "27.5rem" }}>{item2.COMPANY_NAME}</td>
                          <td className="tbcentbnumter" style={{ width: "10rem" }}>{item2.AMOUNT}</td>
                          <td className="tbcentbnumter" style={{ width: "10rem" }}>{parseFloat(item2.PERCENT).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</td>
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
