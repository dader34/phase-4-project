# BirdNoise

!["Bird"Noise"](UI/public/birdnoise.png)

   ## Overview

BirdNoise is a social media platform designed to connect users and facilitate meaningful conversations through posts and comments. This document provides an overview of the project structure, detailing each file's purpose and the key components they contribute to the BirdNoise application.

## Project Structure

### src Directory

The src directory contains the source code for the BirdNoise application. Here's an overview of the key files and their functionalities:

#### App.js

-   Dependencies:
    

-   react, useState, useEffect: Core React libraries and hooks.
    
-   react-router-dom: Library for handling navigation in a React application.
    
-   NavBar: Component responsible for rendering the navigation bar.
    
-   toast and Toaster: Libraries for displaying toast notifications.
    
-   STYLING/NavBar.css and STYLING/PostCard.css: CSS files for styling the navigation bar and post cards.
    

Component Description:

-   The App component manages the overall structure of the application. It includes the navigation bar (NavBar), which is conditionally rendered based on the user's authentication status. The dark mode toggle and the Outlet component from react-router-dom are also integrated.
    

#### ProfilePage.js

-   Dependencies:
    

-   react, useState, useEffect: Core React libraries and hooks.
    
-   useNavigate, useParams: React Router hooks for navigation and URL parameter access.
    
-   react-hot-toast: Library for displaying toast notifications.
    
-   STYLING/ProfilePage.css and STYLING/Modal.css: CSS files for styling the profile page and modals.
    
-   PostCard: Component for rendering individual posts.
    

Component Description:

-   The ProfilePage component fetches user data based on the user ID from the URL parameters. It displays the user's profile information, posts, and followers/following lists. Users can edit their bio information through a modal.
    

#### HomePage.js

-   Dependencies:
    

-   react, useState, useEffect: Core React libraries and hooks.
    
-   SignInModal and SignUpModal: Components for rendering sign-in and sign-up modals.
    
-   react-router-dom: Library for handling navigation in a React application.
    
-   LogInSignUp: Component for rendering the login/signup interface.
    
-   STYLING/HomePage.css: CSS file for styling the homepage.
    

Component Description:

-   The HomePage component displays the main content of the landing page, offering options to sign in or create an account. Depending on the user's actions, modals (SignInModal and SignUpModal) may be triggered for sign-in or sign-up processes.
    

#### ErrorPage.js

-   Dependencies:
    

-   react: Core React library.
    
-   react-router-dom: Library for handling navigation in a React application.
    
-   STYLING/ErrorPage.css: CSS file for styling the error page.
    

Component Description:

-   The ErrorPage component is displayed when an error occurs in the application. It provides an error message and a link to return to the main BirdNoise page.
    

### STYLING Directory

The STYLING directory contains CSS files for styling different components of the BirdNoise application.

-   NavBar.css: Styles for the navigation bar.
    
-   PostCard.css: Styles for rendering post cards.
    
-   ProfilePage.css: Styles for the user profile page.
    
-   Modal.css: Styles for modal components.
    
-   HomePage.css: Styles for the landing page.
    
-   ErrorPage.css: Styles for the error page.
    

## Usage

To integrate BirdNoise into your project, follow these steps:

-   Copy the contents of the src directory into your project's source code directory.
    
-   Adjust the CSS files in the STYLING directory to match your application's styling preferences.
    
-   Make sure to install any additional dependencies used in the components (e.g., react-router-dom, react-hot-toast) if not already installed.
    
-   Customize the components as needed for your application.
    

## Contributors

-   [Michael Phan]
    
-   [Danner Baumgartner]
    
-  [Landon Cramer]]
    

## License

The MIT License(MIT)

Permission is herby granted, free of charge, to any person obtaining a copy of this software and associated document files ("'BirdNoise"). You are free to bend it, twist it, or even throw it into the spirit portal (though we don't recommend that). Remember, with great power comes great responsibility. Enjoy exploring our world of BirdNoise!

