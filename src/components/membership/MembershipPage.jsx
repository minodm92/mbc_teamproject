import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageShell from '../../common/layout/PageShell';
import { paths } from '../../common/router/routePaths';
import './MembershipPage.css';

export default function MembershipPage() {
  return (
    <PageShell
      eyebrow="MEMBERSHIP"
      title="경험을 더 가까이"
      intro="현대 모터스튜디오 멤버십과 함께 새로운 소식을 만나보세요."
    >
      <section className="membership-card">
        <h2>HYUNDAI MOTORSTUDIO MEMBERSHIP</h2>
        <p>회원 계정으로 예약 내역을 관리하고 프로그램 정보를 확인할 수 있습니다.</p>
        <Link className="membership-card__link" to={paths.signup}>
          가입하기 <ArrowUpRight size={18} />
        </Link>
      </section>
    </PageShell>
  );
}
