import Homepage from "./pages/Homapage";
import ChatPage from "./pages/ChatPage";
import ForgotPassword from "./pages/ForgotPassword";

import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
};

export default App;
