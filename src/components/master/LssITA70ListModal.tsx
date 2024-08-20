import React, { FC, Fragment, useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { Field, FieldArray, Formik, FormikProvider, useFormik } from "formik";
import { Radio } from "antd";
import { LssITA70Get, LssITA70Save, LssITA70Edit } from '../../data';
import * as yup from "yup";
import { Col, Form, Row, Button, Modal, FormGroup, FormLabel, Tabs, Tab } from "react-bootstrap";
import { LSS_T_DR_FIELD, LSS_T_DR_PARAMETER, LSS_T_DYNAMIC_REPORT } from '../../models/office/LSS_T_DYNAMIC_REPORT.model';

import m_edit from "../../assets/images/m_edit.png";
import m_add from "../../assets/images/m_add.png";
import m_delete from "../../assets/images/m_del.png";
import m_display from "../../assets/images/m_display.png";
import { ArrowDropDown, ArrowDropUp, ArrowUpward, CheckBox, Remove } from '@mui/icons-material';
import { dynamicReportParameterTypeOptions } from '../../functions/DynamicReport';

const initialValues: LSS_T_DYNAMIC_REPORT = {
    ENABLE: "Y",
    FIELDS: [],
    ID: 0,
    PARAMETERS: [],
    QUERY: null,
    REPORT_NAME: ""
}

const initialFieldValues: LSS_T_DR_FIELD = {
    DISPLAY_NAME: "",
    DR_ID: 0,
    ID: 0,
    NAME: "",
    SEQ: null,
}

const initialParameterValues: LSS_T_DR_PARAMETER = {
    DISPLAY_NAME: "",
    DR_ID: 0,
    ID: 0,
    NAME: "",
    SEQ: null,
    IS_REQUIRE: "N",
    TYPE_CODE: null
}

const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: "btn btn-success mx-2",
        cancelButton: "btn btn-danger  mx-2",
    },
    buttonsStyling: false,
});

const parmTypeOptions = [...dynamicReportParameterTypeOptions]

