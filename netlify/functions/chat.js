// netlify/functions/chat.js
export default async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const { message, lang } = await req.json();

    // Basit güvenlik: boş mesajı reddet
    if (!message || String(message).trim().length < 2) {
      return new Response(JSON.stringify({ reply: "" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const system = `
You are the assistant for YOLO Academic (study abroad consultancy).
Be concise, friendly, and practical.
You can:
- explain how the Program Finder works
- suggest next steps and what info is needed
- encourage booking the free intro call
You must NOT provide legal advice. For visa rules, direct users to official sources and say info may change.
Language: ${lang === "en" ? "English" : "Turkish"}.
`.trim();

    const apiKey = process.env.OPENAI_API_KEY;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: String(message) },
        ],
        temperature: 0.4,
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      return new Response(JSON.stringify({ error: err }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};