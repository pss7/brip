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
import { useEffect, useState } from 'react';
import ChatRoomDetailPage from './pages/ChatRoomDetailPage';
import QADetailPage from './pages/QADetailPage';
import CareerPage from './pages/CareerPage';


function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/passwordfind' element={<PwFindPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/employment' element={<EmploymentPage />} />
          <Route path='/employmentdetail' element={<EmploymentDetailPage />} />
          <Route path='/notice' element={<NoticePage />} />
          <Route path='/noticedetail/:id' element={<NoticeDetailPage />} />
          <Route path='/faq' element={<FAQPage />} />
          <Route path='/terms' element={<TermsPage />} />
          <Route path='/policy' element={<PolicyPage />} />
          <Route path='/inquiry' element={<InquiryPage />} />
          <Route path="/chat/:roomId" element={<ChatRoomDetailPage user={user} />} />
          <Route path="/qa/:qaId" element={<QADetailPage user={user} />} />
          <Route path="career" element={<CareerPage/>} />
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
          <Route path="/community" element={
            <PrivateRoute>
              <CommunityPage user={user} />
            </PrivateRoute>
          } />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
