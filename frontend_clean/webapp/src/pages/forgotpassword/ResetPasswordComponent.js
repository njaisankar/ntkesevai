import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Eye, EyeOff, ChevronLeft } from 'react-feather';
import './ResetPasswordComponent.css';
import { ResetPassword } from './../../services/servicelogic.js';

const ResetPasswordComponent = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    // State for inputs
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');

    // State for UI toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // State for feedback messages
    const [strength, setStrength] = useState({ message: "", color: "" });
    const [matchMessage, setMatchMessage] = useState({ message: "", color: "" });

    // Logic: Real-time Password Strength Check
    const checkStrength = (val) => {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_@#\$%\^&\*!%?&])(?=.{8,})/;
        const mediumRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})/;

        if (!val) {
            setStrength({ message: "", color: "" });
        } else if (strongRegex.test(val)) {
            setStrength({ message: "Strong (வலிமையானது)", color: "green" });
        } else if (mediumRegex.test(val)) {
            setStrength({ message: "Good (நன்று)", color: "orange" });
        } else {
            setStrength({ message: "Weak (பலவீனமானது)", color: "red" });
        }
    };

    // Logic: Real-time Match Check
    useEffect(() => {
        if (confirmpassword) {
            if (password === confirmpassword) {
                setMatchMessage({ message: "Passwords Match (பொருந்துகிறது)", color: "green" });
            } else {
                setMatchMessage({ message: "Passwords do not match (பொருந்தவில்லை)", color: "red" });
            }
        } else {
            setMatchMessage({ message: "", color: "" });
        }
    }, [password, confirmpassword]);

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setPassword(val);
        checkStrength(val);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmpassword) {
            Swal.fire({
                title: 'கடவுச்சொல்',
                text: "புதிய மற்றும் உறுதிபடுத்தபட்ட கடவுச்சொல் இரண்டும் ஒன்றாக இருக்க வேண்டும்.",
                icon: 'warning',
                confirmButtonText: 'நன்றி',
            });
            return;
        }

        const bodyData = { token: token, password: password };
        try {
            const result = await ResetPassword(bodyData);
            console.log('Return result', result)
            if(result.ok){
                Swal.fire({
                    title: 'ஒரு முறை கடவுச்சொல்',
                    text: "ஒரு முறை கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது.",
                    icon: 'info',
                    confirmButtonText: 'நன்றி',
                    footer: '<button id="login-pw-btn" style="background:none; border:none; color:#007bff; cursor:pointer; text-decoration:underline;">மீண்டும் உள்நுழைய?</button>',
                    didOpen: () => {
                        const btn = document.getElementById('login-pw-btn');
                        if (btn) {
                            btn.addEventListener('click', () => {
                                Swal.close();
                                navigate('/login');
                            });
                        }
                    }
                });
            }
            else{
                // 4. ERROR (Status 400, 401, 500, etc.)
                    Swal.fire({
                    title: 'பிழை - ஏதோ தவறு நடந்துவிட்டது.',
                    text: result.error,
                    icon: 'error',
                    confirmButtonText: 'சரி',
                });
            }
        } catch (error) {
            // Show the specific error message to the user
            Swal.fire({
                title: 'பிழை - ஏதோ தவறு நடந்துவிட்டது.',
                text: error,
                icon: 'error',
                confirmButtonText: 'சரி',
            });
        }
    };

    return (
        <div className="container">
            <div className='d-flex justify-content-center'>
                <div className="col-md-12">
                    <Link to='/' className="brand-logo">
                        <h2 className="brand-text text-primary ml-1">ராவணன் மக்கள் சேவை மையம் </h2>
                    </Link>
                </div>
            </div>
            <div className='d-flex mb-3'>
                <div className='col-8'>
                    <img className="img-fluid" src="/assets/media/images/reset-password-v2.svg" alt='Reset' />
                </div>
                <div className='col-4'>
                    <div className="col-12 px-xl-2 mx-auto">
                        <h2 className="card-title font-weight-bold mb-1">கடவுச்சொல்லை மீட்டமைக்க 🔒</h2>
                        <p className="card-text mb-2">உங்கள் புதிய கடவுச்சொல் முன்பு பயன்படுத்தப்பட்ட கடவுச்சொற்களிலிருந்து வேறுபட்டதாக இருக்க வேண்டும்</p>

                        <form className="auth-reset-password-form mt-2" onSubmit={handleSubmit}>
                            {/* New Password */}
                            <div className="form-group mb-2">
                                <label>புதிய கடவுச்சொல்</label>
                                <div className="input-group input-group-merge">
                                    <input
                                        required
                                        className="form-control"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        autoFocus
                                        style={{ borderRight: 'none' }} // Merge visual look
                                    />
                                    <span
                                        className="input-group-text cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                                </div>
                                <div style={{ color: strength.color, fontSize: '0.85rem', marginTop: '5px' }}>{strength.message}</div>
                            </div>

                            {/* Confirm Password */}
                            <div className="form-group mb-2">
                                <label>புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்</label>
                                <div className="input-group input-group-merge">
                                    <input
                                        required
                                        className="form-control"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmpassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                     <span
                                        className="input-group-text cursor-pointer"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>

                                </div>
                                <div style={{ color: matchMessage.color, fontSize: '0.85rem', marginTop: '5px' }}>{matchMessage.message}</div>
                            </div>

                            <p style={{ color: 'red', fontSize: '0.8rem' }} className="mb-2">
                                *சமர்ப்பிக்கும் முன் தயவுசெய்து புதிய கடவுச்சொல் மற்றும் உறுதிப்படுத்தப்பட்ட கடவுச்சொல்லை சரிபார்க்கவும்.
                            </p>

                            <div className="password-requirements mb-3 small text-muted">
                                <p className="mb-0">1. குறைந்தபட்சம் 8 எழுத்துக்கள் இருக்க வேண்டும்.</p>
                                <p className="mb-0">2. குறைந்தபட்சம் ஒரு சிறிய எழுத்து [a-z] இருக்க வேண்டும்.</p>
                                <p className="mb-0">3. குறைந்தபட்சம் ஒரு பெரிய எழுத்து [A-Z] இருக்க வேண்டும்.</p>
                                <p className="mb-0">4. குறைந்தபட்சம் ஒரு எண் [0-9] இருக்க வேண்டும்.</p>
                                <p className="mb-0">5. சிறப்பு குறியீடு [_ @ # $ & * ! % ?] இருக்க வேண்டும்.</p>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block">புதிய கடவுச்சொல்லை அமைக்க</button>
                        </form>

                        <Link to='/login' className="d-block text-center mt-2">
                            <ChevronLeft size={14} /> மீண்டும் உள்நுழைய
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordComponent;