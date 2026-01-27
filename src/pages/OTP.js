import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userService } from '../services/userService';
import { AuthContext } from '../context/AuthContext';
import './OTP.css';

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = React.useContext(AuthContext);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboard.getData('text').slice(0, 6);
    const newOtp = pastedData.split('').slice(0, 6);
    const updatedOtp = [...otp];
    newOtp.forEach((digit, index) => {
      if (index < 6) {
        updatedOtp[index] = digit;
      }
    });
    setOtp(updatedOtp);
    inputRefs.current[Math.min(newOtp.length - 1, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter a valid OTP');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await userService.login({ email, otp: otpString });
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        navigate('/', { replace: true });
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Please enter a valid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (canResend) {
      try {
        setError(null);
        await userService.requestOTP(email);
        setResendTimer(20);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
      } catch (err) {
        setError(err.message || 'Failed to resend OTP');
      }
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-container">
        <div className="otp-left">
          <div className="otp-visual">
            <img
              src="/images/login-visual.png"
              alt="Productr Visual"
              className="visual-image"
            />
          </div>
        </div>

        <div className="otp-right">
          <div className="otp-right-content">
            <h1 className="otp-title">Login to your Productr Account</h1>
            <form onSubmit={handleSubmit} className="otp-form">
              <div className="otp-input-group">
                <label htmlFor="otp" className="otp-label" style={{ color: '#98A2B3' }}>Enter OTP</label>
                <div className="otp-inputs" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`otp-input ${error ? 'otp-input-error' : ''}`}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                {error && <div className="otp-error-message">{error}</div>}
              </div>

              <button
                type="submit"
                className="otp-button"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Enter your OTP'}
              </button>

              <div className="otp-resend">
                <span className="otp-resend-text">
                  Didn't receive OTP?{' '}
                  {canResend ? (
                    <button type="button" onClick={handleResend} className="otp-resend-link">
                      Resend
                    </button>
                  ) : (
                    <span className="otp-resend-timer">Resend in {resendTimer}s</span>
                  )}
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTP;
