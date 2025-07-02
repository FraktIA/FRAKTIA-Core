"use client";

import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  selectShowFeedbackModal,
  setShowFeedbackModal,
} from "@/redux/slices/uiSlice";
import { useAppKitAccount } from "@reown/appkit/react";
import { sendFeedback } from "@/actions/feedback";
import Modal from "@/components/Modal";

const FeedbackModal = () => {
  const dispatch = useAppDispatch();
  const showFeedbackModal = useAppSelector(selectShowFeedbackModal);
  const { address } = useAppKitAccount();

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackLoading(true);
    setFeedbackError("");
    setFeedbackSuccess(false);

    try {
      const result = await sendFeedback({
        message: feedbackMessage,
        address: address || null,
        createdAt: new Date(),
      });

      if (result.success) {
        setFeedbackSuccess(true);
        setFeedbackMessage("");
        setTimeout(() => {
          dispatch(setShowFeedbackModal(false));
          setFeedbackSuccess(false);
        }, 2000);
      } else {
        setFeedbackError(result.error || "Failed to send feedback");
      }
    } catch (error) {
      console.log(error);
      setFeedbackError("Unexpected error. Please try again.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(setShowFeedbackModal(false));
    setFeedbackError("");
    setFeedbackSuccess(false);
    setFeedbackMessage("");
  };

  return (
    <Modal isOpen={showFeedbackModal} onClose={handleClose}>
      <div className="bg-dark justify-center w-[90vw] max-w-[600px] h-auto rounded-[20px] shadow-2xl flex flex-col items-center p-8 mx-4">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="relative w-16 mb-6 h-16">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-white mb-4 text-2xl font-semibold text-center">
            Send Feedback
          </h2>
          <p className="text-white/70 mb-8 text-base text-center max-w-[500px]">
            Help us improve Fraktia by sharing your thoughts, suggestions, or
            reporting any issues you&apos;ve encountered.
          </p>

          <form onSubmit={handleFeedbackSubmit} className="w-full space-y-6">
            <div>
              <textarea
                className="w-full min-h-[160px] rounded-[15px] p-4 bg-[#23262F] text-white border border-gray-600 focus:border-primary focus:outline-none resize-none placeholder-white/50 text-base"
                placeholder="Share your feedback, suggestions, or report any issues..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                required
                disabled={feedbackLoading}
                maxLength={1000}
              />
              <div className="text-sm text-white/50 mt-2 text-right">
                {feedbackMessage.length}/1000 characters
              </div>
            </div>

            {feedbackError && (
              <div className="text-sm text-red-400 text-center bg-red-400/10 p-3 rounded-[10px] border border-red-400/20">
                {feedbackError}
              </div>
            )}

            {feedbackSuccess && (
              <div className="text-sm text-green-400 text-center bg-green-400/10 p-3 rounded-[10px] border border-green-400/20">
                Thank you for your feedback! We appreciate your input.
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-[#23262F] text-white rounded-[15px] px-6 py-4 text-base font-medium hover:bg-[#2a2d35] transition-colors disabled:opacity-50 border border-gray-600"
                disabled={feedbackLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary text-[#232323] rounded-[15px] px-6 py-4 text-base font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-lg"
                disabled={feedbackLoading || !feedbackMessage.trim()}
              >
                {feedbackLoading ? "Sending..." : "Send Feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
