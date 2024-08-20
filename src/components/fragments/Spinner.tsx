import { useEffect } from "react";
import Loader from "../../functions/Loader";
const loader = new Loader();

const Spinner = () => {
  useEffect(() => {
    loader.show();
    return () => {
      loader.close();
    };
  }, []);
  return <></>
};

export default Spinner;
