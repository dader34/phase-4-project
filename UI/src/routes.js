import Feed from "./feed/Feed";
import HomePage from "./pages/HomePage";
import App from "./App";
import BioAndPfp from "./pages/BioAndPfp";
import ViewOnePost from "./feed/ViewOnePost";

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
            path: '/home/post/:id',
            element: <ViewOnePost/>
        }
        ]
    },
]

export default routes;