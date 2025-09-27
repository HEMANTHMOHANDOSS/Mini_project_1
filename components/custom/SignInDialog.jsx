import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { UserDetailContext } from "@/context/UserDetailContext";
import axios from "axios";
import { useMutation } from "convex/react";
import uuid4 from "uuid4";
import { api } from "@/convex/_generated/api";
import { Loader as Loader2, Sparkles, Shield, Zap } from "lucide-react";
import { toast } from "sonner";

function SignInDialog({ openDialog, closeDialog }) {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [isLoading, setIsLoading] = useState(false);
  const CreateUser = useMutation(api.users.CreateUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: "Bearer " + tokenResponse?.access_token } }
        );

        const user = userInfo.data;
        await CreateUser({
          name: user?.name,
          email: user?.email,
          picture: user?.picture,
          uid: uuid4(),
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user));
        }
        setUserDetail(userInfo?.data);
        toast.success("Welcome to Z Flow! 🚀");
        closeDialog(false);
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Failed to sign in. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error("Google login error:", errorResponse);
      toast.error("Google sign-in failed. Please try again.");
    },
  });

  return (
    <Dialog open={!!openDialog} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-xl border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-lg"></div>
        <div className="relative">
          <DialogHeader className="text-center space-y-4">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full animate-ping"></div>
              </div>
            </div>

            <DialogTitle className="font-bold text-3xl text-white">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome to Z Flow
              </span>
            </DialogTitle>
            
            <DialogDescription className="text-gray-300 text-lg">
              {Lookup.SIGNIN_SUBHEADING}
            </DialogDescription>
          </DialogHeader>

          {/* Features */}
          <div className="grid grid-cols-1 gap-3 my-6">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">AI-Powered Development</p>
                <p className="text-gray-400 text-xs">Build apps with natural language</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Secure & Private</p>
                <p className="text-gray-400 text-xs">Your data is protected</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <Button
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              onClick={googleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </div>
              )}
            </Button>
            
            <p className="text-xs text-gray-400 text-center max-w-sm leading-relaxed">
              {Lookup.SIGNIn_AGREEMENT_TEXT}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500">
              Powered by Hemanth M • MCA GENERATIVE AI • SRMIST RAMAPURAM
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SignInDialog;