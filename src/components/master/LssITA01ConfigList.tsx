import { useState, useEffect, useCallback } from "react";
import { Card, Col, Modal, Button, Container, Row } from "react-bootstrap";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  LssITA01List,
  //LssITA27DeleteAPI,
  LssITA01Approved,
  LssITA01NotApproved,
} from "../../data";
import NavMenu from "../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
import Swal from "sweetalert2";
import ObjOpen from "./LssITA01ListModal";
import "./LssITA27ConfigList.scss";

//icon control
import m_edit from "../../assets/images/m_edit.png";
import m_add from "../../assets/images/m_add.png";
//import m_delete from "../../assets/images/m_del.png";
import m_display from "../../assets/images/m_display.png";
import { parseISO } from "date-fns/esm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import ExportExcel from "../report/shared/ExportExcel";

const LssITA01ConfigList = () => {
  const [sAction, setSAction] = useState("");
  const [sCode, setSCode] = useState("");
  const [sTitle, setStitle] = useState("");
  const [sTitleIMG, setSTitleIMG] = useState("");
  const [sBtn, setSBtn] = useState("");
  const [sReadOnly, setSReadOnly] = useState(true);
  const [Typedata, setTypedata] = useState("");

  const TitleData = {
    Add: "เพิ่มข้อมูล",
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

  const columns: GridColDef[] = [
    {
      field: "col10",
      headerName: "ปุ่ม",
      align: "center", headerAlign: "center",
      minWidth: 80,
      renderCell: (params1: GridRenderCellParams<any, any, any>) => {
        if (params1?.row?.STATUS === "Request" || params1?.row?.STATUS === "Change" || params1?.row?.STATUS === "Signator"
          || params1?.row?.STATUS === "Approved" || params1?.row?.STATUS === "NotApproved") return <></>;

        return (
          <>
            <Button
              style={{
                marginRight: 5,
                backgroundColor: "#4AAE23",
                color: "#fff",
              }}
              variant="contained"
              onClick={() => ApprovedData(params1)}
            >
              ✔ อนุมัติ
            </Button>
          </>
        );
      },
    },
    {
      field: "col11",
      headerName: "ปุ่ม",
      align: "center", headerAlign: "center",
      minWidth: 80,
      renderCell: (params2: any) => {
        if (params2?.row?.STATUS === "Approved" || params2?.row?.STATUS === "NotApproved") return <></>;
        return (
          <>
            <Button
              style={{
                marginRight: 5,
                backgroundColor: "#ff4000",
                color: "#fff",
              }}
              variant="contained"
              onClick={() => NotApprovedData(params2)}
            >
              X ไม่อนุมัติ
            </Button>
          </>
        );
      },
    },
    {
      field: "col12",
      headerName: "ปุ่ม",
      align: "center", headerAlign: "center",
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
              onClick={BtnAction(params3.id, "Display", params3?.row?.TYPE_FILLING_NAME)}
              variant="contained"
            >
              ดูรายละเอียด
            </Button>
          </>
        );
      },
    },
    {
      field: "TYPE_FILLING_NAME",
      headerName: "ประเภทคำร้อง",
      minWidth: 240,
      align: "center",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "STATUS_NAME",
      headerName: "สถานะ",
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "headgrid",
    },

    {
      field: "CREATED_DATE",
      headerName: "วันที่ส่งเรื่อง",
      minWidth: 200,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
      renderCell: (params: GridRenderCellParams<any, any, any>) => {
        return (
          <>
            {parseISO(params.row.CREATED_DATE.toString()).toLocaleTimeString(
              "th-TH",
              {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }
            )}
          </>
        );
      },
    },
    {
      field: "LOGIN_NAME",
      headerName: "บัญชีผู้ใช้งาน",
      minWidth: 300,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "FIRSTNAME_TH",
      headerName: "ชื่อ ",
      minWidth: 170,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "LASTNAME_TH",
      headerName: "นามสกุล ",
      minWidth: 170,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },

    {
      field: "COMPANY_NAME",
      headerName: "บริษัท",
      minWidth: 400,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
  ];

  // อนุมัติ
  const ApprovedData = (data: Record<string, any>) => {
    let setdata = {
      CODE: String(data.id),
      ACCOUNT_CODE: String(data.row.ACCOUNT_CODE),
    };
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
          LssITA01Approved(setdata)
            .then((res) => {
              Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success").then(
                () => { }
              );
              fetchData();
            })
            .catch((err) => {
              if (err.status === 400) {
                Swal.fire(
                  "แจ้งเตือน",
                  "ตรวจสอบการกรอกข้อมูลอีกครั้ง",
                  "warning"
                );
              } else {
                Swal.fire("แจ้งเตือน", err.data, "warning");
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  };

  const NotApprovedData = (data: Record<string, any>) => {
    let setdata = { CODE: String(data.id), ACCOUNT_CODE: String(data.TYPE_FILLING) == "N" ? String("") : String(data.row.ACCOUNT_CODE) };

    //data.row.ACCOUNT_CODE
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
          LssITA01NotApproved(setdata)
            .then((res) => {
              swalWithBootstrapButtons.fire({
                text: "ดำเนินการเรียบร้อยแล้ว",
                icon: "success",
              });
              fetchData();
            })
            .catch((err) => {
              Swal.fire({
                text: Array.isArray(err.data) ? err.data[0] : err.data,
                icon: "error",
              });
            });
        }
      });
  };

  const BtnAction = useCallback(
    (id: string, sAction: string, sType: string) => () => {
      console.log('Mark-1');
      console.log('sType:' + sType);
      if (sAction === "Delete") {
        swalWithBootstrapButtons
          .fire({
            title: "การลบข้อมูล",
            text: "ยืนยันการลบข้อมูล",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ยืนยันการลบ!",
            cancelButtonText: "ออก!",
            reverseButtons: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
              setSCode(id);
              //let flagReturn = RemoveData(id);

              swalWithBootstrapButtons.fire(
                "ดำเนินการลบ",
                "ระบบได้ดำเนินการลบเรียบร้อย.",
                "success"
              );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
            }
          });
      } else {
        if (sAction === "Add") {
          setSBtn("block");
          setSReadOnly(false);
          setStitle(TitleData.Add);
          setSTitleIMG(m_add);
        }
        if (sAction === "Edit") {
          setSBtn("block");
          setSReadOnly(false);
          setStitle(TitleData.Edit);
          setSTitleIMG(m_edit);
        }
        if (sAction === "Display") {
          setSBtn("none");
          setSReadOnly(true);
          setStitle(TitleData.Display);
          setSTitleIMG(m_display);
          if (sType == "ยื่นใหม่") {
            setTypedata("Request");
          } else {
            setTypedata("Change");
          }

        }

        setSCode(id);
        setSAction(sAction);
        setShow(true);
      }
    },
    [swalWithBootstrapButtons, TitleData.Add, TitleData.Display, TitleData.Edit]
  );

  // const RemoveData = (_code: string) => {
  //   if (_code !== "") {
  //     var para = JSON.parse(`{"CODE":"${_code}"}`);
  //     LssITA27DeleteAPI(para).then((data: any) => {
  //       fetchData();
  //       return "succ";
  //     });
  //   }
  // };

  const fetchData = () => {
    LssITA01List().then((data: any) => {
      ////console.log(data);
      let tmpSchema = [];
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: data[i].CODE,
          CODE: data[i].CODE,
          LOGIN_NAME: data[i].LOGIN_NAME,
          FIRSTNAME_TH: data[i].FIRSTNAME_TH,
          LASTNAME_TH: data[i].LASTNAME_TH,
          ACCOUNT_CODE: data[i].ACCOUNT_CODE,
          STATUS_NAME: data[i].STATUS_NAME,
          TYPE_FILLING_NAME: data[i].TYPE_FILLING_NAME,
          ENABLE: data[i].ENABLE,
          STATUS: data[i].STATUS,
          COMPANY_NAME: data[i].COMPANY_NAME,
          CREATED_DATE: data[i].CREATED_DATE,
        });
      }
      setTableData(tmpSchema);
    });
  };

  const [tableData, setTableData] = useState<
    {
      id: any;
      CODE: any;
      LOGIN_NAME: any;
      FIRSTNAME_TH: any;
      LASTNAME_TH: any;
      ACCOUNT_CODE: any;
      STATUS_NAME: any;
      TYPE_FILLING_NAME: any;
      ENABLE: any;
      STATUS: any;
      COMPANY_NAME: any;
      CREATED_DATE: any;
    }[]
  >([]);

  useEffect(() => {
    fetchData();
  }, []);

  const [show, setShow] = useState(false);

  const fnModal = (flag: any) => {
    setShow(flag);
  };

  const RefreshToolbar = () => {
    return (
      <Container fluid>
        <Row>
          <Col
            lg={1}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              textAlign: "right",
            }}
          >
            <Button size="sm" onClick={() => fetchData()}>
              <FontAwesomeIcon icon={faRefresh} />
              &nbsp;โหลดข้อมูล
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
            <ExportExcel
              data={tableData}
              headers={header}
              fileNames={"LSS-IP-030 ประมวลผลการส่ง e-mail.xlsx"}
            // tableType={"TableCal"}
            ></ExportExcel>
          </Col>
        </Row>
      </Container>
    );
  };

  const header = [
    { header: 'ประเภทคำร้อง', key: 'TYPE_FILLING_NAME', width: 25, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },
    { header: 'สถานะ', key: 'STATUS_NAME', width: 20, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },
    { header: 'วันที่ส่งเรื่อง', key: 'CREATED_DATE', width: 20, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'บัญชีผู้ใช้งาน', key: 'LOGIN_NAME', width: 20, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'ชื่อ', key: 'FIRSTNAME_TH', width: 20, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'นามสกุล', key: 'LASTNAME_TH', width: 20, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    { header: 'บริษัท', key: 'COMPANY_NAME', width: 50, style: { alignment: { horizontal: 'left' }, numFmt: 'Text' } },
    // { header: 'ประมวลผลใหม่', key: 'col7', width: 20, style: { alignment: { horizontal: 'center' }, numFmt: 'Text' } },
  ];

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
                &nbsp;&nbsp;LSS-IT-A01 พิจารณาขอใช้ระบบของบริษัทประกันภัย
              </h5>
              <div style={{ height: 500, width: "100%" }}>
                <div style={{ display: "flex", height: "100%" }}>
                  <div style={{ flexGrow: 1 }}>
                    <DataGrid
                      className=""
                      sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                      rows={tableData}
                      columns={columns}
                      components={{
                        Toolbar: RefreshToolbar,
                      }}
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
                  alt="แก้ไขข้อมูล"
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
                ChangeOrRequest={Typedata}
              />
            </Modal.Body>
          </Modal>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default LssITA01ConfigList;
