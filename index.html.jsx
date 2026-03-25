import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const choices = ["가위", "바위", "보"];

function getWinner(player, computer) {
  if (player === computer) return "draw";
  if (
    (player === "가위" && computer === "보") ||
    (player === "바위" && computer === "가위") ||
    (player === "보" && computer === "바위")
  ) return "win";
  return "lose";
}

export default function Game() {
  const [score, setScore] = useState({ win: 0, lose: 0 });
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [dark, setDark] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const play = (playerChoice) => {
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    const result = getWinner(playerChoice, computerChoice);

    let newScore = { ...score };
    if (result === "win") newScore.win++;
    if (result === "lose") newScore.lose++;

    const total = newScore.win + newScore.lose;
    const winRate = total ? (newScore.win / total) * 100 : 0;

    setScore(newScore);
    setHistory([...history, { game: history.length + 1, winRate }]);

    if (newScore.win === 3) {
      setMessage("🎉 축하합니다! 승리했습니다!");
    } else if (newScore.lose === 3) {
      setMessage("😢 아쉽네요! 다음엔 이길 수 있어요!");
    } else {
      setMessage(`${playerChoice} vs ${computerChoice} → ${result}`);
    }
  };

  const reset = () => {
    setScore({ win: 0, lose: 0 });
    setHistory([]);
    setMessage("");
  };

  return (
    <div className={dark ? "bg-black text-white min-h-screen p-6" : "bg-white text-black min-h-screen p-6"}>
      <div className="flex justify-end gap-2 mb-4">
        <Button onClick={() => setDark(!dark)}>다크모드</Button>
        <Button onClick={() => setShowStats(!showStats)}>승률 보기</Button>
      </div>

      <Card className="p-4 mb-4">
        <CardContent>
          <h2 className="text-xl font-bold">점수판</h2>
          <p>승: {score.win} / 패: {score.lose}</p>
        </CardContent>
      </Card>

      <div className="flex gap-4 mb-4">
        {choices.map((c) => (
          <Button key={c} onClick={() => play(c)} disabled={score.win === 3 || score.lose === 3}>
            {c}
          </Button>
        ))}
      </div>

      {message && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-lg font-bold mb-4"
        >
          {message}
        </motion.div>
      )}

      {(score.win === 3 || score.lose === 3) && (
        <Button onClick={reset}>다시하기</Button>
      )}

      {showStats && (
        <Card className="mt-6 p-4">
          <CardContent>
            <h2 className="text-xl font-bold mb-4">승률 그래프</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history}>
                <XAxis dataKey="game" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monoton