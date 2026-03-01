import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Check, X, ArrowRight, Share2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { toast } from 'sonner';

export default function Vote() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  
  const [poll, setPoll] = useState<any>(null);
  const [voterName, setVoterName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState<{ [key: string]: boolean }>({});
  const [votingComplete, setVotingComplete] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  useEffect(() => {
    // Load poll data
    const pollData = localStorage.getItem(`poll_${pollId}`);
    if (pollData) {
      setPoll(JSON.parse(pollData));
    } else if (pollId === 'demo') {
      // Demo poll
      setPoll({
        id: 'demo',
        title: 'Friday Dinner 🍽️',
        options: ['Pizza 🍕', 'Sushi 🍣', 'Burgers 🍔', 'Tacos 🌮'],
        votingType: 'anonymous'
      });
    }
  }, [pollId]);

  useEffect(() => {
    if (poll && poll.votingType === 'anonymous') {
      setShowNameInput(false);
    }
  }, [poll]);

  const handleVote = (vote: boolean) => {
    if (!poll) return;

    const option = poll.options[currentIndex];
    const newVotes = { ...votes, [option]: vote };
    setVotes(newVotes);

    // Animate to next
    if (currentIndex < poll.options.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        x.set(0);
      }, 300);
    } else {
      // Voting complete
      setTimeout(() => {
        saveVotes(newVotes);
      }, 300);
    }

    // Visual feedback
    toast.success(vote ? '✓ Yes' : '✕ No', {
      duration: 1000,
    });
  };

  const saveVotes = (finalVotes: { [key: string]: boolean }) => {
    if (!poll || !pollId) return;

    const pollData = localStorage.getItem(`poll_${pollId}`);
    if (pollData) {
      const data = JSON.parse(pollData);
      const voterId = voterName || `Voter ${Math.random().toString(36).substring(7)}`;
      
      if (!data.votes) {
        data.votes = {};
      }
      
      data.votes[voterId] = finalVotes;
      localStorage.setItem(`poll_${pollId}`, JSON.stringify(data));
    }

    setVotingComplete(true);
  };

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      handleVote(info.offset.x > 0);
    } else {
      x.set(0);
    }
  };

  const handleStartVoting = () => {
    if (poll.votingType === 'names' && !voterName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    setShowNameInput(false);
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/vote/${pollId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: poll.title,
          text: `Vote on: ${poll.title}`,
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
          <p className="text-xl text-gray-600 mb-4">Poll not found</p>
          <Link to="/create">
            <Button className="bg-green-600 hover:bg-green-700 rounded-full">
              Create a Poll
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (votingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-green-600" />
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Vote Submitted! 🎉
          </h2>
          <p className="text-gray-600 mb-8">
            Your votes have been recorded
          </p>

          <Button
            onClick={() => navigate(`/results/${pollId}`)}
            className="w-full bg-green-600 hover:bg-green-700 rounded-full text-lg py-6 mb-3"
          >
            See Results
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full rounded-full py-6"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Invite Friends
          </Button>
        </motion.div>
      </div>
    );
  }

  if (showNameInput && poll.votingType === 'names') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{poll.title}</h2>
          <p className="text-gray-600 mb-6">Enter your name to start voting</p>

          <Input
            placeholder="Your name"
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStartVoting()}
            className="rounded-2xl py-6 mb-4 border-gray-300 text-lg"
            autoFocus
          />

          <Button
            onClick={handleStartVoting}
            className="w-full bg-green-600 hover:bg-green-700 rounded-full py-6 text-lg"
          >
            Start Voting
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentOption = poll.options[currentIndex];
  const progress = ((currentIndex + 1) / poll.options.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 text-center mb-3">{poll.title}</h1>
        <div className="max-w-md mx-auto">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500 text-center mt-2">
            {currentIndex + 1} of {poll.options.length}
          </p>
        </div>
      </div>

      {/* Voting Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Swipe Indicators */}
          <div className="flex justify-between mb-6 px-4">
            <motion.div
              animate={{ 
                scale: x.get() < -50 ? 1.2 : 1,
                opacity: x.get() < -50 ? 1 : 0.4 
              }}
              className="flex items-center gap-2 text-red-500"
            >
              <X className="w-6 h-6" />
              <span className="font-semibold">No</span>
            </motion.div>
            <motion.div
              animate={{ 
                scale: x.get() > 50 ? 1.2 : 1,
                opacity: x.get() > 50 ? 1 : 0.4 
              }}
              className="flex items-center gap-2 text-green-600"
            >
              <span className="font-semibold">Yes</span>
              <Check className="w-6 h-6" />
            </motion.div>
          </div>

          {/* Swipeable Card */}
          <motion.div
            className="relative h-96 mb-8"
            style={{ perspective: 1000 }}
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              style={{ x, rotate, opacity }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <div className="bg-gradient-to-br from-white to-gray-50 border-4 border-gray-200 rounded-3xl shadow-2xl h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-8xl mb-6">
                    {currentOption.match(/[\p{Emoji}]/u)?.[0] || '🤔'}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {currentOption.replace(/[\p{Emoji}]/gu, '').trim() || currentOption}
                  </h2>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                onClick={() => handleVote(false)}
                variant="outline"
                className="w-full rounded-2xl py-8 text-xl border-2 border-gray-300 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-colors"
              >
                <X className="w-6 h-6 mr-2" />
                No
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                onClick={() => handleVote(true)}
                className="w-full rounded-2xl py-8 text-xl bg-green-600 hover:bg-green-700"
              >
                <Check className="w-6 h-6 mr-2" />
                Yes
              </Button>
            </motion.div>
          </div>

          {/* Helper Text */}
          <p className="text-center text-gray-500 mt-6 text-sm">
            👆 Tap a button or swipe the card
          </p>
        </div>
      </div>

      {/* Share Button */}
      <div className="p-4 bg-white border-t border-gray-100">
        <Button
          onClick={handleShare}
          variant="ghost"
          className="w-full max-w-md mx-auto block"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Invite friends to vote
        </Button>
      </div>
    </div>
  );
}
