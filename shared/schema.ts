import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("recruiter"), // recruiter, hiring_manager, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  department: varchar("department", { length: 100 }),
  location: varchar("location", { length: 255 }),
  type: varchar("type", { length: 50 }).notNull(), // full-time, part-time, contract
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, paused, closed
  salary: varchar("salary", { length: 100 }),
  requirements: text("requirements"),
  benefits: text("benefits"),
  postedBy: varchar("posted_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  location: varchar("location", { length: 255 }),
  resumeUrl: text("resume_url"),
  linkedinUrl: text("linkedin_url"),
  portfolioUrl: text("portfolio_url"),
  skills: text("skills").array(),
  experience: text("experience"),
  education: text("education"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidates.id).notNull(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("applied"), // applied, screening, interview, decision, hired, rejected
  appliedAt: timestamp("applied_at").defaultNow(),
  score: integer("score"), // matching score 0-100
  source: varchar("source", { length: 100 }), // job board, referral, linkedin, etc.
  assignedTo: varchar("assigned_to").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applications.id).notNull(),
  interviewerId: varchar("interviewer_id").references(() => users.id).notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").notNull().default(60), // minutes
  type: varchar("type", { length: 50 }).notNull(), // phone, video, in-person
  status: varchar("status", { length: 50 }).notNull().default("scheduled"), // scheduled, completed, cancelled, rescheduled
  meetingUrl: text("meeting_url"),
  notes: text("notes"),
  feedback: text("feedback"),
  rating: integer("rating"), // 1-5 stars
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applications.id).notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  action: varchar("action", { length: 100 }).notNull(), // moved_candidate, posted_job, scheduled_interview, etc.
  entityType: varchar("entity_type", { length: 50 }).notNull(), // candidate, job, interview
  entityId: integer("entity_id").notNull(),
  metadata: jsonb("metadata"), // additional context data
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  jobs: many(jobs),
  interviews: many(interviews),
  notes: many(notes),
  activities: many(activities),
  assignedApplications: many(applications),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  postedBy: one(users, { fields: [jobs.postedBy], references: [users.id] }),
  applications: many(applications),
}));

export const candidatesRelations = relations(candidates, ({ many }) => ({
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  candidate: one(candidates, { fields: [applications.candidateId], references: [candidates.id] }),
  job: one(jobs, { fields: [applications.jobId], references: [jobs.id] }),
  assignedTo: one(users, { fields: [applications.assignedTo], references: [users.id] }),
  interviews: many(interviews),
  notes: many(notes),
}));

export const interviewsRelations = relations(interviews, ({ one }) => ({
  application: one(applications, { fields: [interviews.applicationId], references: [applications.id] }),
  interviewer: one(users, { fields: [interviews.interviewerId], references: [users.id] }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  application: one(applications, { fields: [notes.applicationId], references: [applications.id] }),
  author: one(users, { fields: [notes.authorId], references: [users.id] }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, { fields: [activities.userId], references: [users.id] }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;
export const insertJobSchema = createInsertSchema(jobs);

export type Candidate = typeof candidates.$inferSelect;
export type InsertCandidate = typeof candidates.$inferInsert;
export const insertCandidateSchema = createInsertSchema(candidates);

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;
export const insertApplicationSchema = createInsertSchema(applications);

export type Interview = typeof interviews.$inferSelect;
export type InsertInterview = typeof interviews.$inferInsert;
export const insertInterviewSchema = createInsertSchema(interviews);

export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;
export const insertNoteSchema = createInsertSchema(notes);

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;
export const insertActivitySchema = createInsertSchema(activities);
