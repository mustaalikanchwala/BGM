// /*
// COMPLETE MEMBER DASHBOARD
// - Member profile with photo upload
// - Payment history table with all requested columns
// - Add comments functionality
// - Personal information management
// - Mobile responsive Islamic theme
// */

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/router'
// import Link from 'next/link'
// import { supabase } from '../utils/supabase'

// export default function MemberDashboard() {
//   const router = useRouter()
  
//   // STATE: User and data management
//   const [user, setUser] = useState(null)
//   const [memberData, setMemberData] = useState(null)
//   const [payments, setPayments] = useState([])
//   const [duties, setDuties] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [activeTab, setActiveTab] = useState('profile')
  
//   // STATE: Edit functionality
//   const [isEditing, setIsEditing] = useState(false)
//   const [editForm, setEditForm] = useState({})
//   const [newComment, setNewComment] = useState('')

//   // Load user data on component mount
//   useEffect(() => {
//     const userData = localStorage.getItem('user')
//     const userType = localStorage.getItem('userType')
    
//     if (!userData || userType !== 'member') {
//       router.push('/')
//       return
//     }
    
//     const parsedUser = JSON.parse(userData)
//     setUser(parsedUser)
//     setEditForm(parsedUser)
//     loadMemberData(parsedUser.id)
//   }, [])

//   // Load member data, payments, and duties
//   const loadMemberData = async (memberId) => {
//     try {
//       setLoading(true)
      
//       // Load member details
//       const { data: memberData, error: memberError } = await supabase
//         .from('members')
//         .select('*')
//         .eq('id', memberId)
//         .single()

//       if (memberError) throw memberError
//       setMemberData(memberData)

//       // Load payment history
//       const { data: paymentsData, error: paymentsError } = await supabase
//         .from('payments')
//         .select('*')
//         .eq('member_id', memberId)
//         .order('payment_date', { ascending: false })

//       if (!paymentsError) setPayments(paymentsData || [])

//       // Load duty assignments
//       const { data: dutiesData, error: dutiesError } = await supabase
//         .from('duties')
//         .select('*')
//         .eq('member_id', memberId)
//         .order('duty_date', { ascending: false })

//       if (!dutiesError) setDuties(dutiesData || [])

//     } catch (error) {
//       console.error('Error loading member data:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

// // Simplified and safer profile update function
// const handleUpdateProfile = async () => {
//   try {
//     console.log('🔍 Updating profile for user:', user?.full_name);
    
//     if (!user?.id) {
//       throw new Error('No valid user ID found. Please login again.');
//     }

//     // Simple update without .select() or .single() to avoid 406 errors
//     const { error } = await supabase
//       .from('members')
//       .update({
//         full_name: editForm.full_name,
//         phone: editForm.phone,
//         address: editForm.address,
//         emergency_contact: editForm.emergency_contact
//       })
//       .eq('id', user.id)

//     console.log('🔍 Update result:', { error });

//     if (error) {
//       throw new Error('Update failed: ' + error.message);
//     }

//     console.log('✅ Profile update successful');

//     // Update local state immediately
//     const updatedUser = {
//       ...user,
//       full_name: editForm.full_name,
//       phone: editForm.phone,
//       address: editForm.address,
//       emergency_contact: editForm.emergency_contact
//     };

//     setUser(updatedUser);
//     setMemberData(updatedUser);
//     setIsEditing(false);
//     localStorage.setItem('user', JSON.stringify(updatedUser));
    
//     alert('Profile updated successfully!');
    
//   } catch (error) {
//     console.error('❌ Profile update error:', error);
//     alert('Error updating profile: ' + error.message);
//   }
// }




//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem('user')
//     localStorage.removeItem('userType')
//     router.push('/')
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-cream flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-cream">
      
//       {/* HEADER NAVIGATION */}
//       <div className="bg-white shadow-lg border-b-4 border-gold">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16 sm:h-20">
            
