import { 
  Festival, Team, Category, Venue, Participant, Programme, 
  Registration, Judge, ScoreSubmission, ProgrammeResult, 
  Certificate, NewsArticle, Announcement, GalleryItem, 
  DownloadItem, ContactMessage, AuditLog, User 
} from '../types';

export const INITIAL_FESTIVALS: Festival[] = [
  {
    id: 'fest-01',
    slug: 'artsfest-dhdc-2026',
    name: 'DHDC National Arts Fest 2026',
    nameMl: 'ദേശീയ സാഹിത്യ സാംസ്കാരിക കലോത്സവം 2026',
    edition: '28th Edition',
    academicYear: '2025-2026',
    theme: 'Symphony of Heritage & Expression',
    description: 'The premier annual cultural and literary extravaganza bringing together 1,500+ gifted young performers across 120 cultural disciplines.',
    startDate: '2026-10-14',
    endDate: '2026-10-18',
    venue: 'Grand Cultural Grounds & Tagore Amphitheatre',
    location: 'Kozhikode, Kerala',
    logoUrl: '/src/assets/images/trophy_champion_shield_1791618218061.jpg',
    bannerUrl: '/src/assets/images/hero_arts_fest_1791618167678.jpg',
    status: 'active',
    scoringRules: {
      firstPlace: 5,
      secondPlace: 3,
      thirdPlace: 1,
      fourthPlace: 0,
      aGrade: 5,
      bGrade: 3,
      cGrade: 1,
      groupMultiplier: 2
    },
    registrationOpen: true,
    resultsPublished: true,
    contactEmail: 'desk@artsfestpro.org',
    contactPhone: '+91 94470 12345'
  },
  {
    id: 'fest-02',
    slug: 'inter-collegiate-sahityotsav-2026',
    name: 'Inter-Collegiate Sahityotsav 2026',
    nameMl: 'അന്തർകോളേജ് സാഹിത്യോത്സവ് 2026',
    edition: '14th Edition',
    academicYear: '2025-2026',
    theme: 'Words, Rhythm, and Resonance',
    description: 'Zonal collegiate festival celebrating classical literary debates, creative arts, and performing arts.',
    startDate: '2026-11-05',
    endDate: '2026-11-08',
    venue: 'University Central Campus Auditorium',
    location: 'Thrissur, Kerala',
    status: 'draft',
    scoringRules: {
      firstPlace: 5,
      secondPlace: 3,
      thirdPlace: 1,
      aGrade: 5,
      bGrade: 3,
      cGrade: 1,
      groupMultiplier: 2
    },
    registrationOpen: true,
    resultsPublished: false,
    contactEmail: 'contact@sahityotsav.edu',
    contactPhone: '+91 98460 99887'
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-01',
    festivalId: 'fest-01',
    name: 'Al-Bayan House',
    nameMl: 'അൽ ബയാൻ ഹൗസ്',
    code: 'ABH',
    color: '#2563EB', // Blue
    institution: 'Department of Arabic & Humanities',
    managerName: 'Zubair Rahman',
    managerPhone: '+91 94471 00001',
    managerEmail: 'zubair@albayan.org',
    points: 148
  },
  {
    id: 'team-02',
    festivalId: 'fest-01',
    name: 'Cordoba Falcon',
    nameMl: 'കോർദോബ ഫാൽക്കൺ',
    code: 'CBF',
    color: '#059669', // Emerald
    institution: 'Faculty of Classical Languages',
    managerName: 'Farhan Masood',
    managerPhone: '+91 94471 00002',
    managerEmail: 'farhan@cordoba.org',
    points: 139
  },
  {
    id: 'team-03',
    festivalId: 'fest-01',
    name: 'Al-Hambra Guild',
    nameMl: 'അൽ ഹംബ്ര ഗിൽഡ്',
    code: 'AHG',
    color: '#D97706', // Amber
    institution: 'School of Media & Journalism',
    managerName: 'Nabeel Ahmad',
    managerPhone: '+91 94471 00003',
    managerEmail: 'nabeel@alhambra.org',
    points: 122
  },
  {
    id: 'team-04',
    festivalId: 'fest-01',
    name: 'Toledo Titans',
    nameMl: 'ടോളിഡോ ടൈറ്റൻസ്',
    code: 'TLD',
    color: '#7C3AED', // Violet
    institution: 'Centre for Performing Arts & Music',
    managerName: 'Shafeeq V.K.',
    managerPhone: '+91 94471 00004',
    managerEmail: 'shafeeq@toledo.org',
    points: 116
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-01',
    festivalId: 'fest-01',
    name: 'General',
    code: 'GEN',
    description: 'Open festival competitions for all enrolled students',
    pointMultiplier: 1.0
  },
  {
    id: 'cat-02',
    festivalId: 'fest-01',
    name: 'Senior',
    code: 'SNR',
    minClassOrAge: 'Degree / PG',
    description: 'Senior collegiate division',
    pointMultiplier: 1.0
  },
  {
    id: 'cat-03',
    festivalId: 'fest-01',
    name: 'Junior',
    code: 'JNR',
    minClassOrAge: 'Plus Two / Senior Sec',
    description: 'Secondary and higher secondary division',
    pointMultiplier: 1.0
  },
  {
    id: 'cat-04',
    festivalId: 'fest-01',
    name: 'Sub-Junior',
    code: 'SUB',
    minClassOrAge: 'High School',
    description: 'High school student competitions',
    pointMultiplier: 1.0
  }
];

