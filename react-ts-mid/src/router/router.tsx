import { createBrowserRouter } from "react-router-dom";
import HomePage from '../view/HomePage';
import FunctionPage from '../view/FunctionPage';
import SearchPage from '../view/SearchPage';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/function",
        element: <FunctionPage />,
    },
    {
        path: "/search",
        element: <SearchPage />,
    },
]);