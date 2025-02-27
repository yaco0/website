'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSchedules, addSchedule, updateSchedule, deleteSchedule } from '../../lib/api';
import { supabase } from '../../lib/supabase';

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    completed: false,
  });
  const [editId, setEditId] = useState(null);
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
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
          fetchSchedules(session.user.id);
        } else {
          router.push('/login');
        }
      }
    );
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
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
  
  // 나머지 함수들은 그대로 유지...
  const handleAddSchedule = async () => {
    if (!formData.title || !formData.date) {
      setError('제목과 날짜는 필수 입력 항목입니다.');
      return;
    }
    
    try {
      const newSchedule = {
        ...formData,
        user_id: user.id,
      };
      
      const addedSchedule = await addSchedule(newSchedule);
      setSchedules([...schedules, addedSchedule]);
      resetForm();
    } catch (err) {
      setError('일정 추가 중 오류가 발생했습니다.');
      console.error(err);
    }
  };
  
  const handleUpdateSchedule = async () => {
    if (!formData.title || !formData.date) {
      setError('제목과 날짜는 필수 입력 항목입니다.');
      return;
    }
    
    try {
      const updatedSchedule = await updateSchedule(editId, formData);
      setSchedules(schedules.map(schedule => 
        schedule.id === editId ? updatedSchedule : schedule
      ));
      resetForm();
    } catch (err) {
      setError('일정 수정 중 오류가 발생했습니다.');
      console.error(err);
    }
  };
  
  const handleDelete = async (id) => {
    if (confirm('정말로 이 일정을 삭제하시겠습니까?')) {
      try {
        await deleteSchedule(id);
        setSchedules(schedules.filter(schedule => schedule.id !== id));
      } catch (err) {
        setError('일정 삭제 중 오류가 발생했습니다.');
        console.error(err);
      }
    }
  };
  
  const handleEdit = (schedule) => {
    setFormData({
      title: schedule.title,
      description: schedule.description || '',
      date: schedule.date,
      completed: schedule.completed,
    });
    setEditId(schedule.id);
    setShowForm(true);
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      completed: false,
    });
    setEditId(null);
    setShowForm(false);
    setError('');
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      handleUpdateSchedule();
    } else {
      handleAddSchedule();
    }
  };
  
  return (
    <div className="schedule-container">
      <div className="actions">
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="add-button"
        >
          {showForm ? '취소' : '새 일정 추가'}
        </button>
        
        <Link href="/schedule/preview" className="preview-link">
          일정 미리보기
        </Link>
      </div>
      
      {error && <p className="error">{error}</p>}
      
      {showForm && (
        <form className="schedule-form" onSubmit={handleSubmit}>
          <h3>{editId ? '일정 수정' : '새 일정 추가'}</h3>
          
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date">날짜</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">설명 (선택사항)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
            />
            <label htmlFor="completed">완료됨</label>
          </div>
          
          <div className="form-buttons">
            <button type="submit">
              {editId ? '일정 수정' : '일정 추가'}
            </button>
            <button type="button" onClick={resetForm}>
              취소
            </button>
          </div>
        </form>
      )}
      
      {loading ? (
        <div className="loading">일정을 불러오는 중...</div>
      ) : schedules.length === 0 ? (
        <div className="no-schedules">등록된 일정이 없습니다.</div>
      ) : (
        <div className="schedules-list">
          {schedules.map(schedule => (
            <div 
              key={schedule.id} 
              className={`schedule-item ${schedule.completed ? 'completed' : ''}`}
            >
              <div className="schedule-content">
                <h3>{schedule.title}</h3>
                <p className="date">{new Date(schedule.date).toLocaleDateString()}</p>
                {schedule.description && <p className="description">{schedule.description}</p>}
              </div>
              
              <div className="schedule-actions">
                <button onClick={() => handleEdit(schedule)} className="edit-button">
                  편집
                </button>
                <button onClick={() => handleDelete(schedule.id)} className="delete-button">
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 