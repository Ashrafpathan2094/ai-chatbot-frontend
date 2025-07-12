import "./App.css";
import { ChatProvider } from "./contexts/ChatContext";
import Login from "./pages/authPages/Login/Login";
import Signup from "./pages/authPages/Signup/Signup";
import Chat from "./pages/chat";
import { Navigate, Route, Routes } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/chat" replace />;
  }

  return children;
};

function App() {
  return (
    <ChatProvider>
      <Routes>
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/chat/:chatId?"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/chat" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/chat/:chatId?" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </ChatProvider>
  );
}

export default App;
