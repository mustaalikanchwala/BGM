/*
COMPLETE ADMIN DASHBOARD
- Member list with CRUD operations
- Payment management for all members
- Duty assignment system
- Click member → view full history
- Islamic architectural theme
*/

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../utils/supabase'
import { hashPassword } from '../utils/auth'

export default function AdminDashboard() {
  const router = useRouter()
  
  // STATE: User and data management
  const [user, setUser] = useState(null)
  const [members, setMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [payments, setPayments] = useState([])
  const [duties, setDuties] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('members')
  
  // STATE: Modal management
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  const [showAddDutyModal, setShowAddDutyModal] = useState(false)
  const [showMemberDetailModal, setShowMemberDetailModal] = useState(false)
  
  // STATE: Forms
  const [memberForm, setMemberForm] = useState({
    its_id: '', email: '', full_name: '', phone: '', member_type: 'member', password: ''
  })
  const [paymentForm, setPaymentForm] = useState({
    member_id: '', total_due_yearly: '', transaction_amount: '', payment_date: '', payment_method: ''
  })
  const [dutyForm, setDutyForm] = useState({
    member_id: '', duty_title: '', duty_description: '', duty_date: '', duty_time_start: '', duty_time_end: '', duty_location: ''
  })

  // Load data on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user')
    const userType = localStorage.getItem('userType')
    
    if (!userData || userType !== 'admin') {
      router.push('/')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    loadAllData()
  }, [])

  // Load all data
  const loadAllData = async () => {
    try {
      setLoading(true)
      
      // Load members
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })

      if (!membersError) setMembers(membersData || [])

      // Load all payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          members (full_name, its_id)
        `)
        .order('payment_date', { ascending: false })

      if (!paymentsError) setPayments(paymentsData || [])

      // Load all duties
      const { data: dutiesData, error: dutiesError } = await supabase
        .from('duties')
        .select(`
          *,
          members (full_name, its_id)
        `)
        .order('duty_date', { ascending: false })

      if (!dutiesError) setDuties(dutiesData || [])

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Add new member - CORRECTED VERSION
const handleAddMember = async () => {
  try {
    // Hash the password first
    const hashedPassword = await hashPassword(memberForm.password)
    
    // Insert member with correct field names
    const { data, error } = await supabase
      .from('members')
      .insert([
        {
          its_id: memberForm.its_id,
          email: memberForm.email.toLowerCase(),
          password_hash: hashedPassword,  // Use password_hash, not password
          full_name: memberForm.full_name,
          phone: memberForm.phone,
          member_type: memberForm.member_type,
          is_active: true,
          registration_status: 'active'
        }
      ])
      .select()

    if (error) throw error
    
    setMembers([data[0], ...members])
    setShowAddMemberModal(false)
    setMemberForm({ its_id: '', email: '', full_name: '', phone: '', member_type: 'member', password: '' })
    
    alert('Member added successfully!')
    
  } catch (error) {
    console.error('Error adding member:', error)
    alert('Error adding member: ' + error.message)
  }
}

  // Add payment
  const handleAddPayment = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([
          {
            ...paymentForm,
            total_paid: parseFloat(paymentForm.transaction_amount) || 0,
            pending_amount: (parseFloat(paymentForm.total_due_yearly) || 0) - (parseFloat(paymentForm.transaction_amount) || 0),
            payment_status: 'completed',
            added_by: user.id
          }
        ])
        .select(`
          *,
          members (full_name, its_id)
        `)

      if (error) throw error
      
      setPayments([data[0], ...payments])
      setShowAddPaymentModal(false)
      setPaymentForm({ member_id: '', total_due_yearly: '', transaction_amount: '', payment_date: '', payment_method: '' })
      
    } catch (error) {
      console.error('Error adding payment:', error)
      alert('Error adding payment: ' + error.message)
    }
  }

  // Add duty
  const handleAddDuty = async () => {
    try {
      const { data, error } = await supabase
        .from('duties')
        .insert([
          {
            ...dutyForm,
            duty_status: 'assigned',
            assigned_by: user.id
          }
        ])
        .select(`
          *,
          members (full_name, its_id)
        `)

      if (error) throw error
      
      setDuties([data[0], ...duties])
      setShowAddDutyModal(false)
      setDutyForm({ member_id: '', duty_title: '', duty_description: '', duty_date: '', duty_time_start: '', duty_time_end: '', duty_location: '' })
      
    } catch (error) {
      console.error('Error adding duty:', error)
      alert('Error adding duty: ' + error.message)
    }
  }

  // Delete member
  const handleDeleteMember = async (memberId) => {
    if (!confirm('Are you sure you want to delete this member?')) return

    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId)

      if (error) throw error
      
      setMembers(members.filter(m => m.id !== memberId))
      
    } catch (error) {
      console.error('Error deleting member:', error)
      alert('Error deleting member: ' + error.message)
    }
  }

  // View member details
  const viewMemberDetails = async (member) => {
    setSelectedMember(member)
    setShowMemberDetailModal(true)
    
    // Load member's payments and duties
    try {
      const [paymentsRes, dutiesRes] = await Promise.all([
        supabase.from('payments').select('*').eq('member_id', member.id),
        supabase.from('duties').select('*').eq('member_id', member.id)
      ])
      
      setSelectedMember({
        ...member,
        payments: paymentsRes.data || [],
        duties: dutiesRes.data || []
      })
      
    } catch (error) {
      console.error('Error loading member details:', error)
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brown"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      
      {/* HEADER NAVIGATION */}
      <div className="bg-white shadow-lg border-b-4 border-brown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            
            {/* Logo and Title */}
            <div className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-brown">
                BGM Admin Panel
              </h1>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block text-sm text-gray-600">
                Admin: <span className="font-semibold text-brown">{user?.full_name}</span>
              </div>
              
              <Link 
                href="/member-dashboard"
                className="bg-gold text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors duration-300"
              >
                Member View
              </Link>
              
              <button 
                onClick={handleLogout}
                className="bg-brown text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-900 transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* STATISTICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gold">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gold bg-opacity-20">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{members.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-brown">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-brown bg-opacity-20">
                <svg className="w-8 h-8 text-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-tan">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-tan bg-opacity-20">
                <svg className="w-8 h-8 text-tan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Duties</p>
                <p className="text-2xl font-bold text-gray-900">{duties.filter(d => d.duty_status === 'assigned').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 sm:px-8">
              {['members', 'payments', 'duties'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors duration-300 ${
                    activeTab === tab
                      ? 'border-brown text-brown'
                      : 'border-transparent text-gray-500 hover:text-brown hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* TAB CONTENT */}
          <div className="p-6 sm:p-8">
            
            {/* MEMBERS TAB */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-brown">Member Management</h3>
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="bg-brown text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-900 transition-colors duration-300"
                  >
                    Add Member
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map((member) => (
                    <div key={member.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200 hover:border-gold">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-brown">{member.full_name}</h4>
                          <p className="text-sm text-gray-600 mt-1">ITS ID: {member.its_id}</p>
                          <p className="text-sm text-gray-600">Type: {member.member_type}</p>
                          <p className="text-sm text-gray-600">Email: {member.email}</p>
                          <p className="text-sm text-gray-600">Phone: {member.phone || 'N/A'}</p>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => viewMemberDetails(member)}
                            className="text-brown hover:text-gold font-semibold text-sm"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="text-red-600 hover:text-red-800 font-semibold text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-brown">Payment Management</h3>
                  <button
                    onClick={() => setShowAddPaymentModal(true)}
                    className="bg-brown text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-900 transition-colors duration-300"
                  >
                    Add Payment
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-brown bg-opacity-20">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Member</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brown">ITS ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Method</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brown">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{payment.members?.full_name || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{payment.members?.its_id || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{new Date(payment.payment_date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">₹{payment.transaction_amount?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{payment.payment_method || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              payment.payment_status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.payment_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DUTIES TAB */}
            {activeTab === 'duties' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-brown">Duty Management</h3>
                  <button
                    onClick={() => setShowAddDutyModal(true)}
                    className="bg-brown text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-900 transition-colors duration-300"
                  >
                    Assign Duty
                  </button>
                </div>

                <div className="grid gap-4">
                  {duties.map((duty) => (
                    <div key={duty.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-brown transition-colors duration-300">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-brown text-lg">{duty.duty_title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              duty.duty_status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : duty.duty_status === 'assigned'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {duty.duty_status}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{duty.duty_description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span>👤 {duty.members?.full_name || 'N/A'}</span>
                            <span>📅 {new Date(duty.duty_date).toLocaleDateString()}</span>
                            {duty.duty_time_start && (
                              <span>⏰ {duty.duty_time_start} - {duty.duty_time_end}</span>
                            )}
                            {duty.duty_location && (
                              <span>📍 {duty.duty_location}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD MEMBER MODAL */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-96 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-brown mb-4">Add New Member</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ITS ID</label>
                  <input
                    type="text"
                    value={memberForm.its_id}
                    onChange={(e) => setMemberForm({ ...memberForm, its_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                    placeholder="Enter ITS ID"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={memberForm.full_name}
                    onChange={(e) => setMemberForm({ ...memberForm, full_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Type</label>
                  <select
                    value={memberForm.member_type}
                    onChange={(e) => setMemberForm({ ...memberForm, member_type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                  >
                    <option value="member">Member</option>
                    <option value="sr">Sr</option>
                    <option value="leader">Leader</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={memberForm.password}
                    onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddMember}
                  className="flex-1 bg-brown text-white py-2 rounded-lg font-semibold hover:bg-yellow-900 transition-colors duration-300"
                >
                  Add Member
                </button>
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD PAYMENT MODAL */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-96 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-brown mb-4">Add Payment</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member</label>
                  <select
                    value={paymentForm.member_id}
                    onChange={(e) => setPaymentForm({ ...paymentForm, member_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                  >
                    <option value="">Select Member</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.full_name} ({member.its_id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Due (Yearly)</label>
                  <input
                    type="number"
                    value={paymentForm.total_due_yearly}
                    onChange={(e) => setPaymentForm({ ...paymentForm, total_due_yearly: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                    placeholder="Enter yearly due amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Amount</label>
                  <input
                    type="number"
                    value={paymentForm.transaction_amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transaction_amount: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                    placeholder="Enter payment amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                  <input
                    type="date"
                    value={paymentForm.payment_date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={paymentForm.payment_method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                  >
                    <option value="">Select Method</option>
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="upi">UPI</option>
                    <option value="check">Check</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddPayment}
                  className="flex-1 bg-brown text-white py-2 rounded-lg font-semibold hover:bg-yellow-900 transition-colors duration-300"
                >
                  Add Payment
                </button>
                <button
                  onClick={() => setShowAddPaymentModal(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD DUTY MODAL */}
      {showAddDutyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-96 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-brown mb-4">Assign Duty</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member</label>
                  <select
                    value={dutyForm.member_id}
                    onChange={(e) => setDutyForm({ ...dutyForm, member_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                  >
                    <option value="">Select Member</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.full_name} ({member.its_id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duty Title</label>
                  <input
                    type="text"
                    value={dutyForm.duty_title}
                    onChange={(e) => setDutyForm({ ...dutyForm, duty_title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                    placeholder="Enter duty title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={dutyForm.duty_description}
                    onChange={(e) => setDutyForm({ ...dutyForm, duty_description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                    rows="3"
                    placeholder="Enter duty description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duty Date</label>
                  <input
                    type="date"
                    value={dutyForm.duty_date}
                    onChange={(e) => setDutyForm({ ...dutyForm, duty_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={dutyForm.duty_time_start}
                      onChange={(e) => setDutyForm({ ...dutyForm, duty_time_start: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={dutyForm.duty_time_end}
                      onChange={(e) => setDutyForm({ ...dutyForm, duty_time_end: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={dutyForm.duty_location}
                    onChange={(e) => setDutyForm({ ...dutyForm, duty_location: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddDuty}
                  className="flex-1 bg-brown text-white py-2 rounded-lg font-semibold hover:bg-yellow-900 transition-colors duration-300"
                >
                  Assign Duty
                </button>
                <button
                  onClick={() => setShowAddDutyModal(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MEMBER DETAIL MODAL */}
      {showMemberDetailModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-brown">Member Details: {selectedMember.full_name}</h3>
                <button
                  onClick={() => setShowMemberDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Member Info */}
                <div>
                  <h4 className="font-semibold text-brown mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">ITS ID:</span> {selectedMember.its_id}</p>
                    <p><span className="font-medium">Email:</span> {selectedMember.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedMember.phone || 'N/A'}</p>
                    <p><span className="font-medium">Type:</span> {selectedMember.member_type}</p>
                    <p><span className="font-medium">Address:</span> {selectedMember.address || 'N/A'}</p>
                    <p><span className="font-medium">Emergency Contact:</span> {selectedMember.emergency_contact || 'N/A'}</p>
                  </div>
                </div>

                {/* Payment History */}
                <div>
                  <h4 className="font-semibold text-brown mb-3">Recent Payments</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedMember.payments?.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="text-sm border-b border-gray-200 pb-2">
                        <div className="flex justify-between">
                          <span>{new Date(payment.payment_date).toLocaleDateString()}</span>
                          <span>₹{payment.transaction_amount?.toLocaleString()}</span>
                        </div>
                      </div>
                    )) || <p className="text-sm text-gray-500">No payments recorded</p>}
                  </div>
                </div>

                {/* Duty History */}
                <div className="lg:col-span-2">
                  <h4 className="font-semibold text-brown mb-3">Recent Duties</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedMember.duties?.slice(0, 5).map((duty) => (
                      <div key={duty.id} className="text-sm border-b border-gray-200 pb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{duty.duty_title}</span>
                            <span className="text-gray-500 ml-2">{new Date(duty.duty_date).toLocaleDateString()}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            duty.duty_status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {duty.duty_status}
                          </span>
                        </div>
                      </div>
                    )) || <p className="text-sm text-gray-500">No duties assigned</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
