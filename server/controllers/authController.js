import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

export async function signup(req, res) {

  const { name, email, password } = req.body;

  if (!email || !password) 
    return res.status(400).json({ error: 'Missing email or password' });

  const existing = await prisma.user.findUnique({ where: { email }});

  if (existing) 
    return res.status(400).json({ error: 'Email already used' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, password: hashed }});
  const token = generateToken(user);

  res.json({ token, user: { id: user.id, name: user.name, email: user.email }});
}

export async function login(req, res) {

  const { email, password } = req.body;

  if (!email || !password) 
    return res.status(400).json({ error: 'Missing email or password' });

  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) 
    return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) 
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken(user);
  
  res.json({ token, user: { id: user.id, name: user.name, email: user.email }});
}
