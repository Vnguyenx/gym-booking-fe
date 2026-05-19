// src/router/AppRouter.tsx
//
// Router chính của app.
// Điểm quan trọng về redirect sau login:
//
//   - Trang /login: nếu đã đăng nhập → redirect về dashboard đúng role
//     (không phải về "/" rồi tự tìm)
//
//   - ProtectedRoute: nếu chưa đăng nhập → redirect về /login,
//     kèm state.from để sau khi login quay lại đúng trang.

import React                              from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES }                         from '../constants/routes';
import useAuth                            from '../hooks/useAuth';
import ProtectedRoute                     from '../pages/auth/ProtectedRoute';
import { getRoleHomePath }                from '../hooks/useRoleRedirect';

// Public pages
import HomePage            from '../pages/public/HomePage';
import LoginPage           from '../pages/auth/LoginPage';
import RegisterPage        from '../pages/auth/RegisterPage';
import ForgotPasswordPage  from '../pages/auth/ForgotPasswordPage';
import AboutDetailPage     from '../pages/public/AboutDetail';
import EquipmentPage       from '../pages/public/EquipmentPage';
import PTPage              from '../pages/public/PTPage';
import PTDetailPage        from '../pages/public/PTDetailPage';
import PTRegisterPage      from '../pages/public/PTRegisterPage';
import PricingPage         from '../pages/public/PricingPage';
import EquipmentDetailPage from '../pages/public/EquipmentDetailPage';

// Customer pages
import BookingPage         from '../pages/customer/BookingPage';
import CustomerProfilePage from '../pages/customer/CustomerProfilePage';
import BookingSuccessPage  from '../pages/customer/BookingSuccessPage';

// Dashboard pages
import PtDashboard    from '../pages/pt/PtDashboard';

// ── Admin pages ───────────────────────────────────────────
import AdminDashboard    from '../pages/admin/AdminDashboard';
// import AdminUsersPage    from '../pages/admin/AdminUsersPage';
// import AdminPTsPage      from '../pages/admin/AdminPTsPage';
// import AdminClassesPage  from '../pages/admin/AdminClassesPage';
// import AdminBookingsPage from '../pages/admin/AdminBookingsPage';
// import AdminMembershipsPage from '../pages/admin/AdminMembershipsPage';
// import AdminEquipmentPage   from '../pages/admin/AdminEquipmentPage';
// import AdminContentPage     from '../pages/admin/AdminContentPage';
// import AdminRevenuePage     from '../pages/admin/AdminRevenuePage';
// import AdminSettingsPage    from '../pages/admin/AdminSettingsPage';

// ── Admin Layout ──────────────────────────────────────────
import AdminLayout from '../components/admin/layout/AdminLayout';


const AdminRoute = ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout>
            {children}
        </AdminLayout>
    </ProtectedRoute>
);


const AppRouter = () => {
    const { isLoggedIn, user } = useAuth();

    // Đường dẫn dashboard theo role của user đang đăng nhập
    // Dùng để redirect trang /login khi đã đăng nhập rồi
    const dashboardPath = getRoleHomePath(user?.role);

    return (
        <BrowserRouter>
            <Routes>

                {/* ── Public — ai cũng vào được ──────────────────────── */}
                <Route path={ROUTES.HOME}             element={<HomePage />} />
                <Route path={ROUTES.ABOUT_DETAIL}     element={<AboutDetailPage />} />
                <Route path={ROUTES.EQUIPMENT}        element={<EquipmentPage />} />
                <Route path={ROUTES.EQUIPMENT_DETAIL} element={<EquipmentDetailPage />} />
                <Route path={ROUTES.PT_LIST}          element={<PTPage />} />
                <Route path={ROUTES.PT_DETAIL}        element={<PTDetailPage />} />
                <Route path={ROUTES.PT_REGISTER}      element={<PTRegisterPage />} />
                <Route path={ROUTES.PRICING}          element={<PricingPage />} />
                <Route path={ROUTES.RESET}            element={<ForgotPasswordPage />} />

                {/*
                  ── Auth: /login và /register ─────────────────────────
                  Nếu đã đăng nhập rồi mà gõ tay vào /login:
                    → redirect về đúng dashboard của role, không phải "/"
                */}
                <Route
                    path={ROUTES.LOGIN}
                    element={
                        isLoggedIn
                            ? <Navigate to={dashboardPath} replace />
                            : <LoginPage />
                    }
                />
                <Route
                    path={ROUTES.REGISTER}
                    element={
                        isLoggedIn
                            ? <Navigate to={dashboardPath} replace />
                            : <RegisterPage />
                    }
                />

                {/* ── Customer routes ─────────────────────────────────── */}
                <Route
                    path={ROUTES.BOOKING}
                    element={
                        <ProtectedRoute allowedRoles={['customer']}>
                            <BookingPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.BOOKING_SUCCESS}
                    element={
                        <ProtectedRoute allowedRoles={['customer']}>
                            <BookingSuccessPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.MY_PROFILE}
                    element={
                        <ProtectedRoute allowedRoles={['customer']}>
                            <CustomerProfilePage />
                        </ProtectedRoute>
                    }
                />

                {/* ── PT routes ───────────────────────────────────────── */}
                <Route
                    path={ROUTES.PT_DASHBOARD}
                    element={
                        <ProtectedRoute allowedRoles={['pt']}>
                            <PtDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* ── Admin routes ────────────────────────────────────── */}
                <Route path={ROUTES.ADMIN_DASHBOARD}
                       element={<AdminRoute><AdminDashboard /></AdminRoute>} />

                {/*<Route path={ROUTES.ADMIN_USERS}*/}
                {/*       element={<AdminRoute><AdminUsersPage /></AdminRoute>} />*/}

                {/*<Route path={ROUTES.ADMIN_PTS}*/}
                {/*       element={<AdminRoute><AdminPTsPage /></AdminRoute>} />*/}

                {/*<Route path={ROUTES.ADMIN_CLASSES}*/}
                {/*       element={<AdminRoute><AdminClassesPage /></AdminRoute>} />*/}

                {/*<Route path={ROUTES.ADMIN_BOOKINGS}*/}
                {/*       element={<AdminRoute><AdminBookingsPage /></AdminRoute>} />*/}

                {/*<Route path={ROUTES.ADMIN_MEMBERSHIPS}*/}
                {/*       element={<AdminRoute><AdminMembershipsPage /></AdminRoute>} />*/}

                {/*<Route path={ROUTES.ADMIN_EQUIPMENT}*/}
                {/*       element={<AdminRoute><AdminEquipmentPage /></AdminRoute>} />*/}

                {/*<Route path={ROUTES.ADMIN_CONTENT}*/}
                {/*       element={<AdminRoute><AdminContentPage /></AdminRoute>} />*/}

                {/*<Route path={ROUTES.ADMIN_REVENUE}*/}
                {/*       element={<AdminRoute><AdminRevenuePage /></AdminRoute>} />*/}

                {/*<Route path={ROUTES.ADMIN_SETTINGS}*/}
                {/*       element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />*/}


                {/* ── Fallback ────────────────────────────────────────── */}
                <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;