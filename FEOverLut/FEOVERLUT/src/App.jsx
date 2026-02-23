import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Citizens from './page/Citizens.jsx'
import Login from './page/Login.jsx'
import Register from './page/Register.jsx'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Citizens />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
