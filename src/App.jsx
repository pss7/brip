import { BrowserRouter, Routes, Route } from 'react-router-dom';

//홈
import Home from './pages/Home';

//검색
import SearchPage from './pages/search/SearchPage';

//로드맵
import RoadMapInfoPage from './pages/roadmap/RoadMapInfoPage';
import RoadMapDesignPage from './pages/roadmap/RoadMapDesignPage';
import RoadMapResultPage from './pages/roadmap/RoadMapResultPage';

//커뮤니티
import CommunityPage from './pages/community/CommunityPage';
import CommunityDetailPage from './pages/community/CommunityDetailPage';
import ChatRoomDetailPage from './pages/community/ChatRoomDetailPage';

//채용
import EmploymentPage from './pages/job/EmploymentPage';
import EmploymentDetailPage from './pages/job/EmploymentDetailPage';

//인증
import SignInPage from './pages/auth/SignInPage';
import PasswordFindPage from './pages/auth/PasswordFindPage';
import PasswordResetPage from './pages/auth/PasswordResetPage';
import SignUpPage from './pages/auth/SignUpPage';

//커리어
import CareerPage from './pages/career/CareerPage';
import CareerDetailPage from './pages//career/CareerDetailPage';
import CareerExplorationPage from './pages/career/CareerExplorationPage';
import CareerExplorationDetailPage from './pages/career/CareerExplorationDetailPage';

//고객지원
import InquiryPage from './pages/support/InquiryPage';
import InquiryRegisterPage from './pages/support/InquiryRegisterPage';
import InquiryDetailPage from './pages/support/InquiryDetailPage';
import NoticePage from './pages/support/NoticePage';
import NoticeDetailPage from './pages/support/NoticeDetailPage';
import PolicyPage from './pages/support/PolicyPage';
import TermsPage from './pages/support/TermsPage';
import FAQPage from './pages/support/FAQPage';

//유저
import MyPage from './pages/user/MyPage';
import ActivityPage from './pages/user/ActivityPage';
import InterestPage from './pages/user/InterestPage';
import ApplyPage from './pages/user/ApplyPage';
import ResumePage from './pages/user/ResumePage';
import ResumeRegpage from './pages/user/ResumeRegpage';
import ResumeUpdatepage from './pages/user/ResumeUpdatepage';
import NotificationDetail from './pages/user/NotificationDetail';
import Loading from './components/Loading';
import { useEffect, useState } from 'react';

function App() {

  //로딩 상태 관리
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* 홈 */}
        <Route path='/' element={<Home />} />

        {/* 검색 */}
        <Route path='/search' element={<SearchPage />} />

        {/* 인증 */}
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/password-find' element={<PasswordFindPage />} />
        <Route path='/password-reset' element={<PasswordResetPage />} />
        <Route path='/signup' element={<SignUpPage />} />

        {/* 커뮤니티 */}
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community-detail/:community_Id" element={<CommunityDetailPage />} />
        <Route path="/chat/:roomId" element={<ChatRoomDetailPage />} />

        {/* 커리어 */}
        <Route path="/career" element={<CareerPage />} />
        <Route path="/career-detail/:career_Id" element={<CareerDetailPage />} />
        <Route path="careerexploration" element={<CareerExplorationPage />} />
        <Route path="careerexplorationdetail" element={<CareerExplorationDetailPage />} />

        {/* 공고 */}
        <Route path='/employment' element={<EmploymentPage />} />
        <Route path='/employment-detail/:employment_Id' element={<EmploymentDetailPage />} />

        {/* 로드맵 */}
        <Route path="/roadmap-info" element={<RoadMapInfoPage />} />
        <Route path="/roadmap-design" element={<RoadMapDesignPage />} />
        <Route path="/roadmap-result" element={<RoadMapResultPage />} />

        {/* 유저 */}
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/resume-registration" element={<ResumeRegpage />} />
        <Route path="/resume-update/:resumeup_id" element={<ResumeUpdatepage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path='/noticedetail/:id' element={<NoticeDetailPage />} />
        <Route path='/faq' element={<FAQPage />} />
        <Route path='/inquiry' element={<InquiryPage />} />
        <Route path='/inquiry-registration' element={<InquiryRegisterPage />} />
        <Route path='/inquiry-detail/:id' element={<InquiryDetailPage />} />
        <Route path='/terms' element={<TermsPage />} />
        <Route path='/policy' element={<PolicyPage />} />
        <Route path="/interest" element={<InterestPage />} />

        {/* 알림 */}
        <Route path="/notification/:notificationId" component={<NotificationDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
