import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware.js";

const roleMiddleware = (...allowedRoles: string[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): void => {
    // Ensure user is authenticated
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized"
      });
      return;
    }

    // Check role
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: "Access forbidden"
      });
      return;
    }

    next();
  };
};

export default roleMiddleware;