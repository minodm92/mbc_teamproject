import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './common/layout/Header';
import { getHeaderVariant } from './common/router/headerVariant';
import Footer from './common/layout/Footer';
import PageLoader from './common/layout/PageLoader';
import {
    areHomeAssetsPreloaded,
    preloadHomeAssets,
} from './components/home/homePreloader';
import HomePage from './pages/home/HomePage';
import {
    MotorstudioPage,
    LocationPage,
    ExhibitionsPage as ExhibitionPage,
    ExhibitionDetailPage,
    ProgramDetailPage,
    NoticesPage,
    NoticeDetailPage,
    NewsroomPage,
    NewsroomDetailPage,
    NotFoundPage,
} from './pages/content/ContentPages';
import MembershipPage from './pages/membership/MembershipPage';
import VehicleDisplayPage from './pages/mobility/VehicleDisplayPage';
import ProgramPage from './pages/programs/ProgramPage';
import { LoginPage, SignUpPage, ProtectedRoute, KakaoCallbackPage } from './pages/auth/AuthPages';
import {
    ReservationPage as TestDrivePage,
    MyReservationsPage,
} from './pages/mobility/TestDrivePage';
import ExhibitionReservationPage from './pages/reservation/ExhibitionReservationPage';
import ProgramReservationPage from './pages/reservation/ProgramReservationPage';
import ReservationCheckoutPage from './pages/reservation/ReservationCheckoutPage';
import { MyPage, ProfileEditPage } from './pages/mypage/MyPage';
import { InquiryListPage, InquiryFormPage, InquiryDetailPage } from './pages/inquiry/InquiryPages';
import { CollectionPage, ProductDetailPage, CartPage } from './pages/product/ProductPages';
import { BoardListPage, BoardDetailPage, BoardFormPage } from './pages/board/BoardPages';
import ExperienceFinderPage from './pages/experience/ExperienceFinderPage';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

export default function App() {
    const { pathname } = useLocation();
    const [loaderPhase, setLoaderPhase] = useState(() =>
        pathname === '/' && !areHomeAssetsPreloaded() ? 'visible' : null
    );
    const [loaderProgress, setLoaderProgress] = useState(0);
    const standaloneAuth = ['/login', '/signup'].includes(pathname.replace(/\/+$/, ''));
    const headerVariant = getHeaderVariant(pathname);

    useEffect(() => {
        document.documentElement.classList.toggle('is-home-page', pathname === '/');

        return () => {
            document.documentElement.classList.remove('is-home-page');
        };
    }, [pathname]);

    useEffect(() => {
        if (pathname !== '/') {
            setLoaderPhase(null);
            document.body.classList.remove('is-page-loading');
            return undefined;
        }

        if (areHomeAssetsPreloaded()) {
            setLoaderProgress(100);
            setLoaderPhase(null);
            document.body.classList.remove('is-page-loading');
            return undefined;
        }

        setLoaderPhase('visible');
        setLoaderProgress(0);
        document.body.classList.add('is-page-loading');

        const abortController = new AbortController();
        let disposed = false;
        let hideTimer;
        preloadHomeAssets({
            signal: abortController.signal,
            onProgress: (progress) => {
                if (!disposed) setLoaderProgress(progress);
            },
        })
            .then(() => {
                if (disposed) return;
                setLoaderProgress(100);
                setLoaderPhase('leaving');
                hideTimer = window.setTimeout(() => {
                    setLoaderPhase(null);
                    document.body.classList.remove('is-page-loading');
                }, 1500);
            })
            .catch((error) => {
                if (error.name !== 'AbortError') console.error(error);
            });

        return () => {
            disposed = true;
            abortController.abort();
            window.clearTimeout(hideTimer);
            document.body.classList.remove('is-page-loading');
        };
    }, [pathname]);

    const showPage = pathname !== '/' || loaderPhase === 'leaving' || loaderPhase === null;

    return (
        <>
            <PageLoader phase={loaderPhase} progress={loaderProgress} />
            <ScrollToTop />
            {showPage && !standaloneAuth && <Header key={pathname} variant={headerVariant} />}
            {showPage && <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/motorstudio" element={<MotorstudioPage />} />
                <Route path="/motorstudio/:location" element={<LocationPage />} />
                <Route path="/mobility" element={<VehicleDisplayPage />} />
                <Route path="/exhibitions" element={<ExhibitionPage />} />
                <Route path="/exhibitions/:exhibitionId" element={<ExhibitionDetailPage />} />
                <Route path="/programs" element={<ProgramPage />} />
                <Route path="/programs/:programId" element={<ProgramDetailPage />} />
                <Route path="/reservations" element={<TestDrivePage />} />
                <Route path="/reservations/exhibition" element={<ExhibitionReservationPage />} />
                <Route path="/reservations/program" element={<ProgramReservationPage />} />
                <Route
                    path="/reservations/checkout"
                    element={
                        <ProtectedRoute>
                            <ReservationCheckoutPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reservations/mine"
                    element={
                        <ProtectedRoute>
                            <MyReservationsPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/experience" element={<ExperienceFinderPage />} />
                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/notices" element={<NoticesPage />} />
                <Route path="/notices/:noticeId" element={<NoticeDetailPage />} />
                <Route path="/newsroom" element={<NewsroomPage />} />
                <Route path="/newsroom/:articleId" element={<NewsroomDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/auth/kakao/callback" element={<KakaoCallbackPage />} />
                <Route
                    path="/mypage"
                    element={
                        <ProtectedRoute>
                            <MyPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mypage/profile"
                    element={
                        <ProtectedRoute>
                            <ProfileEditPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/inquiries"
                    element={
                        <ProtectedRoute>
                            <InquiryListPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/inquiries/write"
                    element={
                        <ProtectedRoute>
                            <InquiryFormPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/inquiries/:inquiryId/edit"
                    element={
                        <ProtectedRoute>
                            <InquiryFormPage edit />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/inquiries/:inquiryId"
                    element={
                        <ProtectedRoute>
                            <InquiryDetailPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/collections" element={<CollectionPage />} />
                <Route path="/products/:productId" element={<ProductDetailPage />} />
                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <CartPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/board" element={<BoardListPage />} />
                <Route
                    path="/board/write"
                    element={
                        <ProtectedRoute>
                            <BoardFormPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/board/:postId/edit"
                    element={
                        <ProtectedRoute>
                            <BoardFormPage edit />
                        </ProtectedRoute>
                    }
                />
                <Route path="/board/:postId" element={<BoardDetailPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>}
            {showPage && !standaloneAuth && <Footer />}
        </>
    );
}
