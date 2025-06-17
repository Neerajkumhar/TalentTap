import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertJobSchema, insertCandidateSchema, insertApplicationSchema, insertInterviewSchema, insertNoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get("/api/dashboard/metrics", isAuthenticated, async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  app.get("/api/dashboard/recent-applications", isAuthenticated, async (req, res) => {
    try {
      const applications = await storage.getApplicationsWithDetails();
      res.json(applications.slice(0, 10)); // Return latest 10
    } catch (error) {
      console.error("Error fetching recent applications:", error);
      res.status(500).json({ message: "Failed to fetch recent applications" });
    }
  });

  app.get("/api/dashboard/pipeline", isAuthenticated, async (req, res) => {
    try {
      const pipelineData = await storage.getPipelineData();
      res.json(pipelineData);
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
      res.status(500).json({ message: "Failed to fetch pipeline data" });
    }
  });

  app.get("/api/dashboard/activities", isAuthenticated, async (req, res) => {
    try {
      const activities = await storage.getRecentActivities();
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Job routes
  app.get("/api/jobs", isAuthenticated, async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const job = await storage.getJob(id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  app.post("/api/jobs", isAuthenticated, async (req: any, res) => {
    try {
      const jobData = insertJobSchema.parse({
        ...req.body,
        postedBy: req.user.claims.sub,
      });
      const job = await storage.createJob(jobData);
      
      // Create activity
      await storage.createActivity({
        userId: req.user.claims.sub,
        action: "posted_job",
        entityType: "job",
        entityId: job.id,
        metadata: { jobTitle: job.title },
      });
      
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid job data", errors: error.errors });
      }
      console.error("Error creating job:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  app.put("/api/jobs/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const jobData = insertJobSchema.partial().parse(req.body);
      const job = await storage.updateJob(id, jobData);
      res.json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid job data", errors: error.errors });
      }
      console.error("Error updating job:", error);
      res.status(500).json({ message: "Failed to update job" });
    }
  });

  // Candidate routes
  app.get("/api/candidates", isAuthenticated, async (req, res) => {
    try {
      const { search } = req.query;
      let candidates;
      
      if (search && typeof search === 'string') {
        candidates = await storage.searchCandidates(search);
      } else {
        candidates = await storage.getCandidates();
      }
      
      res.json(candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ message: "Failed to fetch candidates" });
    }
  });

  app.get("/api/candidates/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const candidate = await storage.getCandidate(id);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      res.json(candidate);
    } catch (error) {
      console.error("Error fetching candidate:", error);
      res.status(500).json({ message: "Failed to fetch candidate" });
    }
  });

  app.post("/api/candidates", isAuthenticated, async (req, res) => {
    try {
      const candidateData = insertCandidateSchema.parse(req.body);
      const candidate = await storage.createCandidate(candidateData);
      res.status(201).json(candidate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid candidate data", errors: error.errors });
      }
      console.error("Error creating candidate:", error);
      res.status(500).json({ message: "Failed to create candidate" });
    }
  });

  // Application routes
  app.get("/api/applications", isAuthenticated, async (req, res) => {
    try {
      const applications = await storage.getApplicationsWithDetails();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", isAuthenticated, async (req: any, res) => {
    try {
      const applicationData = insertApplicationSchema.parse({
        ...req.body,
        assignedTo: req.user.claims.sub,
      });
      const application = await storage.createApplication(applicationData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      console.error("Error creating application:", error);
      res.status(500).json({ message: "Failed to create application" });
    }
  });

  app.put("/api/applications/:id/status", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const application = await storage.updateApplicationStatus(id, status);
      
      // Create activity
      await storage.createActivity({
        userId: req.user.claims.sub,
        action: "moved_candidate",
        entityType: "application",
        entityId: application.id,
        metadata: { status, candidateId: application.candidateId },
      });
      
      res.json(application);
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ message: "Failed to update application status" });
    }
  });

  // Interview routes
  app.get("/api/interviews", isAuthenticated, async (req, res) => {
    try {
      const interviews = await storage.getInterviews();
      res.json(interviews);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      res.status(500).json({ message: "Failed to fetch interviews" });
    }
  });

  app.get("/api/interviews/today", isAuthenticated, async (req, res) => {
    try {
      const interviews = await storage.getInterviewsToday();
      res.json(interviews);
    } catch (error) {
      console.error("Error fetching today's interviews:", error);
      res.status(500).json({ message: "Failed to fetch today's interviews" });
    }
  });

  app.post("/api/interviews", isAuthenticated, async (req: any, res) => {
    try {
      const interviewData = insertInterviewSchema.parse({
        ...req.body,
        interviewerId: req.user.claims.sub,
      });
      const interview = await storage.createInterview(interviewData);
      
      // Create activity
      await storage.createActivity({
        userId: req.user.claims.sub,
        action: "scheduled_interview",
        entityType: "interview",
        entityId: interview.id,
        metadata: { applicationId: interview.applicationId },
      });
      
      res.status(201).json(interview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid interview data", errors: error.errors });
      }
      console.error("Error creating interview:", error);
      res.status(500).json({ message: "Failed to create interview" });
    }
  });

  // Notes routes
  app.get("/api/applications/:id/notes", isAuthenticated, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const notes = await storage.getNotesByApplication(applicationId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post("/api/applications/:id/notes", isAuthenticated, async (req: any, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const noteData = insertNoteSchema.parse({
        ...req.body,
        applicationId,
        authorId: req.user.claims.sub,
      });
      const note = await storage.createNote(noteData);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      console.error("Error creating note:", error);
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
