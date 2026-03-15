import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import styles from './Auth.module.css';

export const Login = () => {
  const { login } = useAuth();
  const { posts } = usePosts();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSimulatingAuth, setIsSimulatingAuth] = useState(false);

  // Extract a random quote and images from seed posts for the left panel
  const seedQuote = posts.length > 0 
    ? posts.find(p => p.authorName === 'Dr. Clara Hue')?.excerpt || "Read. Write. Inspire."
    : "Read. Write. Inspire.";
  const quoteAuthor = posts.length > 0 ? "Dr. Clara Hue" : "Inkwell";
  const seedImages = posts.filter(p => p.coverImage).slice(0, 3).map(p => p.coverImage);

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onBlur', // Trigger validation on blur
  });

  const onSubmit = async (data) => {
    setLoginError('');
    setIsSimulatingAuth(true);

    // Simulate network delay for 800ms
    setTimeout(() => {
      const success = login(data.email, data.password);
      setIsSimulatingAuth(false);
      
      if (success) {
        navigate('/');
      } else {
        setLoginError('Invalid email or password. Try again.');
      }
    }, 800);
  };

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
            <h1 className={styles.authTitle}>Welcome back</h1>
            <p className={styles.authSubtitle}>Enter your details to access your account.</p>
          </div>
          
          {loginError && (
            <div className={styles.errorBanner}>
              <AlertCircle size={18} />
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm} noValidate>
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address format'
                }
              })}
            />
            
            <div className={styles.passwordWrapper}>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
              />
              <button 
                type="button" 
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <Button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={isSimulatingAuth}
            >
              {isSimulatingAuth ? <span className={styles.spinner} /> : 'Sign In'}
            </Button>
          </form>
          
          <div className={styles.authFooter}>
            Don't have an account? <Link to="/signup" className={styles.authLink}>Sign up</Link>
          </div>
        </div>
      </div>

    </div>
  );
};
