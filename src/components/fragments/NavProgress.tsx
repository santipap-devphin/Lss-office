import { Container, ProgressBar } from "react-bootstrap";
const NavProgress = () => {
  return (
    <Container className="d-flex">
      <ProgressBar striped variant="success" now={100} className="w-100" />
    </Container>
  );
};

export default NavProgress;
