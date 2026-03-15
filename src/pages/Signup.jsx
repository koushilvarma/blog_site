import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import styles from './Auth.module.css';

// Password Strength Utility
const evaluatePasswordStrength = (password) => {
  if (!password) return { label: '', color: 'transparent', width: '0%' };
  let score = 0;
  if (password.length > 7) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score < 2) return { label: 'Weak', color: 'var(--error)', width: '33%' };
  if (score < 4) return { label: 'Fair', color: 'var(--accent-primary)', width: '66%' };
  return { label: 'Strong', color: 'var(--success)', width: '100%' };
};

export const Signup = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onChange' });
  const { signup } = useAuth();
  const { posts } = usePosts();
  const addToast = useToast();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [isSimulatingAuth, setIsSimulatingAuth] = useState(false);
  const [successMode, setSuccessMode] = useState(false);
  const [userName, setUserName] = useState('');

  // Extract a random quote and images from seed posts for the left panel
  const seedQuote = posts.length > 0 
  ? posts.find(p => p.authorName === 'Dr. Clara Hue')?.excerpt || "Read. Write. Inspire."
  : "Read. Write. Inspire.";
  const quoteAuthor = posts.length > 0 ? "Dr. Clara Hue" : "Inkwell";
  const seedImages = posts.filter(p => p.coverImage).slice(0, 3).map(p => p.coverImage);

  // Watch fields for real-time validation
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const strengthMeter = evaluatePasswordStrength(password);
  
  const isMatch = Boolean(password && confirmPassword && password === confirmPassword);

  const onSubmit = (data) => {
    setSignupError('');
    setIsSimulatingAuth(true);

    setTimeout(() => {
      const res = signup(data.name, data.email, data.password);
      setIsSimulatingAuth(false);

      if (res.success) {
        setUserName(data.name);
        setSuccessMode(true);
        // Show success overlay for 1.5s then redirect
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setSignupError(res.message || 'An error occurred during signup.');
      }
    }, 800);
  };

  if (successMode) {
    return (
      <div className={styles.successOverlay}>
        <div className={styles.successContent}>
          <CheckCircle size={64} color="var(--success)" className={styles.successIcon} />
          <h2 className={styles.successMessage}>Welcome to Inkwell, {userName}! 🎉</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      
      {/* Left Panel - Branding */}
      <div className={styles.authLeft}>
        <div className={styles.brandLogo}>Inkwell.</div>
        
        <div className={styles.quoteWrapper}>
          <p className={styles.quote}>"{seedQuote}"</p>
          <span className={styles.quoteAuthor}>— {quoteAuthor}</span>
        </div>

        {seedImages.length > 0 && (
          <div className={styles.socialProof}>
            {seedImages.map((img, i) => (
              <div 
                key={i} 
                className={styles.miniCard} 
                style={{ backgroundImage: `url(${img})` }} 
                title="Featured Post"
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Panel - Form */}
      <div className={styles.authRight}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1 className={styles.authTitle}>Join Inkwell</h1>
            <p className={styles.authSubtitle}>Create an account to start writing and engaging.</p>
          </div>
          
          {signupError && (
            <div className={styles.errorBanner}>
              <AlertCircle size={18} />
              {signupError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm} noValidate>
            <Input 
              label="Full Name"
              placeholder="Jane Doe"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />

            <Input 
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address format' }
              })}
            />
            
            <div className={styles.passwordWrapper}>
              <Input 
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />
              <button 
                type="button" 
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              
              {/* Password Strength Meter */}
              {password && (
                <div className={styles.strengthMeterContainer}>
                  <div className={styles.strengthBarBg}>
                    <div 
                      className={styles.strengthBarFill} 
                      style={{ width: strengthMeter.width, backgroundColor: strengthMeter.color }} 
                    />
                  </div>
                  <span className={styles.strengthLabel} style={{ color: strengthMeter.color }}>
                    {strengthMeter.label}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.passwordWrapper}>
              <Input 
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
              />
              {/* Realtime Confirmation Feedback */}
              {confirmPassword && !errors.confirmPassword && (
                <CheckCircle size={16} className={styles.matchIcon} color="var(--success)" />
              )}
            </div>
            
            <Button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={isSimulatingAuth}
            >
              {isSimulatingAuth ? <span className={styles.spinner} /> : 'Create Account'}
            </Button>
          </form>
          
          <div className={styles.authFooter}>
            Already have an account? <Link to="/login" className={styles.authLink}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
