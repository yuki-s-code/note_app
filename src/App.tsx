import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import "tailwindcss/tailwind.css";
import Board from "./components/board/Board";
import TaskApp from "./components/task/TaskApp";
import Note from "./components/note/Note";
import HomePage from "./components/topage/Page1"; // Page1をHomePageにリネーム
import ErrorPage from "./components/ErrorPage";
import { Root } from "./routes/Root";
import Login from "./routes/Login";
import UserCreate from "./components/login/UserCreate";
import MyPage from "./components/topage/MyPage";
import { MessageIlust } from "./components/message/MessageIlust";
import { NoteApp } from "./components/note/NoteApp";
import { JournalApp } from "./components/note/calendar/JournalApp";
import { Drawer } from "./components/note/drawer/Drawer";
import { JournalDrawer } from "./components/note/calendar/JournalDrawer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function ErrorFallback({ error }: any) {
  return <div>エラーが発生しました: {error.message}</div>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<ErrorPage />} />
            <Route path="/root" element={<Root />}>
              <Route index element={<HomePage />} /> {/* HomePageに変更 */}
              <Route path="sign" element={<UserCreate />} />
              <Route path="profile" element={<MyPage />} />
              <Route path="news" element={<Board />} />
              <Route path="task" element={<TaskApp />} />
              <Route path="message" element={<MessageIlust />} />
              <Route path="note" element={<Note />}>
                <Route path=":noteId" element={<NoteApp />}>
                  <Route path=":mentionId" element={<Drawer />} />
                </Route>
                <Route path="journals/:ymday" element={<JournalApp />}>
                  <Route path=":mentionId" element={<JournalDrawer />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  );
}
