import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Protected(props) {
  const navigate = useNavigate();
  useEffect(() => {
    let login = localStorage.getItem('token');
    if (!login) {
      navigate('/login');
    }
  }); 

  return (
    <div>
      {props.children}
    </div>
  );
}

//protected 
import { React, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import background from '../Images/login.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid Email').required('Please Enter Your Email..'),
  password: Yup.string().required('Please Enter Your Password'),
});

export default function Login() {
  axios.defaults.withCredentials = true;
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await LoginSchema.validate(formData, { abortEarly: false });
  
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
  
      if (response.data.Status === 'Success') {
        if (response.data.role === 'admin') {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('id', response.data.id);
          localStorage.setItem('userName', response.data.userName);
          navigate('/dashboard');
        }
        else {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('id', response.data.id);
          localStorage.setItem('userName', response.data.userName);
          navigate('/');
        }
      }
      else {
        setError('Invalid email or password');
      }
    } catch (validationErrors) {
      if (validationErrors instanceof Yup.ValidationError) {
        const yupErrors = {};
        validationErrors.inner.forEach(error => {
          yupErrors[error.path] = error.message;
        });
        setErrors(yupErrors);
      } else {
        setError('Invalid Credential');
        console.error(validationErrors);
      }
    }
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the password visibility state
  }
  

  return (

    <div>
      <div
        className="h-screen font-sans  bg-cover "
        style={{ backgroundImage: url(${background}) }}
      >
        <div className="container  mx-auto h-full flex flex-1 justify-center items-center">
          <div className="w-full px-2 max-w-lg">
            <p className='bg-gradient-to-r from-gray-900 to-gray-400 text-transparent bg-clip-text  font-bold text-5xl mt-0 ml-4 animate-pulse'> Journey Xtreme</p>
            <div className="leading-loose">
              <form onSubmit={handleSubmit} className="max-w-sm m-4 p-10 bg-white bg-opacity-25 rounded shadow-xl">
                <p className="xl:text-gray-400 text-white font-bold text-center text-4xl ">
                  LOGIN
                </p>
                <div className="">
                  <label className="block text-xl xl:text-gray-500 font-medium text-white" htmlFor="email">
                    E-mail
                  </label>
                  <input
                    className="w-full px-5 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter Your Email"
                    aria-label="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                   {errors.email && <p className="text-red-700">{errors.email}</p>}
                </div>
                <div className="mt-2">
                  <label className="block text-xl font-medium  xl:text-gray-500 text-white">Password</label>
                  <div className="relative">
                  <input
                      className="w-full px-5 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                      type={showPassword ? "text" : "password"} // Use the state variable to conditionally render password visibility
                      id="password"
                      name="password"
                      placeholder=""
                      aria-label="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 mt-2 mr-4 focus:outline-none"
                      onClick={togglePasswordVisibility} // Toggle the password visibility when the button is clicked
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  {errors.password && <p className="text-red-700">{errors.password}</p>}
                </div>

                <div className="mt-4 items-center flex justify-between">
                  <button
                    className="px-4 py-1 text-white font-light tracking-wider bg-gray-500 hover:bg-gray-800 rounded hover:bg-gray-700"
                    type="submit"
                  >
                    Login
                  </button>
                  <Link
                    className="inline-block right-0 align-baseline font-bold text-sm text-500 text-white hover:text-red-400"
                    href="#"
                  >
                    Forgot Password
                  </Link>
                </div>
                <div className="text-center">
                  <Link
                    className="inline-block right-0 font-semibold align-baseline font-light text-lg text-white text-500 hover:text-red-400"
                    to="/signup"
                  >
                    Sign Up
                  </Link>
                </div>
                {error && (
                  <div className="ml-14 mt-4 text-red-700 font-bold">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
//Sign in checking roles and giving access to routes
import Home from "./Pages/Home";
import Booking from "./Pages/Booking";
import Signup from "./Pages/Signup";
import ContactForm from "./Pages/ContactForm";
import AllPackages from "./Pages/AllPacakges";
import Protected from "./Components/Protected";
import Dashboard from "./Dashboard/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import AllBlogs from "./Pages/AllBlogs";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Booking" element={<Protected><Booking /></Protected>} />
          <Route path="/dashboard" element={<Protected><Dashboard/></Protected>}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<ContactForm/>} />
          <Route path='/allpacakges' element={<AllPackages/>}/>
          <Route path='/allblogs' element={<AllBlogs/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

implementing protedtd routed erapping the protected component