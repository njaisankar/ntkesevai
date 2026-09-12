import React, { useRef,useState,useEffect  } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import feather from 'feather-icons'
import './LoginComponent.css';
import ErrorBoundary from './../../ErrorBoundary';
import {getUsers} from './../../services/servicelogic.js'

const LoginComponent = (() => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

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

    //TODO
    // const openWhatsAppChat = () => {
    //     window.open('https://wa.me/YourWhatsAppNumber', '_blank');
    // };

    const handleSubmit = async (event) =>{
        event.preventDefault(); 
        console.log('users entered username ' + userName);
        console.log('users entered password ' + password);
        const auth_data = { username: userName, password: password};
        let userData = (await getUsers(auth_data));
        console.log('Users data ' + userData);
        userData = userData.data;
        console.log('users  token ' + userData?.token);
        if (userData && userData.token) {
//            console.log('users  data ' + userData.success);
//            console.log('users  data ' + userData.status);
//            console.log('users  data ' + userData.data);
//            console.log('users  data ' + userData.error);
//
//            console.log('users  token ' + userData?.token);
//            console.log('users user id ' + userData.id);
//            console.log('users  username ' + userData.username);
//            console.log('users  password ' + userData.password);
//            console.log('users fn ' + userData.first_name);
//            console.log('users ln ' + userData.last_name);
//            console.log('users permissions ' + userData.permissions);
//            console.log('users isCreator ' + userData.isCreator);
//            console.log('users isApprover ' + userData.isApprover);
//            console.log('users Is Super user ' + userData.isSuperUser);

            navigate('/dashboard', { state: { userData } });
        }
        else {
            handleLoginError();
        }
    };

    const handleLoginError = () => {
        Swal.fire({
            title: 'உள்நுழைவு தோல்வி',
            text: "பயனர் பெயர் அல்லது கடவுச்சொல் தவறானது.",
            icon: 'error',
            confirmButtonText: 'சரி',
            footer: '<button id="forgot-pw-btn" style="background:none; border:none; color:#007bff; cursor:pointer; text-decoration:underline;">கடவுச்சொல்லை மறந்துவிட்டீர்களா?</button>',
            didOpen: () => {
                const btn = document.getElementById('forgot-pw-btn');
                if (btn) {
                    btn.addEventListener('click', () => {
                        Swal.close();
                        navigate('/forgot-password'); // React Router navigation
                    });
                }
            }
        });
    };

    return(
        <>
        {
        <div className="container">
            <div className='d-flex justify-content-center'>
                    <Link to='/' className="brand-logo">
                        <h2 className="brand-text text-primary ml-1">ராவணன் மக்கள் சேவை மையம்</h2>
                    </Link>
            </div>
            <div className='d-flex flex-wrap'>
                <div className='col-12 col-md-6'>
                    <img className="img-fluid" src="/assets/media/images/login-v2.svg" alt='Login Home Page' />
                </div>

                <div className='col-12 col-md-6 justify-content-center'>
                     <div className='col-12 mx-auto text-center'>
                        <h2 className="card-title font-weight-bold mb-1">வரவேற்கிறோம் ராவணன் இ-சேவை!👋</h2>
                        <p className="card-text mb-2">உங்கள் கணக்கில் உள்நுழைந்து சேவைகளைத் தொடங்கவும்</p>
                      </div>
                    <form onSubmit={handleSubmit}>
                        <div className ="row g-3 justify-content-center" id="login-form">
                            <input type="hidden" name="formname" value="email" />
                            <div className="col-12 col-md-10 col-lg-8">
                                <div className="mb-3 form-group">
                                    <label htmlFor="lblPassword" className="form-label">மின்னஞ்சல்</label>
                                    <input required className="form-control" type="text" name="email" autoFocus placeholder='மின்னஞ்சல்' value={userName}
                                        onChange={(e) => setUserName(e.target.value)} />
                                </div>
                            </div>

                        <div className="col-12 col-md-10 col-lg-8">
                            <div className="mb-3 form-group">
                                <label className="form-label">கடவுச்சொல்</label>
                                <div className="password-input" style={{display: 'flex', alignItems:'center'}}>
                                    <input className='form-control' type={passwordVisible ? 'text' : 'password'} required name="pwd" placeholder='கடவுச்சொல்' value={password}
                                        onChange={(e) => setPassword(e.target.value)} />
                                    <i
                                        onClick={togglePasswordVisibility}
                                        className='password-toggle-button'
                                        aria-label={passwordVisible ? "Hide password" : "Show password"}
                                    >
                                        <span ref={iconContainerRef}> </span>
                                    </i>
                                </div>
                                 <div className="text-end">
                                <Link to='/forgot-password' style={{ textDecoration: 'none', fontSize: '0.85rem', color: '#0d6efd' }}>
                                    கடவுச்சொல்லை மறந்துவிட்டீர்களா?
                                </Link>
                            </div>
                            </div>
                        </div>

                        {/* Change col-12 to col-md-8 to match the inputs above */}
                        <div className="col-12 col-md-8 mt-2">
                            {/* Login Button: Full width buttons are better for mobile UX in 2026 */}
                                <button type="submit" className="btn btn-primary w-100 py-2">உள்நுழைய</button>
                        </div>
                        </div>
                    </form>

                    {/* Registration Link: Clean and Centered */}
                    <div className="mt-4 pt-3 border-top col-12 col-md-8 mx-auto text-center">
                       {/* Forgot Password: Now aligns with the right edge of the password box */}

                        <p className="small text-secondary mb-0">
                            எங்கள் தளத்திற்கு புதியவரா நீங்கள்?
                            <Link to="/register" className="fw-bold ms-1" style={{ textDecoration: 'none', color: '#0d6efd' }}>
                                கணக்கை உருவாக்க
                            </Link>
                        </p>
                    </div>
                    {/* <button onClick={openWhatsAppChat}>Chat with us on WhatsApp</button> */}
                </div>
            </div>
        </div>
        }
        </>
    );        
});

export default LoginComponent