export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("Missing Jwt secret!");
    process.exit(1);
  }

  return secret;
}

export function getSalt(): string {
  const salt = process.env.PASSWORD_SALT;

  if (!salt) {
    console.error("Missing password salt!");
    process.exit(1);
  }

  return salt;
}
