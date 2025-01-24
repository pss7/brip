import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignInPage from './pages/SignInPage';
import PwFindPage from './pages/PwFindPage';
import SignUpPage from './pages/SignUpPage';
import SearchPage from './pages/SearchPage';
import RoadMapInfoPage from './pages/RoadMapInfoPage';
import RoadMapDesignPage from './pages/RoadMapDesignPage';
import RoadMapResultPage from './pages/RoadMapResultPage';
import EmploymentPage from './pages/EmploymentPage';
import EmploymentDetailPage from './pages/EmploymentDetailPage';
import NoticePage from './pages/NoticePage';
import NoticeDetailPage from './pages/NoticeDetailPage';
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import PolicyPage from './pages/PolicyPage';
import PrivateRoute from './pages/PrivateRoute';
import InquiryPage from './pages/InquiryPage';
import CommunityPage from './pages/CommunityPage';
import MyPage from './pages/MyPage';
import ChatRoomDetailPage from './pages/ChatRoomDetailPage';
import QADetailPage from './pages/QADetailPage';
import CareerPage from './pages/CareerPage';
import CareerDetailPage from './pages/CareerDetailPage';
import InterestPage from './pages/InterestPage';
import UserProvider from './context/UserProvider';
import ResumePage from './pages/resumePage';

function App() {

  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path='/' element={<Home />} />

            {/* 검색페이지 */}
            <Route path='/search' element={<SearchPage />} />

            {/* 로그인, 비밀번호 찾기, 회원가입 */}
            <Route path='/signin' element={<SignInPage />} />
            <Route path='/passwordfind' element={<PwFindPage />} />
            <Route path='/signup' element={<SignUpPage />} />

            {/* 채용 */}
            <Route path='/employment' element={<EmploymentPage />} />
            <Route path='/employmentdetail' element={<EmploymentDetailPage />} />

            {/* 고객지원 */}
            <Route path='/notice' element={<NoticePage />} />
            <Route path='/noticedetail/:id' element={<NoticeDetailPage />} />
            <Route path='/faq' element={<FAQPage />} />
            <Route path='/inquiry' element={<InquiryPage />} />
            <Route path='/terms' element={<TermsPage />} />
            <Route path='/policy' element={<PolicyPage />} />

            {/* 커리어 */}
            <Route path="career" element={<CareerPage />} />
            <Route path="careerdetail" element={<CareerDetailPage />} />

            {/* 커뮤니티 */}
            <Route path="/chat/:roomId" element={<ChatRoomDetailPage />} />
            <Route path="/qa/:qaId" element={<QADetailPage />} />

            {/* 로그인 후에만 접근 가능한 페이지 */}
            <Route path="/roadmapinfo" element={
              <PrivateRoute>
                <RoadMapInfoPage />
              </PrivateRoute>
            } />
            <Route path="/roadmapdesign" element={
              <PrivateRoute>
                <RoadMapDesignPage />
              </PrivateRoute>
            } />
            <Route path="/roadmapresult" element={
              <PrivateRoute>
                <RoadMapResultPage />
              </PrivateRoute>
            } />
            <Route path="/mypage" element={
              <PrivateRoute>
                <MyPage />
              </PrivateRoute>
            } />
            <Route path="/interest" element={
              <PrivateRoute>
                <InterestPage />
              </PrivateRoute>
            } />
            <Route path="/community" element={
              <PrivateRoute>
                <CommunityPage />
              </PrivateRoute>
            } />
            <Route path="/resume" element={
              <PrivateRoute>
                <ResumePage />
              </PrivateRoute>
            } />

          </Routes>
        </UserProvider>
      </BrowserRouter>
    </>
  )
}

export default App
