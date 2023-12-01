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

The App component manages the overall structure of the application. It includes the navigation bar (NavBar), which is conditionally rendered based on the user's authentication status. The dark mode toggle and the Outlet component from react-router-dom are also integrated.

#### ProfilePage.js

-   Dependencies:
    -   react, useState, useEffect: Core React libraries and hooks.
    -   useNavigate, useParams: React Router hooks for navigation and URL parameter access.
    -   react-hot-toast: Library for displaying toast notifications.
    -   STYLING/ProfilePage.css and STYLING/Modal.css: CSS files for styling the profile page and modals.
    -   PostCard: Component for rendering individual posts.

Component Description:

The ProfilePage component fetches user data based on the user ID from the URL parameters. It displays the user's profile information, posts, and followers/following lists. Users can edit their bio information through a modal.

#### HomePage.js

-   Dependencies:
    -   react, useState, useEffect: Core React libraries and hooks.
    -   SignInModal and SignUpModal: Components for rendering sign-in and sign-up modals.
    -   react-router-dom: Library for handling navigation in a React application.
    -   LogInSignUp: Component for rendering the login/signup interface.
    -   STYLING/HomePage.css: CSS file for styling the homepage.

Component Description:

The HomePage component displays the main content of the landing page, offering options to sign in or create an account. Depending on the user's actions, modals (SignInModal and SignUpModal) may be triggered for sign-in or sign-up processes.

#### ErrorPage.js

-   Dependencies:
    -   react: Core React library.
    -   react-router-dom: Library for handling navigation in a React application.
    -   STYLING/ErrorPage.css: CSS file for styling the error page.

Component Description:

The ErrorPage component is displayed when an error occurs in the application. It provides an error message and a link to return to the main BirdNoise page.

### STYLING Directory

The STYLING directory contains CSS files for styling different components of the BirdNoise application.

-   NavBar.css: Styles for the navigation bar.
-   PostCard.css: Styles for rendering post cards.
-   ProfilePage.css: Styles for the user profile page.
-   Modal.css: Styles for modal components.
-   HomePage.css: Styles for the landing page.
-   ErrorPage.css: Styles for the error page.
### main.py

The `main.py` file contains the main application logic for the BirdNoise Flask application. It includes route definitions and configurations for the RESTful API, user authentication, post creation, likes, and more.

Here are some key routes and functionalities:

-   **GET '/':**
    
    -   Landing route returning a simple "Hello World!" message.
-   **GET '/posts':**
    
    -   Endpoint to retrieve paginated posts with additional information such as post count and more.
-   **GET '/posts/int:id':**
    
    -   Endpoint to retrieve a specific post by ID, including details about the post and its comments.
-   **POST '/signup':**
    
    -   Endpoint for user signup, including username and password validation.
-   **PATCH '/signup':**
    
    -   Endpoint for updating user profile information (bio and profile picture) after authentication.
-   **DELETE '/post/int:post_id':**
    
    -   Endpoint to delete a post, requiring authentication, and checking if the authenticated user is the author.
-   **PATCH '/user/update-bio':**
    
    -   Endpoint for updating the user's bio, requiring authentication.
-   **POST '/login':**
    
    -   Endpoint for user login, including password validation and authentication.
-   **GET '/auth':**
    
    -   Endpoint to check user authentication status.
-   **POST '/post':**
    
    -   Endpoint for creating a new post, requiring authentication.
-   **POST '/like':**
    
    -   Endpoint for adding or removing a like from a post, requiring authentication.
-   **GET '/embed/int:id':**
    
    -   Endpoint to retrieve HTML content for embedding a post, requiring a valid post ID.
-   **GET '/user/int:id':**
    
    -   Endpoint to retrieve user details by ID, including posts, followers, and following.
-   **POST '/follow/int:id':**
    
    -   Endpoint for following or unfollowing a user, requiring authentication.

### models.py

The `models.py` file defines the database models used in the BirdNoise application. Here's an overview of the key models:

#### User

-   Attributes:
    -   id: User ID.
    -   username: User's username (unique).
    -   _password_hash: Hashed password using bcrypt.
    -   profile_picture: URL of the user's profile picture.
    -   user_bio: User's bio.
    -   created_at: Timestamp of user creation.
-   Relationships:
    -   followers: Relationship with the Follower model representing users who follow this user.
    -   following: Relationship with the Follower model representing users whom this user follows.
    -   posts: Relationship with the Post model representing posts created by this user.
    -   post_likes: Relationship with the PostLike model representing likes given by this user.

#### Post

-   Attributes:
    -   id: Post ID.
    -   user_id: ID of the user who created the post.
    -   content: Post content.
    -   parent_post: ID of the parent post if this is a comment.
    -   views: Number of views for the post.
    -   created_at: Timestamp of post creation.
-   Relationships:
    -   user: Relationship with the User model representing the creator of the post.
    -   comments: Relationship with the Post model representing comments on this post.
    -   parent: Relationship with the Post model representing the parent post (if this is a comment).
    -   post_likes: Relationship with the PostLike model representing likes given to this post.
    -   likes: Association proxy representing users who liked this post.

#### Follower

-   Attributes:
    -   follower_id: ID of the user who is following.
    -   following_id: ID of the user being followed.
    -   close_friend: Boolean indicating if the follower is a close friend.
-   Relationships:
    -   follower: Relationship with the User model representing the follower.
    -   following: Relationship with the User model representing the user being followed.

#### PostLike

-   Attributes:
    -   id: Like ID.
    -   user_id: ID of the user who gave the like.
    -   post_id: ID of the post that received the like.
    -   created_at: Timestamp of like creation.
-   Relationships:
    -   user: Relationship with the User model representing the user who gave the like.
    -   post: Relationship with the Post model representing the post that received the like.


### Usage

To integrate BirdNoise into your project, follow these steps:

-   Copy the contents of the `src` directory into your project's source code directory.
-   Adjust the CSS files in the `STYLING` directory to match your application's styling preferences.
-   Make sure to install any additional dependencies used in the components (e.g., `react-router-dom`, `react-hot-toast`) if not already installed.
-   Customize the components as needed for your application.

## Contributors

-   [Michael Phan]
-   [Danner Baumgartner]
-   [Landon Cramer]

## License

The MIT License(MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated document files ("'BirdNoise"). You are free to bend it, twist it, or even throw it into the spirit portal (though we don't recommend that). Remember, with great power comes great responsibility. Enjoy exploring our world of BirdNoise!