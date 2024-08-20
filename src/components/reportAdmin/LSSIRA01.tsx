import {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  SyntheticEvent,
} from "react";
import { Col, Row, Card, Container, Form, FormGroup, FormLabel } from "react-bootstrap";
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { Moment } from "moment";
import NavMenu from "../fragments/NavMenu";
import "./LssEt030CompareCrr.scss";
import Button from "@mui/material/Button";
import Search from "@mui/icons-material/Search";
import Downloading from "@mui/icons-material/Downloading";
import { DataResponse } from "../../models/common/data-response.model";
import { CompanySelect } from "../../models/common/company-select.model";
import { PrefixSelect } from "../../models/common/prefix-select.model";
import { FaBars } from "react-icons/fa";
import { DatePicker, DatePickerProps } from "antd";
import { getCommon, getLSSIRA01, donwloadFile, getCompanyList, getSectionList, downloadFilePost } from "../../data";
import { LSS_V_LSSIRA01 } from "../../models/office/LSS_V_LSSIRA01.model";
import { parseISO } from "date-fns";
import { toThaiDateString } from "../../functions/Date";

const styles = {
  datpicker: {
    width: "100%",
    height: "100%",
    verticalAlign: "middle",
  },
};

export default function LSSIRA01() {
  const columns: GridColDef[] = [
    {
      field: "AUTH_DATE",
      headerName: "วันที่",
      minWidth: 170,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        var mydate = parseISO(params.value);
        return mydate.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      },
    },
    {
      field: "LOGIN_NAME",
      headerName: "บัญชีผู้ใช้",
      minWidth: 170,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "FULLNAME",
      headerName: "ชื่อผู้ใช้งาน",
      minWidth: 170,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "ACCOUNT_TYPE_CODE",
      headerName: "ประเภท Account",
      minWidth: 170,
      align: "left",
      headerAlign: "center",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        const typeNum = Number(params.value);
        if (typeNum === 0) {
          return "บริษัทประกัน";
        } else {
          return "เจ้าหน้าที่";
        }
      },
    },
    {
      field: "IP_ADDRESS",
      headerName: "Ip Address",
      minWidth: 170,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "COMPANY_NAME",
      headerName: "ชื่อบริษัท/สังกัด",
      minWidth: 170,
      align: "left",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "DESCRIPTION",
      headerName: "รายละอียด/กิจกรรม",
      minWidth: 150,
      align: "left",
      headerAlign: "center",
      flex: 1,
    },
  ];

  const [common, setCommon] = useState<DataResponse>({
    COMPANIES: [],
    PREFIXES: [],
  });

  const [gridData, setGridData] = useState<LSS_V_LSSIRA01[]>([]);
  const [from, setFrom] = useState<Moment | null>(null);
  const [to, setTo] = useState<Moment | null>(null);
  const [ipAddress, setIpAddress] = useState<string>("");
  const [company, setCompany] = useState<string>("0");
  const [companyOptions, setCompanyOptions] = useState<any[]>([]);
  const [section, setSection] = useState<string>("0");
  const [sectionOptions, setSectionOptions] = useState<any[]>([]);
  const [companyType, setCompanyType] = useState<string>("0");
  const [loginName, setLoginName] = useState<string>("");
  const [accountType, setAccountType] = useState<string>("0");

  const _companyOptions = companyOptions.filter(x => x.COMPANY_TYPE_CODE === companyType || companyType === "0")

  const customDateFormat: DatePickerProps["format"] = (date: Moment) => {
    return toThaiDateString(date.toDate(), "DD/MM/YYYY");
  };

  const onLoad = () => {
    return new Promise((resolve) => {
      getCommon().then((data: DataResponse) => {
        setCommon({
          COMPANIES: [...data.COMPANIES] as CompanySelect[],
          PREFIXES: [...data.PREFIXES] as PrefixSelect[],
        });
      });

      getCompanyList({}).then((data) => {
        setCompanyOptions(data)
      })
      getSectionList({}).then((data) => {
        setSectionOptions(data)
      })

      // getLSSIRA01(null).then((data) => {
      //   setGridData(() => data);
      // });
      handleSearch();
      resolve(true);
    });
  };

  const handleFromChanged = useCallback((date: Moment | null) => {
    setFrom(date);
  }, []);

  const handleToChanged = useCallback((date: Moment | null) => {
    setTo(date);
  }, []);

  const handleSearch = () => {
    let record = {} as Record<string, any>;
    if (from && to && from.diff(to) <= 0) {
      record["FROM"] = from.toDate().toISOString();
      record["TO"] = to.toDate().toISOString();
    }

    if (company !== "0" && company !== "" && accountType === "0") record["COMPANY_CODE"] = company;

    if (section !== "0" && section !== "" && accountType === "1") record["SECTION_CODE"] = section;

    if (ipAddress !== "") record["IP_ADDRESS"] = ipAddress;

    if (loginName !== "") record["LOGIN_NAME"] = loginName;

    if (accountType !== "") record["ACCOUNT_TYPE_CODE"] = accountType;

    if (companyType !== "0" && companyType !== "") record["COMPANY_TYPE_CODE"] = companyType;

    getLSSIRA01(record).then((data) => {
      setGridData(() => data);
    });
  };

  const handleDownloadExcel = () => {
    let record = {} as Record<string, any>;
    if (from && to && from.diff(to) <= 0) {
      record["FROM"] = from.toDate().toISOString();
      record["TO"] = to.toDate().toISOString();
    }

    if (company !== "0" && company !== "" && accountType === "0") record["COMPANY_CODE"] = company;

    if (section !== "0" && section !== "" && accountType === "1") record["SECTION_CODE"] = section;

    if (ipAddress !== "") record["IP_ADDRESS"] = ipAddress;

    if (loginName !== "") record["LOGIN_NAME"] = loginName;

    if (accountType !== "") record["ACCOUNT_TYPE_CODE"] = accountType;

    if (companyType !== "0" && companyType !== "") record["COMPANY_TYPE_CODE"] = companyType;
    downloadFilePost(
      `/LssIRA01/LSSIRA01Excel`,
      "LSS-IR-A01_รายงานการยืนยันตัวตน_(Authentication).xlsx",
      record
    );
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col>
          <NavMenu />
          <h5 style={{ marginTop: "7rem" }}>
            <FaBars size={30} style={{ margin: "auto" }} />
            &nbsp;&nbsp;LSS-IR-A01 รายงานการยืนยันตัวตน (Authentication)
          </h5>
          <Card>
            <Card.Header>
              LSS-IR-A01 รายงานการยืนยันตัวตน (Authentication)
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
                  </Row>
                  <Row>
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
                          <FormLabel className="col-md-4 label-right mb-0">หน่วยงาน</FormLabel>
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