export const INITIAL_VENUES: Venue[] = [
  {
    id: 'ven-01',
    festivalId: 'fest-01',
    name: 'Stage 1 (Tagore Main Auditorium)',
    code: 'STG-1',
    stageNumber: 1,
    capacity: 1200,
    location: 'Main Block - Ground Floor',
    isIndoor: true,
    coordinatorName: 'Prof. Haris K.',
    coordinatorPhone: '+91 94470 55101'
  },
  {
    id: 'ven-02',
    festivalId: 'fest-01',
    name: 'Stage 2 (Open Air Theatre - Nilavu)',
    code: 'STG-2',
    stageNumber: 2,
    capacity: 800,
    location: 'West Campus Garden Area',
    isIndoor: false,
    coordinatorName: 'Musthafa P.',
    coordinatorPhone: '+91 94470 55102'
  },
  {
    id: 'ven-03',
    festivalId: 'fest-01',
    name: 'Stage 3 (Seminar Complex - Harmony)',
    code: 'STG-3',
    stageNumber: 3,
    capacity: 350,
    location: 'Academic Tower Level 2',
    isIndoor: true,
    coordinatorName: 'Dr. Anas Moulavi',
    coordinatorPhone: '+91 94470 55103'
  },
  {
    id: 'ven-04',
    festivalId: 'fest-01',
    name: 'Hall 4 (Fine Arts Gallery Pandal)',
    code: 'HALL-4',
    stageNumber: 4,
    capacity: 200,
    location: 'Exhibition Pavilion Block C',
    isIndoor: true,
    coordinatorName: 'Saleem Master',
    coordinatorPhone: '+91 94470 55104'
  }
];

export const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: 'p-101',
    festivalId: 'fest-01',
    teamId: 'team-01',
    name: 'Muhammad Fayiz',
    chestNumber: '101',
    categoryId: 'cat-02',
    gradeOrClass: 'Final Year BA',
    gender: 'M',
    phone: '+91 98471 22331',
    status: 'verified',
    createdAt: '2026-10-01T10:00:00Z'
  },
  {
    id: 'p-102',
    festivalId: 'fest-01',
    teamId: 'team-01',
    name: 'Aysha Ridha',
    chestNumber: '102',
    categoryId: 'cat-02',
    gradeOrClass: 'BA English 2nd Year',
    gender: 'F',
    phone: '+91 98471 22332',
    status: 'verified',
    createdAt: '2026-10-01T10:15:00Z'
  },
  {
    id: 'p-103',
    festivalId: 'fest-01',
    teamId: 'team-01',
    name: 'Rinshad Cheruvadi',
    chestNumber: '103',
    categoryId: 'cat-01',
    gradeOrClass: 'MA Arabic',
    gender: 'M',
    phone: '+91 98471 22333',
    status: 'verified',
    createdAt: '2026-10-01T10:30:00Z'
  },
  {
    id: 'p-201',
    festivalId: 'fest-01',
    teamId: 'team-02',
    name: 'Bilal Hassan',
    chestNumber: '201',
    categoryId: 'cat-02',
    gradeOrClass: 'BSc Computer Science',
    gender: 'M',
    phone: '+91 98472 22441',
    status: 'verified',
    createdAt: '2026-10-01T11:00:00Z'
  },
  {
    id: 'p-202',
    festivalId: 'fest-01',
    teamId: 'team-02',
    name: 'Fathima Naureen',
    chestNumber: '202',
    categoryId: 'cat-03',
    gradeOrClass: 'Plus Two Commerce',
    gender: 'F',
    phone: '+91 98472 22442',
    status: 'verified',
    createdAt: '2026-10-01T11:15:00Z'
  },
  {
    id: 'p-203',
    festivalId: 'fest-01',
    teamId: 'team-02',
    name: 'Salman Faris',
    chestNumber: '203',
    categoryId: 'cat-02',
    gradeOrClass: 'BA Malayalam',
    gender: 'M',
    phone: '+91 98472 22443',
    status: 'verified',
    createdAt: '2026-10-01T11:30:00Z'
  },
  {
    id: 'p-301',
    festivalId: 'fest-01',
    teamId: 'team-03',
    name: 'Adil Sharaf',
    chestNumber: '301',
    categoryId: 'cat-02',
    gradeOrClass: 'BA Journalism',
    gender: 'M',
    phone: '+91 98473 33551',
    status: 'verified',
    createdAt: '2026-10-01T12:00:00Z'
  },
  {
    id: 'p-302',
    festivalId: 'fest-01',
    teamId: 'team-03',
    name: 'Shahana Mariyam',
    chestNumber: '302',
    categoryId: 'cat-02',
    gradeOrClass: 'BCom 3rd Year',
    gender: 'F',
    phone: '+91 98473 33552',
    status: 'verified',
    createdAt: '2026-10-01T12:15:00Z'
  },
  {
    id: 'p-401',
    festivalId: 'fest-01',
    teamId: 'team-04',
    name: 'Nihad Parappanangadi',
    chestNumber: '401',
    categoryId: 'cat-02',
    gradeOrClass: 'BA History',
    gender: 'M',
    phone: '+91 98474 44661',
    status: 'verified',
    createdAt: '2026-10-01T13:00:00Z'
  },
  {
    id: 'p-402',
    festivalId: 'fest-01',
    teamId: 'team-04',
    name: 'Hiba Nasrin',
    chestNumber: '402',
    categoryId: 'cat-03',
    gradeOrClass: 'Plus One Science',
    gender: 'F',
    phone: '+91 98474 44662',
    status: 'verified',
    createdAt: '2026-10-01T13:20:00Z'
  }
];

