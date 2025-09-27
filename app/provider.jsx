'use client';
import React, { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import Header from '@/components/custom/Header';
import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSideBar from '@/components/custom/AppSideBar';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { ActionContext } from '@/context/ActionContext';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

function Provider({ children }) {
  const [messages, setMessages] = useState([]);
  const [userDetail, setUserDetail] = useState(null);
  const [action, setAction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const convex = useConvex();

  useEffect(() => {
    IsAuthenticated();
  }, []);

  const IsAuthenticated = async () => {
    try {
      setIsLoading(true);
      
      if (typeof window !== "undefined") {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (!user) {
          // Only redirect to home if not already on home page
          if (pathname !== '/') {
            router.push('/');
          }
          return;
        }

        // Fetch user from the database
        const result = await convex.query(api.users.GetUser, {
          email: user?.email,
        });
        
        if (result) {
          setUserDetail(result);
        } else {
          // User not found in database, clear localStorage
          localStorage.removeItem('user');
          if (pathname !== '/') {
            router.push('/');
          }
          toast.error("User session expired. Please sign in again.");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      if (typeof window !== "undefined") {
        localStorage.removeItem('user');
      }
      if (pathname !== '/') {
        router.push('/');
      }
      toast.error("Authentication failed. Please sign in again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading Z Flow...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}
      >
        <PayPalScriptProvider
          options={{ 
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_Id,
            currency: "USD"
          }}
        >
          <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <MessagesContext.Provider value={{ messages, setMessages }}>
              <ActionContext.Provider value={{action, setAction}}>
                <NextThemesProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange
                >
                  <SidebarProvider defaultOpen={false}>
                    <AppSideBar />
                    <main className="w-full">
                      <Header />
                      {children}
                    </main>
                  </SidebarProvider>
                </NextThemesProvider>
              </ActionContext.Provider>
            </MessagesContext.Provider>
          </UserDetailContext.Provider>
        </PayPalScriptProvider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default Provider;