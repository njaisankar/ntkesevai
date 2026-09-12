import './RegisterComponent.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import feather from 'feather-icons'
import Swal from 'sweetalert2';
import { useState, useEffect, useRef } from 'react';
import {postUser} from './../../services/servicelogic.js'
const RegisterComponent = (() => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({username:'',first_name:'',last_name:'',email:'',password:'', mobile:''});
    const [selectedBlockId, setSelectedBlockId] = useState(91) //default veerapandi constituency
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
  
    const handleChange = (event) => {
      event.preventDefault(); 
      const {name,value} = event.target;
      setFormData((prevformData) => ({...prevformData, [name]:value}));
   // setPassword(value);
    }

    const CheckPasswordStrength = (event) =>  {
      const password = event.target.value;
      var password_strength = document.getElementById("password_strength");
      var eleman = document.getElementById("sub");

      //TextBox left blank.
      if (password.length === 0) {
          password_strength.innerHTML = "";
          return;
      }

      //Regular Expressions.
      var regex = new Array();
      regex.push("[A-Z]"); //Uppercase Alphabet.
      regex.push("[a-z]"); //Lowercase Alphabet.
      regex.push("[0-9]"); //Digit.
      regex.push("[_$@!%*#?&]"); //Special Character.

      var passed = 0;

      //Validate for each Regular Expression.
      for (var i = 0; i < regex.length; i++) {
          if (new RegExp(regex[i]).test(password)) {
              passed++;
          }
      }

      //Validate for length of Password.
      if (passed > 2 && password.length > 8) {
          passed++;
      }

      //Display status.
      var color = "";
      var strength = "";
      switch (passed) {
          case 0:
          case 1:
              strength = "Weak";
              color = "red";
              break;
          case 2:
              strength = "Good";
              color = "darkorange";
              break;
          case 3:
          case 4:
              strength = "Strong";
              color = "green";
              break;
          case 5:
              strength = "Very Strong";
              color = "green";
              eleman.removeAttribute("disabled");
              break;
      }
      password_strength.innerHTML = strength;
      password_strength.style.color = color;
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); 
      
        const finalFormData = {
          "username": formData.email,
          "first_name": formData.first_name,
          "last_name": formData.last_name,
          "email": formData.email,
          "password" : formData.password,
          "user_details_data": {
              "mobile": formData.mobile,
               "constituency_id" : selectedBlockId
          }
        }
        //register user, call API
        const response = await postUser(finalFormData);
        console.log('dd',response)
        if(response.ok)
        {
            Swal.fire({
              title: 'உங்கள் கணக்கு',
              text: "கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது.",
              icon: 'info',  // or 'error', 'warning', 'info', 'question'
              confirmButtonText: 'OK',
            });
        }
        else
        {
            const errorData = await response.json();
            console.log('err',errorData)
            Object.keys(errorData).forEach(field => {
            const originalMessage = errorData[field][0];
            console.log('error data', errorData)
            Swal.fire({
              title: 'பிழை',
              text: originalMessage,
              icon: 'error',  // or 'error', 'warning', 'info', 'question'
              confirmButtonText: 'OK',
            })
            })
        }
    }

    return(
        <>
        {
          <div className="container">
            <div className='d-flex justify-content-center'>
                  <Link to='/' className="brand-logo">
                      <h2 className="text-primary ml-1">ராவணன் மக்கள் சேவை மையம் </h2>
                  </Link>
            </div>
            <div className='d-flex mb-3'>
              <div className='col-8'>
                  <img className="img-fluid" src="/assets/media/images/register-v2.svg" alt='Login Home Page' />
              </div>

              <div className='col-4 align-self-center'>
                      <h2 className="card-title font-weight-bold mb-1">கணக்குகளை தொடங்க 🚀</h2>
                      <p className="card-text mb-2">உங்கள் சேவை நிர்வாகத்தை எளிதாக்குங்கள்</p>
                      <form className="auth-register-form mt-2" onSubmit={handleSubmit}>
                          <div className="form-group">
                              <label className="form-label">தொகுதியின் பெயர்</label>
                              <select
                                id="block_town_type"
                                className="form-select"
                                value={selectedBlockId}
                                disabled
                            >
                                <option selected value="91">வீரபாண்டி</option>
                            </select>
                          </div>
                          <div className="form-group">
                              <label className="form-label">முதல் பெயர்</label>
                              <input className="form-control" type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                          </div>
                          <div className="form-group">
                              <label className="form-label">கடைசி பெயர்</label>
                              <input className="form-control" type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                          </div>
                          <div className="form-group">
                              <label className="form-label">கைபேசி</label>
                              <input className="form-control" type="text" maxlength="10" name="mobile" value={formData.mobile} onChange={handleChange} required />
                          </div>
                          <div className="form-group">
                              <label className="form-label">மின்னஞ்சல்</label>
                              <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} required />
                          </div>
                          <div className="form-group">
                              <label className="form-label" for="register-password">கடவுச்சொல்</label>
                              <div className="password-input" style={{display: 'flex', alignItems:'center'}}>
                                <input className='form-control' type={passwordVisible ? 'text' : 'password'} required  id="register-password"  name="password" value={formData.password} 
                                 placeholder='கடவுச்சொல்' onChange={handleChange} onKeyUp={CheckPasswordStrength} />
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
                                <p>5.[_ @ # $ & * ! % ? &] இலிருந்து குறைந்தது 1 எழுத்து.</p>
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