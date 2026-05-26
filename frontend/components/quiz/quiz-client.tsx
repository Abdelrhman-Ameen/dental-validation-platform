"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock, Eye, Loader2, Send, TimerReset } from "lucide-react";
import { AppShell } from "@/components/common/app-shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ImageViewer } from "@/components/quiz/image-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DENTAL_CONDITIONS, FDI_TOOTH_GROUPS, FDI_TOOTH_ORDER, QUESTION_TIMER_SECONDS, totalTimerFor } from "@/lib/constants";
import { submitQuizAttempt } from "@/lib/functions";
import type { DentalCondition, QuizAnswerInput, ToothFinding } from "@/lib/types";
import { cn, formatSeconds } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useQuizQuestions } from "@/hooks/useQuiz";

type Feedback = {
  aiFindings: ToothFinding[];
  referenceFindings: ToothFinding[];
};

function deviceType() {
  if (typeof navigator === "undefined") {
    return "unknown";
  }
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? "mobile" : "desktop";
}

function sortTeeth(teeth: string[]) {
  return [...new Set(teeth)].sort((a, b) => FDI_TOOTH_ORDER.indexOf(a) - FDI_TOOTH_ORDER.indexOf(b));
}

function findingKey(finding: ToothFinding) {
  return `${finding.condition}:${sortTeeth(finding.toothIds).join(",")}`;
}

function FindingLine({
  label,
  findings,
  referenceFindings
}: {
  label: string;
  findings: ToothFinding[];
  referenceFindings: ToothFinding[];
}) {
  const referenceKeys = new Set(referenceFindings.map(findingKey));

  return (
    <div className="text-sm">
      <span className="font-medium">{label}: </span>
      {findings.length ? (
        <span className="inline-flex flex-wrap gap-1.5 align-middle">
          {findings.map((finding) => {
            const matched = referenceKeys.has(findingKey(finding));
            return (
              <span
                key={findingKey(finding)}
                className={cn(
                  "rounded-md px-1.5 py-0.5",
                  matched ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30" : "text-foreground"
                )}
              >
                {finding.condition}: {sortTeeth(finding.toothIds).join(", ") || "no tooth selected"}
              </span>
            );
          })}
        </span>
      ) : (
        <span>No listed finding.</span>
      )}
    </div>
  );
}

async function loadFeedback(questionId: string) {
  const response = await fetch("/api/question-feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ questionId })
  });
  if (!response.ok) {
    throw new Error("Could not load model answer.");
  }
  return (await response.json()) as Feedback;
}

export function QuizClient() {
  return (
    <AuthGuard role="doctor">
      <AppShell>
        <QuizWorkspace />
      </AppShell>
    </AuthGuard>
  );
}