const LssITA70ListModal: FC<{
    isOpen: boolean,
    mode: "EDIT" | "VIEW" | "NEW",
    rdID: number
    onClose(): void;
}> = ({ rdID, mode, isOpen, onClose }) => {
    const [tempData, setTempData] = useState<LSS_T_DYNAMIC_REPORT>({})
    const [isBusy, setIsBusy] = useState<boolean>(false);
    const isViewOnly = mode === "VIEW";

    const formik = useFormik({
        validationSchema: yup.object().shape(
            mode !== "VIEW"
                ? {
                    REPORT_NAME: yup.string().nullable().required("กรุณากรอกชื่อรายงาน"),
                    QUERY: yup.string().nullable().required("กรุณากรอก Query"),
                    FIELDS: yup.array().of(yup.object().shape({
                        NAME: yup.string().nullable().required("กรุณากรอกชื่อ"),
                        DISPLAY_NAME: yup.string().nullable().required("กรุณากรอกชื่อแสดง"),
                    })),
                    PARAMETERS: yup.array().of(yup.object().shape({
                        NAME: yup.string().nullable().required("กรุณากรอกชื่อ"),
                        DISPLAY_NAME: yup.string().nullable().required("กรุณากรอกชื่อแสดง"),
                        TYPE_CODE: yup.string().nullable().required("กรุณาเลือกประเภท"),
                    })),
                }
                : {}
        ),
        validateOnBlur: false,
        initialValues,
        enableReinitialize: true,
        onSubmit: (data: LSS_T_DYNAMIC_REPORT) => {
            data = { ...tempData, ...data }
            data.FIELDS = data.FIELDS?.map((x, i) => ({ ...x, SEQ: i + 1 }))
            data.PARAMETERS = data.PARAMETERS?.map((x, i) => ({ ...x, SEQ: i + 1 }))

            if (mode === "EDIT") {
                setIsBusy(true);
                LssITA70Edit(data)
                    .then((status) => {
                        setIsBusy(false);
                        Swal.fire({
                            icon: "success",
                            text: "บันทึกข้อมูลเรียบร้อยแล้ว",
                        }).then(() => {
                            onClose();
                        });
                    })
                    .catch((err) => {
                        setIsBusy(false);
                        const { data } = err;
                        if (data && err.status === 400) {
                            for (let key in data as Record<string, any>) {
                                setFieldError(key, data[key][0]);
                            }

                            Swal.fire({
                                icon: "error",
                                text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบความถูกต้องของข้อมูล!",
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                text: "ไม่สามารถบันทึกข้อมูลได้!",
                            });
                        }
                    });
            } else if (mode == "NEW") {
                data.FIELDS = data.FIELDS?.map((x, i) => ({ ...x, SEQ: i + 1 }))
                data.PARAMETERS = data.PARAMETERS?.map((x, i) => ({ ...x, SEQ: i + 1 }))
                setIsBusy(true);
                LssITA70Save(data)
                    .then((status) => {
                        setIsBusy(false);
                        Swal.fire({
                            icon: "success",
                            text: "บันทึกข้อมูลเรียบร้อยแล้ว",
                        }).then(() => {
                            onClose();
                        });
                    })
                    .catch((err) => {
                        setIsBusy(false);
                        const { data } = err;
                        if (data && err.status === 400) {
                            for (let key in data as Record<string, any>) {
                                setFieldError(key, data[key][0]);
                            }

                            Swal.fire({
                                icon: "error",
                                text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบความถูกต้องของข้อมูล!",
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                text: "ไม่สามารถบันทึกข้อมูลได้!",
                            });
                        }
                    });
            }
        },
    });

    const {
        handleSubmit,
        handleChange,
        errors,
        values,
        setErrors,
        setValues,
        setFieldValue,
        setFieldError,
        resetForm,
    } = formik;

    const fieldErrors = (errors.FIELDS as any || []) as Array<any>
    const parameterErrors = (errors.PARAMETERS as any || []) as Array<any>

    const close = () => {
        if (onClose) onClose()
    }

    const loadData = (id: number) => {
        LssITA70Get(id).then((data) => {
            setValues(data)
        })
    }

    useEffect(() => {
        if (isOpen) {
            if (mode === "NEW") {
                setTempData(initialValues);
                resetForm()
            } else if (mode == "EDIT" || mode == "VIEW") {
                loadData(rdID)
            }
        } else {
            setTempData(initialValues);
            resetForm()
        }
    }, [isOpen])

    const title = mode == "EDIT" ? "แก้ไขข้อมูล" : mode == "VIEW" ? "แสดงข้อมูล" : "เพิ่มข้อมูล";
    const titleIcon = mode == "EDIT" ? m_edit : mode == "VIEW" ? m_display : m_add;

    return (
        <Fragment>
            <Modal
                size="xl"
                show={isOpen}
                onHide={() => close()}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                backdrop="static"
            >
                <FormikProvider value={formik}>
                    <Form noValidate onSubmit={handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title id="example-custom-modal-styling-title">
                                <img
                                    className="align-self-center"
                                    src={titleIcon}
                                    alt="แก้ไขข้อมูล"
                                    style={{ width: "30px", height: "30px" }}
                                />
                                {title}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FormGroup as={Row} className="align-items-center mt-2">
                                <FormLabel className="col-md-2 mb-0">ชื่อรายงาน</FormLabel>
                                <Col md="10">
                                    <Form.Control
                                        name="REPORT_NAME"
                                        disabled={mode === "VIEW"}
                                        value={values.REPORT_NAME || ""}
                                        onChange={handleChange}
                                        isInvalid={!!errors.REPORT_NAME}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.REPORT_NAME}
                                    </Form.Control.Feedback>
                                </Col>
                            </FormGroup>
                            <FormGroup as={Row} className="align-items-center mt-2">
                                <FormLabel className="col-md-2 mb-0">Query</FormLabel>
                                <Col md="10">
                                    <Form.Control
                                        name="QUERY"
                                        as={"textarea"}
                                        rows={5}
                                        disabled={mode === "VIEW"}
                                        value={values.QUERY || ""}
                                        onChange={handleChange}
                                        isInvalid={!!errors.QUERY}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.QUERY}
                                    </Form.Control.Feedback>
                                </Col>
                            </FormGroup>
                            <FormGroup as={Row} className="align-items-center mt-2">
                                <FormLabel className="col-md-2 mb-0">สถานะการใช้งาน</FormLabel>
                                <Col md="10">
                                    <Radio.Group
                                        name="ENABLE"
                                        disabled={mode === "VIEW"}
                                        value={values.ENABLE}
                                        onChange={(e) => {
                                            setFieldValue("ENABLE", e.target.value)
                                        }}
                                    >
                                        <Radio value="Y">ใช้งาน</Radio>
                                        <Radio value="N">ไม่ใช้งาน</Radio>
                                    </Radio.Group>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.ENABLE}
                                    </Form.Control.Feedback>
                                    {/* <Field name="ENABLE" onChange={handleChange}
                                    render={({ field }: any) => (<Fragment>
                                        
                                    </Fragment>)}
                                    /> */}
                                </Col>
                            </FormGroup>
                            <Row className='mt-4'>
                                <Col xs={12}>
                                    <Tabs
                                        defaultActiveKey="field"
                                        id="uncontrolled-tab-example"
                                        className="mb-3"
                                    >
                                        <Tab eventKey="field" title="Fields">
                                            <FieldArray
                                                name='FIELDS'
                                                render={arrayHelpers => (
                                                    <Fragment>
                                                        <div>
                                                            <Button variant='primary' disabled={isViewOnly} onClick={() => arrayHelpers.insert(values.FIELDS?.length || 0, initialFieldValues)}>เพิ่ม Field</Button>
                                                        </div>
                                                        <div className='mt-4'>
                                                            {(values.FIELDS || []).map((item, index) => (
                                                                <div className='mt-3' key={index}>
                                                                    <span style={{ fontWeight: 600 }}>รายการที่ {index + 1}</span>
                                                                    <Row>
                                                                        <Col>
                                                                            <Row>
                                                                                <input type="hidden" name={`FIELDS.${index}.ID`} />
                                                                                <Col xs={6}>
                                                                                    <FormGroup>
                                                                                        <FormLabel>ชื่อ Field</FormLabel>
                                                                                        <Form.Control
                                                                                            name={`FIELDS.${index}.NAME`}
                                                                                            disabled={mode === "VIEW"}
                                                                                            value={values.FIELDS?.[index]?.NAME || ""}
                                                                                            onChange={handleChange}
                                                                                            isInvalid={!!fieldErrors?.[index]?.NAME}
                                                                                        />
                                                                                        <Form.Control.Feedback type="invalid">
                                                                                            {fieldErrors?.[index]?.NAME}
                                                                                        </Form.Control.Feedback>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col xs={6}>
                                                                                    <FormGroup>
                                                                                        <FormLabel>ชื่อแสดง</FormLabel>
                                                                                        <Form.Control
                                                                                            name={`FIELDS.${index}.DISPLAY_NAME`}
                                                                                            disabled={mode === "VIEW"}
                                                                                            value={values.FIELDS?.[index]?.DISPLAY_NAME || ""}
                                                                                            onChange={handleChange}
                                                                                            isInvalid={!!fieldErrors?.[index]?.DISPLAY_NAME}
                                                                                        />
                                                                                        <Form.Control.Feedback type="invalid">
                                                                                            {fieldErrors?.[index]?.DISPLAY_NAME}
                                                                                        </Form.Control.Feedback>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                            </Row>
                                                                        </Col>
                                                                        <Col xs="auto" className='d-flex align-items-end'>
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className='d-flex flex-column'>
                                                                                    <Button size='sm' disabled={index === 0 || isViewOnly} className='p-0 border-0' variant='contained' onClick={() => arrayHelpers.swap(index - 1, index)}><ArrowDropUp /></Button>
                                                                                    <Button size='sm' disabled={index === (values.FIELDS?.length || 0) - 1 || isViewOnly} className='p-0 border-0' variant='contained' onClick={() => arrayHelpers.swap(index, index + 1)}><ArrowDropDown /></Button>
                                                                                </div>
                                                                                <div style={{ marginLeft: ".5rem" }}>
                                                                                    <Button className='p-0 border-0' variant='contained' disabled={isViewOnly}
                                                                                        onClick={() => {
                                                                                            swalWithBootstrapButtons
                                                                                                .fire({
                                                                                                    title: "การลบข้อมูล",
                                                                                                    text: "ยืนยันการลบข้อมูล",
                                                                                                    icon: "warning",
                                                                                                    showCancelButton: true,
                                                                                                    confirmButtonText: "ยืนยันการลบ!",
                                                                                                    cancelButtonText: "ออก!",
                                                                                                    reverseButtons: true,
                                                                                                }).then((result) => {
                                                                                                    if (result.isConfirmed) {
                                                                                                        arrayHelpers.remove(index);
                                                                                                    }
                                                                                                })
                                                                                        }}
                                                                                    >
                                                                                        <img
                                                                                            className="align-self-center"
                                                                                            src={m_delete}
                                                                                            alt="ลบข้อมูล"
                                                                                            style={{ width: "30px", height: "30px", cursor: "pointer" }}
                                                                                        />
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            ))}
                                                        </div>

                                                    </Fragment>
                                                )} />
                                        </Tab>
                                        <Tab eventKey="parameter" title="Parameters">
                                            <FieldArray
                                                name='PARAMETERS'
                                                render={arrayHelpers => (
                                                    <Fragment>
                                                        <div>
                                                            <Button disabled={isViewOnly} variant='primary' onClick={() => arrayHelpers.insert(values.PARAMETERS?.length || 0, initialParameterValues)}>เพิ่ม Parameter</Button>
                                                        </div>
                                                        <div className='mt-4'>
                                                            {(values.PARAMETERS || []).map((item, index) => (
                                                                <div className='mt-3' key={index}>
                                                                    <span style={{ fontWeight: 600 }}>รายการที่ {index + 1}</span>
                                                                    <Row>
                                                                        <Col>
                                                                            <Row>
                                                                                <input type="hidden" name={`PARAMETERS.${index}.ID`} />
                                                                                <Col sm={6}>
                                                                                    <FormGroup>
                                                                                        <FormLabel>ชื่อ Parameter</FormLabel>
                                                                                        <Form.Control
                                                                                            name={`PARAMETERS.${index}.NAME`}
                                                                                            disabled={mode === "VIEW"}
                                                                                            value={values.PARAMETERS?.[index]?.NAME || ""}
                                                                                            onChange={handleChange}
                                                                                            isInvalid={!!parameterErrors?.[index]?.NAME}
                                                                                        />
                                                                                        <Form.Control.Feedback type="invalid">
                                                                                            {parameterErrors?.[index]?.NAME}
                                                                                        </Form.Control.Feedback>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col sm={6}>
                                                                                    <FormGroup>
                                                                                        <FormLabel>ชื่อแสดง</FormLabel>
                                                                                        <Form.Control
                                                                                            name={`PARAMETERS.${index}.DISPLAY_NAME`}
                                                                                            disabled={mode === "VIEW"}
                                                                                            value={values.PARAMETERS?.[index]?.DISPLAY_NAME || ""}
                                                                                            onChange={handleChange}
                                                                                            isInvalid={!!parameterErrors?.[index]?.DISPLAY_NAME}
                                                                                        />
                                                                                        <Form.Control.Feedback type="invalid">
                                                                                            {parameterErrors?.[index]?.DISPLAY_NAME}
                                                                                        </Form.Control.Feedback>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col sm={6}>
                                                                                    <FormGroup>
                                                                                        <FormLabel>ประเภท</FormLabel>
                                                                                        <Form.Control
                                                                                            name={`PARAMETERS.${index}.TYPE_CODE`}
                                                                                            as={"select"}
                                                                                            disabled={mode === "VIEW"}
                                                                                            value={values.PARAMETERS?.[index]?.TYPE_CODE || ""}
                                                                                            onChange={handleChange}
                                                                                            isInvalid={!!parameterErrors?.[index]?.TYPE_CODE}
                                                                                        >
                                                                                            <option value=""></option>
                                                                                            {
                                                                                                parmTypeOptions.map(x => <option key={x.value} value={x.value}>{x.label}</option>)
                                                                                            }
                                                                                        </Form.Control>
                                                                                        <Form.Control.Feedback type="invalid">
                                                                                            {parameterErrors?.[index]?.TYPE_CODE}
                                                                                        </Form.Control.Feedback>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col sm={6}>
                                                                                    <FormGroup>
                                                                                        <FormLabel></FormLabel>
                                                                                        <Form.Check
                                                                                            name={`PARAMETERS.${index}.IS_REQUIRE`}
                                                                                            disabled={mode === "VIEW"}
                                                                                            checked={values.PARAMETERS?.[index]?.IS_REQUIRE === "Y"}
                                                                                            onChange={(e) => {
                                                                                                setFieldValue(`PARAMETERS.${index}.IS_REQUIRE`, e.target.checked ? "Y" : "N")
                                                                                            }}
                                                                                            isInvalid={!!parameterErrors?.[index]?.IS_REQUIRE}
                                                                                            label="จำเป็นต้องระบุ"
                                                                                        />
                                                                                        <Form.Control.Feedback type="invalid">
                                                                                            {parameterErrors?.[index]?.IS_REQUIRE}
                                                                                        </Form.Control.Feedback>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                            </Row>
                                                                        </Col>
                                                                        <Col xs="auto" className='d-flex align-items-end'>
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className='d-flex flex-column'>
                                                                                    <Button size='sm' disabled={index === 0 || isViewOnly} className='p-0 border-0' variant='contained' onClick={() => arrayHelpers.swap(index - 1, index)}><ArrowDropUp /></Button>
                                                                                    <Button size='sm' disabled={index === (values.PARAMETERS?.length || 0) - 1 || isViewOnly} className='p-0 border-0' variant='contained' onClick={() => arrayHelpers.swap(index, index + 1)}><ArrowDropDown /></Button>
                                                                                </div>
                                                                                <div style={{ marginLeft: ".5rem" }}>
                                                                                    <Button className='p-0 border-0' variant='contained' disabled={isViewOnly}
                                                                                        onClick={() => {
                                                                                            swalWithBootstrapButtons
                                                                                                .fire({
                                                                                                    title: "การลบข้อมูล",
                                                                                                    text: "ยืนยันการลบข้อมูล",
                                                                                                    icon: "warning",
                                                                                                    showCancelButton: true,
                                                                                                    confirmButtonText: "ยืนยันการลบ!",
                                                                                                    cancelButtonText: "ออก!",
                                                                                                    reverseButtons: true,
                                                                                                }).then((result) => {
                                                                                                    if (result.isConfirmed) {
                                                                                                        arrayHelpers.remove(index);
                                                                                                    }
                                                                                                })
                                                                                        }}
                                                                                    >
                                                                                        <img
                                                                                            className="align-self-center"
                                                                                            src={m_delete}
                                                                                            alt="ลบข้อมูล"
                                                                                            style={{ width: "30px", height: "30px", cursor: "pointer" }}
                                                                                        />
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            ))}
                                                        </div>

                                                    </Fragment>
                                                )} />
                                        </Tab>
                                    </Tabs>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer className="d-flex justify-content-center">
                            {mode === "VIEW" ? null : (
                                <Button className="mt-2" type="submit" variant="primary">
                                    บันทึก
                                </Button>
                            )}
                            <Button className="mt-2" variant="danger" onClick={close}>
                                ยกเลิก
                            </Button>
                        </Modal.Footer>
                    </Form>
                </FormikProvider>
            </Modal>
        </Fragment>
    )
}

export default LssITA70ListModal