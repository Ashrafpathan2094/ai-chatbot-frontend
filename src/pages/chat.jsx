import { useEffect, useState } from "react";
import ChatLayout from "../components/ChatLayout/ChatLayout";
import Spinner from "../components/spinner/spinner";
import { useChatContext } from "../contexts/ChatContext";
import axiosInstance from "../utils/axios";

const Chat = () => {
  const { chats, setChats, loading, setLoading } = useChatContext();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [chatId, setChatId] = useState("");

  const handleMessageSend = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      setLoading(true);

      let aiResp = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/api/chat`,
        {
          messages: [...messages, { content: input, role: "user" }],
          chatId,
          userId: user?.id,
        }
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        { content: input, role: "user" },
        { content: aiResp?.data?.reply, role: "assistant" },
      ]);
      setInput("");
      setChatId(aiResp?.data?.chatId);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMessages(chats?.messages || []);
  }, [chats]);
  return (
    <>
      <ChatLayout>
        <div className="pos-center">{loading ? <Spinner /> : null}</div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleMessageSend();
          }}
        >
          <h1 className="content-3xl font-bold underline">Hello world!</h1>
          <div>
            {messages.map((message, index) => (
              <div key={index} className="message p-5">
                <strong>{message.role}:</strong> {message.content}
              </div>
            ))}
          </div>
          <div className="input-area p-5">
            <input
              type="content"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Send</button>
          </div>
        </form>
      </ChatLayout>
    </>
  );
};

export default Chat;
