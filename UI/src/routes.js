import Feed from "./feed/Feed";
import HomePage from "./pages/HomePage";
import App from "./App";
import BioAndPfp from "./pages/BioAndPfp";

const routes = [
    {
        path: "/",
        element: <App />,
        // errorElement: <ErrorPage />,
        children: [
        {
            path: "/",
            index: true,
            element: <HomePage />,
        },
        {
            path : '/signup/complete',
            element: <BioAndPfp />
        },
        {
            path: '/home',
            element: <Feed />
        }
        ]
    },
]

export default routes;