//             {/* Logo and Title */}
//             <div className="flex items-center">
//               <h1 className="text-2xl sm:text-3xl font-bold text-brown">
//                 Burhani Guards Marol
//               </h1>
//             </div>

//             {/* Navigation Buttons */}
//             <div className="flex items-center space-x-2 sm:space-x-4">
//               <div className="hidden sm:block text-sm text-gray-600">
//                 Welcome, <span className="font-semibold text-brown">{user?.full_name}</span>
//               </div>
              
//               <Link 
//                 href="/admin-dashboard"
//                 className="bg-brown text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-900 transition-colors duration-300"
//               >
//                 Admin View
//               </Link>
              
//               <button 
//                 onClick={handleLogout}
//                 className="bg-gold text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors duration-300"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MAIN CONTENT */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
//         {/* MEMBER PROFILE CARD */}
//         <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          
//           {/* Profile Header */}
//           <div className="bg-gradient-to-r from-gold to-yellow-500 p-6 sm:p-8">
//             <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              
//               {/* Circular Photo Frame */}
//               <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
//                 {memberData?.profile_photo_url ? (
//                   <img 
//                     src={memberData.profile_photo_url} 
//                     alt={user?.full_name}
//                     className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gray-200 flex items-center justify-center">
//                     <span className="text-2xl sm:text-4xl font-bold text-gray-500">
//                       {user?.full_name?.charAt(0) || 'M'}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Member Info */}
//               <div className="flex-1 text-center sm:text-left text-white">
//                 <h2 className="text-2xl sm:text-3xl font-bold mb-2">{user?.full_name}</h2>
//                 <div className="space-y-1 text-sm sm:text-base opacity-90">
//                   <p><span className="font-semibold">ITS ID:</span> {user?.its_id}</p>
//                   <p><span className="font-semibold">Member Type:</span> {memberData?.member_type}</p>
//                   <p><span className="font-semibold">Email:</span> {user?.email}</p>
//                   <p><span className="font-semibold">Phone:</span> {memberData?.phone || 'Not provided'}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Tab Navigation */}
//           <div className="border-b border-gray-200">
//             <nav className="flex space-x-8 px-6 sm:px-8">
//               {['profile', 'payments', 'duties', 'comments'].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors duration-300 ${
//                     activeTab === tab
//                       ? 'border-gold text-gold'
//                       : 'border-transparent text-gray-500 hover:text-brown hover:border-gray-300'
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           {/* Tab Content */}
//           <div className="p-6 sm:p-8">
            
//             {/* PROFILE TAB */}
//             {activeTab === 'profile' && (
//               <div className="space-y-6">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-xl font-semibold text-brown">Personal Information</h3>
//                   <button
//                     onClick={() => setIsEditing(!isEditing)}
//                     className="bg-gold text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-300"
//                   >
//                     {isEditing ? 'Cancel' : 'Edit Profile'}
//                   </button>
//                 </div>

//                 {isEditing ? (
//                   // Edit Form
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//                       <input
//                         type="text"
//                         value={editForm.full_name || ''}
//                         onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
//                         className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//                       <input
//                         type="tel"
//                         value={editForm.phone || ''}
//                         onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
//                         className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
//                       />
//                     </div>
                    
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
//                       <textarea
//                         value={editForm.address || ''}
//                         onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
//                         rows="3"
//                         className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
//                       <input
//                         type="tel"
//                         value={editForm.emergency_contact || ''}
//                         onChange={(e) => setEditForm({ ...editForm, emergency_contact: e.target.value })}
//                         className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
//                       />
//                     </div>

