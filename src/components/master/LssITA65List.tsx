import { useState, useEffect, useCallback } from "react";
import { Card, Col, Modal, Button, Row, FormGroup, Form } from "react-bootstrap";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { LssITA62ListAPI, LssITA27DeleteAPI, LssITA63ListAPI, getAccountGroupStaffList, lssGroupStaffAccountCheck, lssGroupStaffAccountUnCheck } from "../../data";
import NavMenu from "../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
import Swal from "sweetalert2";
import ObjOpen from "./LssITA27ListModal";
import "./LssITA27ConfigList.scss";
import { useNavigate } from "react-router-dom";

//icon control
import m_edit from "../../assets/images/m_edit.png";
import m_add from "../../assets/images/m_add.png";
import m_delete from "../../assets/images/m_del.png";
import m_display from "../../assets/images/m_display.png";
import m_sync from "../../assets/images/sync.png";
import { LSS_T_GROUP_STAFF } from "../../models/office/LSS_T_GROUP_STAFF.model";

declare type PermissionResultModel = {
  CODE?: string | null,
  GROUP_STAFF_CODE?: string | null,
  PNAME?: string | null,
  FIRSTNAME_TH?: string | null,
  LASTNAME_TH?: string | null,
  POSITION_NAME?: string | null,
  SECTION_NAME?: string | null,
  CHK?: string | null
}

let groupStaffCode: string = ""

const LssITA65List = () => {
  let navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState("")
  const [groupStaffOptions, setGroupStaffOptions] = useState<any[]>([])
  groupStaffCode = selectedGroup;

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

  const onCheckboxChange = (e: any, accountCode: string) => {
    const checked = e.target.checked
    if (checked) {
      lssGroupStaffAccountCheck(groupStaffCode || "", accountCode)
        .then(() => {
          fetchGroupMembers(groupStaffCode)
        })
    } else {
      lssGroupStaffAccountUnCheck(groupStaffCode || "", accountCode)
        .then(() => {
          fetchGroupMembers(groupStaffCode)
        })
    }
  }

  const columns: GridColDef[] = [
    {
      field: "col12",
      headerName: "",
      minWidth: 40,
      align: "center",
      headerAlign: "center",
      renderCell: (col: GridRenderCellParams<any, PermissionResultModel, any>) => {
        return (
          <>
            <input type="checkbox" checked={col?.row?.CHK === "1"} onChange={(e) => onCheckboxChange(e, col?.row?.CODE || "")} />
          </>
        );
      },
    },
    {
      field: "CODE",
      headerName: "รหัส",
      minWidth: 350,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },

    {
      field: "COLFNAME",
      headerName: "ชื่อ",
      minWidth: 350,
      align: "left",
      headerAlign: "center",
      renderCell: (params1: any) => {
        ////console.log(params1.row.FIRSTNAME_TH);
        return <>&nbsp;&nbsp;{params1.row.FIRSTNAME_TH}</>;
      },
    },
    {
      field: "COLLNAME",
      headerName: "นามสกุล",
      minWidth: 350,
      align: "left",
      headerAlign: "center",
      renderCell: (params1: any) => {
        ////console.log(params1.row.FIRSTNAME_TH);
        return <>&nbsp;&nbsp; {params1.row.LASTNAME_TH}</>;
      },
    },
    // {
    //   field: "ENABLE",
    //   headerName: "สถานะ",
    //   minWidth: 125,
    //   renderCell: (params2: any) => {
    //     let eb = "";
    //     if (params2.row.ENABLE === "Y") {
    //       eb = "ใช้งาน";
    //     } else {
    //       eb = `ไม่ใช้งาน`;
    //     }
    //     return (
    //       <>
    //         <span className="fontHilight">{eb}</span>
    //       </>
    //     );
    //   },
    // },
  ];

  const fetchGroupMembers = (groupStaffCode: string) => {
    getAccountGroupStaffList(groupStaffCode).then(data => {
      setTableData(data.map((x: any, i: number) => ({ ...x, id: i })))
    })
  }
  const fetchData = () => {
    LssITA63ListAPI().then(data => {
      setGroupStaffOptions(data);
      fetchGroupMembers(data[0].CODE)
      setSelectedGroup(data[0].CODE)
    });
  };

  const [tableData, setTableData] = useState<
    {
      id: any;
      CODE: any;
      COMPANY_CODE: any;
      EMPLOYEE_CODE: any;
      PREFIX_CODE: any;
      FIRSTNAME_TH: any;
      LASTNAME_TH: any;
      FIRSTNAME_EN: any;
      LASTNAME_EN: any;
      COMPANY_POSITION: any;
      STATUS: any;
      ENABLE: any;
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
          <div style={{ marginTop: 100 }}>
            <h5>
              <FaBars size={30} style={{ margin: "auto" }} />
              &nbsp;&nbsp; LSS-IT-A65 กำหนดสิทธิบุคคล
            </h5>
          </div>
          <Row>
            <Col lg="4" md="8">
              <FormGroup>
                <Form.Label>กลุ่มผู้ใช้งาน :</Form.Label>
                <Form.Select
                  value={selectedGroup}
                  onChange={(e) => {
                    fetchGroupMembers(e.target.value);
                    setSelectedGroup(e.target.value);
                  }}
                >
                  {
                    groupStaffOptions.map((v, i) => <option key={i} value={v.CODE}>{v.NAME}</option>)
                  }
                </Form.Select>
              </FormGroup>
            </Col>
            <Col xs="auto">
            </Col>
          </Row>
          <Row className="mt-2">
            <Col style={{ height: "500px" }}>
              <DataGrid
                className=""
                sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                rows={tableData}
                columns={columns}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LssITA65List;
