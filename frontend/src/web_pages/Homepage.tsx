import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import "../css/Homepage.css";
import type {JSX} from "react";

export default function HomePage(): JSX.Element {
    const navigate = useNavigate();

    function handleUploadClick(): void {
        navigate("/upload");
    }

    function handleDisplayClick(): void {
        navigate("/display");
    }

    return (
        <div className="homepage">
            <div className="app-card homepage-card">
                <h1 className="homepage-title">Welcome to your photo gallery page!</h1>

                <div className="homepage-actions">
                    <Button name="Upload a photo" onClick={handleUploadClick} className="homepage-btn" />
                    <Button name="Display photos" onClick={handleDisplayClick} className="homepage-btn" />
                </div>
            </div>
        </div>
    );
}