import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  toggleWalletDropdown,
  setShowWalletDropdown,
} from "@/redux/slices/uiSlice";
import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import React, { useRef, useEffect } from "react";

const Header = () => {
  const dispatch = useAppDispatch();
  const { showNodesPanel, showPropertiesPanel, showWalletDropdown } =
    useAppSelector((state) => state.ui);
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dispatch(setShowWalletDropdown(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  const handleWalletClick = () => {
    if (!isConnected) {
      // If not connected, directly open the connect modal
      open();
    } else {
      // If connected, show the dropdown
      dispatch(toggleWalletDropdown());
    }
  };

  const handleLogout = async () => {
    try {
      // Open the AppKit modal with disconnect option
      await disconnect();
      dispatch(setShowWalletDropdown(false));
    } catch (error) {
      console.error("Error during logout:", error);
      dispatch(setShowWalletDropdown(false));
    }
  };

  return (
    <div
      className={`bg-dark  hidden lg:flex justify-end ${
        showNodesPanel ? "" : "rounded-tl-[20px]"
      }  ${
        showPropertiesPanel ? "rounded-br-[20px]" : "rounded-br-[0px]"
      }  items-center rounded-tr-[20px]   w-full  h-[12%] pl-10 pr-9 py-4`}
    >
      <div className="w-[335px] h-[60px] gap-6 justify-center flex items-center rounded-[15px] bg-bg">
        <p className="text-white">BUY FRAKTIA</p>
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex text-[#232323] rounded-[4px] justify-center items-center gap-1 w-[171px] h-[36px] bg-primary hover:cursor-pointer transition-colors hover:bg-primary/90"
            onClick={handleWalletClick}
          >
            <p className="text-sm">
              {address
                ? `${address.slice(0, 6)}...${address.slice(-6)}`
                : "Connect Wallet"}
            </p>
            <svg
              className={`transition-transform duration-200 w-4 h-4 ${
                showWalletDropdown ? "rotate-90" : "rotate-0"
              }`}
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
          </div>

          {showWalletDropdown && (
            <div className="absolute top-full mt-2 right-0 w-[171px] bg-bg border border-gray-600 rounded-[8px] shadow-lg z-50">
              <div className="py-1">
                {isConnected ? (
                  <>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors rounded-[8px]"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      open();
                      dispatch(setShowWalletDropdown(false));
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors rounded-[8px]"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
