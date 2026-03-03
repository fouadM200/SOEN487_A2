import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState<"success" | "error" | "">("");
    const navigate = useNavigate();

    async function handleUpload() {
        setMsg("");
        if (!file) {
            setMsg("Please choose a file first.");
            setMsgType("error");
            return;
        }

        const form = new FormData();
        form.append("photo", file);

        const res = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: form,
        });

        const data = await res.json();

        if (res.ok) {
            setMsg("Photo Uploaded successfully!");
            setMsgType("success");
        } else {
            setMsg(data.message);
            setMsgType("error");
        }
    }

    async function handleReturn() {
        navigate("/");
    }

    return (
        <div className="homepage">
            <div className="app-card homepage-card">
                <h1 className="homepage-title">Upload a photo</h1>

                <input
                    id="fileInput"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    style={{ display: "none" }}
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />

                <label htmlFor="fileInput" className="choose-btn">
                    Choose a photo
                </label>

                {file && (
                    <div className="preview">
                        <h2 className="preview-title">{file.name}</h2>
                        <img
                            className="preview-img"
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                        />
                    </div>
                )}

                {msg && (
                    <p
                        style={{
                            marginTop: 12,
                            fontWeight: 700,
                            color: msgType === "success" ? "green" : "red",
                        }}
                    >
                        {msg}
                    </p>
                )}

                <div style={{ marginTop: 16 }}>
                    <button className="homepage-btn" onClick={handleUpload}>
                        Upload
                    </button>
                </div>

                <div style={{ marginTop: 16 }}>
                    <button className="homepage-btn-outline" onClick={handleReturn}>
                        Return to Homepage
                    </button>
                </div>

            </div>
        </div>
    );
}