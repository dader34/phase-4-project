import Feed from "./feed/Feed";
import HomePage from "./pages/HomePage";
import App from "./App";
import BioAndPfp from "./pages/BioAndPfp";
import ViewOnePost from "./pages/ViewOnePost";

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
        },
        {
            path: '/post/:id',
            element: <ViewOnePost/>
        }
        ]
    },
]

export default routes;