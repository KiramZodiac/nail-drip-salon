# Nail Drip Salon - Admin Panel

## Overview
The admin panel provides a comprehensive management system for the Nail Drip Salon website. It allows administrators to manage all aspects of the salon's online presence.

## Access
- **URL**: `/admin/login`
- **Demo Credentials**:
  - Username: `admin`
  - Password: `admin123`

## Features

### 1. Dashboard (`/admin`)
- Overview of all content statistics
- Quick action buttons for common tasks
- Recent activity monitoring
- Quick access to view the public website

### 2. Services Management (`/admin/services`)
- **Add/Edit/Delete Services**: Manage nail services offered
- **Service Details**: Name, description, category, duration, price
- **Image Management**: Upload service images
- **Display Order**: Control the order services appear on the website
- **Active Status**: Enable/disable services

**Service Categories**:
- Manicure
- Pedicure
- Extensions
- Nail Art

### 3. Training Management (`/admin/training`)
- **Training Courses**: Create and manage training programs
- **Course Details**: Title, description, duration, price, level, instructor
- **Learning Objectives**: Define what students will learn
- **Prerequisites**: Set course requirements
- **Certifications**: Specify available certifications
- **Media Gallery**: Upload course images and videos
- **Student Work**: Showcase student achievements

**Course Levels**:
- Beginner
- Intermediate
- Advanced

**Media Categories**:
- Student Work
- Classroom
- Techniques
- Instructors
- Facility

### 4. Gallery Management (`/admin/gallery`)
- **Image Upload**: Add nail art photos
- **Image Details**: Title, description, category, tags
- **Featured Images**: Highlight special work
- **Display Order**: Control image sequence
- **Categories**: Organize by service type

### 5. Contact Messages (`/admin/messages`)
- **Message Management**: View and respond to customer inquiries
- **Status Tracking**: New, Read, Replied, Closed
- **Search & Filter**: Find specific messages
- **Reply System**: Respond directly to customers
- **Contact Details**: Name, email, phone, subject, message

### 6. Staff Management (`/admin/staff`)
- **Staff Profiles**: Add team members
- **Professional Details**: Role, bio, experience, specialties
- **Certifications**: Track staff qualifications
- **Contact Information**: Email and phone
- **Profile Images**: Staff photos
- **Display Order**: Control staff listing order

**Staff Roles**:
- Nail Technician
- Senior Technician
- Master Technician
- Instructor
- Manager
- Owner

## Database Tables

The admin panel manages the following database tables:

1. **services** - Salon services
2. **training_courses** - Training programs
3. **training_media** - Course media files
4. **gallery** - Image gallery
5. **contact_messages** - Customer inquiries
6. **staff** - Team members

## Security

- Simple authentication system (demo credentials provided)
- All admin routes are protected
- Form validation and error handling
- Secure database operations

## Usage Instructions

### Adding New Content
1. Navigate to the appropriate section (Services, Training, Gallery, etc.)
2. Click "Add New" button
3. Fill in the required information
4. Upload images if needed
5. Set display order and active status
6. Save the content

### Managing Existing Content
1. Use the search functionality to find specific items
2. Click the edit button to modify content
3. Use the delete button to remove items (with confirmation)
4. Update status and display order as needed

### Contact Management
1. View new messages in the Messages section
2. Update message status as you process them
3. Use the reply system to respond to customers
4. Mark messages as closed when resolved

## Technical Details

- **Frontend**: React with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: React hooks
- **Routing**: React Router
- **Forms**: React Hook Form with Zod validation

## Development

To add new features to the admin panel:

1. Create new components in `src/pages/admin/`
2. Add routes to `src/App.tsx`
3. Update the admin navigation in `src/components/AdminLayout.tsx`
4. Ensure proper TypeScript interfaces
5. Add form validation and error handling

## Support

For technical support or feature requests, contact the development team.

