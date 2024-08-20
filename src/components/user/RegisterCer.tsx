import { ChangeEvent } from "react";
import { useState, useEffect, useRef } from "react";
import { Card, Col, Form, Row, Button, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import NavMenu from "../fragments/NavMenu";
import { getCertificate, uploadfiles } from "../../data";

type schema = {
  CODE: string;
  COMPANY_CODE: string;
  ISSUER: string;
  NOT_AFTER: string;
  NOT_BEFORE: string;
  SERIAL_NUMBER: string;
  SIGNATURE_ALGORITHM: string;
  STATUS: string;
  SUBJECT: string;
  THUMB_PRINT: string;
  VERSION: string;
  UPDATED_DATE: string;
};

export default function RegisterCer() {
  const [schema, setSchema] = useState<schema[]>([]);
  let navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [, setSelectedFile] = useState<File | null | undefined>(null);
  const [, setIsSelected] = useState(true);

  const form = useRef(null);

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.item(0));
    setIsSelected(true);
  };

  const handleSubmission = () => {
    const formData = new FormData(/*form?.current*/);
    // uploadfiles(formData)
    uploadfiles(formData)
      .then((res) => {
        Swal.fire(
          "ลงทะเบียนใบรับรองอิเล็กทรอกนิกส์สำเร็จ",
          "กรุณาเช็คอีเมลของคุณ",
          "success"
        ).then(() => {
          navigate("/RegisterCer");
          setCount(count + 1);
        });
      })
      .catch((err) => {
        if (err.status === 500) {
          Swal.fire(
            "ประเภทของไฟล์ใบรับรอง ต้องเป็นนามสกุล .CER เท่านั้น",
            `โปรดตรวจสอบไฟล์อีกครั้ง!!`,
            "warning"
          );
          throw Error(`กรุณาเลือกไฟล์ใหม่ `);
        }
        if (err.status === 501) {
          Swal.fire(
            "มีการลงทะเบียนใบรับรองไปแล้ว",
            `โปรดตรวจสอบไฟล์อีกครั้ง!!`,
            "warning"
          );
          throw Error(`กรุณาเลือกไฟล์ใหม่ `);
        }
        if (err.status === 400) {
        }
      });
  };
  const ChengDate = (Dates: String) => {
    if (Dates !== undefined && Dates !== ' ') {
          var parts = Dates.split("/");
          var calyear = Number.parseInt(parts[2]) + 543;
          return parts[0] + "/" + parts[1] + "/" + calyear;
    }else{
        return "";
    }
  }
  useEffect(() => {
    getCertificate("1").then((data) => {
      let tmpSchema: schema[] = [];
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          CODE: data[i].CODE,
          COMPANY_CODE: data[i].COMPANY_CODE,
          ISSUER: data[i].ISSUER,
          NOT_AFTER: ChengDate(moment(data[i].NOT_AFTER).format("DD/MM/YYYY")),
          NOT_BEFORE: ChengDate(moment(data[i].NOT_BEFORE).format("DD/MM/YYYY")),
          SERIAL_NUMBER: data[i].SERIAL_NUMBER,
          SIGNATURE_ALGORITHM: data[i].SIGNATURE_ALGORITHM,
          STATUS: data[i].STATUS,
          SUBJECT: data[i].SUBJECT,
          THUMB_PRINT: data[i].THUMB_PRINT,
          VERSION: data[i].VERSION,
          UPDATED_DATE: ChengDate(moment(data[i].UPDATED_DATE).format("DD/MM/YYYY")),
        });
      }
      setSchema(tmpSchema);
    });
  }, [count]);

  return (
    <div>
      <NavMenu />
      <div style={{ width: "100%", marginTop: 100 }}>
        <h5>Title : LSS-EA-080 ลงทะเบียนใบรับรองอิเล็กทรอนิกส์</h5>
        <Form ref={form} onSubmit={handleSubmission}>
          <Card>
            {/* <Card.Header>ลงทะเบียนใบรับรองอิเล็กทรอนิกส์</Card.Header> */}
            <Card.Body>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  เลือกใบรับรองอิเล็กทรอกนิกส์
                </Form.Label>
                <Col sm="4">
                  <Form.Control
                    type="file"
                    name="file"
                    onChange={changeHandler}
                  />
                </Col>
                <Col sm="5"></Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2"></Form.Label>
                <Col sm="10">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSubmission}
                  >
                    บันทึก
                  </Button>{" "}
                  <Button variant="light" size="sm">
                    ยกเลิก
                  </Button>{" "}
                </Col>
              </Form.Group>
              <Table bordered className="mt-3">
                <thead>
                  <tr>
                    <th>หมายเลขใบรับรองฯ</th>
                    <th>อัลกอริทึม</th>
                    <th>วันที่หมดอายุ</th>
                    <th>วันสมัคร</th>
                    <th>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {schema.map((ce, i) => (
                    <tr key={ce?.CODE}>
                      <td>{ce?.SERIAL_NUMBER}</td>
                      <td>{ce?.SIGNATURE_ALGORITHM}</td>
                      <td>{ce?.NOT_BEFORE}</td>
                      <td>{ce?.UPDATED_DATE}</td>
                      <td>{ce?.STATUS}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Form>
      </div>
    </div>
  );
}