export const INITIAL_PROGRAMMES: Programme[] = [
  {
    id: 'prog-01',
    festivalId: 'fest-01',
    code: 'STG-01',
    title: 'Mappilappattu (Solo)',
    titleMl: 'മാപ്പിളപ്പാട്ട് (ഏകാങ്കം)',
    categoryId: 'cat-02',
    type: 'individual',
    stageType: 'stage',
    durationMinutes: 10,
    venueId: 'ven-01',
    date: '2026-10-15',
    startTime: '09:30',
    endTime: '11:00',
    maxParticipants: 12,
    judgeCount: 3,
    criteria: [
      { id: 'c1', name: 'Rhythm & Tala (താളം/ലയം)', maxMarks: 30 },
      { id: 'c2', name: 'Vocal Melody & Bhavam (ഭാവം)', maxMarks: 30 },
      { id: 'c3', name: 'Lyric Diction (ഉച്ചാരണ ശുദ്ധി)', maxMarks: 20 },
      { id: 'c4', name: 'Stage Presence (വേദി സാന്നിധ്യം)', maxMarks: 20 }
    ],
    status: 'completed'
  },
  {
    id: 'prog-02',
    festivalId: 'fest-01',
    code: 'STG-02',
    title: 'Malayalam Elocution',
    titleMl: 'പ്രസംഗം (മലയാളം)',
    categoryId: 'cat-02',
    type: 'individual',
    stageType: 'stage',
    durationMinutes: 7,
    venueId: 'ven-03',
    date: '2026-10-15',
    startTime: '11:15',
    endTime: '13:00',
    maxParticipants: 10,
    judgeCount: 3,
    criteria: [
      { id: 'c1', name: 'Subject Matter & Depth (വിഷയജ്ഞാനം)', maxMarks: 35 },
      { id: 'c2', name: 'Oratory & Modulation (ശബ്ദ വിന്യാസം)', maxMarks: 35 },
      { id: 'c3', name: 'Language & Flow (ഭാഷാശുദ്ധി)', maxMarks: 20 },
      { id: 'c4', name: 'Time Discipline (സമയനിഷ്ഠ)', maxMarks: 10 }
    ],
    status: 'completed'
  },
  {
    id: 'prog-03',
    festivalId: 'fest-01',
    code: 'GRP-01',
    title: 'Patriotic Group Song',
    titleMl: 'ദേശഭക്തിഗാനം (സംഘഗാനം)',
    categoryId: 'cat-01',
    type: 'group',
    stageType: 'stage',
    durationMinutes: 15,
    venueId: 'ven-01',
    date: '2026-10-16',
    startTime: '14:00',
    endTime: '16:00',
    maxParticipants: 6,
    judgeCount: 3,
    criteria: [
      { id: 'c1', name: 'Harmonic Sync & Chorus (ഏകോപനം)', maxMarks: 35 },
      { id: 'c2', name: 'Sur & Melody (ശ്രുതി/താളം)', maxMarks: 35 },
      { id: 'c3', name: 'Lyric Meaning (ഭാവം)', maxMarks: 20 },
      { id: 'c4', name: 'Overall Presentation (അവതരണം)', maxMarks: 10 }
    ],
    status: 'completed'
  },
  {
    id: 'prog-04',
    festivalId: 'fest-01',
    code: 'LIT-01',
    title: 'Pencil Drawing',
    titleMl: 'പെൻസിൽ ഡ്രോയിംഗ്',
    categoryId: 'cat-02',
    type: 'individual',
    stageType: 'non_stage',
    durationMinutes: 90,
    venueId: 'ven-04',
    date: '2026-10-15',
    startTime: '14:30',
    endTime: '16:00',
    maxParticipants: 16,
    judgeCount: 2,
    criteria: [
      { id: 'c1', name: 'Composition & Perspective', maxMarks: 35 },
      { id: 'c2', name: 'Tonal Value & Shading', maxMarks: 35 },
      { id: 'c3', name: 'Creative Interpretation', maxMarks: 30 }
    ],
    status: 'completed'
  },
  {
    id: 'prog-05',
    festivalId: 'fest-01',
    code: 'STG-04',
    title: 'Classical Bharatanatyam',
    titleMl: 'ഭരതനാട്യം (ഏകാങ്കം)',
    categoryId: 'cat-02',
    type: 'individual',
    stageType: 'stage',
    durationMinutes: 15,
    venueId: 'ven-01',
    date: '2026-10-16',
    startTime: '10:00',
    endTime: '12:30',
    maxParticipants: 8,
    judgeCount: 3,
    criteria: [
      { id: 'c1', name: 'Nritta & Footwork (നൃത്തം)', maxMarks: 30 },
      { id: 'c2', name: 'Abhinaya & Mudras (അഭിനയം)', maxMarks: 35 },
      { id: 'c3', name: 'Music & Rhythm Sync (താളം)', maxMarks: 20 },
      { id: 'c4', name: 'Costume & Presentation (ആഹാര്യം)', maxMarks: 15 }
    ],
    status: 'scheduled'
  },
  {
    id: 'prog-06',
    festivalId: 'fest-01',
    code: 'LIT-02',
    title: 'English Versification (Poetry)',
    titleMl: 'കവിതാരചന (ഇംഗ്ലീഷ്)',
    categoryId: 'cat-02',
    type: 'individual',
    stageType: 'non_stage',
    durationMinutes: 60,
    venueId: 'ven-04',
    date: '2026-10-16',
    startTime: '11:00',
    endTime: '12:00',
    maxParticipants: 12,
    judgeCount: 2,
    criteria: [
      { id: 'c1', name: 'Original Imagery & Poetic Craft', maxMarks: 40 },
      { id: 'c2', name: 'Metre & Rhythm Flow', maxMarks: 30 },
      { id: 'c3', name: 'Thematic Resonance', maxMarks: 30 }
    ],
    status: 'scheduled'
  }
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-01',
    festivalId: 'fest-01',
    programmeId: 'prog-01',
    teamId: 'team-01',
    participantId: 'p-101',
    chestNumber: '101',
    status: 'confirmed',
    createdAt: '2026-10-05T09:00:00Z'
  },
  {
    id: 'reg-02',
    festivalId: 'fest-01',
    programmeId: 'prog-01',
    teamId: 'team-02',
    participantId: 'p-201',
    chestNumber: '201',
    status: 'confirmed',
    createdAt: '2026-10-05T09:10:00Z'
  },
  {
    id: 'reg-03',
    festivalId: 'fest-01',
    programmeId: 'prog-01',
    teamId: 'team-03',
    participantId: 'p-301',
    chestNumber: '301',
    status: 'confirmed',
    createdAt: '2026-10-05T09:20:00Z'
  },
  {
    id: 'reg-04',
    festivalId: 'fest-01',
    programmeId: 'prog-01',
    teamId: 'team-04',
    participantId: 'p-401',
    chestNumber: '401',
    status: 'confirmed',
    createdAt: '2026-10-05T09:30:00Z'
  },
  {
    id: 'reg-05',
    festivalId: 'fest-01',
    programmeId: 'prog-02',
    teamId: 'team-01',
    participantId: 'p-103',
    chestNumber: '103',
    status: 'confirmed',
    createdAt: '2026-10-05T10:00:00Z'
  },
  {
    id: 'reg-06',
    festivalId: 'fest-01',
    programmeId: 'prog-02',
    teamId: 'team-02',
    participantId: 'p-203',
    chestNumber: '203',
    status: 'confirmed',
    createdAt: '2026-10-05T10:15:00Z'
  },
  {
    id: 'reg-07',
    festivalId: 'fest-01',
    programmeId: 'prog-03',
    teamId: 'team-01',
    chestNumber: '100',
    groupMembers: [
      { participantId: 'p-101', name: 'Muhammad Fayiz', chestNumber: '101' },
      { participantId: 'p-103', name: 'Rinshad Cheruvadi', chestNumber: '103' }
    ],
    status: 'confirmed',
    createdAt: '2026-10-05T11:00:00Z'
  },
  {
    id: 'reg-08',
    festivalId: 'fest-01',
    programmeId: 'prog-03',
    teamId: 'team-02',
    chestNumber: '200',
    groupMembers: [
      { participantId: 'p-201', name: 'Bilal Hassan', chestNumber: '201' },
      { participantId: 'p-203', name: 'Salman Faris', chestNumber: '203' }
    ],
    status: 'confirmed',
    createdAt: '2026-10-05T11:15:00Z'
  },
  {
    id: 'reg-09',
    festivalId: 'fest-01',
    programmeId: 'prog-04',
    teamId: 'team-01',
    participantId: 'p-102',
    chestNumber: '102',
    status: 'confirmed',
    createdAt: '2026-10-05T12:00:00Z'
  },
  {
    id: 'reg-10',
    festivalId: 'fest-01',
    programmeId: 'prog-04',
    teamId: 'team-03',
    participantId: 'p-302',
    chestNumber: '302',
    status: 'confirmed',
    createdAt: '2026-10-05T12:30:00Z'
  }
];

