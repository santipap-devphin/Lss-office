import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { confirmUnlock } from "../../data";
import Swal from "sweetalert2";

const ConfirmUnlockLogin = () => {
  const { token } = useParams();
  let navigate = useNavigate();
  useEffect(() => {
    console.log(token)
    confirmUnlock(token as string)
      .then(() => {
        Swal.fire({
          icon: "success",
          text: `ระบบได้ทำการปลดล็อคการเข้าสู่ระบบของคุณแล้ว กรุณาเข้าสู่ระบบ`,
          confirmButtonText: "ตกลง",
        }).then(() => {
          return navigate("/login", { replace: true });
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          text: "คำขอไม่ถูกต้องหรือหมดอายุ",
          confirmButtonText: "ตกลง",
        }).then(() => {
          return navigate("/login", { replace: true });
        });
      });
  }, [navigate, token]);

  return <></>;
};

export default ConfirmUnlockLogin;
