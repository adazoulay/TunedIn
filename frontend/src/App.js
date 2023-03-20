import { Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import Layout from "./components/layout/Layout";
import DashLayout from "./components/layout/DashLayout";
import Feed from "./Features/posts/Feed";
import PersistLogin from "./Features/Auth/PersistLogin";

// Lazy
const Public = lazy(() => import("./components/layout/publicPage/Public"));
const UserPage = lazy(() => import("./Features/users/UserPage"));
const EditUser = lazy(() => import("./Features/users/EditUser"));
const TagPage = lazy(() => import("./Features/tags/TagPage"));
const PostPage = lazy(() => import("./Features/posts/PostPage"));
const BroadcastPage = lazy(() => import("./Features/comments/BroadcastPage"));

//TODO feed
//TODO   Fix feed
//! Add tags to feed

//! Tags 2.0: Limit size, shorthand / full name, add background img,
//! Fix like optimistic update repost

//? ------ LATER ------

//! Post spotify songs/playlists/artists
//! Explore tags, users

//! Refactor
//!   Comments 2.0
//!   Search 2.0

//? ----- Maybe -----
//! Thread system for Broadcast page
//! Add tags like cover, remix, original, music video,
//! Can react with emotes during song. Plays to other users like insta live emotes

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route
          index
          element={
            <Suspense>
              <Public />
            </Suspense>
          }
        />

        <Route element={<PersistLogin />}>
          <Route path='feed' element={<DashLayout />}>
            <Route index element={<Feed type='HOME' />} />
            <Route path='trend' element={<Feed type='TREND' />} />
            <Route path='sub' element={<Feed type='SUB' />} />
            <Route path='saved' element={<Feed type='SAVED' />} />
          </Route>
          <Route path='user' element={<DashLayout />}>
            <Route
              path=':id'
              element={
                <Suspense>
                  <UserPage />
                </Suspense>
              }
            />
            <Route
              path='edit'
              element={
                <Suspense>
                  <EditUser />
                </Suspense>
              }
            />
          </Route>
          <Route path='tag' element={<DashLayout />}>
            <Route
              path=':id'
              element={
                <Suspense>
                  <TagPage />
                </Suspense>
              }
            />
          </Route>
          <Route path='post' element={<DashLayout />}>
            <Route
              path=':id'
              element={
                <Suspense>
                  <PostPage />
                </Suspense>
              }
            />
          </Route>
          <Route path='broadcast' element={<DashLayout />}>
            <Route
              index
              element={
                <Suspense>
                  <BroadcastPage />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
