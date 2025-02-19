"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword, verifyResetCode } from "@/services/auth/firebaseAuthService";

/**
 * ResetPasswordPage Component
 *
 * This page allows users to set a new password after clicking the reset link in their email.
 * It verifies the reset code (oobCode) from the URL, and then lets the user enter and confirm a new password.
 */
const ResetPasswordPage: React.FC = () => {
  // Retrieve URL search parameters and router instance
  const searchParams = useSearchParams();
  const router = useRouter();
  // Get the reset code from the URL (provided by Firebase in the reset email)
  const oobCode = searchParams.get("oobCode");

  // State variables for the new password, confirmation, error messages, loading state, and success message
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * useEffect to verify the reset code when the component mounts.
   * If the code is invalid or expired, an error message is shown.
   */
  useEffect(() => {
    if (oobCode) {
      verifyResetCode(oobCode)
        .then((email) => {
          // If verification is successful, log the associated email (for debugging purposes)
          console.log("Reset code verified for email:", email);
        })
        .catch((err) => {
          console.error("Error verifying reset code:", err);
          setError("The reset link is invalid or has expired.");
        });
    } else {
      setError("Invalid reset link.");
    }
  }, [oobCode]);

  /**
   * Handles the password reset process:
   * - Validates that the new password and its confirmation match and meet requirements.
   * - Calls the resetPassword service function with the reset code and new password.
   * - Displays a success message and redirects to the login page after a short delay.
   */
  const handleResetPassword = async () => {
    setError(""); // Clear previous error messages

    // Check that both password fields match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Validate password length (e.g., at least 6 characters)
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    // Ensure that a reset code is present
    if (!oobCode) {
      setError("Invalid reset link.");
      return;
    }

    setLoading(true); // Set loading state while processing the reset
    try {
      // Call the service function to reset the password
      await resetPassword(oobCode, newPassword);
      setSuccessMessage("Password has been reset successfully.");
      // Redirect the user to the login page after a short delay (e.g., 3 seconds)
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Page Title */}
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {/* Display error message if any */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        {/* Display success message if password reset is successful */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">
            {successMessage}
          </div>
        )}
        {/* Input for New Password */}
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {/* Input for Confirm Password */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {/* Button to trigger the password reset process */}
        <button
          onClick={handleResetPassword}
          disabled={loading}
          className={`w-full py-2 px-4 font-medium rounded-md shadow-sm ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