export const INITIAL_JUDGES: Judge[] = [
  {
    id: 'jdg-01',
    festivalId: 'fest-01',
    name: 'Prof. K.V. Sreeraman',
    designation: 'Senior Faculty in Carnatic Music & Vocal Arts',
    specialization: 'Music & Classical Vocal',
    phone: '+91 94472 88801',
    email: 'sreeraman.music@artsfestpro.org',
    assignedProgrammes: ['prog-01', 'prog-03']
  },
  {
    id: 'jdg-02',
    festivalId: 'fest-01',
    name: 'Suhara Alappuzha',
    designation: 'Renowned Mappila Sangeetha Researcher & Singer',
    specialization: 'Folk Lore & Mappila Traditions',
    phone: '+91 94472 88802',
    email: 'suhara.art@artsfestpro.org',
    assignedProgrammes: ['prog-01']
  },
  {
    id: 'jdg-03',
    festivalId: 'fest-01',
    name: 'Dr. Madhavan Kutty',
    designation: 'Literary Critic & Oratory Adjudicator',
    specialization: 'Elocution & Literary Studies',
    phone: '+91 94472 88803',
    email: 'madhavankutty@artsfestpro.org',
    assignedProgrammes: ['prog-02', 'prog-06']
  },
  {
    id: 'jdg-04',
    festivalId: 'fest-01',
    name: 'K.P. Soman (Kala Ratna)',
    designation: 'Principal, Institute of Fine Arts',
    specialization: 'Painting & Fine Arts',
    phone: '+91 94472 88804',
    email: 'soman.artist@artsfestpro.org',
    assignedProgrammes: ['prog-04']
  }
];

