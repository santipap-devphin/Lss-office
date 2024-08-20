import { useFormik } from "formik";
import { useState, useEffect, FC } from "react";
import * as yup from "yup";

import { Card, Col, Form, Row, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
    LssITA26SaveAPI,
    LssITA26SearchAPI,
    LssITA26EditAPI,
    getLSS_T_ERROR_GROUP
} from "../../../data";

import { useAppContext } from "../../../providers/AppProvider";
import { useDataContext } from "../../../providers/DataProvider";

const LssITA26ListModal: FC<{
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
    const [errorGroups, setErrorGroups] = useState([])
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
            MESSAAGE: any;
            TECHINICAL: any;
            SUGESTION: any;
            EGP_CODE: any;
            COMMENT: any;
            PROGRAM_ID: any;
            ENABLE: any;
            DEL: any;
        }[]
    >([]);

    const fnFetchData = () => {
        if (CODE.ACTIONCLICK === "Edit" || CODE.ACTIONCLICK === "Display") {
            LssITA26SearchAPI(CODE).then((data: any) => {
                let tmpSchema = [];
                for (let i = 0; i < data.length; i++) {
                    tmpSchema.push({
                        id: data[i].CODE,
                        CODE: data[i].CODE,
                        MESSAAGE: data[i].MESSAAGE,
                        TECHINICAL: data[i].TECHINICAL,
                        SUGESTION: data[i].SUGESTION,
                        EGP_CODE: data[i].EGP_CODE,
                        COMMENT: data[i].COMMENT,
                        PROGRAM_ID: data[i].PROGRAM_ID,
                        ENABLE: data[i].ENABLE,
                        DEL: data[i].DEL,
                    });
                }
                setTableDataSearch(tmpSchema);
                setSenable(data[0].ENABLE);
                form.setValues(tmpSchema[0]);
            });
        }

        getLSS_T_ERROR_GROUP().then(data => setErrorGroups(data))
    };
    
    useEffect(() => {
        fnFetchData();
    }, []);

    const initValue = {
        CODE: "",
        MESSAAGE: "",
        TECHINICAL: "",
        SUGESTION: "",
        EGP_CODE: "",
        COMMENT: "",
        PROGRAM_ID: "",
        ENABLE: "",
        DEL: "",
    };

    const form = useFormik({
        validationSchema: yup.object().shape({
            SIGNATOR2: yup.string().nullable(),
            CODE: yup.string().nullable().required("กรุณาป้อนรหัสข้อมูล").typeError('กรุณาป้อนรหัสข้อมูล'),
            MESSAAGE: yup.string().nullable().required("กรุณาป้อนค่าข้อมูล").typeError('กรุณาป้อนค่าข้อมูล'),
            TECHINICAL: yup.string().nullable().required("กรุณาป้อนค่าข้อมูล").typeError('กรุณาป้อนค่าข้อมูล'),
            SUGESTION: yup.string().nullable().required("กรุณาป้อนค่าข้อมูล").typeError('กรุณาป้อนค่าข้อมูล'),
            EGP_CODE: yup.string().nullable().required("กรุณาเลือกรายการ").typeError('กรุณาเลือกรายการ'),
            COMMENT: yup.string().nullable().required("กรุณาป้อนค่าข้อมูล").typeError('กรุณาป้อนค่าข้อมูล'),
            PROGRAM_ID: yup.string().nullable().required("กรุณาป้อนค่าข้อมูล").typeError('กรุณาป้อนค่าข้อมูล'),
        }),

        validateOnBlur: false,
        initialValues: initValue,
        enableReinitialize: true,

        onSubmit: (data: Record<string, any>) => {
            if (CODE.ACTIONCLICK === "Edit") {
                LssITA26EditAPI(data)
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
                LssITA26SaveAPI(data)
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
                                                    รหัสข้อผิดพลาด
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="CODE"
                                                        value={form.values.CODE || ""}
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
                                                    ชื่อที่แสดงข้อผิดพลาด
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="MESSAAGE"
                                                        value={form.values.MESSAAGE || ""}
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors.MESSAAGE
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.MESSAAGE}
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
                                                    ชื่อที่แสดงข้อผิดพลาด (ทางเทคนิค)
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="TECHINICAL"
                                                        value={
                                                            form.values
                                                                .TECHINICAL || ""
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .TECHINICAL
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            form.errors
                                                                .TECHINICAL
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
                                                    คำแนะนำเมื่อเกิดข้อผิดพลาด
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="SUGESTION"
                                                        value={
                                                            form.values.SUGESTION || ""
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .SUGESTION
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {form.errors.SUGESTION}
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
                                                    รหัสกลุ่มข้อผิดพลาด
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select
                                                        name="EGP_CODE"
                                                        value={
                                                            form.values
                                                                .EGP_CODE || ""
                                                        }
                                                        disabled={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .EGP_CODE
                                                        }
                                                    >
                                                        <option value="">กรุณาเลือก</option>
                                                        {errorGroups.map((el: any, i) => (
                                                            <option key={i} value={el.EGP_CODE}>
                                                                {el.EGP_NAME}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            form.errors
                                                                .EGP_CODE
                                                        }
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-3"
                                            >
                                                <Form.Label column sm="4" md="2">
                                                    หมายเหตุ
                                                </Form.Label>
                                                <Col sm={8} md="10">
                                                    <Form.Control
                                                        as="textarea"
                                                        name="COMMENT"
                                                        rows={3}
                                                        value={
                                                            form.values
                                                                .COMMENT || ""
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .COMMENT
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
                                                    รหัสโปรแกรม
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        type="text"
                                                        name="PROGRAM_ID"
                                                        value={
                                                            form.values
                                                                .PROGRAM_ID || ""
                                                        }
                                                        readOnly={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .PROGRAM_ID
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            form.errors
                                                                .PROGRAM_ID
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

export default LssITA26ListModal;
