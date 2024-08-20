import { useState, useEffect, useCallback } from "react";
import { Card, Col, Modal, Button, Row } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import {
  LssITA02List,
  LssITA02Approved,
  LssITA02NotApproved,
  LssITA02ApproveAuto,
  Loadcheck,
  LssITA02Search,
} from "../../data";
import NavMenu from "../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
import Swal from "sweetalert2";
import ObjOpen from "./LssITA02ListModal";
import "./LssITA05ConfigList.scss";
import { Switch } from 'antd';

//icon control
import m_display from "../../assets/images/m_display.png";
import { data } from './../user/DashboardUser';

const LssITA02ConfigList = () => {
  const [sAction, setSAction] = useState("");
  const [sCode, setSCode] = useState("");
  const [sTitle, setStitle] = useState("");
  const [sTitleIMG, setSTitleIMG] = useState("");
  const [sBtn, setSBtn] = useState("");
  const [sReadOnly, setSReadOnly] = useState(true);
  const [isCheck, setIsCheck] = useState(() => false)

  const fnLoad = useCallback(async () => {
    Loadcheck().then((data: any) => {
      console.log(data);
      let tmpValue = String(data.VALUE);
      console.log("Value-Temp:" + tmpValue);
      if(tmpValue == "on"){
        setIsCheck(true);
      }else{
        setIsCheck(false);
      }
    }); //getPayinList
  }, []);

  const onChange = (checked: boolean) => {
    let valuetmp = { CODE: "" };
    if(checked == true){
      valuetmp = { CODE: "on" };
      setIsCheck(true);
    }else{
      valuetmp = { CODE: "off" };
      setIsCheck(false);
    }
    LssITA02ApproveAuto(valuetmp)
    .then((res) => {
      if(checked == true){
        Swal.fire("ดำเนินการ", "ปรับการอนุมัติใบรับรองอิเล็กทรอนิกส์ AUTO ", "success").then(() => {});
      }else{
        Swal.fire("ดำเนินการ", "ปรับการอนุมัติใบรับรองอิเล็กทรอนิกส์ MANUAL ", "success").then(() => {});
      }
      
      fetchData();
    })
    .catch((err) => {
      if (err.response.data.status === 404) {
        Swal.fire(
          "ผิดพลาด",
          "ไม่สามารถปรับการอนุมัติใบรับรองอิเล็กทรอนิกส์ อัตโนมัติ",
          "warning"
        );
      }
      if (err.status === 400) {
        Swal.fire("แจ้งเตือน", "ระบบเกิดข้อผิดพลาด กรุณาคลิกอีกครั้ง", "warning");
      }
    });
  };

  const TitleData = {
    Edit: "แก้ไขข้อมูล",
    Display: "แสดงข้อมูล",
  };

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const columns = [
    {
      field: "col10",
      headerName: "ปุ่ม",
      minWidth: 80,
      renderCell: (params1: any) => {
        if(params1.row.STATUS == "Request"){
          return (
            <>
              <Button
                style={{
                  marginRight: 5,
                  backgroundColor: "#4AAE23",
                  color: "#fff"
                }}
                variant="contained"
                onClick={() => ApprovedData(params1.id)}
              >
                ✔ อนุมัติ
              </Button>
            </>
          );
        }else{
          return (
            <>
              <Button
                style={{
                  marginRight: 5,
                  backgroundColor: "#4AAE23",
                  color: "#fff",
                  opacity: "0.1"
                }}
                variant="contained"
                //onClick={() => ApprovedData(params1.id)}
              >
                ✔ อนุมัติ
              </Button>
            </>
          );
        }
        
      },
    },
    {
      field: "col11",
      headerName: "ปุ่ม",
      minWidth: 80,
      renderCell: (params2: any) => {
        if(params2.row.STATUS == "Request"){
          return (
            <>
              <Button
                style={{
                  marginRight: 5,
                  backgroundColor: "#ff4000",
                  color: "#fff",
                }}
                variant="contained"
                onClick={() => NotApprovedData(params2.id)}
              >
                X ไม่อนุมัติ
              </Button>
            </>
          );
        }else{
          return (
            <>
              <Button
                style={{
                  marginRight: 5,
                  backgroundColor: "#ff4000",
                  color: "#fff",
                  opacity: "0.1"
                }}
                variant="contained"
                //onClick={() => NotApprovedData(params2.id)}
              >
                X ไม่อนุมัติ
              </Button>
            </>
          );
        }
        
      },
    },
    {
      field: "col12",
      headerName: "ปุ่ม",
      minWidth: 150,
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
              ดูรายละเอียด
            </Button>
          </>
        );
      },
    },
    {
      field: "CREATED_DATE",
      headerName: "วันที่ส่งเรื่อง",
      minWidth: 125,
      headerClassName: "headgrid",
    },
    {
      field: "SERIAL_NUMBER",
      headerName: "หมายเลขใบรับรองอิเล็กทรอนิกส์",
      minWidth: 250,
      headerClassName: "headgrid",
    },
    {
      field: "COMPANY_NAME",
      headerName: "ชื่อบริษัท",
      minWidth: 200,
      headerClassName: "headgrid",
    },
    {
      field: "NOT_BEFORE",
      headerName: "วันที่สมัคร",
      minWidth: 125,
      headerClassName: "headgrid",
    },
    {
      field: "ISSUER",
      headerName: "ข้อมูลประเภทธุรกิจ",
      minWidth: 200,
      headerClassName: "headgrid",
    },
    {
      field: "NOT_AFTER",
      headerName: "วันหมดอายุ",
      minWidth: 125,
      headerClassName: "headgrid",
    },
    {
      field: "STATUS",
      headerName: "ตรวจสถานะใบรับรอง",
      minWidth: 150,
      renderCell: (params2: any) => {
        let eb = "";
        if (params2.row.STATUS === "Approved") {
          eb = "อนุมัติ";
        } else if (params2.row.STATUS === "Not Approved") {
          eb = "ไม่อนุมัติ";
        } else {
          eb = `ส่งเรื่อง`;
        }
        return (
          <>
            <span className="fontHilight">{eb}</span>
          </>
        );
      },
    },
    {
      field: "ENABLE",
      headerName: "สถานะการใช้งาน",
      minWidth: 150,
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

  ];

  

  const BtnAction = useCallback(
    (id: string, sAction: string) => () => {
      let setdata = { CODE: String(id) };
      if (sAction === "Display") {
        LssITA02Search(setdata)
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

        setSBtn("none");
        setSReadOnly(true);
        setStitle(TitleData.Display);
        setSTitleIMG(m_display);
      }
      setSCode(id);
      setSAction(sAction);
      setShow(true);
    },
    []
  );

  // format datetime
  const FormatDate = (data: Date) => {
    let current = new Date(data);
    const yyyy = current.getFullYear() + 543;
    let mm = current.getMonth() + 1; // Months start at 0!
    let dd = current.getDate();
    let checkdate = dd + "/" + mm + "/" + yyyy;
    return checkdate;
  };
  const fetchData = () => {
    LssITA02List().then((data) => {
      let tmpSchema = [];
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: data[i].CODE,
          CODE: data[i].CODE,
          COMPANY_CODE: data[i].COMPANY_CODE,
          COMPANY_NAME: data[i].COMPANY_NAME,
          CREATED_DATE: FormatDate(data[i].CREATED_DATE),
          CREATE_USER: data[i].CREATE_USER,
          DEL: data[i].DEL,
          ENABLE: data[i].ENABLE,
          ISSUER: data[i].ISSUER,
          NOT_AFTER: FormatDate(data[i].NOT_AFTER),
          NOT_BEFORE: FormatDate(data[i].NOT_BEFORE),
          SERIAL_NUMBER: data[i].SERIAL_NUMBER,
          SIGNATURE_ALGORITHM: data[i].SIGNATURE_ALGORITHM,
          STATUS: data[i].STATUS,
          SUBJECT: data[i].SUBJECT,
          THUMB_PRINT: data[i].THUMB_PRINT,
          UPDATED_DATE: data[i].UPDATED_DATE,
          UPDATE_USER: data[i].UPDATE_USER,
          VERSION: data[i].VERSION,
        });
      }
      setTableData(tmpSchema);
    });
  };

  const fnFindDisplyData = (id: any) => {
    let setdata = { CODE: String(id) };
    LssITA02Search(setdata).then((data: any) => {
      let displaychema = [];
      for (let i = 0; i < data.length; i++) {
        displaychema.push({
          id: data[i].CODE,
          CODE: data[i].CODE,
          COMPANY_CODE: data[i].COMPANY_CODE,
          COMPANY_NAME: data[i].COMPANY_NAME,
          CREATED_DATE: FormatDate(data[i].CREATED_DATE),
          CREATE_USER: data[i].CREATE_USER,
          DEL: data[i].DEL,
          ENABLE: data[i].ENABLE,
          ISSUER: data[i].ISSUER,
          NOT_AFTER: FormatDate(data[i].NOT_AFTER),
          NOT_BEFORE: FormatDate(data[i].NOT_BEFORE),
          SERIAL_NUMBER: data[i].SERIAL_NUMBER,
          SIGNATURE_ALGORITHM: data[i].SIGNATURE_ALGORITHM,
          STATUS: data[i].STATUS,
          SUBJECT: data[i].SUBJECT,
          THUMB_PRINT: data[i].THUMB_PRINT,
          UPDATED_DATE: data[i].UPDATED_DATE,
          UPDATE_USER: data[i].UPDATE_USER,
          VERSION: data[i].VERSION,
        });
      }
      setShow(true);
      setModalData(displaychema);
      setSTitleIMG(m_display);
      setStitle("รายละเอียด");
      Swal.close();


      setSCode(id);
      setSAction("Display");
      setShow(true);
      setSBtn("none");
      setSReadOnly(true);
      setStitle(TitleData.Display);
      setSTitleIMG(m_display);

    });
  };





  // อนุมัติ
  const ApprovedData = (data: Record<string, any>) => {
    let setdata = { CODE: String(data) };
    swalWithBootstrapButtons
      .fire({
        title: "การอนุมัติ",
        text: "ยืนยันการอนุมัติผู้ขอใช้ระบบงาน",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ยืนยันการอนุมัติ!",
        cancelButtonText: "ออก!",
        reverseButtons: true,
        customClass: {
          confirmButton: "btn btn-success ms-2",
          cancelButton: "btn btn-danger",
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          LssITA02Approved(setdata)
            .then((res) => {
              Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(() => {

              });
              fetchData();
            })
            .catch((err) => {
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
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  };







  const NotApprovedData = (data: Record<string, any>) => {
    //console.log(data);
    let setdata = { CODE: String(data) };
    swalWithBootstrapButtons
      .fire({
        title: "การไม่อนุมัติ",
        text: "ยืนยันการไม่อนุมัติผู้ขอใช้ระบบงาน",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ยืนยันการไม่อนุมัติ!",
        cancelButtonText: "ออก!",
        reverseButtons: true,
        customClass: {
          confirmButton: "ms-2 btn btn-danger",
          cancelButton: "btn btn-primary",
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          LssITA02NotApproved(setdata)
            .then((res) => {
              Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(() => {
                // CODE.onFetchData();
                // CODE.onModal(false);
              });
              fetchData();
            })
            .catch((err) => {
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
        }
      });
  };

  const [tableData, setTableData] = useState<
    {
      id: any;
      CODE: any;
      COMPANY_CODE: any;
      COMPANY_NAME: any;
      CREATED_DATE: any;
      CREATE_USER: any;
      DEL: any;
      ENABLE: any;
      ISSUER: any;
      NOT_AFTER: any;
      NOT_BEFORE: any;
      SERIAL_NUMBER: any;
      SIGNATURE_ALGORITHM: any;
      STATUS: any;
      SUBJECT: any;
      THUMB_PRINT: any;
      UPDATED_DATE: any;
      UPDATE_USER: any;
      VERSION: any;
    }[]
  >([]);

  const [modalData, setModalData] = useState<
    {
      id: any;
      CODE: any;
      COMPANY_CODE: any;
      COMPANY_NAME: any;
      CREATED_DATE: any;
      CREATE_USER: any;
      DEL: any;
      ENABLE: any;
      ISSUER: any;
      NOT_AFTER: any;
      NOT_BEFORE: any;
      SERIAL_NUMBER: any;
      SIGNATURE_ALGORITHM: any;
      STATUS: any;
      SUBJECT: any;
      THUMB_PRINT: any;
      UPDATED_DATE: any;
      UPDATE_USER: any;
      VERSION: any;
    }[]
  >([]);

  useEffect(() => {
    fetchData();
    fnLoad();
  }, [fnLoad]);

  const [show, setShow] = useState(false);

  const fnModal = (flag: any) => {
    setShow(flag);
  };

  return (
    <div>
      <NavMenu />
      <Card style={{ marginTop: "7rem", marginBottom: "2rem" }}>
        <Card.Header>
          <Row style={{ display: "flex", flexDirection: "row" }}>
            <Col md="6">
              LSS-IT-A02 อนุมัติใบรับรองอิเล็กทรอนิกส์
            </Col>
            <Col md="6" style={{ display: "flex", flexDirection: "row" }}>
              <Col md="6">

              </Col>
              <Col md="6" style={{ display: "flex", flexDirection: "row", textAlign: "end" }}>
                <Col md="6">
                  Approve Auto
                </Col>
                <Col md="6" style={{ textAlign: "start" }}>
                <Switch checked={isCheck} onChange={onChange}  style={{ marginLeft: "1rem" }}/>
                </Col>

                
              </Col>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {/* <Col
            md={12}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              textAlign: "right",
              marginTop: 100,
            }}
          ></Col> */}
          <Col>
            <div style={{ width: "100%" }}>
              {/* <h5>
                <FaBars size={30} style={{ margin: "auto" }} />
                &nbsp;&nbsp;
              </h5> */}
              <div style={{ height: 500, width: "100%" }}>
                <div style={{ display: "flex", height: "100%" }}>
                  <div style={{ flexGrow: 1 }}>
                    <DataGrid
                      //className=""
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
              <ObjOpen
                CODE={sCode}
                ACTIONCLICK={sAction}
                onFetchData={fetchData}
                onModal={fnModal}
                showBtn={sBtn}
                showReadOnly={sReadOnly}
              />
            </Modal.Body>
          </Modal>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default LssITA02ConfigList;
