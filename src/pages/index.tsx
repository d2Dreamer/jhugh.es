import React from "react";
import Console from "../components/Console";

export default function App() {
  const initialCommands = [
    'whoami',
    'pwd',
    'ls',
    'intro',
    'status'
  ];

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <Console initialCommands={initialCommands} />
    </div>
  );
}