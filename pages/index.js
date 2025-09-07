// /*
// ENHANCED LOGIN PAGE WITH SIGNUP FUNCTIONALITY
// - Toggle between Member/Admin login
// - Toggle between Login/Signup for members
// - Complete member registration form
// - Responsive design maintained
// */

// import { useState } from 'react'
// import { useRouter } from 'next/router'
// import { loginMember, loginAdmin, signupMember } from '../utils/auth'

// export default function LoginPage() {
//   const router = useRouter()
  
//   // STATE: User type and mode management
//   const [userType, setUserType] = useState('member') // member or admin
//   const [mode, setMode] = useState('login') // login or signup
  
//   // STATE: Login form
//   const [loginId, setLoginId] = useState('')
//   const [password, setPassword] = useState('')
  
//   // STATE: Signup form (additional fields)
//   const [fullName, setFullName] = useState('')
//   const [phone, setPhone] = useState('')
//   const [dateOfBirth, setDateOfBirth] = useState('')
//   const [emergencyContact, setEmergencyContact] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
  
//   // STATE: UI management
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')

//   // FUNCTION: Handle user type toggle (Member/Admin)
//   const toggleUserType = (type) => {
//     setUserType(type)
//     setMode('login') // Reset to login mode when switching user type
//     clearForm()
//   }

//   // FUNCTION: Handle mode toggle (Login/Signup) - only for members
//   const toggleMode = (newMode) => {
//     setMode(newMode)
//     clearForm()
//   }

//   // FUNCTION: Clear all form fields
//   const clearForm = () => {
//     setLoginId('')
//     setPassword('')
//     setFullName('')
//     setPhone('')
//     setDateOfBirth('')
//     setEmergencyContact('')
//     setConfirmPassword('')
//     setError('')
//     setSuccess('')
//   }

//   // FUNCTION: Handle login
//   const handleLogin = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')

//     try {
//       let result

//       if (userType === 'member') {
//         result = await loginMember(loginId, password)
//       } else {
//         result = await loginAdmin(loginId, password)
//       }

//       if (result.success) {
//         localStorage.setItem('user', JSON.stringify(result.user))
//         localStorage.setItem('userType', result.userType)

//         if (result.userType === 'member') {
//           router.push('/member-dashboard')
//         } else {
//           router.push('/admin-dashboard')
//         }
//       } else {
//         setError(result.error)
//       }

//     } catch (error) {
//       setError('Login failed. Please try again.')
//       console.error('Login error:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // FUNCTION: Handle member signup
//   const handleSignup = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     setSuccess('')

//     // Validation
//     if (password !== confirmPassword) {
//       setError('Passwords do not match')
//       setLoading(false)
//       return
//     }

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long')
//       setLoading(false)
//       return
//     }

//     try {
//       const memberData = {
//         itsId: loginId,
//         email: loginId, // For signup, loginId will be email
//         password,
//         fullName,
//         phone,
//         dateOfBirth: dateOfBirth || null,
//         emergencyContact: emergencyContact || null
//       }

//       const result = await signupMember(memberData)

//       if (result.success) {
//         setSuccess(result.message)
//         // Auto-login after successful signup
//         setTimeout(() => {
//           localStorage.setItem('user', JSON.stringify(result.user))
//           localStorage.setItem('userType', result.userType)
//           router.push('/member-dashboard')
//         }, 2000)
//       } else {
//         setError(result.error)
//       }

//     } catch (error) {
//       setError('Registration failed. Please try again.')
//       console.error('Signup error:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-architecture bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center relative px-4 sm:px-6 lg:px-8">
      
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
//       <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        
//         {/* Header */}
//         <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gold mb-6 sm:mb-8 text-center drop-shadow-2xl px-2">
//           Burhani Guards Marol
//         </h1>

//         {/* Main Card */}
//         <div className="bg-white bg-opacity-95 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md mx-4">
          
//           {/* User Type Toggle (Member/Admin) */}
//           <div className="flex mb-4 sm:mb-6 bg-gray-100 rounded-xl p-1">
//             <button
//               onClick={() => toggleUserType('member')}
//               className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
//                 userType === 'member' 
//                   ? 'bg-gold text-white shadow-md transform scale-105' 
//                   : 'text-gray-600 hover:text-gold'
//               }`}
//             >
//               Member
//             </button>
//             <button
//               onClick={() => toggleUserType('admin')}
//               className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
//                 userType === 'admin' 
//                   ? 'bg-brown text-white shadow-md transform scale-105' 
//                   : 'text-gray-600 hover:text-brown'
//               }`}
//             >
//               Admin
//             </button>
//           </div>

