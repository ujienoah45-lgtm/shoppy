import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import ReactMarkdown from "react-markdown";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [WhatsApp, setWhatsApp] = useState({
    status: false,
    number: ""
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: 'Hello! I am your Shoppy Assistant. How can I help you today?',
          sender: 'bot',
        },
      ]);
    }
  };

  const genRandomId = () => {
    const id = localStorage.getItem('userId');
    if (id) return id;
    const genId = crypto.randomUUID().toString();
    localStorage.setItem('userId', genId);
    return genId;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsThinking(true);
    try {
      const res = await fetch('/api/v1/nexarch.ai', {
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          userId: genRandomId(),
          question: currentInput
        })
      });
  
      const response = await res.json();
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'bot',
      };

      const shouldShowWhatsApp = Boolean(
        response.message && response.message.toLowerCase().includes("whatsapp agent")
      );
      if (shouldShowWhatsApp && response.whatsApp) {
        setWhatsApp({ status: true, number: response.whatsApp });
      } else {
        setWhatsApp({ status: false, number: "" });
      }

      setMessages((prev) => [...prev, botMessage]);
      setIsThinking(false);
      
    } catch (error) {
      console.log(error.message);
      setIsThinking(false);
    }
  };

  return (
    <>
      <button
        className="chatbot-toggle"
        onClick={handleToggle}
        title="Open Shoppy Assistant"
      >
        💬
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span>Shoppy Assistant</span>
            <button
              className="close-chatbot"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender}-message`}
              >
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            ))}
            {isThinking && (
              <div className="message bot-message typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {WhatsApp.status && WhatsApp.number && (
          <div className="chatbot-actions" style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #eee' }}>
            <a
              href={`https://wa.me/${WhatsApp.number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
              style={{
                display: 'block',
                background: '#25D366',
                color: 'white',
                padding: '8px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}
            >
              Talk to a Human (WhatsApp)
            </a>
          </div>
          )}

          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">✈️</button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot;
