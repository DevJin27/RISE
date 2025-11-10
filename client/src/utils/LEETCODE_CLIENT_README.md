# LeetCode Client Utility

A comprehensive, production-ready utility module for fetching data from the LeetCode GraphQL API.

## Features

- ✅ Public data fetching (no authentication required)
- ✅ Authenticated data fetching (with cookie support)
- ✅ Automatic retry logic for rate limiting
- ✅ Clean error handling
- ✅ TypeScript-ready with JSDoc comments
- ✅ Next.js API route integration
- ✅ Pagination support for large datasets

## Installation

```bash
npm install axios
```

## Environment Variables

For authenticated endpoints, set the following environment variable:

```bash
LEETCODE_COOKIE="LEETCODE_SESSION=your_session_token; csrftoken=your_csrf_token"
```

### How to get your LeetCode cookies:

1. Log in to LeetCode in your browser
2. Open Developer Tools (F12)
3. Go to Application/Storage → Cookies → https://leetcode.com
4. Copy the values of `LEETCODE_SESSION` and `csrftoken`
5. Format as: `LEETCODE_SESSION=<value>; csrftoken=<value>`

## API Functions

### Public Functions (No Authentication Required)

#### `getRecentPublicSubmissions(username, limit)`

Fetch recent public submissions for a user.

```javascript
import { getRecentPublicSubmissions } from '@/utils/leetcodeClient';

const submissions = await getRecentPublicSubmissions('Shrage', 20);
console.log(submissions);
// [
//   {
//     title: "Two Sum",
//     titleSlug: "two-sum",
//     timestamp: "1759209650",
//     statusDisplay: "Accepted",
//     lang: "python3"
//   }
// ]
```

#### `getProblemMetadata(titleSlug)`

Get detailed metadata for a specific problem.

```javascript
import { getProblemMetadata } from '@/utils/leetcodeClient';

const metadata = await getProblemMetadata('coin-change');
console.log(metadata);
// {
//   questionId: "322",
//   title: "Coin Change",
//   difficulty: "Medium",
//   isPaidOnly: false,
//   topicTags: [
//     { name: "Dynamic Programming", slug: "dynamic-programming" },
//     { name: "Array", slug: "array" }
//   ],
//   likes: 15234,
//   dislikes: 342
// }
```

#### `getUserProfile(username)`

Get user profile statistics.

```javascript
import { getUserProfile } from '@/utils/leetcodeClient';

const profile = await getUserProfile('Shrage');
console.log(profile);
// {
//   username: "Shrage",
//   profile: {
//     ranking: 12345,
//     realName: "John Doe",
//     ...
//   },
//   submitStats: {
//     acSubmissionNum: [...],
//     totalSubmissionNum: [...]
//   }
// }
```

#### `getProblemOfTheDay()`

Get today's daily coding challenge.

```javascript
import { getProblemOfTheDay } from '@/utils/leetcodeClient';

const potd = await getProblemOfTheDay();
console.log(potd);
// {
//   date: "2025-01-10",
//   link: "/problems/...",
//   question: {
//     title: "...",
//     difficulty: "Medium",
//     ...
//   }
// }
```

#### `fetchLeetCodeProfileSummary(username, limit)`

**Main helper function** - Fetches and enriches recent submissions with metadata.

```javascript
import { fetchLeetCodeProfileSummary } from '@/utils/leetcodeClient';

const feed = await fetchLeetCodeProfileSummary('Shrage', 15);
console.log(feed);
// [
//   {
//     title: "Coin Change",
//     slug: "coin-change",
//     status: "Accepted",
//     difficulty: "Medium",
//     tags: ["Dynamic Programming", "Array"],
//     lang: "python3",
//     timestamp: "1759209650",
//     url: "https://leetcode.com/problems/coin-change/",
//     isPaidOnly: false,
//     questionId: "322",
//     likes: 15234,
//     dislikes: 342
//   }
// ]
```

### Authenticated Functions (Require LEETCODE_COOKIE)

#### `getAllSubmissionsPaginated(offset, limit)`

Fetch all submissions with automatic pagination.

```javascript
import { getAllSubmissionsPaginated } from '@/utils/leetcodeClient';

// Requires LEETCODE_COOKIE environment variable
const allSubmissions = await getAllSubmissionsPaginated(0, 50);
console.log(`Total submissions: ${allSubmissions.length}`);
```

#### `getSubmissionCode(submissionId)`

Get detailed code and metadata for a specific submission.

```javascript
import { getSubmissionCode } from '@/utils/leetcodeClient';

// Requires LEETCODE_COOKIE environment variable
const details = await getSubmissionCode('123456789');
console.log(details);
// {
//   code: "class Solution:\n    def twoSum...",
//   runtime: "52 ms",
//   memory: "14.2 MB",
//   lang: "python3",
//   question: {
//     title: "Two Sum",
//     difficulty: "Easy"
//   }
// }
```

## Next.js API Routes

### Activity Feed

```
GET /api/leetcode/activity-feed?username=Shrage&limit=20
```

**Response:**
```json
{
  "success": true,
  "username": "Shrage",
  "count": 20,
  "data": [...]
}
```

### User Profile

```
GET /api/leetcode/profile?username=Shrage
```

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "Shrage",
    "profile": {...},
    "submitStats": {...}
  }
}
```

### Problem of the Day

```
GET /api/leetcode/problem-of-day
```

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2025-01-10",
    "question": {...}
  }
}
```

### Batch Request (POST)

```
POST /api/leetcode/activity-feed
Content-Type: application/json

{
  "usernames": ["user1", "user2", "user3"],
  "limit": 10
}
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "results": [
    {
      "username": "user1",
      "success": true,
      "data": [...]
    },
    ...
  ]
}
```

## Usage in React Components

```javascript
'use client';

import { useState, useEffect } from 'react';

export default function LeetCodeActivity() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await fetch('/api/leetcode/activity-feed?username=Shrage&limit=15');
        const data = await response.json();
        
        if (data.success) {
          setActivity(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch activity:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {activity.map((item, idx) => (
        <div key={idx}>
          <h3>{item.title}</h3>
          <p>Difficulty: {item.difficulty}</p>
          <p>Status: {item.status}</p>
          <p>Tags: {item.tags.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

The client includes comprehensive error handling:

- **Rate Limiting (429)**: Automatically retries with exponential backoff
- **Authentication Errors (403)**: Clear error messages
- **Network Errors**: Logged and thrown with context
- **Invalid Responses**: Gracefully handled with fallbacks

## Rate Limiting

To avoid hitting LeetCode's rate limits:

1. The client includes automatic retry logic
2. Delays are added between paginated requests
3. Metadata fetching includes 300ms delays between requests
4. Maximum of 3 retry attempts for rate-limited requests

## Best Practices

1. **Cache responses** when possible to reduce API calls
2. **Use environment variables** for sensitive data
3. **Implement request throttling** in production
4. **Monitor API usage** to stay within limits
5. **Handle errors gracefully** in your UI

## Troubleshooting

### "Authentication required" error

Make sure `LEETCODE_COOKIE` environment variable is set correctly:

```bash
LEETCODE_COOKIE="LEETCODE_SESSION=your_token; csrftoken=your_token"
```

### Rate limiting issues

If you're hitting rate limits frequently:

1. Reduce the number of concurrent requests
2. Implement caching
3. Add longer delays between requests
4. Consider using a queue system

### No data returned

Check that:

1. The username exists on LeetCode
2. The user has public submissions
3. Network connectivity is working
4. LeetCode API is accessible

## License

MIT

## Contributing

Feel free to submit issues and pull requests!
