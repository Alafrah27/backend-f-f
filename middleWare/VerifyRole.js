export function VerifyRole(...verifytoken) {
  return (req, res, next) => {
    // Ensure req.user is defined and isAdmin can be checked
    if (!req.user || !verifytoken.includes(req.user.isAdmin)) {
      return res.status(401).json({ message: "You are not authorized" });
    }
    next();
  };
}
