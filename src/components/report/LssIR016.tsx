import { useState, useEffect, useCallback, ChangeEvent } from "react";
import "@sweetalert2/theme-minimal/minimal.scss";
import { downloadFilePost, LSSIR016OnLoad, searchLSSIR016 } from "../../data";
import { Col, Container, Row, Button } from "react-bootstrap";
import NavMenu from "../fragments/NavMenu";

import { FaBars } from "react-icons/fa";
import "./default.scss";
import QuaterComparePanel from "./shared/QuaterComparePanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faSearch, faCloudDownload } from "@fortawesome/free-solid-svg-icons";
import { IR016 } from "../../models/office/IR016.model";
import { monthsToQuarters } from "date-fns";
import Table, { ColumnsType } from "antd/lib/table";

import "./LssIR016.scss";
import ExportExcel from "./shared/ExportExcel";
import ExportExcelVarious from "./shared/ExportExcelVarious";

export default function LssIR011() {
  const [companies, setCompanies] = useState<{ CODE: string; NAME: string; COMPANY_TYPE_CODE: string }[]>(
    []
  );
  const [companyTypes, setCompanyTypes] = useState<
    { CODE: string; NAME: string }[]
  >([]);

  const [selectedCompanyCode, setSelectedCompanyCode] = useState<string>("");
  const [selectedCompanyTypeCode, setSelectedCompanyTypeCode] =
    useState<string>("");

  const [compareType, setCompareType] = useState<string>("COMPLETED");

  const [selectedYear, setSelectedYear] = useState<number>(() => {
    return new Date().getFullYear();
  });
  const [selectedQuarter, setSelectedQuarter] = useState<number>(() => {
    return monthsToQuarters(new Date().getMonth() + 1);
  });

  const [selectedCompareYear, setSelectedCompareYear] = useState<number>(() => {
    const currentQuarter = monthsToQuarters(new Date().getMonth() + 1);
    return currentQuarter > 1
      ? new Date().getFullYear()
      : new Date().getFullYear() - 1;
  });
  const [selectedCompareQuarter, setSelectedCompareQuarter] = useState<number>(
    () => {
      const currentQuarter = monthsToQuarters(new Date().getMonth() + 1);
      return currentQuarter > 1 ? currentQuarter - 1 : 4;
    }
  );

  const [quarterLabel, setQuarterLabel] = useState<string>(() => {
    const currentQuarter = monthsToQuarters(new Date().getMonth() + 1);
    return `ไตรมาส
    [${new Date().getFullYear() + 543}/${currentQuarter}]`;
  });
  const [quarterCompareLabel, setQuarterCompareLabel] = useState<string>(() => {
    const currentQuarter = monthsToQuarters(new Date().getMonth() + 1);
    return currentQuarter > 1
      ? `ไตรมาส
    [${new Date().getFullYear() + 543}/${currentQuarter - 1}] ที่เทียบ`
      : `ไตรมาส
      [${new Date().getFullYear() - 1 + 543}/${4}] ที่เทียบ`;
  });

  const [dataSource, setDataSource] = useState<IR016[]>([]);
  const columns: ColumnsType<IR016> = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      align: "center", 
      key: "id",
    },
    {
      title: "รหัส",
      dataIndex: "COMPANY_CODE",
      align: "center", 
      key: "COMPANY_CODE",
    },
    {
      title: "บริษัท",
      dataIndex: "COMPANY_NAME",
      align: "left", 
      key: "COMPANY_NAME",
    },
    {
      title: `${quarterLabel}`,
      dataIndex: "SUM_QUARTER",
      align: "right", 
      key: "SUM_QUARTER",
      render: (value: any, record: IR016, index: number) =>
        record.SUM_QUARTER.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }),
    },
    {
      title: `${quarterCompareLabel}`,
      dataIndex: "SUM_QUARTER_COMPARE",
      align: "right",
      key: "SUM_QUARTER_COMPARE",
      render: (value: any, record: IR016, index: number) =>
        record.SUM_QUARTER_COMPARE.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }),
    },
    {
      title: "เพิ่มขึ้น / (ลดลง)",
      dataIndex: "INC_DEC",
      align: "right",
      key: "INC_DEC",
      render: (value: any, record: IR016, index: number) =>
        (record.SUM_QUARTER - record.SUM_QUARTER_COMPARE).toLocaleString(
          undefined,
          {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }
        ),
    },
    {
      title: " เงินสมทบ เพิ่มขึ้น / (ลดลง)%",
      dataIndex: "DIFF",
      align: "right",
      key: "DIFF",
      render: (value: any, record: IR016, index: number) => {
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
      },
    },
  ];



  const handleOnLoad = useCallback((): Promise<any> => {
    return new Promise((resolve) => {
      LSSIR016OnLoad().then((data) => {
        setCompanies(data.COMPANIES);
        setCompanyTypes(data.COMPANY_TYPES);
      });

      resolve(true);
    });
  }, []);

  const handleSearch = () => {
    let record = {} as Record<string, any>;

    record["FIND"] = { YEAR: selectedYear + 543, QUARTER: selectedQuarter };
    record["COMPARE"] = {
      YEAR: selectedCompareYear + 543,
      QUARTER: selectedCompareQuarter,
    };

    if (selectedCompanyTypeCode.length > 0)
      record["COMPANY_TYPE"] = selectedCompanyTypeCode;

    if (selectedCompanyCode.length > 0)
      record["COMPANY_CODE"] = selectedCompanyCode;

    if (compareType.length > 0) record["COMPARE_TYPE"] = compareType;

    searchLSSIR016(record).then((data) => {
      setDataSource(data);
      setQuarterLabel(`ไตรมาส
      [${selectedYear + 543}/${selectedQuarter}]`);
      setQuarterCompareLabel(`ไตรมาส
      [${selectedCompareYear + 543}/${selectedCompareQuarter}] ที่เทียบ`);
    });
  };

  useEffect(() => {
    handleOnLoad();
  }, [handleOnLoad]);

  // const handleDownloadExcel = () => {
  //   let record = {} as Record<string, any>;
  //   record["FIND"] = { YEAR: selectedYear + 543, QUARTER: selectedQuarter };
  //   record["COMPARE"] = {
  //     YEAR: selectedCompareYear + 543,
  //     QUARTER: selectedCompareQuarter,
  //   };

  //   if (selectedCompanyTypeCode.length > 0)
  //     record["COMPANY_TYPE"] = selectedCompanyTypeCode;

  //   if (selectedCompanyCode.length > 0)
  //     record["COMPANY_CODE"] = selectedCompanyCode;

  //   if (compareType.length > 0) record["COMPARE_TYPE"] = compareType;
  //   downloadFilePost(
  //     `/LSSIR016/LSSIR015Excel`,
  //     "LSS-IR-016_รายงานแสดงข้อมูลเงินสมทบ.xlsx",
  //     record
  //   );
  // }

  const header = [
    { header: 'ลำดับ', key: 'id', width: 5, style: { alignment: { horizontal: 'center' }, numFmt: '##0' } },
    { header: 'รหัส', key: 'COMPANY_CODE', width: 10, style: { alignment: { horizontal: 'center' }, numFmt: '##0' } },
    { header: 'บริษัท', key: 'COMPANY_NAME', width: 50, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: `ไตรมาส[${selectedYear + 543}/${selectedQuarter}]`, key: 'SUM_QUARTER', width: 30, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: `ไตรมาส[${selectedCompareYear + 543}/${selectedCompareQuarter}]ที่เทียบ`, key: 'SUM_QUARTER_COMPARE', width: 30, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'เพิ่มขึ้น / (ลดลง)', key: 'INC_DEC', width: 30, style: { alignment: { horizontal: 'right' }, numFmt: '#,##0.00' } },
    { header: 'เงินสมทบ เพิ่มขึ้น / (ลดลง)%', key: 'DIFF', width: 30, style: { alignment: { horizontal: 'right' }, numFmt: 'Text' } },
  ];

  return (
    <>
      <NavMenu />
      <Container fluid className="w-100 mx-0">
        <h5 style={{ marginTop: "6.8rem" }}>
          <FaBars size={30} style={{ margin: "auto" }} />
          &nbsp;&nbsp;LSS-IR-016 รายงานแสดงข้อมูลเงินสมทบ
        </h5>
        <Row className="mt-3 mb-3">
          <Col>
            <Row className="mb-2">
              <Col sm={6} lg={2} style={{ textAlign: "right" }}>
                ประเภทบริษัท:
              </Col>
              <Col sm={6} lg={3}>
                <select
                  className="form-select"
                  value={selectedCompanyTypeCode}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setSelectedCompanyTypeCode(e.target.value);
                    setSelectedCompanyCode("");
                  }}
                >
                  <option value="">ทุกประเภท</option>
                  {companyTypes.map((c, i) => (
                    <option key={i} value={c.CODE}>
                      {c.NAME}
                    </option>
                  ))}
                </select>
              </Col>
              <Col sm={6} lg={1} style={{ textAlign: "right" }}>
                บริษัท:
              </Col>
              <Col>
                <select
                  className="form-select"
                  value={selectedCompanyCode}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setSelectedCompanyCode(e.target.value);
                  }}
                >
                  <option value="">ทุกบริษัท</option>
                  {companies.filter(x => x.COMPANY_TYPE_CODE === selectedCompanyTypeCode || !selectedCompanyTypeCode || selectedCompanyTypeCode === "0").map((c, i) => (
                    <option key={i} value={c.CODE}>
                      {c.NAME}
                    </option>
                  ))}
                </select>
              </Col>
            </Row>
            <Row>
              <Col sm={6} lg={2} style={{ textAlign: "right" }}>
                ข้อมูลเงินสมทบ:
              </Col>
              <Col sm={6} lg={5}>
                <select
                  className="form-select"
                  value={compareType}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setCompareType(e.target.value);
                  }}
                >
                  {/* <option value="">ทั้งหมด</option> */}
                  <option value="COMPLETED">
                    การนำส่งเงินสมทบ(ทีมีการชำระแล้ว)
                  </option>
                  <option value="CRR">
                    ข้อมูลเงินสมทบที่คำนวณได้จากข้อมูลระบบ CRR
                  </option>
                </select>
              </Col>
            </Row>
          </Col>
          <Col sm="4">
            <QuaterComparePanel
              onChanged={(y: number, q: number) => {
                setSelectedYear(y);
                setSelectedQuarter(q);
              }}
              onCompareChanged={(y: number, q: number) => {
                setSelectedCompareYear(y);
                setSelectedCompareQuarter(q);
              }}
            />
          </Col>
          <Col sm="2">
            <Button
              variant="success"
              className="me-3"
              style={{ minWidth: "99px" }}
              onClick={handleSearch}
            >
              <FontAwesomeIcon icon={faSearch} />
              &nbsp; ค้นหา
            </Button>
            {/* <Button variant={"primary"} style={{ minWidth: "99px" }} className="me-3">
              <FontAwesomeIcon icon={faFileExcel} />
              &nbsp; Export
            </Button> */}

            <ExportExcelVarious
                  data={dataSource}
                  // dataSum={SumtableData}
                  headers={header}
                  // quarterAndYear={`เงินสมทบไตรมาส ${sQuarter[0]}/${sYear[0]}`}
                  IDPage={"LSS-IR-016"}
                  fileNames={"LSS-IR-016_รายงานแสดงข้อมูลเงินสมทบ.xlsx"}
                ></ExportExcelVarious>
            {/* <Button
                  style={{ marginRight: 5 }}
                  variant="primary"
                  // startIcon={faCloudDownload}
                  onClick={handleDownloadExcel}
                >
                  <FontAwesomeIcon icon={faCloudDownload} />
                  {" "}
                  Excel
            </Button> */}
          </Col>

        </Row>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          // summary={(data: readonly IR016[]) => {
          //   let qt = data.reduce((p, v) => p + v.SUM_QUARTER, 0);
          //   let cmpQt = data.reduce((p, v) => p + v.SUM_QUARTER_COMPARE, 0);
          //   let incDec =  qt - cmpQt;
          //   let percent = 0;

          //   if (qt <= 0 && cmpQt <= 0) percent = 0;
          //   else if (qt <= 0) percent = -100;
          //   else if (cmpQt <= 0) percent = 100;
          //   else percent = ((qt - cmpQt) / cmpQt) * 100;

          //   return (
          //     <>y
          //       <Table.Summary.Row>
          //         <Table.Summary.Cell
          //           className="text-right"
          //           colSpan={3}
          //           index={0}
          //         >
          //           รวม
          //         </Table.Summary.Cell>
          //         <Table.Summary.Cell index={1} align={"right"}>
          //           {qt.toLocaleString(undefined, {
          //             maximumFractionDigits: 2,
          //             minimumFractionDigits: 2,
          //           })}
          //         </Table.Summary.Cell>
          //         <Table.Summary.Cell index={2} align={"right"}>
          //           {cmpQt.toLocaleString(undefined, {
          //             maximumFractionDigits: 2,
          //             minimumFractionDigits: 2,
          //           })}
          //         </Table.Summary.Cell>
          //         <Table.Summary.Cell index={3} align={"right"}>
          //           {incDec.toLocaleString(undefined, {
          //             maximumFractionDigits: 2,
          //             minimumFractionDigits: 2,
          //           })}
          //         </Table.Summary.Cell>
          //         <Table.Summary.Cell index={4} align={"right"}>
          //           {percent.toLocaleString(undefined, {
          //             maximumFractionDigits: 2,
          //             minimumFractionDigits: 2,
          //           }) + `%`}
          //         </Table.Summary.Cell>
          //       </Table.Summary.Row>
          //     </>
          //   );
          // }}
        />
      </Container>
    </>
  );
}
