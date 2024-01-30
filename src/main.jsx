import React from "react";
import ReactDOM from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import "./config/firebase-config";

import Home from "./pages/Home";
import Sketch from "./pages/Sketch";
import MySketches from "./pages/MySketches";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ResponsiveApp />
    </BrowserRouter>
  </React.StrictMode>,
);

function ResponsiveApp() {
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1024px)" });

  if (!isDesktopOrLaptop) {
    return (
      <h1 className="mx-auto text-xl">
        이 사이트는 데스크탑에서 이용할 수 있습니다.
      </h1>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sketch/new" element={<Sketch />} />
      <Route path="/sketch/:sketch_id" element={<Sketch />} />
      <Route path="/my-sketches" element={<MySketches />} />
    </Routes>
  );
}
