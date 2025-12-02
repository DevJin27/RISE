import { callModel } from "../utils/callModel.js";

const handleMentorQuery = async (req, res) => {
  try {
    const { mode, message, stream = false } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const FAST_MODEL = process.env.FAST_MODEL;
    const SMART_MODEL = process.env.SMART_MODEL;

    // Pick correct model
    let model = FAST_MODEL;
    if (["debug", "mock", "explain", "recommend"].includes(mode)) {
      model = SMART_MODEL;
    }

    const systemPrompt = buildSystemPrompt(mode);

    // STREAMING CASE
    if (stream) {
      const resp = await callModel({
        model,
        system: systemPrompt,
        prompt: message,
        stream: true,
      });

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();

      const pump = async () => {
        const { done, value } = await reader.read();
        if (done) return res.end();

        const chunk = decoder.decode(value);
        res.write(chunk);
        pump();
      };

      pump();
      return;
    }

    // NON-STREAMING CASE
    const text = await callModel({
      model,
      system: systemPrompt,
      prompt: message,
    });

    res.json({
      success: true,
      model,
      response: text,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

function buildSystemPrompt(mode) {
  switch (mode) {
    case "debug":
      return "You are a debugging expert. Diagnose user code with precise fixes.";
    case "mock":
      return "You are a senior interviewer. Ask DSA questions and evaluate answers.";
    case "explain":
      return "You are a world-class DSA tutor. Explain concepts intuitively.";
    case "recommend":
      return "Recommend LeetCode problems based on skill gaps.";
    default:
      return "You are a friendly, helpful DSA mentor.";
  }
}

export const mentorController = {
  handleMentorQuery,
};
