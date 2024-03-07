import { createBrowserRouter } from "react-router-dom";
import Home from "./home";
import Login from "./login";
import Chat from "./chat";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Home />
        )
    },
    {
        path: "/login/oauth",
        element: <Login />
    },
    {
        path: "/chat",
        element: <Chat />
    }
])

export default router