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
import MyPage from './pages/MyPage';
import InquiryPage from './pages/InquiryPage';


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/passwordfind' element={<PwFindPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/roadmapinfo' element={<RoadMapInfoPage />} />
          <Route path='/roadmapdesign' element={<RoadMapDesignPage />} />
          <Route path='/roadmapresult' element={<RoadMapResultPage />} />
          <Route path='/employment' element={<EmploymentPage />} />
          <Route path='/employmentdetail' element={<EmploymentDetailPage />} />
          <Route path='/notice' element={<NoticePage />} />
          <Route path='/noticedetail/:id' element={<NoticeDetailPage />} />
          <Route path='/faq' element={<FAQPage />} />
          <Route path='/terms' element={<TermsPage />} />
          <Route path='/policy' element={<PolicyPage />} />
          <Route path='/inquiry' element={<InquiryPage />} />
          {/* 로그인 후에만 접근 가능한 페이지 */}
          <Route
            path="/mypage"
            element={
              <PrivateRoute>
                <MyPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
