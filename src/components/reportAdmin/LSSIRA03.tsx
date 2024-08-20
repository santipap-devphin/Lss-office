import React, { ChangeEvent, SyntheticEvent, useCallback } from "react";
import { useState, useEffect } from "react";
import { Col, Row, Card, Container, Form, FormGroup, FormLabel } from "react-bootstrap";
import { DataGrid, GridColDef, GridRenderCellParams, GridValueFormatterParams } from "@mui/x-data-grid";
import { donwloadFile, getCommon, getLSSIRA03, getCompanyList, getSectionList, LssITA60ListAPI, getLSSIRA05OnLoad, downloadFilePost } from "../../data";
//import moment from "moment";
import NavMenu from "../fragments/NavMenu";
import "./LssEt030CompareCrr.scss";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import Downloading from "@mui/icons-material/Downloading";
import { CompanySelect } from "../../models/common/company-select.model";
import { PrefixSelect } from "../../models/common/prefix-select.model";
import { FaBars } from "react-icons/fa";
import { DatePicker, DatePickerProps } from "antd";
import { Moment } from "moment";
import { parseISO } from "date-fns";
import { LSS_V_LSSIRA03 } from "../../models/office/LSS_V_LSSIRA03.model";
import { toThaiDateString } from "../../functions/Date";

const styles = {
  datpicker: {
    width: "100%",
    height: "100%",
    verticalAlign: "middle",
  },
};