export const INITIAL_SCORES: ScoreSubmission[] = [
  {
    id: 'sc-01',
    festivalId: 'fest-01',
    programmeId: 'prog-01',
    judgeId: 'jdg-01',
    registrationId: 'reg-01',
    chestNumber: '101',
    criterionScores: { c1: 28, c2: 29, c3: 19, c4: 19 },
    totalScore: 95,
    remarks: 'Flawless shruti alignment and emotive voice modulation.',
    status: 'locked',
    submittedAt: '2026-10-15T11:05:00Z'
  },
  {
    id: 'sc-02',
    festivalId: 'fest-01',
    programmeId: 'prog-01',
    judgeId: 'jdg-01',
    registrationId: 'reg-02',
    chestNumber: '201',
    criterionScores: { c1: 26, c2: 27, c3: 18, c4: 18 },
    totalScore: 89,
    remarks: 'Energetic rendition with good tempo hold.',
    status: 'locked',
    submittedAt: '2026-10-15T11:06:00Z'
  },
  {
    id: 'sc-03',
    festivalId: 'fest-01',
    programmeId: 'prog-01',
    judgeId: 'jdg-01',
    registrationId: 'reg-03',
    chestNumber: '301',
    criterionScores: { c1: 24, c2: 24, c3: 16, c4: 17 },
    totalScore: 81,
    remarks: 'Pleasing tone, minor lapse in high pitch.',
    status: 'locked',
    submittedAt: '2026-10-15T11:07:00Z'
  },
  {
    id: 'sc-04',
    festivalId: 'fest-01',
    programmeId: 'prog-01',
    judgeId: 'jdg-01',
    registrationId: 'reg-04',
    chestNumber: '401',
    criterionScores: { c1: 22, c2: 23, c3: 15, c4: 15 },
    totalScore: 75,
    remarks: 'Good effort, needs further breathing discipline.',
    status: 'locked',
    submittedAt: '2026-10-15T11:08:00Z'
  }
];

