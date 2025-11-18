/**
 * LeetCode GraphQL API Client
 * 
 * A comprehensive, production-ready utility module for fetching public and 
 * authenticated data from the LeetCode GraphQL API.
 * 
 * @module leetcodeClient
 * @version 2.0.0
 */

import axios from 'axios';

// ============================================================================
// CONSTANTS
// ============================================================================

const LEETCODE_GRAPHQL_ENDPOINT = 'https://leetcode.com/graphql';
const LEETCODE_BASE_URL = 'https://leetcode.com';

// Retry & Rate Limiting
const DEFAULT_RETRY_DELAY = 2000;
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 10000;
const METADATA_FETCH_DELAY = 300;
const PAGINATION_DELAY = 500;

// Cache Configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ============================================================================
// TYPES & INTERFACES (for JSDoc)
// ============================================================================

/**
 * @typedef {Object} LoggerInterface
 * @property {Function} debug - Debug level logging
 * @property {Function} info - Info level logging
 * @property {Function} warn - Warning level logging
 * @property {Function} error - Error level logging
 */

/**
 * @typedef {Object} ClientOptions
 * @property {string} [cookie] - LeetCode session cookie
 * @property {number} [maxRetries=3] - Maximum retry attempts
 * @property {number} [retryDelay=2000] - Delay between retries (ms)
 * @property {number} [timeout=10000] - Request timeout (ms)
 * @property {LoggerInterface} [logger] - Custom logger implementation
 * @property {boolean} [enableCache=true] - Enable response caching
 */

// ============================================================================
// CACHE IMPLEMENTATION
// ============================================================================

class SimpleCache {
  constructor(ttl = CACHE_TTL) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }
}

// ============================================================================
// DEFAULT LOGGER
// ============================================================================

const defaultLogger = {
  debug: () => {}, // Silent by default
  info: (msg) => console.log(`[INFO] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`)
};

// ============================================================================
// LEETCODE CLIENT CLASS
// ============================================================================

/**
 * LeetCode API Client
 */
export class LeetCodeClient {
  /**
   * @param {ClientOptions} options - Client configuration options
   */
  constructor(options = {}) {
    this.cookie = options.cookie || process.env.LEETCODE_COOKIE;
    this.maxRetries = options.maxRetries ?? MAX_RETRIES;
    this.retryDelay = options.retryDelay ?? DEFAULT_RETRY_DELAY;
    this.timeout = options.timeout ?? REQUEST_TIMEOUT;
    this.logger = options.logger ?? defaultLogger;
    this.cache = options.enableCache !== false ? new SimpleCache() : null;
  }

