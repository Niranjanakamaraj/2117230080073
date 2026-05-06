import { NextResponse } from 'next/server';
import { Log } from 'logging_middleware';

export async function GET(request: Request) {
  Log('backend', 'info', 'route', 'Attempting to fetch notifications from evaluation service');
  
  try {
    const token = process.env.NEXT_PUBLIC_LOG_TOKEN || 'placeholder-token';
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');
    const notification_type = searchParams.get('notification_type');

    let fetchUrl = 'http://20.207.122.201/evaluation-service/notifications';
    const queryParts = [];
    if (limit) queryParts.push(`limit=${limit}`);
    if (page) queryParts.push(`page=${page}`);
    if (notification_type) queryParts.push(`notification_type=${notification_type}`);
    
    if (queryParts.length > 0) {
      fetchUrl += `?${queryParts.join('&')}`;
    }

    const response = await fetch(fetchUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
        Log('backend', 'warn', 'route', `Failed to fetch notifications: ${response.status} ${response.statusText}`);
        throw new Error("Failed to fetch");
    }

    const data = await response.json();
    Log('backend', 'info', 'route', `Successfully fetched ${data.notifications?.length || 0} notifications`);
    return NextResponse.json(data);
  } catch (error) {
    Log('backend', 'error', 'route', `Error fetching notifications: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
