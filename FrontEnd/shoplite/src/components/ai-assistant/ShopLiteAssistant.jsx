import React, { useState } from "react";
import {
    MdClose,
    MdMinimize,
    MdSend,
    MdRefresh,
    MdSmartToy,
    MdSearch,
    MdShoppingBag,
    MdLocalShipping,
    MdSupportAgent,
} from "react-icons/md";

import "./ShopLiteAssistant.css";

const quickActions = [
    { label: "Find Products", icon: <MdSearch /> },
    { label: "Suggestions", icon: <MdShoppingBag /> },
    { label: "My Orders", icon: <MdLocalShipping /> },
    { label: "Customer Support", icon: <MdSupportAgent /> },
];

const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning!";
    if (hour < 17) return "Good afternoon!";
    if (hour < 21) return "Good evening!";

    return "Still shopping? 🌙";
};

const ShopLiteAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                text: trimmedMessage,
                sender: "user",
            },
        ]);

        setMessage("");
    };

    const handleQuickAction = (action) => {
        setMessage(action);
    };

    const resetChat = () => {
        setMessages([]);
        setMessage("");
    };

    return (
        <div className="shoplite-ai-container">

            {/* COLLAPSED MASCOT */}

            {!isOpen && (
                <div className="shoplite-ai-mascot-wrapper">

                    <div
                        className="shoplite-ai-greeting"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className="shoplite-ai-greeting-header">
                            <span>ShopLite AI</span>
                            <span className="shoplite-ai-online">Online</span>
                        </div>

                        <h4>{getGreeting()} 👋</h4>

                        <p>How may I help you today?</p>

                        <span className="shoplite-ai-click">
                            Click to chat →
                        </span>
                    </div>

                    <button
                        className="shoplite-ai-mascot"
                        onClick={() => setIsOpen(true)}
                        aria-label="Open ShopLite AI assistant"
                    >
                        <span className="shoplite-ai-mascot-face">
                            🤖
                        </span>

                        <span className="shoplite-ai-status-dot" />
                    </button>

                </div>
            )}

            {/* EXPANDED CHATBOT */}

            {isOpen && (
                <div className="shoplite-ai-chat-window">

                    {/* HEADER */}

                    <div className="shoplite-ai-header">

                        <div className="shoplite-ai-header-info">

                            <div className="shoplite-ai-avatar">
                                🤖
                                <span className="shoplite-ai-status-dot" />
                            </div>

                            <div>
                                <h3>ShopLite AI</h3>
                                <p>Your Shopping Companion</p>
                            </div>

                        </div>

                        <div className="shoplite-ai-header-actions">

                            <button
                                onClick={() => setIsOpen(false)}
                                aria-label="Minimize chatbot"
                            >
                                <MdMinimize />
                            </button>

                            <button
                                onClick={resetChat}
                                aria-label="Reset conversation"
                            >
                                <MdRefresh />
                            </button>

                            <button
                                onClick={() => setIsOpen(false)}
                                aria-label="Close chatbot"
                            >
                                <MdClose />
                            </button>

                        </div>

                    </div>

                    {/* QUICK ACTIONS */}

                    <div className="shoplite-ai-quick-actions">

                        <span>QUICK ACTIONS</span>

                        <div className="shoplite-ai-action-grid">

                            {quickActions.map((action) => (
                                <button
                                    key={action.label}
                                    onClick={() => handleQuickAction(action.label)}
                                >
                                    {action.icon}
                                    {action.label}
                                </button>
                            ))}

                        </div>

                    </div>

                    {/* CHAT MESSAGES */}

                    <div className="shoplite-ai-messages">

                        <div className="shoplite-ai-bot-message">

                            <div className="shoplite-ai-message-avatar">
                                🤖
                            </div>

                            <div className="shoplite-ai-message-content">
                                <strong>Hey! Welcome to ShopLite! 💜</strong>

                                <p>
                                    I'm your little shopping assistant.
                                    Looking for something, checking an order,
                                    or need some help? I'm here for you!
                                </p>
                            </div>

                        </div>

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className="shoplite-ai-user-message"
                            >
                                {msg.text}
                            </div>
                        ))}

                    </div>

                    {/* MESSAGE INPUT */}

                    <div className="shoplite-ai-input-section">

                        <form onSubmit={handleSendMessage}>

                            <input
                                type="text"
                                placeholder="Ask me anything..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />

                            <button
                                type="submit"
                                aria-label="Send message"
                                disabled={!message.trim()}
                            >
                                <MdSend />
                            </button>

                        </form>

                        <div className="shoplite-ai-footer">
                            <span>Powered by ShopLite AI</span>
                            <span>● Online</span>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default ShopLiteAssistant;