export default function LSSIRA02() {
  const [gridData, setGridData] = useState<LSS_V_LSSIRA03[]>([]);
  const [common, setCommon] = useState<{
    COMPANIES: CompanySelect[];
    PREFIXES: PrefixSelect[];
    SECTIONS: any[];
  }>({
    COMPANIES: [],
    PREFIXES: [],
    SECTIONS: [],
  });

  const [from, setFrom] = useState<Moment | null>(null);
  const [to, setTo] = useState<Moment | null>(null);
  const [ipAddress, setIpAddress] = useState<string>("");
  const [program, setProgram] = useState<string>("");
  const [programOptions, setProgramOptions] = useState<any[]>([]);
  const [func, setFunc] = useState<string>("");
  const [funcOptins, setFuncOptions] = useState<any[]>([]);
  const [accountType, setAccountType] = useState<string>("0");
  const [company, setCompany] = useState<string>("0");
  const [companyOptions, setCompanyOptions] = useState<any[]>([]);
  const [section, setSection] = useState<string>("0");
  const [sectionOptions, setSectionOptions] = useState<any[]>([]);
  const [companyType, setCompanyType] = useState<string>("0");
  const [loginName, setLoginName] = useState<string>("");

  const _companyOptions = companyOptions.filter(x => x.COMPANY_TYPE_CODE === companyType || companyType === "0")
  const _funcOptins = funcOptins.filter(f => f.MENU_CODE === program);

  const handleOnLoad = useCallback(() => {
    return new Promise((resolve) => {
      getCommon().then((data: any) => {
        setCommon({
          COMPANIES: [...data.COMPANIES] as CompanySelect[],
          PREFIXES: [...data.PREFIXES] as PrefixSelect[],
          SECTIONS: [...data.SECTIONS],
        });
      });

      getLSSIRA05OnLoad().then((data) => {
        setProgramOptions(data.MENUS);
        setFuncOptions(data.FUNCTIONS);
      });

      getCompanyList({}).then((data) => {
        setCompanyOptions(data)
      })
      getSectionList({}).then((data) => {
        setSectionOptions(data)
      })

      // LssITA60ListAPI().then((data) => {
      //   setProgramOptions(data)
      // })

      // getLSSIRA03(null).then((data) => {
      //   setGridData(() => data);
      // });
      handleSearch();
      resolve(true);
    });
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ลำดับ", minWidth: 5, align: "center", headerAlign: "center" },
    {
      field: "LOG_DATE",
      headerName: "วันที่/เวลา",
      minWidth: 200,
      align: "left",
      headerAlign: "center",
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        const date = parseISO(params.value);
        return date.toLocaleTimeString("th-TH", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      },
    },

    {
      field: "LOGIN_NAME",
      headerName: "ชื่อบัญชีผู้ใช้งาน",
      minWidth: 250,
      align: "left",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "ACCOUNT_TYPE_NAME",
      headerName: "ประเภท Account",
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    { field: "IP_ADDRESS",
      headerName: "IP Address", 
      flex: 1, 
      minWidth: 150, 
      align: "center", 
      headerAlign: "center", 
    },
    {
      field: "COMPANY_NAME",
      minWidth: 350,
      align: "left", 
      headerAlign: "center",
      headerName: "ชื่อบริษัท/ชื่อสังกัด",
    },
    // {
    //   field: "UNK",
    //   headerName: "รหัสระบบงานหลัก",
    //   renderCell: (params: GridRenderCellParams<any, any, any>) => {
    //     return <>LSS</>;
    //   },
    //   flex: 1,
    // },
    // {
    //   field: "1",
    //   headerName: "รหัสระบบงานย่อย",
    //   flex: 1,
    //   renderCell: (params: GridRenderCellParams<any, any, any>) => {
    //     return (
    //       <>
    //         {params?.row?.ACCOUNT_TYPE_CODE === "0"
    //           ? "ฝั่งบริษัท"
    //           : "ฝั่งเจ้าหน้าที่"}
    //       </>
    //     );
    //   },
    // },
    { field: "MENU_CODE", headerName: "รหัสโปรแกรม", flex: 1, minWidth: 250 },
    { field: "MENU_NAME", headerName: "ชื่อโปรแกรม", flex: 1, minWidth: 350},
    {
      flex: 1,
      field: "DESCRIPTION",
      minWidth: 450,
      headerName: "รายละเอียด/เหตุการณ์/กิจกรรม",
    },
  ];

  const customDateFormat: DatePickerProps["format"] = (date: Moment) => {
    return toThaiDateString(date.toDate(), "DD/MM/YYYY");
  };

  const handleSearch = () => {
    let record = {} as Record<string, any>;

    if (from && to && from.diff(to) <= 0) {
      record["FROM"] = from.toDate().toISOString();
      record["TO"] = to.toDate().toISOString();
    }

    if (ipAddress !== "") record["IP_ADDRESS"] = ipAddress;

    if (program !== "") record["MENU_CODE"] = program;

    if (func !== "") record["FUNCTION_CODE"] = func;

    if (accountType !== "") record["ACCOUNT_TYPE_CODE"] = accountType;

    if (company !== "0" && company !== "" && accountType === "0") record["COMPANY_CODE"] = company;

    if (section !== "0" && section !== "" && accountType === "1") record["SECTION_CODE"] = section;

    if (loginName !== "") record["LOGIN_NAME"] = loginName;

    if (companyType !== "0" && companyType !== "") record["COMPANY_TYPE_CODE"] = companyType;


    getLSSIRA03(record).then((data) => {
      setGridData(data);
    });
  };

  const handleFromChanged = (date: Moment | null) => {
    setFrom(() => date);
  };

  const handleToChanged = (date: Moment | null) => {
    setTo(() => date);
  };

  const handleDownloadExcel = () => {
    let record = {} as Record<string, any>;

    if (from && to && from.diff(to) <= 0) {
      record["FROM"] = from.toDate().toISOString();
      record["TO"] = to.toDate().toISOString();
    }

    if (ipAddress !== "") record["IP_ADDRESS"] = ipAddress;

    if (program !== "") record["MENU_CODE"] = program;

    if (func !== "") record["FUNCTION_CODE"] = func;

    if (accountType !== "") record["ACCOUNT_TYPE_CODE"] = accountType;

    if (company !== "0" && company !== "" && accountType === "0") record["COMPANY_CODE"] = company;

    if (section !== "0" && section !== "" && accountType === "1") record["SECTION_CODE"] = section;

    if (loginName !== "") record["LOGIN_NAME"] = loginName;

    if (companyType !== "0" && companyType !== "") record["COMPANY_TYPE_CODE"] = companyType;
    downloadFilePost(
      `/LssIRA03/LSSIRA03Excel`,
      "LSS-IR-A03_รายงานเมื่อระบบเกิดข้อผิดพลาด(Error_log).xlsx",
      record
    );
  };

  useEffect(() => {
    handleOnLoad();
  }, [handleOnLoad]);

  return (
    <Container fluid>
      <Row>
        <Col>
          <NavMenu />
          <h5 style={{ marginTop: "7rem" }}>
            <FaBars size={30} style={{ margin: "auto" }} />
            &nbsp;&nbsp;LSS-IR-A03 รายงานเมื่อระบบเกิดข้อผิดพลาด (Error log)
          </h5>
          <Card>
            <Card.Header>
              LSS-IR-A03 รายงานเมื่อระบบเกิดข้อผิดพลาด (Error log)
            </Card.Header>
            <Card.Body>
              <Row className="flex-column flex-md-row mb-2">
                <Col>
                  <Row>
                    <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                      <FormGroup as={Row} className="align-items-center">
                        <FormLabel className="col-md-4 label-right mb-0">ตั้งแต่วันที่</FormLabel>
                        <Col md="8">
                          <DatePicker
                            allowClear={true}
                            format={customDateFormat}
                            className="form-control"
                            value={from ?? null}
                            onChange={handleFromChanged}
                            style={styles.datpicker}
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                      <FormGroup as={Row} className="align-items-center">
                        <FormLabel className="col-md-4 label-right mb-0">ถึงวันที่</FormLabel>
                        <Col md="8">
                          <DatePicker
                            allowClear={true}
                            format={customDateFormat}
                            className="form-control"
                            value={to ?? null}
                            onChange={handleToChanged}
                            style={styles.datpicker}
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                      <FormGroup as={Row} className="align-items-center">
                        <FormLabel className="col-md-4 label-right mb-0">IP</FormLabel>
                        <Col md="8">
                          <Form.Control
                            type="text"
                            value={ipAddress}
                            onInput={(e: ChangeEvent<HTMLInputElement>) => {
                              setIpAddress(() => e.target.value);
                            }}
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                      <FormGroup as={Row} className="align-items-center">
                        <FormLabel className="col-md-4 label-right mb-0">รหัสโปรแกรม</FormLabel>
                        <Col md="8">
                          <select
                            className="form-select"
                            value={program}
                            onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
                              setProgram(() => e.currentTarget.value);
                              setFunc("")
                            }}
                          >
                            <option value=""></option>
                            {programOptions.map((c) => (
                              <option key={c.CODE} value={c.CODE}>
                                {c.NAME}
                              </option>
                            ))}
                          </select>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                      <FormGroup as={Row} className="align-items-center">
                        <FormLabel className="col-md-4 label-right mb-0">ฟั่งชั่น</FormLabel>
                        <Col md="8">
                          <select
                            className="form-select"
                            disabled={!program}
                            value={func}
                            onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
                              setFunc(() => e.currentTarget.value);
                            }}
                          >
                            <option value=""></option>
                            {_funcOptins.map((c) => (
                              <option key={c.CODE} value={c.CODE}>
                                {c.NAME}
                              </option>
                            ))}
                          </select>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                      <FormGroup as={Row} className="align-items-center">
                        <FormLabel className="col-md-4 label-right mb-0">ประเภทผู้ใช้งาน</FormLabel>
                        <Col md="8">
                          <select
                            className="form-select"
                            value={accountType}
                            onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
                              setAccountType(() => e.currentTarget.value);
                              setCompany("")
                              setSection("")
                            }}
                          >
                            <option value="0">บริษัทฯ</option>
                            <option value="1">เจ้าหน้าที่</option>
                          </select>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                      <FormGroup as={Row} className="align-items-center">
                        <FormLabel className="col-md-4 label-right mb-0">ประเภทบริษัท</FormLabel>
                        <Col md="8">
                          <select
                            className="form-select"
                            value={companyType}
                            onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
                              setCompanyType(() => e.currentTarget.value);
                              setCompany("")
                            }}
                          >
                            <option value="0">ทั้งหมด</option>
                            <option value="LIFE">บริษัทประกันชีวิต</option>
                            <option value="NONLIFE">บริษัทประกันวินาศภัย</option>
                          </select>
                        </Col>
                      </FormGroup>
                    </Col>
                    {
                      accountType === "0" && <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                        <FormGroup as={Row} className="align-items-center">
                          <FormLabel className="col-md-4 label-right mb-0">บริษัท</FormLabel>
                          <Col md="8">
                            <select
                              className="form-select"
                              value={company}
                              onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
                                setCompany(() => e.currentTarget.value);
                              }}
                            >
                              <option value="0">ทั้งหมด</option>
                              {_companyOptions.map((c) => (
                                <option key={c.CODE} value={c.CODE}>
                                  {c.NAME}
                                </option>
                              ))}
                            </select>
                          </Col>
                        </FormGroup>
                      </Col>
                    }
                    {
                      accountType === "1" && <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                        <FormGroup as={Row} className="align-items-center">
                          <FormLabel className="col-md-4 label-right mb-0">สังกัด</FormLabel>
                          <Col md="8">
                            <select
                              className="form-select"
                              value={section}
                              onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
                                setSection(() => e.currentTarget.value);
                              }}
                            >
                              <option value="0">ทั้งหมด</option>
                              {sectionOptions.map((c) => (
                                <option key={c.CODE} value={c.CODE}>
                                  {c.DESCRIPTION}
                                </option>
                              ))}
                            </select>
                          </Col>
                        </FormGroup>
                      </Col>
                    }
                    <Col xl="3" lg="4" md="6" xs="12" className="mb-2">
                      <FormGroup as={Row} className="align-items-center">
                        <FormLabel className="col-md-4 label-right mb-0">ชื่อบัญชี</FormLabel>
                        <Col md="8">
                          <Form.Control
                            type="text"
                            value={loginName}
                            onInput={(e: ChangeEvent<HTMLInputElement>) => {
                              setLoginName(() => e.target.value);
                            }}
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col xs="auto">
                  <div className="d-flex align-items-start flex-nowrap">
                    <Button
                      style={{ marginRight: 5 }}
                      variant="contained"
                      startIcon={<Search />}
                      onClick={handleSearch}
                    >
                      {" "}
                      ค้นหา
                    </Button>
                    <Button
                      style={{ marginRight: 5 }}
                      variant="contained"
                      startIcon={<Downloading />}
                      onClick={handleDownloadExcel}
                    >
                      {" "}
                      Excel
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col xs="12">
                  <div style={{ height: 500, width: "100%" }}>
                    <DataGrid rows={gridData} columns={columns} />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
