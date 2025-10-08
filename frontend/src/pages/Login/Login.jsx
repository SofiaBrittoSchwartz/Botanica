import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDebounceValidation } from '../../utils/validation';
import { login } from '../../services/userService';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: 'onChange'
  });

  const debounceValidation = useDebounceValidation(setValue);

  const onSubmit = async () => {
    console.log('Login.jsx - Login data:', getValues());
    let results = await login(getValues());
    if(results.status === 200) navigate('/', {replace: true});
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h2>Login</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
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
                      pattern: {
                        value: /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[A-Za-z]{3,}\.[A-Za-z]{2,}$/,
                        message: 'Invalid email format. Please enter a valid email address.',
                      },
                    })}
                    onChange={(e) => debounceValidation('email', e.target.value)}
                  />
                  {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label text-start">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    onChange={(e) => debounceValidation('password', e.target.value)}
                  />
                  {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                </div>
                <div className="d-grid">
                  <button type="submit" disabled={isSubmitting || !isValid} className="btn btn-success">
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>
              <div className="text-center">
                <p className="text-muted mb-0 mt-2">
                  Don't have an account?
                  <Link to={'/signup'} className="btn btn-link align-baseline">Sign up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;