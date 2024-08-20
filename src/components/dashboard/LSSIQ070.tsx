import { useState, useEffect, useCallback } from "react";
import "@sweetalert2/theme-minimal/minimal.scss";
import { getCommon, LssIQ70List, LssIQ070ListWhere, downloadFilePost, Getdatayear } from "../../data";
import { Col, Row, Container, Card } from "react-bootstrap";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import Downloading from "@mui/icons-material/Downloading";
import Swal from "sweetalert2";
import NavMenu from "../fragments/NavMenu";
import { DataResponse } from "../../models/common/data-response.model";
import { useAppContext } from "../../providers/AppProvider";
import { CompanySelect } from "../../models/common/company-select.model";
import { PrefixSelect } from "../../models/common/prefix-select.model";
import { FaBars } from "react-icons/fa";
import { Chart } from "react-google-charts";
import { DataGrid, GridRowsProp, GridColDef, GridValueFormatterParams } from "@mui/x-data-grid";
import moment from "moment";
import ExportExcel from "../report/shared/ExportExcel";

const currentYear = new Date().getFullYear();
const yearOptions = Array(10).fill("").map((x, i) => currentYear - i + 543);

export default function LSSIQ070() {
  const [common, setCommon] = useState<DataResponse>({
    COMPANIES: [],
    PREFIXES: [],
  });
  const [sQuarter, setSQuarter] = useState<string[]>(["1"]);
  const [sYear, setSYear] = useState<string[]>(["0"]);
  const [sType, setSType] = useState<string[]>(["0"]);
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
      COMPANY_NAME: any;
      DUE_DATE: any;
      AMOUNT_CR: any;
      AMOUNT: any;
      STATUS_NAME: any;
      CREDIT: any;
      DEBTOR: any;
      RECEIPT_NO: any;
      QUARTERYEAR: any;
    }[]
  >([]);

  const fnPost = useCallback(
    async (
      YEAR: string,
      QUARTER: string,
      COMPANY_TYPE_CODE: string
    ) => {
      Getdatayear().then((data: any) => {
        setSeleteYear(data);
      });
      var para = JSON.parse(
        `{"YEAR":"${YEAR}",  "QUARTER":"${QUARTER}",  "COMPANY_TYPE_CODE":"${COMPANY_TYPE_CODE}"  }`
      );
      //console.log(para);
      LssIQ070ListWhere(para).then((data: any) => {
        let tmpSchema = [];
        for (let i = 0; i < data.length; i++) {
          tmpSchema.push({
            id: i + 1,
            COMPANY_NAME: data[i].COMPANY_NAME,
            DUE_DATE: data[i].DUE_DATE,
            AMOUNT_CR: parseFloat(data[i].AMOUNT_CR).toLocaleString(undefined, { minimumFractionDigits: 2, }),
            AMOUNT: parseFloat(data[i].AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
            STATUS_NAME: data[i].STATUS_NAME,
            CREDIT: parseFloat(data[i].CREDIT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
            DEBTOR: parseFloat(data[i].DEBTOR).toLocaleString(undefined, { minimumFractionDigits: 2, }),
            RECEIPT_NO: data[i].RECEIPT_NO,
            QUARTERYEAR: data[i].QUARTERYEAR,
          });
        } //loop i
        setTableData(tmpSchema);
      }); //getPayinList
    },
    []
  );

  const fnLoad = useCallback(async () => {
    LssIQ70List().then((data: any) => {
      //console.log(data);
      let tmpSchema = [];
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: i + 1,
          COMPANY_NAME: data[i].COMPANY_NAME,
          DUE_DATE: data[i].DUE_DATE,
          AMOUNT_CR: parseFloat(data[i].AMOUNT_CR).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          AMOUNT: parseFloat(data[i].AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          STATUS_NAME: data[i].STATUS_NAME,
          CREDIT: parseFloat(data[i].CREDIT).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          DEBTOR: parseFloat(data[i].DEBTOR).toLocaleString(undefined, { minimumFractionDigits: 2, }),
          RECEIPT_NO: data[i].RECEIPT_NO,
          QUARTERYEAR: data[i].QUARTERYEAR,
        });
      } //loop i
      setTableData(tmpSchema);
    }); //getPayinList
  }, []);

  function PostGraph() {
    fnPost(sYear[0], sQuarter[0], sType[0]);
  }

  useEffect(() => {
    handleOnLoad();
    //fnLoad();
    fnPost(sYear[0], sQuarter[0], sType[0]);
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ลำดับ", width: 100, align: "center", headerAlign: "center" },
    { field: "COMPANY_NAME", headerName: "บริษัท", width: 500, align: "left", headerAlign: "center" },
    {
      field: "DUE_DATE", headerName: "วันที่ครบกำหนด", width: 200, align: "center", headerAlign: "center",
      // valueFormatter: (params: GridValueFormatterParams<any>) => {
      //   var parts = params.value.split("-");
      //   var parts2 = parts[2].split(" ");
      //   var calyear = Number.parseInt(parts2[0]) + 543;
      //   var Sumdate = parts[0] + "/" + parts[1] + "/" + calyear;
      //   return Sumdate;
      // }
    },
    {
      field: "AMOUNT_CR", headerName: "ยอดตามแบบฯ", width: 150, align: "right", headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "AMOUNT", headerName: "ยอดตาม CRR", width: 150, align: "right", headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    { field: "STATUS_NAME", headerName: "สถานะรายการ", width: 150, align: "center", headerAlign: "center" },
    {
      field: "CREDIT", headerName: "เจ้าหนี้(ส่งเกิน)", width: 150, align: "right", headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "DEBTOR", headerName: "ลูกหนี้(ส่งขาด)", width: 150, align: "right", headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    { field: "RECEIPT_NO", headerName: "เลขที่ใบเสร็จ", width: 250, align: "left", headerAlign: "center" },
    { field: "QUARTERYEAR", headerName: "ไตรมาสที่บริษัทยื่นแบบนำเงินสมทบ", width: 250, align: "center", headerAlign: "center" },
  ];

  // const handleDownloadExcel = () => {
  //   let record = {} as Record<string, any>;
  //   // if(company != "0"){
  //   //   record["COMPANY_CODE"] = company;
  //   // }
  //   if(sYear[0] != "0"){
  //     record["YEAR"] = sYear[0];
  //   }
  //   if(sType[0] != "0"){
  //     record["COMPANY_TYPE_CODE"] = sType[0];
  //   }
  //   if(sQuarter[0] != "0"){
  //     console.log(sQuarter);
  //     record["QUARTER"] = sQuarter[0];
  //   }
  //   downloadFilePost(
  //     `/LSSIQ070/LSSIQ070Excel`,
  //     "LSS-IQ-070_ทะเบียนลูกหนี้เจ้าหนี้รายตัว.xlsx",
  //     record
  //   );
  // };

  const header = [
    { header: 'ลำดับ', key: 'id', width: 5, style: { alignment: { horizontal: 'center' }, numFmt: '##0' } },
    { header: 'บริษัท', key: 'COMPANY_NAME', width: 50, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'วันครบกำหนด', key: 'DUE_DATE', width: 20, style: { alignment: { horizontal: 'center' }, numFmt: 'Date' } },
    { header: 'ยอดตามแบบฯ', key: 'AMOUNT_CR', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'ยอดตาม CRR', key: 'AMOUNT', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'สถานะรายการ', key: 'STATUS_NAME', width: 20, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },
    { header: 'เจ้าหนี้(ส่งเกิน)', key: 'CREDIT', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'ลูกหนี้(ส่งขาด)', key: 'DEBTOR', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'เลขที่ใบเสร็จ', key: 'RECEIPT_NO', width: 30, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'ไตรมาสที่บริษัทยื่นแบบนำเงินสมทบ', key: 'QUARTERYEAR', width: 30, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },
  ];

  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <NavMenu />
            <Card style={{ marginTop: "9rem" }}>
              <Card.Header>
                LSS-IQ-070 ทะเบียนลูกหนี้เจ้าหนี้รายตัว
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
                      value={sType}
                    >
                      <option value="0">ทั้งหมด</option>
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
                  <Col sm={6} lg={2}>
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
                      <option value="0">ทั้งหมด</option>
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
                      textAlign: "left",
                    }}
                  >
                    <ExportExcel
                      data={tableData}
                      headers={header}
                      fileNames={"LSS-IQ-070_ทะเบียนลูกหนี้เจ้าหนี้รายตัว.xlsx"}
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
                  <Col
                    md={1}
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
    </>
  );
}
