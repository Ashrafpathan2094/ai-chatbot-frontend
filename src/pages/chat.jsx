import { useState } from "react";
import Spinner from "../components/spinner/spinner";
import axiosInstance from "../utils/axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [chatId, setChatId] = useState("");

  const handleMessageSend = async () => {
    try {
      setLoading(true);

      let aiResp = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/api/chat`,
        {
          messages: [...messages, { content: input, role: "user" }],
          chatId,
          userId: "6860e96704588c7f6e2799a0",
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
  return (
    <>
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
    </>
  );
};

export default Chat;
