import React, { useState  } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './ForgotPasswordComponent.css';
import {getForgotPassword} from './../../services/servicelogic.js'
const ForgotPasswordComponent = (() => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            console.log('input',userName)
            const bodyData = { email: userName };
            var returnResult = await  getForgotPassword(bodyData);
            console.log("Result" + returnResult);
            if (returnResult && returnResult.success) {
                Swal.fire({
                    title: 'ஒரு முறை கடவுச்சொல்',
                    text: "ஒரு முறை கடவுச்சொல் வெற்றிகரமாக உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டது.",
                    icon: 'error',  // or 'error', 'warning', 'info', 'question'
                    confirmButtonText: 'OK',
                })
             } else {
                // CASE: Email does not exist or business logic failure
                Swal.fire({
                    title: 'பிழை!', // Error!
                    text: "இந்த மின்னஞ்சல் முகவரி பதிவு செய்யப்படவில்லை.", // Email not registered
                    icon: 'error',
                    confirmButtonText: 'மீண்டும் முயற்சிக்கவும்',
                });
            }
         }catch (error) {
            // CASE: Server Crash (500) or Network Failure
            console.error("API Error:", error);
            Swal.fire({
                title: 'சேவையக பிழை', // Server Error
                text: "தற்போது தொழில்நுட்ப கோளாறு ஏற்பட்டுள்ளது. சிறிது நேரம் கழித்து முயற்சிக்கவும்.",
                icon: 'warning',
                confirmButtonText: 'சரி',
            });
        }
    };

    return(
        <>
        {
            <div class="container">
                 <div className='d-flex justify-content-center'>
                    <Link to='/' className="brand-logo">
                        <h2 className="brand-text text-primary ml-1">ராவணன் மக்கள் சேவை மையம்</h2>
                    </Link>
                </div>
                <div className='d-flex flex-wrap'>
                    <div className='col-8'>
                        <img className="img-fluid" src="/assets/media/images/forgot-password-v2.svg" alt='Login Home Page' />
                    </div>
                    <div className='col-4 align-self-center'>
                        <div className="col-12 col-sm-8 col-md-6 col-lg-12 px-xl-2 mx-auto">
                            <h2 className="card-title font-weight-bold mb-1">கடவுச்சொல்லை மறந்துவிட்டீர்களா? 🔒</h2>
                            <p className="card-text mb-2">உங்கள் மின்னஞ்சலை உள்ளிடவும், உங்கள் கடவுச்சொல்லை மீட்டமைக்க நாங்கள் உங்களுக்கு உதவுகிறோம்</p>
                            <form className="mb-2" onSubmit={handleSubmit}>
                                <div className="form-group" style={{marginBottom:'10px'}}>
                                    <label className="form-label" htmlFor="forgot-password-email">மின்னஞ்சல்</label>
                                    <input className="form-control"  required type="email" name="eom" autoFocus="" value = {userName} onChange={(e) => setUserName(e.target.value)}/>
                                </div>

                                <button type="submit" className="btn btn-primary w-100 py-2">குறியீட்டை அனுப்பு</button>
                            </form>
                       <div className="text-center mt-4 pt-2">
                            <Link
                                to='/login'
                                className="d-inline-flex align-items-center justify-content-center"
                                style={{
                                    textDecoration: 'none',
                                    color: '#6c757d', // A neutral color is better for "Back" actions
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    transition: 'color 0.2s'
                                }}
                                // Adding hover effect logic
                                onMouseOver={(e) => e.currentTarget.style.color = '#0d6efd'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#6c757d'}
                                >
                                <span>மீண்டும் உள்நுழைய</span>
                            </Link>
                       </div>
                    </div>
                </div>
            </div>
        </div>
        }
        </>
     );        
});

export default ForgotPasswordComponent