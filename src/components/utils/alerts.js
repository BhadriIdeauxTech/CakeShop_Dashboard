import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Make sure to import the CSS

const showAlert = (type, title, text) => {
  // React Toastify supports variants like success, error, info, warning, etc.
  toast[type](`${title}: ${text}`, {
    position: "top-right",  // You can customize the position
    autoClose: 5000,        // Auto close after 5 seconds
    hideProgressBar: false, // Show a progress bar (optional)
    closeOnClick: true,     // Close when clicked (optional)
    pauseOnHover: true,     // Pause when hovered (optional)
    draggable: true,        // Enable dragging
    progress: undefined,    // Optional: Set custom progress bar
  });
};

export default showAlert;
