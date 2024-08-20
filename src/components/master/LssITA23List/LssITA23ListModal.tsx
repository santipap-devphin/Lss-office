import { useFormik } from "formik";
import { useState, useEffect, FC } from "react";
import * as yup from "yup";

import { Card, Col, Form, Row, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
    LssITA23SaveAPI,
    LssITA23SearchAPI,
    LssITA23EditAPI,
} from "../../../data";

import { useAppContext } from "../../../providers/AppProvider";
import { useDataContext } from "../../../providers/DataProvider";

const LssITA23ListModal: FC<{
    CODE: any;
    ACTIONCLICK: any;
    onFetchData: any;
    onModal: any;
    showBtn: any;
    showReadOnly: any;
}> = (CODE, ACTIONCLICK) => {
    const [senable, setSenable] = useState("");
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
            ENABLE: any;
            DESCRIPTION: any;
            POSITION: any;
            
        }[]
    >([]);

    const fnFetchData = () => {
        if (CODE.ACTIONCLICK === "Edit" || CODE.ACTIONCLICK === "Display") {
            LssITA23SearchAPI(CODE).then((data: any) => {
                let tmpSchema = [];
                for (let i = 0; i < data.length; i++) {
                    tmpSchema.push({
                        id: data[i].CODE,
                        CODE: data[i].CODE,
                        NAME: data[i].NAME,
                        ENABLE: data[i].ENABLE,
                        DESCRIPTION: data[i].DESCRIPTION,
                        POSITION: data[i].POSITION,
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
        NAME: "",
        DESCRIPTION: "",
        ENABLE: "",
        POSITION: "",
        
    };

    const form = useFormik({
        validationSchema: yup.object().shape({
            CODE: yup.string().nullable().required("กรุณาป้อนรหัสข้อมูล"),
            NAME: yup.string().nullable().required("กรุณาป้อนข้อมูลตัวแปร"),
            DESCRIPTION: yup.string().nullable().required("กรุณาป้อนข้อมูลคำอธิบาย"),
            POSITION: yup.string().nullable()
            
        }),

        validateOnBlur: false,
        initialValues: initValue,
        enableReinitialize: true,

        onSubmit: (data: Record<string, any>) => {
            if (CODE.ACTIONCLICK === "Edit") {
                LssITA23EditAPI(data)
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
                LssITA23SaveAPI(data)
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
                                                    รหัสตัวแปร
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
                                                    ชื่อสถานะ
                                                    <span className="text-danger">
                                                        *
                                                    </span>
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
                                        <Col sm={12}>
                                            <Form.Group
                                                as={Row}
                                                className="mb-12"
                                            >
                                                <Form.Label column sm="2">
                                                    คำอธิบาย
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </Form.Label>
                                                <Col style={{paddingBottom:"10px"}}>
                                                    <Form.Control  style={{paddingBottom:"10px"}}
                                                        as="textarea"
                                                        rows={3}
                                                        name="DESCRIPTION"
                                                        value={
                                                            form.values
                                                                .DESCRIPTION
                                                        }
                                                        disabled={
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
                                       
                                    </Row>
                                    <Row>
                                    <Col sm={12} >
                                            <Form.Group
                                                as={Row}
                                                className="mb-12"
                                            >
                                                <Form.Label column sm="2">
                                                    ตำแหน่งที่แสดง
               
                                                </Form.Label>
                                                <Col>
                                                    <Form.Control
                                                        as="textarea"
                                                          rows={3}
                                                        name="POSITION"
                                                        value={
                                                            form.values
                                                                .POSITION
                                                        }
                                                        disabled={
                                                            CODE.showReadOnly
                                                        }
                                                        onChange={
                                                            form.handleChange
                                                        }
                                                        isInvalid={
                                                            !!form.errors
                                                                .POSITION
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            form.errors
                                                                .POSITION
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
                                                <Col sm={8}>
                                                    <Form.Group
                                                        as={Row}
                                                        className="mb-3"
                                                    >
                                                        <Form.Label
                                                            column
                                                            sm="4"
                                                        >
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
                                                                    senable ===
                                                                    "Y"
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) => {
                                                                    form.values.ENABLE =
                                                                        event.target.value;
                                                                    setSenable(
                                                                        event
                                                                            .target
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
                                                                    senable ===
                                                                    "N"
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) => {
                                                                    form.values.ENABLE =
                                                                        event.target.value;
                                                                    setSenable(
                                                                        event
                                                                            .target
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

export default LssITA23ListModal;
