import { useFormik } from "formik";
import { useState, useEffect, FC } from "react";
import * as yup from "yup";

import { Card, Col, Form, Row, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
    LssITA28SaveAPI,
    LssITA28SearchAPI,
    LssITA28EditAPI,
} from "../../../data";

import { useAppContext } from "../../../providers/AppProvider";
import { useDataContext } from "../../../providers/DataProvider";

const LssITA28ListModal: FC<{
    CODE: any;
    ACTIONCLICK: any;
    onFetchData: any;
    onModal: any;
    showBtn: any;
    showReadOnly: any;
}> = (CODE, ACTIONCLICK) => {
    const [senable, setSenable] = useState("Y");
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
            COMMENT: any;
            RUNING: any;
            DIGIT: any;
            FORMAT: any;
            STEP: any;
            CULTURE_INFO: any;
            HEAD: any;
            ENABLE: any;
            DEL: any;
        }[]
    >([]);

    const fnFetchData = () => {
        if (CODE.ACTIONCLICK === "Edit" || CODE.ACTIONCLICK === "Display") {
            LssITA28SearchAPI(CODE).then((data: any) => {
                let tmpSchema = [];
                for (let i = 0; i < data.length; i++) {
                    tmpSchema.push({
                        id: data[i].CODE,
                        CODE: data[i].CODE,
                        COMMENT: data[i].COMMENT,
                        RUNING: data[i].RUNING,
                        DIGIT: data[i].DIGIT,
                        FORMAT: data[i].FORMAT,
                        STEP: data[i].STEP,
                        CULTURE_INFO: data[i].CULTURE_INFO,
                        HEAD: data[i].HEAD,
                        ENABLE: data[i].ENABLE,
                        DEL: data[i].DEL,
                    });
                }
                setTableDataSearch(tmpSchema);
                setSenable(data[0].ENABLE);
                form.setValues(tmpSchema[0]);
            });
        }
    };

    useEffect(() => {
        fnFetchData();
    }, []);

    const initValue = {
        CODE: "",
        COMMENT: "",
        RUNING: "",
        DIGIT: "",
        FORMAT: "",
        STEP: "",
        CULTURE_INFO: "",
        HEAD: "",
        ENABLE: "",
        DEL: "",
    };

    const form = useFormik({
        validationSchema: yup.object().shape({
            SIGNATOR2: yup.string().nullable(),
            CODE: yup.string().nullable().required("กรุณาป้อนรหัสข้อมูล").typeError("กรุณาป้อนรหัสข้อมูล"),
            COMMENT: yup.string().nullable().required("กรุณาป้อนค่าข้อมูล").typeError("กรุณาป้อนค่าข้อมูล"),
            RUNING: yup.string().nullable().required("กรุณาป้อนค่าข้อมูล").typeError("กรุณาป้อนค่าข้อมูล"),
            DIGIT: yup.string().nullable().required("กรุณาป้อนค่าข้อมูล").typeError("กรุณาป้อนรหัสข้อมูล"),
            FORMAT: yup.string().nullable().required("กรุณาป้อนค่าข้อมูล").typeError("กรุณาป้อนค่าข้อมูล"),
            CULTURE_INFO: yup.string().nullable().required("กรุณาป้อนค่าข้อมูล").typeError("กรุณาป้อนค่าข้อมูล"),
            STEP: yup.string().nullable().required("กรุณาป้อนค่าข้อมูล").typeError("กรุณาป้อนค่าข้อมูล"),
            HEAD: yup.string().nullable().required("กรุณาป้อนค่าข้อมูล").typeError("กรุณาป้อนค่าข้อมูล"),
 
        }),

        validateOnBlur: false,
        initialValues: initValue,
        enableReinitialize: true,

        onSubmit: (data: Record<string, any>) => {
            if (CODE.ACTIONCLICK === "Edit") {
                LssITA28EditAPI(data)
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
                LssITA28SaveAPI(data)
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
                                                    รหัส
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
                                                    หมายเหตุ
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="COMMENT"
                                                        value={form.values.COMMENT}
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors.COMMENT
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.COMMENT}
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
                                                    เริ่มต้น
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="RUNING"
                                                        value={
                                                            form.values
                                                                .RUNING
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .RUNING
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            form.errors
                                                                .RUNING
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
                                                    จำนวนหลัก
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="DIGIT"
                                                        value={
                                                            form.values.DIGIT
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .DIGIT
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.DIGIT}
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
                                                    รูปแบบ
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="FORMAT"
                                                        value={
                                                            form.values
                                                                .FORMAT
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .FORMAT
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            form.errors
                                                                .FORMAT
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
                                                    จำนวนค่าที่เพิ่ม
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="STEP"
                                                        value={
                                                            form.values
                                                                .STEP
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .STEP
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.STEP}
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
                                                    รูปแบบภาษา th-TH
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="CULTURE_INFO"
                                                        value={
                                                            form.values
                                                                .CULTURE_INFO
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .CULTURE_INFO
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            form.errors
                                                                .CULTURE_INFO
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
                                                  หัวข้อ
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="HEAD"
                                                        value={
                                                            form.values
                                                                .HEAD
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .HEAD
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            form.errors
                                                                .HEAD
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
                                                        onChange={(event) => {
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
                                                        onChange={(event) => {
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
                                        <Col sm={12} md={6}></Col>
                                    </Row>
                                    {/* <Row>
                                        <Col sm={12} md={6}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Col sm={8}>
                                                    <Form.Group
                                                        as={Row}
                                                        className="mb-3"
                                                    >
                                                        <Form.Label
                                                            column
                                                            sm="4"
                                                        >
                                                            ยกเลิกใช้งาน
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
                                                                id={`inline-radio-1`}
                                                                value="Y"
                                                                disabled={
                                                                    CODE.showReadOnly
                                                                }
                                                                checked={
                                                                    senable ===
                                                                    "Y"
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) => {
                                                                    form.values.DEL =
                                                                        event.target.value;
                                                                    setDel(
                                                                        event
                                                                            .target
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
                                                                checked={
                                                                    senable ===
                                                                    "N"
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) => {
                                                                    form.values.DEL =
                                                                        event.target.value;
                                                                    setDel(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    );
                                                                }}
                                                            />
                                                            <Form.Control
                                                                name="DEL"
                                                                value={senable}
                                                                id="DEL"
                                                                type="hidden"
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12} md={6}></Col>
                                    </Row> */}
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

export default LssITA28ListModal;
