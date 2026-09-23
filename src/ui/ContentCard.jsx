import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import './ContentCard.css';

export default function ContentCard({ image, eyebrow, title, description, to }) {
  return <Link className="content-card" to={to}>
    <div className="content-card__visual"><img src={image} alt="" loading="lazy" width="800" height="520" /></div>
    <div className="content-card__body"><span className="content-card__eyebrow">{eyebrow}</span><ArrowUpRight aria-hidden="true" size={24} /></div>
    <h3>{title}</h3>{description && <p>{description}</p>}
  </Link>;
}
