import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import "./NotFound.scss";
const NotFound = () => {
  let navigate = useNavigate();
  return (
    <div className="d-grid w-100 h-100" style={{ placeItems: "center" }}>
      <div className="error-template">
        <h1>Oops!</h1>
        <h2>404 Not Found</h2>
        <div className="error-details">
          ขออภัย เกิดข้อผิดพลาด ไม่พบหน้าที่ร้องขอ!
        </div>
        <div className="error-actions">
          <button
            onClick={() => {
              navigate("/");
            }}
            className="btn btn-primary btn-lg"
          >
            <FontAwesomeIcon icon={faHome} />&nbsp;
            กลับไปหน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
