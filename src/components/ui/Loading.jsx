import { motion } from 'framer-motion';

const Loading = ({ type = 'default' }) => {
  if (type === 'dashboard') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="card-body">
              <div className="shimmer h-4 w-24 rounded mb-2"></div>
              <div className="shimmer h-8 w-16 rounded mb-4"></div>
              <div className="shimmer h-3 w-32 rounded"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="card">
        <div className="card-header">
          <div className="shimmer h-6 w-40 rounded"></div>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="shimmer h-12 w-12 rounded-lg"></div>
                <div className="flex-1">
                  <div className="shimmer h-4 w-32 rounded mb-2"></div>
                  <div className="shimmer h-3 w-24 rounded"></div>
                </div>
                <div className="shimmer h-6 w-20 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;