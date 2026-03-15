import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import styles from './Auth.module.css';

export const Signup = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const password = watch('password');

  const onSubmit = (data) => {
    const res = signup(data.name, data.email, data.password);
    if (res.success) {
      addToast('Account created successfully!', 'success');
      navigate('/');
    } else {
      addToast(res.message, 'error');
    }
  };

  return (
    <div className={`container ${styles.authContainer}`}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Join Inkwell</h1>
          <p className={styles.authSubtitle}>Create an account to start writing and engaging.</p>
        </div>
        
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
              pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' }
            })}
          />
          
          <Input 
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
          />

          <Input 
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
          />
          
          <Button type="submit" size="lg" className={styles.submitBtn}>
            Create Account
          </Button>
        </form>
        
        <div className={styles.authFooter}>
          Already have an account? <Link to="/login" className={styles.authLink}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};
