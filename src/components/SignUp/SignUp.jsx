import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

const SignUp = () => {
  const navigate = useNavigate();
  const { 
    register, 
    handleSubmit, 
    setValue,
    getValues,
    trigger,
    formState: { errors, isSubmitting, isValid }
  } = useForm({
    mode: 'onChange'
  });

  const reValidatePasswords = debounce(() => {
      trigger('confirmPassword');
    }, 100
  );

  const validateName = (name) => {
    if(name.length < 2) return "Name must be at least 2 characters";
    if(!/^[A-Za-z\s]+$/.test(name)) return "Name should only contain letters";
    return true;
  }

  const debouncedValidation = useCallback(
    debounce((name, value) => {
      setValue(name, value, { shouldValidate: true });
      if (name === 'password') {
        reValidatePasswords();
      }
    }, 1000),
    []
  );

  const onSubmit = () => {
    if (isValid) {
      navigate('/', {replace: true});
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h2>Sign Up</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label text-start">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter your name"
                    {...register('name', { 
                      required: 'Name is required',
                      validate: (value) => validateName(value)
                    })}
                  />
                  {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[A-Za-z0-9]{3,}@[A-Za-z]{3,}\.[A-Za-z]{3,}$/, message: "Invalid email format. Please enter a valid email address."},
                      // 
                    })}
                    onChange={(e) => debouncedValidation('email', e.target.value)}
                  />
                  {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                      validate: (value) => /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value) && /[!@#$%^&*]/.test(value) || "Password must contain uppercase, lowercase, a number, and a special character"
                    })}
                    onChange={(e) => debouncedValidation('password', e.target.value)}
                  />
                  {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Re-enter your password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === getValues('password') || 'Passwords do not match',
                    })}
                    onChange={(e) => debouncedValidation('confirmPassword', e.target.value)}
                  />
                  {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>}
                </div>
                <div className="d-grid">
                  <button type="submit" disabled={isSubmitting || !isValid} className="btn btn-success">
                    {isSubmitting ? 'Submitting' : 'Sign Up'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp