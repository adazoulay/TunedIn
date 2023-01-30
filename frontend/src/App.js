import { Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import Public from "./components/Public";
import DashLayout from "./components/DashLayout";
import Feed from "./Features/posts/Feed";
import PersistLogin from "./Features/Auth/PersistLogin";
import PostPage from "./Features/posts/PostPage";

//! Lazy
import Signin from "./Features/Auth/Signin";
import SignUp from "./Features/Auth/Signup";

// const Signin = lazy(() => import("./Features/Auth/Signin"));
// const SignUp = lazy(() => import("./Features/Auth/Signup"));
const UserPage = lazy(() => import("./Features/users/UserPage"));
const EditUser = lazy(() => import("./Features/users/EditUser"));
const TagPage = lazy(() => import("./Features/tags/TagPage"));
const NewPost = lazy(() => import("./Features/posts/NewPost"));
const NewTag = lazy(() => import("./Features/tags/NewTag"));

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Public />} />
        {/* <Route
          path='/signin'
          element={
            <Suspense>
              <Signin />
            </Suspense>
          }
        />
        <Route
          path='/signup'
          element={
            <Suspense>
              <SignUp />
            </Suspense>
          }
        /> */}
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<SignUp />} />
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
            <Route
              path='new'
              element={
                <Suspense>
                  <NewTag />
                </Suspense>
              }
            />
          </Route>
          <Route path='post' element={<DashLayout />}>
            <Route
              path='new'
              element={
                <Suspense>
                  <NewPost />
                </Suspense>
              }
            />
            <Route path=':id' element={<PostPage />} />
          </Route>
        </Route>
      </Route>
      {/*  */}
    </Routes>
  );
}

export default App;
