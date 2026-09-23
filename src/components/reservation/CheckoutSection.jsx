import './CheckoutSection.css';

export default function CheckoutSection({ title, required = false, children }) {
  return (
    <section className="checkout-section">
      <div className="checkout-section__title">
        <h2>{title}</h2>
        {required && <span>* 항목은 필수 입력 항목입니다.</span>}
      </div>
      {children}
    </section>
  );
}
