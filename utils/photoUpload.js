/*
OPTIMIZED PROFILE PHOTO UPLOAD WITH COMPRESSION
Automatically resizes and compresses photos for optimal performance
*/

import { supabase } from './supabase'
import imageCompression from 'browser-image-compression'

// FUNCTION: Advanced image compression
const compressImageAdvanced = async (file) => {
  const options = {
    maxSizeMB: 0.1, // 100KB max
    maxWidthOrHeight: 400,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.8
  }

  try {
    const compressedFile = await imageCompression(file, options)
    console.log('✅ Compressed from', (file.size / 1024).toFixed(2), 'KB to', (compressedFile.size / 1024).toFixed(2), 'KB')
    return compressedFile
  } catch (error) {
    console.error('Compression failed:', error)
    return file // Return original if compression fails
  }
}

// FUNCTION: Upload optimized profile photo
export const uploadProfilePhoto = async (file, userId) => {
  try {
    if (!file) throw new Error('No file provided')
    if (!file.type.startsWith('image/')) throw new Error('Please select an image file')

    // Compress image
    const compressedFile = await compressImageAdvanced(file)
    
    // Upload compressed file
    const fileName = `${userId}/profile.jpg`
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, compressedFile, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/jpeg'
      })

    if (error) throw new Error('Upload failed: ' + error.message)

    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName)

    return {
      success: true,
      url: publicUrl,
      fileSize: (compressedFile.size / 1024).toFixed(2) + ' KB'
    }

  } catch (error) {
    return { success: false, error: error.message }
  }
}

// FUNCTION: Update member profile photo URL in database
export const updateMemberPhotoUrl = async (userId, photoUrl) => {
  try {
    const { error } = await supabase
      .from('members')
      .update({ profile_photo_url: photoUrl })
      .eq('id', userId)

    if (error) {
      throw new Error('Failed to update profile photo: ' + error.message)
    }

    return { success: true }

  } catch (error) {
    console.error('❌ Database update error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
