import Link from 'next/link';

export default function Home(): JSX.Element {
  return (
    <div className="home-container">
      <h2>웨딩 준비를 시작하세요</h2>
      
      <div className="features">
        <div className="feature-card">
          <h3>일정 관리</h3>
          <p>결혼식 준비에 필요한 모든 일정을 관리하세요.</p>
          <Link href="/schedule">일정 관리하기</Link>
        </div>
        
        <div className="feature-card">
          <h3>로그인</h3>
          <p>개인 맞춤 서비스를 이용하려면 로그인하세요.</p>
          <Link href="/login">로그인하기</Link>
        </div>
      </div>
    </div>
  );
}
