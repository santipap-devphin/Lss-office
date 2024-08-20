import { Downloading } from "@mui/icons-material";
import Button from "@mui/material/Button";
import * as FileSaver from 'file-saver';
import * as Excel from "exceljs";
import moment from "moment";
import { useState } from "react";
const ExportExcel = (event: any) => {
  // const [data, setData] = useState<any[]>([]);
  const generateExcel = () => {
    const data = [...event.data];
    console.log(data);
    const IDMenu = event.IDMenu;
    let running: number = 1;
    var result = data.map((m: any) => {
      const A = [];
      const B = [];
      for (const [key, value] of Object.entries(m)) {
        if ((value === "S") || (value === "Q") || (value === "F")) {
          let STATUS = "";
          if (value === "S") { STATUS = " สำเร็จ"; }
          if (value === "Q") { STATUS = " รอดำเนินการ "; }
          if (value === "F") { STATUS = " ไม่สำเร็จ "; }
          const T = JSON.parse(`{"${key}":"${STATUS != undefined ? STATUS : 0}"}`);
          B.push(T);
        } else if (isDate(value) === true) {
          const datetime: any = value;
          const date = moment(datetime).add(543, "y").format("DD/MM/YYYY");
          const T = JSON.parse(`{"${key}":"${date != undefined ? date : ''}"}`);
          B.push(T);
        } else if (isNum(value) === false) {
          const T = JSON.parse(`{"${key}":"${value != undefined ? value : ''}"}`);
          B.push(T);
        } else if (value === null) {
          const T = JSON.parse(`{"${key}":"${value != undefined ? value : ''}"}`);
          B.push(T);
        } else if (typeof value !== "string") {
          const T = JSON.parse(`{"${key}"` + ":" + `${value != undefined ? value : 0}}`);
          B.push(T);
        } else {
          const T = JSON.parse(`{"${key}":"${value != undefined ? value : ''}"}`);
          B.push(T);
        }
      }
      const S = Object.assign({}, ...B, { running: running });
      running++;
      A.push(S);
      return A;
    });
    const header = event.headers;
    const workbook = new Excel.Workbook();
    var worksheet = workbook.addWorksheet('Sheet', { properties: { tabColor: { argb: 'FFC0000' } } });
    worksheet.columns = event.headers;
    // worksheet.getColumn(1).values[2]
    for (let i = 0; i < result.length; i++) {
      for (let b = 0; b < result[i].length; b++) {
        worksheet.addRow(result[i][b]);
      }
    };
    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(1).getCell(i + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cccccc' },
        bgColor: { argb: 'D6D6D6' }
      };
    }
    worksheet.getRow(1).alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };

    const excelBuffer: any = workbook.xlsx.writeBuffer();
    workbook.xlsx.writeBuffer()
      .then(function (buffer) {
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(data, event.fileNames);
      });
  }

  const isNum = (str: any) => {
    if (typeof str === "string") {
      return !isNaN(Number(str));
    }
  }

  const isDate = (date: any) => {
    if (typeof date === "string") {
      const yearArr = [
        { year: "2019" },
        { year: "2020" },
        { year: "2021" },
        { year: "2022" },
        { year: "2023" },
        { year: "2024" },
        { year: "2025" },
        { year: "2026" },
        { year: "2027" },
        { year: "2028" },
        { year: "2029" },
        { year: "2030" },
        { year: "2031" },
        { year: "2032" },
        { year: "2033" },
        { year: "2034" },
        { year: "2035" },
        { year: "2036" },
        { year: "2037" },
        { year: "2038" },
        { year: "2039" },
        { year: "2040" },
      ]
      const yearMonth = [
        { month: "01" },
        { month: "02" },
        { month: "03" },
        { month: "04" },
        { month: "05" },
        { month: "06" },
        { month: "07" },
        { month: "08" },
        { month: "09" },
        { month: "10" },
        { month: "11" },
        { month: "12" },
      ]
      for (let i = 0; i < yearArr.length; i++) {
        for (let b = 0; b < yearMonth.length; b++) {
          const chkDate = date.includes(`${yearArr[i].year}-${yearMonth[b].month}`);
          if (chkDate === true) {
            return true;
          }
        }
      }
      return false;
    }
  }

  return (
    <Button
      onClick={() => generateExcel()}
      variant="contained"
      startIcon={<Downloading />}
    >
      Excel
    </Button>
  );
};

export default ExportExcel;