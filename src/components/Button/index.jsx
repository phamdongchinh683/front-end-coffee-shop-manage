import PropTypes from 'prop-types';
import './button.css';

function Button({
 onClick,
 children,
 type = 'button',
 variant = 'primary',
 size = 'medium',
 disabled = false,
 className = '',
 ...props
}) {
 const buttonClasses = `button button-${variant} button-${size} ${className}`.trim();

 return (
  <button
   type={type}
   onClick={onClick}
   className={buttonClasses}
   disabled={disabled}
   {...props}
  >
   {children}
  </button>
 );
}

Button.propTypes = {
 onClick: PropTypes.func,
 children: PropTypes.node.isRequired,
 type: PropTypes.oneOf(['button', 'submit', 'reset']),
 variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger']),
 size: PropTypes.oneOf(['small', 'medium', 'large']),
 disabled: PropTypes.bool,
 className: PropTypes.string,
};

export default Button;