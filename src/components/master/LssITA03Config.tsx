import { useState, useEffect, useCallback } from "react";
import { Card, Col, Modal, Button, Form, Row } from "react-bootstrap";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { LssITA03List, LssITA03Search } from "../../data";
import NavMenu from "../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
import Swal from "sweetalert2";
import "./LssITA05ConfigList.scss";

//icon control
import m_display from "../../assets/images/m_display.png";

const LssITA02ConfigList = () => {
  const [sAction, setSAction] = useState("");
  const [sCode, setSCode] = useState("");
  const [sTitle, setStitle] = useState("");
  const [sTitleIMG, setSTitleIMG] = useState("");

  const TitleData = {
    Display: "แสดงข้อมูล",
  };

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const columns: GridColDef[] = [
    {
      field: "CODE",
      headerName: "รหัสบริษัท",
      minWidth: 125,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "SHORTNAME",
      headerName: "ชื่อย่อ",
      minWidth: 100,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "NAME",
      headerName: "ชื่อบริษัท",
      minWidth: 350,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "COMPANY_TYPE_NAME",
      headerName: "ประเภทบริษัท",
      minWidth: 250,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "MAILSERVER",
      headerName: "อีเมลล์ Server",
      minWidth: 200,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "LICENSE",
      headerName: "ทะเบียนนิติ",
      minWidth: 200,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "ADDRESS",
      headerName: "ที่อยู่",
      minWidth: 300,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },

    {
      field: "ENABLE",
      headerName: "สถานะการใช้งาน",
      minWidth: 150,
      align: "center", 
      headerAlign: "center",
      renderCell: (params2: any) => {
        let eb = "";
        if (params2.row.ENABLE === "Y") {
          eb = "ใช้งาน";
        } else {
          eb = `ไม่ใช้งาน`;
        }
        return (
          <>
            <span className="fontHilight">{eb}</span>
          </>
        );
      },
    },
    {
      field: "col12",
      headerName: "ปุ่ม",
      minWidth: 150,
      align: "center", 
      headerAlign: "center",
      renderCell: (params3: any) => {
        return (
          <>
            <Button
              style={{
                marginRight: 5,
                backgroundColor: "#212529",
                color: "#fff",
              }}
              onClick={() => fnFindDisplyData(params3.id)}
              variant="contained"
            >
              แสดงรายละเอียด
            </Button>
          </>
        );
      },
    },
  ];

  const BtnAction = useCallback(
    (id: string, sAction: string) => () => {
      let setdata = { CODE: String(id) };
      if (sAction === "Display") {
        LssITA03Search(setdata)
          .then((res: any) => {
            //console.log(res);
          })
          .catch((err: any) => {
            if (err.response.data.status === 404) {
              Swal.fire(
                "รหัสไม่ถูกต้อง",
                "รหัสรหัสคีย์ไม่มีในระบบตรวจสอบการกรอกข้อมูลอีกครั้ง ",
                "warning"
              );
            }
            if (err.status === 400) {
              Swal.fire("แจ้งเตือน", "ตรวจสอบการกรอกข้อมูลอีกครั้ง", "warning");
            }
          });

        setStitle(TitleData.Display);
        setSTitleIMG(m_display);
      }
      console.log("xxxxxxxxxx");
      setSCode(id);
      setSAction(sAction);
      setShow(true);
    },
    []
  );

  const fetchData = () => {
    LssITA03List().then((data) => {
      let tmpSchema = [];
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: data[i].CODE,
          ADDRESS: data[i].ADDRESS,
          CODE: data[i].CODE,
          COMPANY_TYPE_CODE: data[i].COMPANY_TYPE_CODE,
          CREATED_DATE: data[i].CREATED_DATE,
          CREATE_USER: data[i].CREATE_USER,
          DEL: data[i].DEL,
          ENABLE: data[i].ENABLE,
          FAX: data[i].FAX,
          LICENSE: data[i].LICENSE,
          MAILSERVER: data[i].MAILSERVER,
          NAME: data[i].NAME,
          NAME_EN: data[i].NAME_EN,
          SHORTNAME: data[i].SHORTNAME,
          TEL: data[i].TEL,
          UPDATED_DATE: data[i].UPDATED_DATE,
          UPDATE_USER: data[i].UPDATE_USER,
          COMPANY_TYPE_NAME: data[i].COMPANY_TYPE_NAME,
        });
      }
      setTableData(tmpSchema);
    });
  };

  const fnFindDisplyData = (id: any) => {
    let setdata = { CODE: String(id) };
    LssITA03Search(setdata).then((data: any) => {
      let displaychema = [];
      for (let i = 0; i < data.length; i++) {
        displaychema.push({
          id: data[i].CODE,
          ADDRESS: data[i].ADDRESS,
          CODE: data[i].CODE,
          COMPANY_TYPE_CODE: data[i].COMPANY_TYPE_CODE,
          CREATED_DATE: data[i].CREATED_DATE,
          CREATE_USER: data[i].CREATE_USER,
          DEL: data[i].DEL,
          ENABLE: data[i].ENABLE,
          FAX: data[i].FAX,
          LICENSE: data[i].LICENSE,
          MAILSERVER: data[i].MAILSERVER,
          NAME: data[i].NAME,
          NAME_EN: data[i].NAME_EN,
          SHORTNAME: data[i].SHORTNAME,
          TEL: data[i].TEL,
          UPDATED_DATE: data[i].UPDATED_DATE,
          UPDATE_USER: data[i].UPDATE_USER,
          COMPANY_TYPE_NAME: data[i].COMPANY_TYPE_NAME,
          
        });
      }
      setShow(true);
      setModalData(displaychema);
      setSTitleIMG(m_display);
      setStitle("รายละเอียด");
      Swal.close();
    });
  };

  const [tableData, setTableData] = useState<
    {
      id: any;
      ADDRESS: any;
      CODE: any;
      COMPANY_TYPE_CODE: any;
      CREATED_DATE: any;
      CREATE_USER: any;
      DEL: any;
      ENABLE: any;
      FAX: any;
      LICENSE: any;
      MAILSERVER: any;
      NAME: any;
      NAME_EN: any;
      SHORTNAME: any;
      TEL: any;
      UPDATED_DATE: any;
      UPDATE_USER: any;
      COMPANY_TYPE_NAME: any;
      
    }[]
  >([]);

  const [modalData, setModalData] = useState<
    {
      id: any;
      ADDRESS: any;
      CODE: any;
      COMPANY_TYPE_CODE: any;
      CREATED_DATE: any;
      CREATE_USER: any;
      DEL: any;
      ENABLE: any;
      FAX: any;
      LICENSE: any;
      MAILSERVER: any;
      NAME: any;
      NAME_EN: any;
      SHORTNAME: any;
      TEL: any;
      UPDATED_DATE: any;
      UPDATE_USER: any;
      COMPANY_TYPE_NAME: any;
 
      
    }[]
  >([]);

  useEffect(() => {
    fetchData();
  }, []);

  const [show, setShow] = useState(false);

  const fnModal = (flag: any) => {
    setShow(flag);
  };

  return (
    <div>
      <NavMenu />
      <Card className="card">
        <Card.Body>
          <Col
            md={12}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              textAlign: "right",
              marginTop: 100,
            }}
          ></Col>
          <Col>
            <div style={{ width: "100%" }}>
              <h5>
                <FaBars size={30} style={{ margin: "auto" }} />
                &nbsp;&nbsp;LSS-IT-A03 ข้อมูลบริษัทประกันภัย
              </h5>
              <div style={{ height: 500, width: "100%" }}>
                <div style={{ display: "flex", height: "100%" }}>
                  <div style={{ flexGrow: 1 }}>
                    <DataGrid
                      className=""
                      sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                      rows={tableData}
                      columns={columns}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Card.Body>
        <Card.Footer>
          <Modal
            size="xl"
            show={show}
            onHide={() => setShow(false)}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-custom-modal-styling-title">
                <img
                  className="align-self-center"
                  src={sTitleIMG}
                  alt="รายละเอียด"
                  style={{ width: "30px", height: "30px" }}
                />
                {sTitle}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalData.length > 0 && (
                <div>
                  <Row className="mb-3">
                    <Col sm="4">
                      <Form.Group as={Row}>
                        <Form.Label column sm="4">
                          รหัสบริษัท : 
                        </Form.Label>
                        <Col>
                          <Form.Control
                            readOnly
                            defaultValue={modalData[0].CODE}
                          />
                        </Col>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group as={Row}>
                        <Form.Label column sm="2">
                          ชื่อบริษัท :
                        </Form.Label>
                        <Col>
                          <Form.Control
                            readOnly
                            defaultValue={modalData[0].NAME}
                          />
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm="4">
                      <Form.Group as={Row}>
                        <Form.Label column sm="4">
                          ชื่อย่อ :
                        </Form.Label>
                        <Col>
                          <Form.Control
                            readOnly
                            defaultValue={modalData[0].SHORTNAME}
                          />
                        </Col>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group as={Row}>
                        <Form.Label column sm="2">
                          ชื่อภาษาอังกฤษ :
                        </Form.Label>
                        <Col>
                          <Form.Control
                            readOnly
                            defaultValue={modalData[0].NAME_EN}
                          />
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm="4">
                      <Form.Group as={Row}>
                        <Form.Label column sm="4">
                          ทะเบียนนิติ :
                        </Form.Label>
                        <Col>
                          <Form.Control
                            readOnly
                            defaultValue={modalData[0].LICENSE}
                          />
                        </Col>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group as={Row}>
                        <Form.Label column sm="2">
                          อีเมลล์ Server :
                        </Form.Label>
                        <Col>
                          <Form.Control
                            readOnly
                            defaultValue={modalData[0].MAILSERVER}
                          />
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>

                 

                  <Form.Group as={Row}>
                    <Form.Label column sm="1" style={{ marginRight: "2rem"}}>
                      ที่อยู่ :
                    </Form.Label>
                    <Col>
                      <Form.Control
                        readOnly
                        as="textarea"
                        rows={7}
                        defaultValue={modalData[0].ADDRESS}
                      />
                    </Col>
                  </Form.Group>
                </div>
              )}
            </Modal.Body>
          </Modal>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default LssITA02ConfigList;
