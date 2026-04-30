import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { TaskDetail } from "./pages/TaskDetail";
import { NotificationProvider } from "./components/NotificationContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/task/:id" element={<TaskDetail />} />
          </Routes>
        </Layout>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
