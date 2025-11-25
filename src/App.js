// src/App.js
import React from "react";
import MainLayout from "./components/layout/MainLayout";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
}

export default App;
