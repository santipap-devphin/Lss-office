import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Col, Row, Card, Container } from "react-bootstrap";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import Swal from "sweetalert2";
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { getCompareCrrWhere, getCommon, getCompareCrrAll, downloadFilePost, Getdatayear } from "../../data";
import moment from "moment";
import NavMenu from "../fragments/NavMenu";
import "./LssEt030CompareCrr.scss";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import Downloading from "@mui/icons-material/Downloading";
import { DataResponse } from "../../models/common/data-response.model";
import { CompanySelect } from "../../models/common/company-select.model";
import { PrefixSelect } from "../../models/common/prefix-select.model";
import { FaBars } from "react-icons/fa";
import { stringify } from "querystring";
import ExportExcel from "../report/shared/ExportExcel";

const currentYear = new Date().getFullYear();
const yearOptions = Array(10).fill("").map((x, i) => currentYear - i + 543);

export default function CompareCrr() {
  const [common, setCommon] = useState<DataResponse>({
    COMPANIES: [],
    PREFIXES: [],
  });
  const [sType, setSType] = useState<string[]>(["0"]);
  const [company, setCompany] = useState<string[]>(["0"]);
  const [sQuarter, setSQuarter] = useState<string[]>(["1"]);
  const [sYear, setSYear] = useState<string[]>(["0"]);
  const [seleteYear, setSeleteYear] = useState<any[]>([0]);

  const oPenfile = React.useCallback(
    (type: any) => (data: any) => {
      let msg = "ดำเนินการ";
      Swal.fire(msg, "ID : " + type.id, "warning");
    },
    []
  );

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

  function PostSearch() {
    fnPost(sType[0], company[0], sYear[0], sQuarter[0]);
  }
  const columns: GridColDef[] = [
    { field: "CY_NAME", headerName: "บริษัท", minWidth: 400, align: "left", headerAlign: "center" },
    {
      field: "col1",
      headerName: "เลขที่อ้างอิง",
      minWidth: 170,
      align: "left", 
      headerAlign: "center",
    },
    {
      field: "col2",
      headerName: "วันที่ประมวลผล",
      minWidth: 170,
      align: "center", 
      headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        var parts = params.value.split("/");
        var year = parseFloat(parts[2]) + 543; 
        var strDate = parts[0] + "/" + parts[1] + "/" + String(year);
        var mydate = new Date(parts[2], parts[1], parts[0]);
        return strDate;
      },
    },
    {
      field: "col3",
      headerName: "รวมนำส่งเงินสมทบ",
      minWidth: 170,
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
      field: "col4",
      headerName: "ข้อมูล CRR",
      minWidth: 170,
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
      field: "TYPE",
      headerName: "ชำระขาด/เกิน",
      minWidth: 170,
      align: "center", 
      headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "col5",
      headerName: "จำนวนเงิน(ขาด/เกิน)",
      minWidth: 270,
      align: "right",
      headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },

    { field: "col6", headerName: "สถานะ", minWidth: 150, align: "center", headerAlign: "center" },
    // {
    //   field: "col7",
    //   headerName: "ฟอร์มส่ง",
    //   minWidth: 200,
    //   renderCell: (params2: any) => {
    //     let _button = "";
    //     let _status = params2.row.col6;
    //     let _variant = "contained";
    //     _button = _status;
    //     if (_status === "รอการนำส่ง") {
    //       _button = _status;
    //     } else if (_status === "รอยกไป") {
    //       _button = _status;
    //     } else {
    //       _button = _status;
    //       _variant = "text";
    //     }
    //     return (
    //       <>
    //         <Button
    //           variant={_variant as "contained" | "text" | "outlined"}
    //           startIcon={<CheckCircleOutline />}
    //           onClick={oPenfile(params2)}
    //         >
    //           {_button}
    //         </Button>
    //       </>
    //     );
    //   },
    // },
  ];

  const [tableData, setTableData] = useState<
    {
      id: any;
      col1: any;
      col2: string;
      col3: any;
      col4: any;
      col5: any;
      col6: any;
      CY_NAME: any;
      TYPE: any;
    }[]
  >([]);

  const fnPost = useCallback(async (COMPANY_TYPE: string, COMPANY_CODE: string, YEAR: string, QUARTER: string) => {
    Getdatayear().then((data: any) => {
      setSeleteYear(data);
    });
    var para = JSON.parse(
      `{"COMPANY_TYPE_CODE":"${COMPANY_TYPE}", "COMPANY_CODE":"${COMPANY_CODE}", "YEAR":"${YEAR}",  "QUARTER":"${QUARTER}"  }`
    );
    getCompareCrrWhere(para).then((data: any) => {
      let tmpSchema = [];
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: data[i].CODE,
          col1: data[i].CODE,
          col2: moment(data[i].DATE).format("DD/MM/YYYY"),
          col3: data[i].SUM_DELIVER_AMOUNT,
          col4: data[i].SUM_CRR_AMOUNT,
          col5: data[i].DIFF_AMOUNT,
          col6: data[i].STATUS,
          CY_NAME: data[i].CY_NAME,
          TYPE: data[i].TYPE,
        });
      }
      setTableData(tmpSchema);
    });
  }, []);


  const fnLoad = useCallback(async () => {
    getCompareCrrAll().then((data: any) => {
      let tmpSchema = [];
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: data[i].CODE,
          col1: data[i].CODE,
          col2: moment(data[i].DATE).format("DD/MM/YYYY"),
          col3: data[i].SUM_DELIVER_AMOUNT,
          col4: data[i].SUM_CRR_AMOUNT,
          col5: data[i].DIFF_AMOUNT,
          col6: data[i].STATUS,
          CY_NAME: data[i].CY_NAME,
          TYPE: data[i].TYPE,
        });
      }
      setTableData(tmpSchema);
    });
  }, []);

  useEffect(() => {
    handleOnLoad();
    //fnLoad();
    fnPost(sType[0], company[0], sYear[0], sQuarter[0]);
  }, []);

  // const handleDownloadExcel = () => {
  //   let record = {} as Record<string, any>;
  //   if(company[0] != "0"){
  //     record["COMPANY_CODE"] = company[0];
  //   }
  //   if(sYear[0] != "0"){
  //     record["YEAR"] = sYear[0];
  //   }
  //   if(sType[0] != "0"){
  //     record["COMPANY_TYPE_CODE"] = sType[0];
  //   }
  //   if(sQuarter[0] != "0"){
  //     record["QUARTER"] = sQuarter[0];
  //   }
  //   downloadFilePost(
  //     `/CompareCrr/LSSIQ050Excel`,
  //     "LSS-IQ-050_ผลการเปรียบเทียบการนำส่งเงินสมทบกับข้อมูล_CRR.xlsx",
  //     record
  //   );
  // };

  const header = [
    { header: 'บริษัท', key: 'CY_NAME', width: 50, style: {alignment: { horizontal: 'left'},numFmt:'Text'} },
    { header: 'เลขที่อ้างอิง', key: 'col1', width: 20, style: {alignment: { horizontal: 'left'},numFmt:'Text'}},
    { header: 'วันที่ประมวลผล', key: 'col2', width: 20, style: {alignment: { horizontal: 'center'},numFmt:'Date'} },
    { header: 'รวมนำส่งเงินสมทบ', key: 'col3', width: 20, style: {alignment: { horizontal: 'right'},numFmt:'#,##0.00'} },
    { header: 'ข้อมูล CRR', key: 'col4', width: 20, style: {alignment: { horizontal: 'right'},numFmt:'#,##0.00'} },
    { header: 'ชำระขาด/เกิน', key: 'TYPE', width: 20, style: {alignment: { horizontal: 'center'},numFmt:'Text'} },
    { header: 'จำนวนเงิน(ขาด/เกิน)', key: 'col5', width: 20, style: {alignment: { horizontal: 'right'},numFmt:'#,##0.00'} },
    { header: 'สถานะ', key: 'col6', width: 20, style: {alignment: { horizontal: 'center'},numFmt:'Text'} },
  ];

  return (
    <Container fluid>
      <Row>
        <Col>
          <NavMenu />
          <Card style={{ marginTop: "9rem" }}>
            <Card.Header>
              LSS-IQ-050 ผลการเปรียบเทียบการนำส่งเงินสมทบกับข้อมูล CRR
            </Card.Header>
            <Card.Body>
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
                    }}
                    value={sType[0]}
                  >
                    <option value="0">ทุกประเภท</option>
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
                      setSQuarter([e.target.value]);
                    }}
                    value={sQuarter[0]}
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
                    onClick={() => PostSearch()}
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
                        fileNames={"LSS-IQ-050_ผลการเปรียบเทียบการนำส่งเงินสมทบกับข้อมูล_CRR.xlsx"}
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
              <div style={{ height: 500, width: "100%" }}>
                <DataGrid rows={tableData} columns={columns} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
