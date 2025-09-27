"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import axios from "axios";
import { MessagesContext } from "@/context/MessagesContext";
import Prompt from "@/data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2Icon, Code, Eye, FileText, Play, Download, Share } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

function CodeView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages, setMessages } = useContext(MessagesContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (id) {
      GetFiles();
    }
  }, [id]);

  const GetFiles = async () => {
    setInitialLoading(true);
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData };
      setFiles(mergedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to load project files");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (messages?.length > 0 && !initialLoading) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        GenerateAiCode();
      }
    }
  }, [messages, initialLoading]);

  const GenerateAiCode = async () => {
    setLoading(true);
    try {
      const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
      const result = await axios.post("/api/gen-ai-code", {
        prompt: PROMPT,
      });
      
      const aiResp = result.data;
      if (aiResp?.files) {
        const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp.files };
        setFiles(mergedFiles);
        await UpdateFiles({
          workspaceId: id,
          files: aiResp.files,
        });
        toast.success("Code generated successfully! 🎉");
      }
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error("Failed to generate code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Create a downloadable zip file (simplified version)
    toast.info("Export feature coming soon!");
  };

  const handleShare = () => {
    // Copy share link to clipboard
    navigator.clipboard.writeText(window.location.href);
    toast.success("Share link copied to clipboard!");
  };

  if (initialLoading) {
    return (
      <div className="h-[84vh] flex items-center justify-center bg-gray-900/50 rounded-xl border border-white/10">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-400">Loading project files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "code"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Code className="w-4 h-4" />
                Code
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "preview"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <Share className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleExport}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <Download className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <SandpackProvider
          template="react"
          theme="dark"
          files={files}
          customSetup={{
            dependencies: {
              ...Lookup.DEPENDANCY,
            },
          }}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            bundlerURL: "https://sandpack-bundler.codesandbox.io/",
          }}
        >
          <SandpackLayout>
            {activeTab === "code" ? (
              <>
                <SandpackFileExplorer 
                  style={{ 
                    height: "75.5vh",
                    backgroundColor: "rgba(17, 24, 39, 0.8)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.1)"
                  }} 
                />
                <SandpackCodeEditor 
                  style={{ 
                    height: "75.5vh",
                    backgroundColor: "rgba(17, 24, 39, 0.8)"
                  }}
                  showTabs
                  showLineNumbers
                  showInlineErrors
                  wrapContent
                />
              </>
            ) : (
              <SandpackPreview
                style={{ 
                  height: "75.5vh",
                  backgroundColor: "rgba(17, 24, 39, 0.8)"
                }}
                showNavigator={true}
                showRefreshButton={true}
                showOpenInCodeSandbox={true}
              />
            )}
          </SandpackLayout>
        </SandpackProvider>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <Loader2Icon className="w-12 h-12 animate-spin text-blue-500" />
                <div className="absolute inset-0 w-12 h-12 border-4 border-blue-500/20 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Generating your application...
                </h3>
                <p className="text-gray-400 max-w-md">
                  Our AI is crafting your code with precision. This usually takes 10-30 seconds.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full">
                <Play className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400">AI at work</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeView;