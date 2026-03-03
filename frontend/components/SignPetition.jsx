import React, { useState } from "react";
import axios from "axios";

const SignPetition = ({ user, petition, onUpdate }) => {
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState("");

  // Visible only to citizens
  if (user.role !== "citizen") return null;

  const alreadySigned = petition.signedUsers.includes(user.id);
  const isActive = petition.status === "active";

  const isDisabled = alreadySigned || !isActive || isSigning;

  const handleSign = async () => {
    setError("");
    setIsSigning(true);

    const updatedPetition = {
      ...petition,
      signatures: petition.signatures + 1,
      signedUsers: [...petition.signedUsers, user.id],
    };

    onUpdate(updatedPetition);

    try {
      await axios.post(`/api/petitions/${petition.id}/sign`, {
        userId: user.id,
      });
    } catch (err) {
      //  Revert optimistic update if failed
      onUpdate(petition);
      setError("Failed to sign petition.");
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
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
      >
        {alreadySigned
          ? "Already Signed"
          : !isActive
          ? "Petition Closed"
          : isSigning
          ? "Signing..."
          : "Sign Petition"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SignPetition;
