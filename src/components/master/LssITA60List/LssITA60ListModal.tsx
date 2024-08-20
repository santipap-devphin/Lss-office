import { useFormik } from "formik";
import { useState, useEffect, FC } from "react";
import * as yup from "yup";

import { Card, Col, Form, Row, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
    LssITA60SaveAPI,
    LssITA60SearchAPI,
    LssITA60EditAPI,
    LssITA60ListAPI
} from "../../../data";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import { useAppContext } from "../../../providers/AppProvider";
import { useDataContext } from "../../../providers/DataProvider";

const LssITA60ListModal: FC<{
    CODE: any;
    ACTIONCLICK: any;
    onFetchData: any;
    onModal: any;
    showBtn: any;
    showReadOnly: any;
}> = (CODE, ACTIONCLICK) => {
    const [senable, setSenable] = useState("Y");
    const [del, setDel] = useState("Y");

    const [add, setAdd] = useState("N");
    const [search, setSearch] = useState("N");
    const [edit, setEdit] = useState("N");
    const [view, setView] = useState("N");
    const [deleted, setDeleted] = useState("N");

    const [parentMenuOptions, setParentMenuOptions] = useState<any[]>([])

    const { logout } = useAppContext();
    const { clearData } = useDataContext();
    let navigate = useNavigate();
    const handleLogout = () => {
        clearData().then(() => {
            logout();
        });
    };

    const [tableDataSearch, setTableDataSearch] = useState<
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

    const fnFetchData = () => {
        if (CODE.ACTIONCLICK === "Edit" || CODE.ACTIONCLICK === "Display") {
            LssITA60SearchAPI(CODE).then((data: any) => {
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
                setTableDataSearch(tmpSchema);
                setAdd(data[0].ADD);
                setEdit(data[0].EDIT);
                setSearch(data[0].SEARCH);
                setView(data[0].VIEW);
                setDeleted(data[0].DELETE);
                setSenable(data[0].ENABLE);
                setDel(data[0].DEL);
                form.setValues(tmpSchema[0]);
            });
        }

        LssITA60ListAPI()
            .then(data => {
                setParentMenuOptions(data)
            })
    };

    useEffect(() => {
        fnFetchData();
    }, []);

    const initValue = {
        CODE: "",
        NAME: "",
        DESCRIPTION: "",
        LEVEL: "",
        SEQ: "",
        PARENT_CODE: "",
        DISPLAY: "",
        URL_ACTION: "",
        URL_TYPE: "",
        URL_TARGET: "",
        WIDTH: "",
        CONDITION1: "",
        ACCOUNT_TYPE_CODE: "",
        ADMIN_FLAG: "",
        COMPANY_TYPE_CODE: "",
        ENABLE: "",
        DEL: "",
        ADD: "",
        EDIT: "",
        SEARCH: "",
        VIEW: "",
        DELETE: "",
    };

    const form = useFormik({
        validationSchema: yup.object().shape({
            CODE: yup.string().nullable().required("กรุณาป้อนรหัสเมนู"),
            NAME: yup.string().nullable().required("กรุณาป้อนชื่อเมนู"),
            DESCRIPTION: yup.string().nullable().required("กรุณาป้อนคำอธิบาย"),
            LEVEL: yup.string().nullable().required("กรุณาป้อนระดับชั้น"),
            SEQ: yup.string().nullable().required("กรุณาป้อนลำดับเมนู"),
            PARENT_CODE: yup.string().nullable().required("กรุณาป้อนภายใต้รหัสเมนูหลัก"),
            DISPLAY: yup.string().nullable().required("กรุณาป้อนสถานะให้แสดง"),
            URL_ACTION: yup.string().nullable().required("กรุณาป้อนเชื่อมโยง"),
            URL_TYPE: yup.string().nullable().required("กรุณาป้อนประเภทการเชื่อมโยง"),
            URL_TARGET: yup
                .string()
                .required("กรุณาป้อนสถานะการเปิดการเชื่อมโยง"),
            WIDTH: yup.string().nullable().required("กรุณาป้อนความกว้างเมนู"),
            CONDITION1: yup.string().nullable().required("กรุณาป้อนเงื่อนไขเพิ่มเติม"),
            ACCOUNT_TYPE_CODE: yup
                .string()
                .required("กรุณาป้อนรหัสประเภทผู้ใช้ระบบ"),
            ADMIN_FLAG: yup
                .string()
                .required("กรุณาป้อนสถานะเมนูสำหรับผู้ดูแล"),
            COMPANY_TYPE_CODE: yup.string().nullable().required("กรุณาป้อนประเภทบริษัท"),
            // DEL: yup.string().nullable().required("กรุณาป้อนสถานะการยกเลิก"),
            // ENABLE: yup.string().nullable().required("กรุณาป้อนสถานะการใช้งาน"),
        }),

        validateOnBlur: false,
        initialValues: initValue,
        enableReinitialize: true,

        onSubmit: (data: Record<string, any>) => {
            if (CODE.ACTIONCLICK === "Edit") {
                LssITA60EditAPI(data)
                    .then((res: any) => {
                        Swal.fire(
                            "บันทึกข้อมูล",
                            "บันทึกเรียบร้อย",
                            "success"
                        ).then(() => {
                            CODE.onFetchData();
                            CODE.onModal(false);
                        });
                    })
                    .catch((err: any) => {
                        if (err.response.data.status === 404) {
                            Swal.fire(
                                "รหัสไม่ถูกต้อง",
                                "รหัสรหัสคีย์ไม่มีในระบบตรวจสอบการกรอกข้อมูลอีกครั้ง ",
                                "warning"
                            );
                        } else if (err.status === 400) {
                            Swal.fire(
                                "แจ้งเตือน",
                                "ตรวจสอบการกรอกข้อมูลอีกครั้ง",
                                "warning"
                            );
                        }
                    });
            } else if (CODE.ACTIONCLICK === "Add") {
                LssITA60SaveAPI(data)
                    .then((res: any) => {
                        Swal.fire(
                            "บันทึกข้อมูล",
                            "บันทึกเรียบร้อย",
                            "success"
                        ).then(() => {
                            CODE.onFetchData();
                            CODE.onModal(false);
                        });
                    })
                    .catch((err: any) => {
                        if (err.response.data.status === 404) {
                            Swal.fire(
                                "รหัสซ้ำ",
                                "รหัสคีย์หลักซ้ำตรวจสอบการกรอกข้อมูลอีกครั้ง ",
                                "warning"
                            );
                        } else if (err.status === 400) {
                            Swal.fire(
                                "แจ้งเตือน",
                                "ตรวจสอบการกรอกข้อมูลอีกครั้ง",
                                "warning"
                            );
                        }
                    });
            }
        },
    });

    const handleChangeAdd = (event: any) => {
        if (event.target.checked === true) {
            form.values.ADD = "Y";
            event.target.value = "Y";
            setAdd("Y");
        } else {
            form.values.ADD = "N";
            event.target.value = "N";
            setAdd("N");
        }
        //console.log(event.target.value);
    };
    const handleChangeSearch = (event: any) => {
        if (event.target.checked === true) {
            form.values.SEARCH = "Y";
            event.target.value = "Y";
            setSearch("Y");
        } else {
            form.values.SEARCH = "N";
            event.target.value = "N";
            setSearch("N");
        }
        //console.log(event.target.value);
    };
    const handleChangeEdit = (event: any) => {
        if (event.target.checked === true) {
            form.values.EDIT = "Y";
            event.target.value = "Y";
            setEdit("Y");
        } else {
            form.values.EDIT = "N";
            event.target.value = "N";
            setEdit("N");
        }
        //console.log(event.target.value);
    };
    const handleChangeView = (event: any) => {
        if (event.target.checked === true) {
            form.values.VIEW = "Y";
            event.target.value = "Y";
            setView("Y");
        } else {
            form.values.VIEW = "N";
            event.target.value = "N";
            setView("N");
        }
        //console.log(event.target.value);
    };
    const handleChangeDelete = (event: any) => {
        if (event.target.checked === true) {
            form.values.DELETE = "Y";
            event.target.value = "Y";
            setDeleted("Y");
        } else {
            form.values.DELETE = "N";
            event.target.value = "N";
            setDeleted("N");
        }
        //console.log(event.target.value);
    };

    return (
        <div style={{ width: "100%" }}>
            <Container>
                <Row>
                    <Col>
                        <Form onSubmit={form.handleSubmit}>
                            <Card className="mt-5">
                                <Card.Header>ดำเนินการ</Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    รหัสเมนู
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="CODE"
                                                        value={form.values.CODE}
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors.CODE
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.CODE}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    ชื่อเมนู
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="NAME"
                                                        value={form.values.NAME}
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors.NAME
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.NAME}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>

                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    คำอธิบาย
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="DESCRIPTION"
                                                        value={
                                                            form.values
                                                                .DESCRIPTION
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .DESCRIPTION
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            form.errors
                                                                .DESCRIPTION
                                                        }
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    ระดับชั้น
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="LEVEL"
                                                        value={
                                                            form.values.LEVEL
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors.LEVEL
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.LEVEL}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>

                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    ลำดับเมนู
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="SEQ"
                                                        value={form.values.SEQ}
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors.SEQ
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.SEQ}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    ภายใต้เมนู
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select
                                                        name="PARENT_CODE"
                                                        value={
                                                            form.values
                                                                .PARENT_CODE
                                                        }
                                                        disabled={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .PARENT_CODE
                                                        }
                                                    >
                                                        <option value={""}></option>
                                                        {
                                                            parentMenuOptions.map(i => <option value={i.CODE || ""}>{`${i.NAME}`}</option>)
                                                        }
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            form.errors
                                                                .PARENT_CODE
                                                        }
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>

                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    สถานะให้แสดง
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="DISPLAY"
                                                        value={
                                                            form.values.DISPLAY
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .DISPLAY
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.DISPLAY}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    เชื่อมโยง
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="URL_ACTION"
                                                        value={
                                                            form.values
                                                                .URL_ACTION
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .URL_ACTION
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.URL_ACTION}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    ประเภทการเชื่อมโยง
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="URL_TYPE"
                                                        value={
                                                            form.values.URL_TYPE
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .URL_TYPE
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.URL_TYPE}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    สถานะการเปิดการเชื่อมโยง
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="URL_TARGET"
                                                        value={
                                                            form.values
                                                                .URL_TARGET
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .URL_TARGET
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.URL_TARGET}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    ความกว้างเมนู
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="WIDTH"
                                                        value={
                                                            form.values.WIDTH
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors.WIDTH
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.WIDTH}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    เงื่อนไขเพิ่มเติม
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="CONDITION1"
                                                        value={
                                                            form.values
                                                                .CONDITION1
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .CONDITION1
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.CONDITION1}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    รหัสประเภทผู้ใช้ระบบ
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="ACCOUNT_TYPE_CODE"
                                                        value={
                                                            form.values
                                                                .ACCOUNT_TYPE_CODE
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .ACCOUNT_TYPE_CODE
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            form.errors
                                                                .ACCOUNT_TYPE_CODE
                                                        }
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    สถานะเมนูสำหรับผู้ดูแล
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="ADMIN_FLAG"
                                                        value={
                                                            form.values
                                                                .ADMIN_FLAG
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .ADMIN_FLAG
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.ADMIN_FLAG}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    ประเภทบริษัท
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="COMPANY_TYPE_CODE"
                                                        value={
                                                            form.values
                                                                .COMPANY_TYPE_CODE
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .COMPANY_TYPE_CODE
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            form.errors
                                                                .COMPANY_TYPE_CODE
                                                        }
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    เพิ่ม
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <FormControlLabel
                                                        disabled={
                                                            CODE.showReadOnly
                                                        }
                                                        control={
                                                            <Checkbox
                                                                name="ADD"
                                                                checked={
                                                                    add === "Y"
                                                                }
                                                                onChange={
                                                                    handleChangeAdd
                                                                }
                                                            />
                                                        }
                                                        label=""
                                                    />
                                                    {/* <Form.Control
                                                        type="text"
                                                        name="ADD"
                                                        value={form.values.ADD}
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors.ADD
                                                        }
                                                    /> */}
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.ADD}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    แก้ไข
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <FormControlLabel
                                                        disabled={
                                                            CODE.showReadOnly
                                                        }
                                                        control={
                                                            <Checkbox
                                                                name="EDIT"
                                                                checked={
                                                                    edit === "Y"
                                                                }
                                                                onChange={
                                                                    handleChangeEdit
                                                                }
                                                            />
                                                        }
                                                        label=""
                                                    />
                                                    {/* <Form.Control
                                                        type="text"
                                                        name="EDIT"
                                                        value={form.values.EDIT}
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors.EDIT
                                                        }
                                                    /> */}
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.EDIT}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    ค้นหา
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <FormControlLabel
                                                        disabled={
                                                            CODE.showReadOnly
                                                        }
                                                        control={
                                                            <Checkbox
                                                                name="SEARCH"
                                                                checked={
                                                                    search === "Y"
                                                                }
                                                                onChange={
                                                                    handleChangeSearch
                                                                }
                                                            />
                                                        }
                                                        label=""
                                                    />
                                                    {/* <Form.Control
                                                        type="text"
                                                        name="SEARCH"
                                                        value={
                                                            form.values.SEARCH
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors.SEARCH
                                                        }
                                                    /> */}
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.SEARCH}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    ดู
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <FormControlLabel
                                                        disabled={
                                                            CODE.showReadOnly
                                                        }
                                                        control={
                                                            <Checkbox
                                                                name="VIEW"
                                                                checked={
                                                                    view === "Y"
                                                                }
                                                                onChange={
                                                                    handleChangeView
                                                                }
                                                            />
                                                        }
                                                        label=""
                                                    />
                                                    {/* <Form.Control
                                                        type="text"
                                                        name="VIEW"
                                                        value={form.values.VIEW}
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors.VIEW
                                                        }
                                                    /> */}
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.VIEW}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    ลบ
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <FormControlLabel
                                                        disabled={
                                                            CODE.showReadOnly
                                                        }
                                                        control={
                                                            <Checkbox
                                                                name="DELETE"
                                                                checked={
                                                                    deleted === "Y"
                                                                }
                                                                onChange={
                                                                    handleChangeDelete
                                                                }
                                                            />
                                                        }
                                                        label=""
                                                    />
                                                    {/* <Form.Control
                                                        type="text"
                                                        name="DELETE"
                                                        value={
                                                            form.values.DELETE
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors.DELETE
                                                        }
                                                    />*/}
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.DELETE}
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    สถานะ
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Check
                                                        inline
                                                        label="ใช้งาน"
                                                        name="ENABLE"
                                                        type="radio"
                                                        id={`inline-radio-1`}
                                                        value="Y"
                                                        disabled={
                                                            CODE.showReadOnly
                                                        }
                                                        checked={
                                                            senable === "Y"
                                                        }
                                                        onChange={(
                                                            event: any
                                                        ) => {
                                                            form.values.ENABLE =
                                                                event.target.value;
                                                            setSenable(
                                                                event.target
                                                                    .value
                                                            );
                                                        }}
                                                    />
                                                    <Form.Check
                                                        inline
                                                        label="ไม่ใช้งาน"
                                                        name="ENABLE"
                                                        type="radio"
                                                        id={`inline-radio-1`}
                                                        value="N"
                                                        disabled={
                                                            CODE.showReadOnly
                                                        }
                                                        checked={
                                                            senable === "N"
                                                        }
                                                        onChange={(
                                                            event: any
                                                        ) => {
                                                            form.values.ENABLE =
                                                                event.target.value;
                                                            setSenable(
                                                                event.target
                                                                    .value
                                                            );
                                                        }}
                                                    />
                                                    <Form.Control
                                                        name="ENABLE"
                                                        value={senable}
                                                        id="ENABLE"
                                                        type="hidden"
                                                    />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        {/* <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4">
                                                    สถานะยกเลิก
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Check
                                                        inline
                                                        label="ใช้งาน"
                                                        name="DEL"
                                                        type="radio"
                                                        id={`inline-radio-2`}
                                                        value="Y"
                                                        disabled={
                                                            CODE.showReadOnly
                                                        }
                                                        checked={del === "Y"}
                                                        onChange={(
                                                            event: any
                                                        ) => {
                                                            form.values.DEL =
                                                                event.target.value;
                                                            setDel(
                                                                event.target
                                                                    .value
                                                            );
                                                        }}
                                                    />
                                                    <Form.Check
                                                        inline
                                                        label="ยกเลิกใช้งาน"
                                                        name="DEL"
                                                        type="radio"
                                                        id={`inline-radio-2`}
                                                        value="N"
                                                        disabled={
                                                            CODE.showReadOnly
                                                        }
                                                        checked={del === "N"}
                                                        onChange={(
                                                            event: any
                                                        ) => {
                                                            form.values.DEL =
                                                                event.target.value;
                                                            setDel(
                                                                event.target
                                                                    .value
                                                            );
                                                        }}
                                                    />
                                                    <Form.Control
                                                        name="DEL"
                                                        value={del}
                                                        id="DEL"
                                                        type="hidden"
                                                    />
                                                </Col>
                                            </Form.Group>
                                        </Col> */}
                                    </Row>
                                </Card.Body>
                            </Card>
                            <Row className="justify-content-center my-3">
                                <Col
                                    sm="1"
                                    className="d-flex justify-content-center"
                                >
                                    <Button
                                        className="mt-2"
                                        disabled={
                                            !form.isValid || form.isValidating
                                        }
                                        type="submit"
                                        variant="primary"
                                        style={{ display: `${CODE.showBtn}` }}
                                    >
                                        บันทึก
                                    </Button>
                                </Col>
                                <Col
                                    sm="1"
                                    className="d-flex justify-content-center"
                                >
                                    <Button
                                        className="mt-2"
                                        variant="danger"
                                        onClick={() => {
                                            CODE.onModal(false);
                                        }}
                                    >
                                        ยกเลิก
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LssITA60ListModal;
