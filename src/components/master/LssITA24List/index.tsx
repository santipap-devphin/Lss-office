import { useState, useEffect, useCallback } from "react";
import { Card, Col, Button, Row } from "react-bootstrap";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { LssITA24DeleteAPI, LssITA24ListAPI, getLssITA24FileUrl } from "../../../data";
import NavMenu from "../../fragments/NavMenu";
import Swal from "sweetalert2";
import "../LssITA27ConfigList.scss";

//icon control
import m_edit from "../../../assets/images/m_edit.png";
import m_add from "../../../assets/images/m_add.png";
import m_delete from "../../../assets/images/m_del.png";
import m_display from "../../../assets/images/m_display.png";

import pencil from "../../../assets/images/pencil.png";
import canceled from "../../../assets/images/canceled.png";
import fullfiled from "../../../assets/images/fullfiled.png";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LSS_T_STATE } from "../../../models/office/LSS_T_STATE.model";
import PanelModal, { ModelProps } from "./PanelModal";

// const styles = {
//   image: {
//     width: "30px",
//     height: "30px",
//     cursor: "pointer",
//   },
// };

const LssITA24List = () => {
  const [gridData, setGridData] = useState<LSS_T_STATE[]>([]);
  const [modalMode, setModalMode] = useState<ModelProps>("DISPLAY");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCode, setSelectedCode] = useState<string>("");

  const handleDisplay = (code: string) => {
    setSelectedCode(code);
    setModalMode("DISPLAY");
    setShowModal(true);
  };

  const handleEdit = (code: string) => {
    setSelectedCode(code);
    setModalMode("EDIT");
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedCode("");
    setModalMode("ADD");
    setShowModal(true);
  };

  const handleDelete = useCallback((code: string) => {
    Swal.fire({
      text: `คุณต้องการลบ ${code}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        LssITA24DeleteAPI(code)
          .then(() => {
            Swal.fire({
              text: "ลบข้อมูลเรียบร้อยแล้ว",
              icon: "success",
            }).finally(() => {
              fetchData();
            });
          })
          .catch(() => {
            Swal.fire({
              text: "ไม่สามารถลบข้อมูลได้",
              icon: "error",
            });
          });
      }
    });
  }, []);

  const columns: GridColDef[] = [
    {
      field: "DISPLAY",
      headerName: "แสดง",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<any, LSS_T_STATE, any>) => {
        return (
          <>
            <img
              className="align-self-center"
              src={m_display}
              alt="แสดงข้อมูล"
              style={{ width: "30px", height: "30px", cursor: "pointer" }}
              onClick={() => handleDisplay(params.row.CODE)}
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
      renderCell: (params: GridRenderCellParams<any, LSS_T_STATE, any>) => {
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
    //   renderCell: (params: GridRenderCellParams<any, LSS_T_STATE, any>) => {
    //     return (
    //       <>
    //         <img
    //           className="align-self-center"
    //           src={m_delete}
    //           alt="ลบข้อมูล"
    //           onClick={() => handleDelete(params?.row?.CODE)}
    //           style={{ width: "30px", height: "30px", cursor: "pointer" }}
    //         />
    //       </>
    //     );
    //   },
    // },
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
      minWidth: 240,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "COMPANY_SHOW",
      headerName: "คำอธิบาย",
      minWidth: 500,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "ICON",
      headerName: "ICON",
      minWidth: 125,
      align: "center",
      headerAlign: "center",
      renderCell: (params2: any) => {
        return (
          <>
            <img
              className="align-self-center"
              src={getLssITA24FileUrl(params2.row.CODE)}
              alt="ICON"
              style={{ width: "30px", height: "30px" }}
            />
          </>
        );
      },
    },
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
    LssITA24ListAPI().then((data) => {
      setGridData(data);
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <NavMenu />
      <Card style={{ marginTop: "7rem", marginBottom: "2rem" }}>
        <Card.Header>
          <Row style={{ display: "flex", flexDirection: "row" }}>
            <Col md="6" style={{ lineHeight: "45px" }}>
              LSS-IT-A24 ข้อมูลสถานะการนำส่งเงินสมทบ
            </Col>
            <Col md="6" style={{ display: "flex", flexDirection: "row" }}>
              <Col md="6"></Col>
              <Col
                md="6"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  textAlign: "end",
                }}
              >
                <Col md="6"></Col>
                <Col md="6" style={{ textAlign: "start" }}>
                  {/* <Button
                    style={{ marginRight: 5, backgroundColor: "#FFF" }}
                    variant="contained"
                    onClick={handleAdd}
                  >
                    <img
                      className="align-self-center"
                      src={m_add}
                      alt="เพิ่มข้อมูล"
                      style={{
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                      }}
                    />
                    เพิ่มข้อมูลใหม่
                  </Button> */}
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
                      sx={{
                        fontFamily: "kanit",
                        fontSize: 18,
                        boxShadow: 2,
                      }}
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
      <PanelModal
        code={selectedCode}
        show={showModal}
        mode={modalMode}
        onClose={() => {
          setShowModal(false);
          fetchData();
        }}
      />
    </div>
  );
};

export default LssITA24List;
