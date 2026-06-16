import { prisma } from "@/lib/prisma";

export async function getOrCreateOrg(userId: string) {
  const membership = await prisma.organizationMember.findFirst({
    where: { userId },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });

  if (membership) return membership.organization;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const slug = `ws-${userId.slice(-8)}-${Date.now().toString(36)}`;

  return prisma.organization.create({
    data: {
      name: user.name ?? "Meu Workspace",
      slug,
      members: { create: { userId, role: "OWNER" } },
    },
  });
}
