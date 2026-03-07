import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Citizens from './page/citizens/Citizens.jsx'
import Login from './page/auth/Login.jsx'
import Register from './page/auth/Register.jsx'
import ClickSpark from './components/ClickSpark.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Import Test pages
import TestSocket from './page/testsocket/TestSocket.jsx';
import TestAttachment from './page/testsocket/TestAttachment.jsx';

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
import WarehouseConfig from './page/manager/WarehouseConfig.jsx';
import TransactionHistory from './page/manager/TransactionHistory.jsx';
import DistributionTracking from './page/manager/DistributionTracking.jsx';

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
            <Route path="/Citizens" element={<ProtectedRoute><Citizens /></ProtectedRoute>} />

            {/* Test Routes */}
            <Route path="/testsocket" element={<TestSocket />} />
            <Route path="/testattachment" element={<TestAttachment />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute><SystemConfig /></ProtectedRoute>} />
              <Route path="reports" element={<ProtectedRoute><AdminReports /></ProtectedRoute>} />
            </Route>

            {/* Manager Routes */}
            <Route path="/manager" element={<ProtectedRoute><ManagerLayout /></ProtectedRoute>}>
              <Route index element={<ManagerDashboard />} />
              <Route path="dashboard" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
              <Route path="inventory" element={<ProtectedRoute><InventoryManagement /></ProtectedRoute>} />
              <Route path="warehouses" element={<ProtectedRoute><WarehouseConfig /></ProtectedRoute>} />
              <Route path="transactions" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
              <Route path="distribution" element={<ProtectedRoute><DistributionTracking /></ProtectedRoute>} />
            </Route>
          </Routes>
        </Router>
      </ClickSpark>
    </>
  )
}

export default App
