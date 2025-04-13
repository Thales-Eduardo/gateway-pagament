import jwt from "jsonwebtoken";

export function keycloakAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Token não fornecido ou formato inválido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const publicKey = process.env.KEYCLOAK_PUBLIC_KEY;

    if (!publicKey) {
      throw new Error("Chave pública do Keycloak não configurada");
    }

    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    });

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Erro na verificação do token:", error);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
