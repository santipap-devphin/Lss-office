import { useState, useEffect, useCallback } from "react";
import { Card, Col } from "react-bootstrap";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { lssITA64OnLoad, lssITA64Save } from "../../data";
import NavMenu from "../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
import "./LssITA27ConfigList.scss";

//icon control
import m_edit from "../../assets/images/m_edit.png";
import { COMPANY } from "../../models/office/COMPANY.model";
import Swal, { SweetAlertResult } from "sweetalert2";

const LssITA64List = () => {
  const [companies, setCompanies] = useState<COMPANY[]>([]);

  const updateList = (code: string, newType: string) => {
    let com = companies.find((x) => x.COMPANY_CODE === code);
    if (com) {
      setCompanies([...companies, { ...com, COMPANY_TYPE_CODE: newType }]);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "COMPANY_CODE",
      headerName: "รหัสบริษัท",
      flex: 1,
      headerClassName: "headgrid",
    },
    {
      field: "COMPANY_NAME",
      headerName: "ชื่อบริษัท",
      flex: 5,
    },
    {
      field: "COMPANY_TYPE_CODE",
      headerName: "ประเภทบริษัท",
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        if (params.value === "LIFE") return "บริษัทประกันชีวิต";

        return "บริษัทประกันวินาศภัย";
      },
    },
    // {
    //   field: "EDITABLE",
    //   headerName: "แก้ไขประเภทบริษัท",
    //   flex: 1,
    //   renderCell: (params: GridRenderCellParams<any, COMPANY, any>) => {
    //     //if (params.value === true)
    //       return (
    //         <>
    //           <img
    //             className="align-self-center"
    //             src={m_edit}
    //             alt="แก้ไขประเภทบริษัท"
    //             onClick={() => {
    //               Swal.fire({
    //                 title: "แก้ไขประเภทบริษัท",
    //                 text: "เลือกประเภทบริษัท",
    //                 showCancelButton: true,
    //                 cancelButtonText: "บริษัทประกันชีวิต",
    //                 confirmButtonText: "บริษัทประกันวินาศภัย",
    //                 customClass: {
    //                   confirmButton: "btn bg-primary",
    //                   cancelButton: "btn bg-success",
    //                 },
    //               }).then((result: SweetAlertResult<any>) => {
    //                 if (
    //                   result?.dismiss &&
    //                   result?.dismiss === Swal.DismissReason.cancel
    //                 ) {
    //                   // LIFE
    //                   lssITA64Save(params.row.COMPANY_CODE, "LIFE").then(() => {
    //                     updateList(params.row.COMPANY_CODE, "LIFE");
    //                     Swal.fire({
    //                       icon: "success",
    //                       text: "บันทึกข้อมูลเรียบร้อยแล้ว",
    //                     })
    //                   });
    //                 } else if (result.isConfirmed) {
    //                   // Non Life
    //                   lssITA64Save(params.row.COMPANY_CODE, "NONLIFE").then(() => {
    //                     updateList(params.row.COMPANY_CODE, "NONLIFE");
    //                     Swal.fire({
    //                       icon: "success",
    //                       text: "บันทึกข้อมูลเรียบร้อยแล้ว",
    //                     })
    //                   });
    //                 }
    //               });
    //             }}
    //             style={{
    //               width: "30px",
    //               height: "30px",
    //               cursor: "pointer",
    //             }}
    //           />
    //         </>
    //       );
    //   },
    // }
  ];

  const fetchData = useCallback(() => {
    lssITA64OnLoad().then((data) => {
      setCompanies(data.COMPANIES.map((el, i) => ({ ...el, id: i + 1 })));
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
          <Col style={{ marginTop: 100 }}></Col>

          <Col>
            <div style={{ width: "100%" }}>
              <h5>
                <FaBars size={30} style={{ margin: "auto" }} />
                &nbsp;&nbsp; LSS-IT-A64 กำหนดสิทธิข้อมูล
              </h5>
              <div style={{ height: 500, width: "100%" }}>
                <div style={{ display: "flex", height: "100%" }}>
                  <div style={{ flexGrow: 1 }}>
                    <DataGrid
                      className=""
                      sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                      rows={companies}
                      columns={columns}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LssITA64List;
