export interface NoteContent {
  id: string;
  lesson: string;
  topic: string;
  subtopic: string | null;
  content: string | string[] | Record<string, any>[];
  type: 'definition' | 'list' | 'table' | 'process' | 'comparison';
}

export interface AnkiCard {
  id: string;
  lesson: string;
  tag: string;
  front: string;
  back: string | string[];
}

export interface SubjectData {
  _meta: {
    title: string;
    lessons: string[];
  };
  notes: NoteContent[];
  anki_deck: AnkiCard[];
}

export interface DeckStats {
  correct: number;
  wrong: number;
}

export const mockSubjects: Record<string, SubjectData> = {
  'principles-of-management': {
    _meta: {
      title: 'Principles of Management',
      lessons: ['Chapter 1: Introduction', 'Chapter 2: Planning', 'Chapter 3: Organizing', 'Chapter 4: Leading']
    },
    notes: [
      {
        id: 'N-C1-001',
        lesson: 'Chapter 1',
        topic: 'What is Management?',
        subtopic: null,
        type: 'table',
        content: [
          {
            contributor: 'Mary Parker Follett (Mother of Modern Management)',
            definition: 'The art of getting things done through people.'
          },
          {
            contributor: 'Henri Fayol',
            definition: 'To manage is to forecast, plan, organize, command, coordinate and control.'
          },
          {
            contributor: 'Peter Drucker',
            definition: 'Management is about human beings. Its task is to make people capable of joint performance.'
          }
        ]
      },
      {
        id: 'N-C1-002',
        lesson: 'Chapter 1',
        topic: 'Management as an Art',
        subtopic: 'Key Characteristics',
        type: 'list',
        content: [
          'Practical Knowledge — theories must be applied to real situations',
          'Personal Skill — a manager must have unique qualities beyond book knowledge',
          'Creativity — finding new ways to solve problems and differentiate',
          'Perfection through Practice — managers improve with experience over time',
          'Goal-Oriented — art is result-driven, so is management'
        ]
      },
      {
        id: 'N-C2-001',
        lesson: 'Chapter 2',
        topic: 'Forecasting',
        subtopic: null,
        type: 'definition',
        content: 'Forecasting is an attempt to foretell or predict future trends, events, or conditions from known facts to prepare for expected changes in business or industry. It is a systematic approach to probe future business events from available data and information. Business forecasting involves statistical analysis of past and current movements to obtain clues about future patterns.'
      },
      {
        id: 'N-C3-001',
        lesson: 'Chapter 3',
        topic: 'Formal vs Informal Organization',
        subtopic: null,
        type: 'comparison',
        content: [
          {
            point: 'Origin',
            formal: 'Created deliberately',
            informal: 'Arises spontaneously'
          },
          {
            point: 'Nature',
            formal: 'Planned and official',
            informal: 'Unplanned and unofficial'
          },
          {
            point: 'Authority',
            formal: 'Flows from top management',
            informal: 'Based on personal relationships'
          },
          {
            point: 'Communication',
            formal: 'Follows chain of command',
            informal: 'Grapevine communication'
          }
        ]
      },
      {
        id: 'N-C3-002',
        lesson: 'Chapter 3',
        topic: 'Steps in Organizing',
        subtopic: null,
        type: 'process',
        content: [
          'Step 1: Outlining the objectives',
          'Step 2: Identification and enumeration of the activities',
          'Step 3: Assigning the duties and responsibilities',
          'Step 4: Delegating the authority',
          'Step 5: Establishing authority relationships'
        ]
      }
    ],
    anki_deck: [
      {
        id: 'A-C1-001',
        lesson: 'Chapter 1',
        tag: 'definitions',
        front: 'Who is known as the "Mother of Modern Management"?',
        back: 'Mary Parker Follett'
      },
      {
        id: 'A-C1-002',
        lesson: 'Chapter 1',
        tag: 'management-art',
        front: 'What are the five key characteristics of management as an art?',
        back: [
          'Practical Knowledge',
          'Personal Skill',
          'Creativity',
          'Perfection through Practice',
          'Goal-Oriented'
        ]
      },
      {
        id: 'A-C2-001',
        lesson: 'Chapter 2',
        tag: 'planning',
        front: 'What is Forecasting?',
        back: 'Forecasting is an attempt to foretell or predict future trends, events, or conditions from known facts to prepare for expected changes in business or industry.'
      },
      {
        id: 'A-C3-001',
        lesson: 'Chapter 3',
        tag: 'organizing',
        front: 'What are the 5 steps in the organizing process?',
        back: [
          'Outlining the objectives',
          'Identification and enumeration of the activities',
          'Assigning the duties and responsibilities',
          'Delegating the authority',
          'Establishing authority relationships'
        ]
      }
    ]
  },
  'accounting': {
    _meta: {
      title: 'Accounting',
      lessons: ['Chapter 1: Introduction to Accounting', 'Chapter 2: Double Entry System']
    },
    notes: [
      {
        id: 'N-ACC-001',
        lesson: 'Chapter 1',
        topic: 'Accounting Equation',
        subtopic: null,
        type: 'definition',
        content: 'Assets = Liabilities + Owner\'s Equity. This fundamental equation represents the relationship between what a business owns (assets), what it owes (liabilities), and the owner\'s claim (equity).'
      },
      {
        id: 'N-ACC-002',
        lesson: 'Chapter 2',
        topic: 'Rules of Debit and Credit',
        subtopic: null,
        type: 'table',
        content: [
          {
            accountType: 'Assets',
            debit: 'Increase',
            credit: 'Decrease'
          },
          {
            accountType: 'Liabilities',
            debit: 'Decrease',
            credit: 'Increase'
          },
          {
            accountType: 'Equity',
            debit: 'Decrease',
            credit: 'Increase'
          }
        ]
      }
    ],
    anki_deck: [
      {
        id: 'A-ACC-001',
        lesson: 'Chapter 1',
        tag: 'fundamentals',
        front: 'What is the Accounting Equation?',
        back: 'Assets = Liabilities + Owner\'s Equity'
      },
      {
        id: 'A-ACC-002',
        lesson: 'Chapter 2',
        tag: 'double-entry',
        front: 'What increases an Asset account?',
        back: 'A debit entry increases an Asset account'
      }
    ]
  }
};

