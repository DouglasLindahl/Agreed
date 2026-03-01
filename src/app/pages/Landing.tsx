import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Users, Link2, Vote, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Landing() {
  const features = [
    {
      icon: Users,
      title: 'Create a poll',
      description: 'Add your options in seconds',
      color: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      icon: Link2,
      title: 'Share the link',
      description: 'Send to your group chat instantly',
      color: 'bg-purple-50',
      iconColor: 'text-purple-500'
    },
    {
      icon: Vote,
      title: 'Swipe or tap to vote',
      description: 'Fun, fast voting experience',
      color: 'bg-pink-50',
      iconColor: 'text-pink-500'
    },
    {
      icon: Trophy,
      title: 'See the winning option',
      description: 'Real-time results everyone can see',
      color: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">✓</span>
            </motion.div>
            <span className="text-2xl font-bold text-gray-900">Agreed</span>
          </div>
          <Link to="/create">
            <Button className="bg-green-600 hover:bg-green-700 rounded-full px-6">
              Create Poll
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Decide together in seconds
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-8"
          >
            Create a group, share a link, and find something everyone agrees on.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/create">
              <Button className="bg-green-600 hover:bg-green-700 rounded-full text-lg px-8 py-6 w-full sm:w-auto">
                Create a Poll
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/vote/demo">
              <Button variant="outline" className="rounded-full text-lg px-8 py-6 w-full sm:w-auto border-gray-300">
                See Example
              </Button>
            </Link>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 relative"
          >
            <div className="max-w-sm mx-auto bg-gradient-to-b from-gray-50 to-gray-100 rounded-3xl p-3 shadow-2xl border border-gray-200">
              <div className="bg-white rounded-2xl overflow-hidden shadow-inner">
                {/* Phone Screen Content */}
                <div className="p-6 space-y-4">
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-500 mb-2">Friday Dinner 🍽️</p>
                  </div>
                  
                  {/* Swipe Card */}
                  <motion.div
                    animate={{ 
                      rotate: [0, -2, 2, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className="bg-gradient-to-br from-green-50 to-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg"
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">🍕</div>
                      <div className="text-2xl font-semibold text-gray-900">Pizza</div>
                    </div>
                  </motion.div>

                  {/* Yes/No Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-2xl py-6 text-lg border-2 border-gray-300 hover:bg-red-50 hover:border-red-300"
                    >
                      ✕ No
                    </Button>
                    <Button 
                      className="flex-1 rounded-2xl py-6 text-lg bg-green-600 hover:bg-green-700"
                    >
                      ✓ Yes
                    </Button>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-500 italic mt-4">Swipe until you agree.</p>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-xl text-gray-600">Four simple steps to group decisions</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to make decisions easier?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start a poll and get everyone on the same page in seconds.
            </p>
            <Link to="/create">
              <Button className="bg-green-600 hover:bg-green-700 rounded-full text-lg px-10 py-6">
                Start a Poll
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-gray-500">
          <p>© 2026 Agreed. Swipe until you agree.</p>
        </div>
      </footer>
    </div>
  );
}