  /**
   * Get headers for LeetCode API requests
   * @private
   * @returns {Object} Headers object
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com/',
      'Origin': 'https://leetcode.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };
    
    if (this.cookie) {
      headers.Cookie = this.cookie;
    }
    
    return headers;
  }

  /**
   * Make a GraphQL request with retry logic
   * @private
   * @param {string} query - GraphQL query
   * @param {Object} variables - Query variables
   * @param {number} retryCount - Current retry attempt
   * @returns {Promise<Object>} Response data
   * @throws {Error} If request fails after all retries
   */
  async makeGraphQLRequest(query, variables = {}, retryCount = 0) {
    try {
      const response = await axios.post(
        LEETCODE_GRAPHQL_ENDPOINT,
        { query, variables },
        {
          headers: this.getHeaders(),
          timeout: this.timeout
        }
      );

      // Handle GraphQL errors
      if (response.data.errors) {
        const errors = response.data.errors;
        const errorMessages = errors.map(e => e.message).join(', ');
        throw new Error(`GraphQL Error: ${errorMessages}`);
      }

      return response.data.data;
    } catch (error) {
      // Handle rate limiting
      if (error.response?.status === 429 && retryCount < this.maxRetries) {
        this.logger.warn(
          `Rate limited. Retrying after ${this.retryDelay}ms... ` +
          `(Attempt ${retryCount + 1}/${this.maxRetries})`
        );
        await this.delay(this.retryDelay);
        return this.makeGraphQLRequest(query, variables, retryCount + 1);
      }

      // Handle authentication errors
      if (error.response?.status === 403) {
        const authError = new Error(
          'Authentication required. Please provide a valid LeetCode cookie.'
        );
        authError.code = 'AUTH_REQUIRED';
        throw authError;
      }

      // Log and rethrow
      this.logger.error(`API Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delay helper
   * @private
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch with delay (for sequential requests)
   * @private
   * @param {Array<Promise>} promises - Array of promises
   * @param {number} delay - Delay between requests (ms)
   * @returns {Promise<Array>} Results
   */
  async fetchWithDelay(promises, delay) {
    const results = [];
    for (let i = 0; i < promises.length; i++) {
      results.push(await promises[i]);
      if (i < promises.length - 1) {
        await this.delay(delay);
      }
    }
    return results;
  }

  // ==========================================================================
  // PUBLIC API METHODS
  // ==========================================================================

  /**
   * Get recent public submissions for a user
   * 
   * @param {string} username - LeetCode username
   * @param {number} limit - Maximum submissions to fetch (default: 20)
   * @returns {Promise<Array>} Array of recent submissions
   * 
   * @example
   * const submissions = await client.getRecentPublicSubmissions('username', 15);
   */
  async getRecentPublicSubmissions(username, limit = 20) {
    const cacheKey = `submissions:${username}:${limit}`;
    const cached = this.cache?.get(cacheKey);
    if (cached) return cached;

    const query = `
      query recentSubmissions($username: String!, $limit: Int!) {
        recentSubmissionList(username: $username, limit: $limit) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(query, { username, limit });
      const result = data.recentSubmissionList ?? [];
      this.cache?.set(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch submissions for ${username}: ${error.message}`);
      return [];
    }
  }

  /**
   * Get metadata for a specific problem
   * 
   * @param {string} titleSlug - Problem slug (e.g., 'two-sum')
   * @returns {Promise<Object|null>} Problem metadata or null
   * 
   * @example
   * const metadata = await client.getProblemMetadata('coin-change');
   */
  async getProblemMetadata(titleSlug) {
    const cacheKey = `metadata:${titleSlug}`;
    const cached = this.cache?.get(cacheKey);
    if (cached) return cached;

    const query = `
      query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          title
          titleSlug
          difficulty
          isPaidOnly
          topicTags {
            name
            slug
          }
          stats
          likes
          dislikes
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(query, { titleSlug });
      const result = data.question ?? null;
      if (result) this.cache?.set(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch metadata for ${titleSlug}: ${error.message}`);
      return null;
    }
  }

  /**
   * Get all submissions with pagination (requires authentication)
   * 
   * @param {number} offset - Starting offset (default: 0)
   * @param {number} limit - Submissions per page (default: 50)
   * @returns {Promise<Array>} Array of all submissions
   * 
   * @example
   * const allSubmissions = await client.getAllSubmissionsPaginated(0, 50);
   */
  async getAllSubmissionsPaginated(offset = 0, limit = 50) {
    const query = `
      query submissionList($offset: Int!, $limit: Int!) {
        submissionList(offset: $offset, limit: $limit) {
          lastKey
          hasNext
          submissions {
            id
            title
            titleSlug
            status
            statusDisplay
            lang
            langName
            runtime
            timestamp
            url
            memory
          }
        }
      }
    `;

    const allSubmissions = [];
    let currentOffset = offset;
    let hasNext = true;

    try {
      while (hasNext) {
        const data = await this.makeGraphQLRequest(query, { 
          offset: currentOffset, 
          limit 
        });
        
        if (!data.submissionList) break;

        const { submissions, hasNext: more } = data.submissionList;
        
        if (submissions?.length > 0) {
          allSubmissions.push(...submissions);
          currentOffset += submissions.length;
          hasNext = more && submissions.length === limit;
        } else {
          hasNext = false;
        }

        if (hasNext) {
          await this.delay(PAGINATION_DELAY);
        }
      }

      return allSubmissions;
    } catch (error) {
      this.logger.error(`Failed to fetch paginated submissions: ${error.message}`);
      return allSubmissions; // Return partial results
    }
  }

  /**
   * Get detailed code and metadata for a specific submission (requires auth)
   * 
   * @param {string} submissionId - Submission ID
   * @returns {Promise<Object|null>} Submission details or null
   * 
   * @example
   * const details = await client.getSubmissionCode('123456789');
   */
  async getSubmissionCode(submissionId) {
    const query = `
      query submissionDetails($submissionId: Int!) {
        submissionDetails(submissionId: $submissionId) {
          runtime
          runtimeDisplay
          runtimePercentile
          runtimeDistribution
          memory
          memoryDisplay
          memoryPercentile
          memoryDistribution
          code
          timestamp
          statusCode
          lang
          langName
          question {
            questionId
            title
            titleSlug
            content
            difficulty
          }
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(query, { 
        submissionId: parseInt(submissionId) 
      });
      return data.submissionDetails ?? null;
    } catch (error) {
      this.logger.error(`Failed to fetch submission ${submissionId}: ${error.message}`);
      return null;
    }
  }

  /**
   * Get user profile statistics (public data)
   * 
   * @param {string} username - LeetCode username
   * @returns {Promise<Object|null>} User profile data or null
   * 
   * @example
   * const profile = await client.getUserProfile('username');
   */
  async getUserProfile(username) {
    const cacheKey = `profile:${username}`;
    const cached = this.cache?.get(cacheKey);
    if (cached) return cached;

    const query = `
      query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            userAvatar
            realName
            aboutMe
            school
            websites
            countryName
            company
            jobTitle
            skillTags
            postViewCount
            postViewCountDiff
            reputation
            reputationDiff
            solutionCount
            solutionCountDiff
            categoryDiscussCount
            categoryDiscussCountDiff
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
            totalSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(query, { username });
      const result = data.matchedUser ?? null;
      if (result) this.cache?.set(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch profile for ${username}: ${error.message}`);
      return null;
    }
  }

  /**
   * Get skill statistics for a user
   * 
   * @param {string} username - LeetCode username
   * @returns {Promise<Object|null>} Skill statistics or null
   * 
   * @example
   * const skills = await client.getUserSkillStats('username');
   */
  async getUserSkillStats(username) {
    const cacheKey = `skills:${username}`;
    const cached = this.cache?.get(cacheKey);
    if (cached) return cached;

    const query = `
      query skillStats($username: String!) {
        matchedUser(username: $username) {
          tagProblemCounts {
            advanced {
              tagName
              tagSlug
              problemsSolved
            }
            intermediate {
              tagName
              tagSlug
              problemsSolved
            }
            fundamental {
              tagName
              tagSlug
              problemsSolved
            }
          }
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(query, { username });
      const result = data.matchedUser?.tagProblemCounts ?? null;
      if (result) this.cache?.set(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch skill stats for ${username}: ${error.message}`);
      return null;
    }
  }

  /**
   * Get user calendar data (heatmap activity)
   * FIXED: This is the correct query based on the GraphQL schema
   * 
   * @param {string} username - LeetCode username
   * @param {number} [year] - Optional year filter
   * @returns {Promise<Object|null>} Calendar data or null
   * 
   * @example
   * const calendar = await client.getUserCalendar('username', 2024);
   */
  async getUserCalendar(username, year = null) {
    const cacheKey = `calendar:${username}:${year || 'all'}`;
    const cached = this.cache?.get(cacheKey);
    if (cached) return cached;

    const query = `
      query userProfileCalendar($username: String!, $year: Int) {
        matchedUser(username: $username) {
          userCalendar(year: $year) {
            activeYears
            streak
            totalActiveDays
            dccBadges {
              timestamp
              badge {
                name
                icon
              }
            }
            submissionCalendar
          }
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(query, { username, year });
      const result = data.matchedUser?.userCalendar ?? null;
      if (result) this.cache?.set(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch calendar for ${username}: ${error.message}`);
      return null;
    }
  }

