// File upload utility for handling file uploads to Supabase Storage
import { supabase } from './supabase';

export interface UploadOptions {
  maxSize?: number; // in MB
  allowedTypes?: string[];
  folder?: string;
}

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
}

// Upload file to Supabase Storage
export const uploadFile = async (
  file: File, 
  options: UploadOptions = {}
): Promise<UploadResult> => {
  const {
    maxSize = 10,
    allowedTypes = ['image/*', 'video/*'],
    folder = 'uploads'
  } = options;

  // Validate file size
  if (file.size > maxSize * 1024 * 1024) {
    throw new Error(`File size must be less than ${maxSize}MB`);
  }

  // Validate file type
  const isValidType = allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const category = type.split('/')[0];
      return file.type.startsWith(category);
    }
    return file.type === type;
  });

  if (!isValidType) {
    throw new Error(`File type not supported. Allowed types: ${allowedTypes.join(', ')}`);
  }

  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('nail-salon-uploads')
      .upload(filePath, file);

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('nail-salon-uploads')
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      filename: fileName,
      size: file.size,
      type: file.type
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Example integration with Supabase Storage
export const uploadToSupabase = async (
  file: File,
  bucket: string = 'public',
  folder: string = 'uploads'
): Promise<UploadResult> => {
  // This would require @supabase/storage-js
  // import { createClient } from '@supabase/supabase-js'
  
  // const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!)
  
  // const fileName = `${Date.now()}-${file.name}`
  // const filePath = `${folder}/${fileName}`
  
  // const { data, error } = await supabase.storage
  //   .from(bucket)
  //   .upload(filePath, file)
  
  // if (error) throw error
  
  // const { data: { publicUrl } } = supabase.storage
  //   .from(bucket)
  //   .getPublicUrl(filePath)
  
  // return {
  //   url: publicUrl,
  //   filename: fileName,
  //   size: file.size,
  //   type: file.type
  // }

  // For now, return the local URL
  return uploadFile(file);
};

// Example integration with Cloudinary
export const uploadToCloudinary = async (
  file: File,
  folder: string = 'nail-salon'
): Promise<UploadResult> => {
  // This would require cloudinary-react or similar
  // const formData = new FormData()
  // formData.append('file', file)
  // formData.append('upload_preset', 'your_upload_preset')
  // formData.append('folder', folder)
  
  // const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
  //   method: 'POST',
  //   body: formData
  // })
  
  // const data = await response.json()
  
  // return {
  //   url: data.secure_url,
  //   filename: data.original_filename,
  //   size: data.bytes,
  //   type: data.format
  // }

  // For now, return the local URL
  return uploadFile(file);
};

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (fileType: string): string => {
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType.startsWith('video/')) return '🎥';
  if (fileType.startsWith('audio/')) return '🎵';
  return '📄';
};

export const validateFile = (file: File, options: UploadOptions = {}): string | null => {
  const { maxSize = 10, allowedTypes = ['image/*', 'video/*'] } = options;

  // Check file size
  if (file.size > maxSize * 1024 * 1024) {
    return `File size must be less than ${maxSize}MB`;
  }

  // Check file type
  const isValidType = allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const category = type.split('/')[0];
      return file.type.startsWith(category);
    }
    return file.type === type;
  });

  if (!isValidType) {
    return `File type not supported. Allowed types: ${allowedTypes.join(', ')}`;
  }

  return null;
};

