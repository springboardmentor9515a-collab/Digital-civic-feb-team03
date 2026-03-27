const WINDOW_MS = 60 * 1000;
const RESPONSE_MAX_REQUESTS_PER_WINDOW = 10;
const REPORT_MAX_REQUESTS_PER_WINDOW = 30;
const responseRequestStore = new Map();
const reportRequestStore = new Map();

const buildKey = (req) => {
  const userId = req.user?._id?.toString() || "anonymous";
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const pollId = req.params.id || "unknown-poll";
  return `${userId}:${ip}:${pollId}`;
};

const createRateLimiter =
  ({ requestStore, maxRequests, message }) =>
  (req, res, next) => {
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

    if (existing.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message,
        retryAfterMs: existing.resetAt - currentTime,
      });
    }

    existing.count += 1;
    requestStore.set(key, existing);
    return next();
  };

const responseRateLimit = createRateLimiter({
  requestStore: responseRequestStore,
  maxRequests: RESPONSE_MAX_REQUESTS_PER_WINDOW,
  message: "Too many response attempts. Please try again later.",
});

const reportRateLimit = createRateLimiter({
  requestStore: reportRequestStore,
  maxRequests: REPORT_MAX_REQUESTS_PER_WINDOW,
  message: "Too many report requests. Please try again later.",
});

const voteRateLimit = responseRateLimit;

module.exports = {
  responseRateLimit,
  reportRateLimit,
  voteRateLimit,
};
