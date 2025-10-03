import {
  User,
  Lecture,
  LoginRequest,
  SignupRequest,
  CreateLectureRequest,
  UpdateLectureRequest,
  ApiResponse,
  UserSession,
  LectureListOptions,
  LectureSortOption,
} from "@/types";
import { mockStorage } from "./mockStorage";
import { validateEmail, validatePassword } from "@/utils";

const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

const generateToken = () =>
  "mock_token_" + Math.random().toString(36).substring(2);

const checkPassword = (password: string, hashedPassword: string): boolean => {
  return password === hashedPassword;
};

// 인증 API
export const authApi = {
  // 로그인
  async login(credentials: LoginRequest): Promise<ApiResponse<UserSession>> {
    await delay();

    if (!validateEmail(credentials.email)) {
      return {
        success: false,
        message: "올바른 이메일 형식이 아닙니다.",
      };
    }

    const user = mockStorage.getUserByEmail(credentials.email);

    if (!user) {
      return {
        success: false,
        message: "존재하지 않는 이메일입니다.",
      };
    }

    if (!checkPassword(credentials.password, user.password)) {
      return {
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
      };
    }

    const session: UserSession = {
      user: { ...user, password: "" }, // 비밀번호 제외
      token: generateToken(),
      loginTime: new Date().toISOString(),
    };

    mockStorage.setCurrentSession(session);

    return {
      success: true,
      data: session,
      message: "로그인에 성공했습니다.",
    };
  },

  // 회원가입
  async signup(userData: SignupRequest): Promise<ApiResponse<User>> {
    await delay();

    if (!userData.name.trim()) {
      return { success: false, message: "이름을 입력해주세요." };
    }

    if (!validateEmail(userData.email)) {
      return { success: false, message: "올바른 이메일 형식이 아닙니다." };
    }

    if (!validatePassword(userData.password)) {
      return {
        success: false,
        message: "비밀번호는 6-10자의 영문+숫자 조합이어야 합니다.",
      };
    }

    if (!userData.phone.trim()) {
      return { success: false, message: "휴대폰 번호를 입력해주세요." };
    }

    // 이메일 중복 확인
    const existingUser = mockStorage.getUserByEmail(userData.email);
    if (existingUser) {
      return {
        success: false,
        message: "이미 사용중인 이메일입니다.",
      };
    }

    const newUser: User = {
      id: generateId(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phoneNumber: userData.phone,
      userType: userData.userType,
      createdAt: new Date().toISOString(),
    };

    mockStorage.addUser(newUser);

    return {
      success: true,
      data: { ...newUser, password: "" }, // 비밀번호 제외
      message: "회원가입이 완료되었습니다.",
    };
  },

  // 로그아웃
  async logout(): Promise<ApiResponse<void>> {
    await delay(100);
    mockStorage.clearCurrentSession();
    return {
      success: true,
      message: "로그아웃되었습니다.",
    };
  },

  // 현재 세션 확인
  getCurrentSession(): UserSession | null {
    return mockStorage.getCurrentSession();
  },

  // 데이터 초기화 (개발용)
  async resetData(): Promise<ApiResponse<void>> {
    await delay(100);
    const { initialUsers, initialLectures } = await import('./initialData');
    mockStorage.resetToInitialData(initialUsers, initialLectures);
    mockStorage.clearCurrentSession();
    return {
      success: true,
      message: '데이터가 초기화되었습니다.',
    };
  },

  // 이메일 중복 확인
  async checkEmailDuplicate(
    email: string
  ): Promise<ApiResponse<{ available: boolean }>> {
    await delay(200);

    if (!validateEmail(email)) {
      return {
        success: false,
        message: "올바른 이메일 형식이 아닙니다.",
      };
    }

    const existingUser = mockStorage.getUserByEmail(email);

    if (existingUser) {
      return {
        success: true,
        data: { available: false },
        message: "이미 사용중인 이메일입니다.",
      };
    }

    return {
      success: true,
      data: { available: true },
      message: "사용 가능한 이메일입니다.",
    };
  },
};

// 강의 API
export const lectureApi = {
  // 강의 목록 조회
  async getLectures(
    options: LectureListOptions = {}
  ): Promise<ApiResponse<Lecture[]>> {
    await delay();

    let lectures = mockStorage.getLectures();

    // 정렬
    if (options.sort) {
      lectures = this.sortLectures(lectures, options.sort);
    }

    // 페이지네이션
    if (options.offset !== undefined && options.limit !== undefined) {
      lectures = lectures.slice(options.offset, options.offset + options.limit);
    }

    return {
      success: true,
      data: lectures,
    };
  },

  // 강의 상세 조회
  async getLecture(lectureId: string): Promise<ApiResponse<Lecture>> {
    await delay();

    const lecture = mockStorage.getLectureById(lectureId);

    if (!lecture) {
      return {
        success: false,
        message: "존재하지 않는 강의입니다.",
      };
    }

    return {
      success: true,
      data: lecture,
    };
  },

  // 강의 생성 (강사만)
  async createLecture(
    lectureData: CreateLectureRequest
  ): Promise<ApiResponse<Lecture>> {
    await delay();

    const session = mockStorage.getCurrentSession();
    if (!session || session.user.userType !== "instructor") {
      return {
        success: false,
        message: "강사만 강의를 생성할 수 있습니다.",
      };
    }

    // 유효성 검사
    if (!lectureData.title.trim()) {
      return { success: false, message: "강의명을 입력해주세요." };
    }

    const existingLecture = mockStorage
      .getLectures()
      .find((lecture) => lecture.title === lectureData.title);
    if (existingLecture) {
      return { success: false, message: "이미 존재하는 강의명입니다." };
    }

    if (lectureData.price < 0) {
      return { success: false, message: "가격은 0원 이상이어야 합니다." };
    }

    if (lectureData.maxStudents < 1) {
      return {
        success: false,
        message: "최대 수강 인원은 1명 이상이어야 합니다.",
      };
    }

    const newLecture: Lecture = {
      id: generateId(),
      title: lectureData.title,
      instructorId: session.user.id,
      instructorName: session.user.name,
      price: lectureData.price,
      maxStudents: lectureData.maxStudents,
      currentStudents: 0,
      applicants: [],
      createdAt: new Date().toISOString(),
    };

    mockStorage.addLecture(newLecture);

    return {
      success: true,
      data: newLecture,
      message: "강의가 생성되었습니다.",
    };
  },

  async updateLecture(
    lectureData: UpdateLectureRequest
  ): Promise<ApiResponse<Lecture>> {
    await delay();

    const session = mockStorage.getCurrentSession();
    if (!session || session.user.userType !== "instructor") {
      return {
        success: false,
        message: "강사만 강의를 수정할 수 있습니다.",
      };
    }

    const lecture = mockStorage.getLectureById(lectureData.id);
    if (!lecture) {
      return {
        success: false,
        message: "존재하지 않는 강의입니다.",
      };
    }

    if (lecture.instructorId !== session.user.id) {
      return {
        success: false,
        message: "본인의 강의만 수정할 수 있습니다.",
      };
    }

    const updatedLecture = mockStorage.updateLecture(
      lectureData.id,
      lectureData
    );

    return {
      success: true,
      data: updatedLecture!,
      message: "강의가 수정되었습니다.",
    };
  },

  // 강의 삭제 (강사만, 본인 강의만)
  async deleteLecture(lectureId: string): Promise<ApiResponse<void>> {
    await delay();

    const session = mockStorage.getCurrentSession();
    if (!session || session.user.userType !== "instructor") {
      return {
        success: false,
        message: "강사만 강의를 삭제할 수 있습니다.",
      };
    }

    const lecture = mockStorage.getLectureById(lectureId);
    if (!lecture) {
      return {
        success: false,
        message: "존재하지 않는 강의입니다.",
      };
    }

    if (lecture.instructorId !== session.user.id) {
      return {
        success: false,
        message: "본인의 강의만 삭제할 수 있습니다.",
      };
    }

    mockStorage.deleteLecture(lectureId);

    return {
      success: true,
      message: "강의가 삭제되었습니다.",
    };
  },

  // 수강 신청
  async applyToLecture(lectureId: string): Promise<ApiResponse<void>> {
    await delay();

    const session = mockStorage.getCurrentSession();
    if (!session) {
      return {
        success: false,
        message: "로그인이 필요합니다.",
      };
    }

    const lecture = mockStorage.getLectureById(lectureId);
    if (!lecture) {
      return {
        success: false,
        message: "존재하지 않는 강의입니다.",
      };
    }

    if (lecture.instructorId === session.user.id) {
      return {
        success: false,
        message: "본인의 강의에는 신청할 수 없습니다.",
      };
    }

    const success = mockStorage.applyToLecture(lectureId, session.user.id);

    if (!success) {
      return {
        success: false,
        message: "이미 신청했거나 정원이 마감된 강의입니다.",
      };
    }

    return {
      success: true,
      message: "수강 신청이 완료되었습니다.",
    };
  },

  // 수강 신청 취소
  async cancelApplication(lectureId: string): Promise<ApiResponse<void>> {
    await delay();

    const session = mockStorage.getCurrentSession();
    if (!session) {
      return {
        success: false,
        message: "로그인이 필요합니다.",
      };
    }

    const success = mockStorage.cancelLectureApplication(
      lectureId,
      session.user.id
    );

    if (!success) {
      return {
        success: false,
        message: "신청하지 않은 강의입니다.",
      };
    }

    return {
      success: true,
      message: "수강 신청이 취소되었습니다.",
    };
  },

  // 내 수강 신청 목록
  async getMyApplications(): Promise<ApiResponse<Lecture[]>> {
    await delay();

    const session = mockStorage.getCurrentSession();
    if (!session) {
      return {
        success: false,
        message: "로그인이 필요합니다.",
      };
    }

    const applications = mockStorage.getUserApplications(session.user.id);

    return {
      success: true,
      data: applications,
    };
  },

  // 내가 개설한 강의 목록 (강사용)
  async getMyLectures(): Promise<ApiResponse<Lecture[]>> {
    await delay();

    const session = mockStorage.getCurrentSession();
    if (!session || session.user.userType !== "instructor") {
      return {
        success: false,
        message: "강사만 조회할 수 있습니다.",
      };
    }

    const lectures = mockStorage.getLecturesByInstructor(session.user.id);

    return {
      success: true,
      data: lectures,
    };
  },

  // 강의 정렬 함수
  sortLectures(lectures: Lecture[], sortBy: LectureSortOption): Lecture[] {
    switch (sortBy) {
      case "recent":
        return [...lectures].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "popular":
        return [...lectures].sort(
          (a, b) => b.currentStudents - a.currentStudents
        );
      case "enrollment-rate":
        return [...lectures].sort((a, b) => {
          const aRate = a.currentStudents / a.maxStudents;
          const bRate = b.currentStudents / b.maxStudents;
          return bRate - aRate;
        });
      default:
        return lectures;
    }
  },
};
