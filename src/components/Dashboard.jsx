import { useEffect } from 'react';
import axiosInstance from '../interceptors/axiosInstance';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails, selectUserDetails } from '../redux/slices/userSlice.js';
import Sidebar from './Sidebar.jsx';
import Section from './Section';
import Opportunities from './Opportunities';
function Dashboard() {
  console.log("Dashboard")
  const dispatch = useDispatch();
  const userDetails = useSelector(selectUserDetails);

  const getUserDetails = () => {
    axiosInstance
      .get('/user/detail')
      .then((res) => {
        dispatch(setUserDetails(res.data.data)); // Save to Redux
        console.log('App Component User Details-->', res.data.data);
      })
      .catch((err) => {
        console.error('Error fetching user details', err);
      });
  };

  useEffect(() => {
    // if (!userDetails.role) {
      getUserDetails();
    // }
  }, []);

  return (
    <div className='flex sm:flex-row h-screen'>
      <Sidebar />
      {userDetails.role === 'admin' && <Opportunities />}
      {userDetails.role === 'student' && <Section />}
    </div>
  );
}

export default Dashboard;
