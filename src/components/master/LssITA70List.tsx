import { useState, useEffect, useCallback } from "react";
import { Card, Col, Modal, Button } from "react-bootstrap";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { LssITA70Search, LssITA70Delete } from "../../data";
import NavMenu from "../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
import Swal from "sweetalert2";
import LssITA70ListModal from "./LssITA70ListModal";
import "./LssITA27ConfigList.scss";

//icon control
import m_edit from "../../assets/images/m_edit.png";
import m_add from "../../assets/images/m_add.png";
import m_delete from "../../assets/images/m_del.png";
import m_display from "../../assets/images/m_display.png";
import { LSS_T_DYNAMIC_REPORT } from "../../models/office/LSS_T_DYNAMIC_REPORT.model";

const LssITA70List = () => {
  const [modalState, setModalState] = useState<{ isOpen: boolean, mode: "EDIT" | "VIEW" | "NEW", rdID: number }>({ isOpen: false, mode: "NEW", rdID: 0 })

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

  const removeItem = (id: number) => {
    swalWithBootstrapButtons
      .fire({
        title: "การลบข้อมูล",
        text: "ยืนยันการลบข้อมูล",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ยืนยันการลบ!",
        cancelButtonText: "ออก!",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          LssITA70Delete(id).then(() => {
            fetchData();
            swalWithBootstrapButtons.fire(
              "ดำเนินการลบ",
              "ระบบได้ดำเนินการลบเรียบร้อย.",
              "success"
            );
          })
        }
      })
  }

  const openView = (id: number) => {
    setModalState({ ...modalState, isOpen: true, mode: "VIEW", rdID: id })
  }

  const openEdit = (id: number) => {
    setModalState({ ...modalState, isOpen: true, mode: "EDIT", rdID: id })
  }

  const openNew = () => {
    setModalState({ ...modalState, isOpen: true, mode: "NEW" })
  }

  const onModalClose = () => {
    fetchData();
    setModalState({ ...modalState, isOpen: false })
  }


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
              onClick={() => removeItem(params1.id)}
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
              onClick={() => openEdit(params2.id)}
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
              onClick={() => openView(params3.id)}
              style={{ width: "30px", height: "30px", cursor: "pointer" }}
            />
          </>
        );
      },
    },
    {
      field: "REPORT_NAME",
      headerName: "ชื่อรายงาน",
      minWidth: 400,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "QUERY",
      headerName: "Query",
      minWidth: 840,
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
  ];

  const fetchData = () => {
    LssITA70Search({}).then((data) => {
      setTableData(data);
    });
  };

  const [tableData, setTableData] = useState<LSS_T_DYNAMIC_REPORT[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

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
              onClick={() => openNew()}
            >
              <img
                className="align-self-center"
                src={m_add}
                alt="เพิ่มข้อมูล"
                onClick={() => openNew()}
                style={{ width: "30px", height: "30px", cursor: "pointer" }}
              />
              เพิ่มข้อมูลใหม่
            </Button>
          </Col>
          <Col>
            <div style={{ width: "100%" }}>
              <h5>
                <FaBars size={30} style={{ margin: "auto" }} />
                &nbsp;&nbsp; LSS-IT-A70 EXPORT ข้อมูลตามที่ สำนักงาน คปภ. กำหนด
              </h5>
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
                      getRowId={(row) => row.ID || 0}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Card.Body>
      </Card>
      <LssITA70ListModal {...modalState} onClose={() => onModalClose()} />
    </div>
  );
};

export default LssITA70List;