//                     <div className="md:col-span-2">
//                       <button
//                         onClick={handleUpdateProfile}
//                         className="bg-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-300"
//                       >
//                         Save Changes
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   // View Mode
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
//                         <p className="text-gray-900">{memberData?.address || 'Not provided'}</p>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
//                         <p className="text-gray-900">{memberData?.date_of_birth || 'Not provided'}</p>
//                       </div>
//                     </div>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500 mb-1">Emergency Contact</label>
//                         <p className="text-gray-900">{memberData?.emergency_contact || 'Not provided'}</p>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-500 mb-1">Registration Date</label>
//                         <p className="text-gray-900">{new Date(memberData?.created_at).toLocaleDateString()}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* PAYMENTS TAB */}
//             {activeTab === 'payments' && (
//               <div className="space-y-6">
//                 <h3 className="text-xl font-semibold text-brown">Payment History</h3>
                
//                 {payments.length > 0 ? (
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//                       <thead className="bg-gold bg-opacity-20">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Date</th>
//                           <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Total Due (Yearly)</th>
//                           <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Transaction Amount</th>
//                           <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Total Paid</th>
//                           <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Pending Amount</th>
//                           <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Status</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {payments.map((payment) => (
//                           <tr key={payment.id} className="hover:bg-gray-50">
//                             <td className="px-4 py-3 text-sm text-gray-900">
//                               {new Date(payment.payment_date).toLocaleDateString()}
//                             </td>
//                             <td className="px-4 py-3 text-sm text-gray-900">
//                               ₹{payment.total_due_yearly?.toLocaleString() || '0'}
//                             </td>
//                             <td className="px-4 py-3 text-sm text-gray-900">
//                               ₹{payment.transaction_amount?.toLocaleString() || '0'}
//                             </td>
//                             <td className="px-4 py-3 text-sm text-gray-900">
//                               ₹{payment.total_paid?.toLocaleString() || '0'}
//                             </td>
//                             <td className="px-4 py-3 text-sm text-gray-900">
//                               ₹{payment.pending_amount?.toLocaleString() || '0'}
//                             </td>
//                             <td className="px-4 py-3 text-sm">
//                               <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                                 payment.payment_status === 'completed' 
//                                   ? 'bg-green-100 text-green-800'
//                                   : payment.payment_status === 'pending'
//                                   ? 'bg-yellow-100 text-yellow-800'
//                                   : 'bg-red-100 text-red-800'
//                               }`}>
//                                 {payment.payment_status}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div className="text-center py-8">
//                     <p className="text-gray-500">No payment history available</p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* DUTIES TAB */}
//             {activeTab === 'duties' && (
//               <div className="space-y-6">
//                 <h3 className="text-xl font-semibold text-brown">Duty Assignments</h3>
                
//                 {duties.length > 0 ? (
//                   <div className="grid gap-4">
//                     {duties.map((duty) => (
//                       <div key={duty.id} className="border border-gray-200 rounded-lg p-4 hover:border-gold transition-colors duration-300">
//                         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
//                           <div className="flex-1">
//                             <h4 className="font-semibold text-brown text-lg">{duty.duty_title}</h4>
//                             <p className="text-gray-600 text-sm mt-1">{duty.duty_description}</p>
//                             <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
//                               <span>📅 {new Date(duty.duty_date).toLocaleDateString()}</span>
//                               {duty.duty_time_start && (
//                                 <span>⏰ {duty.duty_time_start} - {duty.duty_time_end}</span>
//                               )}
//                               {duty.duty_location && (
//                                 <span>📍 {duty.duty_location}</span>
//                               )}
//                             </div>
//                           </div>
//                           <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                             duty.duty_status === 'completed' 
//                               ? 'bg-green-100 text-green-800'
//                               : duty.duty_status === 'assigned'
//                               ? 'bg-blue-100 text-blue-800'
//                               : 'bg-gray-100 text-gray-800'
//                           }`}>
//                             {duty.duty_status}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8">
//                     <p className="text-gray-500">No duty assignments available</p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* COMMENTS TAB */}
//             {activeTab === 'comments' && (
//               <div className="space-y-6">
//                 <h3 className="text-xl font-semibold text-brown">Comments & Notes</h3>
                
