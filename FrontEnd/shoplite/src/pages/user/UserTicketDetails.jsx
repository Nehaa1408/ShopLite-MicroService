import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserTicketDetails = () => {

    const { id } = useParams();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const chatEndRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                `http://localhost:8080/api/tickets/${id}/messages`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (Array.isArray(res.data)) {
                setMessages(res.data);
            } else if (Array.isArray(res.data.messages)) {
                setMessages(res.data.messages);
            } else {
                setMessages([]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        try {
            const token = localStorage.getItem("token");

            await axios.post(
                `http://localhost:8080/api/tickets/${id}/messages`,
                null,
                {
                    params: { content: input },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setInput("");
            fetchMessages();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="p-6 max-w-3xl mx-auto">

            <h1 className="text-2xl font-bold mb-6">Support Chat</h1>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {Array.isArray(messages) && messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`p-3 rounded-lg ${msg.sender === "USER"
                                ? "bg-blue-100 text-right"
                                : "bg-gray-100"
                            }`}
                    >
                        <p>{msg.content}</p>
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>

            <div className="mt-4 flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 border p-2 rounded"
                    placeholder="Type message..."
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-600 text-white px-4 rounded"
                >
                    Send
                </button>
            </div>

        </div>
    );
};

export default UserTicketDetails;