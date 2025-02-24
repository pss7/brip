import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';

import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import RoadMapInfoPage from './pages/RoadMapInfoPage';
import RoadMapDesignPage from './pages/RoadMapDesignPage';
import RoadMapResultPage from './pages/RoadMapResultPage';
import EmploymentPage from './pages/EmploymentPage';
import EmploymentDetailPage from './pages/EmploymentDetailPage';
import InterestPage from './pages/InterestPage';
import ResumePage from './pages/ResumePage';
import ApplyPage from './pages/ApplyPage';
import ActivityPage from './pages/ActivityPage';
import ResumeRegpage from './pages/ResumeRegpage';
import ResumeUpdatepage from './pages/ResumeUpdatepage';
import FAQPage from './pages/FAQPage';
import CommunityPage from './pages/CommunityPage';
import ChatRoomDetailPage from './pages/ChatRoomDetailPage';
import QADetailPage from './pages/QADetailPage';

//인증페이지
import SignInPage from './pages/auth/SignInPage';
import PwFindPage from './pages/auth/PwFindPage';
import SignUpPage from './pages/auth/SignUpPage';

//커리어 페이지
import CareerPage from './pages/career/CareerPage';
import CareerDetailPage from './pages//career/CareerDetailPage';
import CareerExplorationPage from './pages/career/CareerExplorationPage';
import CareerExplorationDetailPage from './pages/career/CareerExplorationDetailPage';

//고객지원 페이지
import InquiryPage from './pages/support/InquiryPage';
import InquiryRegisterPage from './pages/support/InquiryRegisterPage';
import InquiryDetailPage from './pages/support/InquiryDetailPage';
import NoticePage from './pages/support/NoticePage';
import NoticeDetailPage from './pages/support/NoticeDetailPage';
import PolicyPage from './pages/support/PolicyPage';
import TermsPage from './pages/support/TermsPage';

//유저페이지
import MyPage from './pages/MyPage';
import NotificationDetail from './pages/NotificationDetail';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/passwordfind' element={<PwFindPage />} />
        <Route path='/signup' element={<SignUpPage />} />
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
        <Route path="/qa/:qaId" element={<QADetailPage />} />
        <Route path="/roadmapinfo" element={<RoadMapInfoPage />} />
        <Route path="/roadmapdesign" element={<RoadMapDesignPage />} />
        <Route path="/roadmapresult" element={<RoadMapResultPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/interest" element={<InterestPage />} />
        <Route path="/community" element={<CommunityPage />} />
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
