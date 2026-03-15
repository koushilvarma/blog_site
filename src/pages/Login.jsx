import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import styles from './Auth.module.css';

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const res = login(data.email, data.password);
    if (res.success) {
      addToast('Welcome back!', 'success');
      navigate('/');
    } else {
      addToast(res.message, 'error');
    }
  };

  return (
    <div className={`container ${styles.authContainer}`}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Welcome Back</h1>
          <p className={styles.authSubtitle}>Sign in to continue to Inkwell.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm} noValidate>
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
            {...register('password', { required: 'Password is required' })}
          />
          
          <Button type="submit" size="lg" className={styles.submitBtn}>
            Sign In
          </Button>
        </form>
        
        <div className={styles.authFooter}>
          Don't have an account? <Link to="/signup" className={styles.authLink}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};
