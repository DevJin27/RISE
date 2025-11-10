/**
 * LeetCode Profile API Route
 * 
 * GET /api/leetcode/profile?username=Shrage
 * 
 * Returns LeetCode user profile statistics
 */

import { NextResponse } from 'next/server';
import { getUserProfile } from '@/utils/leetcodeClient';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const profile = await getUserProfile(username);

    if (!profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile
    });

  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch profile',
        message: error.message
      },
      { status: 500 }
    );
  }
}
