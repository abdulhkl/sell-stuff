import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import toast from 'react-hot-toast'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

function ForgotPassword() {
    const [email, setEmail] = useState('')

    const onChange = (e) => setEmail(e.target.value)

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth()
            await sendPasswordResetEmail(auth, email)
            toast.success('Email was sent')
        } catch (error) {
            toast.error('Could not send reset email')
        }
    }

    return (
        <div className='pageContainer'>
            <header>
                <p className='pageHeader'>Forgot Password</p>
            </header>

            <main>
                <div className='formWrapper'>

                    <form onSubmit={onSubmit}>
                        <input
                            type='email'
                            className='emailInput fp'
                            placeholder='Email'
                            id='email'
                            value={email}
                            onChange={onChange}
                            required
                        />
                        <Link className='forgotPasswordLink' to='/sign-in'>
                            Sign In
                        </Link>

                        <div className='signInBar'>

                            <button className='signInButton'>
                                <span className='signInText'>Send Reset Link</span>
                                <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default ForgotPassword