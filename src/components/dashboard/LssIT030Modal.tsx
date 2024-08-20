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
    LSSIP020SearchMail,
} from "../../data";

import { useAppContext } from "../../providers/AppProvider";
import { useDataContext } from "../../providers/DataProvider";

const LssIT030Modal: FC<{
    CODE: any;
    ACTIONCLICK: any;
    onModal: any;
    showBtn: any;
    showReadOnly: any;
}> = (CODE, ACTIONCLICK) => {
    const { logout } = useAppContext();
    const { clearData } = useDataContext();
    let navigate = useNavigate();
    const handleLogout = () => {
        clearData().then(() => {
            logout();
        });
    };

    const [newData, setNewData] = useState<
    {
      id: any;
      CODE: any;
      SUBJECT: any;
      EMAIL: any;
      DATE: any;
      TYPE: any;
      STATUS: any;
      MESSSAGE: any;
      INFORMATION: any;
      COMPANY_TYPE: any;
      COMPANY_CODE: any;

    }[]
  >([]);

  

    useEffect(() => {
        LSSIP020SearchMail(CODE).then((data: any) => {
            let tmpSchema = [];
            for (let i = 0; i < data.length; i++) {
                var parts = data[i].DATE.split("-");
                var parts2 = parts[2].split("T");
                var calyear = Number.parseInt(parts[0]) + 543;
                var Sumdate = parts2[0] + "/" + parts[1] + "/" + calyear;
              tmpSchema.push({
                id: data[i].CODE,
                CODE: data[i].CODE,
                SUBJECT: data[i].SUBJECT,
                EMAIL: data[i].EMAIL,
                DATE: Sumdate,
                TYPE: data[i].TYPE,
                STATUS: data[i].STATUS,
                MESSSAGE: data[i].MESSSAGE,
                INFORMATION: data[i].INFORMATION,
                COMPANY_TYPE: data[i].COMPANY_TYPE,
                COMPANY_CODE: data[i].COMPANY_CODE,
      
              });
            } //loop i
            setNewData(tmpSchema);
            console.log(tmpSchema);
            //form.setValues(tmpSchema[0]);
          }); //getPayinList
    }, []);

    return (
        <div style={{ width: "100%" }}>
            <Container>
                <Row>
                    <Col>
                            <Row>
                                <Col sm={12} md={6}>
                                    <Form.Group
                                        as={Row}
                                        className="mb-3"
                                    >
                                        <Form.Label column sm="4">
                                        รหัส E-mail : 
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="text"
                                                name="CODE"
                                                value={newData.length > 0 ? newData[0].MESSSAGE : ""}
                                                readOnly={true}
                                            />
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
                                        E-mail To :  
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="text"
                                                name="CODE"
                                                value={newData.length > 0 ? newData[0].EMAIL : ""}
                                                readOnly={true}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Col>
                                <Col sm={12} md={6}>
                                    <Form.Group
                                        as={Row}
                                        className="mb-3"
                                    >
                                        <Form.Label column sm="4">
                                        วันที่ส่ง E-mail  : 
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="text"
                                                name="NAME"
                                                value={newData.length > 0 ? newData[0].DATE : ""}
                                                readOnly={true}
                                            />
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
                                        รายละเอียด : 
        
                                        </Form.Label>
                                        <Col>
                                            <Form.Control
                                                as="textarea"
                                                    rows={6}
                                                name="POSITION"
                                                value={newData.length > 0 ? newData[0].SUBJECT : ""}
                                                readOnly={true}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Col>

                            </Row>
                            <Row className="justify-content-center my-3">
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
                                        ปิด
                                    </Button>
                                </Col>
                            </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LssIT030Modal;
