import type { Session } from "../lib/session.js";
import { auth } from "../lib/auth.js";
import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";

declare module "express-serve-static-core" {
    interface Request {
        session: Session;
    }
}



export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
    });

    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    
    req.session = session;
    next();
}
