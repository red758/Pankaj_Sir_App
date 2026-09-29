import type { ObjectId } from "mongodb";
 
/**
 * Core domain types, mirroring the Kaamgar Data Model document (v0.1) field
 * for field. Every API route and database query should import types from
 * here rather than redefining shapes inline — this file is the single
 * source of truth for what a User/Job/Bid/Review actually looks like.
 */
 
// ---------------------------------------------------------------
// Shared small types
// ---------------------------------------------------------------
 
export type SupportedLanguage = "en" | "hi" | "mr";
 
export type GeoPoint = {
  type: "Point";
  /** [longitude, latitude] — GeoJSON order, NOT latitude-first. */
  coordinates: [number, number];
};
 
export type Money = {
  amount: number;
  currency: "INR";
};
 
export type PriceRange = {
  min: number;
  max: number;
  currency: "INR";
};
 
/** A single AI-inferred or worker-confirmed skill/category tag. */
export type SkillTag = {
  label: string;
  /** Present on AI-suggested tags; omitted once a tag is worker-confirmed. */
  confidence?: number;
  embeddingId?: string;
};
 
// ---------------------------------------------------------------
// User
// ---------------------------------------------------------------
 
export type HirerProfile = {
  jobsPostedCount: number;
  avgRatingAsHirer?: number;
};
 
export type WorkerAvailability = "available" | "offline";
 
export type WorkerProfile = {
  /**
   * True only once all four minimum-setup fields below are present
   * (PRD FR-3). Gate every "is this user bid-eligible" check on this
   * flag — never infer eligibility from the presence of individual
   * fields alone.
   */
  isUnlocked: boolean;
  selfDescription?: string;
  aiSuggestedSkills: SkillTag[];
  /** Worker-approved subset of aiSuggestedSkills, or edited by the worker. */
  confirmedSkills: SkillTag[];
  availabilityStatus?: WorkerAvailability;
  currentLocation?: GeoPoint;
  serviceRadiusKm?: number;
  avgRatingAsWorker?: number;
  completedJobsCount: number;
};
 
export type VerificationTier = "phone" | "aadhaar";
 
export type User = {
  _id: ObjectId;
  phone: string;
  phoneVerifiedAt: Date;
  name: string;
  photoUrl?: string;
  preferredLanguage: SupportedLanguage;
  hirerProfile: HirerProfile;
  workerProfile: WorkerProfile;
  verificationTier: VerificationTier;
  createdAt: Date;
  updatedAt: Date;
};
 
// ---------------------------------------------------------------
// Job
// ---------------------------------------------------------------
 
export type JobStatus = "pending_price_approval" | "open" | "assigned" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "pending_confirmation" | "paid" | "failed";
 
export type Job = {
  _id: ObjectId;
  hirerId: ObjectId;
  description: string;
  aiInferredCategory: SkillTag;
  location: GeoPoint;
  suggestedPriceRange: PriceRange;
  approvedPriceRange?: PriceRange;
  status: JobStatus;
  selectedBidId?: ObjectId;
  selectedWorkerId?: ObjectId;
  /** Set the moment a worker is selected; gates contact-field exposure (FR-18–FR-20). */
  contactRevealedAt?: Date;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  cancelledBy?: ObjectId;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};
 
// ---------------------------------------------------------------
// Bid
// ---------------------------------------------------------------
 
export type BidStatus = "pending" | "accepted" | "rejected";
 
export type Bid = {
  _id: ObjectId;
  jobId: ObjectId;
  workerId: ObjectId;
  proposedPrice: Money;
  message?: string;
  status: BidStatus;
  createdAt: Date;
  updatedAt: Date;
};
 
// ---------------------------------------------------------------
// Review
// ---------------------------------------------------------------
 
export type ReviewerRole = "hirer" | "worker";
 
export type Review = {
  _id: ObjectId;
  jobId: ObjectId;
  reviewerId: ObjectId;
  revieweeId: ObjectId;
  /**
   * The role the reviewer was acting in for THIS job specifically —
   * always derived from Job.hirerId / Job.selectedWorkerId at write time,
   * never read from any persistent field on the reviewer's account. A
   * Worker-tier user who posted this job as a hirer gets reviewerRole:
   * "hirer" here, regardless of their Worker access elsewhere.
   */
  reviewerRole: ReviewerRole;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt: Date;
};
 
// ---------------------------------------------------------------
// Collection name constants — avoid magic strings scattered across routes
// ---------------------------------------------------------------
 
export const COLLECTIONS = {
  users: "users",
  jobs: "jobs",
  bids: "bids",
  reviews: "reviews",
} as const;
 
