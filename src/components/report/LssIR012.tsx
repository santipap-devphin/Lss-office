import { useState, useEffect, useCallback } from "react";
import "@sweetalert2/theme-minimal/minimal.scss";
import { downloadFilePost, getCommon, LssIR012List, LssIR012ListWhere } from "../../data";
import { Col, Row } from "react-bootstrap";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";

import NavMenu from "../fragments/NavMenu";
import { DataResponse } from "../../models/common/data-response.model";
import { CompanySelect } from "../../models/common/company-select.model";
import { PrefixSelect } from "../../models/common/prefix-select.model";
import { FaBars } from "react-icons/fa";
import "./default.scss";
import ExportExcel from "./shared/ExportExcel";
import ExportExcelVarious from "./shared/ExportExcelVarious";

const currentYear = new Date().getFullYear();
const yearOptions = Array(10).fill("").map((x, i) => currentYear - i + 543);

export default function LssIR012() {
  const [common, setCommon] = useState<DataResponse>({
    COMPANIES: [],
    PREFIXES: [],
  });

  const [company, setCompany] = useState<string[]>(["0"]);
  const [sQuarter, setSQuarter] = useState<string[]>(["1"]);
  const [sYear, setSYear] = useState<string[]>([yearOptions[0].toString()]);
  const [sNQuarter, setSNQuarte] = useState("ทุกไตรมาส");

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
      COL1: any;
      COL2: any;
      COL3: any;
      COL4: any;
      COL5: any;
      COL6: any;
      COL7: any;
      COL8: any;
      COL9: any;
      // เอาไว้เก็บข้อมูล TYPE = 2
      TCOL1: any;
      TCOL2: any;
      TCOL3: any;
      TCOL4: any;
      TCOL5: any;
      TCOL6: any;
      TCOL7: any;
      TCOL8: any;
      TCOL9: any;
      // เอาไว้เก็บข้อมูล SUM ของ TYPE 2 - 1 = SCOL
      SCOL1: any;
      SCOL2: any;
      SCOL3: any;
      SCOL4: any;
      SCOL5: any;
      SCOL6: any;
      SCOL7: any;
      SCOL8: any;
      SCOL9: any;
    }[]
  >([]);

  const [SumtableData, setSumTableData] = useState<
    {
      // เอาไว้เก็บข้อมูล SUM ของ TYPE 2 - 1 = SCOL
      SumT1COL1: any;
      SumT1COL2: any;
      SumT1COL3: any;
      SumT1COL4: any;
      SumT1COL5: any;
      SumT1COL6: any;
      SumT1COL7: any;
      SumT1COL8: any;
      SumT1COL9: any;
      SumT2COL1: any;
      SumT2COL2: any;
      SumT2COL3: any;
      SumT2COL4: any;
      SumT2COL5: any;
      SumT2COL6: any;
      SumT2COL7: any;
      SumT2COL8: any;
      SumT2COL9: any;
    }[]
  >([]);

  function PostGraph() {
    fnPost(company[0], sYear[0], sQuarter[0]);
  }

  const fnPost = useCallback(async (COMPANY_CODE: string, YEAR: string, QUARTER: string) => {
    var para = JSON.parse(
      `{"COMPANY_CODE":"${COMPANY_CODE}", "YEAR":"${YEAR}",  "QUARTER":"${QUARTER}" }`
    );
    //console.log(para);
    LssIR012ListWhere(para).then((data: any) => {
      let tmpSchema = [];
      let tmpSchemaSum = [];
      var TempCode = "";
      var Tempid = 1;
      var TmpCOL1 = 0; var TmpCOL2 = 0; var TmpCOL3 = 0; var TmpCOL4 = 0; var TmpCOL5 = 0; var TmpCOL6 = 0; var TmpCOL7 = 0; var TmpCOL8 = 0; var TmpCOL9 = 0;
      //ใช้สำหรับเก็บค่า รวมยอด ล่างสุด
      var TmpSumT1COL1 = 0; var TmpSumT1COL2 = 0; var TmpSumT1COL3 = 0; var TmpSumT1COL4 = 0; var TmpSumT1COL5 = 0; var TmpSumT1COL6 = 0; var TmpSumT1COL7 = 0; var TmpSumT1COL8 = 0; var TmpSumT1COL9 = 0;
      var TmpSumT2COL1 = 0; var TmpSumT2COL2 = 0; var TmpSumT2COL3 = 0; var TmpSumT2COL4 = 0; var TmpSumT2COL5 = 0; var TmpSumT2COL6 = 0; var TmpSumT2COL7 = 0; var TmpSumT2COL8 = 0; var TmpSumT2COL9 = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].TYPE == "1") {
          TempCode = data[i].COMPANY_CODE;
          TmpCOL1 = parseFloat(data[i].COL1 == null ? 0 : data[i].COL1);
          TmpCOL2 = parseFloat(data[i].COL2 == null ? 0 : data[i].COL2);
          TmpCOL3 = parseFloat(data[i].COL3 == null ? 0 : data[i].COL3);
          TmpCOL4 = parseFloat(data[i].COL4 == null ? 0 : data[i].COL4);
          TmpCOL5 = parseFloat(data[i].COL5 == null ? 0 : data[i].COL5);
          TmpCOL6 = parseFloat(data[i].COL6 == null ? 0 : data[i].COL6);
          TmpCOL7 = parseFloat(data[i].COL7 == null ? 0 : data[i].COL7);
          TmpCOL8 = parseFloat(data[i].COL8 == null ? 0 : data[i].COL8);
          TmpCOL9 = parseFloat(data[i].COL9 == null ? 0 : data[i].COL9);
          TmpSumT1COL1 = TmpSumT1COL1 + parseFloat(data[i].COL1 == null ? 0 : data[i].COL1);
          TmpSumT1COL2 = TmpSumT1COL2 + parseFloat(data[i].COL2 == null ? 0 : data[i].COL2);
          TmpSumT1COL3 = TmpSumT1COL3 + parseFloat(data[i].COL3 == null ? 0 : data[i].COL3);
          TmpSumT1COL4 = TmpSumT1COL4 + parseFloat(data[i].COL4 == null ? 0 : data[i].COL4);
          TmpSumT1COL5 = TmpSumT1COL5 + parseFloat(data[i].COL5 == null ? 0 : data[i].COL5);
          TmpSumT1COL6 = TmpSumT1COL6 + parseFloat(data[i].COL6 == null ? 0 : data[i].COL6);
          TmpSumT1COL7 = TmpSumT1COL7 + parseFloat(data[i].COL7 == null ? 0 : data[i].COL7);
          TmpSumT1COL8 = TmpSumT1COL8 + parseFloat(data[i].COL8 == null ? 0 : data[i].COL8);
          TmpSumT1COL9 = TmpSumT1COL9 + parseFloat(data[i].COL9 == null ? 0 : data[i].COL9);

        } else if (data[i].TYPE == "2") {
          for (let j = 0; j < data.length; j++) {
            if (data[j].TYPE == "2" && data[i].COMPANY_CODE == data[j].COMPANY_CODE
              && data[i].YEAR == data[j].YEAR
              && data[i].QUARTER == data[j].QUARTER) {
              data[i].COL7 = data[i].COL4 + data[i].COL5 + data[i].COL6;
              data[i].COL9 = data[i].COL7 - data[i].COL8;
              tmpSchema.push({
                id: Tempid,
                COMPANY_CODE: data[j].COMPANY_CODE,
                COMPANY_NAME: data[j].COMPANY_NAME,
                COL1: TmpCOL1.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                COL2: TmpCOL2.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                COL3: TmpCOL3.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                COL4: TmpCOL4.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                COL5: TmpCOL5.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                COL6: TmpCOL6.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                COL7: TmpCOL7.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                COL8: TmpCOL8.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                COL9: TmpCOL9.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL1: parseFloat(data[j].COL1).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL2: parseFloat(data[j].COL2).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL3: parseFloat(data[j].COL3).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL4: parseFloat(data[j].COL4).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL5: parseFloat(data[j].COL5).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL6: parseFloat(data[j].COL6).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL7: parseFloat(data[j].COL7).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL8: parseFloat(data[j].COL8).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL9: parseFloat(data[j].COL9).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL1: (TmpCOL1 - parseFloat(data[j].COL1)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL2: (TmpCOL2 - parseFloat(data[j].COL2)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL3: (TmpCOL3 - parseFloat(data[j].COL3)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL4: (TmpCOL4 - parseFloat(data[j].COL4)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL5: (TmpCOL5 - parseFloat(data[j].COL5)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL6: (TmpCOL6 - parseFloat(data[j].COL6)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL7: (TmpCOL7 - parseFloat(data[j].COL7)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL8: (TmpCOL8 - parseFloat(data[j].COL8)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL9: (TmpCOL9 - parseFloat(data[j].COL9)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
              });

              TmpSumT2COL1 = TmpSumT2COL1 + parseFloat(data[j].COL1);
              TmpSumT2COL2 = TmpSumT2COL2 + parseFloat(data[j].COL2);
              TmpSumT2COL3 = TmpSumT2COL3 + parseFloat(data[j].COL3);
              TmpSumT2COL4 = TmpSumT2COL4 + parseFloat(data[j].COL4);
              TmpSumT2COL5 = TmpSumT2COL5 + parseFloat(data[j].COL5);
              TmpSumT2COL6 = TmpSumT2COL6 + parseFloat(data[j].COL6);
              TmpSumT2COL7 = TmpSumT2COL7 + parseFloat(data[j].COL7);
              TmpSumT2COL8 = TmpSumT2COL8 + parseFloat(data[j].COL8);
              TmpSumT2COL9 = TmpSumT2COL9 + parseFloat(data[j].COL9);
              Tempid = Tempid + 1;
            }
          }

        }

      } //loop i
      setTableData(tmpSchema);
      tmpSchemaSum.push({
        SumT1COL1: TmpSumT1COL1.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT1COL2: TmpSumT1COL2.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT1COL3: TmpSumT1COL3.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT1COL4: TmpSumT1COL4.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT1COL5: TmpSumT1COL5.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT1COL6: TmpSumT1COL6.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT1COL7: TmpSumT1COL7.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT1COL8: TmpSumT1COL8.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT1COL9: TmpSumT1COL9.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL1: TmpSumT2COL1.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL2: TmpSumT2COL2.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL3: TmpSumT2COL3.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL4: TmpSumT2COL4.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL5: TmpSumT2COL5.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL6: TmpSumT2COL6.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL7: TmpSumT2COL7.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL8: TmpSumT2COL8.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL9: TmpSumT2COL9.toLocaleString(undefined, { minimumFractionDigits: 2, }),
      });

      setSumTableData(tmpSchemaSum);
      if (YEAR == "0" && QUARTER != "0") {
        setSNQuarte("ไตรมาส " + QUARTER + " ของทุกปี");
      }
      if (YEAR != "0" && QUARTER == "0") {
        setSNQuarte("ไตรมาส " + YEAR);
      }
      if (YEAR != "0" && QUARTER != "0") {
        setSNQuarte("ไตรมาส " + QUARTER + "/" + YEAR);
      }
      if (YEAR == "0" && QUARTER == "0") {
        setSNQuarte("ทุกไตรมาส");
      }
    }); //getPayinList
  }, []);

  const fnLoad = useCallback(async () => {
    LssIR012List().then((data: any) => {
      setTableData([]);
      setSumTableData([]);
      let tmpSchema = [];
      let tmpSchemaSum = [];
      var TempCode = "";
      var Tempid = 1;
      var TmpCOL1 = 0; var TmpCOL2 = 0; var TmpCOL3 = 0; var TmpCOL4 = 0; var TmpCOL5 = 0; var TmpCOL6 = 0; var TmpCOL7 = 0; var TmpCOL8 = 0; var TmpCOL9 = 0;
      //ใช้สำหรับเก็บค่า รวมยอด ล่างสุด
      var TmpSumT1COL1 = 0; var TmpSumT1COL2 = 0; var TmpSumT1COL3 = 0; var TmpSumT1COL4 = 0; var TmpSumT1COL5 = 0; var TmpSumT1COL6 = 0; var TmpSumT1COL7 = 0; var TmpSumT1COL8 = 0; var TmpSumT1COL9 = 0;
      var TmpSumT2COL1 = 0; var TmpSumT2COL2 = 0; var TmpSumT2COL3 = 0; var TmpSumT2COL4 = 0; var TmpSumT2COL5 = 0; var TmpSumT2COL6 = 0; var TmpSumT2COL7 = 0; var TmpSumT2COL8 = 0; var TmpSumT2COL9 = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].TYPE === "1") {
          TempCode = data[i].COMPANY_CODE;
          TmpCOL1 = parseFloat(data[i].COL1 == null ? 0 : data[i].COL1);
          TmpCOL2 = parseFloat(data[i].COL2 == null ? 0 : data[i].COL2);
          TmpCOL3 = parseFloat(data[i].COL3 == null ? 0 : data[i].COL3);
          TmpCOL4 = parseFloat(data[i].COL4 == null ? 0 : data[i].COL4);
          TmpCOL5 = parseFloat(data[i].COL5 == null ? 0 : data[i].COL5);
          TmpCOL6 = parseFloat(data[i].COL6 == null ? 0 : data[i].COL6);
          TmpCOL7 = parseFloat(data[i].COL7 == null ? 0 : data[i].COL7);
          TmpCOL8 = parseFloat(data[i].COL8 == null ? 0 : data[i].COL8);
          TmpCOL9 = parseFloat(data[i].COL9 == null ? 0 : data[i].COL9);
          TmpSumT1COL1 = TmpSumT1COL1 + parseFloat(data[i].COL1 == null ? 0 : data[i].COL1);
          TmpSumT1COL2 = TmpSumT1COL2 + parseFloat(data[i].COL2 == null ? 0 : data[i].COL2);
          TmpSumT1COL3 = TmpSumT1COL3 + parseFloat(data[i].COL3 == null ? 0 : data[i].COL3);
          TmpSumT1COL4 = TmpSumT1COL4 + parseFloat(data[i].COL4 == null ? 0 : data[i].COL4);
          TmpSumT1COL5 = TmpSumT1COL5 + parseFloat(data[i].COL5 == null ? 0 : data[i].COL5);
          TmpSumT1COL6 = TmpSumT1COL6 + parseFloat(data[i].COL6 == null ? 0 : data[i].COL6);
          TmpSumT1COL7 = TmpSumT1COL7 + parseFloat(data[i].COL7 == null ? 0 : data[i].COL7);
          TmpSumT1COL8 = TmpSumT1COL8 + parseFloat(data[i].COL8 == null ? 0 : data[i].COL8);
          TmpSumT1COL9 = TmpSumT1COL9 + parseFloat(data[i].COL9 == null ? 0 : data[i].COL9);
        } else if (data[i].TYPE === "2") {
          for (let j = 0; j < data.length; j++) {
            if (data[j].TYPE === "2" && data[i].COMPANY_CODE === data[j].COMPANY_CODE) {
              console.log('Type = 2');
              console.log(TmpCOL1);
              tmpSchema.push({
                id: Tempid,
                COMPANY_CODE: data[j].COMPANY_CODE,
                COMPANY_NAME: data[j].COMPANY_NAME,
                COL1: TmpCOL1.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                COL2: TmpCOL2.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                COL3: TmpCOL3.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                COL4: TmpCOL4.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                COL5: TmpCOL5.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                COL6: TmpCOL6.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                COL7: TmpCOL7.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                COL8: TmpCOL8.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                COL9: TmpCOL9.toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL1: parseFloat(data[j].COL1).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL2: parseFloat(data[j].COL2).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL3: parseFloat(data[j].COL3).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL4: parseFloat(data[j].COL4).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL5: parseFloat(data[j].COL5).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL6: parseFloat(data[j].COL6).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL7: parseFloat(data[j].COL7).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL8: parseFloat(data[j].COL8).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                TCOL9: parseFloat(data[j].COL9).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL1: (TmpCOL1 - parseFloat(data[j].COL1)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL2: (TmpCOL2 - parseFloat(data[j].COL2)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL3: (TmpCOL3 - parseFloat(data[j].COL3)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL4: (TmpCOL4 - parseFloat(data[j].COL4)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL5: (TmpCOL5 - parseFloat(data[j].COL5)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL6: (TmpCOL6 - parseFloat(data[j].COL6)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL7: (TmpCOL7 - parseFloat(data[j].COL7)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL8: (TmpCOL8 - parseFloat(data[j].COL8)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
                SCOL9: (TmpCOL9 - parseFloat(data[j].COL9)).toLocaleString(undefined, { minimumFractionDigits: 2, }),
              });

              TmpSumT2COL1 = TmpSumT2COL1 + parseFloat(data[j].COL1);
              TmpSumT2COL2 = TmpSumT2COL2 + parseFloat(data[j].COL2);
              TmpSumT2COL3 = TmpSumT2COL3 + parseFloat(data[j].COL3);
              TmpSumT2COL4 = TmpSumT2COL4 + parseFloat(data[j].COL4);
              TmpSumT2COL5 = TmpSumT2COL5 + parseFloat(data[j].COL5);
              TmpSumT2COL6 = TmpSumT2COL6 + parseFloat(data[j].COL6);
              TmpSumT2COL7 = TmpSumT2COL7 + parseFloat(data[j].COL7);
              TmpSumT2COL8 = TmpSumT2COL8 + parseFloat(data[j].COL8);
              TmpSumT2COL9 = TmpSumT2COL9 + parseFloat(data[j].COL9);
              Tempid = Tempid + 1;
            }
          }

        }

      } //loop i
      setTableData(tmpSchema);
      tmpSchemaSum.push({
        SumT1COL1: TmpSumT1COL1.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT1COL2: TmpSumT1COL2.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT1COL3: TmpSumT1COL3.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT1COL4: TmpSumT1COL4.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT1COL5: TmpSumT1COL5.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT1COL6: TmpSumT1COL6.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT1COL7: TmpSumT1COL7.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT1COL8: TmpSumT1COL8.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT1COL9: TmpSumT1COL9.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL1: TmpSumT2COL1.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL2: TmpSumT2COL2.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL3: TmpSumT2COL3.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL4: TmpSumT2COL4.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL5: TmpSumT2COL5.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL6: TmpSumT2COL6.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL7: TmpSumT2COL7.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL8: TmpSumT2COL8.toLocaleString(undefined, { minimumFractionDigits: 2, }),
        SumT2COL9: TmpSumT2COL9.toLocaleString(undefined, { minimumFractionDigits: 2, }),
      });
      setSumTableData(tmpSchemaSum);

    }); //getPayinList
  }, []);

  useEffect(() => {
    handleOnLoad();
    fnPost(company[0], sYear[0], sQuarter[0]);
    //fnLoad();
  }, []);

  const header = [
    { header: '', key: 'id', width: 5, style: { alignment: { horizontal: 'center' }, numFmt: '#00' } },
    { header: '', key: 'COMPANY_CODE', width: 10, style: { alignment: { horizontal: 'center' }, numFmt: '#00' } },
    { header: '', key: 'COMPANY_NAME', width: 65, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: '', key: 'col1', width: 40, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
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
            &nbsp;&nbsp;                     LSS-IR-012 รายงานแสดงการเปรียบเทียบข้อมูลเงินสมทบ
            ระหว่างยอดเงินสมทบตามการยื่นแบบกับยอดเงินสมทบที่คำนวณ
            <br />
            ได้จากเบี้ยประกันภัยรับโดยตรงจากระบบ CRR
            (แสดงรายละเอียดการคำนวณ) ประกันวินาศภัย
          </h5>
          <div style={{ height: 400, width: "100%" }}>
            <Row style={{ marginBottom: 10, marginTop: 20 }}>
              <Col sm={6} lg={1} style={{ textAlign: "right" }}></Col>
              <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                บริษัทประกันวินาศภัย
              </Col>
              <Col sm={6} lg={2}>
                <select
                  className="form-select"
                  name="COMPANY"
                  onChange={(e) => {
                    setCompany([e.target.value]);
                  }}
                >
                  <option value="0">ทุกบริษัท</option>
                  {common.COMPANIES.filter(x => x.COMPANY_TYPE_CODE === "NONLIFE").map((c) => (
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
                  {/* <option value="0">เลือกไตรมาส</option> */}
                  <option value="1" selected>1</option>
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
                  quarterAndYear={`ไตรมาส ${sQuarter[0]}/${sYear[0]}`}
                  IDPage={"LSS-IR-012"}
                  fileNames={"LSS-IR-012_LSS-IR-012_รายงานแสดงการเปรียบเทียบข้อมูลเงินสมทบระหว่างยอดเงินสมทบตามการยื่นแบบกับยอดเงินสมทบที่คำนวณ.xlsx"}
                ></ExportExcelVarious>
              </Col>
            </Row>

            <Row>
              <Col className="d-flex justify-content-center">
                <div style={{ width: "99.5rem" }}>
                  <table id="table1"
                    style={{
                      border: "1px solid black", background: "#ffffff", width: "99.5rem"
                    }}
                  >
                    <thead>
                      <tr className="tbhead">
                        <th rowSpan={2} style={{ verticalAlign: "top", textAlign: "center", width: "3rem" }} >ลำดับ</th>
                        <th rowSpan={2} style={{ verticalAlign: "top", textAlign: "center", width: "4.5rem" }}  >รหัส</th>
                        <th rowSpan={2} style={{ verticalAlign: "top", textAlign: "center", width: "20rem" }} >บริษัท</th>
                        <th colSpan={9} style={{ textAlign: "center", width: "72rem" }}> {sNQuarter}</th>
                      </tr>
                      {/* <tr className="tbhead">
                      <th style={{ width: "8rem" }}> เบี้ยประกันภัย<br />ปีแรก<br />(1)</th>
                      <th style={{ width: "8rem" }}>เงินสมทบ<br />เบี้ยประกันภัย<br /> ปีแรกอัตรา 0.3% <br />(2)</th>
                      <th style={{ width: "8rem" }}>เบี้ยประกันภัย<br />ปีต่อไป<br />(3)</th>
                      <th style={{ width: "8rem" }}> เงินสมทบ<br />เบี้ยประกันภัย<br />ปีต่อไปอัตรา  0.15% <br />(4)</th>
                      <th style={{ width: "8rem" }}>เบี้ยประกันภัย<br />ชำระครั้งเดียว<br />(5)</th>
                      <th style={{ width: "8rem" }}> เงินสมทบเบี้ยฯ<br />ชำระครั้งเดียวอัตรา  0.15%<br />(6)</th>
                      <th style={{ width: "8rem" }}>กรมธรรม์ประกันภัย<br />แบบควบการลงทุน<br />(7)</th>
                      <th style={{ width: "8rem" }}> เงินสมทบแบบควบ<br />การลงทุนอัตรา  0.1%<br />(8)</th>
                      <th style={{ width: "8rem" }}>รวมเงินสมทบ<br />ทุกประเภท<br />(9)=(2)+(4)+(6)+(8)</th>
                    </tr> */}

                      <tr className="tbhead">
                        <th style={{ width: "8rem" }}> เบี้ยประกันภัย<br />รับโดยตรงรวม<br />จากต้นปีจนถึง<br />ไตรมาสที่แล้ว <br />(1)
                        </th>
                        <th style={{ width: "8rem" }}>เบี้ยประกันภัยรับ<br />โดยตรงในไตรมาสนี้<br />  (2)</th>
                        <th style={{ width: "8rem" }}> รวมเบี้ย<br />ประกันภัยรับ<br />โดยตรงจนถึง <br />ไตรมาสนี้ <br />(3) = (1)+(2)</th>

                        <th style={{ width: "8rem" }}> เบี้ยประกันภัยรับ <br />โดยตรง 1,000 <br />ลบ. แรก <br />อัตรา 0.30%<br />(4)</th>

                        <th style={{ width: "8rem" }}> เบี้ยประกันภัยรับ <br />โดยตรงส่วนที่<br />เกิน 1,000 ลบ. <br />แต่ไม่เกิน 5,000 ลบ.<br />อัตรา 0.25%<br />(5)</th>
                        <th style={{ width: "8rem" }}>เบี้ยประกันภัยรับ<br />โดยตรงส่วนที่<br />เกิน 5,000 ลบ. <br />อัตรา 0.20%<br />(ุ6)</th>
                        <th style={{ width: "8rem" }}>รวมเงินสมทบ<br />สะสมจนถึงไตรมาสนี้<br />(7)=(4)+(5)+(6)</th>
                        <th style={{ width: "8rem" }}> เงินสบทบสะสม<br />ในไตรมาสที่แล้ว <br />(8)</th>
                        <th style={{ width: "8rem" }}>เงินสมทบที่ต้อง<br />นำส่งในไตรมาสนี้ <br />(9) = (7)-(8)</th>
                      </tr>

                    </thead>
                    <tbody>
                      {tableData.map((todo) => (
                        <><tr>
                          <td className="tbcenter" style={{ verticalAlign: "top", width: "3rem" }}>{todo.id}</td>
                          <td className="tbcenter" style={{ verticalAlign: "top", width: "4.5rem" }}>{todo.COMPANY_CODE}</td>
                          <td style={{ verticalAlign: "top", textAlign: "start", width: "20rem" }}>{todo.COMPANY_NAME}</td>
                          <td colSpan={9} style={{ width: "72rem" }}>&nbsp; </td>
                        </tr><tr>
                            <td colSpan={2}></td>
                            <td style={{ verticalAlign: "top", textAlign: "start", width: "20rem" }}> ยอดตามแบบนำส่งเงินสมทบที่บริษัทนำส่ง </td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.COL1}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.COL2}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.COL3}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.COL4}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.COL5}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.COL6}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.COL7}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.COL8}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.COL9}</td>
                          </tr><tr>
                            <td colSpan={2}></td>
                            <td style={{ verticalAlign: "top", textAlign: "start", width: "20rem" }}>  ยอดตามการคำนวณเงินสมทบจากเบี้ยประกันภัยรับโดยตรงของรายงานทางการเงิน  </td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.TCOL1}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.TCOL2}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.TCOL3}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.TCOL4}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.TCOL5}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.TCOL6}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.TCOL7}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.TCOL8}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.TCOL9}</td>
                          </tr><tr>
                            <td colSpan={2}></td>
                            <td style={{ verticalAlign: "top", textAlign: "start", width: "20rem" }}> <b>ผลต่าง </b> </td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}><b>{todo.SCOL1}</b></td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}><b>{todo.SCOL2}</b></td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}><b>{todo.SCOL3}</b></td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}><b>{todo.SCOL4}</b></td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}><b>{todo.SCOL5}</b></td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}><b>{todo.SCOL6}</b></td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}><b>{todo.SCOL7}</b></td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}><b>{todo.SCOL8}</b></td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}><b>{todo.SCOL9}</b></td>
                          </tr></>
                      ))}
                      {SumtableData.map((todo) => (
                        <><tr className="tbsum">
                          <td colSpan={3} style={{ verticalAlign: "top", textAlign: "start" }}>  รวมยอดตามแบบนำส่งเงินสมทบที่บริษัทนำส่ง   </td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT1COL1}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT1COL2}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT1COL3}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT1COL4}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT1COL5}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT1COL6}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT1COL7}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT1COL8}</td>
                          <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT1COL9}</td>
                        </tr><tr className="tbsum">

                            <td colSpan={3} style={{ verticalAlign: "top", textAlign: "start" }}> รวมยอดตามการคำนวณเงินสมทบจากเบี้ยประกันภัยรับโดยตรงของรายงานทางการเงิน   </td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT2COL1}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT2COL2}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT2COL3}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT2COL4}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT2COL5}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT2COL6}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT2COL7}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT2COL8}</td>
                            <td className="tbcentbnumter" style={{ width: "8rem" }}>{todo.SumT2COL9}</td>
                          </tr></>
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
