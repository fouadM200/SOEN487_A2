import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./web_pages/Homepage";
import UploadPage from "./web_pages/UploadPage";
import DisplayPhotos from "./web_pages/DisplayPhotos.tsx";
import "./css/App.css";
import type {JSX} from "react";

export default function App(): JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/display" element={<DisplayPhotos />} />
            </Routes>
        </BrowserRouter>
    );
}