/**
 * LeetCode Activity Feed API Route
 * 
 * GET /api/leetcode/activity-feed?username=Shrage&limit=20
 * 
 * Returns enriched LeetCode submission data for a given username
 */

import { NextResponse } from 'next/server';
import { fetchLeetCodeProfileSummary } from '@/utils/leetcodeClient';

export async function GET(request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const limit = parseInt(searchParams.get('limit') || '15', 10);

    // Validate username
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required', message: 'Please provide a username query parameter' },
        { status: 400 }
      );
    }

    // Validate limit
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid limit', message: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Fetch data
    const activityFeed = await fetchLeetCodeProfileSummary(username, limit);

    // Return response
    return NextResponse.json({
      success: true,
      username,
      count: activityFeed.length,
      data: activityFeed
    });

  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch LeetCode activity',
        message: error.message
      },
      { status: 500 }
    );
  }
}

// Optional: Add POST method for batch requests
export async function POST(request) {
  try {
    const body = await request.json();
    const { usernames, limit = 15 } = body;

    if (!Array.isArray(usernames) || usernames.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request', message: 'Please provide an array of usernames' },
        { status: 400 }
      );
    }

    // Fetch data for all usernames
    const results = await Promise.allSettled(
      usernames.map(username => fetchLeetCodeProfileSummary(username, limit))
    );

    // Format results
    const data = results.map((result, index) => ({
      username: usernames[index],
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason.message : null
    }));

    return NextResponse.json({
      success: true,
      count: data.length,
      results: data
    });

  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process batch request',
        message: error.message
      },
      { status: 500 }
    );
  }
}
