import { useState, useEffect, useCallback } from "react";
import "@sweetalert2/theme-minimal/minimal.scss";
import { getCommon, LssIQ53List, LssIQ053ListWhere, LssIQ051ListWhereT, downloadFilePost, LssIQ053ListWhereGroup, Getdatayear } from "../../data";
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
  QSUM: number;
}

const currentYear = new Date().getFullYear();
const yearOptions = Array(10).fill("").map((x, i) => currentYear - i + 543);

export default function LssIQ053() {
  const [common, setCommon] = useState<DataResponse>({
    COMPANIES: [],
    PREFIXES: [],
  });
  const [sTypeData, setSTypeData] = useState<string[]>(["0"]);
  const [sOrder, setSOrder] = useState<string[]>(["0"]);
  const [sType, setSType] = useState<string[]>(["0"]);
  const [company, setCompany] = useState<string[]>(["0"]);
  const [SYuarter, setSYuarter] = useState<string[]>(["0"]);
  const [sYear, setSYear] = useState<string[]>(["0"]);
  const [sPage, setPage] = useState<string[]>(["5"]);
  const [sReturn, setReturn] = useState<string[]>(["1"]);
  const [sQUARTER, setQUARTER] = useState<string[]>(["1"]);
  const [seleteYear, setSeleteYear] = useState<any[]>([0]);

  const handleOnLoad = () => {
    return new Promise((resolve, reject) => {
      getCommon().then((data: DataResponse) => {
        const currentYear = new Date().getFullYear();
        setSYear([(currentYear + 543).toString()]);
        setCommon({
          COMPANIES: [...data.COMPANIES] as CompanySelect[],
          PREFIXES: [...data.PREFIXES] as PrefixSelect[],
        });
      });
    });
  };

  function PostGraph() {
    //fnPost(sType[0], company[0], sYear[0], SYuarter[0]);
    fnPostGrid(sType[0], company[0], sYear[0], SYuarter[0], sOrder[0], sPage[0]);
  }

  var yearGroup = Number(sYear);

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
      field: "YEAR1Q1", width: 200, align: "right", headerAlign: "center",
      renderHeader: (params) => {
        return <> ปี {yearGroup}</>
      },
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "YEAR2Q1", width: 200, align: "right", headerAlign: "center",
      renderHeader: () => {
        return <> ปี {yearGroup - 1}</>
      },
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "YEAR3Q1", width: 200, align: "right", headerAlign: "center", hide: Number(sReturn[0]) > 1 ? false : true,
      renderHeader: () => {
        return <> ปี {yearGroup - 2}</>
      },
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "YEAR4Q1", width: 200, align: "right", headerAlign: "center", hide: Number(sReturn[0]) === 3 ? false : true,
      renderHeader: () => {
        return <> ปี {yearGroup - 3}</>
      },
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "YEAR1Q2", width: 200, align: "right", headerAlign: "center",
      renderHeader: (params) => {
        return <> ปี {yearGroup}</>
      },
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "YEAR2Q2", width: 200, align: "right", headerAlign: "center",
      renderHeader: () => {
        return <> ปี {yearGroup - 1}</>
      },
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "YEAR3Q2", width: 200, align: "right", headerAlign: "center", hide: Number(sReturn[0]) > 1 ? false : true,
      renderHeader: () => {
        return <> ปี {yearGroup - 2}</>
      },
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "YEAR4Q2", width: 200, align: "right", headerAlign: "center", hide: Number(sReturn[0]) === 3 ? false : true,
      renderHeader: () => {
        return <> ปี {yearGroup - 3}</>
      },
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "YEAR1Q3", width: 200, align: "right", headerAlign: "center",
      renderHeader: (params) => {
        return <> ปี {yearGroup}</>
      },
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "YEAR2Q3", width: 200, align: "right", headerAlign: "center",
      renderHeader: () => {
        return <> ปี {yearGroup - 1}</>
      },
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "YEAR3Q3", width: 200, align: "right", headerAlign: "center", hide: Number(sReturn[0]) > 1 ? false : true,
      renderHeader: () => {
        return <> ปี {yearGroup - 2}</>
      },
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "YEAR4Q3", width: 200, align: "right", headerAlign: "center", hide: Number(sReturn[0]) === 3 ? false : true,
      renderHeader: () => {
        return <> ปี {yearGroup - 3}</>
      },
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "YEAR1Q4", width: 200, align: "right", headerAlign: "center",
      renderHeader: (params) => {
        return <> ปี {yearGroup}</>
      },
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "YEAR2Q4", width: 200, align: "right", headerAlign: "center",
      renderHeader: () => {
        return <> ปี {yearGroup - 1}</>
      },
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "YEAR3Q4", width: 200, align: "right", headerAlign: "center", hide: Number(sReturn[0]) > 1 ? false : true,
      renderHeader: () => {
        return <> ปี {yearGroup - 2}</>
      },
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        return (params.value as number)?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      field: "YEAR4Q4", width: 200, align: "right", headerAlign: "center", hide: Number(sReturn[0]) === 3 ? false : true,
      renderHeader: () => {
        return <> ปี {yearGroup - 3}</>
      },
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
      groupId: "QUETER1",
      renderHeaderGroup: (params: GridColumnGroupHeaderParams) => {
        return <> ไตรมาส 1 </>
      },
      headerAlign: "center",
      children: [{ field: 'YEAR1Q1' }, { field: 'YEAR2Q1' }, { field: 'YEAR3Q1' }, { field: 'YEAR4Q1' }],
    },
    {
      groupId: 'QUETER2',
      renderHeaderGroup: (params: GridColumnGroupHeaderParams) => {
        return <> ไตรมาส 2 </>
      },
      headerAlign: "center",
      children: [{ field: 'YEAR1Q2' }, { field: 'YEAR2Q2' }, { field: 'YEAR3Q2' }, { field: 'YEAR4Q2' }],
    },
    {
      groupId: 'QUETER3',
      renderHeaderGroup: (params: GridColumnGroupHeaderParams) => {
        return <> ไตรมาส 3 </>
      },
      headerAlign: "center",
      children: [{ field: 'YEAR1Q3' }, { field: 'YEAR2Q3' }, { field: 'YEAR3Q3' }, { field: 'YEAR4Q3' }],
    },
    {
      groupId: 'QUETER4',
      renderHeaderGroup: (params: GridColumnGroupHeaderParams) => {
        return <> ไตรมาส 4 </>
      },
      headerAlign: "center",
      children: [{ field: 'YEAR1Q4' }, { field: 'YEAR2Q4' }, { field: 'YEAR3Q4' }, { field: 'YEAR4Q4' }],
    },
    {
      groupId: ' ',
      headerAlign: "center",
      children: [{ field: 'QSUM' }],
    },
  ];

  const [tableData, setGridData] = useState<any[]>([]);

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
      var para = JSON.parse(
        `{"COMPANY_TYPE_CODE":"${COMPANY_TYPE}","COMPANY_CODE":"${COMPANY_CODE}", "YEAR":"${YEAR}", "ORDERBY":"${ORDERBY}", "QUARTER":"${sReturn[0]}" }`
      );
      console.table(para);
      LssIQ053ListWhereGroup(para).then((data: any[]) => {
        let tmpSchema = [];
        var tmpSY1 = 0;
        var tmpSY2 = 0;
        var tmpSY3 = 0;
        var tmpSY4 = 0;
        var tmpSY5 = 0;
        var tmpSY6 = 0;
        var tmpSY7 = 0;
        var tmpSY8 = 0;
        var tmpSY9 = 0;
        var tmpSY10 = 0;
        var tmpSY11 = 0;
        var tmpSY12 = 0;
        var tmpSY13 = 0;
        var tmpSY14 = 0;
        var tmpSY15 = 0;
        var tmpSY16 = 0;
        var tmpSSUM = 0;
        var tmpYSUM = 0;
        var TmpCount = Number.parseInt(PAGE) > data.length ? data.length : Number.parseInt(PAGE);
        if(Number.parseInt(PAGE) <= 0){
          TmpCount = data.length;
        }
        for (let i = 0; i < TmpCount; i++) {
          var tmpY1 = data[i].YEAR1Q1 == null ? 0 : data[i].YEAR1Q1;
          var tmpY2 = data[i].YEAR2Q1 == null ? 0 : data[i].YEAR2Q1;
          var tmpY3 = data[i].YEAR3Q1 == null ? 0 : data[i].YEAR3Q1;
          var tmpY4 = data[i].YEAR4Q1 == null ? 0 : data[i].YEAR4Q1;
          var tmpY5 = data[i].YEAR1Q2 == null ? 0 : data[i].YEAR1Q2;
          var tmpY6 = data[i].YEAR2Q2 == null ? 0 : data[i].YEAR2Q2;
          var tmpY7 = data[i].YEAR3Q2 == null ? 0 : data[i].YEAR3Q2;
          var tmpY8 = data[i].YEAR4Q2 == null ? 0 : data[i].YEAR4Q2;
          var tmpY9 = data[i].YEAR1Q3 == null ? 0 : data[i].YEAR1Q3;
          var tmpY10 = data[i].YEAR2Q3 == null ? 0 : data[i].YEAR2Q3;
          var tmpY11 = data[i].YEAR3Q3 == null ? 0 : data[i].YEAR3Q3;
          var tmpY12 = data[i].YEAR4Q3 == null ? 0 : data[i].YEAR4Q3;
          var tmpY13 = data[i].YEAR1Q4 == null ? 0 : data[i].YEAR1Q4;
          var tmpY14 = data[i].YEAR2Q4 == null ? 0 : data[i].YEAR2Q4;
          var tmpY15 = data[i].YEAR3Q4 == null ? 0 : data[i].YEAR3Q4;
          var tmpY16 = data[i].YEAR4Q4 == null ? 0 : data[i].YEAR4Q4;
          tmpSY1 += tmpY1;
          tmpSY2 += tmpY2;
          tmpSY3 += tmpY3;
          tmpSY4 += tmpY4;
          tmpSY5 += tmpY5;
          tmpSY6 += tmpY6;
          tmpSY7 += tmpY7;
          tmpSY8 += tmpY8;
          tmpSY9 += tmpY9;
          tmpSY10 += tmpY10;
          tmpSY11 += tmpY11;
          tmpSY12 += tmpY12;
          tmpSY13 += tmpY13;
          tmpSY14 += tmpY14;
          tmpSY15 += tmpY15;
          tmpSY16 += tmpY16;
          tmpSSUM = tmpY1 + tmpY2 + tmpY3 + tmpY4 + tmpY5 + tmpY6 + tmpY7 + tmpY8 + tmpY9
            + tmpY10 + tmpY11 + tmpY12 + tmpY12 + tmpY14 + tmpY15 + tmpY16;
          tmpSchema.push({
            id: i + 1,
            COMPANY_CODE: data[i].COMPANY_CODE,
            NAME: data[i].COMPANY_NAME,
            YEAR: data[i].YEAR,
            YEAR1Q1: tmpY1,
            YEAR2Q1: tmpY2,
            YEAR3Q1: tmpY3,
            YEAR4Q1: tmpY4,
            YEAR1Q2: tmpY5,
            YEAR2Q2: tmpY6,
            YEAR3Q2: tmpY7,
            YEAR4Q2: tmpY8,
            YEAR1Q3: tmpY9,
            YEAR2Q3: tmpY10,
            YEAR3Q3: tmpY11,
            YEAR4Q3: tmpY12,
            YEAR1Q4: tmpY13,
            YEAR2Q4: tmpY14,
            YEAR3Q4: tmpY15,
            YEAR4Q4: tmpY16,
            QSUM: tmpSSUM,
          });
        } //loop i
        tmpYSUM = tmpSY1 + tmpSY2 + tmpSY3 + tmpSY4 + tmpSY5 + tmpSY6 + tmpSY7 + tmpSY8 + tmpSY9
          + tmpSY10 + tmpSY11 + tmpSY12 + tmpSY12 + tmpSY14 + tmpSY15 + tmpY16;
        tmpSchema.push({
          id: TmpCount + 1,
          COMPANY_CODE: "",
          NAME: "รวม",
          YEAR: 0,
          YEAR1Q1: tmpSY1,
          YEAR2Q1: tmpSY2,
          YEAR3Q1: tmpSY3,
          YEAR4Q1: tmpSY4,
          YEAR1Q2: tmpSY5,
          YEAR2Q2: tmpSY6,
          YEAR3Q2: tmpSY7,
          YEAR4Q2: tmpSY8,
          YEAR1Q3: tmpSY9,
          YEAR2Q3: tmpSY10,
          YEAR3Q3: tmpSY11,
          YEAR4Q3: tmpSY12,
          YEAR1Q4: tmpSY13,
          YEAR2Q4: tmpSY14,
          YEAR3Q4: tmpSY15,
          YEAR4Q4: tmpSY16,
          QSUM: tmpYSUM,
        });
        setGridData(tmpSchema);
        let tmpSchema2 = [];
        var tmpYear = "";
        var tmpYearSc = [];
        let tmpHYear = [];
        let tmpHead = [];

        for (let i = 0; i < TmpCount; i++) {
          tmpYearSc.push(data[i].YEAR);
        } //loop i

        tmpYearSc = Array.from(new Set(tmpYearSc));

        tmpHead.push("ไตรมาส");
        for (let i = 0; i < tmpYearSc.length; i++) {
          tmpHead.push(String(data[i].YEAR));
        } //loop i

        if (tmpYearSc.length === 0) {
          tmpHead.push('0');
          tmpSchema2.push(tmpHead);
        } else {
          tmpSchema2.push(tmpHead);
        }

        for (let m = 0; m < 4; m++) {
          let tmpLast = [];
          let tmpTotal = [];
          tmpLast.push(String(m + 1));

          for (let i = 0; i < tmpYearSc.length; i++) {
            var Sum = 0.0;
            for (let j = 0; j < TmpCount; j++) {
              if (data[j].YEAR === tmpYearSc[i]) {
                if (m + 1 == 1) {
                  Sum = Sum + data[j].Q1;
                } else if (m + 1 == 2) {
                  Sum = Sum + data[j].Q2;
                } else if (m + 1 == 3) {
                  Sum = Sum + data[j].Q3;
                } else if (m + 1 == 4) {
                  Sum = Sum + data[j].Q4;
                }
              }
            }
            tmpTotal.push(parseFloat(Sum.toFixed(2)));
          }

          for (let n = 0; n < tmpTotal.length; n++) {
            tmpLast.push(tmpTotal[n]);
          }
          tmpSchema2.push(tmpLast);
        }
        setTableData(tmpSchema2);

      }); //getPayinList
    },
    []
  );

  const fnPost = useCallback(
    async (
      COMPANY_TYPE: string,
      COMPANY_CODE: string,
      YEAR: string,
      QUARTER: string
    ) => {
      var para = JSON.parse(
        `{"COMPANY_TYPE_CODE":"${COMPANY_TYPE}","COMPANY_CODE":"${COMPANY_CODE}", "YEAR":"${YEAR}",  "QUARTER":"${sReturn[0]}"  }`
      );
      LssIQ053ListWhere(para).then((data: any) => {
        let tmpSchema = [];
        var tmpYear = "";
        var tmpYearSc = [];

        let tmpHYear = [];
        let tmpHead = [];

        for (let i = 0; i < data.length; i++) {
          tmpYearSc.push(data[i].YEAR);
        } //loop i

        tmpYearSc = Array.from(new Set(tmpYearSc));

        tmpHead.push("ไตรมาส");
        for (let i = 0; i < tmpYearSc.length; i++) {
          tmpHead.push(String(data[i].YEAR));
        } //loop i

        if (tmpYearSc.length === 0) {
          tmpHead.push('0');
          tmpSchema.push(tmpHead);
        } else {
          tmpSchema.push(tmpHead);
        }

        if (tmpYearSc.length !== 0) {
          for (let m = 0; m < 4; m++) {
            let tmpLast = [];
            let tmpTotal = [];
            tmpLast.push(String(m + 1));

            for (let i = 0; i < tmpYearSc.length; i++) {
              var Sum = 0.0;
              for (let j = 0; j < data.length; j++) {
                if (data[j].YEAR === tmpYearSc[i] && data[j].QUARTER === (m + 1)) {
                  data[j].AMOUNT = data[j].AMOUNT == null ? 0 : data[j].AMOUNT;
                  Sum = Sum + data[j].AMOUNT;
                }
              }
              tmpTotal.push(parseFloat(Sum.toFixed(2)));
            }
            for (let n = 0; n < tmpTotal.length; n++) {
              tmpLast.push(tmpTotal[n]);
            }
            tmpSchema.push(tmpLast);
          }
        }
        setTableData(tmpSchema);
      }); //getPayinList
    },
    []
  );

  const [data, setTableData] = useState<any[]>([""]);

  const fnLoad = useCallback(async () => {
    LssIQ53List().then((data: any) => {
      let tmpSchema = [];
      var tmpYear = "";
      var tmpYearSc = [];

      let tmpHYear = [];
      let tmpHead = [];

      for (let i = 0; i < data.length; i++) {
        tmpYearSc.push(data[i].YEAR);
      } //loop i

      tmpYearSc = Array.from(new Set(tmpYearSc));

      tmpHead.push("ไตรมาส");
      for (let i = 0; i < tmpYearSc.length; i++) {
        tmpHead.push(String(data[i].YEAR));
      } //loop i

      if (tmpYearSc.length === 0) {
        tmpHead.push('0');
        tmpSchema.push(tmpHead);
      } else {
        tmpSchema.push(tmpHead);
      }

      for (let m = 0; m < 4; m++) {
        let tmpLast = [];
        let tmpTotal = [];
        tmpLast.push(String(m + 1));

        for (let i = 0; i < tmpYearSc.length; i++) {
          var Sum = 0.0;
          for (let j = 0; j < data.length; j++) {
            if (data[j].YEAR === tmpYearSc[i] && data[j].QUARTER === (m + 1)) {
              data[j].AMOUNT = data[j].AMOUNT == null ? 0 : data[j].AMOUNT;
              Sum = Sum + data[j].AMOUNT;
            }
          }
          tmpTotal.push(parseFloat(Sum.toFixed(2)));
        }

        for (let n = 0; n < tmpTotal.length; n++) {
          tmpLast.push(tmpTotal[n]);
        }
        tmpSchema.push(tmpLast);
      }
      setTableData(tmpSchema);
    }); //getPayinList
  }, []);

  useEffect(() => {
    handleOnLoad();
    Getdatayear().then((data: any) => {
      setSeleteYear(data);
      fnPostGrid(sType[0], company[0], data[0], SYuarter[0], sOrder[0], "5");
    }).finally(() => {
      
    });
    // fnLoad();
    
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
  //   record["QUARTER"] = sReturn[0];
  //   downloadFilePost(
  //     `/LSSIQ053/LSSIQ053Excel`,
  //     "LSS-IQ-053_เปรียบเทียบข้อมูลปี_แต่ละไตรมาส.xlsx",
  //     record
  //   );
  // }

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
    <Container fluid>
      <Row>
        <Col>
          <NavMenu />
          <Card style={{ marginTop: "7rem" }}>
            <Card.Header>LSS-IQ-053 เปรียบเทียบข้อมูลปี แต่ละไตรมาส</Card.Header>
            <Card.Body>
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
                    {/* <option value="0" selected>ทั้งหมด</option> */}
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
                      setReturn([e.target.value]);
                      setQUARTER([e.target.value]);
                    }}
                    value={sReturn}
                  >
                    <option value="1">1</option>
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

                </Col>
                <Col
                  md={1}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    textAlign: "right",
                  }}
                >
                </Col>
              </Row>
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
                    <option value="CRR">ข้อมูลเงินสมทบที่คำนวณได้ตากข้อมูลระบบ CRR</option>
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
                  <option value="0">ทั้งหมด</option>
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
                    quarter={sReturn[0]}
                    IDPage={"LSS-IQ-053"}
                    fileNames={"LSS-IQ-053_เปรียบเทียบข้อมูลปี_แต่ละไตรมาส.xlsx"}
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

              {/* <Row style={{ marginTop: "2rem" }}>
                <Col className="px-4">
                  <Chart
                    chartType="Bar"
                    width="95%"
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
            </Card.Body>
          </Card>


          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flexGrow: 1 }}></div>
          </div>

        </Col>
      </Row>
    </Container>
  );
}
