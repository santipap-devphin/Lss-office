import { useState, useEffect, useCallback } from "react";
import { Card, Col, Modal, Button } from "react-bootstrap";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { LssITA60ListAPI, LssITA60DeleteAPI } from "../../../data";
import NavMenu from "../../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
import Swal from "sweetalert2";
import ObjOpen from "./LssITA60ListModal";
import "../LssITA27ConfigList.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCirclePlus,
    faCogs,
    faEye,
    faEdit,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

//icon control
import m_edit from "../../../assets/images/m_edit.png";
import m_add from "../../../assets/images/m_add.png";
import m_delete from "../../../assets/images/m_del.png";
import m_display from "../../../assets/images/m_display.png";

const LssITA60List = () => {
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
        //     field: "col10",
        //     headerName: "ลบ",
        //     minWidth: 80,
        //     renderCell: (params1: any) => {
        //         return (
        //             <>
        //                 <img
        //                     className="align-self-center"
        //                     src={m_delete}
        //                     alt="ลบข้อมูล"
        //                     onClick={BtnAction(params1.id, "Delete")}
        //                     style={{
        //                         width: "30px",
        //                         height: "30px",
        //                         cursor: "pointer",
        //                     }}
        //                 />
        //             </>
        //             // <Button
        //             //     variant="danger"
        //             //     onClick={BtnAction(params1.id, "Delete")}
        //             // >
        //             //     <FontAwesomeIcon
        //             //         icon={faTrash}
        //             //         size="lg"
        //             //         style={{ paddingRight: 2 }}
        //             //     />{" "}
        //             //     ลบ
        //             // </Button>
        //         );
        //     },
        // },
        {
            field: "col12",
            headerName: "แสดง",
            minWidth: 100,
            align: "center",
            headerAlign: "center",
            renderCell: (params1: any) => {
                return (
                    <>
                        <img
                            className="align-self-center"
                            src={m_display}
                            alt="แสดงข้อมูล"
                            onClick={BtnAction(params1.id, "Display")}
                            style={{
                                width: "30px",
                                height: "30px",
                                cursor: "pointer",
                            }}
                        />
                    </>
                    // <Button
                    //     variant="info"
                    //     onClick={BtnAction(params1.id, "Display")}
                    // >
                    //     <FontAwesomeIcon
                    //         icon={faEye}
                    //         size="lg"
                    //         style={{ paddingRight: 2 }}
                    //     />{" "}
                    //     ดูรายละเอียด
                    // </Button>
                );
            },
        },
        {
            field: "col11",
            headerName: "แก้ไข",
            minWidth: 80,
            align: "center",
            headerAlign: "center",
            renderCell: (params1: any) => {
                return (
                    <>
                        <img
                            className="align-self-center"
                            src={m_edit}
                            alt="แก้ไขข้อมูล"
                            onClick={BtnAction(params1.id, "Edit")}
                            style={{
                                width: "30px",
                                height: "30px",
                                cursor: "pointer",
                            }}
                        />
                    </>
                    // <Button
                    //     variant="warning"
                    //     onClick={BtnAction(params1.id, "Edit")}
                    // >
                    //     <FontAwesomeIcon
                    //         icon={faEdit}
                    //         size="lg"
                    //         style={{ paddingRight: 2 }}
                    //     />{" "}
                    //     แก้ไข
                    // </Button>
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
            headerName: "รายละเอียด",
            minWidth: 300,
            align: "left",
            headerAlign: "center",
            headerClassName: "headgrid",
        },
        {
            field: "ADD",
            headerName: "เพิ่ม",
            minWidth: 80,
            align: "right",
            headerAlign: "center",
            headerClassName: "headgrid",
            renderCell: (params1: any) => {
                return (
                    <FormControlLabel
                        disabled
                        control={<Checkbox checked={params1.row.ADD === "Y"} />}
                        label=""
                    />
                );
            },
        },
        {
            field: "EDIT",
            headerName: "แก้ไข",
            minWidth: 80,
            align: "right",
            headerAlign: "center",
            headerClassName: "headgrid",
            renderCell: (params1: any) => {
                return (
                    <FormControlLabel
                        disabled
                        control={<Checkbox checked={params1.row.EDIT === "Y"} />}
                        label=""
                    />
                );
            },
        },
        {
            field: "DELETE",
            headerName: "ลบ",
            minWidth: 80,
            align: "right",
            headerAlign: "center",
            headerClassName: "headgrid",
            renderCell: (params1: any) => {
                return (
                    <FormControlLabel
                        disabled
                        control={<Checkbox checked={params1.row.DELETE === "Y"} />}
                        label=""
                    />
                );
            },
        },
        {
            field: "SEARCH",
            headerName: "ค้นหา",
            minWidth: 80,
            align: "right",
            headerAlign: "center",
            headerClassName: "headgrid",
            renderCell: (params1: any) => {
                return (
                    <FormControlLabel
                        disabled
                        control={<Checkbox checked={params1.row.SEARCH === "Y"} />}
                        label=""
                    />
                );
            },
        },
        {
            field: "VIEW",
            headerName: "ดู",
            minWidth: 80,
            align: "right",
            headerAlign: "center",
            headerClassName: "headgrid",
            renderCell: (params1: any) => {
                return (
                    <FormControlLabel
                        disabled
                        control={<Checkbox checked={params1.row.VIEW === "Y"} />}
                        label=""
                    />
                );
            },
        },
        {
            field: "ENABLE",
            headerName: "สถานะ",
            minWidth: 100,
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
        // {
        //     field: "DEL",
        //     headerName: "สถานะยกเลิก",
        //     minWidth: 125,
        //     renderCell: (params2: any) => {
        //         let eb = "";
        //         if (params2.row.DEL === "Y") {
        //             eb = "ใช้งาน";
        //         } else {
        //             eb = `ไม่ใช้งาน`;
        //         }
        //         return (
        //             <>
        //                 <span className="fontHilight">{eb}</span>
        //             </>
        //         );
        //     },
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
            LssITA60DeleteAPI(para).then((data: any) => {
                fetchData();
                return "succ";
            });
        }
    };

    const fetchData = () => {
        LssITA60ListAPI().then((data) => {
            let tmpSchema = [];
            for (let i = 0; i < data.length; i++) {
                tmpSchema.push({
                    id: data[i].CODE,
                    CODE: data[i].CODE,
                    NAME: data[i].NAME,
                    DESCRIPTION: data[i].DESCRIPTION,
                    LEVEL: data[i].LEVEL,
                    SEQ: data[i].SEQ,
                    PARENT_CODE: data[i].PARENT_CODE,
                    DISPLAY: data[i].DISPLAY,
                    URL_ACTION: data[i].URL_ACTION,
                    URL_TYPE: data[i].URL_TYPE,
                    URL_TARGET: data[i].URL_TARGET,
                    WIDTH: data[i].WIDTH,
                    CONDITION1: data[i].CONDITION1,
                    ACCOUNT_TYPE_CODE: data[i].ACCOUNT_TYPE_CODE,
                    ADMIN_FLAG: data[i].ADMIN_FLAG,
                    COMPANY_TYPE_CODE: data[i].COMPANY_TYPE_CODE,
                    ENABLE: data[i].ENABLE,
                    DEL: data[i].DEL,
                    ADD: data[i].ADD,
                    EDIT: data[i].EDIT,
                    SEARCH: data[i].SEARCH,
                    VIEW: data[i].VIEW,
                    DELETE: data[i].DELETE,
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
            LEVEL: any;
            SEQ: any;
            PARENT_CODE: any;
            DISPLAY: any;
            URL_ACTION: any;
            URL_TYPE: any;
            URL_TARGET: any;
            WIDTH: any;
            CONDITION1: any;
            ACCOUNT_TYPE_CODE: any;
            ADMIN_FLAG: any;
            COMPANY_TYPE_CODE: any;
            ENABLE: any;
            DEL: any;
            ADD: any;
            EDIT: any;
            SEARCH: any;
            VIEW: any;
            DELETE: any;
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
            <h5 style={{ marginTop: "6.8rem" }}>
          <FaBars size={30} style={{ margin: "auto" }} />
          &nbsp;&nbsp;LSS-IT-A60 กำหนดเมนูระบบ
        </h5>
            <Card className="card">
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
                            variant="primary"
                            onClick={BtnAction("", "Add")}
                        >
                            <FontAwesomeIcon
                                icon={faCirclePlus}
                                size="lg"
                                style={{ paddingRight: 2 }}
                            />{" "}
                            เพิ่มข้อมูลใหม่
                        </Button>
                    </Col> */}
                    <Col md={12}>
                        <div style={{ width: "100%" }}>
                            {/* <h5 style={{ paddingLeft: 20, paddingBottom: 4 }}>
                                <FontAwesomeIcon
                                    icon={faCogs}
                                    size="lg"
                                    style={{ paddingRight: 2 }}
                                />
                                &nbsp;&nbsp;LSS-IT-A60 กำหนดเมนูระบบ
                            </h5> */}
                            <div style={{ height: 500, width: "100%" }}>
                                <div
                                    style={{ display: "flex", height: "100%" }}
                                >
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

export default LssITA60List;
