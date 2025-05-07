import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Question_Type from "./pages/Question_Type";
import Text_Input from "./pages/Text_Input";
import Output from "./pages/Output";
import Previous from "./pages/Previous";
import NotFound from "./pages/PageNotFound";
import Analytics from "./pages/Analytics";
import Collaborate from "./pages/Collaborate";
import VoiceToQuiz from "./pages/VoiceToQuiz";
import YouTubeQuiz from "./pages/YouTubeQuiz";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/question-type" element={<Question_Type />} />
        <Route path="/text-input" element={<Text_Input />} />
        <Route path="/output" element={<Output />} />
        <Route path="/previous" element={<Previous />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/collaborate" element={<Collaborate />} />
        <Route path="/voice-to-quiz" element={<VoiceToQuiz />} />
        <Route path="/youtube-quiz" element={<YouTubeQuiz />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
