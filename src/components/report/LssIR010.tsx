import { useState, useEffect, useCallback } from "react";
import "@sweetalert2/theme-minimal/minimal.scss";
import { downloadFilePost, getCommon, Getdatayear, LssIR010List, LssIR010ListWhere } from "../../data";
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
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import ExportExcel from "./shared/ExportExcel";

const currentYear = new Date().getFullYear();
const yearOptions = Array(10).fill("").map((x, i) => currentYear - i + 543);

export default function LssIR010() {
  const [common, setCommon] = useState<DataResponse>({
    COMPANIES: [],
    PREFIXES: [],
  });
  const [sType, setSType] = useState<string[]>(["0"]);
  const [company, setCompany] = useState<string[]>(["0"]);
  const [sQuarter, setSQuarter] = useState<string[]>(["1"]);
  const [sYear, setSYear] = useState<string[]>(["0"]);
  const [seleteYear, setSeleteYear] = useState<any[]>(["0"]);

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
      Q1: any;
      Q2: any;
      Q3: any;
      Q4: any;
      SUMQ: any;
    }[]
  >([]);

  function PostGraph() {
    fnPost(sType[0], company[0], sYear[0]);
  }


  const columns: GridColDef[] = [
    { field: "id", headerName: "ลำดับ", width: 100, align: "center", headerAlign: "center", },
    { field: "COMPANY_CODE", headerName: "รหัส", width: 150, align: "left", headerAlign: "center", },
    { field: "COMPANY_NAME", headerName: "ชื่อบริษัท", width: 400, align: "left", headerAlign: "center", },
    { field: "Q1", headerName: "งวด Q1", width: 200, align: "right", headerAlign: "center" },
    { field: "Q2", headerName: "งวด Q2", width: 200, align: "right", headerAlign: "center" },
    { field: "Q3", headerName: "งวด Q3", width: 200, align: "right", headerAlign: "center" },
    { field: "Q4", headerName: "งวด Q4", width: 200, align: "right", headerAlign: "center" },
    { field: "SUMQ", headerName: "รวม", width: 200, align: "right", headerAlign: "center" },
  ];

  const fnPost = useCallback(
    async (
      COMPANY_TYPE: string,
      COMPANY_CODE: string,
      YEAR: string,
    ) => {
      Getdatayear().then((data: any) => {
        setSeleteYear(data);
      });
      var para = JSON.parse(
        `{"COMPANY_TYPE_CODE":"${COMPANY_TYPE}","COMPANY_CODE":"${COMPANY_CODE}", "YEAR":"${YEAR}"  }`
      );
      //console.log(para);
      LssIR010ListWhere(para).then((data: any) => {
        let tmpSchema = [];
        var tmpSQ1 = 0;
        var tmpSQ2 = 0;
        var tmpSQ3 = 0;
        var tmpSQ4 = 0;
        var tmpSSUM = 0;
        for (let i = 0; i < data.length; i++) {
          var tmpQ1 = data[i].Q1 == null ? 0 : data[i].Q1;
          var tmpQ2 = data[i].Q2 == null ? 0 : data[i].Q2;
          var tmpQ3 = data[i].Q3 == null ? 0 : data[i].Q3;
          var tmpQ4 = data[i].Q4 == null ? 0 : data[i].Q4;
          tmpSQ1 = tmpSQ1 + tmpQ1;
          tmpSQ2 = tmpSQ2 + tmpQ2;
          tmpSQ3 = tmpSQ3 + tmpQ3;
          tmpSQ4 = tmpSQ4 + tmpQ4;
          tmpSSUM = tmpSSUM + (tmpQ1 + tmpQ2 + tmpQ3 + tmpQ4);
          tmpSchema.push({
            id: i + 1,
            COMPANY_CODE: data[i].COMPANY_CODE,
            COMPANY_NAME: data[i].COMPANY_NAME,
            Q1: parseFloat(tmpQ1).toLocaleString(undefined, { minimumFractionDigits: 2, }),
            Q2: parseFloat(tmpQ2).toLocaleString(undefined, { minimumFractionDigits: 2, }),
            Q3: parseFloat(tmpQ3).toLocaleString(undefined, { minimumFractionDigits: 2, }),
            Q4: parseFloat(tmpQ4).toLocaleString(undefined, { minimumFractionDigits: 2, }),
            SUMQ: parseFloat(tmpQ1 + tmpQ2 + tmpQ3 + tmpQ4).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          });
        } //loop i
        tmpSchema.push({
          id: "",
          COMPANY_CODE: "",
          COMPANY_NAME: "รวม",
          Q1: tmpSQ1.toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q2: tmpSQ2.toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q3: tmpSQ3.toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q4: tmpSQ4.toLocaleString(undefined, { minimumFractionDigits: 2, }),
          SUMQ: tmpSSUM.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        });
        setTableData(tmpSchema);
      }); //getPayinList
    },
    []
  );

  const fnLoad = useCallback(async () => {
    LssIR010List().then((data: any) => {
      //console.log(data);
      let tmpSchema = [];
      var tmpSQ1 = 0;
      var tmpSQ2 = 0;
      var tmpSQ3 = 0;
      var tmpSQ4 = 0;
      var tmpSSUM = 0;
      for (let i = 0; i < data.length; i++) {
        var tmpQ1 = data[i].Q1 == null ? 0 : data[i].Q1;
        var tmpQ2 = data[i].Q2 == null ? 0 : data[i].Q2;
        var tmpQ3 = data[i].Q3 == null ? 0 : data[i].Q3;
        var tmpQ4 = data[i].Q4 == null ? 0 : data[i].Q4;
        tmpSQ1 = tmpSQ1 + tmpQ1;
        tmpSQ2 = tmpSQ2 + tmpQ2;
        tmpSQ3 = tmpSQ3 + tmpQ3;
        tmpSQ4 = tmpSQ4 + tmpQ4;
        tmpSSUM = tmpSSUM + (tmpQ1 + tmpQ2 + tmpQ3 + tmpQ4);
        tmpSchema.push({
          id: i + 1,
          COMPANY_CODE: data[i].COMPANY_CODE,
          COMPANY_NAME: data[i].NAME,
          Q1: parseFloat(tmpQ1).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q2: parseFloat(tmpQ2).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q3: parseFloat(tmpQ3).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          Q4: parseFloat(tmpQ4).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          SUMQ: parseFloat(tmpQ1 + tmpQ2 + tmpQ3 + tmpQ4).toLocaleString(undefined, { minimumFractionDigits: 2, }),
        });
      } //loop i
      tmpSchema.push({
        id: "",
        COMPANY_CODE: "",
        COMPANY_NAME: "รวม",
        Q1: tmpSQ1.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q2: tmpSQ2.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q3: tmpSQ3.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        Q4: tmpSQ4.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SUMQ: tmpSSUM.toLocaleString(undefined, { minimumFractionDigits: 2, }),
      });
      setTableData(tmpSchema);
    }); //getPayinList
  }, []);

  useEffect(() => {
    handleOnLoad();
    //fnLoad();
    fnPost(sType[0], company[0], sYear[0]);
  }, []);

  // const handleDownloadExcel = () => {
  //   let record = {} as Record<string, any>;
  //   if(sType[0] != "0")
  //     record["COMPANY_TYPE_CODE"] = sType[0];
  //   if(company[0] != "0")
  //     record["COMPANY_CODE"] = company[0];
    
  //   record["YEAR"] = sYear[0];
  //   // record["QUARTER"] = sQuarter[0];

  //   downloadFilePost(
  //     `/LSSIR010/LSSIR010Excel`,
  //     "LSS-IR-010_รายการนำส่งเงินสมทบ.xlsx",
  //     record
  //   );
  // };

  const header = [
    { header: 'ลำดับ', key: 'id', width: 5, style: { alignment: { horizontal: 'center' }, numFmt: '##0' } },
    { header: 'รหัส', key: 'COMPANY_CODE', width: 10, style: { alignment: { horizontal: 'center' }, numFmt: '##0' } },
    { header: 'ชื่อบริษัท', key: 'COMPANY_NAME', width: 50, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'งวด Q1', key: 'Q1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'งวด Q2', key: 'Q2', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'งวด Q3', key: 'Q3', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'งวด Q4', key: 'Q4', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: 'Text' } },
    { header: 'รวม', key: 'SUMQ', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
  ];
  
  return (
    <>
      <div>
        <NavMenu />
        <div style={{ width: "100%", marginTop: 100 }}>
          <h5>
            <FaBars size={30} style={{ margin: "auto" }} />
            &nbsp;&nbsp; LSS-IR-010
            รายงานสรุปการยื่นแบบนำส่งเงินสมทบผ่านทางระบบอิเล็กทรอนิกส์ของบริษัท
            ฯ
          </h5>
          <div style={{ height: 400, width: "100%" }}>
            <Row style={{ marginBottom: 10, marginTop: 20 }}>
              <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                ประเภท
              </Col>
              <Col sm={6} lg={2}>
                <select
                  className="form-select"
                  name="COMPANY_TYPE_CODE"
                  id="COMPANY_TYPE_CODE"
                  onChange={(e) => {
                    setSType([e.target.value]);
                    setCompany(["0"])
                  }}
                  value={sType[0]}
                >
                  <option value="0">ทั้งหมด</option>
                  <option value="LIFE">บริษัทประกันชีวิต</option>
                  <option value="NONLIFE">บริษัทประกันวินาศภัย</option>
                </select>
              </Col>
              <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                บริษัท
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
                  <option value="0">ทั้งหมด</option>
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
                  value={sYear}
                >
                  {/* <option value="0">ทั้งหมด</option>
                  {yearOptions.map((y, i) => <option key={i} value={y.toString()}>{y.toString()}</option>)} */}
                  <option value="0" selected>ทั้งหมด</option>
                  {
                    seleteYear.map(el => <option value={el} key={el}> {el} </option>)
                  }
                </select>
              </Col>
              {/* <Col sm={6} lg={1} style={{ textAlign: "right" }}>
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
                  <option value="0">ทั้งหมด</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </Col> */}
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
                <ExportExcel
                      data={tableData}
                      headers={header}
                      fileNames={"LSS-IR-010_รายการนำส่งเงินสมทบ.xlsx"}
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
          </div>
        </div>
      </div>
    </>
  );
}
