import React from "react";
import Console from "../components/Console";

export default function App() {
  const initialCommands = [
    'intro',
    'ls'
  ];

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <Console initialCommands={initialCommands} />
    </div>
  );
}