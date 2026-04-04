# Event API Documentation

## Overview
Complete API integration for Calendar, Events, and Reminders pages with MongoDB database support.

## API Endpoints

### Base URL
```
http://localhost:5000
```

### Events API

#### GET /events
- **Description**: Get all events from database
- **Method**: GET
- **Response**: 
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "69ccab8283dee729c4524bf3",
      "title": "Interview with Tech Corp",
      "type": "Interview",
      "date": "2026-04-15",
      "time": "10:00",
      "notes": "Technical interview",
      "reminder": "1-day",
      "createdAt": "2026-04-01T05:20:13.123Z"
    }
  ]
}
```

#### GET /events/:id
- **Description**: Get single event by ID
- **Method**: GET
- **Params**: `id` (string) - Event ID
- **Response**: 
```json
{
  "success": true,
  "data": {
    "_id": "69ccab8283dee729c4524bf3",
    "title": "Interview with Tech Corp",
    "type": "Interview",
    "date": "2026-04-15",
    "time": "10:00",
    "notes": "Technical interview",
    "reminder": "1-day",
    "createdAt": "2026-04-01T05:20:13.123Z"
  }
}
```

#### POST /events
- **Description**: Create new event
- **Method**: POST
- **Body**: 
```json
{
  "title": "New Interview",
  "type": "Interview",
  "date": "2026-04-20",
  "time": "14:00",
  "notes": "Follow-up interview",
  "reminder": "1-day"
}
```
- **Response**: 
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "_id": "69d1234567890abcdef123456",
    "title": "New Interview",
    "type": "Interview",
    "date": "2026-04-20",
    "time": "14:00",
    "notes": "Follow-up interview",
    "reminder": "1-day",
    "createdAt": "2026-04-04T05:20:43.456Z"
  }
}
```

#### PUT /events/:id
- **Description**: Update existing event
- **Method**: PUT
- **Params**: `id` (string) - Event ID
- **Body**: Same as POST
- **Response**: 
```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "_id": "69ccab8283dee729c4524bf3",
    "title": "Updated Interview",
    "type": "Interview",
    "date": "2026-04-15",
    "time": "11:00",
    "notes": "Updated notes",
    "reminder": "2-days",
    "createdAt": "2026-04-01T05:20:13.123Z"
  }
}
```

#### DELETE /events/:id
- **Description**: Delete event
- **Method**: DELETE
- **Params**: `id` (string) - Event ID
- **Response**: 
```json
{
  "success": true,
  "message": "Event deleted successfully",
  "data": {
    "_id": "69ccab8283dee729c4524bf3",
    "title": "Deleted Interview",
    "type": "Interview",
    "date": "2026-04-15",
    "time": "10:00",
    "notes": "Technical interview",
    "reminder": "1-day",
    "createdAt": "2026-04-01T05:20:13.123Z"
  }
}
```

## Event Schema

### Required Fields
- `title`: String (3-100 characters) - Event title
- `type`: String - Must be one of: "Interview", "Deadline", "Follow-up"
- `date`: String - Format: YYYY-MM-DD
- `time`: String - Format: HH:MM (24-hour)
- `reminder`: String - Must be one of: "same-day", "1-day", "2-days", "3-days", "1-week"

### Optional Fields
- `notes`: String (max 200 characters) - Additional notes

### Auto-generated Fields
- `_id`: String - MongoDB ObjectId
- `createdAt`: Date - Timestamp when event was created

## Frontend API Services

### eventAPI.js
Comprehensive API service with the following methods:

#### Basic CRUD
- `eventAPI.getAll()` - Get all events
- `eventAPI.getById(id)` - Get single event
- `eventAPI.create(eventData)` - Create event
- `eventAPI.update(id, eventData)` - Update event
- `eventAPI.delete(id)` - Delete event

#### Advanced Methods
- `eventAPI.getByDateRange(startDate, endDate)` - Get events in date range
- `eventAPI.getTodayEvents()` - Get today's events
- `eventAPI.getUpcomingEvents(days)` - Get upcoming events
- `eventAPI.getByType(type)` - Get events by type

#### Calendar API
- `calendarAPI.getMonthEvents(year, month)` - Get month events
- `calendarAPI.getDateEvents(date)` - Get events for specific date

