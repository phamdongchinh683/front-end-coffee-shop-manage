import PropTypes from 'prop-types';
import './InfoInput.css';
function InfoInput(
  {
    type,
    onChange,
    value,
    label,
    onClick,
    name,
    placeholder
  }
) {
  return (
    <div className="info-input-container">
      <label className="info-input-label">{label}</label>
      <input
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        onClick={onClick}
        name={name}
        className="info-input-field"
      />
    </div>
  );
}

InfoInput.propTypes = {
  type: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  name: PropTypes.string,
}
export default InfoInput;