import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./Features/Auth/Login";
import DashLayout from "./components/DashLayout";
import Feed from "./Features/posts/Feed";
import UserPage from "./Features/users/UserPage";
import TagPage from "./Features/tags/TagPage";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Public />} />
        <Route path='login' element={<Login />} />
        <Route path='feed' element={<DashLayout />}>
          <Route index element={<Feed type='HOME' />} />
        </Route>
        <Route path='user' element={<DashLayout />}>
          <Route path=':id' element={<UserPage />} />
        </Route>
        <Route path='tag' element={<DashLayout />}>
          <Route path=':id' element={<TagPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
