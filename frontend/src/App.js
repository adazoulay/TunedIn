import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./Features/Auth/Login";
import DashLayout from "./components/DashLayout";
import Feed from "./Features/posts/Feed";
import UserPage from "./Features/users/UserPage";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Public />} />
        <Route path='login' element={<Login />} />
        <Route path='feed' element={<DashLayout />}>
          <Route index element={<Feed />} />
        </Route>
        <Route path='user' element={<DashLayout />}>
          <Route index element={<UserPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
