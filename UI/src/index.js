//! Client Requirements !//


//!End Of Client Requirements !//
//-----------------------------//
//!Views
//* /home // <-- Shows a user a feed of posts, Random from Followers?
//* /profile // <-- Displays Current Users Top/Newest Posts
//* /users/<int:UserId> // <-- Displays a view of a users account, including all posts
//! Strech goals for views !#
//? /trending // <-- Sort by top posts in last 24h, check if post was created in last 24h
//? /messages/inbox/<int:UserId> // <-- Displays a users inbox
//? /chat/<int:ChatId> // <-- Displays a chat session with a certain id
//! End of views !//

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
