"use client"
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import Lookup from "@/data/Lookup";
import { ArrowRight, Link, Sparkles, Code, Zap, Rocket, Users, Clock } from "lucide-react";
import { useContext, useState } from "react";
import SignInDialog from "./SignInDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { toast } from "sonner";

function Hero() {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { messages, setMessages } = useContext(MessagesContext); 
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();

  const onGenerate = async (input) => {
    if (!input?.trim()) {
      toast.error("Please enter a description for your project");
      return;
    }
    
    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }

    setIsLoading(true);
    try {
      const msg = {
        role: "user",
        content: input,
      };
      setMessages([msg]);
      const workspaceId = await CreateWorkspace({
        user: userDetail._id,
        messages: [msg],
      });
      toast.success("Workspace created successfully!");
      router.push("/workspace/" + workspaceId);
    } catch (error) {
      console.error("Error creating workspace:", error);
      toast.error("Failed to create workspace. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onGenerate(userInput);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 flex flex-col items-center mt-20 xl:mt-32 gap-8 max-w-6xl mx-auto px-4 text-center">
        {/* Brand Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="https://res.cloudinary.com/dkpwmrjkq/image/upload/v1759128371/Screenshot_20250929_121442_xzjiei.jpg" 
                alt="Z Flow Logo" 
                className="w-16 h-16 rounded-xl shadow-lg object-cover"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <img 
              src="https://res.cloudinary.com/dkpwmrjkq/image/upload/v1755014169/Screenshot_2025_0812_212453_xtm6qn.jpg" 
              alt="College Logo" 
              className="w-16 h-16 rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Z Flow
            </h1>
            <p className="text-xs text-gray-400">Powered by Hemanth M • SRMIST</p>
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h2 className="font-bold text-5xl xl:text-7xl bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
            {Lookup.HERO_HEADING}
          </h2>
          <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
            {Lookup.HERO_DESC}
          </p>
        </div>

        {/* Features Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-all duration-200">
            <Code className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-all duration-200">
            <Rocket className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">Instant Deploy</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-all duration-200">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">Full-Stack</span>
          </div>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-4xl">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative p-6 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/10">
              <div className="flex gap-4">
                <div className="flex-1">
                  <textarea 
                    placeholder={Lookup.INPUT_PLACEHOLDER}
                    onChange={(event) => setUserInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    value={userInput}
                    disabled={isLoading}
                    className="w-full h-32 bg-transparent text-white placeholder-gray-400 resize-none outline-none text-lg leading-relaxed"
                  />
                </div>
                {userInput && (
                  <Button
                    onClick={() => onGenerate(userInput)}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-5 h-5" />
                        <span>Generate</span>
                      </div>
                    )}
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-gray-400">
                  <Link className="w-4 h-4" />
                  <span className="text-sm">Press Enter to generate</span>
                </div>
                <div className="text-xs text-gray-500">
                  MCA GENERATIVE AI • SRMIST RAMAPURAM
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="w-full max-w-4xl">
          <p className="text-gray-400 mb-4 text-sm">Try these examples:</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Lookup?.SUGGSTIONS.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onGenerate(suggestion)}
                disabled={isLoading}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-sm text-gray-300 hover:text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">10K+</h3>
            <p className="text-gray-400 text-sm">Active Developers</p>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Code className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">50K+</h3>
            <p className="text-gray-400 text-sm">Projects Created</p>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">&lt; 30s</h3>
            <p className="text-gray-400 text-sm">Average Build Time</p>
          </div>
        </div>

        <SignInDialog openDialog={openDialog} closeDialog={(v) => setOpenDialog(v)} />
      </div>
    </div>
  );
}

export default Hero;
