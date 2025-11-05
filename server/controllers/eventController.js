import { PrismaClient, Status } from '@prisma/client';
const prisma = new PrismaClient();

export async function getEvents(req, res) {
  const userId = req.user.id;
  const events = await prisma.event.findMany({ where: { ownerId: userId }, orderBy: { startTime: 'asc' }});
  res.json(events);
}

export async function createEvent(req, res) {
  const { title, startTime, endTime, status } = req.body;
  const ev = await prisma.event.create({
    data: {
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: status || Status.BUSY,
      ownerId: req.user.id,
    }
  });
  res.json(ev);
}

export async function updateEvent(req, res) {
  const id = Number(req.params.id);
  const existing = await prisma.event.findUnique({ where: { id }});
  if (!existing || existing.ownerId !== req.user.id) return res.status(404).json({ error: 'Not found or not owner' });
  const { title, startTime, endTime, status } = req.body;
  const ev = await prisma.event.update({
    where: { id },
    data: {
      title: title ?? existing.title,
      startTime: startTime ? new Date(startTime) : existing.startTime,
      endTime: endTime ? new Date(endTime) : existing.endTime,
      status: status ?? existing.status
    }
  });
  res.json(ev);
}

export async function deleteEvent(req, res) {
  const id = Number(req.params.id);
  const existing = await prisma.event.findUnique({ where: { id }});
  if (!existing || existing.ownerId !== req.user.id) return res.status(404).json({ error: 'Not found or not owner' });
  await prisma.event.delete({ where: { id }});
  res.json({ ok: true });
}
