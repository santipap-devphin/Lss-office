import { FC, useState, useCallback } from "react";
import { Modal } from "react-bootstrap";
import { getPdf } from "../../data";
import "./PdfViewer.scss";
import Spinner from "./Spinner";

export const PdfViewer: FC<{
  show: boolean;
  onClose(): void;
  title?: string;
  url: string;
}> = ({ show, onClose, title = "PDF Viewer", url, ...rest }) => {
  const [isBusy, setIsBusy] = useState(true);
  const [file, setFile] = useState<any>(null);

  const handleLoadPdf = useCallback(() => {
    return new Promise((resolve, reject) => {
      getPdf(url)
        .then((b) => {
          setFile(URL.createObjectURL(b));
          setIsBusy(false);
          resolve(true);
        })
        .catch((err) => {
          setIsBusy(false);
          reject(err);
        });
    });
  }, [url]);

  return (
    <Modal
      show={show}
      onShow={handleLoadPdf}
      onHide={onClose}
      fullscreen
      {...rest}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column">
        {isBusy ? (
          <Spinner />
        ) : (
          <embed
            src={file}
            width="100%"
            height="100%"
          />
        )}
      </Modal.Body>
    </Modal>
  );
};
