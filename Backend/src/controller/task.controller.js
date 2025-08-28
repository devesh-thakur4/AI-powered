const { model } = require("mongoose");
const taskModel = require("../models/task.model");
const Memory = require("../models/memory.model")
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)


module.exports.getAllTask = async (req, res) => {

    try {
        const tasks = await taskModel.find()
        res.status(200).json(tasks)
    } catch (error) {
        res.status(200).json({
            message: "failed the task"
        })
    }
}

module.exports.createTask = async (req, res) => {

    try {
        const { title, description, createdBy } = req.body

        const newtask = await taskModel.create({
            title,
            description,
            createdBy,
        })
        res.status(201).json(newtask)
        console.log(req.body)

    } catch (error) {
        res.status(500).json({
            message: "failed task not create"
        })
    }

}


module.exports.deleteTask = async (req, res) => {
    try {
        await taskModel.findByIdAndDelete(req.params.id);
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({
            message: "failed to delete task"
        })
    }
}



/// Generate AI
module.exports.GenerateTask = async (req, res) => {
  const { prompt, userId } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ message: "Prompt and userId are required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Load user memory
    let userMemory = await Memory.findOne({ userId });
    if (!userMemory) {
      userMemory = await Memory.create({ userId, history: [] });
    }

    // Add user message
    userMemory.history.push({ role: "user", text: prompt });

    // 👉 Inject system context (real-time data, but as a user-style note)
    const today = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    const systemNote = {
      role: "user",
      parts: [{ text: `Note: Today's date/time is ${today}. Use this info when relevant.` }]
    };

    const conversation = [
      systemNote, // prepend system note
      ...userMemory.history.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }))
    ];

    // Get AI reply
    const result = await model.generateContent({ contents: conversation });
    const responseText = result.response.text();

    // Save AI reply in memory
    userMemory.history.push({ role: "model", text: responseText });
    await userMemory.save();

    res.status(200).json({ reply: responseText });

  } catch (error) {
    console.log("AI error", error);
    res.status(500).json({ message: "AI failed" });
  }
};




// Get full chat history for a user
module.exports.getChatHistory = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const userMemory = await Memory.findOne({ userId });

    if (!userMemory) {
      return res.json({ history: [] }); // no chat yet
    }

    res.json({ history: userMemory.history });
  } catch (error) {
    console.error("Failed to fetch chat history", error);
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
};



// Clear chat history for a user
module.exports.clearChatHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    await Memory.findOneAndUpdate(
      { userId },
      { history: [] },   // clear messages
      { new: true }
    );
    res.json({ success: true, message: "Chat history cleared" });
  } catch (error) {
    console.error("Failed to clear chat", error);
    res.status(500).json({ message: "Failed to clear chat" });
  }
};
