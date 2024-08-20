import { useState, useEffect, useCallback } from "react";
import { Card, Col, Modal, Button, Row } from "react-bootstrap";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { LssITA23ListAPI, LssITA23DeleteAPI } from "../../../data";
import NavMenu from "../../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
import Swal from "sweetalert2";
import ObjOpen from "./LssITA23ListModal";
import "../LssITA27ConfigList.scss";

//icon control
import m_edit from "../../../assets/images/m_edit.png";
import m_add from "../../../assets/images/m_add.png";
import m_delete from "../../../assets/images/m_del.png";
import m_display from "../../../assets/images/m_display.png";

const LssITA23List = () => {
  const [sAction, setSAction] = useState("");
  const [sCode, setSCode] = useState("");
  const [sTitle, setStitle] = useState("");
  const [sTitleIMG, setSTitleIMG] = useState("");
  const [sBtn, setSBtn] = useState("");
  const [sReadOnly, setSReadOnly] = useState(true);

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
    // {
    //   field: "col10",
    //   headerName: "ลบ",
    //   minWidth: 80,
    //   renderCell: (params1: any) => {
    //     return (
    //       <>
    //         <img
    //           className="align-self-center"
    //           src={m_delete}
    //           alt="ลบข้อมูล"
    //           onClick={BtnAction(params1.id, "Delete")}
    //           style={{ width: "30px", height: "30px", cursor: "pointer" }}
    //         />
    //       </>
    //     );
    //   },
    // },
    {
      field: "col11",
      headerName: "แก้ไข",
      minWidth: 80,
      align: "center", 
      headerAlign: "center",
      renderCell: (params2: any) => {
        return (
          <>
            <img
              className="align-self-center"
              src={m_edit}
              alt="แก้ไขข้อมูล"
              onClick={BtnAction(params2.id, "Edit")}
              style={{ width: "30px", height: "30px", cursor: "pointer" }}
            />
          </>
        );
      },
    },
    {
      field: "col12",
      headerName: "แสดง",
      minWidth: 80,
      align: "center", 
      headerAlign: "center",
      renderCell: (params3: any) => {
        return (
          <>
            <img
              className="align-self-center"
              src={m_display}
              alt="แสดงข้อมูล"
              onClick={BtnAction(params3.id, "Display")}
              style={{ width: "30px", height: "30px", cursor: "pointer" }}
            />
          </>
        );
      },
    },
    {
      field: "CODE",
      headerName: "รหัส",
      minWidth: 150,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "NAME",
      headerName: "ชื่อสถานะ",
      minWidth: 400,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "DESCRIPTION",
      headerName: "คำอธิบาย",
      minWidth: 700,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "POSITION",
      headerName: "ตำแหน่งที่แสดง",
      minWidth: 300,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "ENABLE",
      headerName: "สถานะ",
      minWidth: 125,
      align: "center", 
      headerAlign: "center",
      renderCell: (params2: any) => {
        let eb = "";
        if (params2.row.ENABLE === "Y") { eb = "ใช้งาน" } else { eb = `ไม่ใช้งาน` }
        return (
          <>
            <span className="fontHilight">{eb}</span>
          </>
        );
      },
    },
    // {
    //   field: "DEL",
    //   headerName: "สถานะยกเลิก",
    //   minWidth: 125,
    //   renderCell: (params2: any) => {
    //     let eb = "";
    //     if (params2.row.ENABLE === "Y") { eb = "ใช้งาน" } else { eb = `ไม่ใช้งาน` }
    //     return (
    //       <>
    //         <span className="fontHilight">{eb}</span>
    //       </>
    //     );
    //   },
    // },

  ];

  const BtnAction = useCallback(
    (id: string, sAction: string) => () => {
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
              let flagReturn = RemoveData(id);
              //console.log(flagReturn);
              swalWithBootstrapButtons.fire(
                "ดำเนินการลบ",
                "ระบบได้ดำเนินการลบเรียบร้อย.",
                "success"
              );
            } else if (
              result.dismiss === Swal.DismissReason.cancel
            ) {
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
        }
        setSCode(id);
        setSAction(sAction);
        setShow(true);
      }
    },
    []
  );

  const RemoveData = (_code: string) => {
    if (_code !== "") {
      var para = JSON.parse(`{"CODE":"${_code}"}`);
      LssITA23DeleteAPI(para).then((data: any) => {
        fetchData();
        return "succ";
      });
    }
  };

  const fetchData = () => {
    LssITA23ListAPI().then((data) => {
      let tmpSchema = [];
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: data[i].CODE,
          CODE: data[i].CODE,
          NAME: data[i].NAME,
          DESCRIPTION: data[i].DESCRIPTION,
          ENABLE: data[i].ENABLE,
          DEL: data[i].DEL,
          UPDATED_DATE: data[i].UPDATED_DATE,
          UPDATE_USER: data[i].UPDATE_USER,
          POSITION: data[i].POSITION,
        });
      }
      setTableData(tmpSchema);
    });
  };

  const [tableData, setTableData] = useState<
    {
      id: any;
      CODE: any;
      NAME: any;
      DESCRIPTION: any;
      ENABLE: any;
      DEL: any;
      UPDATED_DATE: any;
      UPDATE_USER: any;
      POSITION: any;
      
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
      <Card  style={{ marginTop: "7rem", marginBottom: "2rem" }}>
      <Card.Header>
          <Row style={{ display: "flex", flexDirection: "row" }}>
            <Col md="6" style={{ lineHeight: "45px" }}>
            LSS-IT-A23 ข้อมูล TOOLTIP
            </Col>
            <Col md="6" style={{ display: "flex", flexDirection: "row" }}>
              <Col md="6">

              </Col>
              <Col md="6" style={{ display: "flex", flexDirection: "row", textAlign: "end" }}>
                <Col md="6">

                </Col>
                <Col md="6" style={{ textAlign: "start" }}>
                  <Button
                    style={{ marginRight: 5, backgroundColor: "#FFF" }}
                    variant="contained"
                    onClick={BtnAction("", "Add")}
                  >
                    <img
                      className="align-self-center"
                      src={m_add}
                      alt="เพิ่มข้อมูล"
                      onClick={BtnAction("", "Add")}
                      style={{ width: "30px", height: "30px", cursor: "pointer" }}
                    />
                    เพิ่มข้อมูลใหม่
                  </Button>
                </Col>


              </Col>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Col>
            <div style={{ width: "100%" }}>
              <div style={{ height: 500, width: "100%" }}>
                <div style={{ display: "flex", height: "100%" }}>
                  <div style={{ flexGrow: 1 }}>
                    <DataGrid
                      className=""
                      sx={{
                        fontFamily: "kanit",
                        fontSize: 18,
                        boxShadow: 2,
                      }}
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
              />
            </Modal.Body>
          </Modal>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default LssITA23List;

