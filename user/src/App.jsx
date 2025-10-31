import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import PasswordReset from "./auth/PasswordReset";
import Layout from "./layout/Layout";
import NavigationManager from "./navigations/NavigationManager";


const App = () => {
  return (
    <div>
        <BrowserRouter>
            <NavigationManager />
        </BrowserRouter>
    </div>
  );
};

export default App;
