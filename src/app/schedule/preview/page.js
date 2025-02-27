'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSchedules } from '../../../lib/api';
import { supabase } from '../../../lib/supabase';

export default function SchedulePreview() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  
  const router = useRouter();
  
  useEffect(() => {
    // 사용자 세션 확인
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data && data.session) {
        setUser(data.session.user);
        fetchSchedules(data.session.user.id);
      } else {
        router.push('/login');
      }
      
      setLoading(false);
    };
    
    checkUser();
  }, [router]);
  
  const fetchSchedules = async (userId) => {
    try {
      const data = await getSchedules(userId);
      setSchedules(data);
    } catch (err) {
      setError('일정을 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // 날짜별로 그룹화
  const groupedSchedules = schedules.reduce((groups, schedule) => {
    const date = schedule.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(schedule);
    return groups;
  }, {});
  
  // 날짜순 정렬
  const sortedDates = Object.keys(groupedSchedules).sort();
  
  return (
    <div className="preview-container">
      <div className="back-link">
        <Link href="/schedule">← 일정 관리로 돌아가기</Link>
      </div>
      
      <h2>일정 미리보기</h2>
      
      {error && <p className="error">{error}</p>}
      
      {loading ? (
        <div className="loading">일정을 불러오는 중...</div>
      ) : schedules.length === 0 ? (
        <div className="no-schedules">
          <p>등록된 일정이 없습니다.</p>
          <Link href="/schedule" className="add-link">일정 추가하러 가기</Link>
        </div>
      ) : (
        <div className="timeline">
          {sortedDates.map(date => (
            <div key={date} className="timeline-item">
              <div className="timeline-date">
                {new Date(date).toLocaleDateString()}
              </div>
              
              <div className="timeline-content">
                {groupedSchedules[date].map(schedule => (
                  <div 
                    key={schedule.id} 
                    className={`timeline-event ${schedule.completed ? 'completed' : ''}`}
                  >
                    <h3>{schedule.title}</h3>
                    {schedule.description && (
                      <p>{schedule.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="print-section">
        <button onClick={() => window.print()} className="print-button">
          인쇄하기
        </button>
      </div>
    </div>
  );
} 