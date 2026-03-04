import React from "react";

const RoleBasedUI = ({ user, petitions }) => {
  return (
    <div>
      <h2>Dashboard</h2>

      {/*  Citizens */}
      {user.role === "citizen" && (
        <>
          <button
            style={{
              padding: "10px 16px",
              marginBottom: "20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
            }}
          >
            Create Petition
          </button>

          <h3>Available Petitions</h3>
          {petitions.map((petition) => (
            <div key={petition.id}>
              <h4>{petition.title}</h4>
              <p>Status: {petition.status}</p>
              <p>Signatures: {petition.signatures}</p>
            </div>
          ))}
        </>
      )}

      {/* Officials */}
      {user.role === "official" && (
        <>
          <h3>Petitions in Your Location</h3>
          {petitions
            .filter((p) => p.location === user.location)
            .map((petition) => (
              <div key={petition.id}>
                <h4>{petition.title}</h4>
                <p>Status: {petition.status}</p>
                <p>Signatures: {petition.signatures}</p>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default RoleBasedUI;
