import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Citizens from './page/citizens/Citizens.jsx'
import Login from './page/auth/Login.jsx'
import Register from './page/auth/Register.jsx'
import ClickSpark from './components/ClickSpark.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
// Import Admin layout & pages
import AdminLayout from './components/AdminLayout.jsx';
import AdminDashboard from './page/admin/AdminDashboard.jsx';
import UserManagement from './page/admin/UserManagement.jsx';
import SystemConfig from './page/admin/SystemConfig.jsx';
import AdminReports from './page/admin/AdminReports.jsx';

// Import Manager layout & pages
import ManagerLayout from './components/ManagerLayout.jsx';
import ManagerDashboard from './page/manager/ManagerDashboard.jsx';
import InventoryManagement from './page/manager/InventoryManagement.jsx';
// 1. Citizen
// 2. RescueTeam
// 3. RescueCoordinator
// 4. Manager
// 5. Admin
function App() {

  return (
    <>
      <ClickSpark sparkColor="#22d3ee" sparkSize={12} sparkRadius={20} sparkCount={10} duration={600}>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/Register" element={<Register />} />

            {/* Citizen Routes */}
            <Route path="/Citizens" element={<Citizens />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<SystemConfig />} />
              <Route path="reports" element={<AdminReports />} />
            </Route>

            {/* Manager Routes */}
            <Route path="/manager" element={<ManagerLayout />}>
              <Route index element={<ManagerDashboard />} />
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="inventory" element={<InventoryManagement />} />
            </Route>
          </Routes>
        </Router>
      </ClickSpark>
    </>
  )
}

export default App