function QuizWorkspace() {
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();
  const { questions, loading, error } = useQuizQuestions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_TIMER_SECONDS);
  const [totalLeft, setTotalLeft] = useState(() => totalTimerFor(20)); // Will be updated once questions load
  const [startedAt] = useState(() => new Date().toISOString());
  const [answers, setAnswers] = useState<Record<string, QuizAnswerInput>>({});
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const currentFeedback = currentQuestion ? feedback[currentQuestion.id] : undefined;
  const answeredCount = useMemo(
    () => Object.values(answers).filter((answer) => answer.selectedFindings.some((finding) => finding.toothIds.length)).length,
    [answers]
  );

  // Set the total timer once questions are loaded
  useEffect(() => {
    if (questions.length > 0) {
      setTotalLeft(totalTimerFor(questions.length));
    }
  }, [questions.length]);

  useEffect(() => {
    if (!currentQuestion) {
      return;
    }
    const existing = answers[currentQuestion.id]?.timeSpent || 0;
    setSecondsLeft(Math.max(0, QUESTION_TIMER_SECONDS - existing));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, currentQuestion?.id]);

  useEffect(() => {
    if (!currentQuestion || submitting || currentFeedback) {
      return;
    }
    const interval = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(0, value - 1));
      setTotalLeft((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [currentQuestion, currentFeedback, submitting]);

  useEffect(() => {
    if (!currentQuestion || submitting || currentFeedback) {
      return;
    }
    if (secondsLeft === 0) {
      void revealAnswer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  useEffect(() => {
    if (totalLeft === 0 && questions.length && !submitting) {
      void handleSubmit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalLeft]);

  function persistCurrentTime() {
    if (!currentQuestion) {
      return answers;
    }
    const spent = QUESTION_TIMER_SECONDS - secondsLeft;
    const nextAnswers: Record<string, QuizAnswerInput> = {
      ...answers,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedFindings: answers[currentQuestion.id]?.selectedFindings || [],
        timeSpent: Math.max(answers[currentQuestion.id]?.timeSpent || 0, spent)
      }
    };
    setAnswers(nextAnswers);
    return nextAnswers;
  }

  function setFindings(questionId: string, updater: (findings: ToothFinding[]) => ToothFinding[]) {
    setAnswers((previous) => {
      const previousAnswer = previous[questionId] || {
        questionId,
        selectedFindings: [],
        timeSpent: QUESTION_TIMER_SECONDS - secondsLeft
      };
      return {
        ...previous,
        [questionId]: {
          ...previousAnswer,
          selectedFindings: updater(previousAnswer.selectedFindings),
          timeSpent: Math.max(previousAnswer.timeSpent || 0, QUESTION_TIMER_SECONDS - secondsLeft)
        }
      };
    });
  }

  function toggleCondition(condition: DentalCondition) {
    if (!currentQuestion || currentFeedback) {
      return;
    }
    setFindings(currentQuestion.id, (findings) => {
      if (findings.some((finding) => finding.condition === condition)) {
        return findings.filter((finding) => finding.condition !== condition);
      }
      return [...findings, { condition, toothIds: [] }];
    });
  }

  function toggleTooth(condition: DentalCondition, toothId: string) {
    if (!currentQuestion || currentFeedback) {
      return;
    }
    setFindings(currentQuestion.id, (findings) =>
      findings.map((finding) => {
        if (finding.condition !== condition) {
          return finding;
        }
        const hasTooth = finding.toothIds.includes(toothId);
        return {
          ...finding,
          toothIds: sortTeeth(hasTooth ? finding.toothIds.filter((id) => id !== toothId) : [...finding.toothIds, toothId])
        };
      })
    );
  }

  function goToQuestion(index: number) {
    persistCurrentTime();
    setCurrentIndex(Math.min(Math.max(index, 0), questions.length - 1));
  }

  async function revealAnswer() {
    if (!currentQuestion) {
      return;
    }
    const finalAnswers = persistCurrentTime();
    const answer = finalAnswers[currentQuestion.id];
    if (!answer?.selectedFindings.some((finding) => finding.toothIds.length)) {
      setSubmitError("Select at least one disease and one FDI tooth number before checking the answer.");
      return;
    }
    setSubmitError("");
    setFeedbackLoading(true);
    try {
      const nextFeedback = await loadFeedback(currentQuestion.id);
      setFeedback((previous) => ({
        ...previous,
        [currentQuestion.id]: nextFeedback
      }));
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not load model answer.");
    } finally {
      setFeedbackLoading(false);
    }
  }

  async function handleSubmit(timedOut = false) {
    const finalAnswers = persistCurrentTime();
    const payload: QuizAnswerInput[] = questions.map((question) => ({
      questionId: question.id,
      selectedFindings: finalAnswers[question.id]?.selectedFindings || [],
      timeSpent: finalAnswers[question.id]?.timeSpent || QUESTION_TIMER_SECONDS
    }));

    if (!timedOut && payload.some((answer) => !answer.selectedFindings.some((finding) => finding.toothIds.length))) {
      setSubmitError("Please select at least one disease and tooth number for every radiograph before submitting.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const scoredAttempt = await submitQuizAttempt({
        answers: payload,
        startedAt,
        browser: typeof navigator === "undefined" ? "unknown" : navigator.userAgent.split(" ").slice(-2).join(" "),
        device: deviceType(),
        userAgent: typeof navigator === "undefined" ? "unknown" : navigator.userAgent
      });
      void scoredAttempt;
      await refreshProfile();
      router.replace("/quiz/result");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not submit quiz attempt.");
    } finally {
      setSubmitting(false);
    }
  }

  if (profile?.hasCompletedQuiz) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Validation attempt already completed
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => router.push("/quiz/result")}>View result</Button>
            <Button variant="outline" onClick={() => router.push("/leaderboard")}>Open leaderboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading validation dataset
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No active questions</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Ask an admin to set questions to Live status for the current dataset version.
        </CardContent>
      </Card>
    );
  }

  const selectedFindings = currentAnswer?.selectedFindings || [];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">External validation quiz</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Dental radiograph diagnosis</h1>
          <p className="mt-2 text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}. Select every visible disease and the involved FDI tooth numbers.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1">
            <TimerReset className="h-3.5 w-3.5" />
            Question {formatSeconds(secondsLeft)}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3.5 w-3.5" />
            Total {formatSeconds(totalLeft)}
          </Badge>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {error}
        </div>
      ) : null}

      <Progress value={progress} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(420px,0.8fr)]">
        <ImageViewer imageUrl={currentQuestion.imageUrl} alt={`Question ${currentIndex + 1} dental radiograph`} />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <Badge variant={currentQuestion.difficulty === "hard" ? "warning" : "outline"}>
                {currentQuestion.difficulty}
              </Badge>
              <span className="text-sm text-muted-foreground">{answeredCount}/{questions.length} answered</span>
            </div>
            <CardTitle className="text-xl leading-7">{currentQuestion.questionText}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              {DENTAL_CONDITIONS.map((condition) => {
                const finding = selectedFindings.find((item) => item.condition === condition);
                const checked = Boolean(finding);
                return (
                  <div key={condition} className="rounded-lg border bg-background p-3">
                    <button
                      type="button"
                      onClick={() => toggleCondition(condition)}
                      className="flex w-full items-center justify-between text-left"
                      disabled={Boolean(currentFeedback)}
                    >
                      <span className="font-medium">{condition}</span>
                      <span className={cn("flex h-5 w-5 items-center justify-center rounded border", checked ? "border-primary bg-primary text-primary-foreground" : "border-border")}>
                        {checked ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                      </span>
                    </button>

                    {checked ? (
                      <div className="mt-3 space-y-3">
                        {FDI_TOOTH_GROUPS.map((group) => (
                          <div key={group.label}>
                            <p className="mb-1.5 text-xs font-medium text-muted-foreground">{group.label}</p>
                            <div className="grid grid-cols-8 gap-1">
                              {group.teeth.map((tooth) => {
                                const selected = finding?.toothIds.includes(tooth);
                                return (
                                  <button
                                    key={tooth}
                                    type="button"
                                    disabled={Boolean(currentFeedback)}
                                    onClick={() => toggleTooth(condition, tooth)}
                                    className={cn(
                                      "h-8 rounded-md border text-xs font-semibold transition",
                                      selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/60"
                                    )}
                                  >
                                    {tooth}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {currentFeedback ? (
              <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Eye className="h-4 w-4" />
                  Model and reference answer
                </div>
                <FindingLine label="Your answer" findings={selectedFindings} referenceFindings={currentFeedback.referenceFindings} />
                <FindingLine label="AI model" findings={currentFeedback.aiFindings} referenceFindings={currentFeedback.referenceFindings} />
                <FindingLine label="Reference answer" findings={currentFeedback.referenceFindings} referenceFindings={currentFeedback.referenceFindings} />
              </div>
            ) : null}

            {submitError ? (
              <div className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {submitError}
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => goToQuestion(currentIndex - 1)} disabled={currentIndex === 0 || submitting}>
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              {!currentFeedback ? (
                <Button onClick={() => void revealAnswer()} disabled={submitting || feedbackLoading}>
                  {feedbackLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                  Check answer
                </Button>
              ) : currentIndex < questions.length - 1 ? (
                <Button onClick={() => goToQuestion(currentIndex + 1)} disabled={submitting}>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => void handleSubmit(false)} disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Submit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
