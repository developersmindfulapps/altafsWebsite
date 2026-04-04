import bcrypt from "bcryptjs";

async function generateHash() {
  const password = "AdmiN@lf_04o8";
  const hash = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hash);
}

generateHash();