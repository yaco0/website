'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 인증되지 않은 사용자는 로그인 페이지로 리디렉션
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // 로딩 중이거나 사용자가 없으면 로딩 표시
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">대시보드</h1>
        <div className="flex items-center gap-4">
          <p className="text-gray-600">{user.email}</p>
          <button 
            onClick={logout}
            className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            로그아웃
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 진행 상황 카드 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">진행 상황</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-pink-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">식순 구성 45% 완료</p>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">기본 정보</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">완료</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">식순 구성</span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">진행 중</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">음악 선택</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">시작 전</span>
            </div>
          </div>
        </div>
        
        {/* 일정 카드 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">주요 일정</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="min-w-[60px] text-sm text-gray-500">D-60</div>
              <div>
                <p className="font-medium">웨딩홀 예약 확정</p>
                <p className="text-sm text-gray-600">2024년 5월 15일까지</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="min-w-[60px] text-sm text-gray-500">D-30</div>
              <div>
                <p className="font-medium">식순 및 음악 최종 확정</p>
                <p className="text-sm text-gray-600">2024년 6월 15일까지</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="min-w-[60px] text-sm text-gray-500">D-7</div>
              <div>
                <p className="font-medium">최종 리허설</p>
                <p className="text-sm text-gray-600">2024년 7월 8일까지</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 버튼 */}
      <div className="mt-8 flex justify-center">
        <Link href="/schedule" className="btn-primary">
          식순 편집하기
        </Link>
      </div>
    </div>
  );
} 