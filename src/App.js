import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React from 'react';
import AITest from './components/AITest';
import AIConvTest from './components/AIConvTest';
import ConvMTest from './components/ConvMTest';
import SendTest from './components/SendTest';
import WindowTest from './components/WindowTest';
import WindowTestDB from './components/WindowTestDB';
import ChatWindow from './components/chat/ChatWindow';
// import { AuthProvider } from './context/AuthContext';
// import Login from './components/auth/Login';
// import PrivateRoute from './components/auth/PrivateRoute';

// const { Content } = Layout;
function Home() {
  return <div>首页</div>;
}

function About() {
  return <div>关于</div>;
}

function TestAI() {
  return (
    <div>
      <AITest />
    </div>
  );
}

function TestAIConv() {
  return (
    <div>
      <AIConvTest />
    </div>
  );
}

function TestSend() {
  return (
    <div>
      <SendTest />
    </div>
  );
}

function TestConvM() {
  return (
    <div>
      <ConvMTest />
    </div>
  );
}

function TestWin() {
  return (
    <div>
      <WindowTest />
    </div>
  );
}

function TestWinDB() {
  const userId = 'test_user_1';
  return (
    <div>
      <WindowTestDB userId={userId} />
    </div>
  );
}


function Chat() {
  // For testing purposes, using a fixed userId
  const userId = 'test_user_1';
  return (
    <div style={{ padding: '20px' }}>
      <ChatWindow userId={userId} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav>
        <div><Link to="/">首页</Link></div>
        <div><Link to="/about">关于</Link></div>
        <div><Link to="/test_ai">测试AI</Link></div>
        <div><Link to="/ai_conv_test">AI对话测试</Link></div>
        <div><Link to="/conv_m_test">对话列表测试</Link></div>
        <div><Link to="/send_test">发送测试</Link></div>
        <div><Link to="/win_test">窗口测试</Link></div>
        <div><Link to="/win_test_db">窗口测试DB</Link></div>
        <div><Link to="/chat">聊天</Link></div>

      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/test_ai" element={<TestAI />} />
        <Route path="/ai_conv_test" element={<TestAIConv />} />
        <Route path="/conv_m_test" element={<TestConvM />} />
        <Route path="/send_test" element={<TestSend />} />
        <Route path="/win_test" element={<TestWin />} />
        <Route path="/win_test_db" element={<TestWinDB />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
