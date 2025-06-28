"use client";
import { useState, useEffect } from "react";
import SideBar from "@/components/SideBar";
import { useAppKitAccount } from "@reown/appkit/react";
import Login from "@/components/Login";
import { addUserToDatabase } from "@/actions/user";
import { useRouter } from "next/navigation";

export default function SidebarShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isConnected, address } = useAppKitAccount();
  const router = useRouter();

  // Add user to database when they connect
  useEffect(() => {
    const registerUser = async () => {
      if (isConnected && address) {
        console.log("User connected with address:", address);
        try {
          const result = await addUserToDatabase(address);
          if (result.success) {
            if (result.isNewUser) {
              console.log("New user successfully registered in database");
            } else {
              console.log("Existing user verified in database");
            }
          } else {
            console.error("Failed to register user:", result.error);
          }
        } catch (error) {
          console.error("Error during user registration:", error);
        }
      } else {
        router.push("/"); // Redirect to login if not connected
      }
    };

    registerUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]); // Run when connection status or address changes

  if (isConnected) {
    return (
      <div className="relative   h-full flex gap-5  lg:px-5">
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* Floating button to show sidebar when hidden */}
        {!sidebarOpen && (
          <button
            className="fixed hidden lg:flex z-20 left-2 top-6 bg-dark border border-[#23262F] rounded-full p-2 shadow-lg hover:bg-[#23262F] transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Show sidebar"
            type="button"
          >
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Main content grows/shrinks with sidebar */}
        <main
          className={` lg:h-[97.5%] flex-1     lg:flex lg:mt-5   text-white transition-all duration-300 ${
            sidebarOpen ? "lg:ml-[280px]" : "ml-0"
          }`}
        >
          {/* // create a hamburger menu icon that opens the sidebar when clicked */}
          <button
            className={`lg:hidden absolute top-4 right-3 z-50 p-2 bg-dark border border-[#23262F] rounded-full shadow-lg hover:bg-[#23262F] transition-colors ${
              sidebarOpen ? "hidden" : "flex"
            }`}
            onClick={() => setSidebarOpen(true)}
            aria-label="Show sidebar"
            type="button"
          >
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6  h18M3 12h18m-7 6h7"
              />
            </svg>
          </button>
          {/* Close button for sidebar */}
          <button
            className={`lg:hidden absolute top-4 right-3 z-50 p-2 bg-dark border border-[#23262F] rounded-full shadow-lg hover:bg-[#23262F] transition-colors ${
              sidebarOpen ? "flex" : "hidden"
            }`}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            type="button"
          >
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {children}
        </main>
      </div>
    );
  } else {
    return <Login />;
  }
}
