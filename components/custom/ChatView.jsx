"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSidebar } from "../ui/sidebar";

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const { toggleSidebar } = useSidebar();
  
  useEffect(() => {
    id && GetWorkspaceData();
  }, [id]);
  
  const GetWorkspaceData = async () => {
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      // Ensure messages is always an array
      setMessages(result?.messages || []);
      console.log(result);
    } catch (error) {
      console.error("Error fetching workspace data:", error);
      setMessages([]); // Set empty array on error
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
      };
      const updatedMessages = [...(messages || []), aiResp];
      setMessages(updatedMessages);
      await UpdateMessages({
        messages: updatedMessages,
        workspaceId: id,
      });
    } catch (error) {
      console.error("Error getting AI response:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role == "user") {
        GetAiResponse();
      }
    }
  }, [messages]);

  const onGenerate = (input) => {
    if (!input?.trim()) return; // Don't send empty messages
    setMessages((prev) => [
      ...(prev || []), // Ensure prev is an array
      {
        role: "user",
        content: input,
      },
    ]);
    setUserInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      onGenerate(userInput);
    }
  };

  return (
    <div className="relative h-[84vh] flex flex-col">
      <div
        className="flex-1 overflow-y-scroll pl-12"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Safe array check before mapping */}
        {Array.isArray(messages) && messages.map((msg, index) => (
          <div
            key={index}
            className="p-3 rounded-lg mb-2 flex gap-2 items-center leading-7"
            style={{
              backgroundColor: Colors.CHAT_BACKGROUND,
            }}
          >
            {msg?.role == "user" && (
              <Image
                src={userDetail?.picture}
                alt="userImage"
                width={35}
                height={35}
                className="rounded-full"
              />
            )}
            <div className="flex flex-col">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="p-3 rounded-lg mb-2 flex gap-2 items-start">
            <Loader2Icon className="animate-spin" />
            <h2>Hemanth is Developing the code pls wait...</h2>
          </div>
        )}
      </div>

      <div className="flex gap-2 items-end">
        {userDetail && (
          <Image
            className="rounded-full cursor-pointer"
            onClick={toggleSidebar}
            src={userDetail?.picture}
            alt="user"
            width={40}
            height={40}
          />
        )}
        <div
          className="p-5 border rounded-xl max-w-xl w-full mt-3"
          style={{
            backgroundColor: Colors.BACKGROUND,
          }}
        >
          <div className="flex gap-2">
            <textarea
              placeholder={Lookup.INPUT_PLACEHOLDER}
              onChange={(event) => setUserInput(event.target.value)}
              onKeyDown={handleKeyDown}
              className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
              value={userInput || ""} // Prevent undefined value
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
              />
            )}
          </div>
          <div>
            <Link className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;