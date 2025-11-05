import { PrismaClient, Status, SwapStatus } from '@prisma/client';
const prisma = new PrismaClient();

export async function getSwappableSlots(req, res) {
  const userId = req.user.id;
  const slots = await prisma.event.findMany({
    where: { status: Status.SWAPPABLE, NOT: { ownerId: userId } },
    include: { owner: { select: { id: true, name: true, email: true } } },
    orderBy: { startTime: 'asc' }
  });
  res.json(slots);
}

export async function createSwapRequest(req, res) {
  const { mySlotId, theirSlotId } = req.body;
  const senderId = req.user.id;
  if (!mySlotId || !theirSlotId) return res.status(400).json({ error: 'Missing slot ids' });

  const [mySlot, theirSlot] = await Promise.all([
    prisma.event.findUnique({ where: { id: Number(mySlotId) } }),
    prisma.event.findUnique({ where: { id: Number(theirSlotId) } })
  ]);

  if (!mySlot || !theirSlot) return res.status(404).json({ error: 'Slot not found' });
  if (mySlot.ownerId !== senderId) return res.status(403).json({ error: 'You do not own mySlot' });
  if (mySlot.status !== Status.SWAPPABLE || theirSlot.status !== Status.SWAPPABLE) {
    return res.status(400).json({ error: 'Both slots must be SWAPPABLE' });
  }
  if (theirSlot.ownerId === senderId) return res.status(400).json({ error: 'Cannot request own slot' });

  const receiverId = theirSlot.ownerId;

  const created = await prisma.$transaction(async (tx) => {
    const reqRec = await tx.swapRequest.create({
      data: { mySlotId: mySlot.id, theirSlotId: theirSlot.id, senderId, receiverId, status: SwapStatus.PENDING }
    });

    await tx.event.updateMany({
      where: { id: { in: [mySlot.id, theirSlot.id] } },
      data: { status: Status.SWAP_PENDING }
    });

    return reqRec;
  });

  res.json(created);
}

export async function respondToSwapRequest(req, res) {
  const requestId = Number(req.params.id);
  const accept = !!req.body.accept;
  const userId = req.user.id;

  const swapReq = await prisma.swapRequest.findUnique({ where: { id: requestId }});
  if (!swapReq) return res.status(404).json({ error: 'Swap request not found' });
  if (swapReq.receiverId !== userId) return res.status(403).json({ error: 'Not the receiver' });
  if (swapReq.status !== SwapStatus.PENDING) return res.status(400).json({ error: 'Request not pending' });

  if (!accept) {
    await prisma.$transaction(async (tx) => {
      await tx.swapRequest.update({ where: { id: requestId }, data: { status: SwapStatus.REJECTED }});
      await tx.event.updateMany({ where: { id: { in: [swapReq.mySlotId, swapReq.theirSlotId] } }, data: { status: Status.SWAPPABLE }});
    });
    return res.json({ ok: true, status: 'rejected' });
  }

  await prisma.$transaction(async (tx) => {
    const a = await tx.event.findUnique({ where: { id: swapReq.mySlotId }});
    const b = await tx.event.findUnique({ where: { id: swapReq.theirSlotId }});
    if (!a || !b) throw new Error('Event missing during swap');

    await tx.event.update({ where: { id: a.id }, data: { ownerId: b.ownerId, status: Status.BUSY }});
    await tx.event.update({ where: { id: b.id }, data: { ownerId: a.ownerId, status: Status.BUSY }});

    await tx.swapRequest.update({ where: { id: requestId }, data: { status: SwapStatus.ACCEPTED }});
  });

  res.json({ ok: true, status: 'accepted' });
}

export async function getRequests(req, res) {
  const userId = req.user.id;
  const incoming = await prisma.swapRequest.findMany({
    where: { receiverId: userId },
    include: { sender: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' }
  });
  const outgoing = await prisma.swapRequest.findMany({
    where: { senderId: userId },
    include: { receiver: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ incoming, outgoing });
}
