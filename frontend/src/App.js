import { Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import Public from "./components/sections/Public";
import Layout from "./components/layout/Layout";
import DashLayout from "./components/layout/DashLayout";
import Feed from "./Features/posts/Feed";
import PersistLogin from "./Features/Auth/PersistLogin";
import PostPage from "./Features/posts/PostPage";

//! Lazy
const UserPage = lazy(() => import("./Features/users/UserPage"));
const EditUser = lazy(() => import("./Features/users/EditUser"));
const TagPage = lazy(() => import("./Features/tags/TagPage"));

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Public />} />
        <Route element={<PersistLogin />}>
          <Route path='feed' element={<DashLayout />}>
            <Route index element={<Feed type='HOME' />} />
            <Route path='trend' element={<Feed type='TREND' />} />
            <Route path='sub' element={<Feed type='SUB' />} />
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
            <Route path=':id' element={<PostPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
