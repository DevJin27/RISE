/**
 * LeetCode Client - Example Usage
 * 
 * Run this file to test the LeetCode client functionality
 * 
 * Usage:
 * node src/utils/leetcodeClient.example.js
 * 
 * Or with environment variables:
 * LEETCODE_COOKIE="LEETCODE_SESSION=xxx; csrftoken=xxx" node src/utils/leetcodeClient.example.js
 */

import {
  getRecentPublicSubmissions,
  getProblemMetadata,
  getUserProfile,
  getProblemOfTheDay,
  fetchLeetCodeProfileSummary,
  getAllSubmissionsPaginated,
  getSubmissionCode
} from './leetcodeClient.js';

// Configuration
const TEST_USERNAME = 'Shrage'; // Change this to test with a different user
const SUBMISSION_LIMIT = 10;

/**
 * Example 1: Fetch recent public submissions
 */
async function example1() {
  console.log('\n=== Example 1: Recent Public Submissions ===\n');
  
  try {
    const submissions = await getRecentPublicSubmissions(TEST_USERNAME, SUBMISSION_LIMIT);
    
    console.log(`Found ${submissions.length} recent submissions for ${TEST_USERNAME}:\n`);
    
    submissions.slice(0, 5).forEach((sub, idx) => {
      console.log(`${idx + 1}. ${sub.title}`);
      console.log(`   Status: ${sub.statusDisplay}`);
      console.log(`   Language: ${sub.lang}`);
      console.log(`   Timestamp: ${new Date(parseInt(sub.timestamp) * 1000).toLocaleString()}`);
      console.log('');
    });
  } catch (error) {
    console.error('Example 1 failed:', error.message);
  }
}

/**
 * Example 2: Get problem metadata
 */
async function example2() {
  console.log('\n=== Example 2: Problem Metadata ===\n');
  
  try {
    const problemSlug = 'two-sum';
    const metadata = await getProblemMetadata(problemSlug);
    
    if (metadata) {
      console.log(`Problem: ${metadata.title}`);
      console.log(`ID: ${metadata.questionId}`);
      console.log(`Difficulty: ${metadata.difficulty}`);
      console.log(`Paid Only: ${metadata.isPaidOnly ? 'Yes' : 'No'}`);
      console.log(`Likes: ${metadata.likes} | Dislikes: ${metadata.dislikes}`);
      console.log(`Tags: ${metadata.topicTags.map(t => t.name).join(', ')}`);
    } else {
      console.log('Problem not found');
    }
  } catch (error) {
    console.error('Example 2 failed:', error.message);
  }
}

/**
 * Example 3: Get user profile
 */
