import React, { lazy } from "react";
import ROUTES from "./routes";


const Home = lazy(() => import("../auth/Home"));
const ViewAllProducts = lazy(() => import("../auth/ViewProducts"));
const Cart = lazy(() => import("../auth/Cart"));
const ProductDetails = lazy(() => import("../auth/ProductDetails"));
const Search = lazy(() => import("../auth/Search"));


export const restrictedRoutes = [
    { path: ROUTES.HOME, element: <Home /> },
    { path: ROUTES.VIEW_PRODUCTS, element: <ViewAllProducts /> },
    { path: ROUTES.VIEW_PRODUCT_DETAILS, element: <ProductDetails /> },
    { path: ROUTES.CART, element: <Cart /> },
    { path: ROUTES.SEARCH, element: <Search /> },
];
 