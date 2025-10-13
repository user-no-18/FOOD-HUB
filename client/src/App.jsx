import React from 'react'
import {Route,Routes} from 'react-router-dom'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import ForgotPassword from './Pages/ForgotPassword'
import useGetCurrentUser from './Hooks/UseGetCurrentUser'
export const serverUrl = "http://localhost:5000";
const App = () => { 
  useGetCurrentUser()
  return (
      
      <Routes>
        
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
      </Routes>

  )
}

export default App
