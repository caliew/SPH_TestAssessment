import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { TaskDetail } from "./pages/TaskDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/task/:id" element={<TaskDetail />} />
    </Routes>
  );
}

export default App;
