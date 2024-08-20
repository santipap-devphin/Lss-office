import { useState, useEffect, useCallback } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import { getPayinListAll } from "../../data";
import moment from "moment";
import NavMenu from "../fragments/NavMenu";
import "./Receipt.scss";
import attIcon from "../../assets/images/attachment.png";
import payinIcon from "../../assets/images/payin.png";
import formIcon from "../../assets/images/payment_order.png";
import invoiceIcon from "../../assets/images/printcer.png";
import Swal from "sweetalert2";
export default function LSSRECEIPT() {
  const columns = /*React.useMemo(() =>*/[
    {
      field: "col1",
      headerName: "เลขที่ใบแจ้งหนี้",
      minWidth: 150,
      headerClassName: "headgrid",
    },
    {
      field: "col2",
      headerName: "วันที่ใบแจ้งหนี้",
      minWidth: 140,
      headerClassName: "headgrid",
    },
    {
      field: "CY_NAME",
      headerName: "บริษัท",
      minWidth: 400,
      headerClassName: "headgrid",
    },
    {
      field: "col5",
      headerName: "เงินที่ชำระ",
      minWidth: 125,
      headerClassName: "headgrid",
    },
    {
      field: "col4",
      headerName: "เงินสมทบ",
      minWidth: 125,
      headerClassName: "headgrid",
    },
    {
      field: "col3",
      headerName: "เงินเพิ่ม",
      minWidth: 125,
      headerClassName: "headgrid",
    },
    {
      field: "col6",
      headerName: "สถานะ",
      minWidth: 50,
      headerClassName: "headgrid",
    },
    {
      field: "col7",
      headerName: "เลขที่ใบเสร็จรับเงิน",
      minWidth: 200,
      headerClassName: "headgrid",
    },
    {
      field: "col8",
      headerName: "วันที่ใบเสร็จรับเงิน",
      minWidth: 140,
      headerClassName: "headgrid",
    },
    {
      field: "col9",
      headerName: "สลิปส์",
      minWidth: 70,
      renderCell: (params: any) => {
        return (
          <>
            <a href="#OpenFile">
              <img
                className="iconGrid"
                src={attIcon}
                alt="พิมพ์สลิปส์"
                style={{ width: "30px", height: "30px" }}
                onClick={oPenfile(params, "slip")}
              />
            </a>
          </>
        );
      },
    },
    {
      field: "col10",
      headerName: "ใบแจ้งหนี้",
      minWidth: 50,
      renderCell: (params1: any) => {
        return (
          <>
            <a href="#OpenFile">
              <img
                className="align-self-center"
                src={payinIcon}
                alt="พิมพ์ใบแจ้งหนี้"
                style={{ width: "30px", height: "30px" }}
                onClick={oPenfile(params1, "payin")}
              />{" "}
            </a>
          </>
        );
      },
    },
    {
      field: "col11",
      headerName: "ฟอร์มส่ง",
      minWidth: 50,
      renderCell: (params2: any) => {
        return (
          <>
            <a href="#OpenFile">
              <img
                className="align-self-center"
                src={formIcon}
                alt="พิมพ์ฟอร์มนำส่งเงินสมทบ"
                style={{ width: "30px", height: "30px" }}
                onClick={oPenfile(params2, "form")}
              />
            </a>
          </>
        );
      },
    },
    {
      field: "col12",
      headerName: "ใบเสร็จ",
      minWidth: 50,
      renderCell: (params3: any) => {
        return (
          <>
            <a href="#OpenFile">
              <img
                className="align-self-center"
                src={invoiceIcon}
                alt="พิมพ์ใบเสร็จรับเงิน"
                style={{ width: "30px", height: "30px" }}
                onClick={oPenfile(params3, "invoice")}
              />
            </a>
          </>
        );
      },
    },
  ];
  const oPenfile = useCallback(
    (id: any, type: any) => () => {
      //console.log(type);
      let msg = "";
      if (type === "slip") {
        msg = "เปิดไฟล์สลิปหลักฐานการโอนเงิน";
      }
      if (type === "payin") {
        msg = "เปิดไฟล์ใบแจ้งหนี้ (Pay in)";
      }
      if (type === "form") {
        msg = "เปิดไฟล์ฟอร์มการนำส่งเงินสมทบ";
      }
      if (type === "invoice") {
        msg = "เปิดไฟล์ใบเสร็จรับเงิน";
      }
      Swal.fire(msg, "ID : " + id.id, "warning");
    },
    []
  );

  const [tableData, setTableData] = useState<
    {
      id: any;
      col1: any;
      col2: any;
      col3: any;
      col4: any;
      col5: any;
      col6: any;
      col7: any;
      col8: any;
      CY_NAME: any;
    }[]
  >([]);

  useEffect(() => {
    getPayinListAll().then((data: any) => {
      let tmpSchema = [];
      for (let i = 0; i < data.length; i++) {
        tmpSchema.push({
          id: data[i].CODE,
          col1: data[i].CODE,
          col2: moment(data[i].DATE).format("DD/MM/YYYY"),
          col3: data[i].AMOUNT_FINE,
          col4: data[i].AMOUNT_PAY,
          col5: data[i].AMOUNT_TOTALPAY,
          col6: data[i].PAYMENT_STATUS,
          col7: data[i].RECEIPT_NO,
          col8: data[i].RECEIPT_DATE,
          CY_NAME: data[i].CY_NAME,
        });
      } //loop i
      setTableData(tmpSchema);
    }); //getPayinList
  }, []);

  return (
    <Container fluid>
      <Row>
        {/* Unnamed (Rectangle) */}
        <div id="u0" className="ax_default box_1">
          <div id="u0_div" />
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u1" className="ax_default box_1">
          <div id="u1_div" />
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u2" className="ax_default box_1">
          <div id="u2_div" />
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u3" className="ax_default box_1">
          <div id="u3_div" />
        </div>
        {/* Unnamed (Group) */}
        <div
          id="u4"
          className="ax_default"
          data-left={62}
          data-top={8}
          data-width={688}
          data-height={99}
        >
          {/* Unnamed (Rectangle) */}
          <div id="u5" className="ax_default heading_1">
            <div id="u5_div" />
            <div id="u5_text" className="text ">
              <p>
                <span>
                  สำนักคณะกรรมการกำกับและส่งเสริมการประกอบธุรกิจประกันภัย
                </span>
              </p>
            </div>
          </div>
          {/* Unnamed (Rectangle) */}
          <div id="u6" className="ax_default heading_1">
            <div id="u6_div" />
            <div id="u6_text" className="text ">
              <p>
                <span>Office of Insurance Commission</span>
              </p>
            </div>
          </div>
          {/* Unnamed (Rectangle) */}
          <div id="u7" className="ax_default heading_1">
            <div id="u7_div" />
            <div id="u7_text" className="text ">
              <p>
                <span>www.oic.or.th</span>
              </p>
            </div>
          </div>
          {/* Unnamed (Image) */}
          <div id="u8" className="ax_default image">
            <img id="u8_img" className="img " src="images/home/u8.png" />
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u9" className="ax_default heading_1">
          <div id="u9_div" />
          <div id="u9_text" className="text ">
            <p>
              <span>
                เลขที่ 22/79 ถนนรัชดาภิเษก แขวงจันทรเกษม เขตจตุจักร
                กรุงเทพมหานคร 10900 โทร. 0-2515-3999 โทรสาร. 0-2515-3970
              </span>
            </p>
            <p>
              <span>
                22/79 Ratchadaphisek Rd., Chantharakasem, Chatuchak, Bangkok
                10900 Tel.0-2515-3999 Fax.0-2515-3970
              </span>
            </p>
            <p>
              <span>เลขประจำตัวผู้เสียภาษีอากร/Tax ID : 09940000640927</span>
            </p>
            <p>
              <span>
                <br />
              </span>
            </p>
          </div>
        </div>
        {/* Unnamed (Horizontal Line) */}
        <div id="u10" className="ax_default line">
          <img id="u10_img" className="img " src="images/home/u10.png" />
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u11" className="ax_default heading_1">
          <div id="u11_div" />
          <div id="u11_text" className="text ">
            <p>
              <span>ใบเสร็จรับเงิน</span>
            </p>
            <p>
              <span>Receipt</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u12" className="ax_default heading_1">
          <div id="u12_div" />
          <div id="u12_text" className="text ">
            <p>
              <span>ชื่อ/Name :</span>
            </p>
            <p>
              <span>ที่อยู่/Address :</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u13" className="ax_default heading_1">
          <div id="u13_div" />
          <div id="u13_text" className="text ">
            <p>
              <span>เลขประจำตัวผู้เสียภาษี/Tax ID :</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u14" className="ax_default box_1">
          <div id="u14_div" />
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u15" className="ax_default heading_1">
          <div id="u15_div" />
          <div id="u15_text" className="text ">
            <p>
              <span>เลขที่/NO :</span>
            </p>
            <p>
              <span>วันที่/Date :</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u16" className="ax_default box_1">
          <div id="u16_div" />
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u17" className="ax_default heading_1">
          <div id="u17_div" />
          <div id="u17_text" className="text ">
            <p>
              <span>จำนวนเงิน/ Amount</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u18" className="ax_default heading_1">
          <div id="u18_div" />
          <div id="u18_text" className="text ">
            <p>
              <span>วันที่ใบสั่งจ่าย /Bill Payment Date :</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u19" className="ax_default box_1">
          <div id="u19_div" />
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u20" className="ax_default box_1">
          <div id="u20_div" />
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u21" className="ax_default box_1">
          <div id="u21_div" />
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u22" className="ax_default heading_1">
          <div id="u22_div" />
          <div id="u22_text" className="text ">
            <p>
              <span>ลำดับ</span>
            </p>
            <p>
              <span>NO.</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u23" className="ax_default heading_1">
          <div id="u23_div" />
          <div id="u23_text" className="text ">
            <p>
              <span>รายการสินค้า/บริการ</span>
            </p>
            <p>
              <span>DESCRIPTION</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u24" className="ax_default heading_1">
          <div id="u24_div" />
          <div id="u24_text" className="text ">
            <p>
              <span>จำนวน</span>
            </p>
            <p>
              <span>QUATITY</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u25" className="ax_default heading_1">
          <div id="u25_div" />
          <div id="u25_text" className="text ">
            <p>
              <span>ราคา/หน่วย</span>
            </p>
            <p>
              <span>UNIT/PRICE</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u26" className="ax_default heading_1">
          <div id="u26_div" />
          <div id="u26_text" className="text ">
            <p>
              <span>จำนวนเงิน(บาท)</span>
            </p>
            <p>
              <span>AMOUNT(THB)</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u27" className="ax_default box_1">
          <div id="u27_div" />
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u28" className="ax_default heading_1">
          <div id="u28_div" />
          <div id="u28_text" className="text ">
            <p>
              <span>รวมเป็นเงินทั้งสิ้น/</span>
            </p>
            <p>
              <span>Grand Total</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u29" className="ax_default heading_1">
          <div id="u29_div" />
          <div id="u29_text" className="text ">
            <p>
              <span>50,0000</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u30" className="ax_default heading_1">
          <div id="u30_div" />
          <div id="u30_text" className="text ">
            <p>
              <span>นำเงินส่งสมทบ</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u31" className="ax_default heading_1">
          <div id="u31_div" />
          <div id="u31_text" className="text ">
            <p>
              <span>1</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u32" className="ax_default heading_1">
          <div id="u32_div" />
          <div id="u32_text" className="text ">
            <p>
              <span>1</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u33" className="ax_default heading_1">
          <div id="u33_div" />
          <div id="u33_text" className="text ">
            <p>
              <span>1</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u34" className="ax_default heading_1">
          <div id="u34_div" />
          <div id="u34_text" className="text ">
            <p>
              <span>50,0000</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u35" className="ax_default heading_1">
          <div id="u35_div" />
          <div id="u35_text" className="text ">
            <p>
              <span>อ้างถึงเลขที่ใบสั่งจ่าย/Bill Payment No :</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u36" className="ax_default box_1">
          <div id="u36_div" />
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u37" className="ax_default heading_1">
          <div id="u37_div" />
          <div id="u37_text" className="text ">
            <p>
              <span>การชำระเงิน&nbsp; :</span>
            </p>
            <p>
              <span>PAYMENT</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u38" className="ax_default box_1">
          <div id="u38_div" />
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u39" className="ax_default heading_1">
          <div id="u39_div" />
          <div id="u39_text" className="text ">
            <p style={{ textAlign: "left" }}>
              <span>
                เอกสารนี้จัดทำด้วยวิธีการทางอิเล็กทรอนิกส์ ตรวจสอบได้ที่นี่
              </span>
            </p>
            <p style={{ textAlign: "center" }}>
              <span>This e-Receipt can be verified here</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u40" className="ax_default heading_1">
          <div id="u40_div" />
          <div id="u40_text" className="text ">
            <p style={{ textAlign: "left" }}>
              <span>
                ถ้าชำระด้วยเช็คใบเสร็จรับเงินนี้จะสมบูรณ์เมื่อสำนักงานคณะกรรมการกำกับและส่งเสริมการประกอบธุรกิจประกันภัยได้รับเงินตามเช็คธนาคารแล้ว
              </span>
            </p>
            <p style={{ textAlign: "center" }}>
              <span>
                If payments is made by cheque,this receipt is not valid unitil
                cheque is honored by bank.
              </span>
            </p>
          </div>
        </div>
        {/* Unnamed (Image) */}
        <div id="u41" className="ax_default image">
          <img id="u41_img" className="img " src="images/home/u41.png" />
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u42" className="ax_default heading_1">
          <div id="u42_div" />
          <div id="u42_text" className="text ">
            <p>
              <span>(ห้าหมื่นบาทถ้วน)</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u43" className="ax_default heading_1">
          <div id="u43_div" />
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u44" className="ax_default heading_1">
          <div id="u44_div" />
          <div id="u44_text" className="text ">
            <p>
              <span>007090665000000049</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u45" className="ax_default heading_1">
          <div id="u45_div" />
          <div id="u45_text" className="text ">
            <p>
              <span>09/06/2565</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u46" className="ax_default heading_1">
          <div id="u46_div" />
          <div id="u46_text" className="text ">
            <p>
              <span>231200e6650600023</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u47" className="ax_default heading_1">
          <div id="u47_div" />
          <div id="u47_text" className="text ">
            <p>
              <span>09/06/2565</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u48" className="ax_default heading_1">
          <div id="u48_div" />
          <div id="u48_text" className="text ">
            <p>
              <span>บริษัท เอฟดับบลิวดี ประกันชีวิต จำกัด (มหาชน)</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u49" className="ax_default heading_1">
          <div id="u49_div" />
          <div id="u49_text" className="text ">
            <p>
              <span>
                เลขที่ 130-132 ซอย - ถนน วิทยุ แขวง ลุมพินี เขต ปทุมวัน{" "}
              </span>
            </p>
            <p>
              <span>จังหวัด กรุงเทพมหานคร</span>
            </p>
          </div>
        </div>
        {/* Unnamed (Rectangle) */}
        <div id="u50" className="ax_default heading_1">
          <div id="u50_div" />
          <div id="u50_text" className="text ">
            <p>
              <span>xxxxxxxxxxxxxxxxxxxxx</span>
            </p>
          </div>
        </div>
      </Row>
    </Container>
  );
}
