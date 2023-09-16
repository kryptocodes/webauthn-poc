import { NextApiRequest, NextApiResponse } from 'next';
import crypto from "crypto"
const Challenge = async (req: NextApiRequest, res: NextApiResponse) => {
  const challenge = generateRandomChallenge();
  res.status(200).json({ challenge });
};

function generateRandomChallenge() {
  const challengeLength = 64;
  const randomBytes = crypto.randomBytes(challengeLength / 2);
  const challenge = randomBytes.toString("hex");
  return challenge;
}

export default Challenge;