import { Downloading } from "@mui/icons-material";
import Button from "@mui/material/Button";
import * as FileSaver from 'file-saver';
import * as Excel from "exceljs";
import moment from "moment";
import { useState } from "react";
const ExportExcelVarious = (event: any) => {
  const CheckIDPage = () => {
    const ID = event.IDPage;
    if (ID === "LSS-IR-011") {
      generateExcelLSSIR011();
    } else if (ID === "LSS-IR-012") {
      generateExcelLSSIR012();
    } else if (ID === "LSS-IR-013") {
      generateExcelLSSIR013();
    } else if (ID === "LSS-IR-014") {
      generateExcelLSSIR014();
    } else if (ID === "LSS-IR-015") {
      generateExcelLSSIR015();
    } else if (ID === "LSS-IR-016") {
      generateExcelLSSIR016();
    } else if (ID === "LSS-IR-017") {
      generateExcelLSSIR017();
    } else if (ID === "LSS-IR-020") {
      generateExcelLSSIR020();
    } else if (ID === "LSS-IR-021") {
      generateExcelLSSIR021();
    } else if (ID === "LSS-IQ-051") {
      generateExcelLSSIQ051();
    } else if (ID === "LSS-IQ-053") {
      generateExcelLSSIQ053();
    }
  }
  const generateExcelLSSIR011 = () => {
    const data = [...event.data];
    const dataSum = [...event.dataSum]
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
          const T = JSON.parse(`{"${key}":"${(date != undefined) || (date != null) ? date : ''}"}`);
          B.push(T);
        } else if (isNum(value) === false) {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
          B.push(T);
        } else if ((typeof value !== "string") || (value != null)) {
          const T = JSON.parse(`{"${key}"` + ":" + `${(value != undefined) || (value != null) ? value : 0}}`);
          B.push(T);
        } else {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
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
    var worksheet = workbook.addWorksheet('Sheet', { properties: { tabColor: { argb: 'FFC0000' } }, headerFooter: { firstHeader: "Hello Exceljs", firstFooter: "Hello World" } });

    worksheet.columns = event.headers;
    worksheet.getCell('H1').value = event.quarterAndYear;
    worksheet.getCell('A2').value = 'ลำดับ';
    worksheet.getCell('B2').value = 'รหัส';
    worksheet.getCell('C2').value = 'บริษัท';
    worksheet.getCell('D2').value = 'เบี้ยประกันภัยปีแรก(1)';
    worksheet.getCell('E2').value = 'เงินสมทบเบี้ยประกันภัยปีแรกอัตรา 0.3%(2)';
    worksheet.getCell('F2').value = 'เบี้ยประกันภัยปีต่อไป(3)';
    worksheet.getCell('G2').value = 'เงินสมทบเบี้ยประกันภัยปีต่อไปอัตรา 0.15%(4)';
    worksheet.getCell('H2').value = 'เบี้ยประกันภัยชำระครั้งเดียว(5)';
    worksheet.getCell('I2').value = 'เงินสมทบเบี้ยฯชำระครั้งเดียวอัตรา 0.15%(6)';
    worksheet.getCell('J2').value = 'กรมธรรม์ประกันภัยแบบควบการลงทุน(7)';
    worksheet.getCell('K2').value = 'เงินสมทบแบบควบการลงทุนอัตรา 0.1%(8)';
    worksheet.getCell('L2').value = 'รวมเงินสมทบทุกประเภท(9)=(2)+(4)+(6)+(8)';
    let collRuning = 3;
    for (let i = 0; i < result.length; i++) {
      for (let b = 0; b < result[i].length; b++) {
        worksheet.getCell('A' + collRuning).value = result[i][b].id;
        worksheet.getCell('B' + collRuning).value = result[i][b].COMPANY_CODE;
        worksheet.getCell('C' + collRuning).value = result[i][b].COMPANY_NAME;
        worksheet.getCell('C' + (collRuning + 1)).value = 'ยอดตามแบบนำส่งเงินสมทบที่บริษัทนำส่ง	';
        worksheet.getCell('D' + (collRuning + 1)).value = result[i][b].COL1;
        worksheet.getCell('E' + (collRuning + 1)).value = result[i][b].COL2;
        worksheet.getCell('F' + (collRuning + 1)).value = result[i][b].COL3;
        worksheet.getCell('G' + (collRuning + 1)).value = result[i][b].COL4;
        worksheet.getCell('H' + (collRuning + 1)).value = result[i][b].COL5;
        worksheet.getCell('I' + (collRuning + 1)).value = result[i][b].COL6;
        worksheet.getCell('J' + (collRuning + 1)).value = result[i][b].COL7;
        worksheet.getCell('K' + (collRuning + 1)).value = result[i][b].COL8;
        worksheet.getCell('L' + (collRuning + 1)).value = result[i][b].COL9;
        worksheet.getCell('C' + (collRuning + 2)).value = 'ยอดตามการคำนวณเงินสมทบจากเบี้ยประกันภัยรับโดยตรงของรายงานทางการเงิน';
        worksheet.getCell('D' + (collRuning + 2)).value = result[i][b].TCOL1;
        worksheet.getCell('E' + (collRuning + 2)).value = result[i][b].TCOL2;
        worksheet.getCell('F' + (collRuning + 2)).value = result[i][b].TCOL3;
        worksheet.getCell('G' + (collRuning + 2)).value = result[i][b].TCOL4;
        worksheet.getCell('H' + (collRuning + 2)).value = result[i][b].TCOL5;
        worksheet.getCell('I' + (collRuning + 2)).value = result[i][b].TCOL6;
        worksheet.getCell('J' + (collRuning + 2)).value = result[i][b].TCOL7;
        worksheet.getCell('K' + (collRuning + 2)).value = result[i][b].TCOL8;
        worksheet.getCell('L' + (collRuning + 2)).value = result[i][b].TCOL9;
        worksheet.getCell('C' + (collRuning + 3)).value = 'ผลต่าง';
        worksheet.getCell('D' + (collRuning + 3)).value = result[i][b].SCOL1;
        worksheet.getCell('E' + (collRuning + 3)).value = result[i][b].SCOL2;
        worksheet.getCell('F' + (collRuning + 3)).value = result[i][b].SCOL3;
        worksheet.getCell('G' + (collRuning + 3)).value = result[i][b].SCOL4;
        worksheet.getCell('H' + (collRuning + 3)).value = result[i][b].SCOL5;
        worksheet.getCell('I' + (collRuning + 3)).value = result[i][b].SCOL6;
        worksheet.getCell('J' + (collRuning + 3)).value = result[i][b].SCOL7;
        worksheet.getCell('K' + (collRuning + 3)).value = result[i][b].SCOL8;
        worksheet.getCell('L' + (collRuning + 3)).value = result[i][b].SCOL9;
      }
      collRuning += 4;
    };
    worksheet.getCell('C' + collRuning).value = 'รวมยอดตามแบบนำส่งเงินสมทบที่บริษัทนำส่ง';
    worksheet.getCell('D' + collRuning).value = dataSum[0].SumT1COL1;
    worksheet.getCell('E' + collRuning).value = dataSum[0].SumT1COL2;
    worksheet.getCell('F' + collRuning).value = dataSum[0].SumT1COL3;
    worksheet.getCell('G' + collRuning).value = dataSum[0].SumT1COL4;
    worksheet.getCell('H' + collRuning).value = dataSum[0].SumT1COL5;
    worksheet.getCell('I' + collRuning).value = dataSum[0].SumT1COL6;
    worksheet.getCell('J' + collRuning).value = dataSum[0].SumT1COL7;
    worksheet.getCell('K' + collRuning).value = dataSum[0].SumT1COL8;
    worksheet.getCell('L' + collRuning).value = dataSum[0].SumT1COL9;
    worksheet.getCell('C' + (collRuning + 1)).value = 'รวมยอดตามการคำนวณเงินสมทบจากเบี้ยประกันภัยรับโดยตรงของรายงานทางการเงิน';
    worksheet.getCell('D' + (collRuning + 1)).value = dataSum[0].SumT2COL1;
    worksheet.getCell('E' + (collRuning + 1)).value = dataSum[0].SumT2COL2;
    worksheet.getCell('F' + (collRuning + 1)).value = dataSum[0].SumT2COL3;
    worksheet.getCell('G' + (collRuning + 1)).value = dataSum[0].SumT2COL4;
    worksheet.getCell('H' + (collRuning + 1)).value = dataSum[0].SumT2COL5;
    worksheet.getCell('I' + (collRuning + 1)).value = dataSum[0].SumT2COL6;
    worksheet.getCell('J' + (collRuning + 1)).value = dataSum[0].SumT2COL7;
    worksheet.getCell('K' + (collRuning + 1)).value = dataSum[0].SumT2COL8;
    worksheet.getCell('L' + (collRuning + 1)).value = dataSum[0].SumT2COL9;
    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(1).getCell(i + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cccccc' },
        bgColor: { argb: 'D6D6D6' }
      };
    }
    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(2).getCell(i + 1).fill = {
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
    worksheet.getRow(2).alignment = {
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

  const generateExcelLSSIR012 = () => {
    const data = [...event.data];
    const dataSum = [...event.dataSum]
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
          const T = JSON.parse(`{"${key}":"${(date != undefined) || (date != null) ? date : ''}"}`);
          B.push(T);
        } else if (isNum(value) === false) {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
          B.push(T);
        } else if ((typeof value !== "string") || (value != null)) {
          const T = JSON.parse(`{"${key}"` + ":" + `${(value != undefined) || (value != null) ? value : 0}}`);
          B.push(T);
        } else {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
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
    var worksheet = workbook.addWorksheet('Sheet', { properties: { tabColor: { argb: 'FFC0000' } }, headerFooter: { firstHeader: "Hello Exceljs", firstFooter: "Hello World" } });

    worksheet.columns = event.headers;
    worksheet.getCell('H1').value = event.quarterAndYear;
    worksheet.getCell('A2').value = 'ลำดับ';
    worksheet.getCell('B2').value = 'รหัส';
    worksheet.getCell('C2').value = 'บริษัท';
    worksheet.getCell('D2').value = 'เบี้ยประกันภัยรับโดยตรงรวมจากต้นปีจนถึงไตรมาสที่แล้ว(1)';
    worksheet.getCell('E2').value = 'เบี้ยประกันภัยรับโดยตรงในไตรมาสนี้(2)';
    worksheet.getCell('F2').value = 'รวมเบี้ยประกันภัยรับโดยตรงจนถึงไตรมาสนี้(3) = (1)+(2)';
    worksheet.getCell('G2').value = 'เบี้ยประกันภัยรับโดยตรง 1,000ลบ. แรกอัตรา 0.30%(4)';
    worksheet.getCell('H2').value = 'เบี้ยประกันภัยรับโดยตรงส่วนที่เกิน 1,000 ลบ.แต่ไม่เกิน 5,000 ลบ.อัตรา 0.25%(5)';
    worksheet.getCell('I2').value = 'เบี้ยประกันภัยรับโดยตรงส่วนที่เกิน 5,000 ลบ.อัตรา 0.20%(ุ6))';
    worksheet.getCell('J2').value = 'รวมเงินสมทบสะสมจนถึงไตรมาสนี้(7)=(4)+(5)+(6)';
    worksheet.getCell('K2').value = 'เงินสบทบสะสมในไตรมาสที่แล้ว(8)';
    worksheet.getCell('L2').value = 'เงินสมทบที่ต้องนำส่งในไตรมาสนี้(9) = (7)-(8)';
    let collRuning = 3;
    for (let i = 0; i < result.length; i++) {
      for (let b = 0; b < result[i].length; b++) {
        worksheet.getCell('A' + collRuning).value = result[i][b].id;
        worksheet.getCell('B' + collRuning).value = result[i][b].COMPANY_CODE;
        worksheet.getCell('C' + collRuning).value = result[i][b].COMPANY_NAME;
        worksheet.getCell('C' + (collRuning + 1)).value = 'ยอดตามแบบนำส่งเงินสมทบที่บริษัทนำส่ง	';
        worksheet.getCell('D' + (collRuning + 1)).value = result[i][b].COL1;
        worksheet.getCell('E' + (collRuning + 1)).value = result[i][b].COL2;
        worksheet.getCell('F' + (collRuning + 1)).value = result[i][b].COL3;
        worksheet.getCell('G' + (collRuning + 1)).value = result[i][b].COL4;
        worksheet.getCell('H' + (collRuning + 1)).value = result[i][b].COL5;
        worksheet.getCell('I' + (collRuning + 1)).value = result[i][b].COL6;
        worksheet.getCell('J' + (collRuning + 1)).value = result[i][b].COL7;
        worksheet.getCell('K' + (collRuning + 1)).value = result[i][b].COL8;
        worksheet.getCell('L' + (collRuning + 1)).value = result[i][b].COL9;
        worksheet.getCell('C' + (collRuning + 2)).value = 'ยอดตามการคำนวณเงินสมทบจากเบี้ยประกันภัยรับโดยตรงของรายงานทางการเงิน';
        worksheet.getCell('D' + (collRuning + 2)).value = result[i][b].TCOL1;
        worksheet.getCell('E' + (collRuning + 2)).value = result[i][b].TCOL2;
        worksheet.getCell('F' + (collRuning + 2)).value = result[i][b].TCOL3;
        worksheet.getCell('G' + (collRuning + 2)).value = result[i][b].TCOL4;
        worksheet.getCell('H' + (collRuning + 2)).value = result[i][b].TCOL5;
        worksheet.getCell('I' + (collRuning + 2)).value = result[i][b].TCOL6;
        worksheet.getCell('J' + (collRuning + 2)).value = result[i][b].TCOL7;
        worksheet.getCell('K' + (collRuning + 2)).value = result[i][b].TCOL8;
        worksheet.getCell('L' + (collRuning + 2)).value = result[i][b].TCOL9;
        worksheet.getCell('C' + (collRuning + 3)).value = 'ผลต่าง';
        worksheet.getCell('D' + (collRuning + 3)).value = result[i][b].SCOL1;
        worksheet.getCell('E' + (collRuning + 3)).value = result[i][b].SCOL2;
        worksheet.getCell('F' + (collRuning + 3)).value = result[i][b].SCOL3;
        worksheet.getCell('G' + (collRuning + 3)).value = result[i][b].SCOL4;
        worksheet.getCell('H' + (collRuning + 3)).value = result[i][b].SCOL5;
        worksheet.getCell('I' + (collRuning + 3)).value = result[i][b].SCOL6;
        worksheet.getCell('J' + (collRuning + 3)).value = result[i][b].SCOL7;
        worksheet.getCell('K' + (collRuning + 3)).value = result[i][b].SCOL8;
        worksheet.getCell('L' + (collRuning + 3)).value = result[i][b].SCOL9;
      }
      collRuning += 4;
    };
    worksheet.getCell('C' + collRuning).value = 'รวมยอดตามแบบนำส่งเงินสมทบที่บริษัทนำส่ง';
    worksheet.getCell('D' + collRuning).value = dataSum[0].SumT1COL1;
    worksheet.getCell('E' + collRuning).value = dataSum[0].SumT1COL2;
    worksheet.getCell('F' + collRuning).value = dataSum[0].SumT1COL3;
    worksheet.getCell('G' + collRuning).value = dataSum[0].SumT1COL4;
    worksheet.getCell('H' + collRuning).value = dataSum[0].SumT1COL5;
    worksheet.getCell('I' + collRuning).value = dataSum[0].SumT1COL6;
    worksheet.getCell('J' + collRuning).value = dataSum[0].SumT1COL7;
    worksheet.getCell('K' + collRuning).value = dataSum[0].SumT1COL8;
    worksheet.getCell('L' + collRuning).value = dataSum[0].SumT1COL9;
    worksheet.getCell('C' + (collRuning + 1)).value = 'รวมยอดตามการคำนวณเงินสมทบจากเบี้ยประกันภัยรับโดยตรงของรายงานทางการเงิน';
    worksheet.getCell('D' + (collRuning + 1)).value = dataSum[0].SumT2COL1;
    worksheet.getCell('E' + (collRuning + 1)).value = dataSum[0].SumT2COL2;
    worksheet.getCell('F' + (collRuning + 1)).value = dataSum[0].SumT2COL3;
    worksheet.getCell('G' + (collRuning + 1)).value = dataSum[0].SumT2COL4;
    worksheet.getCell('H' + (collRuning + 1)).value = dataSum[0].SumT2COL5;
    worksheet.getCell('I' + (collRuning + 1)).value = dataSum[0].SumT2COL6;
    worksheet.getCell('J' + (collRuning + 1)).value = dataSum[0].SumT2COL7;
    worksheet.getCell('K' + (collRuning + 1)).value = dataSum[0].SumT2COL8;
    worksheet.getCell('L' + (collRuning + 1)).value = dataSum[0].SumT2COL9;
    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(1).getCell(i + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cccccc' },
        bgColor: { argb: 'D6D6D6' }
      };
    }
    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(2).getCell(i + 1).fill = {
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
    worksheet.getRow(2).alignment = {
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

  const generateExcelLSSIR013 = () => {
    const data = [...event.data];
    const dataSum = [...event.dataSum];
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
          const T = JSON.parse(`{"${key}":"${(date != undefined) || (date != null) ? date : ''}"}`);
          B.push(T);
        } else if (isNum(value) === false) {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
          B.push(T);
        } else if ((typeof value !== "string") || (value != null)) {
          const T = JSON.parse(`{"${key}"` + ":" + `${(value != undefined) || (value != null) ? value : 0}}`);
          B.push(T);
        } else {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
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
    var worksheet = workbook.addWorksheet('Sheet', { properties: { tabColor: { argb: 'FFC0000' } }, headerFooter: { firstHeader: "Hello Exceljs", firstFooter: "Hello World" } });

    worksheet.columns = event.headers;
    worksheet.getCell('E1').value = event.quarterAndYear;
    worksheet.getCell('A2').value = 'ลำดับ';
    worksheet.getCell('B2').value = 'รหัส';
    worksheet.getCell('C2').value = 'บริษัท';
    worksheet.getCell('D2').value = 'ยอดตามแบบนำส่ง';
    worksheet.getCell('E2').value = 'ตามยอดการคำนวณ';
    worksheet.getCell('F2').value = 'ส่งเกิน(ขาด)';
    let collRuning = 3;
    for (let i = 0; i < result.length; i++) {
      for (let b = 0; b < result[i].length; b++) {
        worksheet.getCell('A' + collRuning).value = result[i][b].id;
        worksheet.getCell('B' + collRuning).value = result[i][b].COMPANY_CODE;
        worksheet.getCell('C' + collRuning).value = result[i][b].COMPANY_NAME;
        worksheet.getCell('D' + collRuning).value = result[i][b].Q1_AMOUNT;
        worksheet.getCell('E' + collRuning).value = result[i][b].Q1_CRR_AMOUNT;
        worksheet.getCell('F' + collRuning).value = result[i][b].Q1_DIFF;
      }
      collRuning++;
    };
    worksheet.getCell('C' + collRuning).value = 'รวม';
    worksheet.getCell('D' + collRuning).value = dataSum[0].Q1_AMOUNT;
    worksheet.getCell('E' + collRuning).value = dataSum[0].Q1_CRR_AMOUNT;
    worksheet.getCell('F' + collRuning).value = dataSum[0].Q1_DIFF;

    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(1).getCell(i + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cccccc' },
        bgColor: { argb: 'D6D6D6' }
      };
    }

    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(2).getCell(i + 1).fill = {
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

    worksheet.getRow(2).alignment = {
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

  const generateExcelLSSIR014 = () => {
    const data = [...event.data];
    const dataSum = [...event.dataSum];
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
          const T = JSON.parse(`{"${key}":"${(date != undefined) || (date != null) ? date : ''}"}`);
          B.push(T);
        } else if (isNum(value) === false) {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
          B.push(T);
        } else if ((typeof value !== "string") || (value != null)) {
          const T = JSON.parse(`{"${key}"` + ":" + `${(value != undefined) || (value != null) ? value : 0}}`);
          B.push(T);
        } else {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
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
    var worksheet = workbook.addWorksheet('Sheet', { properties: { tabColor: { argb: 'FFC0000' } }, headerFooter: { firstHeader: "Hello Exceljs", firstFooter: "Hello World" } });

    worksheet.columns = event.headers;
    worksheet.getCell('A2').value = 'ลำดับ';
    worksheet.getCell('B2').value = 'รหัส';
    worksheet.getCell('C2').value = 'บริษัท';
    worksheet.getCell('D2').value = 'จำนวนเบี้ยประกันภัยรับโดยตรง(1)';
    worksheet.getCell('E2').value = 'จำนวนเงินสมทบ(2)';
    worksheet.getCell('F2').value = 'จำนวนเบี้ยประกันภัยรับโดยตรง(3)';
    worksheet.getCell('G2').value = 'จำนวนเงินสมทบ(4)';
    worksheet.getCell('H2').value = 'จำนวนเบี้ยประกันภัยรับโดยตรง(5)';
    worksheet.getCell('I2').value = 'จำนวนเงินสมทบ(6)';
    worksheet.getCell('J2').value = 'จำนวนเบี้ยประกันภัยรับโดยตรง(7)';
    worksheet.getCell('K2').value = 'จำนวนเงินสมทบ(8)';
    worksheet.getCell('L1').value = 'รวมเบี้ยประกันภัยรับโดยตรง(9)=(1)+(3)+(5)+(7)';
    worksheet.getCell('M1').value = 'รวมเงินสมทบ(10)=(2)+(4)+(6)+(8)';
    worksheet.getCell('N1').value = 'สัดส่วนเบี้ยประกันภัยรับโดยตรงต่อเบี้ยประกันภัยรับโดยตรงรวมทุกบริษัท(11)';
    worksheet.getCell('D1').value = "ปีแรก (ร้อยละ 0.30)";
    worksheet.getCell('F1').value = "ปีต่อไป (ร้อยละ 0.15)";
    worksheet.getCell('H1').value = "ชำระเบี้ยครั้งเดียว (ร้อยละ 0.15)";
    worksheet.getCell('J1').value = "ควบการลงทุน (ร้อยละ 0.10)";
    worksheet.mergeCells('D1:E1');
    worksheet.mergeCells('F1:G1');
    worksheet.mergeCells('H1:I1');
    worksheet.mergeCells('J1:K1');
    worksheet.mergeCells('L1:L2');
    worksheet.mergeCells('M1:M2');
    worksheet.mergeCells('N1:N2');
    let collRuning = 3;
    for (let i = 0; i < result.length; i++) {
      for (let b = 0; b < result[i].length; b++) {
        worksheet.getCell('A' + collRuning).value = result[i][b].id;
        worksheet.getCell('B' + collRuning).value = result[i][b].COMPANY_CODE;
        worksheet.getCell('C' + collRuning).value = result[i][b].COMPANY_NAME;
        worksheet.getCell('D' + collRuning).value = result[i][b].COL1;
        worksheet.getCell('E' + collRuning).value = result[i][b].COL2;
        worksheet.getCell('F' + collRuning).value = result[i][b].COL3;
        worksheet.getCell('G' + collRuning).value = result[i][b].COL4;
        worksheet.getCell('H' + collRuning).value = result[i][b].COL5;
        worksheet.getCell('I' + collRuning).value = result[i][b].COL6;
        worksheet.getCell('J' + collRuning).value = result[i][b].COL7;
        worksheet.getCell('K' + collRuning).value = result[i][b].COL8;
        worksheet.getCell('L' + collRuning).value = result[i][b].COL9;
        worksheet.getCell('M' + collRuning).value = result[i][b].COL10;
        worksheet.getCell('N' + collRuning).value = result[i][b].COL11 + "%";
      }
      collRuning++;
    };
    worksheet.getCell('C' + collRuning).value = 'รวม';
    worksheet.getCell('D' + collRuning).value = dataSum[0].COL1;
    worksheet.getCell('E' + collRuning).value = dataSum[0].COL2;
    worksheet.getCell('F' + collRuning).value = dataSum[0].COL3;
    worksheet.getCell('G' + collRuning).value = dataSum[0].COL4;
    worksheet.getCell('H' + collRuning).value = dataSum[0].COL5;
    worksheet.getCell('I' + collRuning).value = dataSum[0].COL6;
    worksheet.getCell('J' + collRuning).value = dataSum[0].COL7;
    worksheet.getCell('K' + collRuning).value = dataSum[0].COL8;
    worksheet.getCell('L' + collRuning).value = dataSum[0].COL9;
    worksheet.getCell('M' + collRuning).value = dataSum[0].COL10;
    worksheet.getCell('N' + collRuning).value = dataSum[0].COL11 + "%";
    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(1).getCell(i + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cccccc' },
        bgColor: { argb: 'D6D6D6' }
      };
    }
    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(2).getCell(i + 1).fill = {
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
    worksheet.getRow(2).alignment = {
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

  const generateExcelLSSIR015 = () => {
    const data = [...event.data];
    const dataSum = [...event.dataSum];
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
          const T = JSON.parse(`{"${key}":"${(date != undefined) || (date != null) ? date : ''}"}`);
          B.push(T);
        } else if (isNum(value) === false) {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
          B.push(T);
        } else if ((key !== "COMPANY_CODE") && (value != null)) {
          const T = JSON.parse(`{"${key}"` + ":" + `${(value != undefined) || (value != null) ? value : 0}}`);
          B.push(T);
        } else {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
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
    var worksheet = workbook.addWorksheet('Sheet', { properties: { tabColor: { argb: 'FFC0000' } }, headerFooter: { firstHeader: "Hello Exceljs", firstFooter: "Hello World" } });

    worksheet.columns = event.headers;
    worksheet.getCell('A2').value = 'ลำดับ';
    worksheet.getCell('B2').value = 'รหัส';
    worksheet.getCell('C2').value = 'บริษัท';
    worksheet.getCell('D2').value = 'เบี้ยประกันภัยรับโดยตรงในไตรมาสนี้(1)';
    worksheet.getCell('E2').value = 'จำนวนเบี้ยประกันภัยรับโดยตรงรวมจากต้นปีจนถึงไตรมาสนี้(2)';
    worksheet.getCell('F2').value = 'จำนวนเบี้ยประกันภัยรับโดยตรง(3)';
    worksheet.getCell('G2').value = 'จำนวนเงินสมทบ(4)';
    worksheet.getCell('H2').value = 'จำนวนเบี้ยประกันภัยรับโดยตรง(5)';
    worksheet.getCell('I2').value = 'จำนวนเงินสมทบ(6)';
    worksheet.getCell('J2').value = 'จำนวนเบี้ยประกันภัยรับโดยตรง(7)';
    worksheet.getCell('K2').value = 'จำนวนเงินสมทบ(8)';
    worksheet.getCell('L1').value = 'รวมเงินสมทบสะสมจนถึงไตรมาสนี้(9) = (4)+(6)+(8)';
    worksheet.getCell('M1').value = 'เงินสมทบสะสมในไตรมาสที่แล้ว(10)';
    worksheet.getCell('N1').value = 'เงินสมทบที่ต้องนำส่งในไตรมาสนี้(11)=(9)-(10)';
    worksheet.getCell('O1').value = 'สัดส่วนเบี้ยประกันภัยรับโดยตรงต่อเบี้ยประกันภัยรับโดยตรงรวมทุกบริษัท(12)';
    worksheet.getCell('P1').value = 'สัดส่วนเบี้ยประกันภัยรับโดยตรงต่อเบี้ยประกันภัยรับโดยตรงรวมทุกบริษัท(จากต้นปีจนถึงไตรมาสนี้)(13)';
    worksheet.getCell('F1').value = "ไม่เกิน 1,000 ล้านบาท(ร้อยละ 0.30)";
    worksheet.getCell('H1').value = "1,001 - 5,000 ล้านบาท(ร้อยละ 0.25)";
    worksheet.getCell('J1').value = "5,000 ล้านบาทขึ้นไป(ร้อยละ 0.20)";
    worksheet.mergeCells('D1:E1');
    worksheet.mergeCells('F1:G1');
    worksheet.mergeCells('H1:I1');
    worksheet.mergeCells('J1:K1');
    worksheet.mergeCells('L1:L2');
    worksheet.mergeCells('M1:M2');
    worksheet.mergeCells('N1:N2');
    worksheet.mergeCells('O1:O2');
    worksheet.mergeCells('P1:P2');
    let collRuning = 3;
    for (let i = 0; i < result.length; i++) {
      for (let b = 0; b < result[i].length; b++) {
        worksheet.getCell('A' + collRuning).value = result[i][b].id;
        worksheet.getCell('B' + collRuning).value = result[i][b].COMPANY_CODE;
        worksheet.getCell('C' + collRuning).value = result[i][b].COMPANY_NAME;
        worksheet.getCell('D' + collRuning).value = result[i][b].COL1;
        worksheet.getCell('E' + collRuning).value = result[i][b].COL2;
        worksheet.getCell('F' + collRuning).value = result[i][b].COL3;
        worksheet.getCell('G' + collRuning).value = result[i][b].COL4;
        worksheet.getCell('H' + collRuning).value = result[i][b].COL5;
        worksheet.getCell('I' + collRuning).value = result[i][b].COL6;
        worksheet.getCell('J' + collRuning).value = result[i][b].COL7;
        worksheet.getCell('K' + collRuning).value = result[i][b].COL8;
        worksheet.getCell('L' + collRuning).value = result[i][b].COL9;
        worksheet.getCell('M' + collRuning).value = result[i][b].COL10;
        worksheet.getCell('N' + collRuning).value = result[i][b].COL11;
        worksheet.getCell('O' + collRuning).value = result[i][b].COL12 + "%";
        worksheet.getCell('P' + collRuning).value = result[i][b].COL13 + "%";
      }
      collRuning++;
    };
    worksheet.getCell('C' + collRuning).value = 'รวม';
    worksheet.getCell('D' + collRuning).value = dataSum[0].COL1;
    worksheet.getCell('E' + collRuning).value = dataSum[0].COL2;
    worksheet.getCell('F' + collRuning).value = dataSum[0].COL3;
    worksheet.getCell('G' + collRuning).value = dataSum[0].COL4;
    worksheet.getCell('H' + collRuning).value = dataSum[0].COL5;
    worksheet.getCell('I' + collRuning).value = dataSum[0].COL6;
    worksheet.getCell('J' + collRuning).value = dataSum[0].COL7;
    worksheet.getCell('K' + collRuning).value = dataSum[0].COL8;
    worksheet.getCell('L' + collRuning).value = dataSum[0].COL9;
    worksheet.getCell('M' + collRuning).value = dataSum[0].COL10;
    worksheet.getCell('N' + collRuning).value = dataSum[0].COL11;
    worksheet.getCell('O' + collRuning).value = dataSum[0].COL12 + "%";
    worksheet.getCell('P' + collRuning).value = dataSum[0].COL13 + "%";
    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(1).getCell(i + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cccccc' },
        bgColor: { argb: 'D6D6D6' }
      };
    }
    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(2).getCell(i + 1).fill = {
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
    worksheet.getRow(2).alignment = {
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

  const generateExcelLSSIR016 = () => {
    const data = [...event.data];
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
          const T = JSON.parse(`{"${key}":"${(date != undefined) || (date != null) ? date : ''}"}`);
          B.push(T);
        } else if (isNum(value) === false) {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
          B.push(T);
        } else if ((typeof value !== "string") && (value != null)) {
          const T = JSON.parse(`{"${key}"` + ":" + `${(value != undefined) || (value != null) ? value : 0}}`);
          B.push(T);
        } else {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
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
    var worksheet = workbook.addWorksheet('Sheet', { properties: { tabColor: { argb: 'FFC0000' } }, headerFooter: { firstHeader: "Hello Exceljs", firstFooter: "Hello World" } });

    worksheet.columns = event.headers;
    let collRuning = 2;
    for (let i = 0; i < result.length; i++) {
      for (let b = 0; b < result[i].length; b++) {
        worksheet.getCell('A' + collRuning).value = result[i][b].id;
        worksheet.getCell('B' + collRuning).value = result[i][b].COMPANY_CODE;
        worksheet.getCell('C' + collRuning).value = result[i][b].COMPANY_NAME;
        worksheet.getCell('D' + collRuning).value = result[i][b].SUM_QUARTER;
        worksheet.getCell('E' + collRuning).value = result[i][b].SUM_QUARTER_COMPARE;
        worksheet.getCell('F' + collRuning).value = (result[i][b].SUM_QUARTER - result[i][b].SUM_QUARTER_COMPARE);
        worksheet.getCell('G' + collRuning).value = checkPercent(result[i][b]);
      }
      collRuning++;
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

  const generateExcelLSSIR017 = () => {
    const data = [...event.data];
    const dataSum = [...event.dataSum]
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
          const T = JSON.parse(`{"${key}":"${(date != undefined) || (date != null) ? date : ''}"}`);
          B.push(T);
        } else if (isNum(value) === false) {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
          B.push(T);
        } else if ((typeof value !== "string") && (value != null)) {
          const T = JSON.parse(`{"${key}"` + ":" + `${(value != undefined) || (value != null) ? value : 0}}`);
          B.push(T);
        } else {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
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
    var worksheet = workbook.addWorksheet('Sheet', { properties: { tabColor: { argb: 'FFC0000' } }, headerFooter: { firstHeader: "Hello Exceljs", firstFooter: "Hello World" } });

    worksheet.columns = event.headers;
    let collRuning = 2;
    for (let i = 0; i < result.length; i++) {
      for (let b = 0; b < result[i].length; b++) {
        worksheet.getCell('A' + collRuning).value = result[i][b].id;
        worksheet.getCell('B' + collRuning).value = result[i][b].COMPANY_CODE;
        worksheet.getCell('C' + collRuning).value = result[i][b].COMPANY_NAME;
        worksheet.getCell('D' + collRuning).value = result[i][b].AMOUNT;
        worksheet.getCell('E' + collRuning).value = result[i][b].PERCENT.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) + `%`;
      }
      collRuning++;
    };
    worksheet.getCell('C' + collRuning).value = "รวม";
    worksheet.getCell('D' + collRuning).value = dataSum[0].AMOUNT;
    worksheet.getCell('E' + collRuning).value = dataSum[0].PERCENT + "%";
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

  const generateExcelLSSIR020 = () => {
    const data = [...event.data];
    const dataSum = [...event.dataSum]
    let running: number = 1;
    var result = data.map((m: any) => {
      const A = [];
      const B = [];
      for (const [key, value] of Object.entries(m)) {
        if (key != "ITEMS")
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
            const T = JSON.parse(`{"${key}":"${(date != undefined) || (date != null) ? date : ''}"}`);
            B.push(T);
          } else if (isNum(value) === false) {
            const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
            B.push(T);
          } else if ((typeof value !== "string") && (value != null)) {
            const T = JSON.parse(`{"${key}"` + ":" + `${(value != undefined) || (value != null) ? value : 0}}`);
            B.push(T);
          } else {
            const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
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
    var worksheet = workbook.addWorksheet('Sheet', { properties: { tabColor: { argb: 'FFC0000' } }, headerFooter: { firstHeader: "Hello Exceljs", firstFooter: "Hello World" } });

    worksheet.columns = event.headers;
    let collRuning = 2;
    for (let i = 0; i < result.length; i++) {
      for (let b = 0; b < result[i].length; b++) {
        const ITEMS = data[i].ITEMS;
        worksheet.getCell('A' + collRuning).value = result[i][b].COMPANY_CODE;
        worksheet.mergeCells(`B${collRuning}:G${collRuning}`);
        worksheet.getCell(`A${collRuning}:G${collRuning}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'A5ECD5' },
          bgColor: { argb: '#A5ECD5' }
        };
        worksheet.getCell(`B${collRuning}:G${collRuning}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'A5ECD5' },
          bgColor: { argb: '#A5ECD5' }
        };
        worksheet.getCell('B' + collRuning).value = result[i][b].COMPANY_CODE;
        worksheet.getCell('C' + collRuning).value = result[i][b].COMPANY_NAME;
        worksheet.getCell('B' + collRuning).alignment = {
          vertical: 'middle',
          horizontal: 'left'
        };
        let d = 1;
        for (let c = 0; c < ITEMS.length; c++) {
          worksheet.getCell('A' + ((collRuning) + d)).value = d;
          worksheet.getCell('B' + ((collRuning) + d)).value = ITEMS[c].CODE;
          worksheet.getCell('C' + ((collRuning) + d)).value = moment(ITEMS[c].CREATED_DATE).add(543, "y").format("DD/MM/YYYY");
          worksheet.getCell('D' + ((collRuning) + d)).value = ITEMS[c].DESCRIPTION;
          worksheet.getCell('E' + ((collRuning) + d)).value = ITEMS[c].DEPT_AMOUNT;
          worksheet.getCell('F' + ((collRuning) + d)).value = ITEMS[c].CREDIT_AMOUNT;
          worksheet.getCell('G' + ((collRuning) + d)).value = ITEMS[c].DIFF_AMOUNT;
          d++;
        }
        worksheet.getCell('D' + (collRuning + d)).value = "รวม";
        worksheet.getCell('E' + (collRuning + d)).value = result[i][b].SUM_DEPT_AMOUNT;
        worksheet.getCell('F' + (collRuning + d)).value = result[i][b].SUM_CREDIT_AMOUNT;
        worksheet.getCell('G' + (collRuning + d)).value = result[i][b].SUM_DIFF_AMOUNT;
        worksheet.getCell('D' + (collRuning + d)).alignment = {
          vertical: 'middle',
          horizontal: 'right'
        };
      }
      collRuning += 4;
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

  const generateExcelLSSIR021 = () => {
    const data = [...event.data];
    const year = event.year;
    let running: number = 1;
    var result = data.map((m: any) => {
      const A = [];
      const B = [];
      for (const [key, value] of Object.entries(m)) {
        if (key != "ITEMS")
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
            const T = JSON.parse(`{"${key}":"${(date != undefined) || (date != null) ? date : ''}"}`);
            B.push(T);
          } else if (isNum(value) === false) {
            const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
            B.push(T);
          } else if ((typeof value !== "string") && (value != null)) {
            const T = JSON.parse(`{"${key}"` + ":" + `${(value != undefined) || (value != null) ? value : 0}}`);
            B.push(T);
          } else {
            const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
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
    var worksheet = workbook.addWorksheet('Sheet', { properties: { tabColor: { argb: 'FFC0000' } }, headerFooter: { firstHeader: "Hello Exceljs", firstFooter: "Hello World" } });

    worksheet.columns = event.headers;
    worksheet.getCell('A2').value = 'ลำดับ';
    worksheet.getCell('B2').value = 'รายละเอียด';
    worksheet.getCell('C2').value = 'ลูกหนี้';
    worksheet.getCell('D2').value = 'เจ้าหนี้';
    worksheet.getCell('E2').value = 'ลูกหนี้';
    worksheet.getCell('F2').value = 'เจ้าหนี้';
    worksheet.getCell('G2').value = 'ลูกหนี้';
    worksheet.getCell('H2').value = 'เจ้าหนี้';
    worksheet.getCell('I2').value = 'ลูกหนี้';
    worksheet.getCell('J2').value = 'เจ้าหนี้';
    worksheet.getCell('K2').value = 'ลูกหนี้';
    worksheet.getCell('L2').value = 'เจ้าหนี้';
    worksheet.getCell('M1').value = 'เจ้าหนี้/ลูกหนี้';

    worksheet.getCell('C1').value = `ไตรมาส 1/${year}`;
    worksheet.getCell('E1').value = `ไตรมาส 2/${year}`;
    worksheet.getCell('G1').value = `ไตรมาส 3/${year}`;
    worksheet.getCell('I1').value = `ไตรมาส 4/${year}`;
    worksheet.getCell('K1').value = "รวม";
    worksheet.mergeCells('C1:D1');
    worksheet.mergeCells('E1:F1');
    worksheet.mergeCells('G1:H1');
    worksheet.mergeCells('I1:J1');
    worksheet.mergeCells('K1:L1');
    worksheet.mergeCells('M1:M2');
    let collRuning = 3;
    for (let i = 0; i < result.length; i++) {
      for (let b = 0; b < result[i].length; b++) {
        const ITEMS = data[i].ITEMS;
        worksheet.getCell('A' + collRuning).value = result[i][b].COMPANY_CODE;
        worksheet.mergeCells(`B${collRuning}:M${collRuning}`);
        worksheet.getCell(`A${collRuning}:M${collRuning}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'A5ECD5' },
          bgColor: { argb: '#A5ECD5' }
        };
        worksheet.getCell(`B${collRuning}:M${collRuning}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'A5ECD5' },
          bgColor: { argb: '#A5ECD5' }
        };
        worksheet.getCell('B' + collRuning).value = result[i][b].COMPANY_NAME;
        worksheet.getCell('B' + collRuning).alignment = {
          vertical: 'middle',
          horizontal: 'left'
        };
        let d = 1;
        let sumTotal1 = 0;
        let sumTotal2 = 0;
        let sumTotal3 = 0;
        let sumTotal4 = 0;
        let sumTotal5 = 0;
        let sumTotal6 = 0;
        let sumTotal7 = 0;
        let sumTotal8 = 0;
        let CREDIT_TOTAL = 0;
        let DEPT_TOTAL = 0;
        let DIFF_AMOUNT = 0;
        for (let c = 0; c < ITEMS.length; c++) {
          sumTotal1 += ITEMS[c].CREDIT_AMOUNT1;
          sumTotal2 += ITEMS[c].DEPT_AMOUNT1;
          sumTotal3 += ITEMS[c].CREDIT_AMOUNT2;
          sumTotal4 += ITEMS[c].DEPT_AMOUNT2;
          sumTotal5 += ITEMS[c].CREDIT_AMOUNT3;
          sumTotal6 += ITEMS[c].DEPT_AMOUNT3;
          sumTotal7 += ITEMS[c].CREDIT_AMOUNT4;
          sumTotal8 += ITEMS[c].DEPT_AMOUNT4;
          CREDIT_TOTAL += ITEMS[c].CREDIT_TOTAL;
          DEPT_TOTAL += ITEMS[c].DEPT_TOTAL;
          DIFF_AMOUNT += ITEMS[c].DIFF_AMOUNT;

          worksheet.getCell('A' + ((collRuning) + d)).value = d;
          worksheet.getCell('B' + ((collRuning) + d)).value = ITEMS[c].DESCRIPTION;
          worksheet.getCell('C' + ((collRuning) + d)).value = ITEMS[c].CREDIT_AMOUNT1;
          worksheet.getCell('D' + ((collRuning) + d)).value = ITEMS[c].DEPT_AMOUNT1;
          worksheet.getCell('E' + ((collRuning) + d)).value = ITEMS[c].CREDIT_AMOUNT2;
          worksheet.getCell('F' + ((collRuning) + d)).value = ITEMS[c].DEPT_AMOUNT2;
          worksheet.getCell('G' + ((collRuning) + d)).value = ITEMS[c].CREDIT_AMOUNT3;
          worksheet.getCell('H' + ((collRuning) + d)).value = ITEMS[c].DEPT_AMOUNT3;
          worksheet.getCell('I' + ((collRuning) + d)).value = ITEMS[c].CREDIT_AMOUNT4;
          worksheet.getCell('J' + ((collRuning) + d)).value = ITEMS[c].DEPT_AMOUNT4;
          worksheet.getCell('K' + ((collRuning) + d)).value = ITEMS[c].CREDIT_TOTAL;
          worksheet.getCell('L' + ((collRuning) + d)).value = ITEMS[c].DEPT_TOTAL;
          worksheet.getCell('M' + ((collRuning) + d)).value = ITEMS[c].DIFF_AMOUNT;
          d++;
        }
        worksheet.getCell('B' + (collRuning + d)).value = "รวม";
        worksheet.getCell('B' + (collRuning + d)).alignment = {
          vertical: 'middle',
          horizontal: 'right'
        };
        worksheet.getCell('C' + (collRuning + d)).value = sumTotal1;
        worksheet.getCell('D' + (collRuning + d)).value = sumTotal2;
        worksheet.getCell('E' + (collRuning + d)).value = sumTotal3;
        worksheet.getCell('F' + (collRuning + d)).value = sumTotal4;
        worksheet.getCell('G' + (collRuning + d)).value = sumTotal5;
        worksheet.getCell('H' + (collRuning + d)).value = sumTotal6;
        worksheet.getCell('I' + (collRuning + d)).value = sumTotal7;
        worksheet.getCell('J' + (collRuning + d)).value = sumTotal8;
        worksheet.getCell('K' + (collRuning + d)).value = CREDIT_TOTAL;
        worksheet.getCell('L' + (collRuning + d)).value = DEPT_TOTAL;
        worksheet.getCell('M' + (collRuning + d)).value = DIFF_AMOUNT;
        collRuning += (ITEMS.length - 2);
      }
      collRuning += 4;
    };

    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(1).getCell(i + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cccccc' },
        bgColor: { argb: 'D6D6D6' }
      };
    }

    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(2).getCell(i + 1).fill = {
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

  const generateExcelLSSIQ051 = () => {
    const data = [...event.data];
    // const dataSum = [...event.dataSum]
    const year = event.year;
    const quarter = event.quarter;
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
          const T = JSON.parse(`{"${key}":"${(date != undefined) || (date != null) ? date : ''}"}`);
          B.push(T);
        } else if (isNum(value) === false) {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
          B.push(T);
        } else if ((typeof value !== "string") && (value != null)) {
          const T = JSON.parse(`{"${key}"` + ":" + `${(value != undefined) || (value != null) ? value : 0}}`);
          B.push(T);
        } else {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
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
    var worksheet = workbook.addWorksheet('Sheet', { properties: { tabColor: { argb: 'FFC0000' } }, headerFooter: { firstHeader: "Hello Exceljs", firstFooter: "Hello World" } });

    worksheet.columns = event.headers;
    worksheet.getCell('A2').value = 'ลำดับ';
    worksheet.getCell('B2').value = 'รหัส';
    worksheet.getCell('C2').value = 'ชื่อบริษัท';
    worksheet.getCell('D2').value = 'ไตรมาส 1';
    worksheet.getCell('E2').value = 'ไตรมาส 2';
    worksheet.getCell('F2').value = 'ไตรมาส 3';
    worksheet.getCell('G2').value = 'ไตรมาส 4';
    worksheet.getCell('H2').value = 'ไตรมาส 1';
    worksheet.getCell('I2').value = 'ไตรมาส 2';
    worksheet.getCell('J2').value = 'ไตรมาส 3';
    worksheet.getCell('K2').value = 'ไตรมาส 4';
    worksheet.getCell('L2').value = 'ไตรมาส 1';
    worksheet.getCell('M2').value = 'ไตรมาส 2';
    worksheet.getCell('N2').value = 'ไตรมาส 3';
    worksheet.getCell('O2').value = 'ไตรมาส 4';
    worksheet.getCell('P2').value = 'ไตรมาส 1';
    worksheet.getCell('Q2').value = 'ไตรมาส 2';
    worksheet.getCell('R2').value = 'ไตรมาส 3';
    worksheet.getCell('S2').value = 'ไตรมาส 4';
    worksheet.getCell('T2').value = 'รวม';

    worksheet.getCell('D1').value = `ปี ${year}`;
    worksheet.getCell('H1').value = `ปี ${year - 1}`;
    worksheet.getCell('L1').value = `ปี ${year - 2}`;
    worksheet.getCell('P1').value = `ปี ${year - 3}`;

    worksheet.getColumn('L').hidden = quarter > 1 ? false : true;
    worksheet.getColumn('M').hidden = quarter > 1 ? false : true;
    worksheet.getColumn('N').hidden = quarter > 1 ? false : true;
    worksheet.getColumn('O').hidden = quarter > 1 ? false : true;
    worksheet.getColumn('P').hidden = quarter > 2 ? false : true;
    worksheet.getColumn('Q').hidden = quarter > 2 ? false : true;
    worksheet.getColumn('R').hidden = quarter > 2 ? false : true;
    worksheet.getColumn('S').hidden = quarter > 2 ? false : true;

    worksheet.mergeCells('D1:G1');
    worksheet.mergeCells('H1:K1');
    worksheet.mergeCells('L1:O1');
    worksheet.mergeCells('P1:S1');

    let collRuning = 3;
    for (let i = 0; i < result.length; i++) {
      for (let b = 0; b < result[i].length; b++) {
        worksheet.getCell('A' + collRuning).value = result[i][b].id;
        worksheet.getCell('B' + collRuning).value = result[i][b].COMPANY_CODE;
        worksheet.getCell('C' + collRuning).value = result[i][b].NAME;
        worksheet.getCell('D' + collRuning).value = result[i][b].Q1;
        worksheet.getCell('E' + collRuning).value = result[i][b].Q2;
        worksheet.getCell('F' + collRuning).value = result[i][b].Q3;
        worksheet.getCell('G' + collRuning).value = result[i][b].Q4;
        worksheet.getCell('H' + collRuning).value = result[i][b].Q5;
        worksheet.getCell('I' + collRuning).value = result[i][b].Q6;
        worksheet.getCell('J' + collRuning).value = result[i][b].Q7;
        worksheet.getCell('K' + collRuning).value = result[i][b].Q8;
        worksheet.getCell('L' + collRuning).value = result[i][b].Q9;
        worksheet.getCell('M' + collRuning).value = result[i][b].Q10;
        worksheet.getCell('N' + collRuning).value = result[i][b].Q11;
        worksheet.getCell('O' + collRuning).value = result[i][b].Q12;
        worksheet.getCell('P' + collRuning).value = result[i][b].Q13;
        worksheet.getCell('Q' + collRuning).value = result[i][b].Q14;
        worksheet.getCell('R' + collRuning).value = result[i][b].Q15;
        worksheet.getCell('S' + collRuning).value = result[i][b].Q16;
        worksheet.getCell('T' + collRuning).value = result[i][b].QSUM;
      }
      collRuning++;
    };

    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(1).getCell(i + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cccccc' },
        bgColor: { argb: 'D6D6D6' }
      };
    }

    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(2).getCell(i + 1).fill = {
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

    worksheet.getRow(2).alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };

    workbook.xlsx.writeBuffer()
      .then(function (buffer) {
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(data, event.fileNames);
      });
  }

  const generateExcelLSSIQ053 = () => {
    const data = [...event.data];
    // const dataSum = [...event.dataSum]
    const year = event.year;
    const quarter = event.quarter;
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
          const T = JSON.parse(`{"${key}":"${(date != undefined) || (date != null) ? date : ''}"}`);
          B.push(T);
        } else if (isNum(value) === false) {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
          B.push(T);
        } else if ((typeof value !== "string") && (value != null)) {
          const T = JSON.parse(`{"${key}"` + ":" + `${(value != undefined) || (value != null) ? value : 0}}`);
          B.push(T);
        } else {
          const T = JSON.parse(`{"${key}":"${(value != undefined) || (value != null) ? value : ''}"}`);
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
    var worksheet = workbook.addWorksheet('Sheet', { properties: { tabColor: { argb: 'FFC0000' } }, headerFooter: { firstHeader: "Hello Exceljs", firstFooter: "Hello World" } });

    worksheet.columns = event.headers;
    worksheet.getCell('A2').value = 'ลำดับ';
    worksheet.getCell('B2').value = 'รหัส';
    worksheet.getCell('C2').value = 'ชื่อบริษัท';
    worksheet.getCell('D2').value = `ปี ${year}`;
    worksheet.getCell('E2').value = `ปี ${year - 1}`;
    worksheet.getCell('F2').value = `ปี ${year - 3}`;
    worksheet.getCell('G2').value = `ปี ${year - 4}`;
    worksheet.getCell('H2').value = `ปี ${year}`;
    worksheet.getCell('I2').value = `ปี ${year - 1}`;
    worksheet.getCell('J2').value = `ปี ${year - 3}`;
    worksheet.getCell('K2').value = `ปี ${year - 4}`;
    worksheet.getCell('L2').value = `ปี ${year}`;
    worksheet.getCell('M2').value = `ปี ${year - 1}`;
    worksheet.getCell('N2').value = `ปี ${year - 3}`;
    worksheet.getCell('O2').value = `ปี ${year - 4}`;
    worksheet.getCell('P2').value = `ปี ${year}`;
    worksheet.getCell('Q2').value = `ปี ${year - 1}`;
    worksheet.getCell('R2').value = `ปี ${year - 3}`;
    worksheet.getCell('S2').value = `ปี ${year - 4}`;
    worksheet.getCell('T2').value = 'รวม';

    worksheet.getCell('D1').value = 'ไตรมาส 1';
    worksheet.getCell('H1').value = 'ไตรมาส 2';
    worksheet.getCell('L1').value = 'ไตรมาส 3';
    worksheet.getCell('P1').value = 'ไตรมาส 4';

    worksheet.getColumn('F').hidden = quarter > 1 ? false : true;
    worksheet.getColumn('G').hidden = quarter > 2 ? false : true;
    worksheet.getColumn('J').hidden = quarter > 1 ? false : true;
    worksheet.getColumn('K').hidden = quarter > 2 ? false : true;
    worksheet.getColumn('N').hidden = quarter > 1 ? false : true;
    worksheet.getColumn('O').hidden = quarter > 2 ? false : true;
    worksheet.getColumn('R').hidden = quarter > 1 ? false : true;
    worksheet.getColumn('S').hidden = quarter > 2 ? false : true;

    worksheet.mergeCells('D1:G1');
    worksheet.mergeCells('H1:K1');
    worksheet.mergeCells('L1:O1');
    worksheet.mergeCells('P1:S1');

    let collRuning = 3;
    for (let i = 0; i < result.length; i++) {
      for (let b = 0; b < result[i].length; b++) {
        worksheet.getCell('A' + collRuning).value = result[i][b].id;
        worksheet.getCell('B' + collRuning).value = result[i][b].COMPANY_CODE;
        worksheet.getCell('C' + collRuning).value = result[i][b].NAME;
        worksheet.getCell('D' + collRuning).value = result[i][b].YEAR1Q1;
        worksheet.getCell('E' + collRuning).value = result[i][b].YEAR2Q1;
        worksheet.getCell('F' + collRuning).value = result[i][b].YEAR3Q1;
        worksheet.getCell('G' + collRuning).value = result[i][b].YEAR4Q1;
        worksheet.getCell('H' + collRuning).value = result[i][b].YEAR1Q2;
        worksheet.getCell('I' + collRuning).value = result[i][b].YEAR2Q2;
        worksheet.getCell('J' + collRuning).value = result[i][b].YEAR3Q2;
        worksheet.getCell('K' + collRuning).value = result[i][b].YEAR4Q2;
        worksheet.getCell('L' + collRuning).value = result[i][b].YEAR1Q3;
        worksheet.getCell('M' + collRuning).value = result[i][b].YEAR2Q3;
        worksheet.getCell('N' + collRuning).value = result[i][b].YEAR3Q3;
        worksheet.getCell('O' + collRuning).value = result[i][b].YEAR4Q3;
        worksheet.getCell('P' + collRuning).value = result[i][b].YEAR1Q4;
        worksheet.getCell('Q' + collRuning).value = result[i][b].YEAR2Q4;
        worksheet.getCell('R' + collRuning).value = result[i][b].YEAR3Q4;
        worksheet.getCell('S' + collRuning).value = result[i][b].YEAR4Q4;
        worksheet.getCell('T' + collRuning).value = result[i][b].QSUM;
      }
      collRuning++;
    };

    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(1).getCell(i + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cccccc' },
        bgColor: { argb: 'D6D6D6' }
      };
    }

    for (let i = 0; i < header.length; i++) {
      worksheet.getRow(2).getCell(i + 1).fill = {
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

    worksheet.getRow(2).alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };

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

  const checkPercent = (record: any) => {
    if (record.SUM_QUARTER <= 0)
      return (
        (-100).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) + `%`
      );

    if (record.SUM_QUARTER_COMPARE <= 0)
      return (
        (100).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) + `%`
      );

    return (
      (
        ((record.SUM_QUARTER - record.SUM_QUARTER_COMPARE) /
          record.SUM_QUARTER_COMPARE) *
        100
      ).toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }) + `%`
    );
  }

  return (
    <Button
      onClick={() => CheckIDPage()}
      variant="contained"
      startIcon={<Downloading />}
    >
      Excel
    </Button>
  );
};

export default ExportExcelVarious;