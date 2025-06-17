import {
  users,
  jobs,
  candidates,
  applications,
  interviews,
  notes,
  activities,
  type User,
  type UpsertUser,
  type Job,
  type InsertJob,
  type Candidate,
  type InsertCandidate,
  type Application,
  type InsertApplication,
  type Interview,
  type InsertInterview,
  type Note,
  type InsertNote,
  type Activity,
  type InsertActivity,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, or, like, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Job operations
  getJobs(): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job>;
  deleteJob(id: number): Promise<void>;
  
  // Candidate operations
  getCandidates(): Promise<Candidate[]>;
  getCandidate(id: number): Promise<Candidate | undefined>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  updateCandidate(id: number, candidate: Partial<InsertCandidate>): Promise<Candidate>;
  searchCandidates(query: string): Promise<Candidate[]>;
  
  // Application operations
  getApplications(): Promise<Application[]>;
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsWithDetails(): Promise<any[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<Application>;
  getApplicationsByJob(jobId: number): Promise<Application[]>;
  getApplicationsByCandidate(candidateId: number): Promise<Application[]>;
  
  // Interview operations
  getInterviews(): Promise<Interview[]>;
  getInterview(id: number): Promise<Interview | undefined>;
  createInterview(interview: InsertInterview): Promise<Interview>;
  updateInterview(id: number, interview: Partial<InsertInterview>): Promise<Interview>;
  getInterviewsToday(): Promise<any[]>;
  getUpcomingInterviews(): Promise<any[]>;
  
  // Notes operations
  getNotesByApplication(applicationId: number): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  
  // Activity tracking
  createActivity(activity: InsertActivity): Promise<Activity>;
  getRecentActivities(limit?: number): Promise<any[]>;
  
  // Dashboard metrics
  getDashboardMetrics(): Promise<any>;
  getPipelineData(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Job operations
  async getJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async updateJob(id: number, job: Partial<InsertJob>): Promise<Job> {
    const [updatedJob] = await db
      .update(jobs)
      .set({ ...job, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return updatedJob;
  }

  async deleteJob(id: number): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, id));
  }

  // Candidate operations
  async getCandidates(): Promise<Candidate[]> {
    return await db.select().from(candidates).orderBy(desc(candidates.createdAt));
  }

  async getCandidate(id: number): Promise<Candidate | undefined> {
    const [candidate] = await db.select().from(candidates).where(eq(candidates.id, id));
    return candidate;
  }

  async createCandidate(candidate: InsertCandidate): Promise<Candidate> {
    const [newCandidate] = await db.insert(candidates).values(candidate).returning();
    return newCandidate;
  }

  async updateCandidate(id: number, candidate: Partial<InsertCandidate>): Promise<Candidate> {
    const [updatedCandidate] = await db
      .update(candidates)
      .set({ ...candidate, updatedAt: new Date() })
      .where(eq(candidates.id, id))
      .returning();
    return updatedCandidate;
  }

  async searchCandidates(query: string): Promise<Candidate[]> {
    return await db
      .select()
      .from(candidates)
      .where(
        or(
          like(candidates.firstName, `%${query}%`),
          like(candidates.lastName, `%${query}%`),
          like(candidates.email, `%${query}%`)
        )
      );
  }

  // Application operations
  async getApplications(): Promise<Application[]> {
    return await db.select().from(applications).orderBy(desc(applications.appliedAt));
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async getApplicationsWithDetails(): Promise<any[]> {
    return await db
      .select({
        id: applications.id,
        status: applications.status,
        appliedAt: applications.appliedAt,
        score: applications.score,
        candidateId: candidates.id,
        candidateName: sql`${candidates.firstName} || ' ' || ${candidates.lastName}`,
        candidateEmail: candidates.email,
        jobTitle: jobs.title,
        jobId: jobs.id,
      })
      .from(applications)
      .innerJoin(candidates, eq(applications.candidateId, candidates.id))
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .orderBy(desc(applications.appliedAt));
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db.insert(applications).values(application).returning();
    return newApplication;
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application> {
    const [updatedApplication] = await db
      .update(applications)
      .set({ status, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return updatedApplication;
  }

  async getApplicationsByJob(jobId: number): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.jobId, jobId))
      .orderBy(desc(applications.appliedAt));
  }

  async getApplicationsByCandidate(candidateId: number): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.candidateId, candidateId))
      .orderBy(desc(applications.appliedAt));
  }

  // Interview operations
  async getInterviews(): Promise<Interview[]> {
    return await db.select().from(interviews).orderBy(desc(interviews.scheduledAt));
  }

  async getInterview(id: number): Promise<Interview | undefined> {
    const [interview] = await db.select().from(interviews).where(eq(interviews.id, id));
    return interview;
  }

  async createInterview(interview: InsertInterview): Promise<Interview> {
    const [newInterview] = await db.insert(interviews).values(interview).returning();
    return newInterview;
  }

  async updateInterview(id: number, interview: Partial<InsertInterview>): Promise<Interview> {
    const [updatedInterview] = await db
      .update(interviews)
      .set({ ...interview, updatedAt: new Date() })
      .where(eq(interviews.id, id))
      .returning();
    return updatedInterview;
  }

  async getInterviewsToday(): Promise<any[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await db
      .select({
        id: interviews.id,
        scheduledAt: interviews.scheduledAt,
        duration: interviews.duration,
        type: interviews.type,
        candidateName: sql`${candidates.firstName} || ' ' || ${candidates.lastName}`,
        jobTitle: jobs.title,
        interviewerName: sql`${users.firstName} || ' ' || ${users.lastName}`,
      })
      .from(interviews)
      .innerJoin(applications, eq(interviews.applicationId, applications.id))
      .innerJoin(candidates, eq(applications.candidateId, candidates.id))
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(users, eq(interviews.interviewerId, users.id))
      .where(
        and(
          sql`${interviews.scheduledAt} >= ${today}`,
          sql`${interviews.scheduledAt} < ${tomorrow}`
        )
      )
      .orderBy(interviews.scheduledAt);
  }

  async getUpcomingInterviews(): Promise<any[]> {
    const now = new Date();
    return await db
      .select({
        id: interviews.id,
        scheduledAt: interviews.scheduledAt,
        duration: interviews.duration,
        type: interviews.type,
        candidateName: sql`${candidates.firstName} || ' ' || ${candidates.lastName}`,
        jobTitle: jobs.title,
        interviewerName: sql`${users.firstName} || ' ' || ${users.lastName}`,
      })
      .from(interviews)
      .innerJoin(applications, eq(interviews.applicationId, applications.id))
      .innerJoin(candidates, eq(applications.candidateId, candidates.id))
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(users, eq(interviews.interviewerId, users.id))
      .where(sql`${interviews.scheduledAt} >= ${now}`)
      .orderBy(interviews.scheduledAt)
      .limit(10);
  }

  // Notes operations
  async getNotesByApplication(applicationId: number): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .where(eq(notes.applicationId, applicationId))
      .orderBy(desc(notes.createdAt));
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await db.insert(notes).values(note).returning();
    return newNote;
  }

  // Activity tracking
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async getRecentActivities(limit: number = 10): Promise<any[]> {
    return await db
      .select({
        id: activities.id,
        action: activities.action,
        entityType: activities.entityType,
        entityId: activities.entityId,
        metadata: activities.metadata,
        createdAt: activities.createdAt,
        userName: sql`${users.firstName} || ' ' || ${users.lastName}`,
        userProfileImage: users.profileImageUrl,
      })
      .from(activities)
      .innerJoin(users, eq(activities.userId, users.id))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  // Dashboard metrics
  async getDashboardMetrics(): Promise<any> {
    const [totalApplicationsResult] = await db
      .select({ count: count() })
      .from(applications);

    const [activeJobsResult] = await db
      .select({ count: count() })
      .from(jobs)
      .where(eq(jobs.status, "active"));

    const [scheduledInterviewsResult] = await db
      .select({ count: count() })
      .from(interviews)
      .where(eq(interviews.status, "scheduled"));

    return {
      totalApplications: totalApplicationsResult.count,
      activeJobs: activeJobsResult.count,
      scheduledInterviews: scheduledInterviewsResult.count,
      timeToHire: 18, // This would need more complex calculation
    };
  }

  async getPipelineData(): Promise<any> {
    const pipelineStats = await db
      .select({
        status: applications.status,
        count: count(),
      })
      .from(applications)
      .groupBy(applications.status);

    const applicationsWithCandidates = await db
      .select({
        id: applications.id,
        status: applications.status,
        candidateId: candidates.id,
        candidateName: sql`${candidates.firstName} || ' ' || ${candidates.lastName}`,
        jobTitle: jobs.title,
        score: applications.score,
      })
      .from(applications)
      .innerJoin(candidates, eq(applications.candidateId, candidates.id))
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .orderBy(desc(applications.appliedAt));

    return {
      stats: pipelineStats,
      applications: applicationsWithCandidates,
    };
  }
}

export const storage = new DatabaseStorage();
