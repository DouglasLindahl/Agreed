import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Plus, X, Copy, Share2, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { toast } from "sonner";

export default function CreatePoll() {
  const navigate = useNavigate();
  const [pollTitle, setPollTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [votingType, setVotingType] = useState("anonymous");
  const [createdPollId, setCreatedPollId] = useState<string | null>(null);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = () => {
    if (!pollTitle.trim()) {
      toast.error("Please enter a poll title");
      return;
    }

    const validOptions = options.filter((opt) => opt.trim());
    if (validOptions.length < 2) {
      toast.error("Please add at least 2 options");
      return;
    }

    // Generate random poll ID
    const pollId = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Store poll data in localStorage
    const pollData = {
      id: pollId,
      title: pollTitle,
      options: validOptions,
      votingType,
      votes: {},
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(`poll_${pollId}`, JSON.stringify(pollData));

    setCreatedPollId(pollId);
    toast.success("Poll created successfully!");
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/vote/${createdPollId}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/vote/${createdPollId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: pollTitle,
          text: `Vote on: ${pollTitle}`,
          url: link,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  if (createdPollId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <span className="text-4xl">🎉</span>
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Poll Created!
            </h2>
            <p className="text-gray-600 mb-6">
              Share this link with your group
            </p>

            <div className="bg-gray-50 rounded-2xl p-4 mb-6 border-2 border-dashed border-gray-300">
              <p className="text-sm text-gray-500 mb-2">Your poll link</p>
              <p className="font-mono text-green-700 font-semibold break-all">
                localhost:5173/{createdPollId}
              </p>
            </div>

            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="flex-1 rounded-full py-6"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button
                onClick={handleShare}
                className="flex-1 rounded-full py-6 bg-green-600 hover:bg-green-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              💡 Share in your group chat and start voting instantly
            </p>

            <Button
              onClick={() => navigate(`/vote/${createdPollId}`)}
              variant="outline"
              className="w-full rounded-full mb-3"
            >
              Start Voting
            </Button>

            <Button
              onClick={() => {
                setCreatedPollId(null);
                setPollTitle("");
                setOptions(["", ""]);
              }}
              variant="ghost"
              className="w-full"
            >
              Create Another Poll
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Create a Poll</h1>
            <p className="text-sm text-gray-500">
              Get everyone's input in seconds
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-sm p-6 sm:p-8"
        >
          {/* Poll Title */}
          <div className="mb-8">
            <Label htmlFor="poll-title" className="text-base mb-2 block">
              Poll Title
            </Label>
            <Input
              id="poll-title"
              placeholder="e.g., Friday Dinner, Movie Night, Weekend Plans"
              value={pollTitle}
              onChange={(e) => setPollTitle(e.target.value)}
              className="text-lg rounded-2xl py-6 border-gray-300"
            />
          </div>

          {/* Options */}
          <div className="mb-8">
            <Label className="text-base mb-3 block">Options</Label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder={`Option ${index + 1} (e.g., Pizza 🍕)`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="rounded-2xl py-6 border-gray-300"
                  />
                  {options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                      className="rounded-full shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={handleAddOption}
              className="w-full mt-3 rounded-2xl py-6 border-dashed border-2 border-gray-300 hover:border-green-400 hover:bg-green-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          </div>

          {/* Voting Type */}
          {/* Voting Type */}
          <div className="mb-8">
            <Label className="text-base mb-3 block">Voting Type</Label>
            <RadioGroup value={votingType} onValueChange={setVotingType}>
              {[
                {
                  value: "anonymous",
                  title: "Anonymous",
                  description: "No names required, just votes",
                },
                {
                  value: "names",
                  title: "Names Required",
                  description: "See who voted for what",
                },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => setVotingType(option.value)} // Entire card clickable
                  className={`flex items-start space-x-3 p-4 rounded-2xl border-2 transition-colors mb-3 cursor-pointer
          ${votingType === option.value ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-400"}`}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={option.value}
                      className="font-medium cursor-pointer"
                    >
                      {option.title}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Create Button */}
          <Button
            onClick={handleCreatePoll}
            className="w-full bg-green-600 hover:bg-green-700 rounded-full text-lg py-6"
          >
            Create Poll
          </Button>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          <p>💡 Tip: Add emojis to make options more fun!</p>
        </motion.div>
      </div>
    </div>
  );
}
