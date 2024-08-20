import { FC, Fragment, useState } from 'react'
import { Modal } from "react-bootstrap";
import Spinner from '../../fragments/Spinner';
import { getLssIT60GroupStaffList, lssGroupStaffPermissionCheck, lssGroupStaffPermissionUnCheck } from "../../../data";
import { DataGrid, GridColumns, GridRenderCellParams } from '@mui/x-data-grid';

declare type PermissionResultModel = {
    CODE?: string | null,
    NAME?: string | null,
    LEVEL?: string | null,
    PARENT_CODE?: string | null,
    SEQ?: string | null,
    GROUP_STAFF_CODE?: string | null,
    CHK?: string | null,
    ACCOUNT_TYPE_CODE?: string | null
}

const GrantMenuPermissionModal: FC<{ show?: boolean, groupStaffCode?: string | null, onClose(): void }> = ({ groupStaffCode, show, onClose }) => {
    const [isBusy, setIsBusy] = useState(true)
    const [listData, setListData] = useState([])
    const onShow = () => {
        setIsBusy(true)
        getLssIT60GroupStaffList(groupStaffCode || "")
            .then(data => {
                setListData(data)
            }).finally(() => {
                setIsBusy(false)
            })
    }

    const onCheckboxChange = (e: any, menuCode: string) => {
        const checked = e.target.checked
        if (checked) {
            lssGroupStaffPermissionCheck(groupStaffCode || "", menuCode)
                .then(() => {
                    getLssIT60GroupStaffList(groupStaffCode || "")
                        .then(data => {
                            setListData(data)
                        })
                })
        } else {
            lssGroupStaffPermissionUnCheck(groupStaffCode || "", menuCode)
                .then(() => {
                    getLssIT60GroupStaffList(groupStaffCode || "")
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
                        <input type="checkbox" checked={col?.row?.CHK === "1"} onChange={(e) => onCheckboxChange(e, col?.row?.CODE || "")} />
                    </>
                );
            },
        },
        {
            field: "CODE",
            headerName: "รหัสเมนู",
            minWidth: 200,
            headerClassName: "headgrid",
        },
        {
            field: "NAME",
            headerName: "ชื่อเมนู",
            minWidth: 600,
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
                    <Modal.Title>{"กำหนดสิทธิ์เมนู"} </Modal.Title>
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

export default GrantMenuPermissionModal