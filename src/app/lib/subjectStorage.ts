import { SubjectData } from "./mockData";

const SUBJECTS_STORAGE_KEY = 'deckme_subjects';

export const getAllStoredSubjects = (): Record<string, SubjectData> => {
  const stored = localStorage.getItem(SUBJECTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const saveSubject = (subjectId: string, data: SubjectData): void => {
  const subjects = getAllStoredSubjects();
  subjects[subjectId] = data;
  localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(subjects));
};

export const deleteSubject = (subjectId: string): void => {
  const subjects = getAllStoredSubjects();
  delete subjects[subjectId];
  localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(subjects));
};

export const generateSubjectId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const validateSubjectData = (data: any): data is SubjectData => {
  return (
    data &&
    typeof data === 'object' &&
    data._meta &&
    typeof data._meta === 'object' &&
    typeof data._meta.title === 'string' &&
    Array.isArray(data._meta.lessons) &&
    Array.isArray(data.notes) &&
    Array.isArray(data.anki_deck) &&
    // Validate individual notes have required fields
    data.notes.every((note: any) =>
      typeof note.id === 'string' &&
      typeof note.lesson === 'string' &&
      typeof note.topic === 'string' &&
      ['markdown', 'definition', 'list', 'table', 'process', 'comparison'].includes(note.type)
    ) &&
    // Validate individual anki cards have required fields
    data.anki_deck.every((card: any) =>
      typeof card.id === 'string' &&
      typeof card.lesson === 'string' &&
      typeof card.tag === 'string' &&
      typeof card.front === 'string' &&
      (typeof card.back === 'string' || Array.isArray(card.back))
    )
  );
};
