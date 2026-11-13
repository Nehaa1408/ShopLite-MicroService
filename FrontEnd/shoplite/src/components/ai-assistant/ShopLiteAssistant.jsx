import React, { useState } from "react";
import {
    MdClose,
    MdMinimize,
    MdSend,
    MdRefresh,
    MdSearch,
    MdShoppingBag,
    MdLocalShipping,
    MdSupportAgent,
} from "react-icons/md";

import mascotImage from "../../assets/shoplite-ai-mascot.png";
import "./ShopLiteAssistant.css";

const quickActions = [
    { label: "Find Products", icon: <MdSearch /> },
    { label: "Suggestions", icon: <MdShoppingBag /> },
    { label: "My Orders", icon: <MdLocalShipping /> },
    { label: "Customer Support", icon: <MdSupportAgent /> },
];

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

                    <button
                        className="shoplite-ai-greeting"
                        onClick={() => setIsOpen(true)}
                        aria-label="Say hello to ShopLite AI"
                    >
                        Hi! 👋
                    </button>

                    <button
                        className="shoplite-ai-mascot"
                        onClick={() => setIsOpen(true)}
                        aria-label="Open ShopLite AI assistant"
                    >
                        <img
                            src={mascotImage}
                            alt="ShopLite AI shopping assistant"
                            className="shoplite-ai-mascot-image"
                        />

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
                                <img
                                    src={mascotImage}
                                    alt="ShopLite AI"
                                />
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

                        {/* Initial welcome message */}

                        <div className="shoplite-ai-bot-message">

                            <div className="shoplite-ai-message-avatar">
                                <img
                                    src={mascotImage}
                                    alt=""
                                />
                            </div>

                            <div className="shoplite-ai-message-content">

                                <strong>Hey there! 👋</strong>

                                <p>
                                    Welcome to ShopLite! 💜
                                    How can I help you today?
                                    I'm here to make your shopping easier.
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