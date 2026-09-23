import { useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Check, CreditCard } from 'lucide-react';
import CheckoutSection from '../../components/reservation/CheckoutSection';
import {
  Agreement,
  ChoiceGroup,
  Field,
  InfoTable,
} from '../../components/reservation/CheckoutFields';
import { paths } from '../../common/router/routePaths';
import { useAuthStore } from '../../store/useAuthStore';
import { useReservationStore } from '../../store/useReservationStore';
import './ReservationCheckout.css';

const paymentMethods = [
  { id: 'domestic-card', label: '신용카드(국내 발급)' },
  { id: 'overseas-card', label: '신용카드(해외 발급)' },
  { id: 'naver-pay', label: 'N Pay · 네이버페이' },
  { id: 'kakao-pay', label: 'pay · 카카오페이' },
  { id: 'toss-pay', label: 'toss · 토스페이' },
];

export default function ReservationCheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const addReservation = useReservationStore((state) => state.addReservation);
  const draft = location.state?.reservation;
  const [visitor, setVisitor] = useState({ name: user?.name || '', email: user?.email || '', phone: '', birth: '' });
  const [participant, setParticipant] = useState({ name: user?.name || '', birth: '', gender: '', experience: '' });
  const [sameAsUser, setSameAsUser] = useState(true);
  const [payment, setPayment] = useState('domestic-card');
  const [agreements, setAgreements] = useState({ program: false, privacy: false, refund: false });
  const allAgreed = Object.values(agreements).every(Boolean);
  const canPay = useMemo(() => visitor.name && visitor.email && visitor.phone && visitor.birth && participant.name && participant.birth && participant.gender && participant.experience && allAgreed, [visitor, participant, allAgreed]);

  if (!draft) return <Navigate to={paths.reservations} replace />;

  const changeVisitor = (key, value) => {
    const next = { ...visitor, [key]: value };
    setVisitor(next);
    if (sameAsUser && (key === 'name' || key === 'birth')) setParticipant((current) => ({ ...current, [key]: value }));
  };
  const toggleSame = () => {
    const next = !sameAsUser;
    setSameAsUser(next);
    if (next) setParticipant((current) => ({ ...current, name: visitor.name, birth: visitor.birth }));
  };
  const confirmPayment = () => {
    if (!canPay) return;
    addReservation({ ...draft.payload, price: draft.price, userId: user.id, visitor, participant, payment });
    navigate(paths.myReservations, { replace: true });
  };

  return <main className="checkout-page">
    <div className="checkout-page__inner">
      <p className="checkout-page__eyebrow">RESERVATION</p>
      <h1>예약 확인 및 결제</h1>
      <div className="checkout-layout">
        <div className="checkout-main">
          <CheckoutSection title="예약자 정보">
            <InfoTable rows={[["성명", user.name], ["이메일", user.email], ["회원 등급", user.grade || 'MEMBER']]} />
          </CheckoutSection>

          <CheckoutSection title="인솔자 정보" required>
            <label className="checkout-same"><input type="checkbox" checked={sameAsUser} onChange={toggleSame} /><span><Check size={14} /> 예약자 정보와 동일</span></label>
            <div className="checkout-fields">
              <Field label="성명" value={visitor.name} onChange={(value) => changeVisitor('name', value)} />
              <Field label="이메일" type="email" value={visitor.email} onChange={(value) => changeVisitor('email', value)} />
              <Field label="휴대폰 번호" type="tel" placeholder="010-0000-0000" value={visitor.phone} onChange={(value) => changeVisitor('phone', value)} />
              <Field label="생년월일" type="date" value={visitor.birth} onChange={(value) => changeVisitor('birth', value)} />
            </div>
          </CheckoutSection>

          <CheckoutSection title="이용자 정보" required>
            <div className="checkout-fields">
              <Field label="성명" value={participant.name} onChange={(value) => setParticipant({ ...participant, name: value })} />
              <Field label="생년월일" type="date" value={participant.birth} onChange={(value) => setParticipant({ ...participant, birth: value })} />
            </div>
            <ChoiceGroup label="성별" value={participant.gender} options={['남아', '여아']} onChange={(gender) => setParticipant({ ...participant, gender })} />
            <ChoiceGroup label="체험 유무" value={participant.experience} options={['체험 이력 있음', '체험 이력 없음']} onChange={(experience) => setParticipant({ ...participant, experience })} />
          </CheckoutSection>

          <CheckoutSection title="프로그램 유의 사항 확인 및 동의">
            <Agreement checked={agreements.program} onChange={(program) => setAgreements({ ...agreements, program })}>프로그램 유의사항 동의 (필수)</Agreement>
            <Agreement checked={agreements.refund} onChange={(refund) => setAgreements({ ...agreements, refund })}>취소 및 환불 규정 동의 (필수)</Agreement>
          </CheckoutSection>

          <CheckoutSection title="결제">
            <div className="checkout-coupon"><span>쿠폰 할인 금액</span><strong>0원</strong><button type="button">등록/적용</button></div>
            <h3 className="checkout-subtitle">결제 수단</h3>
            <div className="payment-methods">{paymentMethods.map((method) => <button key={method.id} type="button" className={payment === method.id ? 'is-selected' : ''} onClick={() => setPayment(method.id)}><CreditCard size={18} />{method.label}</button>)}</div>
          </CheckoutSection>
        </div>

        <aside className="checkout-summary">
          <div className="checkout-summary__block"><div className="checkout-summary__heading"><h2>예약 정보</h2><button type="button" onClick={() => navigate(-1)}>변경하기</button></div><InfoTable rows={[["체험 프로그램", draft.programName], ["체험 대상", draft.targetName], ["체험 일자", draft.date.replaceAll('-', '.')], ["체험 시간", draft.time], ["체험 인원", `${draft.guests}명`]]} /></div>
          <div className="checkout-summary__block"><h2>결제 금액</h2><InfoTable rows={[["프로그램 이용료", `${draft.price.toLocaleString()}원`], ["쿠폰 할인 금액", '0원'], ["할인 합계", '0원']]} /><div className="checkout-total"><span>결제 예정 금액</span><strong>{draft.price.toLocaleString()}원</strong></div></div>
          <Agreement checked={agreements.privacy} onChange={(privacy) => setAgreements({ ...agreements, privacy })}>개인정보 수집 및 이용 동의 (필수)</Agreement>
          <button className="checkout-pay" type="button" disabled={!canPay} onClick={confirmPayment}>{draft.price.toLocaleString()}원 결제하기</button>
        </aside>
      </div>
    </div>
  </main>;
}
