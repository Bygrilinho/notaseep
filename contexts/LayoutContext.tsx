'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface LayoutContextType {
  subjects: Subject[];
  grades: { [subjectId: string]: { [weightId: string]: string } };
  editingSubjectId: string | null;
  setEditingSubjectId: (id: string | null) => void;
  setSubjects: (subjects: Subject[]) => void;
  addSubject: (subject: Subject) => void;
  updateSubject: (subjectId: string, subject: Subject) => void;
  deleteSubject: (subjectId: string) => void;
  setGrade: (subjectId: string, weightId: string, value: string) => void;
  exportLayout: () => void;
  importLayout: (file: File) => Promise<void>;
  importFullData: (subjects: Subject[], grades: { [subjectId: string]: { [weightId: string]: string } }) => void;
  clearAllData: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

const LAYOUT_STORAGE_KEY = 'layout';
const GRADES_STORAGE_KEY = 'grades';

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjectsState] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<{ [subjectId: string]: { [weightId: string]: string } }>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (savedLayout) {
        const parsed = JSON.parse(savedLayout);
        setSubjectsState(parsed.subjects || []);
      }
    } catch (e) {
      console.error('Error loading layout from localStorage:', e);
    }

    try {
      const savedGrades = localStorage.getItem(GRADES_STORAGE_KEY);
      if (savedGrades) {
        setGrades(JSON.parse(savedGrades));
      }
    } catch (e) {
      console.error('Error loading grades from localStorage:', e);
    }

    setIsLoaded(true);
  }, []);

  // Save layout to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify({ subjects }));
    }
  }, [subjects, isLoaded]);

  // Save grades to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(grades));
    }
  }, [grades, isLoaded]);

  const setSubjects = useCallback((newSubjects: Subject[]) => {
    setSubjectsState(newSubjects);
  }, []);

  const addSubject = useCallback((subject: Subject) => {
    setSubjectsState(prev => [...prev, subject]);
  }, []);

  const updateSubject = useCallback((subjectId: string, subject: Subject) => {
    setSubjectsState(prev => prev.map(s => s.id === subjectId ? subject : s));
  }, []);

  const deleteSubject = useCallback((subjectId: string) => {
    setSubjectsState(prev => prev.filter(s => s.id !== subjectId));
    setGrades(prev => {
      const newGrades = { ...prev };
      delete newGrades[subjectId];
      return newGrades;
    });
  }, []);

  const setGrade = useCallback((subjectId: string, weightId: string, value: string) => {
    setGrades(prev => {
      const subjectGrades = prev[subjectId] || {};
      if (value === '') {
        const newSubjectGrades = { ...subjectGrades };
        delete newSubjectGrades[weightId];
        if (Object.keys(newSubjectGrades).length === 0) {
          const newGrades = { ...prev };
          delete newGrades[subjectId];
          return newGrades;
        }
        return { ...prev, [subjectId]: newSubjectGrades };
      }
      return {
        ...prev,
        [subjectId]: { ...subjectGrades, [weightId]: value }
      };
    });
  }, []);

  const exportLayout = useCallback(() => {
    const data: Data = { subjects };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [subjects]);

  const importLayout = useCallback(async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data: Data = JSON.parse(content);
          if (data.subjects && Array.isArray(data.subjects)) {
            setSubjectsState(data.subjects);
            resolve();
          } else {
            reject(new Error('Invalid layout file format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }, []);

  const clearAllData = useCallback(() => {
    setSubjectsState([]);
    setGrades({});
  }, []);

  // Used for one-time migration from old domain
  const importFullData = useCallback((newSubjects: Subject[], newGrades: { [subjectId: string]: { [weightId: string]: string } }) => {
    setSubjectsState(newSubjects);
    setGrades(newGrades);
  }, []);

  return (
    <LayoutContext.Provider value={{
      subjects,
      grades,
      editingSubjectId,
      setEditingSubjectId,
      setSubjects,
      addSubject,
      updateSubject,
      deleteSubject,
      setGrade,
      exportLayout,
      importLayout,
      importFullData,
      clearAllData,
    }}>
      {isLoaded ? children : null}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
