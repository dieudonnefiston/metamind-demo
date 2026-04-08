import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function MetaMindDemo() {
  const [prompt, setPrompt] = useState("");
  const [rawOutput, setRawOutput] = useState("");
  const [critique, setCritique] = useState("");
  const [finalOutput, setFinalOutput] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [risk, setRisk] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔥 REAL API CALL (replace with your backend endpoint)
  const callAPI = async (prompt) => {
    const res = await fetch("/api/metamind", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    return res.json();
  };

  const runDemo = async () => {
    setLoading(true);

    try {
      const res = await callAPI(prompt);

      setRawOutput(res.raw);
      setCritique(res.critique);
      setFinalOutput(res.final);
      setConfidence(res.confidence);
      setRisk(res.risk);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto grid gap-8">
      <h1 className="text-4xl font-bold tracking-tight">
        MetaMind AI
      </h1>
      <p className="text-muted-foreground">
        AI that evaluates and improves its own thinking in real time
      </p>

      <Card className="shadow-xl rounded-2xl">
        <CardContent className="p-6">
          <Textarea
            placeholder="Enter a prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            className="mt-4 w-full"
            onClick={runDemo}
            disabled={loading}
          >
            {loading ? "Thinking..." : "Run MetaMind"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-2">Raw AI Output</h2>
              <p className="text-sm whitespace-pre-line">{rawOutput}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="rounded-2xl shadow-lg border-yellow-400">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-2">Critique Layer</h2>
              <p className="text-sm mb-4 whitespace-pre-line">{critique}</p>

              <div className="mb-2 text-xs">Confidence</div>
              <Progress value={confidence} />

              <div className="mt-4 mb-2 text-xs">Risk Level</div>
              <Progress value={risk} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="rounded-2xl shadow-xl border-green-400">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-2">Final Output</h2>
              <p className="text-sm whitespace-pre-line">{finalOutput}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

/* ================= BACKEND EXAMPLE (Node.js / Next.js API) =================

export default async function handler(req, res) {
  const { prompt } = req.body;

  const raw = await callLLM(prompt);

  const critique = await callLLM(`
  Critique this response for accuracy, safety, and logic:\n${raw}
  `);

  const final = await callLLM(`
  Improve this response using the critique:\n
  Response: ${raw}\n
  Critique: ${critique}
  `);

  res.json({
    raw,
    critique,
    final,
    confidence: 70,
    risk: 30,
  });
}

================================================================ */
