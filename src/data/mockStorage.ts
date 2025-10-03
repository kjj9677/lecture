import { User, Lecture, UserSession } from '@/types';

// localStorage 키 상수
const STORAGE_KEYS = {
  USERS: 'mock_users',
  LECTURES: 'mock_lectures',
  CURRENT_SESSION: 'mock_current_session',
} as const;

// 제네릭 localStorage 유틸리티
class MockStorage {
  // 데이터 저장
  private setItem<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('localStorage 저장 실패:', error);
    }
  }

  // 데이터 조회
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('localStorage 조회 실패:', error);
      return defaultValue;
    }
  }

  // 사용자 관련 메서드
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

  // 강의 관련 메서드
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

  // 수강 신청 관련 메서드
  applyToLecture(lectureId: string, userId: string): boolean {
    const lecture = this.getLectureById(lectureId);
    if (!lecture) return false;

    // 이미 신청했는지 확인
    if (lecture.applicants.includes(userId)) return false;

    // 정원 확인
    if (lecture.currentStudents >= lecture.maxStudents) return false;

    // 신청자 추가
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

    // 신청자 제거
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

  // 세션 관리 메서드
  getCurrentSession(): UserSession | null {
    return this.getItem<UserSession | null>(STORAGE_KEYS.CURRENT_SESSION, null);
  }

  setCurrentSession(session: UserSession | null): void {
    this.setItem(STORAGE_KEYS.CURRENT_SESSION, session);
  }

  clearCurrentSession(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }

  // 데이터 초기화 메서드
  initializeData(users: User[], lectures: Lecture[]): void {
    // 기존 데이터가 없을 때만 초기화
    if (this.getUsers().length === 0) {
      this.setUsers(users);
    }
    if (this.getLectures().length === 0) {
      this.setLectures(lectures);
    }
  }

  // 모든 데이터 삭제 (개발용)
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // 데이터를 초기값으로 리셋 (개발용)
  resetToInitialData(users: User[], lectures: Lecture[]): void {
    this.clearAllData();
    this.setUsers(users);
    this.setLectures(lectures);
  }
}

// 싱글톤 인스턴스 생성
export const mockStorage = new MockStorage();