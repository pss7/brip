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


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/search' element={<SearchPage />} />

        {/* 인증 */}
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/password-find' element={<PasswordFindPage />} />
        <Route path='/password-reset' element={<PasswordResetPage />} />
        <Route path='/signup' element={<SignUpPage />} />

        {/* 커뮤니티 */}
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community-detail/:community_Id" element={<CommunityDetailPage />} />




        <Route path='/employment' element={<EmploymentPage />} />
        <Route path='/employmentdetail' element={<EmploymentDetailPage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path='/noticedetail/:id' element={<NoticeDetailPage />} />
        <Route path='/faq' element={<FAQPage />} />
        <Route path='/inquiry' element={<InquiryPage />} />
        <Route path='/inquiryreg' element={<InquiryRegisterPage />} />
        <Route path='/inquirydetail/:id' element={<InquiryDetailPage />} />
        <Route path='/terms' element={<TermsPage />} />
        <Route path='/policy' element={<PolicyPage />} />
        <Route path="career" element={<CareerPage />} />
        <Route path="careerdetail" element={<CareerDetailPage />} />
        <Route path="careerexploration" element={<CareerExplorationPage />} />
        <Route path="careerexplorationdetail" element={<CareerExplorationDetailPage />} />
        <Route path="/chat/:roomId" element={<ChatRoomDetailPage />} />











        <Route path="/roadmapinfo" element={<RoadMapInfoPage />} />
        <Route path="/roadmapdesign" element={<RoadMapDesignPage />} />
        <Route path="/roadmapresult" element={<RoadMapResultPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/interest" element={<InterestPage />} />

        <Route path="/resume" element={<ResumePage />} />
        <Route path="/resumereg" element={<ResumeRegpage />} />
        <Route path="/resumeupdate/:id" element={<ResumeUpdatepage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/notification/:notificationId" component={<NotificationDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
