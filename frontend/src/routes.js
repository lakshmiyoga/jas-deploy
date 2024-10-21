const routes = [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/login', priority: 0.5, changefreq: 'monthly' },
    { path: '/register', priority: 0.5, changefreq: 'monthly' },
    { path: '/vegetables', priority: 0.8, changefreq: 'weekly' },
    { path: '/fruits', priority: 0.8, changefreq: 'weekly' },
    { path: '/unauthorized', priority: 0.5, changefreq: 'monthly' },
    { path: '/keerai', priority: 0.8, changefreq: 'weekly' },
    { path: '/about', priority: 0.5, changefreq: 'monthly' },
    { path: '/enquiry', priority: 0.5, changefreq: 'monthly' },
    { path: '/termsAndConditions', priority: 0.5, changefreq: 'yearly' },
    { path: '/privacyPolicy', priority: 0.5, changefreq: 'yearly' },
    { path: '/refundPolicy', priority: 0.5, changefreq: 'yearly' },
    { path: '/search/:keyword', priority: 0.8, changefreq: 'daily' },
    { path: '/product/:id', priority: 0.8, changefreq: 'weekly' },
    { path: '/cart', priority: 0.7, changefreq: 'daily' },
    { path: '/password/forgot', priority: 0.6, changefreq: 'weekly' },
    { path: '/myProfile', priority: 0.6, changefreq: 'weekly' },
    { path: '/myProfile/update', priority: 0.6, changefreq: 'weekly' },
    { path: '/myProfile/update/password', priority: 0.6, changefreq: 'weekly' },
    { path: '/password/reset/:token', priority: 0.6, changefreq: 'weekly' },
    { path: '/shipping', priority: 0.6, changefreq: 'weekly' },
    { path: '/orders', priority: 0.6, changefreq: 'weekly' },
    { path: '/order/:id', priority: 0.6, changefreq: 'weekly' },
    { path: '/payment/:id', priority: 0.6, changefreq: 'weekly' },
    { path: '/order/confirm', priority: 0.6, changefreq: 'weekly' },
    { path: '/payment/confirm/:id', priority: 0.6, changefreq: 'weekly' },
    { path: '/admin/dashboard', priority: 0.9, changefreq: 'daily' },
    { path: '/admin/products', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/products/create', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/product/:id', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/getenquiry', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/users', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/payments', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/dispatch/:id', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/dispatch', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/refund/:id', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/refund', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/user/:id', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/products/updateprice', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/orders', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/analysis', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/order/:id', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/order-summary', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/user-summary', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/allorders', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin/orderdetail/:id', priority: 0.8, changefreq: 'weekly' },
    { path: '*', priority: 0.1, changefreq: 'monthly' }, // Optional, for 404 page
    { path: '/page-not-found', priority: 0.1, changefreq: 'monthly' },
];

module.exports = routes;