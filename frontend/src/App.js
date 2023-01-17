import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import DashLayout from "./components/DashLayout";
import Feed from "./Features/posts/Feed";
import UserPage from "./Features/users/UserPage";
import TagPage from "./Features/tags/TagPage";
import Signin from "./Features/Auth/Signin";
import SignUp from "./Features/Auth/Signup";
import PersistLogin from "./Features/Auth/PersistLogin";
import NewPost from "./Features/posts/NewPost";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Public />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<SignUp />} />
        {/*  */}
        <Route element={<PersistLogin />}>
          <Route path='feed' element={<DashLayout />}>
            <Route index element={<Feed type='HOME' />} />
            <Route path='trend' element={<Feed type='TREND' />} />
            <Route path='sub' element={<Feed type='SUB' />} />
          </Route>
          <Route path='user' element={<DashLayout />}>
            <Route path=':id' element={<UserPage />} />
          </Route>
          <Route path='tag' element={<DashLayout />}>
            <Route path=':id' element={<TagPage />} />
          </Route>
          <Route path='post' element={<DashLayout />}>
            <Route path='new' element={<NewPost />} />
          </Route>
        </Route>
      </Route>
      {/*  */}
    </Routes>
  );
}

export default App;
