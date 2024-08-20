import { FC, memo, useId, ChangeEvent, useState } from "react";
import { faFolderOpen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Modal, Table } from "react-bootstrap";
import { FileBrowserSchema } from "../../../models/schemas/filebrowser/file-browser-schema.model";
import { Attachment } from "../../../models/schemas/filebrowser/attachment.model";
import { parseISO } from "date-fns";
import { getFileDownload } from "../../../data";

const FileViewer: FC<{
  show: boolean;
  data: Blob | null;
  onClose(): void;
  fileName?: string;
}> = ({ show, data, onClose, fileName }) => {
  const [url, setUrl] = useState<string | "">("");
  const [type, setType] = useState<string | undefined>("");

  const handleOnShow = () => {
    setUrl(URL.createObjectURL(data ?? new Blob([])));
    setType(data?.type);
  };

  return (
    <Modal
      fullscreen
      show={show}
      onShow={handleOnShow}
      centered
      onHide={() => {
        onClose();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{fileName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <embed
          src={url}
          datatype={type}
          style={{ width: "100%", height: "100%" }}
        />
      </Modal.Body>
    </Modal>
  );
};

const FileBrowser: FC<{
  schema: FileBrowserSchema[];
  attachments: Attachment[];
  readonly: boolean;
  onFileChanged(code: string, files: FileList): void;
  onRemoveFile(code: string, id: string): void;
}> = ({
  schema,
  onFileChanged,
  onRemoveFile,
  attachments,
  readonly = false,
}) => {
  for (let i = 0; i < schema.length; i++) {
    schema[i].SEQ = i + 1;
  }
  return (
    <>
      <Card className="mt-3">
        <Card.Header>อัปโหลดเอกสาร</Card.Header>
        <Card.Body>
          <Table bordered className="mt-3">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>รายการ</th>
                <th>แสดงไฟล์อัปโหลด</th>
                {readonly ? null : <th>เลือกไฟล์</th>}
              </tr>
            </thead>
            <tbody>
              {schema.map((s, i) => (
                <FileDetail
                  readonly={readonly}
                  key={i}
                  seq={s.SEQ}
                  schemaCode={s.CODE}
                  secName={s.NAME}
                  attachments={attachments}
                  onInputChanged={onFileChanged}
                  onInputDeleteFile={onRemoveFile}
                  fileTypes={s.FILE_TYPES}
                  isRequired={s.REQUIRED}
                />
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

const FileDetail: FC<{
  schemaCode: string;
  seq: number;
  secName: string;
  readonly: boolean;
  attachments: Attachment[];
  fileTypes: string[];
  onInputChanged(code: string, files: FileList | null): void;
  onInputDeleteFile(code: string, id: string): void;
  isRequired: boolean;
}> = ({
  schemaCode,
  seq,
  secName,
  attachments,
  onInputChanged,
  onInputDeleteFile,
  fileTypes,
  isRequired,
  readonly = false,
}) => {
  const id = useId();

  const [showFile, setShowFile] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileData, setFileData] = useState<Blob | null>(null);

  const handleDownloadFile = (code: string, name: string) => {
    getFileDownload(code).then((data) => {
      if (data.type === "application/pdf") {
        setFileData(data);
        setFileName(name);
        setShowFile(true);
      } else {
        const url = URL.createObjectURL(new Blob([data], { type: data.type }));
        const link = document.createElement("a");
        link.href = url;
        link.download = `${name}`;
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <tr>
      <td>{seq}</td>
      <td style={{ width: "50%" }}>
        {secName}
        {isRequired ? <span style={{ color: "crimson" }}>*</span> : null}
      </td>
      <td>
        <Table bordered>
          <thead>
            <tr>
              <th>ชื่อไฟล์ </th>
              <th>วันที่อัปโหลด</th>
              <th> วันที่เอกสาร</th>
              <th>ขนาด</th>
              {readonly ? null : <th>ลบ</th>}
            </tr>
          </thead>
          <tbody>
            {attachments
              .filter((x) => x.SCHEMA_CODE === schemaCode)
              .map((file, i) => (
                <tr key={i}>
                  <td>
                    <span
                      onClick={() => handleDownloadFile(file.ID, file.NAME)}
                      className="text-primary"
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                      {file.NAME}
                    </span>
                  </td>
                  <td>
                    {parseISO(file?.UPLOAD_DATE.toString()).toLocaleTimeString(
                      "th-TH",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }
                    )}
                  </td>
                  <td>
                    {parseISO(file?.DOC_DATE.toString()).toLocaleTimeString(
                      "th-TH",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }
                    )}
                  </td>
                  <td>{file.SIZE}</td>
                  {readonly ? null : (
                    <td>
                      <span
                        className="btn text-danger"
                        onClick={() => onInputDeleteFile(schemaCode, file.ID)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </span>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </Table>
        <FileViewer
          show={showFile}
          data={fileData}
          onClose={() => {
            setFileData(null);
            setShowFile(false);
          }}
          fileName={fileName}
        />
      </td>
      {readonly ? null : (
        <td style={{ textAlign: "center", verticalAlign: "middle" }}>
          <input
            accept={fileTypes.join(",.")}
            type="file"
            id={id}
            name={id}
            multiple
            style={{ display: "none" }}
            readOnly={readonly}
            onChange={
              readonly
                ? () => {}
                : (e: ChangeEvent<HTMLInputElement>) => {
                    onInputChanged(schemaCode, e.target.files);
                    e.target.value = "";
                  }
            }
          />
          <label htmlFor={id} className="btn text-success">
            <FontAwesomeIcon icon={faFolderOpen} /> เลือก
          </label>
        </td>
      )}
    </tr>
  );
};
export default memo<{
  schema: FileBrowserSchema[];
  onFileChanged(code: string, files: FileList): void;
  onRemoveFile(code: string, id: string): void;
  readonly: boolean;
  attachments: Attachment[];
}>(FileBrowser);
