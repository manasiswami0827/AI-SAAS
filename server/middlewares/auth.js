import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const {userId} = req.auth()

    if (!userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(userId);

    const hasPremiumPlan = user.privateMetadata?.plan === "premium";
    const freeUsage = user.privateMetadata?.free_usage ?? 0;

    if (!hasPremiumPlan && freeUsage > 0) {
      req.free_usage = freeUsage;
    } else {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          free_usage: 0
        }
      });
      req.free_usage = 0;
    }

    req.plan = hasPremiumPlan ? "premium" : "free";

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};