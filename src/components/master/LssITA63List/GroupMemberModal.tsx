import { FC, Fragment, useState } from 'react'
import { Modal } from "react-bootstrap";
import Spinner from '../../fragments/Spinner';
import { getAccountGroupStaffList, lssGroupStaffAccountCheck, lssGroupStaffAccountUnCheck } from "../../../data";
import { DataGrid, GridColumns, GridRenderCellParams } from '@mui/x-data-grid';

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

const GroupMemberModal: FC<{ show?: boolean, groupStaffCode?: string | null, onClose(): void }> = ({ groupStaffCode, show, onClose }) => {
    const [isBusy, setIsBusy] = useState(true)
    const [listData, setListData] = useState([])
    const onShow = () => {
        setIsBusy(true)
        getAccountGroupStaffList(groupStaffCode || "")
            .then(data => {
                setListData(data)
            }).finally(() => {
                setIsBusy(false)
            })
    }

    const onCheckboxChange = (e: any, accountCode: string) => {
        const checked = e.target.checked
        if (checked) {
            lssGroupStaffAccountCheck(groupStaffCode || "", accountCode)
                .then(() => {
                    getAccountGroupStaffList(groupStaffCode || "")
                        .then(data => {
                            setListData(data)
                        })
                })
        } else {
            lssGroupStaffAccountUnCheck(groupStaffCode || "", accountCode)
                .then(() => {
                    getAccountGroupStaffList(groupStaffCode || "")
                        .then(data => {
                            setListData(data)
                        })
                })
        }
    }

    const columns: GridColumns<PermissionResultModel> = [
        {
            field: "col12",
            headerName: "",
            minWidth: 40,
            renderCell: (col: GridRenderCellParams<any, PermissionResultModel, any>) => {
                return (
                    <>
                        <input type="checkbox" disabled={!!col?.row?.GROUP_STAFF_CODE && col?.row?.GROUP_STAFF_CODE !== "00" && col?.row?.GROUP_STAFF_CODE !== groupStaffCode} checked={col?.row?.CHK === "1"} onChange={(e) => onCheckboxChange(e, col?.row?.CODE || "")} />
                    </>
                );
            },
        },
        {
            field: "CODE",
            headerName: "บัญชีผู้ใช้",
            minWidth: 150,
            headerClassName: "headgrid",
        },
        {
            field: "PNAME",
            headerName: "คำนำหน้า",
            minWidth: 100,
            headerClassName: "headgrid",
        },
        {
            field: "FIRSTNAME_TH",
            headerName: "ชื่อ (ไทย)",
            minWidth: 150,
            headerClassName: "headgrid",
        },
        {
            field: "LASTNAME_TH",
            headerName: "นามสกุล (ไทย)",
            minWidth: 150,
            headerClassName: "headgrid",
        },
        {
            field: "SECTION_NAME",
            headerName: "หน่วยงาน",
            minWidth: 250,
            headerClassName: "headgrid",
        },
        {
            field: "POSITION_NAME",
            headerName: "ตำแหน่ง",
            minWidth: 300,
            headerClassName: "headgrid",
        }
    ]

    return (
        <Fragment>
            <Modal
                centered
                size="xl"
                show={show}
                onShow={onShow}
                onHide={onClose}
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{"กำหนดสิทธิ์บุคคล"} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isBusy ? (<Spinner />) : (
                        <Fragment>
                            <div style={{ height: "500px", overflow: "auto" }}>
                                <DataGrid
                                    className=""
                                    getRowId={(row) => row.CODE || ""}
                                    sx={{
                                        fontFamily: "kanit",
                                        fontSize: 18,
                                        boxShadow: 2,
                                    }}
                                    rows={listData}
                                    columns={columns}
                                />
                            </div>

                        </Fragment>
                    )}
                </Modal.Body>
            </Modal>
        </Fragment>
    )
}

export default GroupMemberModal
