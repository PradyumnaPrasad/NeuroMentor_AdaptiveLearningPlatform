import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface StudentProgress {
  id?: number;
  name: string;
  class: number;
  email: string;
  completedTopics: string[];
  stars: number;
  badges: string[];
  currentSubject?: string;
}

interface StudentContextType {
  student: StudentProgress;
  updateProgress: (updates: Partial<StudentProgress>) => void;
  completeTopicHandler: (topic: string) => void;
  addStars: (count: number) => void;
  addBadge: (badge: string) => void;
  isLoading: boolean;
  refreshUserData: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<StudentProgress>({
    name: 'Guest',
    class: 1,
    email: '',
    completedTopics: [],
    stars: 0,
    badges: [],
  });

  useEffect(() => {
    // Load user data from localStorage
    loadUserData();
  }, []);

  const loadUserData = () => {
    const userStr = localStorage.getItem('user');
    console.log('Loading user data from localStorage:', userStr);
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        console.log('Parsed user data:', userData);
        setStudent(prev => ({
          ...prev,
          id: userData.id || userData._id || Math.floor(Math.random() * 10000), // Fallback to random ID
          name: userData.name || 'Guest',
          class: parseInt(userData.class_name) || 1,
          email: userData.email || '',
        }));
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
    setIsLoading(false);
  };

  const refreshUserData = () => {
    loadUserData();
  };

  const updateProgress = (updates: Partial<StudentProgress>) => {
    setStudent(prev => ({ ...prev, ...updates }));
  };

  const completeTopicHandler = (topic: string) => {
    setStudent(prev => ({
      ...prev,
      completedTopics: [...new Set([...prev.completedTopics, topic])],
    }));
  };

  const addStars = (count: number) => {
    setStudent(prev => ({ ...prev, stars: prev.stars + count }));
  };

  const addBadge = (badge: string) => {
    setStudent(prev => ({
      ...prev,
      badges: [...new Set([...prev.badges, badge])],
    }));
  };

  return (
    <StudentContext.Provider value={{ student, updateProgress, completeTopicHandler, addStars, addBadge, isLoading, refreshUserData }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) throw new Error('useStudent must be used within StudentProvider');
  return context;
};