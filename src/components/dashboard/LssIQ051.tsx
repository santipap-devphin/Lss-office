import { useState, useEffect, useCallback } from "react";
import "@sweetalert2/theme-minimal/minimal.scss";
import { getCommon, LssIQ51List, LssIQ051ListWhere, LssIQ051ListWhereT, LssIQ51ListT, downloadFilePost, LssIQ051ListWhereGroup, Getdatayear } from "../../data";
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
import "./Dashboard.tsx";
import { FaBars } from "react-icons/fa";
import { Chart } from "react-google-charts";
import { DataGrid, GridRowsProp, GridColDef, GridValueFormatterParams, GridRenderCellParams, GridColumnGroup, GridColumnGroupHeaderParams } from "@mui/x-data-grid";
import { LSS_V_LSSIR010 } from './../../models/office/LSS_V_LSSIR010.model';
import { number } from "yup/lib/locale";
import ExportExcelVarious from "../report/shared/ExportExcelVarious";

interface IRV10 {
  id: any;
  COMPANY_CODE: string;
  NAME: string;
  YEAR: number;
  Q1: number;
  Q2: number;
  Q3: number;
  Q4: number;
  Q5: number;
  Q6: number;
  Q7: number;
  Q8: number;
  Q9: number;
  Q10: number;
  Q11: number;
  Q12: number;
  Q13: number;
  Q14: number;
  Q15: number;
  Q16: number;
  QSUM: number;
}

const currentYear = new Date().getFullYear();
const yearOptions = Array(10).fill("").map((x, i) => currentYear - i + 543);