  /**
   * Get problem of the day
   * 
   * @returns {Promise<Object|null>} Problem of the day data or null
   * 
   * @example
   * const potd = await client.getProblemOfTheDay();
   */
  async getProblemOfTheDay() {
    const cacheKey = 'potd';
    const cached = this.cache?.get(cacheKey);
    if (cached) return cached;

    const query = `
      query questionOfToday {
        activeDailyCodingChallengeQuestion {
          date
          userStatus
          link
          question {
            questionId
            title
            titleSlug
            difficulty
            isPaidOnly
            topicTags {
              name
              slug
            }
          }
        }
      }
    `;

    try {
      const data = await this.makeGraphQLRequest(query);
      const result = data.activeDailyCodingChallengeQuestion ?? null;
      if (result) this.cache?.set(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch problem of the day: ${error.message}`);
      return null;
    }
  }

  /**
   * Fetch comprehensive profile summary with enriched data
   * 
   * @param {string} username - LeetCode username
   * @param {number} limit - Number of recent submissions (default: 15)
   * @returns {Promise<Object>} Enriched profile summary
   * 
   * @example
   * const profile = await client.fetchProfileSummary('username', 20);
   */
  async fetchProfileSummary(username, limit = 15) {
    try {
      this.logger.info(`Fetching profile summary for ${username}...`);

      // Fetch all data in parallel
      const [submissions, skillStats, calendar] = await Promise.all([
        this.getRecentPublicSubmissions(username, limit),
        this.getUserSkillStats(username),
        this.getUserCalendar(username)
      ]);
      
      if (!submissions?.length) {
        this.logger.warn(`No submissions found for ${username}`);
        return { submissions: [], skillStats, calendar };
      }

      this.logger.info(`Found ${submissions.length} recent submissions`);

      // Get unique problem slugs
      const uniqueSlugs = [...new Set(submissions.map(s => s.titleSlug))];
      
      // Fetch metadata with rate limiting
      const metadataPromises = uniqueSlugs.map(slug => 
        this.getProblemMetadata(slug)
      );
      const metadataResults = await this.fetchWithDelay(
        metadataPromises, 
        METADATA_FETCH_DELAY
      );

      // Create metadata map
      const metadataMap = Object.fromEntries(
        metadataResults
          .map((metadata, index) => [uniqueSlugs[index], metadata])
          .filter(([_, metadata]) => metadata !== null)
      );

      // Enrich submissions with metadata
      const enrichedSubmissions = submissions.map(submission => {
        const metadata = metadataMap[submission.titleSlug] ?? {};
        
        return {
          title: submission.title,
          slug: submission.titleSlug,
          status: submission.statusDisplay,
          difficulty: metadata.difficulty ?? 'Unknown',
          tags: metadata.topicTags?.map(tag => tag.name) ?? [],
          lang: submission.lang,
          timestamp: submission.timestamp,
          url: `${LEETCODE_BASE_URL}/problems/${submission.titleSlug}/`,
          isPaidOnly: metadata.isPaidOnly ?? false,
          questionId: metadata.questionId ?? null,
          likes: metadata.likes ?? 0,
          dislikes: metadata.dislikes ?? 0
        };
      });

      this.logger.info('Successfully fetched profile summary');
      
      return {
        submissions: enrichedSubmissions,
        skillStats,
        calendar
      };
    } catch (error) {
      this.logger.error(`Failed to fetch profile summary: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache?.clear();
    this.logger.info('Cache cleared');
  }
}

// ============================================================================
// FUNCTIONAL API (for backward compatibility)
// ============================================================================

// Create default client instance
let defaultClient = new LeetCodeClient();

/**
 * Configure the default client
 * @param {ClientOptions} options - Configuration options
 */
export function configure(options) {
  defaultClient = new LeetCodeClient(options);
}

/**
 * Get the current default client
 * @returns {LeetCodeClient}
 */
export function getClient() {
  return defaultClient;
}

// Export functional wrappers
export const getRecentPublicSubmissions = (...args) => 
  defaultClient.getRecentPublicSubmissions(...args);

export const getProblemMetadata = (...args) => 
  defaultClient.getProblemMetadata(...args);

export const getAllSubmissionsPaginated = (...args) => 
  defaultClient.getAllSubmissionsPaginated(...args);

export const getSubmissionCode = (...args) => 
  defaultClient.getSubmissionCode(...args);

export const getUserProfile = (...args) => 
  defaultClient.getUserProfile(...args);

export const getUserSkillStats = (...args) => 
  defaultClient.getUserSkillStats(...args);

export const getUserCalendar = (...args) => 
  defaultClient.getUserCalendar(...args);

export const getProblemOfTheDay = (...args) => 
  defaultClient.getProblemOfTheDay(...args);

export const fetchLeetCodeProfileSummary = (...args) => 
  defaultClient.fetchProfileSummary(...args);

// Default export
export default LeetCodeClient;