import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import WeatherDetails from "./pages/weather-details.tsx";
import NotFound from "./pages/extras/not-found";
import axios from "axios";
import { FaSun } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {

  axios.defaults.params = {
    "appId": process.env.REACT_APP_ACCESS_TOKEN
  }
  // axios.defaults.baseURL = `https://api.weatherstack.com/`
  axios.defaults.baseURL = `https://api.openweathermap.org/data/2.5/`
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <nav >
        <Link to='/'>
          Oct Weathered <FaSun />
        </Link>
      </nav>
      <div className="content">
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/details/:city" element={<WeatherDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
