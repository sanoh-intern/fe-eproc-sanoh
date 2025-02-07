import { FaSpinner } from "react-icons/fa";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

const Loader = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-300px)]">
      <Breadcrumb pageName="Loading..." />
      <div className="flex-1 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    </div>
  );
};

export default Loader;