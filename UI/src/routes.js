import AfterSignup from "./auth/AfterSignup";
import Feed from "./feed/Feed";
import HomePage from "./pages/HomePage";

const routes = [
    {
        path : "/",
        element: <HomePage />
    },
    {
        path : '/signup/complete',
        element: <AfterSignup />
    },
    {
        path: '/feed',
        element: <Feed />
    }
]

export default routes;