//           {/* Mode Toggle (Login/Signup) - Only for members */}
//           {userType === 'member' && (
//             <div className="flex mb-4 sm:mb-6 bg-gray-50 rounded-lg p-1">
//               <button
//                 onClick={() => toggleMode('login')}
//                 className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all duration-300 ${
//                   mode === 'login' 
//                     ? 'bg-white text-gold shadow-sm' 
//                     : 'text-gray-600 hover:text-gold'
//                 }`}
//               >
//                 Login
//               </button>
//               <button
//                 onClick={() => toggleMode('signup')}
//                 className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all duration-300 ${
//                   mode === 'signup' 
//                     ? 'bg-white text-gold shadow-sm' 
//                     : 'text-gray-600 hover:text-gold'
//                 }`}
//               >
//                 Sign Up
//               </button>
//             </div>
//           )}

//           {/* Success Message */}
//           {success && (
//             <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
//               {success}
//             </div>
//           )}

//           {/* Error Message */}
//           {error && (
//             <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//               {error}
//             </div>
//           )}

//           {/* LOGIN FORM */}
//           {mode === 'login' && (
//             <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              
//               {/* Login ID Input */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {userType === 'member' ? 'ITS ID' : 'Email Address'}
//                 </label>
//                 <input
//                   type={userType === 'member' ? 'text' : 'email'}
//                   placeholder={userType === 'member' ? "Enter your ITS ID" : "Enter your email"}
//                   value={loginId}
//                   onChange={(e) => setLoginId(e.target.value)}
//                   className={`w-full border-2 border-gray-300 rounded-lg py-3 px-3 sm:px-4 text-base focus:outline-none focus:ring-2 transition-all duration-300 ${
//                     userType === 'member' 
//                       ? 'focus:ring-gold focus:border-gold' 
//                       : 'focus:ring-brown focus:border-brown'
//                   }`}
//                   required
//                 />
//               </div>

//               {/* Password Input */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className={`w-full border-2 border-gray-300 rounded-lg py-3 px-3 sm:px-4 text-base focus:outline-none focus:ring-2 transition-all duration-300 ${
//                     userType === 'member' 
//                       ? 'focus:ring-gold focus:border-gold'
//                       : 'focus:ring-brown focus:border-brown'
//                   }`}
//                   required
//                 />
//               </div>

//               {/* Login Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full py-4 rounded-lg font-semibold text-white text-base transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none ${
//                   userType === 'member' 
//                     ? 'bg-gold hover:bg-yellow-600 shadow-lg' 
//                     : 'bg-brown hover:bg-yellow-900 shadow-lg'
//                 }`}
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Logging in...
//                   </div>
//                 ) : (
//                   userType === 'member' ? 'Member Login' : 'Admin Login'
//                 )}
//               </button>
//             </form>
//           )}

//           {/* SIGNUP FORM - Only for members */}
//           {mode === 'signup' && userType === 'member' && (
//             <form onSubmit={handleSignup} className="space-y-4">
              
//               {/* Full Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter your full name"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   className="w-full border-2 border-gray-300 rounded-lg py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300"
//                   required
//                 />
//               </div>

//               {/* ITS ID */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   ITS ID
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter your ITS ID"
//                   value={loginId}
//                   onChange={(e) => setLoginId(e.target.value)}
//                   className="w-full border-2 border-gray-300 rounded-lg py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300"
//                   required
//                 />
//               </div>

//               {/* Phone Number */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   placeholder="Enter your phone number"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="w-full border-2 border-gray-300 rounded-lg py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300"
//                   required
//                 />
//               </div>

//               {/* Date of Birth (Optional) */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Date of Birth <span className="text-gray-500">(Optional)</span>
//                 </label>
//                 <input
//                   type="date"
//                   value={dateOfBirth}
//                   onChange={(e) => setDateOfBirth(e.target.value)}
//                   className="w-full border-2 border-gray-300 rounded-lg py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300"
//                 />
//               </div>

//               {/* Emergency Contact (Optional) */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Emergency Contact <span className="text-gray-500">(Optional)</span>
//                 </label>
//                 <input
//                   type="tel"
//                   placeholder="Emergency contact number"
//                   value={emergencyContact}
//                   onChange={(e) => setEmergencyContact(e.target.value)}
//                   className="w-full border-2 border-gray-300 rounded-lg py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300"
//                 />
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   placeholder="Create a password (min 6 characters)"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full border-2 border-gray-300 rounded-lg py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300"
//                   required
//                   minLength="6"
//                 />
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Confirm Password
//                 </label>
//                 <input
//                   type="password"
//                   placeholder="Confirm your password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="w-full border-2 border-gray-300 rounded-lg py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300"
//                   required
//                 />
//               </div>

