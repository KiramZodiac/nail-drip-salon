# File Upload System

## Overview
The nail salon admin panel now includes comprehensive file upload functionality that allows users to upload images and videos directly from their device instead of just using URLs.

## Features

### ✅ **Drag & Drop Upload**
- Drag and drop files directly onto the upload area
- Visual feedback during drag operations
- Support for multiple file types

### ✅ **File Validation**
- **File Size Limits**: Configurable per upload type
  - Images: 5MB max
  - Videos: 50MB max
- **File Type Validation**: Only allows specified file types
- **Real-time Error Messages**: Clear feedback for validation errors

### ✅ **Upload Progress**
- Visual progress bar during upload
- Percentage display
- Upload status feedback

### ✅ **Multiple Upload Methods**
- **File Upload**: Direct device upload with drag & drop
- **URL Input**: Manual URL entry as fallback
- **Hybrid Approach**: Both methods available simultaneously

## Implementation

### **FileUpload Component**
Located at `src/components/FileUpload.tsx`

**Props:**
- `onUpload: (url: string) => void` - Callback when file is uploaded
- `accept?: string` - Accepted file types (default: "image/*,video/*")
- `maxSize?: number` - Maximum file size in MB (default: 10)
- `className?: string` - Additional CSS classes
- `disabled?: boolean` - Disable upload functionality

**Usage Example:**
```tsx
<FileUpload
  onUpload={(url) => setFormData({ ...formData, image_url: url })}
  accept="image/*"
  maxSize={5}
  disabled={uploading}
/>
```

### **File Upload Utility**
Located at `src/lib/fileUpload.ts`

**Functions:**
- `uploadFile(file, options)` - Upload file with validation
- `validateFile(file, options)` - Validate file before upload
- `formatFileSize(bytes)` - Format file size for display
- `getFileIcon(fileType)` - Get appropriate icon for file type

**Cloud Storage Integration:**
The utility includes placeholder functions for popular cloud storage services:
- **Supabase Storage**: `uploadToSupabase()`
- **Cloudinary**: `uploadToCloudinary()`
- **AWS S3**: Ready for integration

## Admin Panel Integration

### **Services Management**
- ✅ **Service Images**: Upload service photos
- ✅ **File Size**: 5MB limit for images
- ✅ **Fallback**: URL input still available

### **Training Management**
- ✅ **Course Images**: Upload course cover photos
- ✅ **Course Videos**: Upload training videos (50MB limit)
- ✅ **Media Gallery**: Upload training media files
- ✅ **File Types**: Images and videos supported

### **Gallery Management**
- ✅ **Nail Art Photos**: Upload gallery images
- ✅ **File Size**: 5MB limit for images
- ✅ **Categories**: Organize by service type

### **Staff Management**
- ✅ **Profile Photos**: Upload staff headshots
- ✅ **File Size**: 5MB limit for images
- ✅ **Professional Photos**: High-quality staff images

## File Upload Flow

1. **User selects file** (drag & drop or click)
2. **File validation** (size, type, format)
3. **Upload progress** (visual feedback)
4. **File processing** (resize, optimize if needed)
5. **URL generation** (local or cloud storage)
6. **Form integration** (automatic URL population)
7. **Success feedback** (toast notification)

## Production Setup

### **Current Implementation**
- **Local URLs**: Files are stored as local blob URLs
- **Temporary Storage**: Files persist only during session
- **Development Ready**: Perfect for testing and development

### **Production Integration**
To use in production, update `src/lib/fileUpload.ts`:

#### **Option 1: Supabase Storage**
```typescript
// Enable Supabase Storage
export const uploadFile = async (file: File, options: UploadOptions = {}): Promise<UploadResult> => {
  return uploadToSupabase(file, 'public', 'uploads');
};
```

#### **Option 2: Cloudinary**
```typescript
// Enable Cloudinary
export const uploadFile = async (file: File, options: UploadOptions = {}): Promise<UploadResult> => {
  return uploadToCloudinary(file, 'nail-salon');
};
```

#### **Option 3: AWS S3**
```typescript
// Add AWS S3 integration
import AWS from 'aws-sdk';

export const uploadToS3 = async (file: File, folder: string = 'uploads'): Promise<UploadResult> => {
  const s3 = new AWS.S3();
  const fileName = `${Date.now()}-${file.name}`;
  
  const params = {
    Bucket: 'your-bucket-name',
    Key: `${folder}/${fileName}`,
    Body: file,
    ContentType: file.type,
    ACL: 'public-read'
  };
  
  const result = await s3.upload(params).promise();
  
  return {
    url: result.Location,
    filename: fileName,
    size: file.size,
    type: file.type
  };
};
```

## File Type Support

### **Images**
- **Formats**: JPEG, PNG, GIF, WebP
- **Size Limit**: 5MB
- **Use Cases**: Service photos, gallery images, staff photos

### **Videos**
- **Formats**: MP4, WebM, MOV
- **Size Limit**: 50MB
- **Use Cases**: Training videos, course content

## Error Handling

### **Validation Errors**
- File size too large
- Unsupported file type
- Corrupted file

### **Upload Errors**
- Network connectivity issues
- Server errors
- Storage quota exceeded

### **User Feedback**
- Clear error messages
- Toast notifications
- Visual indicators

## Security Considerations

### **File Validation**
- MIME type checking
- File extension validation
- Size limits enforced

### **Upload Security**
- No executable files allowed
- Image/video files only
- Virus scanning (recommended for production)

### **Access Control**
- Admin-only uploads
- Authenticated users only
- Role-based permissions

## Performance Optimization

### **File Compression**
- Automatic image compression
- Video optimization
- Thumbnail generation

### **Caching**
- CDN integration ready
- Browser caching
- Progressive loading

### **Monitoring**
- Upload success rates
- File size analytics
- Performance metrics

## Troubleshooting

### **Common Issues**
1. **File too large**: Reduce file size or increase limits
2. **Unsupported format**: Convert to supported format
3. **Upload fails**: Check network connection
4. **URL not working**: Verify cloud storage setup

### **Debug Mode**
Enable debug logging in development:
```typescript
const DEBUG = process.env.NODE_ENV === 'development';
if (DEBUG) console.log('Upload details:', result);
```

## Future Enhancements

### **Planned Features**
- **Batch Upload**: Multiple files at once
- **Image Editing**: Crop, resize, filters
- **Video Processing**: Compression, thumbnails
- **Cloud Integration**: Multiple storage providers
- **Analytics**: Upload statistics and usage

### **Advanced Features**
- **AI Image Recognition**: Auto-tagging
- **Content Moderation**: Inappropriate content detection
- **Backup Systems**: Redundant storage
- **Version Control**: File versioning

## Support

For technical support or feature requests related to file uploads, contact the development team or create an issue in the project repository.

