/*
CLEANED UP AUTHENTICATION UTILITIES - No RPC calls
Fixed for immediate functionality
*/

import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

// FUNCTION: Member login with ITS ID and password (CLEANED UP)
export const loginMember = async (itsId, password) => {
  try {
    const { data: member, error } = await supabase
      .from('members')
      .select('*')
      .eq('its_id', itsId)
      .eq('is_active', true)
      .single()

    if (error || !member) {
      throw new Error('Invalid ITS ID or member not found')
    }

    const passwordMatch = await bcrypt.compare(password, member.password_hash)
    if (!passwordMatch) {
      throw new Error('Invalid password')
    }

    // REMOVED the problematic RPC call - just return member data
    const { password_hash, ...memberData } = member
    return {
      success: true,
      user: memberData,
      userType: 'member'
    }

  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// FUNCTION: Admin login with debugging
export const loginAdmin = async (email, password) => {
  try {
    console.log('🔍 Login attempt for:', email);
    
    // Get admin from database
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single()

    console.log('🔍 Database query result:', { admin, error });

    if (error || !admin) {
      console.log('❌ Admin not found');
      throw new Error('Invalid email or admin not found')
    }

    console.log('🔍 Found admin:', admin.email);
    console.log('🔍 Stored hash length:', admin.password_hash.length);
    console.log('🔍 Input password:', password);
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, admin.password_hash)
    console.log('🔍 Password match result:', passwordMatch);

    if (!passwordMatch) {
      console.log('❌ Password verification failed');
      throw new Error('Invalid password')
    }

    // Success path...
    console.log('✅ Login successful');
    
    const { password_hash, ...adminData } = admin
    return {
      success: true,
      user: adminData,
      userType: 'admin'
    }

  } catch (error) {
    console.log('❌ Login error:', error.message);
    return {
      success: false,
      error: error.message
    }
  }
}


// FUNCTION: Member signup (SIMPLIFIED)
export const signupMember = async (memberData) => {
  try {
    const { itsId, email, password, fullName, phone, dateOfBirth, emergencyContact } = memberData

    // Check if ITS ID already exists
    const { data: existingMember } = await supabase
      .from('members')
      .select('its_id')
      .eq('its_id', itsId)
      .single()

    if (existingMember) {
      throw new Error('ITS ID already registered')
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert new member (SIMPLIFIED - no complex RPC calls)
    const { data: newMember, error } = await supabase
      .from('members')
      .insert([
        {
          its_id: itsId,
          email: email.toLowerCase(),
          password_hash: passwordHash,
          full_name: fullName,
          phone: phone,
          date_of_birth: dateOfBirth || null,
          emergency_contact: emergencyContact || null,
          member_type: 'member',
          registration_status: 'active',
          is_active: true
        }
      ])
      .select()
      .single()

    if (error) {
      throw new Error('Registration failed: ' + error.message)
    }

    const { password_hash, ...memberDataResponse } = newMember
    return {
      success: true,
      user: memberDataResponse,
      userType: 'member',
      message: 'Registration successful! Welcome to Burhani Guards Marol.'
    }

  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Admin dashboard can import hashPassword successfully
export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10)
  } catch (error) {
    throw new Error('Password hashing failed: ' + error.message)
  }
}