//               {/* Signup Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-4 rounded-lg font-semibold text-white text-base bg-gold hover:bg-yellow-600 shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none"
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Creating Account...
//                   </div>
//                 ) : (
//                   'Create Member Account'
//                 )}
//               </button>
//             </form>
//           )}
//         </div>

//         {/* Footer */}
//         <p className="text-white text-xs sm:text-sm mt-6 text-center drop-shadow-lg px-2">
//           Community Finance Management System
//         </p>
//       </div>
//     </div>
//   )
// }

/*
ENHANCED LOGIN PAGE WITH PROFILE PHOTO UPLOAD & COMPRESSION
- Toggle between Member/Admin login
- Toggle between Login/Signup for members
- Complete member registration form with profile photo
- Image compression and optimization
- Responsive design maintained
*/

import { useState } from 'react'
import { useRouter } from 'next/router'
import { loginMember, loginAdmin, signupMember } from '../utils/auth'
import { uploadProfilePhoto, updateMemberPhotoUrl } from '../utils/photoUpload'

export default function LoginPage() {
  const router = useRouter()
  
  // STATE: User type and mode management
  const [userType, setUserType] = useState('member') // member or admin
  const [mode, setMode] = useState('login') // login or signup
  
  // STATE: Login form
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  
  // STATE: Signup form (additional fields)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // STATE: Profile photo
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [compressionProgress, setCompressionProgress] = useState('')
  
  // STATE: UI management
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // FUNCTION: Handle user type toggle (Member/Admin)
  const toggleUserType = (type) => {
    setUserType(type)
    setMode('login') // Reset to login mode when switching user type
    clearForm()
  }

  // FUNCTION: Handle mode toggle (Login/Signup) - only for members
  const toggleMode = (newMode) => {
    setMode(newMode)
    clearForm()
  }

  // FUNCTION: Clear all form fields
  const clearForm = () => {
    setLoginId('')
    setPassword('')
    setFullName('')
    setPhone('')
    setDateOfBirth('')
    setEmergencyContact('')
    setConfirmPassword('')
    setProfilePhoto(null)
    setPhotoPreview(null)
    setCompressionProgress('')
    setError('')
    setSuccess('')
  }

  // FUNCTION: Handle profile photo selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    
    if (!file) {
      setProfilePhoto(null)
      setPhotoPreview(null)
      setCompressionProgress('')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setProfilePhoto(file)
    setError('')
    setCompressionProgress(`Original size: ${(file.size / 1024).toFixed(0)}KB`)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setPhotoPreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  // FUNCTION: Handle login
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let result

      if (userType === 'member') {
        result = await loginMember(loginId, password)
      } else {
        result = await loginAdmin(loginId, password)
      }

      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user))
        localStorage.setItem('userType', result.userType)

        if (result.userType === 'member') {
          router.push('/member-dashboard')
        } else {
          router.push('/admin-dashboard')
        }
      } else {
        setError(result.error)
      }

    } catch (error) {
      setError('Login failed. Please try again.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  // FUNCTION: Handle member signup with photo upload
  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      // Step 1: Create member account
      const memberData = {
        itsId: loginId,
        email: loginId, // For signup, loginId will be email
        password,
        fullName,
        phone,
        dateOfBirth: dateOfBirth || null,
        emergencyContact: emergencyContact || null
      }

      console.log('🔍 Creating member account...')
      const result = await signupMember(memberData)

      if (!result.success) {
        throw new Error(result.error)
      }

      console.log('✅ Member account created successfully')

      // Step 2: Upload and compress profile photo if provided
      let photoUrl = null
      if (profilePhoto) {
        setCompressionProgress('Compressing image...') // Show compression feedback
        console.log('🔍 Compressing and uploading profile photo...')
        
        const uploadResult = await uploadProfilePhoto(profilePhoto, result.user.id)
        
        if (uploadResult.success) {
          photoUrl = uploadResult.url
          console.log('✅ Profile photo compressed and uploaded:', uploadResult.fileSize)
          setCompressionProgress('Photo compressed to ' + uploadResult.fileSize)
          
          // Step 3: Update member record with photo URL
          const updateResult = await updateMemberPhotoUrl(result.user.id, photoUrl)
          if (updateResult.success) {
            console.log('✅ Profile photo URL saved to database')
            result.user.profile_photo_url = photoUrl
          }
        } else {
          console.warn('⚠️ Failed to upload profile photo:', uploadResult.error)
          setCompressionProgress('Photo upload failed: ' + uploadResult.error)
        }
      }

      setSuccess(result.message + (photoUrl ? ' Profile photo uploaded successfully!' : ''))
      
      // Auto-login after successful signup
      setTimeout(() => {
        localStorage.setItem('user', JSON.stringify(result.user))
        localStorage.setItem('userType', result.userType)
        router.push('/member-dashboard')
      }, 2000)

    } catch (error) {
      setError('Registration failed: ' + error.message)
      console.error('Signup error:', error)
    } finally {
      setLoading(false)
      setCompressionProgress('')
    }
  }

  return (
    <div className="min-h-screen bg-architecture bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center relative px-4 sm:px-6 lg:px-8">
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gold mb-6 sm:mb-8 text-center drop-shadow-2xl px-2">
          Burhani Guards Marol
        </h1>

        {/* Main Card */}
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md mx-4">
          
          {/* User Type Toggle (Member/Admin) */}
          <div className="flex mb-4 sm:mb-6 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => toggleUserType('member')}
              className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
                userType === 'member' 
                  ? 'bg-gold text-white shadow-md transform scale-105' 
                  : 'text-gray-600 hover:text-gold'
              }`}
            >
              Member
            </button>
            <button
              onClick={() => toggleUserType('admin')}
              className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
                userType === 'admin' 
                  ? 'bg-brown text-white shadow-md transform scale-105' 
                  : 'text-gray-600 hover:text-brown'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Mode Toggle (Login/Signup) - Only for members */}
          {userType === 'member' && (
            <div className="flex mb-4 sm:mb-6 bg-gray-50 rounded-lg p-1">
              <button
                onClick={() => toggleMode('login')}
                className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all duration-300 ${
                  mode === 'login' 
                    ? 'bg-white text-gold shadow-sm' 
                    : 'text-gray-600 hover:text-gold'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => toggleMode('signup')}
                className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all duration-300 ${
                  mode === 'signup' 
                    ? 'bg-white text-gold shadow-sm' 
                    : 'text-gray-600 hover:text-gold'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              
              {/* Login ID Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {userType === 'member' ? 'ITS ID' : 'Email Address'}
                </label>
                <input
                  type={userType === 'member' ? 'text' : 'email'}
                  placeholder={userType === 'member' ? "Enter your ITS ID" : "Enter your email"}
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className={`w-full border-2 border-gray-300 rounded-lg py-3 px-3 sm:px-4 text-base focus:outline-none focus:ring-2 transition-all duration-300 ${
                    userType === 'member' 
                      ? 'focus:ring-gold focus:border-gold' 
                      : 'focus:ring-brown focus:border-brown'
                  }`}
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full border-2 border-gray-300 rounded-lg py-3 px-3 sm:px-4 text-base focus:outline-none focus:ring-2 transition-all duration-300 ${
                    userType === 'member' 
                      ? 'focus:ring-gold focus:border-gold'
                      : 'focus:ring-brown focus:border-brown'
                  }`}
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-lg font-semibold text-white text-base transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none ${
                  userType === 'member' 
                    ? 'bg-gold hover:bg-yellow-600 shadow-lg' 
                    : 'bg-brown hover:bg-yellow-900 shadow-lg'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  userType === 'member' ? 'Member Login' : 'Admin Login'
                )}
              </button>
            </form>
          )}

          {/* SIGNUP FORM WITH PHOTO UPLOAD - Only for members */}
          {mode === 'signup' && userType === 'member' && (
            <form onSubmit={handleSignup} className="space-y-4">
              
              {/* Profile Photo Upload with Compression Feedback */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo <span className="text-gray-500">(Optional)</span>
                </label>
                
                <div className="flex items-center space-x-4">
                  {/* Photo Preview */}
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">Photo</span>
                    )}
                  </div>
                  
                  {/* File Input */}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full text-sm text-gray-600 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gold file:text-white hover:file:bg-yellow-600 file:cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max 5MB, will be compressed to ~100KB</p>
                    
                    {/* Compression Progress */}
                    {compressionProgress && (
                      <p className="text-xs text-blue-600 mt-1 font-medium">
                        {compressionProgress}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300"
                  required
                />
              </div>

              {/* ITS ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ITS ID
                </label>
                <input
                  type="text"
                  placeholder="Enter your ITS ID"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300"
                  required
                />
              </div>

              {/* Date of Birth (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300"
                />
              </div>

              {/* Emergency Contact (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="Emergency contact number"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300"
                  required
                  minLength="6"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300"
                  required
                />
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-lg font-semibold text-white text-base bg-gold hover:bg-yellow-600 shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Member Account'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-white text-xs sm:text-sm mt-6 text-center drop-shadow-lg px-2">
          Community Finance Management System
        </p>
      </div>
    </div>
  )
}
