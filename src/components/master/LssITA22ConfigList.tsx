import { useState, useEffect } from "react";
import { Card, Col, Button } from "react-bootstrap";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { LssITA22Delete, LssITA22List } from "../../data";
import NavMenu from "../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
import "./LssITA22ConfigList.scss";

//icon control
import m_edit from "../../assets/images/m_edit.png";
import m_add from "../../assets/images/m_add.png";
import m_delete from "../../assets/images/m_del.png";
import m_display from "../../assets/images/m_display.png";
import { LSS_T_TEMPLATE_MAIL } from "../../models/office/LSS_T_TEMPLATE_MAIL.model";
import LssITA22ConfigListModal, {
  ITA22ConfigModalProps,
} from "./LssITA22ConfigListModal";
import Swal from "sweetalert2";

const LssITA22ConfigList = () => {
  const [gridData, setGridData] = useState<LSS_T_TEMPLATE_MAIL[]>([]);
  const [mode, setMode] = useState<ITA22ConfigModalProps>("DISPLAY");
  const [showModal, setShowModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string>("");

  const handleDelete = (code: string) => {
    Swal.fire({
      text: `คุณต้องการลบ '${code}' ใช่หรือไม่`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        LssITA22Delete(code)
        .then(() => {
          Swal.fire({
            icon: "success",
            text: "ลบข้อมูลเรียบร้อยแล้ว",
          }).then(() => {
            fetchData();
          });
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            text: "ไม่สามารถลบข้อมูลได้",
          });
        })
      }
    });
  };
  const handleDisplay = (code: string) => {
    setMode("DISPLAY");
    setSelectedCode(code);
    setShowModal(true);
  };
  const handleEdit = (code: string) => {
    setMode("EDIT");
    setSelectedCode(code);
    setShowModal(true);
  };
  const handleAdd = () => {
    setMode("ADD");
    setShowModal(true);
  };

  const columns: GridColDef[] = [
    {
      field: "DISPLAY",
      headerName: "แสดง",
      minWidth: 80,
      align: "center", 
      headerAlign: "center",
      renderCell: (
        params: GridRenderCellParams<any, LSS_T_TEMPLATE_MAIL, any>
      ) => {
        return (
          <>
            <img
              className="align-self-center"
              src={m_display}
              alt="แสดงข้อมูล"
              onClick={() => handleDisplay(params.row.CODE)}
              style={{ width: "30px", height: "30px", cursor: "pointer" }}
            />
          </>
        );
      },
    },
    {
      field: "EDIT",
      headerName: "แก้ไข",
      minWidth: 80,
      align: "center", 
      headerAlign: "center",
      renderCell: (
        params: GridRenderCellParams<any, LSS_T_TEMPLATE_MAIL, any>
      ) => {
        return (
          <>
            <img
              className="align-self-center"
              src={m_edit}
              alt="แก้ไขข้อมูล"
              onClick={() => handleEdit(params.row.CODE)}
              style={{ width: "30px", height: "30px", cursor: "pointer" }}
            />
          </>
        );
      },
    },
    // {
    //   field: "DELETE",
    //   headerName: "ลบ",
    //   minWidth: 80,
    //   renderCell: (
    //     params: GridRenderCellParams<any, LSS_T_TEMPLATE_MAIL, any>
    //   ) => {
    //     return (
    //       <>
    //         <img
    //           className="align-self-center"
    //           src={m_delete}
    //           alt="ลบข้อมูล"
    //           onClick={() => handleDelete(params?.row.CODE)}
    //           style={{ width: "30px", height: "30px", cursor: "pointer" }}
    //         />
    //       </>
    //     );
    //   },
    // },
    {
      field: "CODE",
      headerName: "รหัส",
      minWidth: 250,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "SUBJECT",
      headerName: "รายละเอียด",
      minWidth: 1000,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    // {
    //   field: "BODY",
    //   headerName: "ข้อความ",
    //   minWidth: 800,
    //   headerClassName: "headgrid",
    // },
    {
      field: "ENABLE",
      headerName: "สถานะ",
      minWidth: 125,
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

  const fetchData = () => {
    LssITA22List(null).then((data) => {
      setGridData(data);
    });
  };

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
              onClick={() => handleAdd()}
            >
              <img
                className="align-self-center"
                src={m_add}
                alt="เพิ่มข้อมูล"
                style={{ width: "30px", height: "30px", cursor: "pointer" }}
              />
              เพิ่มข้อมูลใหม่
            </Button>
          </Col>
          <Col>
            <div style={{ width: "100%" }}>
              <h5>
                <FaBars size={30} style={{ margin: "auto" }} />
                &nbsp;&nbsp;LSS-IT-A22 TEMPLATE E-MAIL
              </h5>
              <div style={{ height: 500, width: "100%" }}>
                <div style={{ display: "flex", height: "100%" }}>
                  <div style={{ flexGrow: 1 }}>
                    <DataGrid
                      className=""
                      sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                      rows={gridData}
                      columns={columns}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Card.Body>
      </Card>
      <LssITA22ConfigListModal
        code={selectedCode}
        mode={mode}
        show={showModal}
        onClose={() => {
          fetchData();
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default LssITA22ConfigList;
