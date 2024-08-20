import { useState, useEffect, useCallback } from "react";
import { Card, Col, Modal, Button, Row } from "react-bootstrap";
import { DataGrid, GridColDef} from "@mui/x-data-grid";
import { LSSDocTypeListAPI, LSSDocTypeDeleteAPI, GetTooltipById } from "../../../data";
import NavMenu from "../../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
import Swal from "sweetalert2";
import ObjOpen from "./LssITA21ListModal";
import LssDocTypeDetailListModal from "./LssDocTypeDetailListModal"
import "../LssITA27ConfigList.scss";

//icon control
import m_edit from "../../../assets/images/m_edit.png";
import m_add from "../../../assets/images/m_add.png";
import m_delete from "../../../assets/images/m_del.png";
import m_display from "../../../assets/images/m_display.png";

const LSSDocTypeList = () => {
  const [sAction, setSAction] = useState("");
  const [sCode, setSCode] = useState("");
  const [sTitle, setStitle] = useState("");
  const [sTitleIMG, setSTitleIMG] = useState("");
  const [sBtn, setSBtn] = useState("");
  const [sReadOnly, setSReadOnly] = useState(true);

  const [detailListModalState, setDetailListModalState] = useState<{
    docTypeCode?: string,
    show?: boolean,
    onClose?: Function,
    title?: string
  }>({})

  const TitleData = {
    Add: "เพิ่มข้อมูล",
    Edit: "แก้ไขข้อมูล",
    Display: "แสดงข้อมูล",
  };

  const openDetailListModal = (doctypeCode: string, title: string) => {
    console.log(title);
    setDetailListModalState({ ...detailListModalState, show: true, title: title, docTypeCode: doctypeCode })
  }

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
      field: "col13",
      headerName: "รายการเอกสาร",
      minWidth: 150,
      align: "center", 
      headerAlign: "center",
      renderCell: (params: any) => {
        return (
          <>
            <Button variant="link" onClick={() => {
              openDetailListModal(params.row.CODE, params.row.NAME);
            }}>จัดการเอกสาร</Button>
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
      headerName: "ประเภทเอกสาร",
      minWidth: 700,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    // {
    //   field: "DESCRIPTION",
    //   headerName: "รายละเอียด",
    //   minWidth: 500,
    //   headerClassName: "headgrid",
    // },
    {
      field: "VERSION",
      headerName: "VERSION",
      minWidth: 80,
      align: "center", 
      headerAlign: "center",
      renderCell: (params2: any) => {
        return (
          <>
            <span className="fontHilight">{params2.row.VERSION}</span>
          </>
        );
      },
    },
    {
      field: "ENABLE",
      headerName: "สถานะ",
      minWidth: 80,
      align: "center", 
      headerAlign: "center",
      renderCell: (params2: any) => {
        let eb = "ใช้งาน";
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
      field: "STATE_CODE",
      headerName: "กิจกรรม",
      minWidth: 80,
      align: "center", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },


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
      LSSDocTypeDeleteAPI(para).then((data: any) => {
        fetchData();
        return "succ";
      });
    }
  };

  const fetchData = () => {
    LSSDocTypeListAPI().then((data) => {
      let tmpSchema = [];
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: data[i].CODE,
          CODE: data[i].CODE,
          NAME: data[i].NAME,
          // DESCRIPTION: data[i].DESCRIPTION,
          ENABLE: data[i].ENABLE,
          VERSION: data[i].VERSION,
          DEL: data[i].DEL,
          STATE_CODE: data[i].STATE_CODE,
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
      // DESCRIPTION: any;
      ENABLE: any;
      VERSION: any;
      DEL: any;
      STATE_CODE: any;
    }[]
  >([]);

  useEffect(() => {
    fetchData();
    detailListModalState.onClose = () => {
      setDetailListModalState({ ...detailListModalState, show: false })
    }
  }, []);

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
            <Col md="6" style={{ lineHeight: "45px" }}>
              LSS-IT-A21 TEMPLATE_VERSION_การแนบเอกสาร
            </Col>
            <Col md="6" style={{ display: "flex", flexDirection: "row" }}>
              <Col md="6">

              </Col>
              <Col md="6" style={{ display: "flex", flexDirection: "row", textAlign: "end" }}>
                <Col md="6">

                </Col>
                <Col md="6" style={{ textAlign: "start" }}>
                  {/* <Button
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
                  </Button> */}
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
          >
            <Button
              style={{ marginRight: 5 }}
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
          </Col> */}
          <Col>
            <div style={{ width: "100%" }}>
              {/* <h5>
                <FaBars size={30} style={{ margin: "auto" }} />
                &nbsp;&nbsp;LSS-IT-A21 TEMPLATE_VERSION_การแนบเอกสาร
              </h5> */}
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
      <LssDocTypeDetailListModal {...detailListModalState} />
    </div>
  );
};

export default LSSDocTypeList;
