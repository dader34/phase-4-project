import React from "react";
import Feed from "./feed/Feed";
import HomePage from "./pages/HomePage";
import App from "./App";
import BioAndPfp from "./auth/BioAndPfp";
import ViewOnePost from "./feed/ViewOnePost";
import ErrorPage from "./pages/ErrorPage";
import ProfilePage from "./pages/ProfilePage"; // Import the ProfilePage component

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
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
      },
      {
        path: '/home/profile', 
        element: <ProfilePage/>
      },
    ]
  },
]

export default routes;
