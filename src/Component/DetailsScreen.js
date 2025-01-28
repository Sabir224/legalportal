import React, { useState } from "react";

export default function DetailsScreen() {
  const [activeSections, setActiveSections] = useState([]);

  const sections = [
    {
      id: "party",
      title: "Party Details",
      content: (
        <>
          <p>Name: John Doe</p>
          <p>Event: Birthday Party</p>
          <p>Date: 2025-02-14</p>
        </>
      ),
    },
    {
      id: "document",
      title: "Document Details",
      content: (
        <>
          <p>Document Name: Contract Agreement</p>
          <p>Issued Date: 2025-01-01</p>
          <p>Status: Approved</p>
        </>
      ),
    },
  ];

  const toggleSection = (id) => {
    if (activeSections.includes(id)) {
      // Remove the section if already active
      setActiveSections(activeSections.filter((section) => section !== id));
    } else {
      // Add the section to active list
      setActiveSections([...activeSections, id]);
    }
  };

  return (
    <div className="flex gap-4 p-4">
      {/* Buttons Section */}
      <div className="flex flex-col gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => toggleSection(section.id)}
            className={`px-4 py-2 text-white rounded-lg ${
              activeSections.includes(section.id)
                ? "bg-blue-600"
                : "bg-blue-400 hover:bg-blue-500"
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* Details Section */}
      <div className="flex-1 space-y-4">
        {sections.map(
          (section) =>
            activeSections.includes(section.id) && (
              <div
                key={section.id}
                className="p-4 border rounded-lg bg-gray-50 shadow"
              >
                <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                {section.content}
              </div>
            )
        )}
        {activeSections.length === 0 && (
          <p className="text-gray-600">Select a button to view details.</p>
        )}
      </div>
    </div>
  );
}
