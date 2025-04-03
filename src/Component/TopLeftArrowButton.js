import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const TopLeftArrowButton = ({ onClick }) => {
    return (
        <button 
            className="fixed top-4 left-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
            onClick={onClick}
        >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
    );
};

export default TopLeftArrowButton;