export default function LssIQ051() {
  const [common, setCommon] = useState<DataResponse>({
    COMPANIES: [],
    PREFIXES: [],
  });
  const [sTypeData, setSTypeData] = useState<string[]>(["0"]);
  const [sOrder, setSOrder] = useState<string[]>(["0"]);
  const [sType, setSType] = useState<string[]>(["0"]);
  const [company, setCompany] = useState<string[]>(["0"]);
  const [sQuarter, setSQuarter] = useState<string[]>(["0"]);
  const [sYear, setSYear] = useState<string[]>([yearOptions[0].toString()]);
  const [sPage, setPage] = useState<string[]>(["5"]);
  const [sReturn, setReturn] = useState<string[]>(["1"]);
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

  function PostGraph() {
    fnPostGrid(sType[0], company[0], sYear[0], sQuarter[0], sOrder[0], sPage[0]);
  }
  var yearGroup = Number(sYear);

  // ปรับให้ดึงจาก Store Procedure

  const [data, setTableData] = useState<any[]>([""]);

  const columns: GridColDef[] = [
    {
      field: "id", headerName: "ลำดับ", width: 70, align: "center", headerAlign: "center", renderCell: (params: GridRenderCellParams<any, IRV10, any>) => {
        if (params.row.YEAR <= 0)
          return <></>

        return <>{params.row.id}</>
      }
    },
    { field: "COMPANY_CODE", headerName: "รหัส", width: 100, align: "left", headerAlign: "center" },
    { field: "NAME", headerName: "ชื่อบริษัท", width: 400, align: "left", headerAlign: "center" },
    // {
    //   field: "ํYEAR", headerName: "ปี", width: 100, align: "center", headerAlign: "center",
    //   renderCell: (params: GridRenderCellParams<any, IRV10, any>) => {
    //     if (params.row.YEAR <= 0)
    //       return <></>
    //     return (
    //       <>
    //         <span className="fontHilight">{params.row.YEAR}</span>
    //       </>
    //     );
    //   },
    // },
    {
      field: "Q1", headerName: "ไตรมาส 1", width: 200, align: "right", headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "Q2", headerName: "ไตรมาส 2", width: 200, align: "right", headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "Q3", headerName: "ไตรมาส 3", width: 200, align: "right", headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "Q4", headerName: "ไตรมาส 4", width: 200, align: "right", headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "Q5", headerName: "ไตรมาส 1", width: 200, align: "right", headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "Q6", headerName: "ไตรมาส 2", width: 200, align: "right", headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "Q7", headerName: "ไตรมาส 3", width: 200, align: "right", headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "Q8", headerName: "ไตรมาส 4", width: 200, align: "right", headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "Q9", headerName: "ไตรมาส 1", width: 200, align: "right", headerAlign: "center", hide: Number(sQuarter[0]) > 1 ? false : true,
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "Q10", headerName: "ไตรมาส 2", width: 200, align: "right", headerAlign: "center", hide: Number(sQuarter[0]) > 1 ? false : true,
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "Q11", headerName: "ไตรมาส 3", width: 200, align: "right", headerAlign: "center", hide: Number(sQuarter[0]) > 1 ? false : true,
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "Q12", headerName: "ไตรมาส 4", width: 200, align: "right", headerAlign: "center", hide: Number(sQuarter[0]) > 1 ? false : true,
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "Q13", headerName: "ไตรมาส 1", width: 200, align: "right", headerAlign: "center", hide: Number(sQuarter[0]) === 3 ? false : true,
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "Q14", headerName: "ไตรมาส 2", width: 200, align: "right", headerAlign: "center", hide: Number(sQuarter[0]) === 3 ? false : true,
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "Q15", headerName: "ไตรมาส 3", width: 200, align: "right", headerAlign: "center", hide: Number(sQuarter[0]) === 3 ? false : true,
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "Q16", headerName: "ไตรมาส 4", width: 200, align: "right", headerAlign: "center", hide: Number(sQuarter[0]) === 3 ? false : true,
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "QSUM", headerName: "รวม", width: 200, align: "right", headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
  ];
  const columnGroups: GridColumnGroup[] = [
    {
      groupId: "YEAR",
      renderHeaderGroup: (params: GridColumnGroupHeaderParams) => {
        return <> ปี {yearGroup}</>
      },
      headerAlign: "center",
      children: [{ field: 'Q1' }, { field: 'Q2' }, { field: 'Q3' }, { field: 'Q4' }],
    },
    {
      groupId: 'YEAR2',
      renderHeaderGroup: (params: GridColumnGroupHeaderParams) => {
        return <> ปี {yearGroup - 1}</>
      },
      headerName: "ปี",
      headerAlign: "center",
      children: [{ field: 'Q5' }, { field: 'Q6' }, { field: 'Q7' }, { field: 'Q8' }],
    },
    {
      groupId: 'YEAR3',
      renderHeaderGroup: (params: GridColumnGroupHeaderParams) => {
        return <> ปี {yearGroup - 2}</>
      },
      headerName: "ปี",
      headerAlign: "center",
      children: [{ field: 'Q9' }, { field: 'Q10' }, { field: 'Q11' }, { field: 'Q12' }],
    },
    {
      groupId: 'YEAR4',
      renderHeaderGroup: (params: GridColumnGroupHeaderParams) => {
        return <> ปี {yearGroup - 3}</>
      },
      headerName: "ปี",
      headerAlign: "center",
      children: [{ field: 'Q13' }, { field: 'Q14' }, { field: 'Q15' }, { field: 'Q16' }],
    },
    {
      groupId: ' ',
      headerAlign: "center",
      children: [{ field: 'QSUM' }],
    },
  ];

  const [tableData, setGridData] = useState<IRV10[]>([]);
  const fnPostGrid = useCallback(
    async (
      COMPANY_TYPE: string,
      COMPANY_CODE: string,
      YEAR: string,
      QUARTER: string,
      ORDERBY: string,
      PAGE: string,
    ) => {
      Getdatayear().then((data: any) => {
        setSeleteYear(data);
      });
      if (QUARTER[0] === "0") { QUARTER = "1" }
      var para = JSON.parse(
        `{"COMPANY_TYPE_CODE":"${COMPANY_TYPE}","COMPANY_CODE":"${COMPANY_CODE}", "YEAR":"${YEAR}", "QUARTER":"${QUARTER}", "ORDERBY":"${ORDERBY}", "PAGE":"${PAGE}"  }`
      );
      LssIQ051ListWhereGroup(para).then((data: any[]) => {
        let tmpSchema = [];
        var tmpSQ1 = 0;
        var tmpSQ2 = 0;
        var tmpSQ3 = 0;
        var tmpSQ4 = 0;
        var tmpSQ5 = 0;
        var tmpSQ6 = 0;
        var tmpSQ7 = 0;
        var tmpSQ8 = 0;
        var tmpSQ9 = 0;
        var tmpSQ10 = 0;
        var tmpSQ11 = 0;
        var tmpSQ12 = 0;
        var tmpSQ13 = 0;
        var tmpSQ14 = 0;
        var tmpSQ15 = 0;
        var tmpSQ16 = 0;
        var tmpSSUM = 0;
        for (var i = 0; i < data.length; i++) {
          var sumTotal = data[i].YEAR1Q1 + data[i].YEAR1Q2 + data[i].YEAR1Q3 + data[i].YEAR1Q4 +
            data[i].YEAR2Q1 + data[i].YEAR2Q2 + data[i].YEAR2Q3 + data[i].YEAR2Q4 +
            data[i].YEAR3Q1 + data[i].YEAR3Q2 + data[i].YEAR3Q3 + data[i].YEAR3Q4 +
            data[i].YEAR4Q1 + data[i].YEAR4Q2 + data[i].YEAR4Q3 + data[i].YEAR4Q4
          tmpSchema.push({
            id: i + 1,
            COMPANY_CODE: data[i].COMPANY_CODE,
            NAME: data[i].COMPANY_NAME,
            YEAR: 0,
            Q1: data[i].YEAR1Q1,
            Q2: data[i].YEAR1Q2,
            Q3: data[i].YEAR1Q3,
            Q4: data[i].YEAR1Q4,
            Q5: data[i].YEAR2Q1,
            Q6: data[i].YEAR2Q2,
            Q7: data[i].YEAR2Q3,
            Q8: data[i].YEAR2Q4,
            Q9: data[i].YEAR3Q1,
            Q10: data[i].YEAR3Q2,
            Q11: data[i].YEAR3Q3,
            Q12: data[i].YEAR3Q4,
            Q13: data[i].YEAR4Q1,
            Q14: data[i].YEAR4Q2,
            Q15: data[i].YEAR4Q3,
            Q16: data[i].YEAR4Q4,
            QSUM: sumTotal,

          });
          tmpSQ1 += data[i].YEAR1Q1;
          tmpSQ2 += data[i].YEAR1Q2;
          tmpSQ3 += data[i].YEAR1Q3;
          tmpSQ4 += data[i].YEAR1Q4;
          tmpSQ5 += data[i].YEAR2Q1;
          tmpSQ6 += data[i].YEAR2Q2;
          tmpSQ7 += data[i].YEAR2Q3;
          tmpSQ8 += data[i].YEAR2Q4;
          tmpSQ9 += data[i].YEAR3Q1;
          tmpSQ10 += data[i].YEAR3Q2;
          tmpSQ11 += data[i].YEAR3Q3;
          tmpSQ12 += data[i].YEAR3Q4;
          tmpSQ13 += data[i].YEAR4Q1;
          tmpSQ14 += data[i].YEAR4Q2;
          tmpSQ15 += data[i].YEAR4Q3;
          tmpSQ15 += data[i].YEAR4Q4;
          tmpSSUM += sumTotal;
        }

        tmpSchema.push({
          id: data.length + 1,
          COMPANY_CODE: "",
          NAME: "รวม",
          YEAR: 0,
          Q1: tmpSQ1,
          Q2: tmpSQ2,
          Q3: tmpSQ3,
          Q4: tmpSQ4,
          Q5: tmpSQ5,
          Q6: tmpSQ6,
          Q7: tmpSQ7,
          Q8: tmpSQ8,
          Q9: tmpSQ9,
          Q10: tmpSQ10,
          Q11: tmpSQ11,
          Q12: tmpSQ12,
          Q13: tmpSQ13,
          Q14: tmpSQ14,
          Q15: tmpSQ15,
          Q16: tmpSQ16,
          QSUM: tmpSSUM,
        });

        setGridData(tmpSchema);

      }); //getPayinList
    },
    []
  );

  useEffect(() => {
    handleOnLoad();
    fnPostGrid(sType[0], company[0], sYear[0], sQuarter[0], sOrder[0], sPage[0]);
  }, []);

  const options = {
    chart: {
      title: "หน่วย (1,000 ล้านบาท)",
      subtitle: "",
    },
  };

  // const handleDownloadExcel = () => {
  //   let record = {} as Record<string, any>;
  //   record["COMPANY_CODE"] = company[0];
  //   record["COMPANY_TYPE_CODE"] = sType[0];
  //   record["YEAR"] = sYear[0];
  //   record["ORDERBY"] = sOrder[0];
  //   record["PAGE"] = sPage[0];
  //   record["QUARTER"] = sQuarter[0];
  //   downloadFilePost(
  //     `/LSSIQ051/LSSIQ051Excel`,
  //     "LSS-IQ-051_เปรียบเทียบข้อมูลย้อนหลัง_แยกตามกลุ่มบริษัทประกันภัย.xlsx",
  //     record
  //   );
  // };

  const header = [
    { header: '', key: 'id', width: 5, style: { alignment: { horizontal: 'center' }, numFmt: '#' } },
    { header: '', key: 'COMPANY_CODE', width: 10, style: { alignment: { horizontal: 'left' }, numFmt: '#' } },
    { header: '', key: 'NAME', width: 50, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
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
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 20, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
  ];

  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <NavMenu />
            <Card style={{ marginTop: "7rem" }}>
              <Card.Header>
                LSS-IQ-051 เปรียบเทียบข้อมูลย้อนหลัง แยกตามกลุ่มบริษัทประกันภัย
              </Card.Header>
              <Card.Body>
                <div style={{ width: "100%" }}>
                  {/* จบแถวที่  1     */}
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
                      บริษัท
                    </Col>
                    <Col sm={6} lg={2}>
                      <select
                        className="form-select"
                        name="COMPANY"
                        onChange={(e) => {
                          setCompany([e.target.value]);
                        }}
                        value={company}
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
                      ย้อนหลัง
                    </Col>
                    <Col sm={6} lg={1}>
                      <select
                        className="form-select"
                        name="QUARTER"
                        id="QUARTER"
                        onChange={(e) => {
                          setSQuarter([e.target.value]);
                          setReturn([e.target.value]);
                        }}
                        value={sReturn}
                      >
                        {/* ปรับให้ดึงจาก table Lss_t_company_quarter */}
                        {/* <option value="0">ทุกไตรมาส</option> */}
                        <option selected value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        {/* <option value="4">4</option> */}
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
                      {/* <Button
                        style={{ marginRight: 5 }}
                        variant="contained"
                        startIcon={<Search />}
                        onClick={() => PostGraph()}
                      >
                        {" "}
                        ค้นหา
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
                  {/* แถวที่ 1 */}
                  <Row style={{ marginBottom: 10, marginTop: 20 }}>
                    <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                      ข้อมูล
                    </Col>
                    <Col sm={6} lg={2}>
                      <select
                        className="form-select"
                        name="TYPDATA"
                        id="TYPDATA"
                        onChange={(e) => {
                          setSTypeData([e.target.value]);
                        }}
                        value={sTypeData}
                      >
                        <option value="0">ทั้งหมด</option>
                        <option value="NORMAL">การนำส่งเงินสมทบ(ทีมีการชำระแล้ว)</option>
                        <option value="CRR">ข้อมูลเงินสมทบที่คำนวณได้จากข้อมูลระบบ CRR</option>
                      </select>
                    </Col>
                    <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                      เรียงลำดับ
                    </Col>
                    <Col sm={6} lg={2}>
                      <select
                        className="form-select"
                        name="Order"
                        id="Order"
                        onChange={(e) => {
                          setSOrder([e.target.value]);
                        }}
                        value={sOrder}
                      >
                        <option value="0">เลือกเรียงลำดับ</option>
                        <option value="1">เงินสมทบมากไปน้อย</option>
                        <option value="2">เงินสมทบน้อยไปมาก</option>
                        <option value="3">ชื่อบริษัท ก &gt; ฮ</option>
                        <option value="4">ชือบริษัท ฮ &gt; ก</option>
                      </select>
                    </Col>
                    <Col sm={6} lg={2} style={{ textAlign: "right" }}> จำนวนลำดับที่แสดง </Col>
                    <Col sm={6} lg={1}> <select
                      className="form-select"
                      name="Return"
                      id="Return"
                      onChange={(e) => {
                        setPage([e.target.value]);
                      }}
                      value={sPage}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="25">25</option>
                    </select>
                    </Col>
                    <Col sm={6} lg={1} style={{ textAlign: "right" }}> </Col>
                    <Col sm={6} lg={1}> <Button
                      style={{ marginRight: 5 }}
                      variant="contained"
                      startIcon={<Search />}
                      onClick={() => PostGraph()}
                    >
                      {" "}
                      ค้นหา
                    </Button></Col>
                    <Col
                      md={1}
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        textAlign: "left",
                      }}
                    >
                      <ExportExcelVarious
                        data={tableData}
                        // dataSum={SumtableData}
                        headers={header}
                        year={sYear[0]}
                        quarter={sQuarter[0]}
                        IDPage={"LSS-IQ-051"}
                        fileNames={"LSS-IQ-051_เปรียบเทียบข้อมูลย้อนหลัง_แยกตามกลุ่มบริษัทประกันภัย.xlsx"}
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
                    <Col md={1} >  </Col>
                  </Row>
                  {/* 
                  <Row>
                    <Col>
                      <Chart
                        chartType="Bar"
                        width="98%"
                        height="400px"
                        data={data}
                        options={options}
                      />
                    </Col>
                  </Row> */}

                  <Row>
                    <Col>
                      <div style={{ height: 600, width: "100%" }}>
                        <DataGrid
                          sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                          experimentalFeatures={{ columnGrouping: true }}
                          rows={tableData}
                          columns={columns}
                          columnGroupingModel={columnGroups}
                        />
                      </div>
                    </Col>
                  </Row>

                  <div style={{ display: "flex", height: "100%" }}>
                    <div style={{ flexGrow: 1 }}></div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div style={{ display: "flex", height: "2rem" }}>
          <div style={{ flexGrow: 1 }}></div>
        </div>
      </Container>
    </>
  );
}