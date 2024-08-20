import { ChangeEvent, useState } from "react";
import { uploadfiles } from "../../data";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function FileUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>();
  //const [isFilePicked, setIsFilePicked] = useState(false);
  const [, setIsSelected] = useState(false);
  let navigate = useNavigate();
  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.item(0));
    setIsSelected(true);
  };
  const handleSubmission = () => {
    const formData = new FormData();
    formData.append("File", selectedFile as File);
    //console.log(formData);
    uploadfiles(formData)
      .then((res) => {
        Swal.fire("ลงทะเบียนสำเร็จ", "กรุณาเช็คอีเมลของคุณ", "success").then(
          () => {
            navigate("/login");
          }
        );
      })
      .catch((err) => {
        if (err.status === 400) {
        }
      });
  };

  return (
    <div>
      <input type="file" name="file" onChange={changeHandler} />
      <div>
        <button onClick={handleSubmission}>Submit</button>
      </div>
    </div>
  );
}
export default FileUploadPage;
