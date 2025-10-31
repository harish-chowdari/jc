import React, { lazy } from "react";
import ROUTES from "./routes";


const Login = lazy(() => import("../auth/Login"));
const Signup = lazy(() => import("../auth/Signup"));
const PasswordReset = lazy(() => import("../auth/PasswordReset"));

export const authRoutes = [
    { path: ROUTES.LOGIN, element: <Login /> },
    { path: ROUTES.SIGNUP, element: <Signup /> },
    { path: ROUTES.PASSWORD_RESET, element: <PasswordReset /> },
];