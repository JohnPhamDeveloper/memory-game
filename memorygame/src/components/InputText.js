// import React from 'react';
// import PropTypes from 'prop-types';

// const InputText = ({ ref, inputFor, value, onChange }) => {
//   const inputForToLower = inputFor.toLowerCase();
//   const classNameSplit = inputFor.split(' ');
//   const classNameJoin = classNameSplit.join('');

//   return (
//     <input
//       className={`${classNameJoin}-input`}
//       type="text"
//       name={`${classNameJoin}-input`}
//       value={value}
//       placeholder={inputFor}
//       onChange={onChange}
//       ref={ref}
//     />
//   );
// };

// InputText.propTypes = {
//   inputFor: PropTypes.string,
//   value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   onChange: PropTypes.func,
//   ref: PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
//   ]),
// };

// InputText.defaultProps = {
//   inputFor: 'NULL',
//   value: '',
//   onChange: () => {},
//   ref: () => {},
// };

// export default InputText;
