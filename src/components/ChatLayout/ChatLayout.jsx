import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChatContext } from "../../contexts/ChatContext";
import axiosInstance from "../../utils/axios";
import styles from "./ChatLayout.module.scss";

const ChatLayout = ({ children }) => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { chats, setChats, chatList, setChatList, loading, setLoading } =
    useChatContext();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getAllChats = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const chatListResp = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/api/getAllUserChats?userId=${user?.id}`
      );
      setChatList(chatListResp.data);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setChatList]);

  const getChatById = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const chatResp = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/api/chat/details?userId=${user?.id}&chatId=${chatId}`
      );
      setChats(chatResp.data);
    } catch (error) {
      console.error("Error fetching chat details:", error);
    } finally {
      setLoading(false);
    }
  }, [chatId, setLoading, setChats]);

  useEffect(() => {
    if (chatId) {
      getChatById();
    }
  }, [chatId, getChatById]);

  useEffect(() => {
    getAllChats();
  }, [getAllChats]);

  return (
    <div className={`${styles.layout} flex h-screen bg-gray-50`}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          sidebarOpen ? "w-64 md:w-64" : "w-0 md:w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex-shrink-0`}
      >
        <div className="p-4 h-full flex flex-col">
          {sidebarOpen ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Chats</h2>
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.707 4.293a1 1 0 010 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-1">
                  {chatList.map((chat) => (
                    <div
                      key={chat?._id}
                      className="p-3 rounded-md hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        navigate(`/chat/${chat?._id}`);
                      }}
                    >
                      <div className="h-3 w-3 rounded-full bg-blue-500 mr-3"></div>
                      <span className="truncate">{chat?.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center pt-2">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>
      {/* Main Content */}
      <main className={`${styles.mainContent} flex-1 flex flex-col`}>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        <div className="p-4 border-t border-gray-200 bg-white">
          {/* Your message input component */}
        </div>
      </main>
    </div>
  );
};

export default ChatLayout;
