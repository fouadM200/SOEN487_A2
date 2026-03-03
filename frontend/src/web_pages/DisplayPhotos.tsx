import { type JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../css/Homepage.css";

type PhotoItem = {
    _id: string;
    filename: string;
    uploadDate: string;
    imageBase64: string;
    contentType?: string;
};

export default function DisplayPhotos(): JSX.Element {
    const navigate = useNavigate();

    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState<"success" | "error" | "">("");

    async function loadPhotos(): Promise<void> {
        try {
            setMsg("");
            setMsgType("");

            const res = await fetch("http://localhost:5000/photos");
            const data = await res.json();

            if (!res.ok) {
                setMsg(data.message ?? "Failed to load photos");
                setMsgType("error");
                return;
            }

            setPhotos(data);
        } catch {
            setMsg("Server unreachable.");
            setMsgType("error");
        }
    }

    useEffect(() => {
        loadPhotos();
    }, []);

    async function handleDelete(id: string): Promise<void> {
        try {
            setMsg("");
            setMsgType("");

            const res = await fetch(`http://localhost:5000/photos/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                setMsg(data.message ?? "Delete failed");
                setMsgType("error");
                return;
            }

            setPhotos((prev) => prev.filter((p) => p._id !== id));
            setMsg("Photo deleted successfully!");
            setMsgType("success");
        } catch {
            setMsg("Server unreachable.");
            setMsgType("error");
        }
    }

    function handleReturn(): void {
        navigate("/");
    }

    return (
        <div className="homepage">
            <div className="app-card homepage-card display-card">
                <h1 className="homepage-title">Photo Gallery</h1>

                {photos.length === 0 ? (
                    <p className="empty-text">No photos uploaded yet.</p>
                ) : (
                    <div className="photos-grid">
                        {photos.map((p) => {
                            const contentType = p.contentType ?? "image/jpeg";
                            const src = `data:${contentType};base64,${p.imageBase64}`;

                            return (
                                <div key={p._id} className="photo-item">
                                    <img src={src} alt={p.filename} className="photo-img" />

                                    <div className="photo-details">
                                        <div className="photo-filename">{p.filename}</div>

                                        <div className="photo-date">
                                            <span className="photo-date-label">Upload date:</span>{" "}
                                            {new Date(p.uploadDate).toLocaleString()}
                                        </div>

                                        <button className="delete-btn" onClick={() => handleDelete(p._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {msg && (
                    <p className={`msg ${msgType === "success" ? "msg-success" : "msg-error"}`}>
                        {msg}
                    </p>
                )}

                <div className="return-row">
                    <Button
                        name="Return to Homepage"
                        onClick={handleReturn}
                        className="homepage-btn-outline"
                    />
                </div>
            </div>
        </div>
    );
}