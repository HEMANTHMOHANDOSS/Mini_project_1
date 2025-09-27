"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { ArrowRight, Link, Loader as Loader2Icon, Send, Bot, User } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useSidebar } from "../ui/sidebar";
import { toast } from "sonner";
import { Button } from "../ui/button";

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const { toggleSidebar } = useSidebar();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  
  useEffect(() => {
    if (id) {
      GetWorkspaceData();
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const GetWorkspaceData = async () => {
    setInitialLoading(true);
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      setMessages(result?.messages || []);
    } catch (error) {
      console.error("Error fetching workspace data:", error);
      toast.error("Failed to load workspace data");
      setMessages([]);
    } finally {
      setInitialLoading(false);
    }
  };

  const GetAiResponse = async () => {
    setLoading(true);
    try {
      const PROMPT = JSON.stringify(messages || []) + Prompt.CHAT_PROMPT;
      const result = await axios.post("/api/ai-chat", {
        prompt: PROMPT,
      });
      const aiResp = {
        role: "ai",
        content: result.data.result,
        timestamp: new Date().toISOString(),
      };
      const updatedMessages = [...(messages || []), aiResp];
      setMessages(updatedMessages);
      await UpdateMessages({
        messages: updatedMessages,
        workspaceId: id,
      });
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages?.length > 0 && !initialLoading) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        GetAiResponse();
      }
    }
  }, [messages, initialLoading]);

  const onGenerate = (input) => {
    if (!input?.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    const newMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...(prev || []), newMessage]);
    setUserInput("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onGenerate(userInput);
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  if (initialLoading) {
    return (
      <div className="h-[84vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-400">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[84vh] flex flex-col bg-gray-900/50 rounded-xl border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium">AI Assistant</h3>
            <p className="text-xs text-gray-400">Powered by Gemini 2.0</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: "thin" }}>
        {Array.isArray(messages) && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Start a conversation</h3>
            <p className="text-gray-400 max-w-sm">
              Ask me anything about your project or request modifications to your code.
            </p>
          </div>
        ) : (
          Array.isArray(messages) && messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${msg.role === "user" ? "order-1" : ""}`}>
                <div
                  className={`p-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-gray-800/50 border border-white/10 text-gray-100"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
                {msg.timestamp && (
                  <p className={`text-xs text-gray-500 mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                )}
              </div>

              {msg.role === "user" && userDetail && (
                <Image
                  src={userDetail.picture}
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-lg flex-shrink-0"
                />
              )}
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-800/50 border border-white/10 p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <Loader2Icon className="w-4 h-4 animate-spin text-blue-400" />
                <span className="text-gray-300">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-3 items-end">
          {userDetail && (
            <Image
              className="rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
              onClick={toggleSidebar}
              src={userDetail.picture}
              alt="User"
              width={40}
              height={40}
            />
          )}
          <div className="flex-1 relative">
            <div className="bg-gray-800/50 border border-white/10 rounded-xl p-3 focus-within:border-blue-500/50 transition-all">
              <textarea
                ref={textareaRef}
                placeholder={Lookup.INPUT_PLACEHOLDER}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none min-h-[20px] max-h-[120px]"
                value={userInput}
                disabled={loading}
                rows={1}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-gray-500">
                  <Link className="w-4 h-4" />
                  <span className="text-xs">Press Enter to send</span>
                </div>
                {userInput.trim() && (
                  <Button
                    onClick={() => onGenerate(userInput)}
                    disabled={loading}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;