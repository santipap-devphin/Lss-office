import { useState, useEffect, useCallback } from "react";
import { Card, Col, Modal, Button, Container, Row, Form } from "react-bootstrap";
import { DataGrid, GridColDef, GridValueFormatterParams } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { LSSITA04Load, LSSITA04Load_Dayoff, LssITA04Save, LssITA04DeleteAPI } from "../../data";
import NavMenu from "../fragments/NavMenu";
import { FaBars } from "react-icons/fa";
import Swal from "sweetalert2";
import ObjOpen from "./LssITA04ConfigList";
import "./LssITA04ConfigList.scss";
import { DatePicker, DatePickerProps, TimePicker } from "antd";
import { Moment } from "moment";
import CheckIcon from '@mui/icons-material/Check';
//icon control
import m_edit from "../../assets/images/m_edit.png";
import m_add from "../../assets/images/m_add.png";
import m_delete from "../../assets/images/m_del.png";
import m_display from "../../assets/images/m_display.png";
import moment from "moment";
import * as yup from "yup";
import { toThaiDateString } from "../../functions/Date";
// import TimePicker from 'react-time-picker';

const styles = {
  datpicker: {
    width: "100%",
    height: "100%",
    verticalAlign: "middle",
  },
};

const LssITA04List = () => {
  const [sAction, setSAction] = useState("");
  const [sCode, setSCode] = useState("");
  const [sTitle, setStitle] = useState("");
  const [sTitleIMG, setSTitleIMG] = useState("");
  const [sBtn, setSBtn] = useState("");
  const [sReadOnly, setSReadOnly] = useState(true);
  const [stypelink, setStypelink] = useState("");
  const [WeekEnd, setWeekEnd] = useState("");
  const [holiday, setholiday] = useState("");
  const [startdate, setstartdate] = useState("");
  const [StartTimeOpen, setTo] = useState<Moment | null>(null);
  const [EndTimeClose, setEndTimeClose] = useState<Moment | null>(null);
  const [endtime, setendtime] = useState("Y");

  const [valueS, setvalueS] = useState<Moment | null>(null);
  const [valueE, setvalueE] = useState<Moment | null>(null);

  const format = 'HH:mm';

  const TitleData = {
    Add: "เพิ่มข้อมูล",
    Edit: "แก้ไขข้อมูล",
    Display: "แสดงข้อมูล",
  };

  const onChangeS = useCallback((date: Moment | null) => {
    setvalueS(date);
    form.values.STARTTIME_VALUE = String(date);
  }, []);

  const onChangeE = useCallback((date: Moment | null) => {
    setvalueE(date);
    form.values.ENDTIME_VALUE = String(date);
  }, []);

  const handleToChanged = useCallback((date: Moment | null) => {
    setTo(date);
  }, []);

  const handleEndTimeCloseChanged = useCallback((date: Moment | null) => {
    setEndTimeClose(date);
  }, []);

  const customDateFormat: DatePickerProps["format"] = (date: Moment) => {
    return toThaiDateString(date.toDate(), "DD/MM/YYYY");
  };

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const columns: GridColDef[] = [
    {
      field: "col10",
      headerName: "ลบ",
      minWidth: 80,
      align: "center", 
      headerAlign: "center",
      renderCell: (params1: any) => {
        return (
          <>
            <img
              className="align-self-center"
              src={m_delete}
              alt="ลบข้อมูล"
              onClick={BtnAction(params1.id, "Delete")}
              style={{ width: "30px", height: "30px", cursor: "pointer" }}
            />
          </>
        );
      },
    },
    {
      field: "col11",
      headerName: "แก้ไข",
      minWidth: 80,
      align: "center", 
      headerAlign: "center",
      renderCell: (params2: any) => {
        return (
          <>
            <img
              className="align-self-center"
              src={m_edit}
              alt="แก้ไขข้อมูล"
              onClick={BtnAction(params2.id, "Edit")}
              style={{ width: "30px", height: "30px", cursor: "pointer" }}
            />
          </>
        );
      },
    },
    {
      field: "col12",
      headerName: "แสดง",
      minWidth: 80,
      align: "center", 
      headerAlign: "center",
      renderCell: (params3: any) => {
        return (
          <>
            <img
              className="align-self-center"
              src={m_display}
              alt="แสดงข้อมูล"
              onClick={BtnAction(params3.id, "Display")}
              style={{ width: "30px", height: "30px", cursor: "pointer" }}
            />
          </>
        );
      },
    },
    {
      field: "DATE",
      headerName: "วันที่",
      minWidth: 250,
      align: "center", 
      headerAlign: "center",
      headerClassName: "headgrid",
      valueFormatter: (params: GridValueFormatterParams<any>) => {
        console.log("วันที่--->");
        console.log(params.value);
        var parts = params.value.split("/");
        console.log(parts[2]);
        var calyear = Number.parseInt(parts[2]) + 543;
        var mydate = parts[0] + '/' + parts[1] + '/' + calyear;
        return mydate;
      },
    },
    {
      field: "NAME",
      headerName: "ชื่อวันหยุด",
      minWidth: 640,
      align: "left", 
      headerAlign: "center",
      headerClassName: "headgrid",
    },

    {
      field: "ENABLE",
      headerName: "สถานะ",
      minWidth: 125,
      align: "center", 
      headerAlign: "center",
      renderCell: (params2: any) => {
        let eb = "";
        if (params2.row.ENABLE === "Y") { eb = "ใช้งาน" } else { eb = `ไม่ใช้งาน` }
        return (
          <>
            <span className="fontHilight">{eb}</span>
          </>
        );
      },
    },
  ];

  const BtnAction = useCallback(
    (id: string, sAction: string) => () => {
      if (sAction === "Delete") {
        swalWithBootstrapButtons
          .fire({
            title: "การลบข้อมูล",
            text: "ยืนยันการลบข้อมูล",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ยืนยันการลบ!",
            cancelButtonText: "ออก!",
            reverseButtons: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
              setSCode(id);
              let flagReturn = RemoveData(id);
              //console.log(flagReturn);
              swalWithBootstrapButtons.fire(
                "ดำเนินการลบ",
                "ระบบได้ดำเนินการลบเรียบร้อย.",
                "success"
              );
            } else if (
              result.dismiss === Swal.DismissReason.cancel
            ) {
            }
          });
      } else {
        if (sAction === "Add") {
          setSBtn("block");
          setSReadOnly(false);
          setStitle(TitleData.Add);
          setSTitleIMG(m_add);
        }
        if (sAction === "Edit") {
          setSBtn("block");
          setSReadOnly(false);
          setStitle(TitleData.Edit);
          setSTitleIMG(m_edit);
        }
        if (sAction === "Display") {
          setSBtn("none");
          setSReadOnly(true);
          setStitle(TitleData.Display);
          setSTitleIMG(m_display);
        }
        setSCode(id);
        setSAction(sAction);
        setShow(true);
      }
    },
    []
  );

  const RemoveData = (_code: string) => {
    if (_code !== "") {
      var para = JSON.parse(`{"CODE":"${_code}"}`);
      LssITA04DeleteAPI(para).then((data: any) => {
        fnLoad();
        return "succ";
      });
    }
  };

  const fetchData = useCallback(async () => {
    LSSITA04Load().then((data: any) => {
       console.log(data);
      if (data.length > 0) {
        if (data[0].SYSTEMLOGIN !== null && data[0].SYSTEMLOGIN !== "") {
          setStypelink(data[0].SYSTEMLOGIN);
          form.values.SYSTEMLOGIN = data[0].SYSTEMLOGIN;
        }
        if (data[0].WEEKEND !== null && data[0].WEEKEND !== "") {
          setWeekEnd(data[0].WEEKEND);
          form.values.WEEKEND = data[0].WEEKEND;
        }
        if (data[0].HOLIDAY !== null && data[0].HOLIDAY !== "") {
          setholiday(data[0].HOLIDAY);
          form.values.HOLIDAY = data[0].HOLIDAY;
        }
        if (data[0].STARTTIME !== null && data[0].STARTTIME !== "") {
          setstartdate(data[0].STARTTIME);
          form.values.STARTTIME = data[0].STARTTIME;
        }
        if (data[0].ENDTIME !== null && data[0].ENDTIME !== "") {
          setendtime(data[0].ENDTIME);
          form.values.ENDTIME = data[0].ENDTIME;
        }
        if (data[0].STARTTIME_VALUE !== null && data[0].STARTTIME_VALUE !== "") {
          onChangeS(moment(data[0].STARTTIME_VALUE, 'HH:mm'));
        }
        if (data[0].ENDTIME_VALUE !== null && data[0].ENDTIME_VALUE !== "") {
          onChangeE(moment(data[0].ENDTIME_VALUE, 'HH:mm'));
        }
        form.setValues({
          SYSTEMLOGIN: data[0].SYSTEMLOGIN,
          WEEKEND: data[0].WEEKEND,
          HOLIDAY: data[0].HOLIDAY,
          STARTTIME: data[0].STARTTIME,
          ENDTIME: data[0].ENDTIME,
          STARTTIME_VALUE: data[0].STARTTIME_VALUE,
          ENDTIME_VALUE: data[0].ENDTIME_VALUE,
        });
        //console.log('Input value in From');
        //console.log(form);
      }
      //console.log(stypelink + " | " + WeekEnd);
    });
  }, []);

  const fnLoad = useCallback(async () => {
    LSSITA04Load_Dayoff().then((data) => {
      //console.log(data);
      let tmpSchema = [];
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: data[i].CODE,
          DATE: moment(data[i].DATE).format("DD/MM/YYYY"),
          NAME: data[i].DF_NAME,
          ENABLE: data[i].ENABLE,
        });
      }
      setTableData(tmpSchema);
    });
  }, []);

  const [tableData, setTableData] = useState<
    {
      id: any;
      DATE: any;
      NAME: any;
      ENABLE: any;
    }[]
  >([]);

  const [ValueData, setVlaueData] = useState<
    {
      SYSTEMLOGIN: any;
      WEEKEND: any;
      HOLIDAY: any;
      STARTTIME: any;
      ENDTIME: any;
      STARTTIME_VALUE: any;
      ENDTIME_VALUE: any;
    }[]
  >([]);

  useEffect(() => {
    fetchData();
    fnLoad();
  }, []);

  const [show, setShow] = useState(false);

  const fnModal = (flag: any) => {
    setShow(flag);
  };

  const initValue = {
    SYSTEMLOGIN: "",
    WEEKEND: "",
    HOLIDAY: "",
    STARTTIME: "",
    ENDTIME: "",
    STARTTIME_VALUE: "",
    ENDTIME_VALUE: "",
  };

  const form = useFormik({
    // validationSchema: yup.object().shape({
    //   SYSTEMLOGIN: yup.string().nullable(),
    //   WEEKEND: yup.string().nullable(),
    //   HOLIDAY: yup.string().nullable(),
    //   STARTTIME: yup.string().nullable(),
    //   ENDTIME: yup.string().nullable(),
    // }),
    validateOnBlur: false,
    initialValues: initValue,
    enableReinitialize: true,
    onSubmit: (data: Record<string, any>) => {
      console.log('on Submit -->');
      data.SYSTEMLOGIN = stypelink;
      data.WEEKEND = WeekEnd;
      data.HOLIDAY = holiday;
      data.STARTTIME = startdate;
      data.ENDTIME = endtime;
      if(valueS === null){
        data.STARTTIME_VALUE = "";
      }else{
        data.STARTTIME_VALUE = String(moment(valueS).format("HH:mm"));
      }
      if(valueE === null){
        data.ENDTIME_VALUE =  "";
      }else{
        data.ENDTIME_VALUE =  String(moment(valueE).format("HH:mm"));
      }
      
      
      //console.log(data);
      LssITA04Save(data)
        .then((res: any) => {
          Swal.fire("บันทึกข้อมูล", "บันทึกเรียบร้อย", "success");
        })
        .catch((err: any) => {
          // if (err.response.data.status === 404) {
          //   Swal.fire("รหัสไม่ถูกต้อง", "รหัสรหัสคีย์ไม่มีในระบบตรวจสอบการกรอกข้อมูลอีกครั้ง ", "warning");
          // }
          // if (err.status === 400) {
            Swal.fire("แจ้งเตือน", "ตรวจสอบการกรอกข้อมูลอีกครั้ง", "warning");
          // }
        });
    },
  });

  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <NavMenu />
            <Card style={{ marginTop: "7rem" }}>
              <Card.Header>
                LSS-IT-A04 กำหนดวัน เวลา เข้าใช้ระบบงาน
              </Card.Header>
              <Card.Body>
                <Form onSubmit={form.handleSubmit}>
                  <Row>
                    <Col md="12" style={{ paddingTop: "10px" }}>
                      <Col md="6" style={{ display: "flex" }}>
                        <Col xs="6" md="5">แจ้งเตือนการหยุดใช้งานระบบ</Col>
                        <Col xs="12" md="6">
                          <Form.Check
                            inline
                            label="ใช้งาน"
                            name="TYPE_LINK"
                            type="radio"
                            id={`inline-radio-1`}
                            value="on"
                            checked={stypelink === "on"}
                            onChange={(event) => {
                              setStypelink(event.target.value);
                              form.values.SYSTEMLOGIN = event.target.value;
                            }}
                          />
                          <Form.Check
                            inline
                            label="ไม่ใช้งาน"
                            name="TYPE_LINK"
                            type="radio"
                            id={`inline-radio-2`}
                            value="off"
                            checked={stypelink === "off"}
                            onChange={(event) => {
                              setStypelink(event.target.value);
                              form.values.SYSTEMLOGIN = event.target.value;
                            }}
                          />
                        </Col>
                        <Col md="6">
                        </Col>
                      </Col>
                    </Col>
                    <Col md="12" style={{ paddingTop: "10px" }}>
                      <Col md="6" style={{ display: "flex" }}>
                        <Col xs="6" md="5">แจ้งเตือนวันหยุดเสาร์-อาทิตย์</Col>
                        <Col xs="12" md="6">
                          <Form.Check
                            inline
                            label="ใช้งาน"
                            name="WeekEnd"
                            type="radio"
                            id={`inline-radio-1`}
                            value="on"
                            checked={WeekEnd === "on"}
                            onChange={(event) => {
                              setWeekEnd(event.target.value);
                              form.values.WEEKEND = event.target.value;
                            }}
                          />
                          <Form.Check
                            inline
                            label="ไม่ใช้งาน"
                            name="WeekEnd"
                            type="radio"
                            id={`inline-radio-2`}
                            value="off"
                            checked={WeekEnd === "off"}
                            onChange={(event) => {
                              setWeekEnd(event.target.value);
                              form.values.WEEKEND = event.target.value;
                            }}
                          />
                        </Col>
                        <Col md="6">
                        </Col>
                      </Col>
                    </Col>
                    <Col md="12" style={{ paddingTop: "10px" }}>
                      <Col md="6" style={{ display: "flex" }}>
                        <Col xs="6" md="5">แจ้งเตือนวันหยุดนักขัตฤกษ์</Col>
                        <Col xs="12" md="6">
                          <Form.Check
                            inline
                            label="ใช้งาน"
                            name="holiday"
                            type="radio"
                            id={`inline-radio-1`}
                            value="on"
                            checked={holiday === "on"}
                            onChange={(event) => {
                              setholiday(event.target.value);
                              form.values.HOLIDAY = event.target.value;
                            }}
                          />
                          <Form.Check
                            inline
                            label="ไม่ใช้งาน"
                            name="holiday"
                            type="radio"
                            id={`inline-radio-2`}
                            value="off"
                            checked={holiday === "off"}
                            onChange={(event) => {
                              setholiday(event.target.value);
                              form.values.HOLIDAY = event.target.value;
                            }}
                          />
                        </Col>
                        <Col md="6">
                        </Col>
                      </Col>
                    </Col>

                    <Col md="12" style={{ paddingTop: "10px", display: "flex" }}>
                      <Col md="6" style={{ display: "flex" }}>
                        <Col xs="6" md="5">เวลาที่เริ่มใช้งาน</Col>
                        <Col xs="12" md="6">
                          <Form.Check
                            inline
                            label="ใช้งาน"
                            name="startdate"
                            type="radio"
                            id={`inline-radio-1`}
                            value="on"
                            checked={startdate === "on"}
                            onChange={(event) => {
                              setstartdate(event.target.value);
                              form.values.STARTTIME = event.target.value;
                            }}
                          />
                          <Form.Check
                            inline
                            label="ไม่ใช้งาน"
                            name="startdate"
                            type="radio"
                            id={`inline-radio-2`}
                            value="off"
                            checked={startdate === "off"}
                            onChange={(event) => {
                              setstartdate(event.target.value);
                              form.values.STARTTIME = event.target.value;
                            }}
                          />
                        </Col>
                      </Col>
                      <Col md="6" style={{ display: "flex" }}>
                        <Col xs="6" md="5">เวลาเริ่ม</Col>
                        <Col xs="12" md="6">
                          <TimePicker onChange={onChangeS} value={valueS} format={format} />
                        </Col>
                      </Col>
                    </Col>

                    <Col md="12" style={{ paddingTop: "10px", display: "flex" }}>
                      <Col md="6" style={{ display: "flex" }}>
                        <Col xs="6" md="5">เวลาสิ้นสุดการใช้งาน</Col>
                        <Col xs="12" md="6">
                          <Form.Check
                            inline
                            label="ใช้งาน"
                            name="endtime"
                            type="radio"
                            id={`inline-radio-1`}
                            value="on"
                            checked={endtime === "on"}
                            onChange={(event) => {
                              form.values.ENDTIME = event.target.value;
                              setendtime(event.target.value);
                            }}
                          />
                          <Form.Check
                            inline
                            label="ไม่ใช้งาน"
                            name="endtime"
                            type="radio"
                            id={`inline-radio-2`}
                            value="off"
                            checked={endtime === "off"}
                            onChange={(event) => {
                              form.values.ENDTIME = event.target.value;
                              setendtime(event.target.value);
                            }}
                          />
                        </Col>
                      </Col>
                      <Col md="6" style={{ display: "flex" }}>
                        <Col xs="6" md="5">เวลาสิ้นสุด</Col>
                        <Col xs="12" md="6">
                          <TimePicker onChange={onChangeE} value={valueE} format={format} />
                        </Col>
                      </Col>
                    </Col>
                  </Row>
                  <Row style={{ textAlign: "center", marginTop: "1rem" }}>
                    <Col md="12">
                      <Button
                        className="mt-2"
                        disabled={!form.isValid || form.isValidating}
                        type="submit"
                        variant="success"
                      >
                        บันทึก
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
            <Card style={{ marginTop: "0.5rem" }}>
              <Card.Header>

                <Row style={{ display: "flex", flexDirection: "row" }}>
                  <Col md="6" style={{ lineHeight: "45px" }}>
                    ตั้งค่าวันหยุดนักขัตฤกษ์
                  </Col>
                  <Col md="6" style={{ display: "flex", flexDirection: "row" }}>
                    <Col md="6">

                    </Col>
                    <Col md="6" style={{ display: "flex", flexDirection: "row", textAlign: "end" }}>
                      <Col md="6">

                      </Col>
                      <Col md="6" style={{ textAlign: "start" }}>
                        <Button
                          style={{ marginRight: 5, backgroundColor: "#FFF" }}
                          variant="contained"
                          onClick={BtnAction("", "Add")}
                        >
                          <img
                            className="align-self-center"
                            src={m_add}
                            alt="เพิ่มข้อมูล"
                            onClick={BtnAction("", "Add")}
                            style={{ width: "30px", height: "30px", cursor: "pointer" }}
                          />
                          เพิ่มข้อมูลใหม่
                        </Button>
                      </Col>


                    </Col>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <div style={{ height: 500, width: "100%" }}>
                  <div style={{ display: "flex", height: "100%" }}>
                    <div style={{ flexGrow: 1 }}>
                      <DataGrid
                        className=""
                        sx={{
                          fontFamily: "kanit",
                          fontSize: 18,
                          boxShadow: 2,
                        }}
                        rows={tableData}
                        columns={columns}
                      />
                    </div>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer>
                <Modal
                  size="xl"
                  show={show}
                  onHide={() => setShow(false)}
                  dialogClassName="modal-90w"
                  aria-labelledby="example-custom-modal-styling-title"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                      <img
                        className="align-self-center"
                        src={sTitleIMG}
                        alt="แก้ไขข้อมูล"
                        style={{ width: "30px", height: "30px" }}
                      />
                      {sTitle}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <ObjOpen
                      CODE={sCode}
                      ACTIONCLICK={sAction}
                      onFetchData={fnLoad}
                      onModal={fnModal}
                      showBtn={sBtn}
                      showReadOnly={sReadOnly}
                    />
                  </Modal.Body>
                </Modal>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <div style={{ display: "flex", height: "2rem" }}>
          <div style={{ flexGrow: 1 }}></div>
        </div>
      </Container>
    </>
  );
};

export default LssITA04List;

