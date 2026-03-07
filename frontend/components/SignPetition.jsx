"use client"
import React, { useState } from "react";
import { signPetition as signPetitionApi } from "@/lib/api";

const SignPetition = ({ user, petition, onUpdate }) => {
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState("");
  const [signed, setSigned] = useState(false);

  // Visible only to citizens
  if (user.role !== "citizen") return null;

  const isActive = petition.status === "active";
  const isDisabled = signed || !isActive || isSigning;

  const handleSign = async () => {
    setError("");
    setIsSigning(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to sign.");
        setIsSigning(false);
        return;
      }

      await signPetitionApi(token, petition._id || petition.id);
      setSigned(true);

      // Notify parent of update
      if (onUpdate) {
        onUpdate({
          ...petition,
          signatures: petition.signatures + 1,
        });
      }
    } catch (err) {
      setError(err.message || "Failed to sign petition.");
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSign}
        disabled={isDisabled}
        style={{
          backgroundColor: isDisabled ? "#ccc" : "#007bff",
          color: "#fff",
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          cursor: isDisabled ? "not-allowed" : "pointer",
          fontWeight: 600,
        }}
      >
        {signed
          ? "✅ Signed"
          : !isActive
            ? "Petition Closed"
            : isSigning
              ? "Signing..."
              : "✍️ Sign Petition"}
      </button>

      {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}
    </div>
  );
};

export default SignPetition;
