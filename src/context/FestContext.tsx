import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Festival, Team, Category, Venue, Participant, Programme,
  Registration, Judge, ScoreSubmission, ProgrammeResult,
  Certificate, NewsArticle, Announcement, GalleryItem,
  DownloadItem, ContactMessage, AuditLog, User, UserRole, ResultItem
} from '../types';
import {
  INITIAL_FESTIVALS, INITIAL_TEAMS, INITIAL_CATEGORIES,
  INITIAL_VENUES, INITIAL_PARTICIPANTS, INITIAL_PROGRAMMES,
  INITIAL_REGISTRATIONS, INITIAL_JUDGES, INITIAL_SCORES,
  INITIAL_RESULTS, INITIAL_CERTIFICATES, INITIAL_NEWS,
  INITIAL_ANNOUNCEMENTS, INITIAL_GALLERY, INITIAL_DOWNLOADS,
  INITIAL_MESSAGES, INITIAL_AUDIT_LOGS, DEMO_USERS
} from '../data/seedData';

interface SchedulingConflict {
  type: 'venue_overlap' | 'participant_clash' | 'judge_clash';
  severity: 'error' | 'warning';
  title: string;
  description: string;
  programmes: string[];
}

interface FestContextType {
  festivals: Festival[];
  currentFestival: Festival;
  selectFestival: (id: string) => void;
  createFestival: (festival: Omit<Festival, 'id'>) => void;
  updateFestival: (id: string, updates: Partial<Festival>) => void;

  currentUser: User;
  switchUser: (user: User) => void;
  switchUserRole: (role: UserRole) => void;

  teams: Team[];
  addTeam: (team: Omit<Team, 'id' | 'festivalId' | 'points'>) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;

  categories: Category[];
  venues: Venue[];
  addVenue: (venue: Omit<Venue, 'id' | 'festivalId'>) => void;
  updateVenue: (id: string, updates: Partial<Venue>) => void;

  participants: Participant[];
  addParticipant: (p: Omit<Participant, 'id' | 'festivalId' | 'createdAt'>) => void;
  updateParticipant: (id: string, updates: Partial<Participant>) => void;
  deleteParticipant: (id: string) => void;
  bulkImportParticipants: (list: Omit<Participant, 'id' | 'festivalId' | 'createdAt'>[]) => number;

  programmes: Programme[];
  addProgramme: (prog: Omit<Programme, 'id' | 'festivalId'>) => void;
  updateProgramme: (id: string, updates: Partial<Programme>) => void;
  deleteProgramme: (id: string) => void;

  registrations: Registration[];
  addRegistration: (reg: Omit<Registration, 'id' | 'festivalId' | 'createdAt'>) => void;
  updateRegistrationStatus: (id: string, status: 'confirmed' | 'pending' | 'rejected') => void;
  deleteRegistration: (id: string) => void;

  judges: Judge[];
  addJudge: (judge: Omit<Judge, 'id' | 'festivalId'>) => void;
  updateJudge: (id: string, updates: Partial<Judge>) => void;
  assignJudge: (judgeId: string, programmeId: string) => void;

  scores: ScoreSubmission[];
  saveScore: (score: Omit<ScoreSubmission, 'id' | 'festivalId' | 'submittedAt'>) => void;

  results: ProgrammeResult[];
  computeAndSaveResult: (programmeId: string) => ProgrammeResult;
  approveResult: (resultId: string) => void;
  publishResult: (resultId: string) => void;
  withdrawResult: (resultId: string) => void;

  certificates: Certificate[];
  issueCertificate: (cert: Omit<Certificate, 'id' | 'festivalId' | 'verificationCode' | 'status'>) => Certificate;
  verifyCertificate: (code: string) => Certificate | undefined;

  news: NewsArticle[];
  announcements: Announcement[];
  gallery: GalleryItem[];
  downloads: DownloadItem[];
  contactMessages: ContactMessage[];
  submitContactMessage: (msg: { name: string; email: string; subject: string; message: string }) => void;
  updateMessageStatus: (id: string, status: 'unread' | 'read' | 'replied') => void;

  auditLogs: AuditLog[];
  logAction: (action: string, details: string) => void;

  // Timetable & Scheduling
  schedulingConflicts: SchedulingConflict[];
  runAutoScheduler: () => { scheduledCount: number; conflictCount: number };

