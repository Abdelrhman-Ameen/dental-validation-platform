"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { BrainCircuit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DATASET_VERSION, DEFAULT_AI_MODEL } from "@/lib/constants";
import { db } from "@/lib/firebase/client";

export function ModelForm() {
  const [modelName, setModelName] = useState(DEFAULT_AI_MODEL.modelName);
  const [score, setScore] = useState(String(DEFAULT_AI_MODEL.score));
  const [precision, setPrecision] = useState(String(DEFAULT_AI_MODEL.precision));
  const [recall, setRecall] = useState(String(DEFAULT_AI_MODEL.recall));
  const [f1, setF1] = useState(String(DEFAULT_AI_MODEL.f1));
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "ai_models"), {
        modelName,
        score: Number(score),
        precision: Number(precision),
        recall: Number(recall),
        f1: Number(f1),
        datasetVersion: DATASET_VERSION,
        createdAt: serverTimestamp()
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          Add AI model
        </CardTitle>
        <CardDescription>AI models appear as leaderboard participants for the dataset version.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="modelName">Model name</Label>
            <Input id="modelName" value={modelName} onChange={(event) => setModelName(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="score">Score</Label>
            <Input id="score" type="number" min="0" max="100" value={score} onChange={(event) => setScore(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="precision">Precision</Label>
            <Input id="precision" type="number" min="0" max="1" step="0.001" value={precision} onChange={(event) => setPrecision(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recall">Recall</Label>
            <Input id="recall" type="number" min="0" max="1" step="0.001" value={recall} onChange={(event) => setRecall(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="f1">F1</Label>
            <Input id="f1" type="number" min="0" max="1" step="0.001" value={f1} onChange={(event) => setF1(event.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <Button disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save model
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
