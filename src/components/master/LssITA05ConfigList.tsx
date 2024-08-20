import { useState, useEffect, useCallback } from "react";
import { Card, Col, Modal, Button } from "react-bootstrap";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { LssITA05List, LssITA05Delete, UpdateGridPosition } from "../../data";
import NavMenu from "../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
import Swal from "sweetalert2";
import ObjOpen from "./LssITA05Config";
import "./LssITA05ConfigList.scss";

//icon control
import m_edit from "../../assets/images/m_edit.png";
import m_add from "../../assets/images/m_add.png";
import m_delete from "../../assets/images/m_del.png";
import m_display from "../../assets/images/m_display.png";
import up_arrow from "../../assets/images/up-arrow.png";
import dowm_arrow from "../../assets/images/dowm-arrow.png";

const LssITA22ConfigList = () => {
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
    {
      field: "col10",
      headerName: "ลบ",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params1: any) => {
        return (
          <>
            <img
              className="align-self-center"
              src={m_delete}
              alt="ลบข้อมูล"
              onClick={BtnAction(params1.id, "Delete")}
              style={{ width: "30px", height: "30px", cursor: "pointer" }}
            />
          </>
        );
      },
    },
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
      field: "",
      headerName: "",
      minWidth: 10,
      maxWidth: 30,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        return (
          <>
            <div className="d-grid">
              <div>
              <img 
                src={up_arrow}
                onClick={InsertKey(params.id, "UP")}
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              ></img>
              </div>
              <div>
              <img 
                src={dowm_arrow}
                onClick={InsertKey(params.id, "DOWN")}
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              ></img>
              </div>
            </div>
          </>
        );
      },
    },
    {
      field: "SEQ",
      headerName: "ลำดับ",
      minWidth: 50,
      maxWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "CODE",
      headerName: "รหัสประกาศ",
      minWidth: 150,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "NAME",
      headerName: "ชื่อประกาศ",
      minWidth: 250,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "DESCRIPTION",
      headerName: "ข้อความที่แสดง",
      minWidth: 450,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "ANOUNCE_GROUP_NAME",
      headerName: "กลุ่มประกาศ",
      minWidth: 250,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    // {
    //   field: "col13",
    //   headerName: "คำอธิบาย",
    //   minWidth: 350,
    //   headerClassName: "headgrid",
    // },
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

  ];

  const InsertKey = useCallback(
    (id: string, sAction: string) => () => {
      console.log()
      if(sAction == "UP"){
        UpdateGridPosition(id,sAction).then((res) =>{
          fetchData();
        });
      }else{
        UpdateGridPosition(id,sAction).then((res) => {
          fetchData();
        })
      }
    },
    []
  );

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
      LssITA05Delete(para).then((data: any) => {
        fetchData();
        return "succ";
      });
    }
  };

  const fetchData = () => {
    LssITA05List().then((data) => {
      let tmpSchema = [];
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: data[i].CODE,
          CODE: data[i].CODE,
          NAME: data[i].NAME,
          SEQ: data[i].SEQ,
          ANOUNCE_GROUP_CODE: data[i].ANOUNCE_GROUP_CODE,
          DESCRIPTION: data[i].DESCRIPTION,
          TPYE_DISPLAY: data[i].TPYE_DISPLAY,
          ENABLE: data[i].ENABLE,
          UPDATED_DATE: data[i].UPDATED_DATE,
          UPDATE_USER: data[i].UPDATE_USER,
          COMMENT: data[i].COMMENT,
          CREATED_DATE: data[i].CREATED_DATE,
          ANOUNCE_GROUP_NAME: data[i].ANOUNCE_GROUP_NAME,
          
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
      SEQ: any;
      DESCRIPTION: any;
      ANOUNCE_GROUP_CODE: any;
      TPYE_DISPLAY: any;
      ENABLE: any;
      CREATED_DATE: any;
      UPDATED_DATE: any;
      UPDATE_USER: any;
      COMMENT: any;
      ANOUNCE_GROUP_NAME: any;
      
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
          </Col>
          <Col>
            <div style={{ width: "100%" }}>
              <h5>
                <FaBars size={30} style={{ margin: "auto" }} />
                &nbsp;&nbsp;LSS-IT-A05 ข้อมูลประกาศ
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

export default LssITA22ConfigList;
