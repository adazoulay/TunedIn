import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./Features/Auth/Login";
import DashLayout from "./components/DashLayout";
import Feed from "./Features/posts/Feed";
import UserPage from "./Features/users/UserPage";

const userId = "63bb65f49f39741850f597f9";

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
          <Route index element={<UserPage userId={userId} />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
