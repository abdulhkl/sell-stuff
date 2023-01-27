import { useState } from 'react'
import toast from "react-hot-toast"
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import OAuth from '../components/OAuth'

import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignIn() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { email, password } = formData
    const navigate = useNavigate()
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const auth = getAuth()

            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            )

            if (userCredential.user) {
                navigate('/profile')
            }
        } catch (error) {
            toast.error("Bad user credential")
        }
    }
    return (
        <>
            <div className='pageContainer'>
                <header>
                    <p className='pageHeader'>Welcome Back!</p>
                </header>
                <div className='formWrapper'>
                    <form onSubmit={onSubmit}>
                        <input
                            type='email'
                            className='emailInput'
                            placeholder='Email'
                            id='email'
                            value={email}
                            onChange={onChange}
                            required
                        />

                        <div className='passwordInputDiv'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className='passwordInput'
                                placeholder='Password'
                                id='password'
                                value={password}
                                onChange={onChange}
                                required
                            />

                            <img
                                src={visibilityIcon}
                                alt='show password'
                                className='showPassword'
                                onClick={() => setShowPassword((prevState) => !prevState)}
                            />
                        </div>
                        <Link to='/forgot-password' className='forgotPasswordLink'>
                            Forgot Password
                        </Link>
                        <div className='signInBar'>
                            <button className='signInButton'>
                                <span className='signInText'>Sign In</span>
                                <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
                            </button>
                        </div>

                    </form>
                </div>
                <OAuth />
                <Link to='/sign-up' className='registerLink'>
                    Sign Up Instead
                </Link>
            </div>
        </>
    )
}

export default SignIn