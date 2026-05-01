import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

  app.use(express.json({ limit: "1mb" }));

  app.get("/healthz", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  // API Route for placing orders and "sending" confirmation email
  app.post("/api/order", async (req, res) => {
    const { orderDetails, userEmail } = req.body;

    if (!orderDetails || !userEmail) {
      return res.status(400).json({ error: "Missing order details or email" });
    }

    try {
      // Simulate sending email
      console.log(`[Email Service] Preparing order confirmation for: ${userEmail}`);
      
      let emailContent = "";
      
      // Use Gemini to generate a professional B2B email if key is present
      if (ai) {
        const prompt = `
          Generate a professional B2B order confirmation email for TBS (The Beverage System).
          Recipient Email: ${userEmail}
          Order Details: ${JSON.stringify(orderDetails, null, 2)}
          
          Include:
          - A warm, professional B2B greeting.
          - Order ID (generate a realistic one like TBS-XXXX).
          - Itemized list of products with quantities and subtotal.
          - Total estimated price.
          - A note about shipping and that a dedicated TBS manager will contact them shortly.
          - Spanish language as the app is in Spanish.
          
          Return only the plain text email body.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ parts: [{ text: prompt }] }],
        });
        
        emailContent = response.text || "Error generating content";
      } else {
        emailContent = "Order Received. (Gemini API Key missing for professional formatting)";
      }

      console.log("--- SIMULATED EMAIL START ---");
      console.log(`To: ${userEmail}`);
      console.log(`Subject: Confirmación de Pedido TBS`);
      console.log(emailContent);
      console.log("--- SIMULATED EMAIL END ---");

      res.json({ 
        success: true, 
        message: "Order placed successfully! Confirmation email simulated in console.",
        preview: emailContent 
      });
    } catch (error) {
      console.error("Order processing error:", error);
      res.status(500).json({ error: "Failed to process order" });
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
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
