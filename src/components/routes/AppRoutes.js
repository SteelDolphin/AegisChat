import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from '../auth/PrivateRoute';
import AdminRoute from '../auth/AdminRoute';

// 导入页面组件
import Home from '../Home';
import About from '../About';
import Login from '../auth/Login';
import Chat from '../chat/Chat';
import Admin from '../admin/AdminPanel';

// 导入测试组件
import AITest from '../test/AITest';
import AIConvTest from '../test/AIConvTest';
import ConvMTest from '../test/ConvMTest';
import SendTest from '../test/SendTest';
import WindowTest from '../test/WindowTest';
import WindowTestDB from '../test/WindowTestDB';

function AppRoutes() {
  return (
    <Routes>
      {/* 公共路由 */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      
      {/* 需要认证的路由 */}
      <Route path="/chat" element={
        <PrivateRoute>
          <Chat />
        </PrivateRoute>
      } />
      
      {/* 需要管理员权限的路由 */}
      <Route path="/admin" element={
        <AdminRoute>
          <Admin />
        </AdminRoute>
      } />
      
      {/* 测试路由 */}
      <Route path="/test_ai" element={
        <AdminRoute>
          <AITest />
        </AdminRoute>
      } />
      
      <Route path="/ai_conv_test" element={
        <AdminRoute>
          <AIConvTest />
        </AdminRoute>
      } />
      
      <Route path="/conv_m_test" element={
        <AdminRoute>
          <ConvMTest />
        </AdminRoute>
      } />
      
      <Route path="/send_test" element={
        <AdminRoute>
          <SendTest />
        </AdminRoute>
      } />
      
      <Route path="/win_test" element={
        <AdminRoute>
          <WindowTest />
        </AdminRoute>
      } />
      
      <Route path="/win_test_db" element={
        <AdminRoute>
          <WindowTestDB userId="test_user_1" />
        </AdminRoute>
      } />

      {/* 404 路由 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes; 