const buckets = new Map();

const getClientKey = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || "unknown";
};

export const createRateLimiter = ({
  windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 200,
} = {}) => {
  return (req, res, next) => {
    const now = Date.now();
    const key = getClientKey(req);
    const current = buckets.get(key);

    if (!current || current.expiresAt <= now) {
      buckets.set(key, {
        count: 1,
        expiresAt: now + windowMs,
      });
      return next();
    }

    if (current.count >= maxRequests) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((current.expiresAt - now) / 1000)
      );

      res.setHeader("Retry-After", retryAfterSeconds);
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    current.count += 1;
    buckets.set(key, current);
    return next();
  };
};
