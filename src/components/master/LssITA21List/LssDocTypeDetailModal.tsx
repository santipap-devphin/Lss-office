import { useFormik } from "formik";
import { useState, useEffect, FC } from "react";
import * as yup from "yup";

import { Card, Col, Form, Row, Button, Container, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
    lssDocTypeDetailSave,
    lssDocTypeDetailDelete,
    lssDocTypeDetailEdit,
    lssDocTypeDetailList,
    lssDocTypeDetailListByDocType,
    lssDocTypeDetailSearch
} from "../../../data";

import { useAppContext } from "../../../providers/AppProvider";
import { useDataContext } from "../../../providers/DataProvider";

let _docTypeCode: string;
const LssDocTypeDetailModal: FC<{
    mode?: "Edit" | "View" | "Add",
    show?: boolean,
    onClose?: Function,
    onUpdateComplete?: Function,
    docTypeCode?: string,
    code?: string
}> = ({ mode, show, onClose, docTypeCode, code, onUpdateComplete }) => {
    const [senable, setSenable] = useState("Y");
    const [sDel, setDel] = useState("Y");
    const [formData, setFormData] = useState<any>({})
    const { logout } = useAppContext();
    const { clearData } = useDataContext();
    const isReadOnly = mode !== "Add" && mode !== "Edit";
    _docTypeCode = docTypeCode || "";
    let navigate = useNavigate();
    const handleLogout = () => {
        clearData().then(() => {
            logout();
        });
    };

    const fnFetchData = () => {
        lssDocTypeDetailSearch({ CODE: code || "" }).then((data: any) => {
            const data0 = data[0];
            setFormData(data0 || {})
        });
    }



    const initValue = {
        CODE: "",
        CREATED_DATE: null,
        CREATE_USER: null,
        DEL: "N",
        DOCTYPE_CODE: "",
        ENABLE: "Y",
        FILE_TYPE: "",
        MAX_SIZE: null,
        NAME: "",
        QUANTITY_FILE: null,
        REQUIRED: "N",
        VERSION: "",
        SEQ: null
    };

    const form = useFormik({
        validationSchema: yup.object().shape({
            CODE: yup.string().nullable(),
            NAME: yup.string().nullable().required("จำเป็นต้องระบุ").typeError("จำเป็นต้องระบุ"),
            VERSION: yup.string().nullable().required("จำเป็นต้องระบุ").typeError("จำเป็นต้องระบุ"),
            FILE_TYPE: yup.string().nullable(),
        }),

        validateOnBlur: false,
        initialValues: initValue,
        enableReinitialize: true,

        onSubmit: (data: Record<string, any>) => {
            var fileTypeSC = data.FILE_TYPE.split(":");
            var fileTypeOL = [];
            var checkFileType = true;
            for (let i = 0; i < fileTypeSC.length; i++) {
                fileTypeOL.push(fileTypeSC[i].split("."));
            }
            fileTypeOL.forEach(e => {
                checkFileType = e.length === 2 ? true : false;
                if(!checkFileType){
                    form.setFieldError("FILE_TYPE", "กรุณใส่นามสกลุไฟล์ให้ถูกต้อง เช่น .pdf หรือ .pdf:.docx เป็นต้น")
                }
            });
            if(checkFileType){
                data = { ...data, DOCTYPE_CODE: _docTypeCode }
                if (mode === "Edit") {
                    lssDocTypeDetailEdit(data)
                        .then((res: any) => {
                            Swal.fire(
                                "บันทึกข้อมูล",
                                "บันทึกเรียบร้อย",
                                "success"
                            ).then(() => {
                                if (onClose) onClose();
                                if (onUpdateComplete) onUpdateComplete();
                            });
                        })
                        .catch((err: any) => {
                            if (err.status === 404) {
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
                } else if (mode === "Add") {
                    lssDocTypeDetailSave(data)
                        .then((res: any) => {
                            Swal.fire(
                                "บันทึกข้อมูล",
                                "บันทึกเรียบร้อย",
                                "success"
                            ).then(() => {
                                if (onClose) onClose();
                                if (onUpdateComplete) onUpdateComplete();
                            });
                        })
                        .catch((err: any) => {
                            if (err.status === 404) {
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
             }
        },
    });

    useEffect(() => {
        form.setValues(formData)
    }, [formData])

    useEffect(() => {
        if (show) {
            if (mode === "Edit" || mode === "View") {
                fnFetchData()
            } else if (mode === "Add") {
                form.setValues({ ...initValue, DOCTYPE_CODE: _docTypeCode })
            }


        }
    }, [show])
    return (
        <Modal
            size="xl"
            show={show}
            onHide={() => { if (onClose) onClose() }}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Body>
                <div style={{ width: "100%" }}>
                    <Container>
                        <Row>
                            <Col>
                                <Form onSubmit={form.handleSubmit}>
                                    <Card className="mt-5">
                                        <Card.Header>{mode === "Add" ? "เพื่มข้อมูล" : mode === "Edit" ? "แก้ไขข้อมูล" : "รายละเอียด"}</Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col sm={12} md={6}>
                                                    <Form.Group
                                                        as={Row}
                                                        className="mb-3"
                                                    >
                                                        <Form.Label column sm="4">
                                                            รหัสรายการ
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Form.Label>
                                                        <Col sm={8}>
                                                            <Form.Control
                                                                type="text"
                                                                name="CODE"
                                                                value={form.values.CODE || ""}
                                                                readOnly={
                                                                    mode !== "Add"
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
                                                            Version
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Form.Label>
                                                        <Col sm={8}>
                                                            <Form.Control
                                                                type="text"
                                                                name="VERSION"
                                                                value={form.values.VERSION || ""}
                                                                readOnly={
                                                                    isReadOnly
                                                                }
                                                                onChange={
                                                                    form.handleChange
                                                                }
                                                                isInvalid={
                                                                    !!form.errors.VERSION
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {form.errors.VERSION}
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
                                                            รหัสประเภทเอกสาร
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Form.Label>
                                                        <Col sm={8}>
                                                            <Form.Control
                                                                type="text"
                                                                name="DOCTYPE_CODE"
                                                                value={form.values.DOCTYPE_CODE || ""}
                                                                readOnly={
                                                                    true
                                                                }
                                                                onChange={
                                                                    form.handleChange
                                                                }
                                                                isInvalid={
                                                                    !!form.errors.DOCTYPE_CODE
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {form.errors.DOCTYPE_CODE}
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
                                                            ชื่อรายการเอกสาร
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        </Form.Label>
                                                        <Col sm={8}>
                                                            <Form.Control
                                                                type="text"
                                                                name="NAME"
                                                                value={form.values.NAME || ""}
                                                                readOnly={
                                                                    isReadOnly
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
                                                            ประเภทไฟล์
                                                        </Form.Label>
                                                        <Col sm={8}>
                                                            <Form.Control
                                                                type="text"
                                                                name="FILE_TYPE"
                                                                value={form.values.FILE_TYPE || ""}
                                                                readOnly={
                                                                    isReadOnly
                                                                }
                                                                onChange={
                                                                    form.handleChange
                                                                }
                                                                isInvalid={
                                                                    !!form.errors.FILE_TYPE
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {form.errors.FILE_TYPE}
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
                                                            ขนาดสูงสุด
                                                        </Form.Label>
                                                        <Col sm={8}>
                                                            <Form.Control
                                                                type="number"
                                                                name="MAX_SIZE"
                                                                value={form.values.MAX_SIZE || ""}
                                                                readOnly={
                                                                    isReadOnly
                                                                }
                                                                onChange={
                                                                    form.handleChange
                                                                }
                                                                isInvalid={
                                                                    !!form.errors.MAX_SIZE
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {form.errors.MAX_SIZE}
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
                                                            บังคับระบุ
                                                        </Form.Label>
                                                        <Col sm={8}>
                                                            <Form.Check
                                                                type="checkbox"
                                                                name="REQUIRED"
                                                                checked={form.values.REQUIRED === "Y"}
                                                                disabled={
                                                                    isReadOnly
                                                                }
                                                                onChange={(e) => {
                                                                    const checked = e.target.checked
                                                                    form.setFieldValue("REQUIRED", checked ? "Y" : "N");
                                                                }}
                                                                isInvalid={
                                                                    !!form.errors.REQUIRED
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {form.errors.REQUIRED}
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
                                                            จำนวนไฟล์สูงสุด
                                                        </Form.Label>
                                                        <Col sm={8}>
                                                            <Form.Control
                                                                type="text"
                                                                name="QUANTITY_FILE"
                                                                value={form.values.QUANTITY_FILE || ""}
                                                                readOnly={
                                                                    isReadOnly
                                                                }
                                                                onChange={
                                                                    form.handleChange
                                                                }
                                                                isInvalid={
                                                                    !!form.errors.QUANTITY_FILE
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {form.errors.QUANTITY_FILE}
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
                                                            ลำดับ
                                                        </Form.Label>
                                                        <Col sm={8}>
                                                            <Form.Control
                                                                type="number"
                                                                name="SEQ"
                                                                value={form.values.SEQ || ""}
                                                                readOnly={
                                                                    isReadOnly
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
                                                                    isReadOnly
                                                                }
                                                                checked={
                                                                    form.values.ENABLE === "Y"
                                                                }
                                                                onChange={
                                                                    form.handleChange
                                                                }
                                                            />
                                                            <Form.Check
                                                                inline
                                                                label="ไม่ใช้งาน"
                                                                name="ENABLE"
                                                                type="radio"
                                                                id={`inline-radio-2`}
                                                                value="N"
                                                                disabled={
                                                                    isReadOnly
                                                                }
                                                                checked={
                                                                    form.values.ENABLE === "N"
                                                                }
                                                                onChange={
                                                                    form.handleChange
                                                                }
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Row className="justify-content-center my-3">
                                        <Col
                                            sm="1"
                                            className="d-flex justify-content-center"
                                        >
                                            {!isReadOnly && <Button
                                                className="mt-2"
                                                disabled={
                                                    !form.isValid || form.isValidating
                                                }
                                                type="submit"
                                                variant="primary"
                                            >
                                                บันทึก
                                            </Button>
                                            }
                                        </Col>
                                        <Col
                                            sm="1"
                                            className="d-flex justify-content-center"
                                        >
                                            <Button
                                                className="mt-2"
                                                variant="danger"
                                                onClick={() => {
                                                    if (onClose) onClose();
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
            </Modal.Body>
        </Modal>

    );
};

export default LssDocTypeDetailModal;