export const INITIAL_RESULTS: ProgrammeResult[] = [
  {
    id: 'res-01',
    festivalId: 'fest-01',
    programmeId: 'prog-01',
    status: 'published',
    publishedAt: '2026-10-15T12:00:00Z',
    approvedBy: 'Dr. Rasheed C.H. (Chief Results Controller)',
    rankings: [
      {
        rank: 1,
        chestNumber: '101',
        participantName: 'Muhammad Fayiz',
        teamId: 'team-01',
        teamName: 'Al-Bayan House',
        totalMarks: 95,
        grade: 'A',
        pointsEarned: 10 // 5 (1st rank) + 5 (A Grade)
      },
      {
        rank: 2,
        chestNumber: '201',
        participantName: 'Bilal Hassan',
        teamId: 'team-02',
        teamName: 'Cordoba Falcon',
        totalMarks: 89,
        grade: 'A',
        pointsEarned: 8 // 3 (2nd rank) + 5 (A Grade)
      },
      {
        rank: 3,
        chestNumber: '301',
        participantName: 'Adil Sharaf',
        teamId: 'team-03',
        teamName: 'Al-Hambra Guild',
        totalMarks: 81,
        grade: 'A',
        pointsEarned: 6 // 1 (3rd rank) + 5 (A Grade)
      },
      {
        rank: 4,
        chestNumber: '401',
        participantName: 'Nihad Parappanangadi',
        teamId: 'team-04',
        teamName: 'Toledo Titans',
        totalMarks: 75,
        grade: 'B',
        pointsEarned: 3 // B grade only
      }
    ],
    notes: 'Scores verified by panel of 2 adjudicators. No ties recorded.'
  },
  {
    id: 'res-02',
    festivalId: 'fest-01',
    programmeId: 'prog-02',
    status: 'published',
    publishedAt: '2026-10-15T14:00:00Z',
    approvedBy: 'Dr. Rasheed C.H. (Chief Results Controller)',
    rankings: [
      {
        rank: 1,
        chestNumber: '103',
        participantName: 'Rinshad Cheruvadi',
        teamId: 'team-01',
        teamName: 'Al-Bayan House',
        totalMarks: 92,
        grade: 'A',
        pointsEarned: 10
      },
      {
        rank: 2,
        chestNumber: '203',
        participantName: 'Salman Faris',
        teamId: 'team-02',
        teamName: 'Cordoba Falcon',
        totalMarks: 86,
        grade: 'A',
        pointsEarned: 8
      }
    ],
    notes: 'Approved unanimously after time penalty evaluation.'
  },
  {
    id: 'res-03',
    festivalId: 'fest-01',
    programmeId: 'prog-04',
    status: 'published',
    publishedAt: '2026-10-15T17:30:00Z',
    approvedBy: 'Dr. Rasheed C.H. (Chief Results Controller)',
    rankings: [
      {
        rank: 1,
        chestNumber: '102',
        participantName: 'Aysha Ridha',
        teamId: 'team-01',
        teamName: 'Al-Bayan House',
        totalMarks: 94,
        grade: 'A',
        pointsEarned: 10
      },
      {
        rank: 2,
        chestNumber: '302',
        participantName: 'Shahana Mariyam',
        teamId: 'team-03',
        teamName: 'Al-Hambra Guild',
        totalMarks: 88,
        grade: 'A',
        pointsEarned: 8
      }
    ],
    notes: 'Original artwork verified for non-plagiarism guidelines.'
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-01',
    certificateNumber: 'AFP-2026-0081',
    festivalId: 'fest-01',
    participantId: 'p-101',
    participantName: 'Muhammad Fayiz',
    chestNumber: '101',
    programmeTitle: 'Mappilappattu (Solo)',
    categoryName: 'Senior',
    rank: 1,
    grade: 'A',
    teamName: 'Al-Bayan House',
    issueDate: '2026-10-15',
    verificationCode: 'VRF-9810-FAYIZ-101',
    status: 'valid'
  },
  {
    id: 'cert-02',
    certificateNumber: 'AFP-2026-0082',
    festivalId: 'fest-01',
    participantId: 'p-201',
    participantName: 'Bilal Hassan',
    chestNumber: '201',
    programmeTitle: 'Mappilappattu (Solo)',
    categoryName: 'Senior',
    rank: 2,
    grade: 'A',
    teamName: 'Cordoba Falcon',
    issueDate: '2026-10-15',
    verificationCode: 'VRF-9810-BILAL-201',
    status: 'valid'
  },
  {
    id: 'cert-03',
    certificateNumber: 'AFP-2026-0083',
    festivalId: 'fest-01',
    participantId: 'p-102',
    participantName: 'Aysha Ridha',
    chestNumber: '102',
    programmeTitle: 'Pencil Drawing',
    categoryName: 'Senior',
    rank: 1,
    grade: 'A',
    teamName: 'Al-Bayan House',
    issueDate: '2026-10-15',
    verificationCode: 'VRF-9810-RIDHA-102',
    status: 'valid'
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-01',
    festivalId: 'fest-01',
    title: 'Grand Inauguration Lights Up National Cultural Arts Festival',
    excerpt: 'Over 1,500 participants gathered at the Tagore Main Auditorium as the historic 28th edition was ceremonially flagged off.',
    content: 'The 28th edition of DHDC National Arts Fest 2026 commenced today with high artistic fervor. Eminent scholars, cultural personalities, and jury members joined the traditional lamp-lighting ceremony. The fest features 120 competitions across stage and literary categories over five intensive days.',
    date: '2026-10-14',
    category: 'Festival Highlights',
    author: 'Press Relations Bureau',
    imageUrl: '/src/assets/images/hero_arts_fest_1791618167678.jpg',
    published: true
  },
  {
    id: 'news-02',
    festivalId: 'fest-01',
    title: 'Al-Bayan Takes Early Lead with Stellar Solo Vocal Performances',
    excerpt: 'High-scoring victories in Mappilappattu and Malayalam Elocution propel Al-Bayan House to the top of the points table.',
    content: 'Day 2 witnessed fierce competition in classical stage items. With A-grade first prizes in Mappilappattu Solo and Pencil Drawing, Al-Bayan House has surged forward to 148 points, closely pursued by Cordoba Falcon at 139 points.',
    date: '2026-10-15',
    category: 'Standings',
    author: 'Chief Scorer Bureau',
    imageUrl: '/src/assets/images/gallery_kathakali_dance_1791618183563.jpg',
    published: true
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-01',
    festivalId: 'fest-01',
    title: 'Reporting Call: Classical Bharatanatyam Participants',
    message: 'All registered candidates for STG-04 (Classical Bharatanatyam) must report to Stage 1 Green Room by 09:15 AM tomorrow for chest number verification.',
    priority: 'urgent',
    date: '2026-10-15',
    active: true
  },
  {
    id: 'ann-02',
    festivalId: 'fest-01',
    title: 'Results Published for Events STG-01, STG-02, and LIT-01',
    message: 'Official verified score sheets and grade distributions have been approved by the Results Controller and published to the live wall.',
    priority: 'high',
    date: '2026-10-15',
    active: true
  },
  {
    id: 'ann-03',
    festivalId: 'fest-01',
    title: 'Digital Certificates Now Available for Verified Winners',
    message: 'Participants can now verify and download their digitally signed merit certificates via the My Result portal using their Chest Number.',
    priority: 'normal',
    date: '2026-10-15',
    active: true
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-01',
    festivalId: 'fest-01',
    title: 'Grand Auditorium Stage Inaugural Ceremony',
    category: 'Ceremony',
    imageUrl: '/src/assets/images/hero_arts_fest_1791618167678.jpg',
    date: '2026-10-14'
  },
  {
    id: 'gal-02',
    festivalId: 'fest-01',
    title: 'Kathakali and Classical Mudra Recital',
    category: 'Classical Dance',
    imageUrl: '/src/assets/images/gallery_kathakali_dance_1791618183563.jpg',
    date: '2026-10-15'
  },
  {
    id: 'gal-03',
    festivalId: 'fest-01',
    title: 'Instrumental Symphony & Youth Classical Ensemble',
    category: 'Music & Instruments',
    imageUrl: '/src/assets/images/gallery_music_orchestra_1791618199901.jpg',
    date: '2026-10-15'
  },
  {
    id: 'gal-04',
    festivalId: 'fest-01',
    title: 'Championship Rolling Shield & Trophies',
    category: 'Awards',
    imageUrl: '/src/assets/images/trophy_champion_shield_1791618218061.jpg',
    date: '2026-10-14'
  }
];

