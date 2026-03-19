import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { debounce } from 'lodash';
import { useDebounceValidation } from '../../utils/validation';
import { signup } from '../../services/userService';

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

  const reValidatePasswordsMatch = debounce(() => {
      trigger('confirmPassword');
    }, 100
  );

  const debounceValidation = useDebounceValidation(setValue, reValidatePasswordsMatch);

  const onSubmit = async () => {
    console.log("SignUp.js - Submitting SignUp Form");
    if (isValid) {
      let results = await signup(getValues());
      if(results.status === 200) navigate('/login', {replace: true});
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
                      minLength: { 
                        value: 2,
                        message: 'Name must be at least 2 characters' 
                      },
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "Name should only contain letters"
                      }
                    })}
                    onChange={(e) => debounceValidation('name', e.target.value)}
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
                      pattern: { 
                        value: /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[A-Za-z]{3,}\.[A-Za-z]{2,}$/, 
                        message: "Invalid email format. Please enter a valid email address."
                      }
                    })}
                    onChange={(e) => debounceValidation('email', e.target.value)}
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
                    onChange={(e) => debounceValidation('password', e.target.value)}
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
                    onChange={(e) => debounceValidation('confirmPassword', e.target.value)}
                  />
                  {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>}
                </div>
                <div className="d-grid">
                  <button type="submit" disabled={isSubmitting || !isValid} className="btn btn-success">
                    {isSubmitting ? 'Submitting' : 'Sign Up'}
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-muted mb-0 mt-2">
                    Already have an account?
                    <Link to="/login" className="btn btn-link align-baseline">Log In</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;