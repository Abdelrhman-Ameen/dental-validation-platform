import { DATASET_VERSION, DENTAL_CONDITIONS, type DentalCondition, type QuestionDoc } from "./types.js";
import { db } from "./admin.js";

export async function buildAnalytics(datasetVersion = DATASET_VERSION) {
  const [attemptsSnap, questionsSnap, modelsSnap] = await Promise.all([
    db.collection("quiz_attempts").where("datasetVersion", "==", datasetVersion).get(),
    db.collection("questions").where("datasetVersion", "==", datasetVersion).get(),
    db.collection("ai_models").where("datasetVersion", "==", datasetVersion).get()
  ]);

  const attempts = attemptsSnap.docs.map((doc) => doc.data());
  const questions = new Map<string, QuestionDoc>();
  questionsSnap.docs.forEach((doc) => questions.set(doc.id, doc.data() as QuestionDoc));

  const totalParticipants = attempts.length;
  const averageHumanScore = totalParticipants
    ? attempts.reduce((sum, attempt) => sum + (attempt.totalScore || 0), 0) / totalParticipants
    : 0;
  const modelScores = modelsSnap.docs.map((doc) => Number(doc.data().score) || 0);
  const averageAiScore = modelScores.length ? modelScores.reduce((sum, score) => sum + score, 0) / modelScores.length : 0;
  const topDoctorScore = attempts.reduce((max, attempt) => Math.max(max, attempt.totalScore || 0), 0);

  const questionStats = new Map<string, { correct: number; total: number }>();
  const timeBuckets = [
    { label: "Q1-Q5", seconds: 0, count: 0 },
    { label: "Q6-Q10", seconds: 0, count: 0 },
    { label: "Q11-Q15", seconds: 0, count: 0 },
    { label: "Q16-Q20", seconds: 0, count: 0 }
  ];
  const matrix = new Map<string, { actual: DentalCondition; predicted: DentalCondition; count: number }>();

  attempts.forEach((attempt) => {
    (attempt.answers || []).forEach((answer: Record<string, unknown>, index: number) => {
      const questionId = String(answer.questionId);
      const stats = questionStats.get(questionId) || { correct: 0, total: 0 };
      stats.total += 1;
      if (answer.correct) {
        stats.correct += 1;
      }
      questionStats.set(questionId, stats);

      const bucket = timeBuckets[Math.min(3, Math.floor(index / 5))];
      bucket.seconds += Number(answer.timeSpent) || 0;
      bucket.count += 1;

      const actual = questions.get(questionId)?.correctAnswer;
      const predicted = answer.selectedAnswer as DentalCondition | undefined;
      if (actual && predicted && DENTAL_CONDITIONS.includes(predicted)) {
        const key = `${actual}_${predicted}`;
        const current = matrix.get(key) || { actual, predicted, count: 0 };
        current.count += 1;
        matrix.set(key, current);
      }
    });
  });

  const questionAccuracy = [...questionStats.entries()].map(([questionId, stats]) => ({
    questionId,
    accuracy: stats.total ? stats.correct / stats.total : 0
  }));
  const hardestQuestion = questionAccuracy.sort((a, b) => a.accuracy - b.accuracy)[0];
  const easiestQuestion = [...questionAccuracy].sort((a, b) => b.accuracy - a.accuracy)[0];

  const distribution = [
    { bucket: "0-25%", count: 0 },
    { bucket: "26-50%", count: 0 },
    { bucket: "51-75%", count: 0 },
    { bucket: "76-90%", count: 0 },
    { bucket: "91-100%", count: 0 }
  ];
  attempts.forEach((attempt) => {
    const accuracy = Number(attempt.accuracy) || 0;
    if (accuracy <= 0.25) distribution[0].count += 1;
    else if (accuracy <= 0.5) distribution[1].count += 1;
    else if (accuracy <= 0.75) distribution[2].count += 1;
    else if (accuracy <= 0.9) distribution[3].count += 1;
    else distribution[4].count += 1;
  });

  return {
    datasetVersion,
    totalParticipants,
    averageHumanScore,
    averageAiScore,
    topDoctorScore,
    hardestQuestion,
    easiestQuestion,
    accuracyDistribution: distribution,
    timeAnalysis: timeBuckets.map((bucket) => ({
      label: bucket.label,
      seconds: bucket.count ? Math.round(bucket.seconds / bucket.count) : 0
    })),
    confusionMatrix: [...matrix.values()]
  };
}
