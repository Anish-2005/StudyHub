# Firestore Indexes Configuration for StudyHub

This file contains all the Firestore indexes required for StudyHub to work properly.

## 🔍 Required Indexes

### Automatic Index Creation
When you get these errors, Firebase provides direct links to create the indexes. Click on the links in the console errors:

1. **Tasks Index**: https://console.firebase.google.com/v1/r/project/studyhub-4680b/firestore/indexes?create_composite=Ckxwcm9qZWN0cy9zdHVkeWh1Yi00NjgwYi9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvdGFza3MvaW5kZXhlcy9fEAEaCgoGdXNlcklkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg

2. **Reminders Index**: https://console.firebase.google.com/v1/r/project/studyhub-4680b/firestore/indexes?create_composite=ClBwcm9qZWN0cy9zdHVkeWh1Yi00NjgwYi9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvcmVtaW5kZXJzL2luZGV4ZXMvXxABGgoKBnVzZXJJZBABGggKBGRhdGUQARoMCghfX25hbWVfXxAB

## 📋 Manual Index Creation

If the automatic links don't work, create these indexes manually in [Firebase Console](https://console.firebase.google.com/project/studyhub-4680b/firestore/indexes):

### Tasks Collection Indexes
```
Collection: tasks
Fields:
- userId (Ascending)
- createdAt (Descending)
- __name__ (Ascending)
```

```
Collection: tasks
Fields:
- userId (Ascending)
- topicId (Ascending)
- createdAt (Descending)
- __name__ (Ascending)
```

```
Collection: tasks
Fields:
- userId (Ascending)
- completed (Ascending)
- createdAt (Descending)
- __name__ (Ascending)
```

```
Collection: tasks
Fields:
- userId (Ascending)
- priority (Ascending)
- createdAt (Descending)
- __name__ (Ascending)
```

### Reminders Collection Indexes
```
Collection: reminders
Fields:
- userId (Ascending)
- date (Ascending)
- __name__ (Ascending)
```

```
Collection: reminders
Fields:
- userId (Ascending)
- topicId (Ascending)
- date (Ascending)
- __name__ (Ascending)
```

```
Collection: reminders
Fields:
- userId (Ascending)
- completed (Ascending)
- date (Ascending)
- __name__ (Ascending)
```

```
Collection: reminders
Fields:
- userId (Ascending)
- type (Ascending)
- date (Ascending)
- __name__ (Ascending)
```

### Topics Collection Indexes
```
Collection: topics
Fields:
- userId (Ascending)
- updatedAt (Descending)
- __name__ (Ascending)
```

```
Collection: topics
Fields:
- userId (Ascending)
- createdAt (Descending)
- __name__ (Ascending)
```

### Study Sessions Collection Indexes (Future Use)
```
Collection: studySessions
Fields:
- userId (Ascending)
- topicId (Ascending)
- startTime (Descending)
- __name__ (Ascending)
```

```
Collection: studySessions
Fields:
- userId (Ascending)
- completed (Ascending)
- startTime (Descending)
- __name__ (Ascending)
```

## 🚀 Quick Fix Steps

### Method 1: Click the Links (Easiest)
1. Copy the error URLs from your console
2. Paste them in your browser
3. Click "Create Index" for each one
4. Wait 2-5 minutes for indexes to build

### Method 2: Firebase Console (Manual)
1. Go to [Firebase Console](https://console.firebase.google.com/project/studyhub-4680b/firestore/indexes)
2. Click "Add Index"
3. Select collection (e.g., "tasks")
4. Add fields as shown above
5. Click "Create"

### Method 3: Firebase CLI (Advanced)
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Deploy indexes (if you have firestore.indexes.json)
firebase deploy --only firestore:indexes
```

## 📊 Index Status Check

After creating indexes, you can check their status:
1. Go to [Firestore Indexes](https://console.firebase.google.com/project/studyhub-4680b/firestore/indexes)
2. Look for "Building" status
3. Wait until all show "Enabled"
4. Refresh your app

## 🔧 Firestore Rules Update

Make sure your Firestore rules are also published. The current errors suggest the app is working but just needs indexes.

## ⚡ Performance Tips

These indexes will significantly improve query performance:
- **Tasks**: Filter by user, topic, completion status, and sort by date
- **Reminders**: Filter by user, date range, and completion status
- **Topics**: Sort by creation/update date for recent activity

## 🎯 Expected Behavior After Index Creation

Once indexes are created, you should see:
- ✅ No more console errors
- ⚡ Fast query responses
- 📊 Real-time updates working smoothly
- 🔄 Smooth topic/task/reminder creation

## 📞 Still Having Issues?

If you continue having problems:
1. Check the [Firebase Console Logs](https://console.firebase.google.com/project/studyhub-4680b/functions/logs)
2. Verify Firestore security rules are published
3. Ensure all indexes show "Enabled" status
4. Clear browser cache and refresh

The indexes typically take 2-5 minutes to build. Your app will work perfectly once they're ready! 🚀
