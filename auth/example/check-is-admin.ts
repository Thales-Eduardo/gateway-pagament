import { NextFunction } from "express";
import jwt from "jsonwebtoken";

const publicKey = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAssVXL9S+e3JKT0+lTduS
mJv1VrwIF1EmtK5sKjRBqjXkmTgJvFB18YsZDQZtJ1kvweUGAEiSunfJJ2gXr+7F
iMAFRbNwPOfp/qUHP9mCqLbdWoRLgw+aj3WEschvAKFphsbHjNGRlyMlmPopziD3
9dOZb1D52mifJ8e7kU5uc0z4ekAqCR5yEsbKeVDRai+uojtTaq9HjZ5Q0SgYnNDY
dLZ0/rJiO1p+LYUAbiPGL1pRT0sJ4lQ1xE+pmB5Is0qVe5pOC+R36l6LlPMankZh
deJtajr478L+D8c0j6UlDj0uuIYdD9sSJskaI+dWatk9lC79Mw0NdmvCv2YauCoD
jQIDAQAB
-----END PUBLIC KEY-----
`;

export function isAdmin(req: any, res: any, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token não encontrado." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    }) as any;

    const roles = decoded?.realm_access?.roles || [];

    if (!roles.includes("admin")) {
      return res
        .status(403)
        .json({ message: "Acesso negado. Permissão de admin necessária." });
    }

    req.user = decoded;

    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token inválido ou expirado.", error });
  }
}
