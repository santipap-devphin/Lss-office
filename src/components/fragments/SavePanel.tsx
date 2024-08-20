// import {
//   faSave,
//   faBackwardStep,
//   faForwardStep,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import "@sweetalert2/theme-minimal/minimal.scss";

import { useDataContext } from "../../providers/DataProvider";
import { saveDraft } from "../../data";
import Swal from "sweetalert2";
import "@sweetalert2/theme-minimal/minimal.scss";
import { DocumentActionType } from "../../reducers/document.reducer";
import { ContactActionType } from "../../reducers/contact.reducer";

const showOnPath = ["/non-life", "/non-life/step2", "/life"];
const step = [
  { current: "/non-life", next: "/non-life/step2", previous: "/" },
  {
    current: "/non-life/step2",
    next: "/non-life/step3",
    previous: "/non-life",
  },
  { current: "/non-life/step3", next: "/", previous: "/non-life/step2" },
  { current: "/life", next: "/life/step2", previous: "/" },
  {
    current: "/life/step2",
    next: "/life/step3",
    previous: "/life",
  },
  { current: "/life/step3", next: "/", previous: "/life/step2" },
];

const SavePanel = () => {
  let location = useLocation();
  let navigate = useNavigate();
  let {
    company,
    document: doc,
    contacts,
    documentDispatch,
    contactDispatch,
  } = useDataContext();

  const handleSaveDraft = () => {
    saveDraft({
      NonLife: company?.COMPANY_TYPE_CODE === "NONLIFE" ? doc : null,
      Life: company?.COMPANY_TYPE_CODE === "LIFE" ? doc : null,
      Contacts: contacts,
    })
      .then((res) => {
        // Re-validate data
        documentDispatch({
          type: DocumentActionType.Replace,
          payload: res.DOCUMENT,
        });
        contactDispatch({
          type: ContactActionType.Replace,
          payload: res.CONTACTS,
        });
      })
      .catch((err) => {
        //console.log(err);
        Swal.fire({
          icon: "error",
          text: "ไม่สามารถบันทึกข้อมูลได้",
        });
      });
  };

  const handleBack = () => {
    const route = step.find((route) => route.current === location.pathname);
    if (route) {
      navigate(route.previous);
    }
  };

  const handleNext = () => {
    const route = step.find((route) => route.current === location.pathname);
    if (route) {
      navigate(route.next);
    }
  };

  return (
    <Navbar
      variant="light"
      fixed="bottom"
      className="justify-content-center bg-transparent"
      style={{
        display: showOnPath.some((x) => x === location.pathname)
          ? "flex"
          : "none",
      }}
    >
      <Nav
        className="justify-content-center w-25 bg-transparent"
        style={{ columnGap: "0.5rem" }}
      >
        <Nav.Item>
          <Button
            type="button"
            variant="secondary"
            style={{ minWidth: "7rem" }}
            onClick={handleBack}
          >
            {/* <FontAwesomeIcon icon={faBackwardStep} /> ย้อนกลับ */}
          </Button>
        </Nav.Item>
        <Nav.Item>
          <Button type="button" onClick={handleSaveDraft}>
            {/* <FontAwesomeIcon icon={faSave} /> บันทึกแบบร่าง */}
          </Button>
        </Nav.Item>
        <Nav.Item>
          <Button
            type="button"
            variant="success"
            onClick={handleNext}
            style={{ minWidth: "7rem" }}
          >
            {/* ถัดไป <FontAwesomeIcon icon={faForwardStep} /> */}
          </Button>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

export default SavePanel;
