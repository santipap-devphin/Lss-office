import { useState, useEffect } from "react";
import { Card, Col, Button } from "react-bootstrap";
import { DataGrid, GridColumns, GridRenderCellParams } from "@mui/x-data-grid";
import { FaBars } from "react-icons/fa";

import "../LssITA27ConfigList.scss";
import NavMenu from "../../fragments/NavMenu";
import { LssITA63ListAPI } from "../../../data";
//icon control
import m_edit from "../../../assets/images/m_edit.png";
import m_add from "../../../assets/images/m_add.png";
import m_display from "../../../assets/images/m_display.png";
import { LSS_T_GROUP_STAFF } from "../../../models/office/LSS_T_GROUP_STAFF.model";
import EditModal, { EditModalProps } from "./EditModal";
import GrantMenuPermissionModal from "./GrantMenuPermissionModal"
import GroupMemberModal from './GroupMemberModal'
//import Swal from "sweetalert2";

const Index = () => {
  const [groupStaff, setGroupStaff] = useState<LSS_T_GROUP_STAFF[]>([]);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [mode, setMode] = useState<string>(EditModalProps.Display);

  //GrantMenuModal
  const [menuPermissionState, setMenuPermissionState] = useState<{ show?: boolean, groupStaffCode?: string | null }>({ show: false, groupStaffCode: null })
  //GroupMemberModal
  const [groupMemberState, setGroupMemberState] = useState<{ show?: boolean, groupStaffCode?: string | null }>({ show: false, groupStaffCode: null })

  const [selectedGroupStaffCode, setSelectedGroupStaffCode] =
    useState<string>("");

  const columns: GridColumns<LSS_T_GROUP_STAFF> = [
    {
      field: "CODE",
      headerName: "รหัสกลุ่มการใช้",
      minWidth: 150,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "NAME",
      headerName: "ชื่อกลุ่มการใช้",
      minWidth: 350,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "col_permission_menu",
      headerName: "กำหนดสิทธิ์เมนู",
      align: "center",
      headerAlign: "center",
      minWidth: 180,
      renderCell: (col: GridRenderCellParams<any, LSS_T_GROUP_STAFF, any>) => {
        return (
          <>
            <Button
              className="btn btn-dark btn-block"
              onClick={() => {
                //return navigate("/LSS-IT-A60", {});
                setMenuPermissionState({ ...menuPermissionState, groupStaffCode: col?.row?.CODE, show: true })
              }}
            >
              กำหนดสิทธิ์เมนู
            </Button>
          </>
        );
      },
    },
    // {
    //   field: "col_permission_data",
    //   headerName: "กำหนดสิทธิ์ข้อมูล",
    //   minWidth: 180,
    //   renderCell: (data: any) => {
    //     return (
    //       <>
    //         <Button
    //           className="btn btn-dark btn-block"
    //           onClick={() => {
    //             return navigate("/LssITA64List", {});
    //           }}
    //         >
    //           กำหนดสิทธิ์ข้อมูล
    //         </Button>
    //       </>
    //     );
    //   },
    // },
    {
      field: "col_permission_personal",
      headerName: "กำหนดสิทธิ์บุคคล",
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (col: GridRenderCellParams<any, LSS_T_GROUP_STAFF, any>) => {
        return (
          <>
            <Button
              className="btn btn-dark btn-block"
              onClick={() => {
                //return navigate("/LSS-IT-A65", {});
                setGroupMemberState({ ...groupMemberState, groupStaffCode: col?.row?.CODE, show: true })
              }}
            >
              กำหนดสิทธิ์บุคคล
            </Button>
          </>
        );
      },
    },
    {
      field: "ENABLE",
      headerName: "สถานะการใช้งาน",
      minWidth: 140,
      align: "center",
      headerAlign: "center",
      headerClassName: "headgrid",
      renderCell: (data: any) => {
        return (
          <>
            {data.row.ENABLE === "Y" ? (
              <span className="fontHilight">ใช้งาน</span>
            ) : (
              <span className="fontHilight">ไม่ใช้งาน</span>
            )}
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
      renderCell: (col: GridRenderCellParams<any, LSS_T_GROUP_STAFF, any>) => {
        return (
          <>
            <img
              className="align-self-center"
              src={m_edit}
              alt="แก้ไขข้อมูล"
              onClick={() => {
                setSelectedGroupStaffCode(() => col?.row?.CODE);
                setMode(EditModalProps.Edit);
                setShowEdit(() => true);
              }}
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
      field: "col12",
      headerName: "แสดง",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (col: GridRenderCellParams<any, LSS_T_GROUP_STAFF, any>) => {
        return (
          <>
            <img
              className="align-self-center"
              src={m_display}
              alt="แสดงข้อมูล"
              onClick={() => {
                setSelectedGroupStaffCode(() => col?.row?.CODE);
                setMode(EditModalProps.Display);
                setShowEdit(() => true);
              }}
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
  ];

  // const handleDelete = () => {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {

  //     }
  //   })
  // }

  const fetchData = () => {
    LssITA63ListAPI().then((data: LSS_T_GROUP_STAFF[]) => {
      setGroupStaff(
        data.map((g, i) => ({
          ...g,
          id: i,
        }))
      );
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
              onClick={() => {
                setMode(EditModalProps.Add);
                setShowEdit(() => true);
              }}
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
            </Button>
          </Col>
          <Col>
            <div style={{ width: "100%" }}>
              <h5>
                <FaBars size={30} style={{ margin: "auto" }} />
                &nbsp;&nbsp;LSS-IT-A63 กำหนดสิทธิกลุ่มผู้ใช้งาน
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
                      rows={groupStaff}
                      columns={columns}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Card.Body>
        <Card.Footer></Card.Footer>
      </Card>
      <EditModal
        code={selectedGroupStaffCode}
        mode={mode}
        show={showEdit}
        onClose={() => {
          setShowEdit(false);
          fetchData();
        }}
      />
      <GrantMenuPermissionModal {...menuPermissionState} onClose={() => {
        setMenuPermissionState({ ...menuPermissionState, groupStaffCode: null, show: false })
      }} />

      <GroupMemberModal {...groupMemberState} onClose={() => {
        setGroupMemberState({ ...groupMemberState, groupStaffCode: null, show: false })
      }} />
    </div>
  );
};

export default Index;
