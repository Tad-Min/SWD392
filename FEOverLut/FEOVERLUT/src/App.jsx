import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Citizens from './page/Citizens.jsx'
import Login from './page/Login.jsx'
import Register from './page/Register.jsx'
import ClickSpark from './components/ClickSpark.jsx';

function App() {

  return (
    <>
      <ClickSpark sparkColor="#22d3ee" sparkSize={12} sparkRadius={20} sparkCount={10} duration={600}>
        <Router>
          <Routes>
            <Route path="/" element={<Citizens />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
          </Routes>
        </Router>
      </ClickSpark>
    </>
  )
}

export default App
