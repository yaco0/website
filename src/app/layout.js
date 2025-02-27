import AuthProviderWrapper from '../components/AuthProviderWrapper';
import './globals.css';

export const metadata = {
  title: '웨딩 플래너',
  description: '웨딩 일정 관리 애플리케이션',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <AuthProviderWrapper>
          <div className="container">
            <header>
              <h1>웨딩 플래너</h1>
            </header>
            <main>{children}</main>
            <footer>
              <p>© 2025 웨딩 플래너</p>
            </footer>
          </div>
        </AuthProviderWrapper>
      </body>
    </html>
  );
} 