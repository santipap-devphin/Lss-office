import { useState, useEffect, useCallback, ChangeEvent, Fragment } from "react";
import { Card, Col, Modal, Button, Row, Tab, Tabs } from "react-bootstrap";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import {
  LssITA62ListAPI,
  LssITA27DeleteAPI,
  LSSITA80PersonalSyncList,
  LSSITA80PersonalList,
  LSSITA80PositionSyncList,
  LSSITA80PositionList,
  LSSITA80PrefixSyncList,
  LSSITA80PrefixList,
  LSSITA80SectionSyncList,
  LSSITA80SectionList,
  LSSITA80SyncPersonalSave,
  LSSITA80SyncPositionSave,
  LSSITA80SyncPrefixSave,
  LSSITA80SyncSectionSave,
  getLssITA62List
} from "../../data";
import NavMenu from "../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
import Swal from "sweetalert2";
import ObjOpen from "./LssITA27ListModal";
import "./LssITA27ConfigList.scss";

//icon control
import m_edit from "../../assets/images/m_edit.png";
import m_add from "../../assets/images/m_add.png";
import m_delete from "../../assets/images/m_del.png";
import m_display from "../../assets/images/m_display.png";
import m_sync from "../../assets/images/sync.png";
import { Sync } from "@mui/icons-material";

