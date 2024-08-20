import { FC } from "react";
import pencil from "../../assets/images/pencil.png";
import exclaim from "../../assets/images/exclaim.png";
import payment_order from "../../assets/images/payment_order.png";
import fullfiled from "../../assets/images/fullfiled.png";
import canceled from "../../assets/images/canceled.png";
import proof_of_payment from "../../assets/images/proof_of_payment.png";
import beyond_quarter from "../../assets/images/beyond_quarter.png";
import overdue from "../../assets/images/overdue.png";
import wait_crr from "../../assets/images/wait_crr.png";
import waiting_confirm_quater from "../../assets/images/waiting_confirm_quater.png";
import elec_receipt from "../../assets/images/elec_receipt.png";
import surrender from "../../assets/images/surrender.png";
import show_file from "../../assets/images/show_file.png";

import "@sweetalert2/theme-minimal/minimal.scss";
import styles from "./QuaterRow.module.scss";
import { Quater } from "../../models/data/quater.model";

const QuaterRow: FC<{
  rows: Quater[] | null;
  onCreate: (code: string) => void;
}> = ({ rows, onCreate }) => {
  return (
    <>
      {(rows as Quater[]).map((r, i) => (
        <tr key={i}>
          <td>{r.YEAR}</td>
          {r.QUATER.map((q, j) => (
            <td key={j}>
              <img
                src={pencil}
                className={styles.image}
                alt="กำลังกรอกรายละเอียด(ร่าง)"
                onClick={() => onCreate(q.CODE)}
              />
              <img src={exclaim} className={styles.image} alt="ครบกำหนดนำส่ง" />
              <img
                src={payment_order}
                className={styles.image}
                alt="ใบสั่งจ่าย"
              />
              <img src={fullfiled} className={styles.image} alt="ยื่นครบถ้วน" />
              <img src={canceled} className={styles.image} alt="ยกเลิกรายการ" />
              <img
                src={proof_of_payment}
                className={styles.image}
                alt="หลักฐานการชำระเงิน"
              />
              <img
                src={beyond_quarter}
                className={styles.image}
                alt="แบบนำส่งเงินสมทบ และ นำส่งเกินยกยอดไตรมาสถัดไป"
              />
              <img
                src={overdue}
                className={styles.image}
                alt="เกินกำหนดการนำส่ง"
              />
              <img src={wait_crr} className={styles.image} alt="รอข้อมูล CRR" />
              <img
                src={waiting_confirm_quater}
                className={styles.image}
                alt="ยื่นเกิน รอการยืนยัน ยกยอดไปไตรมาสถัดไป"
              />
              <img
                src={elec_receipt}
                className={styles.image}
                alt="ใบเสร็จรับเงินอิเล็กทรอนิกส์"
              />
              <img src={surrender} className={styles.image} alt="ยื่นขาด" />
              <img src={show_file} className={styles.image} alt="แสดงไฟล์" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default QuaterRow;
