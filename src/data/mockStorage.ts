import { User, Lecture, UserSession } from '@/types';

const STORAGE_KEYS = {
  USERS: 'mock_users',
  LECTURES: 'mock_lectures',
  CURRENT_SESSION: 'mock_current_session',
} as const;

class MockStorage {
  private setItem<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('localStorage 저장 실패:', error);
    }
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('localStorage 조회 실패:', error);
      return defaultValue;
    }
  }

  getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS, []);
  }

  setUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.setUsers(users);
  }

  updateUser(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return null;

    users[userIndex] = { ...users[userIndex], ...updates };
    this.setUsers(users);
    return users[userIndex];
  }

  getUserById(userId: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.id === userId) || null;
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.email === email) || null;
  }

  getLectures(): Lecture[] {
    return this.getItem<Lecture[]>(STORAGE_KEYS.LECTURES, []);
  }

  setLectures(lectures: Lecture[]): void {
    this.setItem(STORAGE_KEYS.LECTURES, lectures);
  }

  addLecture(lecture: Lecture): void {
    const lectures = this.getLectures();
    lectures.push(lecture);
    this.setLectures(lectures);
  }

  updateLecture(lectureId: string, updates: Partial<Lecture>): Lecture | null {
    const lectures = this.getLectures();
    const lectureIndex = lectures.findIndex(l => l.id === lectureId);

    if (lectureIndex === -1) return null;

    lectures[lectureIndex] = { ...lectures[lectureIndex], ...updates };
    this.setLectures(lectures);
    return lectures[lectureIndex];
  }

  deleteLecture(lectureId: string): boolean {
    const lectures = this.getLectures();
    const filteredLectures = lectures.filter(l => l.id !== lectureId);

    if (filteredLectures.length === lectures.length) return false;

    this.setLectures(filteredLectures);
    return true;
  }

  getLectureById(lectureId: string): Lecture | null {
    const lectures = this.getLectures();
    return lectures.find(l => l.id === lectureId) || null;
  }

  getLecturesByInstructor(instructorId: string): Lecture[] {
    const lectures = this.getLectures();
    return lectures.filter(l => l.instructorId === instructorId);
  }

  applyToLecture(lectureId: string, userId: string): boolean {
    const lecture = this.getLectureById(lectureId);
    if (!lecture) return false;

    if (lecture.applicants.includes(userId)) return false;
    if (lecture.currentStudents >= lecture.maxStudents) return false;

    lecture.applicants.push(userId);
    lecture.currentStudents += 1;

    this.updateLecture(lectureId, {
      applicants: lecture.applicants,
      currentStudents: lecture.currentStudents,
    });

    return true;
  }

  cancelLectureApplication(lectureId: string, userId: string): boolean {
    const lecture = this.getLectureById(lectureId);
    if (!lecture) return false;

    const applicantIndex = lecture.applicants.indexOf(userId);
    if (applicantIndex === -1) return false;

    lecture.applicants.splice(applicantIndex, 1);
    lecture.currentStudents -= 1;

    this.updateLecture(lectureId, {
      applicants: lecture.applicants,
      currentStudents: lecture.currentStudents,
    });

    return true;
  }

  getUserApplications(userId: string): Lecture[] {
    const lectures = this.getLectures();
    return lectures.filter(l => l.applicants.includes(userId));
  }

  getCurrentSession(): UserSession | null {
    return this.getItem<UserSession | null>(STORAGE_KEYS.CURRENT_SESSION, null);
  }

  setCurrentSession(session: UserSession | null): void {
    this.setItem(STORAGE_KEYS.CURRENT_SESSION, session);
  }

  clearCurrentSession(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }

  initializeData(users: User[], lectures: Lecture[]): void {
    if (this.getUsers().length === 0) {
      this.setUsers(users);
    }
    if (this.getLectures().length === 0) {
      this.setLectures(lectures);
    }
  }

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  resetToInitialData(users: User[], lectures: Lecture[]): void {
    this.clearAllData();
    this.setUsers(users);
    this.setLectures(lectures);
  }
}

export const mockStorage = new MockStorage();