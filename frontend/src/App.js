import { Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import Layout from "./components/layout/Layout";
import DashLayout from "./components/layout/DashLayout";
import Feed from "./Features/posts/Feed";
import PersistLogin from "./Features/Auth/PersistLogin";
import Test from "./Features/Test";

//! Lazy
import BroadcastPage from "./Features/comments/BroadcastPage";

const UserPage = lazy(() => import("./Features/users/UserPage"));
const EditUser = lazy(() => import("./Features/users/EditUser"));
const TagPage = lazy(() => import("./Features/tags/TagPage"));
const PostPage = lazy(() => import("./Features/posts/PostPage"));
const Public = lazy(() => import("./components/layout/publicPage/Public"));

//!TODO
//! Fix feed

//!Video overlay post
//! Add Img/Gif as tag background
//! Broadcast page

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
          <Route path='test' element={<DashLayout />}>
            <Route index element={<Test />} />
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
