/**
 * LeetCode Problem of the Day API Route
 * 
 * GET /api/leetcode/problem-of-day
 * 
 * Returns today's daily coding challenge
 */

import { NextResponse } from 'next/server';
import { getProblemOfTheDay } from '@/utils/leetcodeClient';

export async function GET() {
  try {
    const problemOfDay = await getProblemOfTheDay();

    if (!problemOfDay) {
      return NextResponse.json(
        { error: 'Problem of the day not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: problemOfDay
    });

  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch problem of the day',
        message: error.message
      },
      { status: 500 }
    );
  }
}
