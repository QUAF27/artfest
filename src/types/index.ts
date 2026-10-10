export type UserRole = 
  | 'super_admin'
  | 'festival_admin'
  | 'registration_manager'
  | 'team_manager'
  | 'programme_coordinator'
  | 'judge'
  | 'results_controller'
  | 'certificate_manager'
  | 'public_visitor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
  assignedJudgeId?: string;
  avatar?: string;
}

export interface ScoringRule {
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
  fourthPlace?: number;
  aGrade: number;
  bGrade: number;
  cGrade: number;
  groupMultiplier: number;
}

export interface Festival {
  id: string;
  slug: string;
  name: string;
  nameMl?: string;
  edition: string;
  academicYear: string;
  theme: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  location: string;
  logoUrl?: string;
  bannerUrl?: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  scoringRules: ScoringRule;
  registrationOpen: boolean;
  resultsPublished: boolean;
  contactEmail: string;
  contactPhone: string;
}

export interface Team {
  id: string;
  festivalId: string;
  name: string;
  nameMl?: string;
  code: string;
  color: string;
  institution: string;
  managerName: string;
  managerPhone: string;
  managerEmail?: string;
  points: number;
}

export interface Category {
  id: string;
  festivalId: string;
  name: string;
  code: string;
  minClassOrAge?: string;
  maxClassOrAge?: string;
  description?: string;
  pointMultiplier: number;
}

export interface Venue {
  id: string;
  festivalId: string;
  name: string;
  code: string;
  stageNumber: number;
  capacity: number;
  location: string;
  isIndoor: boolean;
  coordinatorName: string;
  coordinatorPhone: string;
}

export interface Participant {
  id: string;
  festivalId: string;
  teamId: string;
  name: string;
  chestNumber: string;
  categoryId: string;
  gradeOrClass: string;
  dob?: string;
  gender: 'M' | 'F' | 'Other';
  phone?: string;
  photoUrl?: string;
  status: 'verified' | 'pending' | 'flagged';
  createdAt: string;
}

export interface ScoringCriterion {
  id: string;
  name: string;
  maxMarks: number;
}

export interface Programme {
  id: string;
  festivalId: string;
  code: string;
  title: string;
  titleMl?: string;
  categoryId: string;
  type: 'individual' | 'group';
  stageType: 'stage' | 'non_stage';
  durationMinutes: number;
  venueId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  maxParticipants: number;
  judgeCount: number;
  criteria: ScoringCriterion[];
  status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  coordinatorId?: string;
}

export interface GroupMember {
  participantId: string;
  name: string;
  chestNumber: string;
}

export interface Registration {
  id: string;
  festivalId: string;
  programmeId: string;
  teamId: string;
  participantId?: string;
  chestNumber: string;
  groupMembers?: GroupMember[];
  status: 'confirmed' | 'pending' | 'rejected';
  createdAt: string;
}

export interface Judge {
  id: string;
  festivalId: string;
  name: string;
  designation: string;
  specialization: string;
  phone: string;
  email: string;
  assignedProgrammes: string[];
}

export interface ScoreSubmission {
  id: string;
  festivalId: string;
  programmeId: string;
  judgeId: string;
  registrationId: string;
  chestNumber: string;
  criterionScores: Record<string, number>;
  totalScore: number;
  remarks: string;
  status: 'draft' | 'submitted' | 'locked';
  submittedAt: string;
}

export interface ResultItem {
  rank: number;
  chestNumber: string;
  participantName: string;
  teamId: string;
  teamName: string;
  totalMarks: number;
  grade: 'A' | 'B' | 'C' | 'None';
  pointsEarned: number;
}

export interface ProgrammeResult {
  id: string;
  festivalId: string;
  programmeId: string;
  status: 'pending_review' | 'approved' | 'published' | 'withdrawn';
  publishedAt?: string;
  rankings: ResultItem[];
  notes?: string;
  appealNotes?: string;
  approvedBy?: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  festivalId: string;
  participantId?: string;
  participantName: string;
  chestNumber: string;
  programmeTitle: string;
  categoryName: string;
  rank?: number;
  grade?: string;
  teamName: string;
  issueDate: string;
  verificationCode: string;
  status: 'valid' | 'revoked';
}

export interface NewsArticle {
  id: string;
  festivalId: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  author: string;
  imageUrl?: string;
  published: boolean;
}

export interface Announcement {
  id: string;
  festivalId: string;
  title: string;
  message: string;
  priority: 'urgent' | 'high' | 'normal';
  date: string;
  active: boolean;
}

export interface GalleryItem {
  id: string;
  festivalId: string;
  title: string;
  category: string;
  imageUrl: string;
  date: string;
}

export interface DownloadItem {
  id: string;
  festivalId: string;
  title: string;
  description: string;
  category: string;
  fileName: string;
  fileSize: string;
  downloadUrl: string;
  uploadedAt: string;
}

export interface ContactMessage {
  id: string;
  festivalId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'replied';
}

export interface AuditLog {
  id: string;
  festivalId: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
}