export const INITIAL_DOWNLOADS: DownloadItem[] = [
  {
    id: 'dl-01',
    festivalId: 'fest-01',
    title: 'Official Arts Festival Rulebook & Code of Conduct 2026',
    description: 'Complete syllabus, rules of competition, duration limits, and disqualification grounds.',
    category: 'Rules & Guidelines',
    fileName: 'ArtsFest_Rulebook_2026_Official.pdf',
    fileSize: '2.4 MB',
    downloadUrl: '#download-rulebook',
    uploadedAt: '2026-10-01'
  },
  {
    id: 'dl-02',
    festivalId: 'fest-01',
    title: 'Complete Master Schedule & Venue Allotment Matrix',
    description: 'Day-by-day venue time slots, call times, stage dimensions, and technical briefing.',
    category: 'Schedules',
    fileName: 'Master_Timetable_Tagore_Venues.pdf',
    fileSize: '1.1 MB',
    downloadUrl: '#download-schedule',
    uploadedAt: '2026-10-10'
  },
  {
    id: 'dl-03',
    festivalId: 'fest-01',
    title: 'Team Manager Handbook & Registration Limits Guide',
    description: 'Instructions for house captains, chest number tagging, and group entry substitutions.',
    category: 'Forms',
    fileName: 'Team_Manager_Operational_Manual.pdf',
    fileSize: '850 KB',
    downloadUrl: '#download-manual',
    uploadedAt: '2026-10-02'
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-01',
    festivalId: 'fest-01',
    name: 'K. Sasi Kumar',
    email: 'sasikumar@gmail.com',
    subject: 'Inquiry regarding Stage 2 sound gear compatibility',
    message: 'Can our acoustic guitar ensemble plug into direct XLR boxes on Stage 2 or should we bring preamps?',
    date: '2026-10-14T11:20:00Z',
    status: 'read'
  },
  {
    id: 'msg-02',
    festivalId: 'fest-01',
    name: 'Shamla Beegum',
    email: 'shamla.b@outlook.com',
    subject: 'Certificate name spelling correction request',
    message: 'Chest number 102 certificate has a slight typo in the middle initial. Kindly review.',
    date: '2026-10-15T15:45:00Z',
    status: 'unread'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-01',
    festivalId: 'fest-01',
    timestamp: '2026-10-15T12:00:00Z',
    actor: 'Dr. Rasheed C.H.',
    role: 'Results Controller',
    action: 'PUBLISH_RESULT',
    details: 'Published official rankings and point allocations for STG-01 Mappilappattu (Solo)'
  },
  {
    id: 'log-02',
    festivalId: 'fest-01',
    timestamp: '2026-10-15T14:00:00Z',
    actor: 'Dr. Rasheed C.H.',
    role: 'Results Controller',
    action: 'PUBLISH_RESULT',
    details: 'Published official rankings for STG-02 Malayalam Elocution'
  },
  {
    id: 'log-03',
    festivalId: 'fest-01',
    timestamp: '2026-10-15T14:40:00Z',
    actor: 'Zubair Rahman',
    role: 'Registration Manager',
    action: 'UPDATE_REGISTRATION',
    details: 'Confirmed group registration list for Team Al-Bayan (Patriotic Song)'
  },
  {
    id: 'log-04',
    festivalId: 'fest-01',
    timestamp: '2026-10-15T17:30:00Z',
    actor: 'Dr. Rasheed C.H.',
    role: 'Results Controller',
    action: 'PUBLISH_RESULT',
    details: 'Published official rankings for LIT-01 Pencil Drawing'
  }
];

