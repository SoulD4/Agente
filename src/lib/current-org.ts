import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getOrCreateOrg(userId: string) {
  // Check existing membership first (fast path).
  const membership = await prisma.organizationMember.findFirst({
    where: { userId },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });
  if (membership) return membership.organization;

  // Ensure user exists in DB — sync from Clerk on first access if webhook hasn't fired yet.
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;
    user = await prisma.user.upsert({
      where: { id: clerkUser.id },
      create: {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        name:
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
        imageUrl: clerkUser.imageUrl ?? null,
      },
      update: {},
    });
  }

  const slug = `ws-${userId.slice(-8)}-${Date.now().toString(36)}`;

  return prisma.organization.create({
    data: {
      name: user.name ?? "Meu Workspace",
      slug,
      members: { create: { userId, role: "OWNER" } },
    },
  });
}
