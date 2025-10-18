import React, { useRef,useState,useEffect  } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import feather from 'feather-icons'
import './LoginComponent.css';
import ErrorBoundary from './../../ErrorBoundary';
import {getUsers, getServiceRequest} from './../../services/servicelogic.js'

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
        //let userName = 'daya@gmail.com'
        //let password = 'test'
        console.log('users entered username ' + userName);
        console.log('users entered password ' + password);
        const auth_data = { username: userName, password: password};
        let userData = (await getUsers(auth_data));
        console.log('users  data ' + userData.success);
        console.log('users  data ' + userData.status);
        console.log('users  data ' + userData.data);
        console.log('users  data ' + userData.error);
        userData = userData.data;
        console.log('users  token ' + userData.token);
        console.log('users user id ' + userData.user_id);
        console.log('users  username ' + userData.username);
        console.log('users  password ' + userData.password);
        console.log('users fn ' + userData.first_name);
        console.log('users ln ' + userData.last_name);
        console.log('users permissions ' + userData.permissions);
        console.log('users isCreator ' + userData.isCreator);
        console.log('users isApprover ' + userData.isApprover);

        if (userData && userData.token) {
            navigate('/dashboard', {state: {userData}});
        } else {
            Swal.fire({
                title: 'கடவுச்சொல்',
                text: "கணக்கை/கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
                icon: 'error',  // or 'error', 'warning', 'info', 'question'
                confirmButtonText: 'OK',
            })
        }
    };

    return(
        <>
        {
        <div clasName="container">
            <div className='d-flex justify-content-center'>
                <div className='col-12 col-md-4'>
                    <Link to='/' clasName="brand-logo">
                        <h2 clasName="brand-text text-primary ml-1">ராவணன் மக்கள் சேவை மையம் </h2>
                    </Link>
                </div>
            </div>
            <div className='d-flex flex-wrap'>
                <div className='col-12 col-md-6'>
                    <img clasName="img-fluid" src="/assets/media/images/login-v2.svg" alt='Login Home Page' />
                </div>

                <div className='col-12 col-md-5 align-self-center'>
                    <h2 clasName="card-title font-weight-bold mb-1">வரவேற்கிறோம் ராவணன் இ-சேவை! 👋</h2>
                    <p clasName="card-text mb-2">உங்கள் கணக்கில் உள்நுழைந்து சேவைகளைத் தொடங்கவும்</p>

                    <form onSubmit={handleSubmit}>
                        <div class ="row g-3" id="login-form">
                        <input type="hidden" name="formname" value="email" />
                        <div className="col-12 col-md-8">
                            <div clasName="mb-3 form-group">
                                <label htmlFor="lblPassword" class="form-label">மின்னஞ்சல்</label>
                                <input required className="form-control" type="text" name="email" autoFocus placeholder='மின்னஞ்சல்' value={userName}
                                    onChange={(e) => setUserName(e.target.value)} />
                            </div>
                        </div>

                        <div className="col-12 col-md-8">
                            <div clasName="mb-3 form-group">
                                <label clasName="form-label">கடவுச்சொல்</label>
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
                            </div>
                        </div>

                        <div className="col-12 col-md-8 d-flex justify-content-center">
                            <div clasName="mb-3">
                                <button type="submit" className="btn btn-primary" tabIndex="4">உள்நுழைய</button>
                            </div>
                        </div>
          
                        <div clasName="col-12 col-md-8">
                            <Link to='/forgotpassword'>
                                <label class="form-label"></label><small>கடவுச்சொல்லை மறந்துவிட்டீர்களா?</small>
                            </Link>
                        </div>
                        </div>
                    </form>
                    <div clasName="col-12 col-md-8">
                        <Link to="/register">
                            <p clasName="text-center mt-2"><span>எங்கள் தளத்திற்கு புதியவரா நீங்கள்?</span><span>&nbsp;கணக்கை உருவாக்க</span></p>
                        </Link>
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