const SyncPersonalTab = () => {
  const [insertItems, setInsertItems] = useState<string[]>([]);
  const [updatePrefixItems, setUpdatePrefixItems] = useState<string[]>([]);
  const [updateTFNameItems, setUpdateTFNameItems] = useState<string[]>([]);
  const [updateTLNameItems, setUpdateTLNameItems] = useState<string[]>([]);
  const [updateEFNameItems, setUpdateEFNameItems] = useState<string[]>([]);
  const [updateELNameItems, setUpdateELNameItems] = useState<string[]>([]);
  const [updatePositionItems, setUpdatePositionItems] = useState<string[]>([]);
  const [updateSectionItems, setUpdateSectionItems] = useState<string[]>([]);
  const [itemSyncList, setItemSyncList] = useState<any[]>([]);
  const [itemList, setItemList] = useState<any[]>([]);

  const loadData = () => {
    LSSITA80PersonalSyncList()
      .then(data => setItemSyncList(data));
    LSSITA80PersonalList()
      .then(data => setItemList(data));
  }

  const saveData = () => {
    LSSITA80SyncPersonalSave({
      INSERT_ITEMS: insertItems,
      UPDATE_PREFIX_CODE_ITEMS: updatePrefixItems,
      UPDATE_TFNAME_ITEMS: updateTFNameItems,
      UPDATE_TLNAME_ITEMS: updateTLNameItems,
      UPDATE_EFNAME_ITEMS: updateEFNameItems,
      UPDATE_ELNAME_ITEMS: updateELNameItems,
      UPDATE_POSITION_CODE_ITEMS: updatePositionItems,
      UPDATE_SECTION_CODE_ITEMS: updateSectionItems,
    }).then(() => {
      setInsertItems([]);
      setUpdatePrefixItems([]);
      setUpdateTFNameItems([]);
      setUpdateTLNameItems([]);
      setUpdateEFNameItems([]);
      setUpdateELNameItems([]);
      setUpdatePositionItems([]);
      setUpdateSectionItems([]);
      loadData()
    }).catch(() => alert("บันทึกข้อมูลไม่สำเร็จ"));
  }

  const columns: GridColDef[] = [
    {
      field: "col12",
      headerName: "เลือก Sync",
      minWidth: 60,
      width: 60,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params3: any) => {
        return (
          <>
            {
              params3.row.FLAG_ALL === "I" && <input type="checkbox" checked={insertItems.includes(params3.row.A_EMP_CODE)} onChange={(e: ChangeEvent) => {
                const el = e.target as HTMLInputElement
                if (el.checked) {
                  setInsertItems([...insertItems, params3.row.A_EMP_CODE]);
                } else {
                  setInsertItems([...insertItems.filter(x => x !== params3.row.A_EMP_CODE)]);
                }
              }} />
            }
          </>
        );
      },
      renderHeader: () => (<Fragment>
        <input type="checkbox" onChange={(e: ChangeEvent) => {
          const el = e.target as HTMLInputElement
          if (el.checked) {
            setInsertItems([...itemSyncList.filter(x => x.FLAG_ALL === "I").map(x => x.A_EMP_CODE)]);
          } else {
            setInsertItems([]);
          }
        }} />
      </Fragment>)
    },
    {
      field: "A_EMP_CODE",
      headerName: "รหัส",
      minWidth: 150,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "H_PREFIX_NAME",
      headerName: "คำนำหน้าชื่อ",
      minWidth: 80,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
      renderCell: (params: any) => {
        return (
          <div className="d-flex flex-nowrap">
            <div style={{ width: "25px", paddingLeft: "5px" }} className="col-auto">
              {params.row.FLAG_PREFIX_CODE === "U" && <input type="checkbox" checked={updatePrefixItems.includes(params.row.A_EMP_CODE)} onChange={(e: ChangeEvent) => {
                const el = e.target as HTMLInputElement
                if (el.checked) {
                  setUpdatePrefixItems([...updatePrefixItems, params.row.A_EMP_CODE]);
                } else {
                  setUpdatePrefixItems([...updatePrefixItems.filter(x => x !== params.row.A_EMP_CODE)]);
                }
              }} />}
            </div>
            <div className={`col ${params.row.FLAG_PREFIX_CODE === "U" ? "text-danger" : ""}`}>
              {params.row.H_PREFIX_NAME}
            </div>

          </div>
        );
      },
    },


    {
      field: "A_TFNAME",
      headerName: "ชื่อ",
      minWidth: 250,
      align: "left",
      headerAlign: "center",
      renderCell: (params: any) => {
        return (
          <div className="d-flex flex-nowrap">
            <div style={{ width: "25px", paddingLeft: "5px" }} className="col-auto">
              {params.row.FLAG_A_TFNAME === "U" && <input type="checkbox" checked={updateTFNameItems.includes(params.row.A_EMP_CODE)} onChange={(e: ChangeEvent) => {
                const el = e.target as HTMLInputElement
                if (el.checked) {
                  setUpdateTFNameItems([...updateTFNameItems, params.row.A_EMP_CODE]);
                } else {
                  setUpdateTFNameItems([...updateTFNameItems.filter(x => x !== params.row.A_EMP_CODE)]);
                }
              }} />}
            </div>
            <div className={`col ${params.row.FLAG_A_TFNAME === "U" ? "text-danger" : ""}`}>
              {params.row.A_TFNAME}
            </div>

          </div>
        );
      },
    },
    {
      field: "A_TLNAME",
      headerName: "นามสกุล",
      minWidth: 250,
      align: "left",
      headerAlign: "center",
      renderCell: (params: any) => {
        return (
          <div className="d-flex flex-nowrap">
            <div style={{ width: "25px", paddingLeft: "5px" }} className="col-auto">
              {params.row.FLAG_A_TL_NAME === "U" && <input type="checkbox" checked={updateTLNameItems.includes(params.row.A_EMP_CODE)} onChange={(e: ChangeEvent) => {
                const el = e.target as HTMLInputElement
                if (el.checked) {
                  setUpdateTLNameItems([...updateTLNameItems, params.row.A_EMP_CODE]);
                } else {
                  setUpdateTLNameItems([...updateTLNameItems.filter(x => x !== params.row.A_EMP_CODE)]);
                }
              }} />}
            </div>
            <div className={`col ${params.row.FLAG_A_TL_NAME === "U" ? "text-danger" : ""}`}>
              {params.row.A_TLNAME}
            </div>

          </div>
        );
      },
    },
    {
      field: "F_TTL_TNAME",
      headerName: "ตำแหน่ง",
      minWidth: 280,
      align: "left",
      headerAlign: "center",
      renderCell: (params: any) => {
        return (
          <div className="d-flex flex-nowrap">
            <div style={{ width: "25px", paddingLeft: "5px" }} className="col-auto">
              {params.row.FLAG_A_TTL_CODE === "U" && <input type="checkbox" checked={updatePositionItems.includes(params.row.A_EMP_CODE)} onChange={(e: ChangeEvent) => {
                const el = e.target as HTMLInputElement
                if (el.checked) {
                  setUpdatePositionItems([...updatePositionItems, params.row.A_EMP_CODE]);
                } else {
                  setUpdatePositionItems([...updatePositionItems.filter(x => x !== params.row.A_EMP_CODE)]);
                }
              }} />}
            </div>
            <div className={`col ${params.row.FLAG_A_TTL_CODE === "U" ? "text-danger" : ""}`}>
              {params.row.F_TTL_TNAME}
            </div>

          </div>
        );
      },
    },
    {
      field: "BC_DEPT_NAME",
      headerName: "หน่วยงาน",
      minWidth: 280,
      align: "left",
      headerAlign: "center",
      renderCell: (params: any) => {
        return (
          <div className="d-flex flex-nowrap">
            <div style={{ width: "25px", paddingLeft: "5px" }} className="col-auto">
              {params.row.FLAG_A_SECTION_CODE === "U" && <input type="checkbox" checked={updateSectionItems.includes(params.row.A_EMP_CODE)} onChange={(e: ChangeEvent) => {
                const el = e.target as HTMLInputElement
                if (el.checked) {
                  setUpdateSectionItems([...updateSectionItems, params.row.A_EMP_CODE]);
                } else {
                  setUpdateSectionItems([...updateSectionItems.filter(x => x !== params.row.A_EMP_CODE)]);
                }
              }} />}
            </div>
            <div className={`col ${params.row.FLAG_A_SECTION_CODE === "U" ? "text-danger" : ""}`}>
              {params.row.BC_DEPT_NAME}
            </div>

          </div>
        );
      },
    },
  ];

  const columns2: GridColDef[] = [
    {
      field: "CODE",
      headerName: "รหัส",
      minWidth: 220,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "PNAME",
      headerName: "คำนำหน้าชื่อ",
      minWidth: 100,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "FIRSTNAME_TH",
      headerName: "ชื่อ",
      minWidth: 250,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "LASTNAME_TH",
      headerName: "นามสกุล",
      minWidth: 250,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "POSITION_NAME",
      headerName: "ตำแหน่ง",
      minWidth: 280,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "SECTION_NAME",
      headerName: "หน่วยงาน",
      minWidth: 280,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "ENABLE",
      headerName: "สถานะ",
      minWidth: 280,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        return (
          <div className="d-flex flex-nowrap">
            {params.row.ENABLE === "Y" ? "ใช้งาน" : "ไม่ใช้งาน"}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div>
      <Row>
        <Col xs={12}>
          <div style={{ height: 400, width: "100%" }}>
            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  className=""
                  sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                  rows={itemSyncList}
                  columns={columns}
                  getRowId={(row) => row.A_EMP_CODE || ""}
                  getCellClassName={(p) => p.row.FLAG_ALL === "I" ? "text-danger" : ""}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <div className="mt-4">
        <Button
          style={{ marginRight: 5 }}
          variant="primary"
          onClick={saveData}
          className="d-flex align-items-center"
        >
          <Sync />
          &nbsp;Sync บุคลากร
        </Button>
      </div>
      <Row>
        <Col xs={12}>
          <div className="mt-4">
            <h6>
              <b>ข้อมูลบุคลาการ (ล่าสุด)</b>
            </h6>
          </div>
          <div style={{ height: 400, width: "100%", marginTop: ".5rem" }}>
            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  className=""
                  sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                  rows={itemList}
                  columns={columns2}
                  getRowId={(row) => row.CODE || ""}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
const SyncPositionTab = () => {
  const [insertItems, setInsertItems] = useState<string[]>([]);
  const [updateNameItems, setUpdateNameItems] = useState<string[]>([]);
  const [itemSyncList, setItemSyncList] = useState<any[]>([]);
  const [itemList, setItemList] = useState<any[]>([]);

  const loadData = () => {
    LSSITA80PositionSyncList()
      .then(data => setItemSyncList(data));
    LSSITA80PositionList()
      .then(data => setItemList(data));
  }

  const saveData = () => {
    LSSITA80SyncPositionSave({
      INSERT_ITEMS: insertItems,
      UPDATE_NAME_ITEMS: updateNameItems
    }).then(() => {
      setInsertItems([]);
      setUpdateNameItems([]);
      loadData()
    }).catch(() => alert("บันทึกข้อมูลไม่สำเร็จ"));
  }

  const columns: GridColDef[] = [
    {
      field: "col12",
      headerName: "เลือก Sync",
      minWidth: 60,
      width: 60,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params3: any) => {
        return (
          <>
            {
              params3.row.FLAG_ALL === "I" && <input type="checkbox" checked={insertItems.includes(params3.row.A_EMP_CODE)} onChange={(e: ChangeEvent) => {
                const el = e.target as HTMLInputElement
                if (el.checked) {
                  setInsertItems([...insertItems, params3.row.A_EMP_CODE]);
                } else {
                  setInsertItems([...insertItems.filter(x => x !== params3.row.A_EMP_CODE)]);
                }
              }} />
            }
          </>
        );
      },
      renderHeader: () => (<Fragment>
        <input type="checkbox" onChange={(e: ChangeEvent) => {
          const el = e.target as HTMLInputElement
          if (el.checked) {
            setInsertItems([...itemSyncList.filter(x => x.FLAG_ALL === "I").map(x => x.TTL_CODE)]);
          } else {
            setInsertItems([]);
          }
        }} />
      </Fragment>)
    },
    {
      field: "TTL_CODE",
      headerName: "รหัส",
      minWidth: 100,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "TTL_TNAME",
      headerName: "ตำแหน่ง",
      minWidth: 400,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
      renderCell: (params: any) => {
        return (
          <div className="d-flex flex-nowrap">
            <div style={{ width: "25px", paddingLeft: "5px" }} className="col-auto">
              {params.row.FLAG_NAME === "U" && <input type="checkbox" checked={updateNameItems.includes(params.row.TTL_CODE)} onChange={(e: ChangeEvent) => {
                const el = e.target as HTMLInputElement
                if (el.checked) {
                  setUpdateNameItems([...updateNameItems, params.row.TTL_CODE]);
                } else {
                  setUpdateNameItems([...updateNameItems.filter(x => x !== params.row.TTL_CODE)]);
                }
              }} />}
            </div>
            <div className={`col ${params.row.FLAG_NAME === "U" ? "text-danger" : ""}`}>
              {params.row.TTL_TNAME}
            </div>
          </div>
        );
      },
    },
  ];

  const columns2: GridColDef[] = [
    {
      field: "CODE",
      headerName: "รหัส",
      minWidth: 100,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "NAME_TH",
      headerName: "ตำแหน่ง",
      minWidth: 400,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
  ];

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div>
      <Row>
        <Col xs={12}>
          <div style={{ height: 400, width: "100%" }}>
            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  className=""
                  sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                  rows={itemSyncList}
                  columns={columns}
                  getRowId={(row) => row.TTL_CODE || ""}
                  getCellClassName={(p) => p.row.FLAG_ALL === "I" ? "text-danger" : ""}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <div className="mt-4">
        <Button
          style={{ marginRight: 5 }}
          variant="primary"
          onClick={saveData}
          className="d-flex align-items-center"
        >
          <Sync />
          &nbsp;Sync ตำแหน่ง
        </Button>
      </div>
      <Row>
        <Col xs={12}>
          <div className="mt-4">
            <h6>
              <b>ข้อมูลตำแหน่ง (ล่าสุด)</b>
            </h6>
          </div>
          <div style={{ height: 400, width: "100%", marginTop: ".5rem" }}>
            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  className=""
                  sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                  rows={itemList}
                  columns={columns2}
                  getRowId={(row) => row.CODE || ""}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
const SyncPrefixTab = () => {
  const [insertItems, setInsertItems] = useState<string[]>([]);
  const [updateNameItems, setUpdateNameItems] = useState<string[]>([]);
  const [itemSyncList, setItemSyncList] = useState<any[]>([]);
  const [itemList, setItemList] = useState<any[]>([]);

  const loadData = () => {
    LSSITA80PrefixSyncList()
      .then(data => setItemSyncList(data));
    LSSITA80PrefixList()
      .then(data => setItemList(data));
  }

  const saveData = () => {
    LSSITA80SyncPrefixSave({
      INSERT_ITEMS: insertItems,
      UPDATE_NAME_ITEMS: updateNameItems
    }).then(() => {
      setInsertItems([]);
      setUpdateNameItems([]);
      loadData()
    }).catch(() => alert("บันทึกข้อมูลไม่สำเร็จ"));
  }

  const columns: GridColDef[] = [
    {
      field: "col12",
      headerName: "เลือก Sync",
      minWidth: 60,
      width: 60,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params3: any) => {
        return (
          <>
            {
              params3.row.FLAG_ALL === "I" && <input type="checkbox" checked={insertItems.includes(params3.row.PREFIX_CODE)} onChange={(e: ChangeEvent) => {
                const el = e.target as HTMLInputElement
                if (el.checked) {
                  setInsertItems([...insertItems, params3.row.PREFIX_CODE]);
                } else {
                  setInsertItems([...insertItems.filter(x => x !== params3.row.PREFIX_CODE)]);
                }
              }} />
            }
          </>
        );
      },
      renderHeader: () => (<Fragment>
        <input type="checkbox" onChange={(e: ChangeEvent) => {
          const el = e.target as HTMLInputElement
          if (el.checked) {
            setInsertItems([...itemSyncList.filter(x => x.FLAG_ALL === "I").map(x => x.PREFIX_CODE)]);
          } else {
            setInsertItems([]);
          }
        }} />
      </Fragment>)
    },
    {
      field: "PREFIX_CODE",
      headerName: "รหัส",
      minWidth: 100,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "PREFIX_NAME",
      headerName: "คำนำหน้า",
      minWidth: 400,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
      renderCell: (params: any) => {
        return (
          <div className="d-flex flex-nowrap">
            <div style={{ width: "25px", paddingLeft: "5px" }} className="col-auto">
              {params.row.FLAG_NAME === "U" && <input type="checkbox" checked={updateNameItems.includes(params.row.PREFIX_CODE)} onChange={(e: ChangeEvent) => {
                const el = e.target as HTMLInputElement
                if (el.checked) {
                  setUpdateNameItems([...updateNameItems, params.row.PREFIX_CODE]);
                } else {
                  setUpdateNameItems([...updateNameItems.filter(x => x !== params.row.PREFIX_CODE)]);
                }
              }} />}
            </div>
            <div className={`col ${params.row.FLAG_NAME === "U" ? "text-danger" : ""}`}>
              {params.row.PREFIX_NAME}
            </div>
          </div>
        );
      },
    },
  ];

  const columns2: GridColDef[] = [
    {
      field: "CODE",
      headerName: "รหัส",
      minWidth: 100,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "NAME",
      headerName: "คำนำหน้า",
      minWidth: 400,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
  ];

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div>
      <Row>
        <Col xs={12}>
          <div style={{ height: 400, width: "100%" }}>
            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  className=""
                  sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                  rows={itemSyncList}
                  columns={columns}
                  getRowId={(row) => row.PREFIX_NAME || ""}
                  getCellClassName={(p) => p.row.FLAG_ALL === "I" ? "text-danger" : ""}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <div className="mt-4">
        <Button
          style={{ marginRight: 5 }}
          variant="primary"
          onClick={saveData}
          className="d-flex align-items-center"
        >
          <Sync />
          &nbsp;Sync คำนำหน้า
        </Button>
      </div>
      <Row>
        <Col xs={12}>
          <div className="mt-4">
            <h6>
              <b>ข้อมูลคำนำหน้า (ล่าสุด)</b>
            </h6>
          </div>
          <div style={{ height: 400, width: "100%", marginTop: ".5rem" }}>
            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  className=""
                  sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                  rows={itemList}
                  columns={columns2}
                  getRowId={(row) => row.CODE || ""}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
const SyncSectionTab = () => {
  const [insertItems, setInsertItems] = useState<string[]>([]);
  const [updateNameItems, setUpdateNameItems] = useState<string[]>([]);
  const [itemSyncList, setItemSyncList] = useState<any[]>([]);
  const [itemList, setItemList] = useState<any[]>([]);

  const loadData = () => {
    LSSITA80SectionSyncList()
      .then(data => setItemSyncList(data));
    LSSITA80SectionList()
      .then(data => setItemList(data));
  }

  const saveData = () => {
    LSSITA80SyncSectionSave({
      INSERT_ITEMS: insertItems,
      UPDATE_NAME_ITEMS: updateNameItems
    }).then(() => {
      setInsertItems([]);
      setUpdateNameItems([]);
      loadData()
    }).catch(() => alert("บันทึกข้อมูลไม่สำเร็จ"));
  }

  const columns: GridColDef[] = [
    {
      field: "col12",
      headerName: "เลือก Sync",
      minWidth: 60,
      width: 60,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params3: any) => {
        return (
          <>
            {
              params3.row.FLAG_ALL === "I" && <input type="checkbox" checked={insertItems.includes(params3.row.SECTION_CODE)} onChange={(e: ChangeEvent) => {
                const el = e.target as HTMLInputElement
                if (el.checked) {
                  setInsertItems([...insertItems, params3.row.SECTION_CODE]);
                } else {
                  setInsertItems([...insertItems.filter(x => x !== params3.row.SECTION_CODE)]);
                }
              }} />
            }
          </>
        );
      },
      renderHeader: () => (<Fragment>
        <input type="checkbox" onChange={(e: ChangeEvent) => {
          const el = e.target as HTMLInputElement
          if (el.checked) {
            setInsertItems([...itemSyncList.filter(x => x.FLAG_ALL === "I").map(x => x.SECTION_CODE)]);
          } else {
            setInsertItems([]);
          }
        }} />
      </Fragment>)
    },
    {
      field: "SECTION_CODE",
      headerName: "รหัส",
      minWidth: 100,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "DESCRIPTION",
      headerName: "หน่วยงาน",
      minWidth: 400,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
      renderCell: (params: any) => {
        return (
          <div className="d-flex flex-nowrap">
            <div style={{ width: "25px", paddingLeft: "5px" }} className="col-auto">
              {params.row.FLAG_NAME === "U" && <input type="checkbox" checked={updateNameItems.includes(params.row.SECTION_CODE)} onChange={(e: ChangeEvent) => {
                const el = e.target as HTMLInputElement
                if (el.checked) {
                  setUpdateNameItems([...updateNameItems, params.row.SECTION_CODE]);
                } else {
                  setUpdateNameItems([...updateNameItems.filter(x => x !== params.row.SECTION_CODE)]);
                }
              }} />}
            </div>
            <div className={`col ${params.row.FLAG_NAME === "U" ? "text-danger" : ""}`}>
              {params.row.DESCRIPTION}
            </div>
          </div>
        );
      },
    },
  ];

  const columns2: GridColDef[] = [
    {
      field: "CODE",
      headerName: "รหัส",
      minWidth: 100,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
    {
      field: "DESCRIPTION",
      headerName: "หน่วยงาน",
      minWidth: 400,
      align: "left",
      headerAlign: "center",
      headerClassName: "headgrid",
    },
  ];

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div>
      <Row>
        <Col xs={12}>
          <div style={{ height: 400, width: "100%" }}>
            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  className=""
                  sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                  rows={itemSyncList}
                  columns={columns}
                  getRowId={(row) => row.SECTION_CODE || ""}
                  getCellClassName={(p) => p.row.FLAG_ALL === "I" ? "text-danger" : ""}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <div className="mt-4">
        <Button
          style={{ marginRight: 5 }}
          variant="primary"
          onClick={saveData}
          className="d-flex align-items-center"
        >
          <Sync />
          &nbsp;Sync หน่วยงาน
        </Button>
      </div>
      <Row>
        <Col xs={12}>
          <div className="mt-4">
            <h6>
              <b>ข้อมูลหน่วยงาน (ล่าสุด)</b>
            </h6>
          </div>
          <div style={{ height: 400, width: "100%", marginTop: ".5rem" }}>
            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  className=""
                  sx={{ fontFamily: "kanit", fontSize: 18, boxShadow: 2 }}
                  rows={itemList}
                  columns={columns2}
                  getRowId={(row) => row.CODE || ""}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const LssITA80List = () => {

  return (
    <div>
      <NavMenu />
      <Card className="card">
        <Card.Body>
          <Col
            md={12}
            style={{
              marginTop: 100,
            }}
          >
            <Col>
              <div style={{ width: "100%" }}>
                <h5>
                  <FaBars size={30} style={{ margin: "auto" }} />
                  &nbsp;&nbsp; LSS-IT-A80 SYNC ข้อมูลจากระบบ BACK OFFICE
                </h5>
                {/* <div>
                  <div className="d-flex mt-2 justify-content-between align-items-baseline py-1 mb-2">
                    <h6>
                      <b>{showTitle}</b>
                    </h6>
                  </div>
                </div> */}
                <Tabs defaultActiveKey="prefix" id="uncontrolled-tab-example">
                  <Tab eventKey="prefix" title="Sync คำนำหน้า">
                    <SyncPrefixTab />
                  </Tab>
                  <Tab eventKey="position" title="Sync ตำแหน่ง">
                    <SyncPositionTab />
                  </Tab>
                  <Tab eventKey="section" title="Sync หน่วยงาน">
                    <SyncSectionTab />
                  </Tab>
                  <Tab eventKey="personal" title="Sync บุคลากร">
                    <SyncPersonalTab />
                  </Tab>
                </Tabs>
              </div>
            </Col>
          </Col>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LssITA80List;
