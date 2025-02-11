import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve frontend files from /public

// Root Route: Serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.resolve("public/index.html"));
});

// API to generate ephemeral key (for WebRTC authentication)
app.get("/session", async (req, res) => {
    try {
        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-realtime-preview-2024-12-17",
                voice: "verse",
            }),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error generating ephemeral key:", error);
        res.status(500).json({ error: "Failed to generate key" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
