'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        // 로그인
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        router.push('/schedule');
      } else {
        // 회원가입
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        // 회원가입 후 로그인 모드로 전환
        setIsLogin(true);
        setEmail('');
        setPassword('');
        alert('회원가입이 완료되었습니다. 이메일 인증 후 로그인해주세요.');
      }
    } catch (err) {
      console.error('인증 에러:', err);
      setError(err.message || '로그인/회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 카카오 로그인
  const handleKakaoLogin = async () => {
    console.log("카카오 로그인 시도");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      console.log("리디렉션 URL:", `${window.location.origin}/auth/callback`);
      
      if (error) {
        console.error('카카오 로그인 오류 (자세히):', error);
        throw error;
      }
    } catch (err) {
      console.error('카카오 로그인 오류:', err);
      alert('카카오 로그인 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <h2>{isLogin ? '로그인' : '회원가입'}</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
        </button>
      </form>
      
      <button 
        onClick={handleKakaoLogin} 
        className="kakao-login-btn"
        disabled={loading}
      >
        {loading ? '처리 중...' : '카카오톡으로 로그인하기'}
      </button>
      
      <p className="auth-toggle">
        {isLogin ? '계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="toggle-button"
          type="button"
        >
          {isLogin ? '회원가입' : '로그인'}
        </button>
      </p>
      
      <Link href="/" className="home-link">
        홈으로 돌아가기
      </Link>
    </div>
  );
} 