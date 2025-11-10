/**
 * TypeScript type definitions for LeetCode Client
 */

export interface LeetCodeSubmission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

export interface TopicTag {
  name: string;
  slug: string;
}

export interface ProblemMetadata {
  questionId: string;
  title: string;
  titleSlug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isPaidOnly: boolean;
  topicTags: TopicTag[];
  stats: string;
  likes: number;
  dislikes: number;
}

export interface EnrichedSubmission {
  title: string;
  slug: string;
  status: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Unknown';
  tags: string[];
  lang: string;
  timestamp: string;
  url: string;
  isPaidOnly: boolean;
  questionId: string | null;
  likes: number;
  dislikes: number;
}

export interface PaginatedSubmission {
  id: string;
  title: string;
  titleSlug: string;
  status: string;
  statusDisplay: string;
  lang: string;
  langName: string;
  runtime: string;
  timestamp: string;
  url: string;
  memory: string;
}

export interface SubmissionDetails {
  runtime: string;
  runtimeDisplay: string;
  runtimePercentile: number;
  runtimeDistribution: string;
  memory: string;
  memoryDisplay: string;
  memoryPercentile: number;
  memoryDistribution: string;
  code: string;
  timestamp: string;
  statusCode: number;
  lang: string;
  langName: string;
  question: {
    questionId: string;
    title: string;
    titleSlug: string;
    content: string;
    difficulty: string;
  };
}

export interface UserProfile {
  username: string;
  profile: {
    ranking: number;
    userAvatar: string;
    realName: string;
    aboutMe: string;
    school: string;
    websites: string[];
    countryName: string;
    company: string;
    jobTitle: string;
    skillTags: string[];
    postViewCount: number;
    postViewCountDiff: number;
    reputation: number;
    reputationDiff: number;
    solutionCount: number;
    solutionCountDiff: number;
    categoryDiscussCount: number;
    categoryDiscussCountDiff: number;
  };
  submitStats: {
    acSubmissionNum: Array<{
      difficulty: string;
      count: number;
      submissions: number;
    }>;
    totalSubmissionNum: Array<{
      difficulty: string;
      count: number;
      submissions: number;
    }>;
  };
}

export interface ProblemOfTheDay {
  date: string;
  userStatus: string | null;
  link: string;
  question: {
    questionId: string;
    title: string;
    titleSlug: string;
    difficulty: string;
    isPaidOnly: boolean;
    topicTags: TopicTag[];
  };
}

/**
 * Get recent public submissions for a user
 */
export function getRecentPublicSubmissions(
  username: string,
  limit?: number
): Promise<LeetCodeSubmission[]>;

/**
 * Get metadata for a specific problem
 */
export function getProblemMetadata(
  titleSlug: string
): Promise<ProblemMetadata | null>;

/**
 * Get all submissions with pagination (requires authentication)
 */
export function getAllSubmissionsPaginated(
  offset?: number,
  limit?: number
): Promise<PaginatedSubmission[]>;

/**
 * Get detailed code and metadata for a specific submission (requires authentication)
 */
export function getSubmissionCode(
  submissionId: string
): Promise<SubmissionDetails | null>;

/**
 * Get user profile statistics
 */
export function getUserProfile(
  username: string
): Promise<UserProfile | null>;

/**
 * Fetch and enrich LeetCode profile summary with recent submissions
 */
export function fetchLeetCodeProfileSummary(
  username: string,
  limit?: number
): Promise<EnrichedSubmission[]>;

/**
 * Get problem of the day
 */
export function getProblemOfTheDay(): Promise<ProblemOfTheDay | null>;

declare const leetcodeClient: {
  getRecentPublicSubmissions: typeof getRecentPublicSubmissions;
  getProblemMetadata: typeof getProblemMetadata;
  getAllSubmissionsPaginated: typeof getAllSubmissionsPaginated;
  getSubmissionCode: typeof getSubmissionCode;
  getUserProfile: typeof getUserProfile;
  fetchLeetCodeProfileSummary: typeof fetchLeetCodeProfileSummary;
  getProblemOfTheDay: typeof getProblemOfTheDay;
};

export default leetcodeClient;
