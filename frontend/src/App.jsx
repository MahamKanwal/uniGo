import React from 'react'
import { Route, BrowserRouter as  Router, Routes } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import { Footer } from 'antd/es/layout/layout'
import AuthForm from './pages/auth/AuthForm'
import { Bounce, ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/:formName' element={<AuthForm/>}/>
      </Routes>
      <Footer/>
    </Router>
    <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}
/>
</>
  )
}
export default App

