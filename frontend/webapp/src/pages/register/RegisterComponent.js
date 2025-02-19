import './RegisterComponent.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import feather from 'feather-icons'
import Swal from 'sweetalert2';
import { useState, useEffect, useRef } from 'react';

const RegisterComponent = (() => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    
        const [passwordVisible, setPasswordVisible] = useState(false);
    
        const iconContainerRef = useRef(null); // Ref for the icon container
    
        useEffect(() => {
          // Render the icons whenever showPassword changes
          renderIcons();
        }, [passwordVisible]);
      
      
        const renderIcons = () => {
            if (iconContainerRef.current) {
              iconContainerRef.current.innerHTML = ''; // Clear existing icon
      
              const iconName = passwordVisible ? 'eye' : 'eye-off';
              const icon = feather.icons[iconName].toSvg(); // Get the SVG
      
              iconContainerRef.current.insertAdjacentHTML('beforeend', icon);
            }
        }
      
      const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
      };
    
    

    const handleSubmit = (event) =>{
        event.preventDefault(); 
            Swal.fire({
                title: 'மின்னஞ்சல்',
                text: "மின்னஞ்சல் தவறு. மீண்டும் முயற்சிக்கவும்.",
                icon: 'error',  // or 'error', 'warning', 'info', 'question'
                confirmButtonText: 'OK',
            })
        }

    return(
        <>
        {
          <div class="container">
            <div className='d-flex justify-content-center'>
              <div col-md-12>
                  <Link to='/' clasName="brand-logo">
                      <h2 clasName="brand-text text-primary ml-1">ராவணன் மக்கள் சேவை மையம் </h2>
                  </Link>
              </div>
            </div>
            <div className='d-flex mb-3'>
              <div className='col-8'>
                  <img class="img-fluid" src="media/images/register-v2.svg" alt='Login Home Page' />
              </div>

              <div className='col-4 align-self-center'>
                      <h2 class="card-title font-weight-bold mb-1">கணக்குகளை தொடங்க 🚀</h2>
                      <p class="card-text mb-2">உங்கள் சேவை நிர்வாகத்தை எளிதாக்குங்கள்</p>
                      <form class="auth-register-form mt-2" onSubmit={handleSubmit}>
                          <div class="form-group">
                              <label class="form-label">முதல் பெயர்</label>
                              <input class="form-control" type="text" name="firstname" required />
                          </div>
                          <div class="form-group">
                              <label class="form-label">கடைசி பெயர்</label>
                              <input class="form-control" type="text" name="lastname" required />
                          </div>
                          <div class="form-group">
                              <label class="form-label">கைபேசி</label>
                              <input class="form-control" type="text" maxlength="10" name="mobile" required />
                          </div>
                          <div class="form-group">
                              <label class="form-label">மின்னஞ்சல்</label>
                              <input class="form-control" type="email" name="email" required />
                          </div>
                          <div class="form-group">
                              <label class="form-label" for="register-password">கடவுச்சொல்</label>
                              {/* onkeyup="CheckPasswordStrength(this.value)" todo */}
                              <div className="password-input" style={{display: 'flex', alignItems:'center'}}>
                                <input className='form-control' type={passwordVisible ? 'text' : 'password'} required  id="register-password"  name="pwd" placeholder='கடவுச்சொல்' value={password}
                                    onChange={(e) => setPassword(e.target.value)} />
                                <i
                                    onClick={togglePasswordVisibility} 
                                    className='password-toggle-button'
                                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                                >
                                    <span ref={iconContainerRef}> </span>
                                </i>
                            </div>

                              <span id="password_strength">
                                <p>1.குறைந்தபட்சம் 8 எழுத்துக்கள் இருக்க வேண்டும்.</p>
                                <p>2.குறைந்தபட்சம் ஒரு எழுத்து [a-z] க்கு இடையில் இருக்க வேண்டும்.</p>
                                <p>3.குறைந்தபட்சம் ஒரு எழுத்து [A-Z] க்கு இடையில் இருக்க வேண்டும்.</p>
                                <p>4.[0-9] க்கு இடையில் குறைந்தது ஒரு இலக்கம் இருக்க வேண்டும்.</p>
                                <p>5.[_ @ # $ & *] இலிருந்து குறைந்தது 1 எழுத்து.</p>
                              </span>
                          </div>
                          <button class="btn btn-primary btn-block" tabindex="5">கணக்கை தொடங்க</button>
                      </form>
                      <Link  to="/login">
                        <p class="text-center mt-2"><span>ஏற்கனவே ஒரு கணக்கு உள்ளதா?</span><span>&nbsp;அதற்கு பதிலாக உள்நுழைக</span></p>
                      </Link>
              </div>
            </div>
          </div>           
        }
        </>
     );        
});

export default RegisterComponent