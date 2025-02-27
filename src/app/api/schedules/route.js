import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  console.log('GET 요청 받음: /api/schedules');
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // 현재 사용자 정보 가져오기
    console.log('사용자 정보 가져오는 중...');
    const { data: { user } } = await supabase.auth.getUser();
    console.log('사용자 정보:', user ? user.id : '없음');
    
    if (!user) {
      console.log('사용자 인증 안됨');
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }
    
    // 사용자의 웨딩 정보 가져오기
    console.log('웨딩 정보 가져오는 중...');
    const { data: weddings, error: weddingError } = await supabase
      .from('weddings')
      .select('id')
      .eq('user_id', user.id);
      
    if (weddingError) {
      console.log('웨딩 정보 오류:', weddingError);
      throw weddingError;
    }
    
    console.log('웨딩 데이터:', weddings);
    
    if (!weddings || weddings.length === 0) {
      console.log('웨딩 정보 없음');
      return NextResponse.json({ data: [] });
    }
    
    // 해당 웨딩의 일정 항목 가져오기
    const weddingIds = weddings.map(w => w.id);
    console.log('조회할 웨딩 ID들:', weddingIds);
    
    const { data, error } = await supabase
      .from('schedule_items')
      .select('*')
      .in('wedding_id', weddingIds);
      
    if (error) {
      console.log('일정 조회 오류:', error);
      throw error;
    }
    
    console.log('일정 데이터:', data);
    return NextResponse.json({ data });
    
  } catch (error) {
    console.error('일정 로딩 전체 오류:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  console.log('POST 요청 받음: /api/schedules');
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const body = await request.json();
    console.log('받은 데이터:', body);
    const { title, description, date, venue, order_number } = body;
    
    // 사용자 정보 가져오기
    console.log('사용자 정보 가져오는 중...');
    const { data: { user } } = await supabase.auth.getUser();
    console.log('사용자 정보:', user ? user.id : '없음');
    
    if (!user) {
      console.log('사용자 인증 안됨');
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }
    
    // 웨딩 정보 추가
    console.log('웨딩 정보 추가 중...');
    const { data: wedding, error: weddingError } = await supabase
      .from('weddings')
      .insert({
        user_id: user.id,
        wedding_date: date || new Date().toISOString(),
        venue: venue || '미정'
      })
      .select();
      
    if (weddingError) {
      console.log('웨딩 추가 오류:', weddingError);
      throw weddingError;
    }
    
    console.log('추가된 웨딩:', wedding);
    
    // 일정 추가 - order_number 추가
    console.log('일정 추가 중...');
    const { data, error } = await supabase
      .from('schedule_items')
      .insert({
        wedding_id: wedding[0].id,
        title,
        description,
        duration: '1시간',  // 기본값
        order_number: order_number || 1  // 기본값 설정
      });
      
    if (error) {
      console.log('일정 추가 오류:', error);
      throw error;
    }
    
    console.log('추가된 일정:', data);
    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error('일정 추가 전체 오류:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 