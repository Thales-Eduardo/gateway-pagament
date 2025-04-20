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

export async function keycloakAuthMiddleware(
  req: any,
  res: any,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Token não fornecido ou formato inválido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifica o token
    const payload = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

    req.user = payload;
    next();
  } catch (error: any) {
    console.error("Erro na verificação do token:", error);
    return res.status(401).json({
      error: "Token inválido",
      details: error.message,
    });
  }
}
