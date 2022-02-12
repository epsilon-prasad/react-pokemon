import { Redirect, Route, Routes } from "react-router-dom";

import React, { Suspense, lazy } from "react";
import "./App.css";
const Homepage = lazy(() => import("./Home"));
const Details = lazy(() => import("./Details"));

const App = () => {
    return (
        <Suspense fallback={<div className="text-center">Loading.....</div>}>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/details" element={<Details />} />
            </Routes>
        </Suspense>
    );
};

export default App;