export const getSubjectList = (): { id: string; title: string }[] => {
  const stored = localStorage.getItem('deckme_subjects');
  const storedSubjects = stored ? JSON.parse(stored) : {};
  const allSubjects = { ...mockSubjects, ...storedSubjects };

  return Object.entries(allSubjects).map(([id, data]) => ({
    id,
    title: data._meta.title
  }));
};

export const getSubjectData = (subjectId: string): SubjectData | null => {
  const stored = localStorage.getItem('deckme_subjects');
  const storedSubjects = stored ? JSON.parse(stored) : {};
  return storedSubjects[subjectId] || mockSubjects[subjectId] || null;
};

export const initializeDeckStats = (subjectId: string): DeckStats => {
  const stored = localStorage.getItem(`deckme_stats_${subjectId}`);
  if (stored) {
    return JSON.parse(stored);
  }
  return { correct: 0, wrong: 0 };
};

export const saveDeckStats = (subjectId: string, stats: DeckStats): void => {
  localStorage.setItem(`deckme_stats_${subjectId}`, JSON.stringify(stats));
};

export const getViewedTime = (subjectId: string): number => {
  const stored = localStorage.getItem(`deckme_time_${subjectId}`);
  return stored ? parseInt(stored, 10) : 0;
};

export const saveViewedTime = (subjectId: string, seconds: number): void => {
  const current = getViewedTime(subjectId);
  localStorage.setItem(`deckme_time_${subjectId}`, (current + seconds).toString());
};
