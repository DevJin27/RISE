/**
 * LeetCode GraphQL API Client
 * 
 * A comprehensive utility module for fetching public and authenticated data
 * from the LeetCode GraphQL API.
 * 
 * @module leetcodeClient
 */

import axios from 'axios';

// Constants
const LEETCODE_GRAPHQL_ENDPOINT = 'https://leetcode.com/graphql';
const LEETCODE_BASE_URL = 'https://leetcode.com';
const DEFAULT_RETRY_DELAY = 2000;
const MAX_RETRIES = 3;

/**
 * Get base headers for LeetCode API requests
 * @returns {Object} Headers object
 */
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Referer': 'https://leetcode.com/',
    'Origin': 'https://leetcode.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  };
  
  if (process.env.LEETCODE_COOKIE) {
    headers.Cookie = process.env.LEETCODE_COOKIE;
  }
  
  return headers;
};

/**
 * Make a GraphQL request to LeetCode API with retry logic
 * 
 * @param {string} query - GraphQL query string
 * @param {Object} variables - Query variables
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<Object>} Response data
 * @throws {Error} If request fails after all retries
 */
const makeGraphQLRequest = async (query, variables = {}, retryCount = 0) => {
  try {
    const response = await axios.post(
      LEETCODE_GRAPHQL_ENDPOINT,
      {
        query,
        variables
      },
      {
        headers: getHeaders(),
        timeout: 10000
      }
    );

    if (response.data.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
    }

    return response.data.data;
  } catch (error) {
    // Handle rate limiting
    if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
      console.warn(`Rate limited. Retrying after ${DEFAULT_RETRY_DELAY}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, DEFAULT_RETRY_DELAY));
      return makeGraphQLRequest(query, variables, retryCount + 1);
    }

    // Handle authentication errors
    if (error.response?.status === 403) {
      console.error('Authentication required. Please set LEETCODE_COOKIE environment variable.');
      throw new Error('LeetCode API: Authentication required for this endpoint');
    }

    // Log and rethrow other errors
    console.error('LeetCode API Error:', error.message);
    throw error;
  }
};

/**
 * Get recent public submissions for a user
 * 
 * @param {string} username - LeetCode username
 * @param {number} limit - Maximum number of submissions to fetch (default: 20)
 * @returns {Promise<Array>} Array of recent submissions
 * 
 * @example
 * const submissions = await getRecentPublicSubmissions('Shrage', 15);
 */
export const getRecentPublicSubmissions = async (username, limit = 20) => {
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
    const data = await makeGraphQLRequest(query, { username, limit });
    return data.recentSubmissionList || [];
  } catch (error) {
    console.error(`Failed to fetch submissions for user ${username}:`, error.message);
    return [];
  }
};

/**
 * Get metadata for a specific problem
 * 
 * @param {string} titleSlug - Problem slug (e.g., 'two-sum')
 * @returns {Promise<Object|null>} Problem metadata or null if not found
 * 
 * @example
 * const metadata = await getProblemMetadata('coin-change');
 */
export const getProblemMetadata = async (titleSlug) => {
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
    const data = await makeGraphQLRequest(query, { titleSlug });
    return data.question;
  } catch (error) {
    console.error(`Failed to fetch metadata for problem ${titleSlug}:`, error.message);
    return null;
  }
};

/**
 * Get all submissions with pagination (requires authentication)
 * 
 * @param {number} offset - Starting offset (default: 0)
 * @param {number} limit - Number of submissions per page (default: 50)
 * @returns {Promise<Array>} Array of all submissions
 * 
 * @example
 * const allSubmissions = await getAllSubmissionsPaginated(0, 50);
 */
export const getAllSubmissionsPaginated = async (offset = 0, limit = 50) => {
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
      const data = await makeGraphQLRequest(query, { offset: currentOffset, limit });
      
      if (!data.submissionList) {
        break;
      }

      const { submissions, hasNext: more } = data.submissionList;
      
      if (submissions && submissions.length > 0) {
        allSubmissions.push(...submissions);
        currentOffset += submissions.length;
        hasNext = more && submissions.length === limit;
      } else {
        hasNext = false;
      }

      // Add a small delay between requests to avoid rate limiting
      if (hasNext) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return allSubmissions;
  } catch (error) {
    console.error('Failed to fetch paginated submissions:', error.message);
    return allSubmissions; // Return what we have so far
  }
};

/**
 * Get detailed code and metadata for a specific submission (requires authentication)
 * 
 * @param {string} submissionId - Submission ID
 * @returns {Promise<Object|null>} Submission details or null if not found
 * 
 * @example
 * const details = await getSubmissionCode('123456789');
 */
export const getSubmissionCode = async (submissionId) => {
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
    const data = await makeGraphQLRequest(query, { submissionId: parseInt(submissionId) });
    return data.submissionDetails;
  } catch (error) {
    console.error(`Failed to fetch submission code for ID ${submissionId}:`, error.message);
    return null;
  }
};

/**
 * Get user profile statistics (public data)
 * 
 * @param {string} username - LeetCode username
 * @returns {Promise<Object|null>} User profile data or null if not found
 * 
 * @example
 * const profile = await getUserProfile('Shrage');
 */
export const getUserProfile = async (username) => {
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
    const data = await makeGraphQLRequest(query, { username });
    return data.matchedUser;
  } catch (error) {
    console.error(`Failed to fetch profile for user ${username}:`, error.message);
    return null;
  }
};

/**
 * Fetch and enrich LeetCode profile summary with recent submissions
 * 
 * This is the main helper function that combines multiple API calls to create
 * a comprehensive activity feed with problem metadata.
 * 
 * @param {string} username - LeetCode username
 * @param {number} limit - Number of recent submissions to fetch (default: 15)
 * @returns {Promise<Array>} Array of enriched submissions
 * 
 * @example
 * const feed = await fetchLeetCodeProfileSummary('Shrage', 20);
 * console.log(feed);
 * // [
 * //   {
 * //     title: "Coin Change",
 * //     slug: "coin-change",
 * //     status: "Accepted",
 * //     difficulty: "Medium",
 * //     tags: ["Dynamic Programming", "Array"],
 * //     lang: "python3",
 * //     timestamp: "1759209650",
 * //     url: "https://leetcode.com/problems/coin-change/",
 * //     isPaidOnly: false
 * //   }
 * // ]
 */
export const fetchLeetCodeProfileSummary = async (username, limit = 15) => {
  try {
    console.log(`Fetching profile summary for ${username}...`);

    // Step 1: Get recent submissions
    const submissions = await getRecentPublicSubmissions(username, limit);
    
    if (!submissions || submissions.length === 0) {
      console.warn(`No submissions found for user ${username}`);
      return [];
    }

    console.log(`Found ${submissions.length} recent submissions`);

    // Step 2: Fetch metadata for each unique problem
    const uniqueSlugs = [...new Set(submissions.map(s => s.titleSlug))];
    const metadataPromises = uniqueSlugs.map(slug => getProblemMetadata(slug));
    
    // Add delay between metadata requests to avoid rate limiting
    const metadataResults = [];
    for (const promise of metadataPromises) {
      const result = await promise;
      metadataResults.push(result);
      await new Promise(resolve => setTimeout(resolve, 300)); // 300ms delay
    }

    // Create a map of slug -> metadata
    const metadataMap = {};
    metadataResults.forEach((metadata, index) => {
      if (metadata) {
        metadataMap[uniqueSlugs[index]] = metadata;
      }
    });

    // Step 3: Merge submissions with metadata
    const enrichedSubmissions = submissions.map(submission => {
      const metadata = metadataMap[submission.titleSlug] || {};
      
      return {
        title: submission.title,
        slug: submission.titleSlug,
        status: submission.statusDisplay,
        difficulty: metadata.difficulty || 'Unknown',
        tags: metadata.topicTags?.map(tag => tag.name) || [],
        lang: submission.lang,
        timestamp: submission.timestamp,
        url: `${LEETCODE_BASE_URL}/problems/${submission.titleSlug}/`,
        isPaidOnly: metadata.isPaidOnly || false,
        questionId: metadata.questionId || null,
        likes: metadata.likes || 0,
        dislikes: metadata.dislikes || 0
      };
    });

    console.log(`Successfully enriched ${enrichedSubmissions.length} submissions`);
    return enrichedSubmissions;

  } catch (error) {
    console.error('Failed to fetch LeetCode profile summary:', error.message);
    throw error;
  }
};

/**
 * Get problem of the day
 * 
 * @returns {Promise<Object|null>} Problem of the day data or null if not found
 * 
 * @example
 * const potd = await getProblemOfTheDay();
 */
export const getProblemOfTheDay = async () => {
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
    const data = await makeGraphQLRequest(query);
    return data.activeDailyCodingChallengeQuestion;
  } catch (error) {
    console.error('Failed to fetch problem of the day:', error.message);
    return null;
  }
};

// Example usage (uncomment to test)
/*
(async () => {
  try {
    console.log('=== LeetCode Client Example Usage ===\n');
    
    // Example 1: Fetch profile summary
    const username = 'Shrage';
    console.log(`Fetching profile summary for ${username}...\n`);
    const data = await fetchLeetCodeProfileSummary(username, 10);
    console.log(JSON.stringify(data, null, 2));
    
    // Example 2: Get problem of the day
    console.log('\n=== Problem of the Day ===\n');
    const potd = await getProblemOfTheDay();
    console.log(JSON.stringify(potd, null, 2));
    
    // Example 3: Get user profile stats
    console.log('\n=== User Profile Stats ===\n');
    const profile = await getUserProfile(username);
    console.log(JSON.stringify(profile, null, 2));
    
  } catch (error) {
    console.error('Example failed:', error.message);
  }
})();
*/

// Export all functions
export default {
  getRecentPublicSubmissions,
  getProblemMetadata,
  getAllSubmissionsPaginated,
  getSubmissionCode,
  getUserProfile,
  fetchLeetCodeProfileSummary,
  getProblemOfTheDay
};
