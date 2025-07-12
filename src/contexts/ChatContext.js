// src/contexts/ChatContext.js
import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        chatList,
        setChatList,
        loading,
        setLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
