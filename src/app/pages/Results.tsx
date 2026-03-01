import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { Trophy, Users, Share2, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { toast } from 'sonner';

interface PollResults {
  option: string;
  yesCount: number;
  noCount: number;
  percentage: number;
}

export default function Results() {
  const { pollId } = useParams();
  const [poll, setPoll] = useState<any>(null);
  const [results, setResults] = useState<PollResults[]>([]);
  const [totalVoters, setTotalVoters] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [isUnanimous, setIsUnanimous] = useState(false);

  useEffect(() => {
    loadResults();
    
    // Simulate real-time updates
    const interval = setInterval(loadResults, 3000);
    return () => clearInterval(interval);
  }, [pollId]);

  const loadResults = () => {
    const pollData = localStorage.getItem(`poll_${pollId}`);
    if (pollData) {
      const data = JSON.parse(pollData);
      setPoll(data);
      calculateResults(data);
    } else if (pollId === 'demo') {
      // Demo results
      const demoData = {
        id: 'demo',
        title: 'Friday Dinner 🍽️',
        options: ['Pizza 🍕', 'Sushi 🍣', 'Burgers 🍔', 'Tacos 🌮'],
        votingType: 'anonymous',
        votes: {
          'User1': { 'Pizza 🍕': true, 'Sushi 🍣': false, 'Burgers 🍔': false, 'Tacos 🌮': true },
          'User2': { 'Pizza 🍕': true, 'Sushi 🍣': true, 'Burgers 🍔': false, 'Tacos 🌮': false },
          'User3': { 'Pizza 🍕': true, 'Sushi 🍣': false, 'Burgers 🍔': true, 'Tacos 🌮': false },
        }
      };
      setPoll(demoData);
      calculateResults(demoData);
    }
  };

  const calculateResults = (data: any) => {
    if (!data.votes || Object.keys(data.votes).length === 0) {
      setResults([]);
      setTotalVoters(0);
      return;
    }

    const voterIds = Object.keys(data.votes);
    setTotalVoters(voterIds.length);

    const optionResults: { [key: string]: { yes: number; no: number } } = {};
    
    data.options.forEach((option: string) => {
      optionResults[option] = { yes: 0, no: 0 };
    });

    voterIds.forEach(voterId => {
      const votes = data.votes[voterId];
      Object.keys(votes).forEach(option => {
        if (votes[option]) {
          optionResults[option].yes++;
        } else {
          optionResults[option].no++;
        }
      });
    });

    const resultsArray: PollResults[] = data.options.map((option: string) => ({
      option,
      yesCount: optionResults[option].yes,
      noCount: optionResults[option].no,
      percentage: voterIds.length > 0 
        ? (optionResults[option].yes / voterIds.length) * 100 
        : 0
    }));

    resultsArray.sort((a, b) => b.percentage - a.percentage);
    setResults(resultsArray);

    // Determine winner
    if (resultsArray.length > 0) {
      const topOption = resultsArray[0];
      setWinner(topOption.option);
      setIsUnanimous(topOption.yesCount === voterIds.length && voterIds.length > 0);
    }
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/vote/${pollId}`;
    const resultText = winner 
      ? `${isUnanimous ? 'Everyone agrees on' : 'Winning option:'} ${winner}`
      : 'Vote on this poll!';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: poll?.title || 'Poll Results',
          text: resultText,
          url: link,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          navigator.clipboard.writeText(link);
          toast.success('Link copied to clipboard!');
        }
      }
    } else {
      navigator.clipboard.writeText(link);
      toast.success('Link copied to clipboard!');
    }
  };

  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{poll.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{totalVoters} {totalVoters === 1 ? 'person' : 'people'} voted</span>
              </div>
            </div>
            <Button
              onClick={loadResults}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Status Card */}
        {totalVoters > 0 && winner && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-3xl p-6 mb-6 ${
              isUnanimous 
                ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300' 
                : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${
                isUnanimous ? 'bg-green-200' : 'bg-yellow-200'
              }`}>
                {isUnanimous ? (
                  <Trophy className="w-8 h-8 text-green-700" />
                ) : (
                  <Users className="w-8 h-8 text-yellow-700" />
                )}
              </div>
              <div className="flex-1">
                <h2 className={`text-xl font-bold mb-1 ${
                  isUnanimous ? 'text-green-900' : 'text-yellow-900'
                }`}>
                  {isUnanimous ? 'Perfect Match! 🎉' : 'Leading Option'}
                </h2>
                <p className={`text-lg ${
                  isUnanimous ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {isUnanimous 
                    ? `Everyone agrees on ${winner}` 
                    : `${winner} is in the lead`}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {totalVoters === 0 && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 mb-6 text-center"
          >
            <p className="text-blue-900 text-lg font-semibold mb-2">
              Waiting for votes...
            </p>
            <p className="text-blue-700">
              Share the poll link to start collecting votes
            </p>
          </motion.div>
        )}

        {/* Results List */}
        <div className="space-y-4">
          {results.map((result, index) => (
            <motion.div
              key={result.option}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-3xl p-6 shadow-sm ${
                index === 0 && totalVoters > 0 ? 'ring-2 ring-green-400' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {index === 0 && totalVoters > 0 && (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {result.option}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(result.percentage)}%
                  </p>
                </div>
              </div>

              <Progress 
                value={result.percentage} 
                className="h-3 mb-3"
              />

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {result.yesCount} Yes
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {result.noCount} No
                  </span>
                </div>
                {index === 0 && totalVoters > 0 && (
                  <span className="text-green-600 font-semibold">
                    🏆 Top Choice
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <Button
            onClick={handleShare}
            className="w-full bg-green-600 hover:bg-green-700 rounded-full py-6 text-lg"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Poll Results
          </Button>

          <Link to={`/vote/${pollId}`} className="block">
            <Button
              variant="outline"
              className="w-full rounded-full py-6 border-gray-300"
            >
              Vote Again
            </Button>
          </Link>

          <Link to="/create" className="block">
            <Button
              variant="ghost"
              className="w-full rounded-full py-6"
            >
              Create New Poll
            </Button>
          </Link>
        </div>

        {/* Live Update Indicator */}
        {totalVoters > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
              <span className="text-sm text-gray-600">Live updates enabled</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