  language: 'en' | 'ml';
  toggleLanguage: () => void;
  resetAllData: () => void;
}

const FestContext = createContext<FestContextType | undefined>(undefined);

const STORAGE_KEY = 'artsfest_pro_state_v1';

export const FestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or seeds
  const [festivals, setFestivals] = useState<Festival[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_festivals`);
    return saved ? JSON.parse(saved) : INITIAL_FESTIVALS;
  });

  const [currentFestId, setCurrentFestId] = useState<string>(() => {
    return festivals[0]?.id || 'fest-01';
  });

  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS[0]);
  const [language, setLanguage] = useState<'en' | 'ml'>('en');

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_teams`);
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [venues, setVenues] = useState<Venue[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_venues`);
    return saved ? JSON.parse(saved) : INITIAL_VENUES;
  });

  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_participants`);
    return saved ? JSON.parse(saved) : INITIAL_PARTICIPANTS;
  });

  const [programmes, setProgrammes] = useState<Programme[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_programmes`);
    return saved ? JSON.parse(saved) : INITIAL_PROGRAMMES;
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_registrations`);
    return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
  });

  const [judges, setJudges] = useState<Judge[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_judges`);
    return saved ? JSON.parse(saved) : INITIAL_JUDGES;
  });

  const [scores, setScores] = useState<ScoreSubmission[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_scores`);
    return saved ? JSON.parse(saved) : INITIAL_SCORES;
  });

  const [results, setResults] = useState<ProgrammeResult[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_results`);
    return saved ? JSON.parse(saved) : INITIAL_RESULTS;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_certificates`);
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [news, setNews] = useState<NewsArticle[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_news`);
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_announcements`);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_gallery`);
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [downloads] = useState<DownloadItem[]>(INITIAL_DOWNLOADS);

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_messages`);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Keep local storage synced
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_festivals`, JSON.stringify(festivals));
  }, [festivals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_teams`, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_venues`, JSON.stringify(venues));
  }, [venues]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_participants`, JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_programmes`, JSON.stringify(programmes));
  }, [programmes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_registrations`, JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_judges`, JSON.stringify(judges));
  }, [judges]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_scores`, JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_results`, JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_certificates`, JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_news`, JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_announcements`, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const currentFestival = festivals.find(f => f.id === currentFestId) || festivals[0];

  const logAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      festivalId: currentFestival.id,
      timestamp: new Date().toISOString(),
      actor: currentUser.name,
      role: currentUser.role,
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const selectFestival = (id: string) => {
    setCurrentFestId(id);
    logAction('SWITCH_FESTIVAL', `Switched view to festival ${id}`);
  };

  const createFestival = (festData: Omit<Festival, 'id'>) => {
    const newFest: Festival = {
      ...festData,
      id: `fest-${Date.now()}`
    };
    setFestivals(prev => [...prev, newFest]);
    setCurrentFestId(newFest.id);
    logAction('CREATE_FESTIVAL', `Created new festival: ${newFest.name}`);
  };

  const updateFestival = (id: string, updates: Partial<Festival>) => {
    setFestivals(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    logAction('UPDATE_FESTIVAL', `Updated festival settings for ${id}`);
  };

  const switchUser = (user: User) => {
    setCurrentUser(user);
    logAction('SWITCH_USER', `Active user changed to ${user.name} (${user.role})`);
  };

  const switchUserRole = (role: UserRole) => {
    const match = DEMO_USERS.find(u => u.role === role) || {
      id: `usr-${role}`,
      name: `${role.replace('_', ' ').toUpperCase()} Account`,
      email: `${role}@artsfestpro.org`,
      role
    };
    setCurrentUser(match);
    logAction('SWITCH_ROLE', `Role switched to ${role}`);
  };

  // Team management
  const addTeam = (teamData: Omit<Team, 'id' | 'festivalId' | 'points'>) => {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`,
      festivalId: currentFestival.id,
      points: 0
    };
    setTeams(prev => [...prev, newTeam]);
    logAction('ADD_TEAM', `Added team ${newTeam.name} (${newTeam.code})`);
  };

  const updateTeam = (id: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    logAction('UPDATE_TEAM', `Modified team details for ${id}`);
  };

  const deleteTeam = (id: string) => {
    setTeams(prev => prev.filter(t => t.id !== id));
    logAction('DELETE_TEAM', `Removed team ${id}`);
  };

  // Venues
  const addVenue = (venueData: Omit<Venue, 'id' | 'festivalId'>) => {
    const newVenue: Venue = {
      ...venueData,
      id: `ven-${Date.now()}`,
      festivalId: currentFestival.id
    };
    setVenues(prev => [...prev, newVenue]);
    logAction('ADD_VENUE', `Added venue ${newVenue.name}`);
  };

  const updateVenue = (id: string, updates: Partial<Venue>) => {
    setVenues(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    logAction('UPDATE_VENUE', `Updated venue ${id}`);
  };

  // Participants
  const addParticipant = (pData: Omit<Participant, 'id' | 'festivalId' | 'createdAt'>) => {
    const newP: Participant = {
      ...pData,
      id: `p-${Date.now()}`,
      festivalId: currentFestival.id,
      createdAt: new Date().toISOString()
    };
    setParticipants(prev => [...prev, newP]);
    logAction('ADD_PARTICIPANT', `Enrolled participant ${newP.name} (Chest #${newP.chestNumber})`);
  };

  const updateParticipant = (id: string, updates: Partial<Participant>) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    logAction('UPDATE_PARTICIPANT', `Updated participant records for ${id}`);
  };

  const deleteParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
    logAction('DELETE_PARTICIPANT', `Deleted participant ${id}`);
  };

  const bulkImportParticipants = (list: Omit<Participant, 'id' | 'festivalId' | 'createdAt'>[]) => {
    const currentFestParticipants = participants.filter(p => p.festivalId === currentFestival.id);
    const existingChests = new Set(currentFestParticipants.map(p => p.chestNumber));

    const validNewParticipants: Participant[] = [];
    list.forEach((item, idx) => {
      let chest = item.chestNumber;
      if (!chest || existingChests.has(chest)) {
        chest = `${Math.floor(500 + Math.random() * 400)}`;
      }
      existingChests.add(chest);
      validNewParticipants.push({
        ...item,
        id: `p-import-${Date.now()}-${idx}`,
        festivalId: currentFestival.id,
        chestNumber: chest,
        createdAt: new Date().toISOString()
      });
    });

    setParticipants(prev => [...prev, ...validNewParticipants]);
    logAction('BULK_IMPORT_PARTICIPANTS', `Imported ${validNewParticipants.length} participants via CSV/Excel`);
    return validNewParticipants.length;
  };

  // Programmes
  const addProgramme = (progData: Omit<Programme, 'id' | 'festivalId'>) => {
    const newProg: Programme = {
      ...progData,
      id: `prog-${Date.now()}`,
      festivalId: currentFestival.id
    };
    setProgrammes(prev => [...prev, newProg]);
    logAction('ADD_PROGRAMME', `Created programme: ${newProg.code} - ${newProg.title}`);
  };

  const updateProgramme = (id: string, updates: Partial<Programme>) => {
    setProgrammes(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    logAction('UPDATE_PROGRAMME', `Updated programme details for ${id}`);
  };

  const deleteProgramme = (id: string) => {
    setProgrammes(prev => prev.filter(p => p.id !== id));
    logAction('DELETE_PROGRAMME', `Deleted programme ${id}`);
  };

  // Registrations
  const addRegistration = (regData: Omit<Registration, 'id' | 'festivalId' | 'createdAt'>) => {
    const newReg: Registration = {
      ...regData,
      id: `reg-${Date.now()}`,
      festivalId: currentFestival.id,
      createdAt: new Date().toISOString()
    };
    setRegistrations(prev => [...prev, newReg]);
    logAction('ADD_REGISTRATION', `Registered chest #${newReg.chestNumber} for programme ${newReg.programmeId}`);
  };

  const updateRegistrationStatus = (id: string, status: 'confirmed' | 'pending' | 'rejected') => {
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    logAction('REGISTRATION_STATUS', `Registration ${id} status updated to ${status}`);
  };

  const deleteRegistration = (id: string) => {
    setRegistrations(prev => prev.filter(r => r.id !== id));
    logAction('DELETE_REGISTRATION', `Cancelled registration ${id}`);
  };

  // Judges
  const addJudge = (judgeData: Omit<Judge, 'id' | 'festivalId'>) => {
    const newJudge: Judge = {
      ...judgeData,
      id: `jdg-${Date.now()}`,
      festivalId: currentFestival.id
    };
    setJudges(prev => [...prev, newJudge]);
    logAction('ADD_JUDGE', `Registered adjudicator ${newJudge.name}`);
  };

  const updateJudge = (id: string, updates: Partial<Judge>) => {
    setJudges(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
    logAction('UPDATE_JUDGE', `Updated judge ${id}`);
  };

  const assignJudge = (judgeId: string, programmeId: string) => {
    setJudges(prev => prev.map(j => {
      if (j.id === judgeId) {
        const assigned = j.assignedProgrammes.includes(programmeId)
          ? j.assignedProgrammes
          : [...j.assignedProgrammes, programmeId];
        return { ...j, assignedProgrammes: assigned };
      }
      return j;
    }));
    logAction('ASSIGN_JUDGE', `Assigned judge ${judgeId} to programme ${programmeId}`);
  };

  // Scoring
  const saveScore = (scoreData: Omit<ScoreSubmission, 'id' | 'festivalId' | 'submittedAt'>) => {
    const existing = scores.find(s => 
      s.programmeId === scoreData.programmeId && 
      s.judgeId === scoreData.judgeId && 
      s.registrationId === scoreData.registrationId
    );

    if (existing) {
      setScores(prev => prev.map(s => s.id === existing.id ? {
        ...s,
        ...scoreData,
        submittedAt: new Date().toISOString()
      } : s));
      logAction('UPDATE_SCORE', `Updated score for Chest #${scoreData.chestNumber} (${scoreData.totalScore} pts)`);
    } else {
      const newScore: ScoreSubmission = {
        ...scoreData,
        id: `sc-${Date.now()}`,
        festivalId: currentFestival.id,
        submittedAt: new Date().toISOString()
      };
      setScores(prev => [...prev, newScore]);
      logAction('SUBMIT_SCORE', `Submitted score for Chest #${scoreData.chestNumber} (${scoreData.totalScore} pts)`);
    }
  };

  // Results calculation & publishing
  const computeAndSaveResult = (programmeId: string): ProgrammeResult => {
    const prog = programmes.find(p => p.id === programmeId);
    const progRegistrations = registrations.filter(r => r.programmeId === programmeId);
    const progScores = scores.filter(s => s.programmeId === programmeId);

    // Calculate aggregated marks for each registration
    const candidateAggregates: {
      registrationId: string;
      chestNumber: string;
      participantName: string;
      teamId: string;
      teamName: string;
      totalMarks: number;
    }[] = [];

    progRegistrations.forEach(reg => {
      const candidateScores = progScores.filter(s => s.registrationId === reg.id || s.chestNumber === reg.chestNumber);
      const avgMarks = candidateScores.length > 0
        ? Math.round(candidateScores.reduce((sum, s) => sum + s.totalScore, 0) / candidateScores.length)
        : 0;

      const team = teams.find(t => t.id === reg.teamId);
      let participantName = 'Team Entry';
      if (reg.participantId) {
        const p = participants.find(part => part.id === reg.participantId);
        if (p) participantName = p.name;
      } else if (reg.groupMembers && reg.groupMembers.length > 0) {
        participantName = reg.groupMembers.map(m => m.name).join(', ');
      }

      candidateAggregates.push({
        registrationId: reg.id,
        chestNumber: reg.chestNumber,
        participantName,
        teamId: reg.teamId,
        teamName: team?.name || 'Independent',
        totalMarks: avgMarks
      });
    });

    // Sort descending by totalMarks
    candidateAggregates.sort((a, b) => b.totalMarks - a.totalMarks);

    // Assign grades and ranks
    const rules = currentFestival.scoringRules;
    const rankings: ResultItem[] = candidateAggregates.map((c, index) => {
      const rank = index + 1;
      let grade: 'A' | 'B' | 'C' | 'None' = 'None';
      if (c.totalMarks >= 80) grade = 'A';
      else if (c.totalMarks >= 70) grade = 'B';
      else if (c.totalMarks >= 60) grade = 'C';

      let posPoints = 0;
      if (rank === 1) posPoints = rules.firstPlace;
      else if (rank === 2) posPoints = rules.secondPlace;
      else if (rank === 3) posPoints = rules.thirdPlace;

      let gradePoints = 0;
      if (grade === 'A') gradePoints = rules.aGrade;
      else if (grade === 'B') gradePoints = rules.bGrade;
      else if (grade === 'C') gradePoints = rules.cGrade;

      const isGroup = prog?.type === 'group';
      const multiplier = isGroup ? rules.groupMultiplier : 1;
      const pointsEarned = (posPoints + gradePoints) * multiplier;

      return {
        rank,
        chestNumber: c.chestNumber,
        participantName: c.participantName,
        teamId: c.teamId,
        teamName: c.teamName,
        totalMarks: c.totalMarks,
        grade,
        pointsEarned
      };
    });

    const existingResult = results.find(r => r.programmeId === programmeId);
    let updatedResult: ProgrammeResult;

    if (existingResult) {
      updatedResult = {
        ...existingResult,
        rankings,
        status: 'pending_review'
      };
      setResults(prev => prev.map(r => r.id === existingResult.id ? updatedResult : r));
    } else {
      updatedResult = {
        id: `res-${Date.now()}`,
        festivalId: currentFestival.id,
        programmeId,
        status: 'pending_review',
        rankings,
        notes: `Scores compiled from ${progScores.length} judge submissions.`
      };
      setResults(prev => [...prev, updatedResult]);
    }

    logAction('COMPUTE_RESULTS', `Computed rankings for programme ${prog?.code || programmeId}`);
    return updatedResult;
  };

  // Recalculate team points based on all published results
  const syncTeamPoints = (allResults: ProgrammeResult[]) => {
    const published = allResults.filter(r => r.festivalId === currentFestival.id && r.status === 'published');
    const teamPointMap: Record<string, number> = {};

    teams.forEach(t => { teamPointMap[t.id] = 0; });

    published.forEach(res => {
      res.rankings.forEach(item => {
        if (item.teamId && teamPointMap[item.teamId] !== undefined) {
          teamPointMap[item.teamId] += item.pointsEarned;
        }
      });
    });

    setTeams(prev => prev.map(t => ({
      ...t,
      points: teamPointMap[t.id] ?? t.points
    })));
  };

  const approveResult = (resultId: string) => {
    const updated = results.map(r => r.id === resultId ? {
      ...r,
      status: 'approved' as const,
      approvedBy: currentUser.name
    } : r);
    setResults(updated);
    logAction('APPROVE_RESULT', `Approved verified results for result ${resultId}`);
  };

  const publishResult = (resultId: string) => {
    const updated = results.map(r => r.id === resultId ? {
      ...r,
      status: 'published' as const,
      publishedAt: new Date().toISOString(),
      approvedBy: currentUser.name
    } : r);
    setResults(updated);
    syncTeamPoints(updated);

    // Auto-generate certificates for winners rank 1-3
    const res = results.find(r => r.id === resultId);
    if (res) {
      const prog = programmes.find(p => p.id === res.programmeId);
      const cat = categories.find(c => c.id === prog?.categoryId);

      res.rankings.filter(item => item.rank <= 3).forEach(winner => {
        const certCode = `VRF-${Date.now().toString().slice(-4)}-${winner.chestNumber}`;
        const newCert: Certificate = {
          id: `cert-${Date.now()}-${winner.chestNumber}`,
          certificateNumber: `AFP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          festivalId: currentFestival.id,
          participantName: winner.participantName,
          chestNumber: winner.chestNumber,
          programmeTitle: prog?.title || 'Arts Competition',
          categoryName: cat?.name || 'General',
          rank: winner.rank,
          grade: winner.grade,
          teamName: winner.teamName,
          issueDate: new Date().toISOString().split('T')[0],
          verificationCode: certCode,
          status: 'valid'
        };
        setCertificates(prev => {
          if (!prev.some(c => c.chestNumber === winner.chestNumber && c.programmeTitle === newCert.programmeTitle)) {
            return [...prev, newCert];
          }
          return prev;
        });
      });
    }

    logAction('PUBLISH_RESULT', `Published official results to public leaderboard for ${resultId}`);
  };

  const withdrawResult = (resultId: string) => {
    const updated = results.map(r => r.id === resultId ? {
      ...r,
      status: 'withdrawn' as const
    } : r);
    setResults(updated);
    syncTeamPoints(updated);
    logAction('WITHDRAW_RESULT', `Withdrew published result ${resultId} for revision`);
  };

  // Certificate issuance
  const issueCertificate = (certData: Omit<Certificate, 'id' | 'festivalId' | 'verificationCode' | 'status'>) => {
    const verificationCode = `VRF-${Date.now().toString().slice(-4)}-${certData.chestNumber}`;
    const newCert: Certificate = {
      ...certData,
      id: `cert-${Date.now()}`,
      festivalId: currentFestival.id,
      verificationCode,
      status: 'valid'
    };
    setCertificates(prev => [...prev, newCert]);
    logAction('ISSUE_CERTIFICATE', `Issued certificate #${newCert.certificateNumber} for ${newCert.participantName}`);
    return newCert;
  };

  const verifyCertificate = (code: string) => {
    const query = code.trim().toUpperCase();
    return certificates.find(c => 
      c.verificationCode.toUpperCase() === query || 
      c.certificateNumber.toUpperCase() === query
    );
  };

  // Contact messages
  const submitContactMessage = (msg: { name: string; email: string; subject: string; message: string }) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      festivalId: currentFestival.id,
      date: new Date().toISOString(),
      status: 'unread'
    };
    setContactMessages(prev => [newMsg, ...prev]);
    logAction('SUBMIT_CONTACT_MESSAGE', `New inquiry received from ${msg.name}`);
  };

  const updateMessageStatus = (id: string, status: 'unread' | 'read' | 'replied') => {
    setContactMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  // Conflict Detection
  const detectSchedulingConflicts = (): SchedulingConflict[] => {
    const conflicts: SchedulingConflict[] = [];
    const festProgrammes = programmes.filter(p => p.festivalId === currentFestival.id && p.date && p.startTime && p.venueId);

    // 1. Venue overlaps (2 programmes scheduled in same venue with overlapping times on same date)
    for (let i = 0; i < festProgrammes.length; i++) {
      for (let j = i + 1; j < festProgrammes.length; j++) {
        const p1 = festProgrammes[i];
        const p2 = festProgrammes[j];

        if (p1.date === p2.date && p1.venueId === p2.venueId) {
          if (p1.startTime && p1.endTime && p2.startTime && p2.endTime) {
            if (p1.startTime < p2.endTime && p2.startTime < p1.endTime) {
              const venue = venues.find(v => v.id === p1.venueId);
              conflicts.push({
                type: 'venue_overlap',
                severity: 'error',
                title: `Venue Collision at ${venue?.name || 'Stage'}`,
                description: `Programmes "${p1.title}" and "${p2.title}" are both scheduled at ${venue?.name} between ${p1.startTime} - ${p2.endTime}.`,
                programmes: [p1.id, p2.id]
              });
            }
          }
        }
      }
    }

    // 2. Participant double booking (Participant registered in 2 simultaneous events)
    const activeRegs = registrations.filter(r => r.festivalId === currentFestival.id);
    for (let i = 0; i < festProgrammes.length; i++) {
      for (let j = i + 1; j < festProgrammes.length; j++) {
        const p1 = festProgrammes[i];
        const p2 = festProgrammes[j];

        if (p1.date === p2.date && p1.startTime && p1.endTime && p2.startTime && p2.endTime) {
          if (p1.startTime < p2.endTime && p2.startTime < p1.endTime) {
            // Check overlapping participants
            const p1Regs = activeRegs.filter(r => r.programmeId === p1.id);
            const p2Regs = activeRegs.filter(r => r.programmeId === p2.id);

            p1Regs.forEach(r1 => {
              const clash = p2Regs.find(r2 => r2.chestNumber === r1.chestNumber || (r1.participantId && r2.participantId && r1.participantId === r2.participantId));
              if (clash) {
                const part = participants.find(p => p.chestNumber === r1.chestNumber);
                conflicts.push({
                  type: 'participant_clash',
                  severity: 'error',
                  title: `Participant Time Clash: Chest #${r1.chestNumber}`,
                  description: `${part?.name || 'Participant'} is scheduled to perform simultaneously in "${p1.title}" and "${p2.title}" on ${p1.date}.`,
                  programmes: [p1.id, p2.id]
                });
              }
            });
          }
        }
      }
    }

    return conflicts;
  };

  const schedulingConflicts = detectSchedulingConflicts();

  // Auto-Scheduler Algorithm
  const runAutoScheduler = () => {
    const festVenues = venues.filter(v => v.festivalId === currentFestival.id);
    if (festVenues.length === 0) return { scheduledCount: 0, conflictCount: 0 };

    const unscheduled = programmes.filter(p => p.festivalId === currentFestival.id && (!p.venueId || !p.startTime));
    const dates = [currentFestival.startDate || '2026-10-15', currentFestival.endDate || '2026-10-16'];

    let venueIndex = 0;
    let currentHour = 9;
    let currentMinute = 0;
    let dateIndex = 0;
    let scheduledCount = 0;

    const updated = programmes.map(p => {
      if (p.festivalId !== currentFestival.id) return p;
      if (p.venueId && p.startTime) return p; // Already scheduled

      const venue = festVenues[venueIndex % festVenues.length];
      const date = dates[dateIndex % dates.length];

      const startH = String(currentHour).padStart(2, '0');
      const startM = String(currentMinute).padStart(2, '0');
      const startTime = `${startH}:${startM}`;

      const totalDuration = (p.durationMinutes || 30) + 15; // 15 min buffer
      currentMinute += totalDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }

      if (currentHour >= 18) {
        currentHour = 9;
        currentMinute = 0;
        venueIndex++;
        if (venueIndex >= festVenues.length) {
          venueIndex = 0;
          dateIndex++;
        }
      }

      const endH = String(currentHour).padStart(2, '0');
      const endM = String(currentMinute).padStart(2, '0');
      const endTime = `${endH}:${endM}`;

      scheduledCount++;
      return {
        ...p,
        venueId: venue.id,
        date,
        startTime,
        endTime,
        status: 'scheduled' as const
      };
    });

    setProgrammes(updated);
    logAction('AUTO_SCHEDULE', `Automated timetable engine scheduled ${scheduledCount} events with venue and conflict checks`);

    return {
      scheduledCount,
      conflictCount: detectSchedulingConflicts().length
    };
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ml' : 'en');
  };

  const resetAllData = () => {
    localStorage.clear();
    setFestivals(INITIAL_FESTIVALS);
    setCurrentFestId(INITIAL_FESTIVALS[0].id);
    setTeams(INITIAL_TEAMS);
    setVenues(INITIAL_VENUES);
    setParticipants(INITIAL_PARTICIPANTS);
    setProgrammes(INITIAL_PROGRAMMES);
    setRegistrations(INITIAL_REGISTRATIONS);
    setJudges(INITIAL_JUDGES);
    setScores(INITIAL_SCORES);
    setResults(INITIAL_RESULTS);
    setCertificates(INITIAL_CERTIFICATES);
    setNews(INITIAL_NEWS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setGallery(INITIAL_GALLERY);
    setContactMessages(INITIAL_MESSAGES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUser(DEMO_USERS[0]);
  };

  return (
    <FestContext.Provider
      value={{
        festivals,
        currentFestival,
        selectFestival,
        createFestival,
        updateFestival,
        currentUser,
        switchUser,
        switchUserRole,
        teams,
        addTeam,
        updateTeam,
        deleteTeam,
        categories,
        venues,
        addVenue,
        updateVenue,
        participants,
        addParticipant,
        updateParticipant,
        deleteParticipant,
        bulkImportParticipants,
        programmes,
        addProgramme,
        updateProgramme,
        deleteProgramme,
        registrations,
        addRegistration,
        updateRegistrationStatus,
        deleteRegistration,
        judges,
        addJudge,
        updateJudge,
        assignJudge,
        scores,
        saveScore,
        results,
        computeAndSaveResult,
        approveResult,
        publishResult,
        withdrawResult,
        certificates,
        issueCertificate,
        verifyCertificate,
        news,
        announcements,
        gallery,
        downloads,
        contactMessages,
        submitContactMessage,
        updateMessageStatus,
        auditLogs,
        logAction,
        schedulingConflicts,
        runAutoScheduler,
        language,
        toggleLanguage,
        resetAllData
      }}
    >
      {children}
    </FestContext.Provider>
  );
};

export const useFest = () => {
  const context = useContext(FestContext);
  if (!context) {
    throw new Error('useFest must be used within a FestProvider');
  }
  return context;
};
