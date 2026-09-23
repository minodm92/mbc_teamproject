export const paths = {
  home: '/', motorstudio: '/motorstudio', location: (slug) => `/motorstudio/${slug}`,
  mobility: '/mobility', exhibitions: '/exhibitions', exhibition: (id) => `/exhibitions/${id}`,
  programs: '/programs', program: (id) => `/programs/${id}`, reservations: '/reservations',
  exhibitionReservation: '/reservations/exhibition',
  programReservation: '/reservations/program',
  reservationCheckout: '/reservations/checkout',
  experience: '/experience',
  myReservations: '/reservations/mine', membership: '/membership', notices: '/notices',
  notice: (id) => `/notices/${id}`, newsroom: '/newsroom', login: '/login', signup: '/signup',
  mypage: '/mypage', profile: '/mypage/profile', inquiries: '/inquiries', inquiryWrite: '/inquiries/write',
  inquiry: (id) => `/inquiries/${id}`, inquiryEdit: (id) => `/inquiries/${id}/edit`,
};
