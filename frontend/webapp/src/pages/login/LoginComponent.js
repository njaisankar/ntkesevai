import React, { useRef,useState,useEffect  } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import feather from 'feather-icons'
import './LoginComponent.css';
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

  const openWhatsAppChat = () => {
    window.open('https://wa.me/YourWhatsAppNumber', '_blank');
  };

    const handleSubmit = (event) =>{
        event.preventDefault(); 
        if(userName === 'test' && password === 'test')
        {
            navigate('/dashboard');
        }
        else
        {
            Swal.fire({
                title: 'கடவுச்சொல்',
                text: "கணக்கை/கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
                icon: 'error',  // or 'error', 'warning', 'info', 'question'
                confirmButtonText: 'OK',
            })
        }
    };


    
//     const authUrl = 'http://127.0.0.1:8000/api-auth/login/';
//     const authData = { username: 'njais', password: 'ntkesevai!980' };
// //token 'bmphaXM6bnRrZXNldmFpITk4MA=='
// fetch(authUrl, {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(authData)
// })
// .then(response => response.json())
// .then(data => {
//     const token = data.token;
//     console.log('token ' + token)
//     localStorage.setItem('authToken', token);
// });


    const userApiUrl ='http://127.0.0.1:8000/users/';
    fetch(userApiUrl)
    .then(response => { 
      if(response.ok){
        console.log('Succeess: '+ response.ok);
        console.log(response.json());
      }
      else
      {
        console.log('Error: '+ response.error);
      }
    });

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
                    <img class="img-fluid" src="media/images/login-v2.svg" alt='Login Home Page' />
                    
                </div>

                <div className='col-4 align-self-center'>
                    <h2 clasName="card-title font-weight-bold mb-1">வரவேற்கிறோம் ராவணன் இ-சேவை! 👋</h2>
                    <p clasName="card-text mb-2">உங்கள் கணக்கில் உள்நுழைந்து சேவைகளைத் தொடங்கவும்</p>

                    <form onSubmit={handleSubmit}>
                        <input type="hidden" name="formname" value="email" />
                        <div clas="mb-3 form-group">
                            <label htmlFor="lblPassword" class="form-label">மின்னஞ்சல்</label>
                            <input required className="form-control" type="text" name="email" autoFocus placeholder='மின்னஞ்சல்' value={userName}
                                onChange={(e) => setUserName(e.target.value)} />
                        </div>
                        <div clas="mb-3">
                            <div class="d-flex justify-content-between">
                                <label clas="form-label">கடவுச்சொல்</label>
                            </div>
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
                            <div class="d-flex justify-content-between">
                                <Link to='/forgotpassword'>
                                    <label class="form-label"></label><small>கடவுச்சொல்லை மறந்துவிட்டீர்களா?</small>
                                </Link>
                            </div>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block" tabIndex="4">Login with email</button>
                    </form>
                    <Link to="/register">
                        <p class="text-center mt-2"><span>எங்கள் தளத்திற்கு புதியவரா நீங்கள்?</span><span>&nbsp;கணக்கை உருவாக்க</span></p>
                        

                    </Link>
                    <button onClick={openWhatsAppChat}>Chat with us on WhatsApp</button>
                </div>
            </div>
        </div>
        }
        </>
    );        
});

export default LoginComponent