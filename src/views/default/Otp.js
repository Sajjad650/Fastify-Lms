import React, { useState } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import { post } from '../../api/axios'; // Custom axios wrapper
import endpoints from '../../api/endpoints'; // Endpoint containing OTP URL

const OtpVerification = () => {
  const title = 'OTP Verification';
  const description = 'Enter OTP to proceed';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useHistory();

  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .length(6, 'OTP must be exactly 6 digits')
      .matches(/^\d{6}$/, 'OTP must be only digits')
      .required('OTP is required'),
  });

  const initialValues = { otp: Array(6).fill('') }; // 6 empty strings for 6 OTP digits

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const otp = values.otp.join(''); // Join the OTP array into a single string
      const response = await post(endpoints.verifyOtp, { otp });
      if (response?.data?.success) {
        setSuccessMessage('OTP verified successfully. Redirecting...');
        setTimeout(() => navigate('/'), 1500); // Navigate to the dashboard after a short delay
      } else {
        setApiError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setApiError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  const handleOtpChange = (e, index) => {
    const newOtp = [...values.otp];
    newOtp[index] = e.target.value;
    formik.setFieldValue('otp', newOtp); // Update the OTP array
  };

  // Handle paste event to fill all OTP fields if 6 digits are pasted
  const handlePaste = (e) => {
    const pastedValue = e.clipboardData.getData('Text');
    if (/^\d{6}$/.test(pastedValue)) {
      formik.setFieldValue('otp', pastedValue.split('')); // Split and update OTP fields with the 6 digits
    }
  };

  const leftSide = (
    <div className="min-h-100 d-flex align-items-center">
      <div className="w-100 w-lg-75 w-xxl-50">
        <div>
          <div className="mb-5">
            <h1 className="display-3 text-white">Multiple Niches</h1>
            <h1 className="display-3 text-white">Ready for Your Project</h1>
          </div>
          <p className="h6 text-white lh-1-5 mb-5">
            Dynamically target high-payoff intellectual capital for customized technologies. Objectively integrate emerging core competencies before
            process-centric communities...
          </p>
          <div className="mb-5">
            <Button size="lg" variant="outline-white" href="/">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const rightSide = (
    <div className="sw-lg-70 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
      <div className="sw-lg-50 px-5">
        <div className="sh-11">
          <NavLink to="/">
            <div className="logo-default" />
          </NavLink>
        </div>
        <div className="mb-5">
          <h2 className="cta-1 mb-0 text-primary">Enter your OTP</h2>
          <h2 className="cta-1 text-primary">to continue!</h2>
        </div>
        <form id="otpForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between mb-3">
            {Array(6)
              .fill('')
              .map((_, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  name={`otp[${index}]`}
                  maxLength="1"
                  value={values.otp[index]}
                  onChange={(e) => handleOtpChange(e, index)}
                  onPaste={handlePaste} // Attach paste handler
                  className="rounded-circle otp-input"
                  style={{
                    width: '50px',
                    height: '50px',
                    textAlign: 'center',
                    fontSize: '20px',
                    marginRight: '10px',
                  }}
                />
              ))}
          </div>
          {errors.otp && touched.otp && <div className="d-block invalid-tooltip">{errors.otp}</div>}
          <Button size="lg" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>
        {successMessage && <p className="text-success">{successMessage}</p>}
        {apiError && <p className="text-danger">{apiError}</p>}
      </div>
    </div>
  );

  return (
    <>
      <HtmlHead title={title} description={description} />
      <LayoutFullpage left={leftSide} right={rightSide} />
    </>
  );
};

export default OtpVerification;
