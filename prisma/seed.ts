/**
 * One-time migration: load the existing static JSON content into the database
 * so the site renders identically once the DB-backed content layer goes live.
 * Safe to re-run — every write is an upsert or an idempotency-checked insert.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { assertSameSupabaseProject } from "./lib/assert-db-target";

import site from "../src/content/site.json";
import profile from "../src/content/profile.json";
import experience from "../src/content/experience.json";
import projects from "../src/content/projects.json";
import research from "../src/content/research.json";
import skills from "../src/content/skills.json";
import social from "../src/content/social.json";
import services from "../src/content/services.json";
import navigation from "../src/content/navigation.json";

assertSameSupabaseProject(process.env.DATABASE_URL, process.env.DIRECT_URL);

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const dash2underscore = (s: string) => s.replace(/-/g, "_");

async function seedProfile() {
  await db.profile.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      name: profile.name,
      title: profile.title,
      headline: profile.headline,
      subheadline: profile.subheadline,
      location: profile.location,
      email: profile.email,
      availability: profile.availability,
      bio: profile.bio,
      highlights: profile.highlights,
      audiences: profile.audiences,
    },
    update: {},
  });
}

async function seedSiteSettings() {
  await db.siteSettings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      name: site.name,
      tagline: site.tagline,
      domain: site.domain,
      url: site.url,
      description: site.description,
      keywords: site.keywords,
      locale: site.locale,
      resumeUrl: site.resumeUrl || null,
    },
    update: {},
  });
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn("Skipping admin user seed — ADMIN_EMAIL/ADMIN_PASSWORD not set in .env");
    return;
  }
  const existing = await db.adminUser.findUnique({ where: { email } });
  if (existing) return;
  const passwordHash = await bcrypt.hash(password, 12);
  await db.adminUser.create({ data: { email, passwordHash } });
}

async function seedNavigation() {
  const count = await db.navigationItem.count();
  if (count > 0) return;
  await db.navigationItem.createMany({
    data: navigation.map((item, order) => ({ label: item.label, href: item.href, order })),
  });
}

async function seedSocial() {
  const count = await db.socialLink.count();
  if (count > 0) return;
  await db.socialLink.createMany({
    data: social.map((item, order) => ({
      label: item.label,
      url: item.url,
      icon: item.icon as never,
      order,
    })),
  });
}

async function seedExperience() {
  const count = await db.experience.count();
  if (count > 0) return;
  await db.experience.createMany({
    data: experience.map((item, order) => ({
      company: item.company,
      role: item.role,
      period: item.period,
      location: item.location,
      type: dash2underscore(item.type) as never,
      description: item.description,
      achievements: item.achievements,
      technologies: item.technologies,
      featured: item.featured,
      order,
    })),
  });
}

async function seedProjects() {
  const count = await db.project.count();
  if (count > 0) return;
  await db.project.createMany({
    data: projects.map((item, order) => ({
      slug: item.slug,
      title: item.title,
      tagline: item.tagline,
      description: item.description,
      problem: item.problem,
      solution: item.solution,
      impact: item.impact,
      technologies: item.technologies,
      category: dash2underscore(item.category) as never,
      status: dash2underscore(item.status) as never,
      featured: item.featured,
      links: item.links ?? {},
      metrics: item.metrics ?? [],
      order,
    })),
  });
}

async function seedResearch() {
  const count = await db.research.count();
  if (count > 0) return;
  await db.research.createMany({
    data: research.map((item, order) => ({
      title: item.title,
      venue: item.venue,
      year: item.year,
      type: item.type as never,
      abstract: item.abstract,
      authors: item.authors,
      links: item.links ?? {},
      tags: item.tags,
      featured: item.featured,
      order,
    })),
  });
}

async function seedSkills() {
  const count = await db.skillCategory.count();
  if (count > 0) return;
  await db.skillCategory.createMany({
    data: skills.map((cat, order) => ({ name: cat.name, skills: cat.skills, order })),
  });
}

async function seedServices() {
  const count = await db.service.count();
  if (count > 0) return;
  await db.service.createMany({
    data: services.map((item, order) => ({
      title: item.title,
      description: item.description,
      deliverables: item.deliverables,
      order,
    })),
  });
}

async function seedAppearance() {
  const wallpaperCount = await db.wallpaper.count();
  if (wallpaperCount === 0) {
    await db.wallpaper.createMany({
      data: [
        { label: "Aurora", gradient: "linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #db2777 100%)", order: 0, isDefault: true },
        { label: "Sunset", gradient: "linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #facc15 100%)", order: 1 },
        { label: "Graphite", gradient: "linear-gradient(135deg, #18181b 0%, #3f3f46 60%, #71717a 100%)", order: 2 },
        { label: "Forest", gradient: "linear-gradient(135deg, #052e16 0%, #15803d 55%, #4ade80 100%)", order: 3 },
        { label: "Mono", gradient: "linear-gradient(135deg, #0a0a0a 0%, #262626 100%)", order: 4 },
      ],
    });
  }

  const accentCount = await db.accent.count();
  if (accentCount === 0) {
    await db.accent.createMany({
      data: [
        { label: "Blue", value: "#2563eb", order: 0, isDefault: true },
        { label: "Purple", value: "#7c3aed", order: 1 },
        { label: "Pink", value: "#db2777", order: 2 },
        { label: "Orange", value: "#ea580c", order: 3 },
        { label: "Green", value: "#16a34a", order: 4 },
        { label: "Graphite", value: "#525252", order: 5 },
      ],
    });
  }
}

async function main() {
  await seedProfile();
  await seedSiteSettings();
  await seedAdminUser();
  await seedNavigation();
  await seedSocial();
  await seedExperience();
  await seedProjects();
  await seedResearch();
  await seedSkills();
  await seedServices();
  await seedAppearance();
  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