async function example3() {
  console.log('\n=== Example 3: User Profile ===\n');
  
  try {
    const profile = await getUserProfile(TEST_USERNAME);
    
    if (profile) {
      console.log(`Username: ${profile.username}`);
      console.log(`Ranking: ${profile.profile.ranking}`);
      console.log(`Real Name: ${profile.profile.realName || 'Not provided'}`);
      console.log(`Country: ${profile.profile.countryName || 'Not provided'}`);
      console.log(`\nSubmission Stats:`);
      
      profile.submitStats.acSubmissionNum.forEach(stat => {
        console.log(`  ${stat.difficulty}: ${stat.count} solved (${stat.submissions} submissions)`);
      });
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Example 3 failed:', error.message);
  }
}

/**
 * Example 4: Get problem of the day
 */
async function example4() {
  console.log('\n=== Example 4: Problem of the Day ===\n');
  
  try {
    const potd = await getProblemOfTheDay();
    
    if (potd) {
      console.log(`Date: ${potd.date}`);
      console.log(`Problem: ${potd.question.title}`);
      console.log(`Difficulty: ${potd.question.difficulty}`);
      console.log(`Link: https://leetcode.com${potd.link}`);
      console.log(`Tags: ${potd.question.topicTags.map(t => t.name).join(', ')}`);
    } else {
      console.log('Problem of the day not found');
    }
  } catch (error) {
    console.error('Example 4 failed:', error.message);
  }
}

/**
 * Example 5: Fetch enriched profile summary (Main function)
 */
async function example5() {
  console.log('\n=== Example 5: Enriched Profile Summary ===\n');
  
  try {
    const summary = await fetchLeetCodeProfileSummary(TEST_USERNAME, 5);
    
    console.log(`Enriched activity feed for ${TEST_USERNAME}:\n`);
    
    summary.forEach((item, idx) => {
      console.log(`${idx + 1}. ${item.title}`);
      console.log(`   Difficulty: ${item.difficulty}`);
      console.log(`   Status: ${item.status}`);
      console.log(`   Language: ${item.lang}`);
      console.log(`   Tags: ${item.tags.join(', ')}`);
      console.log(`   URL: ${item.url}`);
      console.log(`   Likes: ${item.likes} | Dislikes: ${item.dislikes}`);
      console.log('');
    });
    
    // Export to JSON
    console.log('\nJSON Output:');
    console.log(JSON.stringify(summary, null, 2));
  } catch (error) {
    console.error('Example 5 failed:', error.message);
  }
}

/**
 * Example 6: Get all submissions (requires authentication)
 */
async function example6() {
  console.log('\n=== Example 6: All Submissions (Authenticated) ===\n');
  
  if (!process.env.LEETCODE_COOKIE) {
    console.log('⚠️  Skipping: LEETCODE_COOKIE environment variable not set');
    console.log('   Set it to test authenticated endpoints');
    return;
  }
  
  try {
    console.log('Fetching all submissions (this may take a while)...\n');
    const allSubmissions = await getAllSubmissionsPaginated(0, 20);
    
    console.log(`Total submissions fetched: ${allSubmissions.length}\n`);
    
    // Show first 5
    allSubmissions.slice(0, 5).forEach((sub, idx) => {
      console.log(`${idx + 1}. ${sub.title}`);
      console.log(`   Status: ${sub.statusDisplay}`);
      console.log(`   Language: ${sub.langName}`);
      console.log(`   Runtime: ${sub.runtime}`);
      console.log(`   Memory: ${sub.memory}`);
      console.log('');
    });
  } catch (error) {
    console.error('Example 6 failed:', error.message);
  }
}

/**
 * Example 7: Get submission code (requires authentication)
 */
async function example7() {
  console.log('\n=== Example 7: Submission Code (Authenticated) ===\n');
  
  if (!process.env.LEETCODE_COOKIE) {
    console.log('⚠️  Skipping: LEETCODE_COOKIE environment variable not set');
    return;
  }
  
  try {
    // First get a submission ID from recent submissions
    const submissions = await getAllSubmissionsPaginated(0, 1);
    
    if (submissions.length === 0) {
      console.log('No submissions found');
      return;
    }
    
    const submissionId = submissions[0].id;
    console.log(`Fetching code for submission ID: ${submissionId}\n`);
    
    const details = await getSubmissionCode(submissionId);
    
    if (details) {
      console.log(`Problem: ${details.question.title}`);
      console.log(`Difficulty: ${details.question.difficulty}`);
      console.log(`Language: ${details.langName}`);
      console.log(`Runtime: ${details.runtimeDisplay} (${details.runtimePercentile}th percentile)`);
      console.log(`Memory: ${details.memoryDisplay} (${details.memoryPercentile}th percentile)`);
      console.log(`\nCode:\n${details.code.substring(0, 200)}...`);
    }
  } catch (error) {
    console.error('Example 7 failed:', error.message);
  }
}

/**
 * Run all examples
 */
async function runAllExamples() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║        LeetCode Client - Example Usage                    ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\nTesting with username: ${TEST_USERNAME}`);
  console.log(`Authentication: ${process.env.LEETCODE_COOKIE ? '✓ Enabled' : '✗ Disabled'}`);
  
  try {
    await example1(); // Recent submissions
    await example2(); // Problem metadata
    await example3(); // User profile
    await example4(); // Problem of the day
    await example5(); // Enriched summary (main function)
    await example6(); // All submissions (auth required)
    await example7(); // Submission code (auth required)
    
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║        All Examples Completed Successfully! ✓             ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples();
}

// Export for use in other files
export {
  example1,
  example2,
  example3,
  example4,
  example5,
  example6,
  example7,
  runAllExamples
};