//                 {/* Add Comment */}
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Add Comment</label>
//                   <div className="flex space-x-3">
//                     <input
//                       type="text"
//                       value={newComment}
//                       onChange={(e) => setNewComment(e.target.value)}
//                       placeholder="Enter your comment..."
//                       className="flex-1 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
//                       onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
//                     />
//                     <button
//                       onClick={handleAddComment}
//                       className="bg-gold text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-300"
//                     >
//                       Add
//                     </button>
//                   </div>
//                 </div>

//                 {/* Comments Display */}
//                 <div className="bg-gray-50 rounded-lg p-4 min-h-32">
//                   {memberData?.comments ? (
//                     <div className="whitespace-pre-line text-gray-700">
//                       {memberData.comments}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 italic">No comments yet. Add your first comment above.</p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



/*
COMPLETE MEMBER DASHBOARD - Comments functionality removed
- Member profile with photo upload
- Payment history table with all requested columns  
- Personal information management
- Mobile responsive Islamic theme
*/

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../utils/supabase'

export default function MemberDashboard() {
  const router = useRouter()
  
  // STATE: User and data management
  const [user, setUser] = useState(null)
  const [memberData, setMemberData] = useState(null)
  const [payments, setPayments] = useState([])
  const [duties, setDuties] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  
  // STATE: Edit functionality
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})

  // Load user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user')
    const userType = localStorage.getItem('userType')
    
    if (!userData || userType !== 'member') {
      router.push('/')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setEditForm(parsedUser)
    loadMemberData(parsedUser.id)
  }, [])

  // Load member data, payments, and duties
  const loadMemberData = async (memberId) => {
    try {
      setLoading(true)
      
      // Load member details
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('id', memberId)
        .single()

      if (memberError) throw memberError
      setMemberData(memberData)

      // Load payment history
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('member_id', memberId)
        .order('payment_date', { ascending: false })

      if (!paymentsError) setPayments(paymentsData || [])

      // Load duty assignments
      const { data: dutiesData, error: dutiesError } = await supabase
        .from('duties')
        .select('*')
        .eq('member_id', memberId)
        .order('duty_date', { ascending: false })

      if (!dutiesError) setDuties(dutiesData || [])

    } catch (error) {
      console.error('Error loading member data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Simplified and safer profile update function
  const handleUpdateProfile = async () => {
    try {
      console.log('🔍 Updating profile for user:', user?.full_name);
      
      if (!user?.id) {
        throw new Error('No valid user ID found. Please login again.');
      }

      // Simple update without .select() or .single() to avoid 406 errors
      const { error } = await supabase
        .from('members')
        .update({
          full_name: editForm.full_name,
          phone: editForm.phone,
          address: editForm.address,
          emergency_contact: editForm.emergency_contact
        })
        .eq('id', user.id)

      console.log('🔍 Update result:', { error });

      if (error) {
        throw new Error('Update failed: ' + error.message);
      }

      console.log('✅ Profile update successful');

      // Update local state immediately
      const updatedUser = {
        ...user,
        full_name: editForm.full_name,
        phone: editForm.phone,
        address: editForm.address,
        emergency_contact: editForm.emergency_contact
      };

      setUser(updatedUser);
      setMemberData(updatedUser);
      setIsEditing(false);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('❌ Profile update error:', error);
      alert('Error updating profile: ' + error.message);
    }
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      
      {/* HEADER NAVIGATION */}
      <div className="bg-white shadow-lg border-b-4 border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            
            {/* Logo and Title */}
            <div className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-brown">
                Burhani Guards Marol
              </h1>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block text-sm text-gray-600">
                Welcome, <span className="font-semibold text-brown">{user?.full_name}</span>
              </div>
              
              <Link 
                href="/admin-dashboard"
                className="bg-brown text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-900 transition-colors duration-300"
              >
                Admin View
              </Link>
              
              <button 
                onClick={handleLogout}
                className="bg-gold text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* MEMBER PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gold to-yellow-500 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              
              {/* Circular Photo Frame */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                {memberData?.profile_photo_url ? (
                  <img 
                    src={memberData.profile_photo_url} 
                    alt={user?.full_name}
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl sm:text-4xl font-bold text-gray-500">
                      {user?.full_name?.charAt(0) || 'M'}
                    </span>
                  </div>
                )}
              </div>

              {/* Member Info */}
              <div className="flex-1 text-center sm:text-left text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">{user?.full_name}</h2>
                <div className="space-y-1 text-sm sm:text-base opacity-90">
                  <p><span className="font-semibold">ITS ID:</span> {user?.its_id}</p>
                  <p><span className="font-semibold">Member Type:</span> {memberData?.member_type}</p>
                  <p><span className="font-semibold">Email:</span> {user?.email}</p>
                  <p><span className="font-semibold">Phone:</span> {memberData?.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation - REMOVED 'comments' from array */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 sm:px-8">
              {['profile', 'payments', 'duties'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors duration-300 ${
                    activeTab === tab
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-500 hover:text-brown hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-brown">Personal Information</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-gold text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-300"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {isEditing ? (
                  // Edit Form
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={editForm.full_name || ''}
                        onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                        className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={editForm.phone || ''}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea
                        value={editForm.address || ''}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        rows="3"
                        className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                      <input
                        type="tel"
                        value={editForm.emergency_contact || ''}
                        onChange={(e) => setEditForm({ ...editForm, emergency_contact: e.target.value })}
                        className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <button
                        onClick={handleUpdateProfile}
                        className="bg-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-300"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                        <p className="text-gray-900">{memberData?.address || 'Not provided'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                        <p className="text-gray-900">{memberData?.date_of_birth || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Emergency Contact</label>
                        <p className="text-gray-900">{memberData?.emergency_contact || 'Not provided'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Registration Date</label>
                        <p className="text-gray-900">{new Date(memberData?.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-brown">Payment History</h3>
                
                {payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gold bg-opacity-20">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Total Due (Yearly)</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Transaction Amount</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Total Paid</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Pending Amount</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {payments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {new Date(payment.payment_date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              ₹{payment.total_due_yearly?.toLocaleString() || '0'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              ₹{payment.transaction_amount?.toLocaleString() || '0'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              ₹{payment.total_paid?.toLocaleString() || '0'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              ₹{payment.pending_amount?.toLocaleString() || '0'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                payment.payment_status === 'completed' 
                                  ? 'bg-green-100 text-green-800'
                                  : payment.payment_status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {payment.payment_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No payment history available</p>
                  </div>
                )}
              </div>
            )}

            {/* DUTIES TAB */}
            {activeTab === 'duties' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-brown">Duty Assignments</h3>
                
                {duties.length > 0 ? (
                  <div className="grid gap-4">
                    {duties.map((duty) => (
                      <div key={duty.id} className="border border-gray-200 rounded-lg p-4 hover:border-gold transition-colors duration-300">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                          <div className="flex-1">
                            <h4 className="font-semibold text-brown text-lg">{duty.duty_title}</h4>
                            <p className="text-gray-600 text-sm mt-1">{duty.duty_description}</p>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                              <span>📅 {new Date(duty.duty_date).toLocaleDateString()}</span>
                              {duty.duty_time_start && (
                                <span>⏰ {duty.duty_time_start} - {duty.duty_time_end}</span>
                              )}
                              {duty.duty_location && (
                                <span>📍 {duty.duty_location}</span>
                              )}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            duty.duty_status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : duty.duty_status === 'assigned'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {duty.duty_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No duty assignments available</p>
                  </div>
                )}
              </div>
            )}

            {/* COMMENTS TAB COMPLETELY REMOVED */}
          </div>
        </div>
      </div>
    </div>
  )
}
