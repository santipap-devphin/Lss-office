import {
  faCheckCircle,
  faExclamationCircle,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseISO } from "date-fns";
import { FC, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import useCallbackRef from "../../hooks/useCallbackRef";
import { ConcurrencyError } from "../../models/office/ConcurrencyError.model";
import { requestUnlock } from "../../data";
import Swal from "sweetalert2";

const ConcurrencyModal: FC<{
  error: ConcurrencyError | null;
  show: boolean;
  onClose(): void;
}> = ({ error, show, onClose }) => {
  const onCloseRef = useCallbackRef(onClose);
  const {
    values,
    errors,
    setFieldError,
    resetForm,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      username: "",
    },
    validationSchema: yup.object().shape({
      username: yup
        .string()
        .required("กรุณาระบุ 'ชื่อผู้ใช้' ของคุณ"),
    }),
    onSubmit: (values) => {
      requestUnlock(values.username)
        .then(() => {
          Swal.fire({
            icon: "success",
            text: `ระบบได้ทำการส่งคำขอปลดล็อคการเข้าสู่ระบบไปที่อีเมลของคุณแล้ว กรุณาตรวจสอบอีเมลของคุณ`,
            confirmButtonText: "ตกลง",
          }).then(() => {
            setShowRequestModal(false);
            onClose();
          });
        })
        .catch((err) => {
          if (err?.status === 400) {
            const { data } = err;
            for (let key in data) {
              const message = Array.from(data[key]).at(0) as string;
              setFieldError(key.toLowerCase(), message);
            }
            Swal.fire({
              icon: "warning",
              text: "กรุณาตรวจสอบข้อมูลให้ถูกต้อง",
              confirmButtonText: "ตกลง",
            });
          } else if (err?.status === 409) {
            const { data } = err;
            Swal.fire({
              icon: "info",
              text: data,
              confirmButtonText: "เข้าสู่ระบบ",
            }).then(() => {
              setShowRequestModal(false);
              onClose();
            });
          } else {
            Swal.fire({
              icon: "error",
              text: "Unexpected Error!",
              confirmButtonText: "ตกลง",
            });
          }
        });
    },
  });
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);

  const handleRequestUnlock = () => {
    setShowRequestModal(true);
  };

  return (
    <Modal backdrop="static" centered show={show} onHide={onCloseRef.current}>
      <Modal.Body>
        <h6 className="fw-bolder mb-4">ไม่สามารถเข้าสู่ระบบได้</h6>
        <p className="ms-5 text-danger">
          <FontAwesomeIcon icon={faExclamationCircle} className="text-danger" />
          &nbsp;ไม่สามารถเข้าสู่ระบบได้ เนื่องจากผู้ใช้เข้างานระบบอยู่แล้ว!
        </p>
        <p className="ms-5">
          <>
            กรุณาระบุลองใหม่ในวันที่ :{" "}
            {parseISO(error?.EXPIRES_DATE as string).toLocaleTimeString(
              "th-TH",
              {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }
            )}
          </>
        </p>
        <div className="d-flex pt-4 justify-content-center gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={handleRequestUnlock}
            size="sm"
          >
            <FontAwesomeIcon icon={faLockOpen} className="text-light" />
            &nbsp; ขอปลดล็อค
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onCloseRef.current}
            size="sm"
          >
            <FontAwesomeIcon icon={faCheckCircle} className="text-light" />
            &nbsp; ออก
          </Button>
        </div>
      </Modal.Body>
      <Modal
        backdrop="static"
        centered
        show={showRequestModal}
        onShow={() => {
          resetForm();
        }}
        onHide={() => {
          setShowRequestModal(false);
        }}
      >
        <Form noValidate onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <FontAwesomeIcon className="text-primary" icon={faLockOpen} />
            &nbsp;ขอปลดล็อคการเข้าสู่ระบบ
          </Modal.Header>
          <Modal.Body>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4">
                ชื่อผู้ใช้:
              </Form.Label>
              <Col>
                <Form.Control
                  size="sm"
                  type="text"
                  name="username"
                  value={values.username}
                  onInput={handleChange}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="primary" size="sm">
              <FontAwesomeIcon icon={faCheckCircle} className="text-light" />
              &nbsp; ส่งคำขอ
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                setShowRequestModal(false);
              }}
              size="sm"
            >
              <FontAwesomeIcon icon={faCheckCircle} className="text-light" />
              &nbsp; ยกเลิก
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Modal>
  );
};

export default ConcurrencyModal;
