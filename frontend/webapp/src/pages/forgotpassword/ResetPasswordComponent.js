import {React, useState} from 'react';
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import './ResetPasswordComponent.css';
import {ResetPassword} from  './../../services/servicelogic.js'
const ResetPasswordComponent = (() => {
    const {token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfrimPassword] = useState('');
    const handleSubmit = (event) =>{
        event.preventDefault(); 
        console.log('input',password, '==> ', confirmpassword)
        if(password != confirmpassword)
        {
            Swal.fire({
                title: 'கடவுச்சொல்',
                text: "புதிய மற்றும் உறுதிபடுத்தபட்ட கடவுச்சொல் இரண்டும் ஒன்றாக இருக்க வேண்டும்.",
                icon: 'warning',  // or 'error', 'warning', 'info', 'question'
                confirmButtonText: 'நன்றி',
            })
            return false;
        }
        const bodyData = {token: token, password: password };
        console.log('body data ', bodyData)
        var returnResult = ResetPassword(bodyData);
        console.log("Result: " + returnResult);
        Swal.fire({
            title: 'ஒரு முறை கடவுச்சொல்',
            text: "ஒரு முறை கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது.",
            icon: 'info',  // or 'error', 'warning', 'info', 'question'
            confirmButtonText: 'நன்றி',
        })
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
                            <img class="img-fluid" src="/assets/media/images/reset-password-v2.svg" alt='Login Home Page' />
                        </div>
                        <div className='col-4'>
                            <div class="col-12 col-sm-8 col-md-6 col-lg-12 px-xl-2 mx-auto">
                                <h2 class="card-title font-weight-bold mb-1">கடவுச்சொல்லை மீட்டமைக்க 🔒</h2>
                                <p class="card-text mb-2">உங்கள் புதிய கடவுச்சொல் முன்பு பயன்படுத்தப்பட்ட கடவுச்சொற்களிலிருந்து வேறுபட்டதாக இருக்க வேண்டும்</p>
                                <form class="auth-reset-password-form mt-2" onSubmit={handleSubmit}>
                                    <div class="form-group">
                                        <div class="d-flex justify-content-between">
                                            <label for="reset-password-new">புதிய கடவுச்சொல்</label>
                                        </div>
                                        <div class="input-group input-group-merge form-password-toggle">
                                            <input id="pwd1" required onkeyup="CheckPasswordStrength(this.value)" class="form-control form-control-merge" type="password" name="password" value={password}
                                    onChange={(e) => setPassword(e.target.value)} autofocus=""/>
                                            <div class="input-group-append"><span class="input-group-text cursor-pointer"><i data-feather="eye"></i></span></div>
                                        </div>
                                        <span id="password_strength"></span>
                                    </div>
                                    <div class="form-group">
                                        <div class="d-flex justify-content-between">
                                            <label for="reset-password-new">புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்</label>
                                        </div>
                                        <div class="input-group input-group-merge form-password-toggle">
                                            <input id="pwd2" required onkeyup="CheckPasswordStrength1(this.value)" class="form-control form-control-merge" type="password" name="confirmpassword" value={confirmpassword}
                                    onChange={(e) => setConfrimPassword(e.target.value)} autofocus=""/>
                                            <div class="input-group-append"><span class="input-group-text cursor-pointer"><i data-feather="eye"></i></span></div>
                                        </div>
                                        <span id="password_strength1"></span>
                                    </div>
                                    <p style={{color: 'red'}} class="card-text mb-2">*சமர்ப்பிக்கும் முன் தயவுசெய்து புதிய கடவுச்சொல் மற்றும் மாரு உள்ளீடு செய்த புதிய கடவுச்சொல்லை சரிபார்க்கவும்.</p>
                                     <p style={{color: 'red'}}>1.குறைந்தபட்சம் 8 எழுத்துக்கள் இருக்க வேண்டும்.</p>
                                     <p style={{color: 'red'}}>2.குறைந்தபட்சம் ஒரு எழுத்து [a-z] க்கு இடையில் இருக்க வேண்டும்.</p>
                                     <p style={{color: 'red'}}>3.குறைந்தபட்சம் ஒரு எழுத்து [A-Z] க்கு இடையில் இருக்க வேண்டும்.</p>
                                     <p style={{color: 'red'}}>4.[0-9] க்கு இடையில் குறைந்தது ஒரு இலக்கம் இருக்க வேண்டும்.</p>
                                     <p style={{color: 'red'}}>5.[_ @ # $ & *] இலிருந்து குறைந்தது 1 எழுத்து.</p>
                                    <button type="submit" class="btn btn-primary btn-block" tabindex="3">புதிய கடவுச்சொல்லை அமைக்க</button>
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

export default ResetPasswordComponent