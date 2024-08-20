import { useState, useEffect, useCallback } from "react";
import { Card, Col } from "react-bootstrap";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { getLssITA62List } from "../../data";
import NavMenu from "../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
import LssITA62ListModal, { ModeProps } from "./LssITA62ListModal";
import "./LssITA27ConfigList.scss";

//icon control
import m_edit from "../../assets/images/m_edit.png";
import m_display from "../../assets/images/m_display.png";
import { LSS_T_ACCOUNT } from "../../models/office/LSS_T_ACCOUNT.model";

const LssITA62List = () => {
  const [rows, setRows] = useState<LSS_T_ACCOUNT[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [modalMode, setModalMode] = useState<ModeProps>("DISPLAY");

  const handleEdit = (code: string) => {
    setSelectedCode(code)
    setModalMode("EDIT");
    setShowModal(true);
  };

  const handleDisplay = (code: string) => {
    setSelectedCode(code)
    setModalMode("DISPLAY");
    setShowModal(true);
  };

  const columns: GridColDef[] = [
    {
      field: "col12",
      headerName: "แสดง",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<any, LSS_T_ACCOUNT, any>) => {
        return (
          <>
            <img
              className="align-self-center"
              src={m_display}
              alt="แสดงข้อมูล"
              onClick={() => handleDisplay(params.row.CODE)}
              style={{
                width: "30px",
                height: "30px",
                cursor: "pointer",
              }}
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
      renderCell: (params: GridRenderCellParams<any, LSS_T_ACCOUNT, any>) => {
        return (
          <>
            <img
              className="align-self-center"
              src={m_edit}
              alt="แก้ไขข้อมูล"
              onClick={() => handleEdit(params.row.CODE)}
              style={{
                width: "30px",
                height: "30px",
                cursor: "pointer",
              }}
            />
          </>
        );
      },
    },
    {
      field: "CODE",
      headerName: "บัญชีผู้ใช้งาน",
      minWidth: 150,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "FIRSTNAME_TH",
      headerName: "ชื่อ (ไทย)",
      minWidth: 140,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "LASTNAME_TH",
      headerName: "นามสกุล (ไทย)",
      minWidth: 150,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "COMPANY_POSITION",
      headerName: "ตำแหน่ง",
      minWidth: 150,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "COMPANY_NAME",
      headerName: "ชื่อบริษัท/หน่วยงาน",
      minWidth: 150,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    // {
    //   field: "GROUP_CODE",
    //   headerName: "กลุ่มผู้ใช้งาน",
    //   minWidth: 150,
    //   headerClassName: "headgrid",
    // },
    {
      field: "ENABLE",
      headerName: "สถานะการใช้งาน",
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

  const fetchData = useCallback(() => {
    getLssITA62List().then((data) => {
      setRows(data);
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
            {/* <Button style={{ marginRight: 5 }} variant="contained" onClick={handleAdd}>
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
          <Col>
            <div style={{ width: "100%" }}>
              <h5>
                <FaBars size={30} style={{ margin: "auto" }} />
                &nbsp;&nbsp;LSS-IT-A62 กำหนดผู้ใช้งานของสำนักงาน คปภ.
              </h5>
              <div
                style={{
                  height: 500,
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                  }}
                >
                  <div style={{ flexGrow: 1 }}>
                    <DataGrid
                      className=""
                      sx={{
                        fontFamily: "kanit",
                        fontSize: 18,
                        boxShadow: 2,
                      }}
                      rows={rows}
                      columns={columns}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Card.Body>
      </Card>
      <LssITA62ListModal
        code={selectedCode}
        mode={modalMode}
        onClose={() => {
          setShowModal(false);
          fetchData();
        }}
        show={showModal}
      />
    </div>
  );
};

export default LssITA62List;
