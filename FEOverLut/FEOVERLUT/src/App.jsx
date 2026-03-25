import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Citizens from './page/citizens/Citizens.jsx'
import Login from './page/auth/Login.jsx'
import Register from './page/auth/Register.jsx'
import ClickSpark from './components/ClickSpark.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Profile from './page/profile/Profile.jsx';
import RescueHistory from './page/citizens/RescueHistory.jsx';
import About from './page/citizens/About.jsx';
import Contract from './page/citizens/Contract.jsx';

// Import Test pages
import TestSocket from './page/testsocket/TestSocket.jsx';
import TestAttachment from './page/testsocket/TestAttachment.jsx';

// Import Admin layout & pages
import AdminLayout from './components/AdminLayout.jsx';
import AdminDashboard from './page/admin/AdminDashboard.jsx';
import UserManagement from './page/admin/UserManagement.jsx';
import SystemConfig from './page/admin/SystemConfig.jsx';
import AdminProductManagement from './page/admin/AdminProductManagement.jsx';

// Import Manager layout & pages
import ManagerLayout from './components/ManagerLayout.jsx';
import ManagerDashboard from './page/manager/ManagerDashboard.jsx';
import InventoryManagement from './page/manager/InventoryManagement.jsx';
import WarehouseConfig from './page/manager/WarehouseConfig.jsx';
import TransactionHistory from './page/manager/TransactionHistory.jsx';
import DistributionTracking from './page/manager/DistributionTracking.jsx';
import ManagerReports from './page/manager/ManagerReports.jsx';
import ProductManagement from './page/manager/ProductManagement.jsx';
import RescueTeamManagement from './page/manager/RescueTeamManagement.jsx';
import VehicleManagement from './page/manager/VehicleManagement.jsx';

// Import RescueCoordinator
import RescueCoordinator from './page/RescueCoordinator/RescueCoordinator.jsx';

// Import RescueTeam
import RescueTeam from './page/RescueTeam/RescueTeam.jsx';

import ChatBot from './components/ChatBot.jsx';

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
            <Route path="/Citizens" element={<ProtectedRoute allowedRoles={[1, 6]}><Citizens /></ProtectedRoute>} />
            <Route path="/rescue-history" element={<ProtectedRoute allowedRoles={[1, 6]}><RescueHistory /></ProtectedRoute>} />
            <Route path="/contract" element={<ProtectedRoute allowedRoles={[1, 6]}><Contract /></ProtectedRoute>} />
            {/* Profile Route */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            {/* RescueTeam Routes */}
            <Route path="/volunteer" element={<ProtectedRoute allowedRoles={[6]}><RescueTeam /></ProtectedRoute>} />
            {/* RescueCoordinator Routes */}
            <Route path="/RescueCoordinator" element={<ProtectedRoute allowedRoles={[3]}><RescueCoordinator /></ProtectedRoute>} />

            {/* About Page */}
            <Route path="/about" element={<About />} />

            {/* Test Routes */}
            <Route path="/testsocket" element={<TestSocket />} />
            <Route path="/testattachment" element={<TestAttachment />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={[5]}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<ProtectedRoute allowedRoles={[5]}><AdminDashboard /></ProtectedRoute>} />
              <Route path="users" element={<ProtectedRoute allowedRoles={[5]}><UserManagement /></ProtectedRoute>} />
              <Route path="products" element={<ProtectedRoute allowedRoles={[5]}><AdminProductManagement /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute allowedRoles={[5]}><SystemConfig /></ProtectedRoute>} />
            </Route>

            {/* Manager Routes */}
            <Route path="/manager" element={<ProtectedRoute allowedRoles={[4]}><ManagerLayout /></ProtectedRoute>}>
              <Route index element={<ManagerDashboard />} />
              <Route path="dashboard" element={<ProtectedRoute allowedRoles={[4]}><ManagerDashboard /></ProtectedRoute>} />
              <Route path="inventory" element={<ProtectedRoute allowedRoles={[4]}><InventoryManagement /></ProtectedRoute>} />
              <Route path="warehouses" element={<ProtectedRoute allowedRoles={[4]}><WarehouseConfig /></ProtectedRoute>} />
              <Route path="transactions" element={<ProtectedRoute allowedRoles={[4]}><TransactionHistory /></ProtectedRoute>} />
              <Route path="distribution" element={<ProtectedRoute allowedRoles={[4]}><DistributionTracking /></ProtectedRoute>} />
              <Route path="products" element={<ProtectedRoute allowedRoles={[4]}><ProductManagement /></ProtectedRoute>} />
              <Route path="rescue-teams" element={<ProtectedRoute allowedRoles={[4]}><RescueTeamManagement /></ProtectedRoute>} />
              <Route path="vehicles" element={<ProtectedRoute allowedRoles={[4]}><VehicleManagement /></ProtectedRoute>} />
              <Route path="reports" element={<ProtectedRoute allowedRoles={[4]}><ManagerReports /></ProtectedRoute>} />
            </Route>
          </Routes>
          <ChatBot />
        </Router>
      </ClickSpark>
    </>
  )
}

export default App
