import PropTypes from 'prop-types';
import './ReportCard.css';

export default function ReportCard({ value, title }) {
 return (
  <div className="report-card">
   <div className="report-card__title">{title} ngon</div>
   <div className="report-card__value">
    {value}
   </div>
  </div>
 );
}

ReportCard.propTypes = {
 title: PropTypes.string.isRequired,
 value: PropTypes.number.isRequired
};