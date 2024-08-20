import {ChangeEvent, useState, useEffect, useCallback, Fragment } from "react";
import "@sweetalert2/theme-minimal/minimal.scss";
import { downloadFilePost, getCommon, LssIR020List, LssIR020ListWhere } from "../../data";
import { Col, Row ,Form} from "react-bootstrap";
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
import moment, { Moment } from "moment";
import { toThaiDateString } from "../../functions/Date";
import { DatePicker } from "antd";
import ExportExcelVarious from "./shared/ExportExcelVarious";

const currentYear = new Date().getFullYear();
const yearOptions = Array(10).fill("").map((x, i) => currentYear - i + 543);

const styles = {
  datpicker: {
    width: "100%",
    height: "100%",
    verticalAlign: "middle",
  },
};

export default function LssIR011() {
  const [code, setCode] = useState<string>("");
  const [movement, setMovement] = useState<number>(0);
  const [common, setCommon] = useState<DataResponse>({
    COMPANIES: [],
    PREFIXES: [],
  });
  const [sType, setType] = useState<string[]>(["0"]);
  const [company, setCompany] = useState<string[]>(["0"]);
  //const [sQuarter, setSQuarter] = useState<string[]>(["0"]);
  const [sYear, setSYear] = useState<string[]>([yearOptions[0].toString()]);
  const [date, setDate] = useState<Moment | null>(null)
  

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
      SUM_DEPT_AMOUNT: any;
      SUM_CREDIT_AMOUNT: any;
      SUM_DIFF_AMOUNT: any;
    }[]
  >([]);

  const [SumtableData, setSumTableData] = useState<
    {
      id: any;
      COMPANY_NAME: any;
      DEPT_AMOUNT: any;
      CREDIT_AMOUNT: any;
      DIFF_AMOUNT: any;
    }[]
  >([]);

  const incrementCount = (data:any) => {
    // Update state with incremented value
    setMovement(movement + data);
  };


  function PostGraph() {
    fnPost(sType[0], company[0], sYear[0],code);
  }
  const fnPost = useCallback(
    async (
      COMPANY_TYPE: string,
      COMPANY_CODE: string,
      YEAR: string,
      CODE: string,
    ) => {
      
      if (CODE ===undefined) CODE = "";
      var para = JSON.parse(
        `{"COMPANY_TYPE_CODE":"${COMPANY_TYPE}","COMPANY_CODE":"${COMPANY_CODE}","YEAR":"${YEAR}","CODE":"${CODE}" }`
      );
      //console.log(para);
      LssIR020ListWhere(para).then((data: any) => {
        console.log(data);
        setTableData(data);
      }); //getPayinList
    },
    []
  );

  const fnLoad = useCallback(async () => {
    LssIR020List().then((data: any) => {
      setTableData(data);
    }); //getPayinList
  }, []);

  useEffect(() => {
    handleOnLoad();
    fnPost(sType[0], company[0], sYear[0],code[0]);
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
  //     `/LSSIR020/LSSIR020Excel`,
  //     "LSS-IR-020_รายงานสรุปลูกหนี้/เจ้าหนี้รายตัว_เงินสมทบ.xlsx",
  //     record
  //   );
  // }
  						

  const header = [
    { header: 'ลำดับ', key: 'COMPANY_CODE', width: 5, style: { alignment: { horizontal: 'center' }, numFmt: '#' } },
    { header: 'เลขที่เอกสาร', key: 'COMPANY_CODE', width: 20, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },
    { header: 'วันที่เอกสาร', key: 'COMPANY_NAME', width: 20, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },
    { header: 'รายละเอียด', key: 'col1', width: 40, style: { alignment: { horizontal: 'center' }, numFmt: '#,##0.00' } },
    { header: 'ลูกหนี้ (ส่งขาด)', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'เจ้าหนี้(ส่งเกิน)', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'ส่งเกิน (ส่งขาด) สุทธิ', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
  ];

  return (
    <>
      <div>
        <NavMenu />
        <div style={{ width: "100%", marginTop: 100 }}>
          <h5>
            <FaBars size={30} style={{ margin: "auto" }} />
            &nbsp;&nbsp; LSS-IR-020 รายงานสรุปลูกหนี้/เจ้าหนี้รายตัว เงินสมทบ
          </h5>
          <div style={{ height: 400, width: "100%" }}>
            <Row style={{ marginBottom: 10, marginTop: 20,  }}>
              <Col sm={6} lg={1} style={{ textAlign: "right" }}>ประเภทบริษัท</Col>
              <Col sm={6} lg={1}>
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
              <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                เลขที่เอกสาร
              </Col>              
              <Col sm={6} lg={1}>
                <Form.Control
                            type="text"
                            value={code}
                            onInput={(e: ChangeEvent<HTMLInputElement>) => {
                              setCode(() => e.target.value);
                            }}
                          />
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
                  IDPage={"LSS-IR-020"}
                  fileNames={"LSS-IR-020_รายงานสรุปลูกหนี้/เจ้าหนี้รายตัว_เงินสมทบ.xlsx"}
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
                <div style={{ width: "90.5rem" }}>
                  <table
                    style={{
                      border: "1px solid black", background: "#ffffff", width: "90.5rem"
                    }}
                  >
                    <thead>
                      <tr className="tbhead">
                        <th className="tbcenter" style={{ verticalAlign: "top", width: "3rem" }} >ลำดับ</th>
                        <th className="tbcenter" style={{ verticalAlign: "top", width: "10rem" }}  >เลขที่เอกสาร</th>
                        <th style={{ verticalAlign: "top", textAlign: "center", width: "8rem" }} >วันที่เอกสาร</th>
                        <th style={{ verticalAlign: "top", textAlign: "center", width: "15rem" }} >รายละเอียด</th>
                        <th className="tbcenter" style={{ verticalAlign: "top", width: "10rem" }}  >
                          ลูกหนี้ (ส่งขาด)

                        </th>
                        <th className="tbcenter" style={{ verticalAlign: "top", width: "10rem" }}  >
                          เจ้าหนี้(ส่งเกิน)
                        </th>
                        <th className="tbcenter" style={{ verticalAlign: "top", width: "10rem" }}  >
                          ส่งเกิน (ส่งขาด) สุทธิ
                        </th>
                        {/* <th className="tbcenter" style={{ verticalAlign: "top", width: "50rem" }}  >
                          เลขที่ใบเสร็จ(วันที่)
                        </th>                         */}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((group, i) => (
                        <Fragment key={i}>
                          <tr style={{ backgroundColor: (`#e6f1e8`) }}>
                            <td className="pt-0 px-1" colSpan={7}>{group.COMPANY_CODE}&nbsp;&nbsp;{group.COMPANY_NAME}</td>
                          </tr>
 
                          {(group.ITEMS || []).map((item, j) => (
                            <Fragment key={j}>
                              <tr className="" key={i}>
                                <td className="tbcenter" style={{ width: "3rem" }}>{j + 1}</td>
                                <td className="tbcenter" style={{ width: "10rem" }}>{item.CODE}</td>
                                <td className="tbcenter" style={{ width: "8rem" }}>{item.DATE ? toThaiDateString(new Date(item.DATE), "DD/MM/YYYY") : ""}</td>
                                <td className="tbcenter" style={{ width: "15rem" }}>{item.DESCRIPTION}</td>
                                <td className="tbcentbnumter" style={{ width: "10rem" }}>{Number(item.DEPT_AMOUNT).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="tbcentbnumter" style={{ width: "10rem" }}>{Number(item.CREDIT_AMOUNT).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="tbcentbnumter" style={{ width: "10rem" }}>{Number(item.DIFF_AMOUNT).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                {/* <td className="tbcenter" style={{ width: "10rem" }}>
                                   {item.RECEIPT_NO}</td> */}
                         

                              </tr>
                            </Fragment>
                          ))}
                          <tr className="tbsum" >
                            <td className="tbcenter" colSpan={4} style={{ width: "60.5rem", textAlign: "end", paddingRight: "1rem" }}>รวม</td>
                            <td className="tbcentbnumter" style={{ width: "10rem" }}>{Number(group.SUM_DEPT_AMOUNT).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="tbcentbnumter" style={{ width: "10rem" }}>{Number(group.SUM_CREDIT_AMOUNT).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="tbcentbnumter" style={{ width: "10rem" }}>
                              {Number(group.SUM_DIFF_AMOUNT).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}                        
      
                            </td>
                            {/* <td className="tbcentbnumter" style={{ width: "10rem" }}>
                                                       
      
                            </td>                             */}
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
