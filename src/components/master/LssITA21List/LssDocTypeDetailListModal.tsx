import React, { FC, useEffect, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { lssDocTypeDetailSave, lssDocTypeDetailDelete, lssDocTypeDetailEdit, lssDocTypeDetailList, lssDocTypeDetailListByDocType, lssDocTypeDetailSearch, GetTooltipById } from '../../../data'

//icon control
import m_edit from "../../../assets/images/m_edit.png";
import m_add from "../../../assets/images/m_add.png";
import m_delete from "../../../assets/images/m_del.png";
import m_display from "../../../assets/images/m_display.png";
import Swal from 'sweetalert2';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import LssDocTypeDetailModal from './LssDocTypeDetailModal'
import { LSS_T_TOOLTIP } from '../../../models/office/LSS_T_TOOLTIP.model';
import { da } from 'date-fns/locale';

let _docTypeCode: string;
const LssDocTypeDetailListModal: FC<{
    docTypeCode?: string,
    show?: boolean,
    onClose?: Function,
    title?: string
}> = ({ docTypeCode, onClose, show, title }) => {

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });
    _docTypeCode = docTypeCode || ""

    const [editModalState, setEditModalState] = useState<{
        mode?: "Edit" | "View" | "Add",
        show?: boolean,
        onClose?: Function,
        onUpdateComplete?: Function,
        docTypeCode?: string,
        code?: string
    }>({});
    const [Msg_Toolt, msgTooltip] = useState("");

    const search = () => {
        lssDocTypeDetailListByDocType({ CODE: _docTypeCode || "" })
            .then(data => setItems((data || []).map((e: any, i: number) => ({ ...e, id: i }))));
            
        GetTooltipById("Msg_Toolt_A21").then((data: LSS_T_TOOLTIP) => {
             msgTooltip(data.DESCRIPTION);
        });
    }

    const removeData = (code: string): Promise<any> => {
        return lssDocTypeDetailDelete({ CODE: code })
    }

    const onRemoveClick = (code: string) => {
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
                    removeData(code).then(() => {
                        swalWithBootstrapButtons.fire(
                            "ดำเนินการลบ",
                            "ระบบได้ดำเนินการลบเรียบร้อย.",
                            "success"
                        );
                        search();
                    }) 
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                }
            });
    }

    const columns: GridColDef[]  = [
        {
            field: "col10",
            headerName: "ลบ",
            minWidth: 80,
            align: "center",
            headerAlign: "center",
            renderCell: (params: any) => {
                if (params.row.STATE_CODE === "N") {
                    return (
                        <>
                            <img
                                className="align-self-center"
                                src={m_delete}
                                alt="ลบข้อมูล"
                                onClick={() => onRemoveClick(params.row.CODE)}
                                style={{ width: "30px", height: "30px", cursor: "pointer" }}
                            />
                        </>
                    );
                }else{
                    return (
                        <>
                            <img
                                title={Msg_Toolt}
                                className="button-disabled"
                                src={m_delete}
                                alt="ลบข้อมูล"
                                style={{ width: "30px", height: "30px", cursor: "pointer" }}
                            />
                        </>
                    );
                }
            },
        },
        {
            field: "col11",
            headerName: "แก้ไข",
            minWidth: 80,
            align: "center",
            headerAlign: "center",
            renderCell: (params: any) => {
                return (
                    <>
                        <img
                            className="align-self-center"
                            src={m_edit}
                            alt="แก้ไขข้อมูล"
                            onClick={() => { setEditModalState({ ...editModalState, mode: "Edit", code: params.row.CODE, docTypeCode: docTypeCode, show: true }) }}
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
            renderCell: (params: any) => {
                return (
                    <>
                        <img
                            className="align-self-center"
                            src={m_display}
                            alt="แสดงข้อมูล"
                            onClick={() => { setEditModalState({ ...editModalState, mode: "View", code: params.row.CODE, docTypeCode: docTypeCode, show: true }) }}
                            style={{ width: "30px", height: "30px", cursor: "pointer" }}
                        />
                    </>
                );
            },
        },
        {
            field: "CODE",
            headerName: "รหัสรายการ",
            minWidth: 150,
            align: "left",
            headerAlign: "center",
            headerClassName: "headgrid",
        },
        {
            field: "NAME",
            headerName: "ชื่อรายการเอกสาร",
            minWidth: 700,
            align: "left",
            headerAlign: "center",
            headerClassName: "headgrid",
        },
        {
            field: "FILE_TYPE",
            headerName: "ประเภทไฟล์",
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            headerClassName: "headgrid",
        },
        {
            field: "REQUIRED",
            headerName: "บังคับระบุ",
            minWidth: 80,
            align: "center",
            headerAlign: "center",
            headerClassName: "headgrid",
            renderCell: (params2: any) => {
                return (
                    <>
                        <input type="checkbox" checked={params2.row.REQUIRED === "Y"} disabled />
                    </>
                );
            },
        },
        {
            field: "QUANTITY_FILE",
            headerName: "จำนวนไฟล์สูงสุด",
            minWidth: 150,
            align: "center",
            headerAlign: "center",
            headerClassName: "headgrid",
        },
        {
            field: "VERSION",
            headerName: "VERSION",
            minWidth: 80,
            align: "center",
            headerAlign: "center",
            headerClassName: "headgrid",
        },
        {
            field: "SEQ",
            headerName: "ลำดับ",
            minWidth: 80,
            align: "center",
            headerAlign: "center",
            headerClassName: "headgrid",
        },
        {
            field: "ENABLE",
            headerName: "สถานะ",
            minWidth: 80,
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
        {
            field: "STATE_CODE",
            headerName: "กิจกรรม",
            minWidth: 80,
            align: "center",
            headerAlign: "center",
        },
    ];

    const [items, setItems] = useState([])
    useEffect(() => {
        if (show) {
            search();
        }
    }, [show])

    useEffect(() => {
        editModalState.onClose = () => {
            setEditModalState({ ...editModalState, show: false });
        }

        editModalState.onUpdateComplete = () => {
            search();
        }
    }, [])

    return (
        <>
            <Modal
                size="xl"
                show={show}
                onHide={() => {
                    if (onClose) onClose();
                }}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-end">
                        <Button
                            style={{ marginRight: 5, backgroundColor: "#FFF" }}
                            variant="contained"
                            onClick={() => { setEditModalState({ ...editModalState, mode: "Add", docTypeCode: _docTypeCode, show: true }) }}
                        >
                            <img
                                className="align-self-center"
                                src={m_add}
                                alt="เพิ่มข้อมูล"
                                onClick={() => { setEditModalState({ ...editModalState, mode: "Add", docTypeCode: _docTypeCode, show: true }) }}
                                style={{ width: "30px", height: "30px", cursor: "pointer" }}
                            />
                            เพิ่มข้อมูลใหม่
                        </Button>
                    </div>
                    <Row className="mt-1">
                        <Col xs={12}>
                            <div style={{ height: 400, width: "100%" }}>
                                <div style={{ display: "flex", height: "100%" }}>
                                    <div style={{ flexGrow: 1 }}>
                                        <DataGrid
                                            className=""
                                            sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                                            rows={items}
                                            columns={columns}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
            <LssDocTypeDetailModal {...editModalState} />
        </>
    )
}

export default LssDocTypeDetailListModal
