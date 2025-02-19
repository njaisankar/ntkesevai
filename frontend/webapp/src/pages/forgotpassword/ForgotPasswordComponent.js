import React, { useState  } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './ForgotPasswordComponent.css';
const ForgotPasswordComponent = (() => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const handleSubmit = (event) =>{
        event.preventDefault(); 
        if(userName != 'njaisankar@gmail.com')
        {
            navigate('/dashboard');
        }
        else
        {
            Swal.fire({
                title: 'மின்னஞ்சல்',
                text: "மின்னஞ்சல் தவறு. மீண்டும் முயற்சிக்கவும்.",
                icon: 'error',  // or 'error', 'warning', 'info', 'question'
                confirmButtonText: 'OK',
            })
        }
    };

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
                            <img class="img-fluid" src="media/images/forgot-password-v2.svg" alt='Login Home Page' />
                        </div>

                        <div className='col-4 align-self-center'>
                        
                            <div class="col-12 col-sm-8 col-md-6 col-lg-12 px-xl-2 mx-auto">
                                <h2 class="card-title font-weight-bold mb-1">கடவுச்சொல்லை மறந்துவிட்டீர்களா? 🔒</h2>
                                <p class="card-text mb-2">உங்கள் மின்னஞ்சலை உள்ளிடவும், உங்கள் கடவுச்சொல்லை மீட்டமைக்க நாங்கள் உங்களுக்கு உதவுகிறோம்</p>
                                <form class="mb-2" onSubmit={handleSubmit}>
                                    <div class="form-group" style={{marginBottom:'10px'}}>
                                        <label class="form-label" for="forgot-password-email">மின்னஞ்சல்</label>
                                        <input class="form-control"  required type="email" name="eom" autofocus="" value = {userName} onChange={(e) => setUserName(e.target.value)}/>
                                    </div>
                                    
                                    <button type="submit" class="btn btn-primary btn-block">குறியீட்டை அனுப்பு</button>
                                    
                                </form>
                                <Link to='/' clasName="brand-logo">
                                    <p class="text-center mt-2"><i data-feather="chevron-left"></i>மீண்டும் உள்நுழைய</p>
                                </Link>
                            </div>
                        
                    </div>
                </div>
            </div>
        }
        </>
     );        
});

export default ForgotPasswordComponent