export const DEMO_USERS: User[] = [
  {
    id: 'usr-super',
    name: 'Ahmad K. (Super Admin)',
    email: 'superadmin@artsfestpro.org',
    role: 'super_admin'
  },
  {
    id: 'usr-fest-admin',
    name: 'Prof. Usman Ali (Festival Director)',
    email: 'admin@artsfestpro.org',
    role: 'festival_admin'
  },
  {
    id: 'usr-results',
    name: 'Dr. Rasheed C.H. (Results Controller)',
    email: 'results@artsfestpro.org',
    role: 'results_controller'
  },
  {
    id: 'usr-judge',
    name: 'Prof. K.V. Sreeraman (Senior Judge)',
    email: 'judge@artsfestpro.org',
    role: 'judge',
    assignedJudgeId: 'jdg-01'
  },
  {
    id: 'usr-reg',
    name: 'Farook C. (Registration Desk)',
    email: 'registration@artsfestpro.org',
    role: 'registration_manager'
  },
  {
    id: 'usr-team',
    name: 'Zubair Rahman (Al-Bayan Manager)',
    email: 'team@albayan.org',
    role: 'team_manager',
    teamId: 'team-01'
  },
  {
    id: 'usr-cert',
    name: 'Anjali Menon (Certificate Desk)',
    email: 'certificates@artsfestpro.org',
    role: 'certificate_manager'
  },
  {
    id: 'usr-public',
    name: 'Public Viewer / Guest',
    email: 'visitor@guest.net',
    role: 'public_visitor'
  }
];
