import React from "react";

const RoleBasedUI = ({ user, petitions }) => {
  return (
    <div>
      {/* Citizens */}
      {user.role === "citizen" && (
        <>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Available Petitions</h3>
          {petitions.length === 0 ? (
            <p className="text-gray-500">No petitions available.</p>
          ) : (
            petitions.map((petition) => (
              <div key={petition._id || petition.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{petition.title}</h4>
                <p className="text-sm text-gray-500">Status: {petition.status?.replace("_", " ")}</p>
                <p className="text-sm text-indigo-600 font-medium">
                  Signatures: {petition.signatureCount ?? petition.signatures?.length ?? 0}
                </p>
              </div>
            ))
          )}
        </>
      )}

      {/* Officials */}
      {user.role === "official" && (
        <>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Petitions in Your Location</h3>
          {petitions
            .filter((p) => p.location === user.location)
            .map((petition) => (
              <div key={petition._id || petition.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{petition.title}</h4>
                <p className="text-sm text-gray-500">Status: {petition.status?.replace("_", " ")}</p>
                <p className="text-sm text-indigo-600 font-medium">
                  Signatures: {petition.signatureCount ?? petition.signatures?.length ?? 0}
                </p>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default RoleBasedUI;
