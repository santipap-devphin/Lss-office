import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { getCommon, LSSIP020Dashboard, getDashboardData, downloadFilePost } from "../../data";
import { Card, Col, Row, Container } from "react-bootstrap";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import Downloading from "@mui/icons-material/Downloading";
import NavMenu from "../fragments/NavMenu";
import { DataResponse } from "../../models/common/data-response.model";
import { CompanySelect } from "../../models/common/company-select.model";
import { PrefixSelect } from "../../models/common/prefix-select.model";
import { Chart } from "react-google-charts";
import "./Dashboard.tsx";
import "@sweetalert2/theme-minimal/minimal.scss";
import Spinner from "../fragments/Spinner";
import { DataGrid, GridColDef, GridRenderCellParams, GridValueFormatterParams } from "@mui/x-data-grid";
import { getLocalStorage } from "../../functions/LocalStorage";
import ExportExcel from "../report/shared/ExportExcel";

const currentYear = new Date().getFullYear();
const yearOptions = Array(3).fill("").map((x, i) => currentYear - i);

export default function Dashboard() {
  //const [companies, setCompanies] = useState<Option[]>([]);
  //const [sType, setType] = useState<string[]>(["0"]);
  const [companyType, setCompanyType] = useState<string>("0");
  const [company, setCompany] = useState<string>("0");
  const [year, setYear] = useState<string>((yearOptions[0] + 543).toString());
  const [quarter, setQuarter] = useState<string>("1");
  const [stateCode, setStateCode] = useState("");
  const [EX, setEX1] = useState<any>("EX1");
  //const [paymentStatus, setPaymentStatus] = useState("")
  const [chartData, setChartData] = useState<any[][]>([
    ["สถานะ", "จำนวน"],
  ]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [tableData, setTableData] = useState<any[]>([])
  const [isBusy, setIsBusy] = useState<boolean>(true);
  //const [sQuarter, setSQuarter] = useState<string[]>(["0"]);
  //const [sYear, setSYear] = useState<string[]>(["0"]);
  const [common, setCommon] = useState<DataResponse>({
    COMPANIES: [],
    PREFIXES: [],
  });

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ลำดับ",
      minWidth: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "DOCUMENT_HEAD_CODE",
      headerName: "เลขที่นำส่งเงินสมทบ",
      minWidth: 170,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "CY_NAME",
      headerName: "ชื่อบริษัท",
      minWidth: 450,
      align: "left",
      headerAlign: "center",
    },
    // {
    //   field: "DOCTYPE_NAME",
    //   headerName: "ประเภท",
    //   minWidth: 60,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "QUARTER",
      headerName: "ไตรมาส",
      minWidth: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "YEAR",
      headerName: "ปี",
      minWidth: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "STATE_NAME",
      headerName: "สถานะ",
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "AMOUNT",
      headerName: "จำนวนเงิน",
      minWidth: 190,
      align: "right",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<any, any, any>) => {
        return <div style={{ textAlign: "end", width: "100%" }}>{`${Number((params.row.TOTAL_PAY || 0) + (params.row.TOTAL_FINE_RATE || 0)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</div>
      },
    }
  ];

  const handleOnLoad = () => {
    return new Promise((resolve, reject) => {
      getCommon()
        .then((data: DataResponse) => {
          // setCompanies(() =>
          //   data?.COMPANIES?.map((el) => ({
          //     value: el.CODE,
          //     label: el.NAME,
          //   }))
          // );
          setCommon({
            COMPANIES: [...data.COMPANIES] as CompanySelect[],
            PREFIXES: [...data.PREFIXES] as PrefixSelect[],
          });
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const loadDashboard = useCallback(async () => {
    return new Promise((resolve) => {
      getDashboardData(null)
        .then((data) => {
          setChartData(() => data.CHART_DATA);
          // setIX(IX1.);
        })
        .finally(() => {
          resolve(true);
        });
    });
  }, []);

  const searchDashboard = useCallback(() => {

    let params = {} as Record<string, string>;
    if (companyType !== "0") {
      params["COMPANY_TYPE_CODE"] = companyType;
    }

    if (company !== "0") {
      params["COMPANY_CODE"] = company;
    }

    if (quarter !== "0") {
      params["QUARTER"] = quarter;
    }

    if (year !== "0") {
      params["YEAR"] = year;
    }

    // if (stateCode) {
    //   params["STATE_CODE"] = stateCode;
    // }

    // if (paymentStatus) {
    //   params["PAYMENT_STATUS"] = paymentStatus;
    // }

    getDashboardData(params).then((data) => {
      setChartData(data.CHART_DATA);
      setTableData(data.DATA);
      setSelectedStatus("");
      var EX1 = getLocalStorage<any[] | undefined>("_EX1");
      var str = EX1?.toString();
      setEX1(str);
    });
    //LSSIP020Dashboard(params).then((data) => setChartData(data))
  }, [company, companyType, quarter, year]);

  // const handleDownloadExcel = () => {
  //   let params = {} as Record<string, string>;
  //   if (companyType !== "0") {
  //     params["COMPANY_TYPE_CODE"] = companyType;
  //   }

  //   if (company !== "0") {
  //     params["COMPANY_CODE"] = company;
  //   }

  //   if (quarter !== "0") {
  //     params["QUARTER"] = quarter;
  //   }

  //   if (year !== "0") {
  //     params["YEAR"] = year;
  //   }

  //   if (stateCode) {
  //     params["STATE_CODE"] = stateCode;
  //   }

  //   // if (paymentStatus) {
  //   //   params["PAYMENT_STATUS"] = paymentStatus;
  //   // }

  //   downloadFilePost(
  //     `/DashBoard/DashBoardDataExcel`,
  //     "รายการนำส่งเงินสมทบของบริษัทประกันภัย.xlsx",
  //     params
  //   );
  // };

  const header = [
    { header: 'ลำดับ', key: 'running', width: 5, style: { alignment: { horizontal: 'center' }, numFmt: '##0' } },
    { header: 'เลขที่นำส่งเงินสมทบ', key: 'DOCUMENT_HEAD_CODE', width: 20, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },
    { header: 'ชื่อบริษัท', key: 'CY_NAME', width: 40, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'ไตรมาส', key: 'QUARTER', width: 10, style: { alignment: { horizontal: 'center' }, numFmt: '##0' } },
    { header: 'ปี', key: 'YEAR', width: 10, style: { alignment: { horizontal: 'center' }, numFmt: '##0' } },
    { header: 'สถานะ', key: 'STATE_NAME', width: 15, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },
    { header: 'จำนวนเงิน', key: 'TOTAL_PAY', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
  ];

  useEffect(() => {
    handleOnLoad();
    searchDashboard();

    setIsBusy(() => false);
  }, [searchDashboard]);

  const dataFiltering = {
    "รอชำระเงิน": (x: any) => x.STATE_CODE === "REPAYMENT" && x.PAYMENT_STATUS !== "Y",
    "ชำระเงินเรียบร้อยแล้ว": (x: any) => x.STATE_CODE === "COMPLETED",
    "ยกเลิกแล้ว": (x: any) => x.STATE_CODE === "CANCELED",
    "ยังไม่ได้นำส่ง/สถานะร่าง": (x: any) => x.STATE_CODE === "BLANK",
    "": (x: any) => true,
  }

  const _status = (selectedStatus ?? "") as "ชำระเงินเรียบร้อยแล้ว" | "รอชำระเงิน" | "ยกเลิกแล้ว" | "ยังไม่ได้นำส่ง/สถานะร่าง" | ""
  const tableDataFiltered = tableData.filter(dataFiltering[_status]).map((x, i) => ({ ...x, id: i + 1 }));

  useEffect(() => {
    if (selectedStatus === "ชำระเงินเรียบร้อยแล้ว") {
      setStateCode("COMPLETED");
      //setPaymentStatus("1");
    } else if (selectedStatus === "รอชำระเงิน") {
      setStateCode("REPAYMENT");
      //setPaymentStatus("0");
    } else if (selectedStatus === "ยกเลิกแล้ว") {
      setStateCode("CANCELED");
      //setPaymentStatus("");
    } else if (selectedStatus === "ยังไม่ได้นำส่ง/สถานะร่าง") {
      setStateCode("BLANK");
      //setPaymentStatus("");
    } else {
      setStateCode("");
      //setPaymentStatus("");
    }
  }, [selectedStatus])
  
  if (isBusy) return <Spinner />;
  return (
    <Container fluid>
      <Row>
        <Col>
          <NavMenu />
          {/* { EX === "" ? ( */}
          <Card style={{ marginTop: "7rem", marginBottom: "2rem" }}>
            <Card.Header>ข้อมูล Dashboard</Card.Header>
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
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      setCompanyType(() => e.target.value.trim());
                    }}
                    value={companyType}
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
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      setCompany(() => e.target.value);
                    }}
                    value={company}
                  >
                    <option value="0">ทุกบริษัท</option>
                    {common.COMPANIES.filter(x => x.COMPANY_TYPE_CODE === companyType || !companyType || companyType === "0").map((c) => (
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
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      setYear(() => e.target.value);
                    }}
                    value={year}
                  >
                    <option value="0">เลือกปี</option>
                    {yearOptions.map((x: number, i: number) => (
                      <option key={i} value={x + 543}>
                        {x + 543}
                      </option>
                    ))}
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
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      setQuarter(() => e.target.value);
                    }}
                    value={quarter}
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
                    onClick={() => searchDashboard()}
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
            </Card.Body>
          </Card>
          {/* ) : null} */}
          {/* { EX === "" ? ( */}
          <Row>
            <Col>
              <Chart
                chartType="PieChart"
                data={chartData}
                options={{
                  title: "รายการนำส่งเงินสมทบของบริษัทประกันภัย",
                  //is3D: true,
                  //sliceVisibilityThreshold: 0.1,
                }}
                width={"100%"}
                height={"400px"}
                chartEvents={[
                  {
                    eventName: "select",
                    callback: ({ controlWrapper, google, chartWrapper, eventArgs }) => {
                      const chart = chartWrapper.getChart();
                      const dt = chartWrapper.getDataTable();
                      const selection = chart.getSelection();
                      const s = selection[0] ? dt?.getValue(selection[0].row, 0)?.toString() || null : null;
                      setSelectedStatus(s);
                    }
                  }
                ]}
              />
            </Col>
          </Row>
          {/* ) : null} */}
          {/* { EX === "" ? ( */}
          <Row>
            <Col>
              <Card style={{ marginTop: "1rem", marginBottom: "2rem" }}>
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <div> สถานะ : {selectedStatus || "ทั้งหมด"}</div>
                    <div>
                      <ExportExcel
                        data={tableData}
                        headers={header}
                        fileNames={"รายการนำส่งเงินสมทบของบริษัทประกันภัย.xlsx"}
                      // tableType={"TableCal"}
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
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div style={{ height: 500, width: "100%" }}>
                    <DataGrid rows={tableDataFiltered} columns={columns} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* // ) : null} */}
          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flexGrow: 1 }}></div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
