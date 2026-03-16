const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const requestStore = new Map();

const buildKey = (req) => {
  const userId = req.user?._id?.toString() || "anonymous";
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const pollId = req.params.id || "unknown-poll";
  return `${userId}:${ip}:${pollId}`;
};

const voteRateLimit = (req, res, next) => {
  const key = buildKey(req);
  const currentTime = Date.now();
  const existing = requestStore.get(key);

  if (!existing || currentTime > existing.resetAt) {
    requestStore.set(key, {
      count: 1,
      resetAt: currentTime + WINDOW_MS,
    });
    return next();
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      message: "Too many vote attempts. Please try again later.",
      retryAfterMs: existing.resetAt - currentTime,
    });
  }

  existing.count += 1;
  requestStore.set(key, existing);
  return next();
};

module.exports = {
  voteRateLimit,
};