#### Reminder API
- `reminderAPI.getUpcomingReminders()` - Get events needing reminders
- `reminderAPI.getOverdueEvents()` - Get overdue events

## Error Handling

### Response Format
All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Descriptive message",
  "data": {} // or []
}
```

### Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common Error Codes
- 400: Bad Request (validation errors, missing fields)
- 404: Not Found (invalid event ID)
- 500: Internal Server Error

## Testing

### Test Commands
```powershell
# Get all events
Invoke-WebRequest -Uri http://localhost:5000/events -Method GET

# Create event
$body = '{"title":"Test Interview","type":"Interview","date":"2026-04-10","time":"14:00","notes":"Test event","reminder":"1-day"}'
Invoke-WebRequest -Uri http://localhost:5000/events -Method POST -Body $body -ContentType "application/json"

# Update event
$body = '{"title":"Updated Interview","type":"Interview","date":"2026-04-10","time":"15:00","notes":"Updated notes","reminder":"2-days"}'
Invoke-WebRequest -Uri http://localhost:5000/events/EVENT_ID -Method PUT -Body $body -ContentType "application/json"

# Delete event
Invoke-WebRequest -Uri http://localhost:5000/events/EVENT_ID -Method DELETE
```

## Frontend Integration

### Import Statements
```javascript
// For full API functionality
import { eventAPI, calendarAPI, reminderAPI } from '../services/eventAPI'

// For backward compatibility
import { eventAPI } from '../services/api'
```

### Usage Examples
```javascript
// Get all events
const events = await eventAPI.getAll()

// Create new event
const newEvent = await eventAPI.create({
  title: 'Interview with Tech Corp',
  type: 'Interview',
  date: '2026-04-15',
  time: '10:00',
  notes: 'Technical interview',
  reminder: '1-day'
})

// Get today's events
const todayEvents = await eventAPI.getTodayEvents()

// Get upcoming reminders
const reminders = await reminderAPI.getUpcomingReminders()
```

## Database Integration

### MongoDB Collection
- **Collection**: `events`
- **Database**: MongoDB Atlas cluster
- **Connection**: Automatically handled by backend

### Model Schema
See `Backend/Models/Event.js` for complete schema definition.

## Real-time Updates

The API provides real-time database operations:
- ✅ Create events - Instantly saved to database
- ✅ Read events - Fetched from database in real-time
- ✅ Update events - Instantly updated in database
- ✅ Delete events - Instantly removed from database
- ✅ Calendar integration - Real-time calendar updates
- ✅ Reminder system - Real-time reminder calculations

## Pages Status

### ✅ CalendarPage.jsx
- ✅ Fixed layout structure
- ✅ Integrated with eventAPI
- ✅ Real-time data fetching
- ✅ Proper scrolling

### ✅ EventsPage.jsx
- ✅ Fixed layout structure
- ✅ Full CRUD operations
- ✅ Form validation
- ✅ Real-time updates

### ✅ RemindersPage.jsx
- ✅ Fixed layout structure
- ✅ Reminder calculations
- ✅ Real-time filtering
- ✅ Proper scrolling

## Backend Status

### ✅ EventController.js
- ✅ Complete CRUD operations
- ✅ Input validation
- ✅ Error handling
- ✅ MongoDB integration

### ✅ EventRoutes.js
- ✅ Controller integration
- ✅ Route mapping
- ✅ Middleware setup

### ✅ Event.js Model
- ✅ Schema validation
- ✅ Data types
- ✅ Required fields

## Testing Results

### ✅ API Tests
- ✅ GET /events - Returns database events
- ✅ POST /events - Creates new events
- ✅ PUT /events/:id - Updates events
- ✅ DELETE /events/:id - Deletes events
- ✅ Error handling - Proper error responses

### ✅ Database Tests
- ✅ MongoDB connection established
- ✅ Data persistence verified
- ✅ Real-time updates working
- ✅ Schema validation active

## Summary

The Calendar, Events, and Reminders pages now have complete API integration with:
- ✅ Database persistence
- ✅ Real-time updates
- ✅ Proper error handling
- ✅ Input validation
- ✅ Comprehensive API services
- ✅ Fixed UI layouts
- ✅ Working scrolling
