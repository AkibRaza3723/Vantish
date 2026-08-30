# Add Notification System to Existing Vantish (LinkedOUT) Application

You are working on an existing full-stack application called **Vantish (LinkedOUT)**.

The backend is already implemented using **Node.js/Express + Prisma + PostgreSQL** and authentication uses **Better Auth**. The frontend is already connected to the backend.

Your task is to add a complete **Notification System** to the existing application.

## IMPORTANT: Inspect Before Modifying

Before writing code:

1. Inspect the complete existing backend.
2. Inspect the Prisma schema.
3. Inspect all existing routes/controllers/services.
4. Inspect the existing frontend API/service layer.
5. Understand the current authentication/session implementation.
6. Understand the existing models for:
   - User
   - Post
   - Comment
   - Vote
   - Report
   - Connection

7. Understand the existing connection-request flow.
8. Understand how the frontend currently fetches and displays posts, profiles, comments and connections.

Do NOT blindly create new routes or models.

Use the existing architecture and naming conventions wherever possible.

Do NOT break or rewrite existing functionality.

---

# 1. Notification requirements

Implement notifications for the following events.

### Connection

1. User receives a connection request.
2. User accepts a connection request.

### Post activity

3. Someone marks a user's post as `RELATED`.
4. Someone marks a user's post as `NOT_RELATED`.
5. Someone comments on a user's post.

### Comment activity

6. A user's comment is reported.

### Post moderation

7. A user's post is reported.

### Connection activity

8. A user's connection creates a new post.

Only implement events that are compatible with the existing backend models/routes.

---

# 2. Prisma Notification model

Create a separate `Notification` model.

Do NOT store notification objects inside the `User` model as a JSON array.

The notification should represent an event directed toward a specific user.

Use a structure similar to:

```prisma
model Notification {
  id            String   @id @default(cuid())

  userId        String
  actorId       String?

  type          NotificationType

  message       String

  postId        String?
  commentId     String?
  connectionId  String?

  isRead        Boolean  @default(false)

  createdAt     DateTime @default(now())

  user          User @relation("UserNotifications", fields: [userId], references: [id], onDelete: Cascade)
  actor         User?    @relation("NotificationActors", fields: [actorId], references: [id], onDelete: SetNull)

  @@index([userId, isRead])
  @@index([userId, createdAt])
}
```

Adapt the exact schema to the existing Prisma schema.

Do not duplicate existing fields or create conflicting relations.

---

# 3. Notification enum

Create an enum similar to:

```prisma
enum NotificationType {
  CONNECTION_REQUEST
  CONNECTION_ACCEPTED

  POST_RELATED
  POST_NOT_RELATED
  POST_COMMENTED

  POST_REPORTED
  COMMENT_REPORTED

  CONNECTION_POST
}
```

Use the existing vote terminology if the backend already uses different names.

For example, if the existing system calls the vote `RELATED` / `NOT_RELATED`, use those exact names consistently.

---

# 4. User relations

Because both `userId` and `actorId` reference User, define explicit Prisma relations.

For example:

```prisma
model User {
  // existing fields...

  notifications        Notification[] @relation("UserNotifications")
  notificationsCreated Notification[] @relation("NotificationActors")
}
```

Adapt this to the existing schema.

Do not remove or rename existing User relations.

---

# 5. Notification service

Create a reusable notification service rather than duplicating notification creation logic inside every controller.

For example:

```typescript
notificationService.create({
  userId,
  actorId,
  type,
  message,
  postId,
  commentId,
  connectionId,
});
```

The exact implementation should follow the existing backend architecture.

The service should:

- Create the notification.
- Validate required fields.
- Avoid creating invalid notifications.
- Handle optional actor/post/comment/connection references.
- Avoid notifying users about their own actions.

---

# 6. Connection request notification

When:

```text
User A → sends connection request → User B
```

Create:

```text
Notification
userId = User B
actorId = User A
type = CONNECTION_REQUEST
connectionId = connection.id
```

Example message:

> "Omkar sent you a connection request."

Use the actual username/display name available from the existing User model.

Do NOT expose private user information.

---

# 7. Connection accepted notification

When User B accepts User A's request:

```text
User B accepts
      ↓
Notify User A
```

Create:

```text
userId = User A
actorId = User B
type = CONNECTION_ACCEPTED
connectionId = connection.id
```

Example:

> "Rahul accepted your connection request."

Do not create another connection record if the existing connection model changes from PENDING → ACCEPTED.

---

# 8. Post vote notification

When another user votes on a post:

```text
User A → votes on → User B's post
```

Notify the post author.

For a RELATED vote:

```text
userId = post.authorId
actorId = voter.id
type = POST_RELATED
postId = post.id
```

For a NOT_RELATED vote:

```text
userId = post.authorId
actorId = voter.id
type = POST_NOT_RELATED
postId = post.id
```

Do NOT notify a user when they vote on their own post.

Follow the existing vote behavior if users can change or remove votes.

---

# 9. Comment notification

When User A comments on User B's post:

```text
userId = post.authorId
actorId = commenter.id
type = POST_COMMENTED
postId = post.id
commentId = comment.id
```

Example:

> "Omkar commented on your post."

Do not notify the user when they comment on their own post.

If the existing backend supports replies to comments, consider whether a separate notification type is required. Do not add it unless the existing comment system supports replies.

---

# 10. Report notifications

When a post is reported:

```text
post author
     ↓
notification
```

Create:

```text
userId = post.authorId
type = POST_REPORTED
postId = post.id
```

Example:

> "Your post has been reported and is under review."

IMPORTANT:

Never reveal the identity of the person who reported the post.

Do NOT set the reporter as the visible actor for this notification.

Similarly, when a comment is reported:

> "Your comment has been reported and is under review."

Do not reveal who reported it.

---

# 11. Connection's new post notification

When a user creates a post:

1. Find their accepted connections.
2. Create a `CONNECTION_POST` notification for those connections.

Example:

```text
Rahul creates post
       ↓
Find accepted connections
       ↓
Notify each connection
```

Example notification:

> "Rahul created a new post."

Only notify users who are actually connected according to the existing Connection model.

Do not notify:

- Pending connections
- Rejected connections
- Blocked users
- The post author themselves

For the MVP, it is acceptable to create one notification per accepted connection.

However, keep the implementation efficient and avoid unnecessary database queries.

---

# 12. Do not expose reporter identity

This is a strict requirement.

For:

```text
POST_REPORTED
COMMENT_REPORTED
```

the notification should NOT contain:

```text
actorId = reporter
```

The reporter must remain private.

The notification should simply say:

> Your post has been reported.

or:

> Your comment has been reported.

---

# 13. Notification APIs

Implement APIs according to the existing backend routing conventions.

At minimum, support:

```http
GET /notifications
GET /notifications/unread-count
PATCH /notifications/:id/read
PATCH /notifications/read-all
```

If the project already has a different API naming convention, follow it.

All notification endpoints must require authentication.

A user must only be able to access their own notifications.

Never allow:

```text
User A → GET User B's notifications
```

---

# 14. Notification response

Return a clean frontend-friendly response.

Example:

```json
{
  "id": "notification123",
  "type": "POST_COMMENTED",
  "message": "Omkar commented on your post.",
  "isRead": false,
  "createdAt": "2026-08-30T10:30:00Z",
  "actor": {
    "id": "user123",
    "username": "omkar",
    "avatar": "..."
  },
  "postId": "post123",
  "commentId": "comment123",
  "connectionId": null
}
```

For moderation notifications:

```json
{
  "id": "notification456",
  "type": "POST_REPORTED",
  "message": "Your post has been reported and is under review.",
  "isRead": false,
  "createdAt": "...",
  "actor": null,
  "postId": "post123"
}
```

Do not expose unnecessary database fields.

---

# 15. Pagination

Notifications can grow large.

Implement pagination using the existing project's preferred approach.

For example:

```http
GET /notifications?page=1&limit=20
```

or cursor pagination if the project already uses cursor-based pagination.

Sort newest first.

Example:

```text
Newest
  ↓
Older
  ↓
Older
```

Do not load thousands of notifications at once.

---

# 16. Unread count

Implement:

```http
GET /notifications/unread-count
```

Response:

```json
{
  "count": 5
}
```

The frontend will use this for the notification badge.

Example:

```text
🔔 5
```

If there are no unread notifications:

```text
🔔
```

---

# 17. Mark notification as read

When the user opens/clicks a notification:

```http
PATCH /notifications/:id/read
```

Set:

```text
isRead = true
```

Users must only be able to mark their own notifications as read.

---

# 18. Mark all as read

Implement:

```http
PATCH /notifications/read-all
```

Only update notifications belonging to the authenticated user.

---

# 19. Frontend notification UI

Add a notification icon to the main navigation.

Example:

```text
LinkedOUT

Feed
Search
Create Post
Connections
🔔 3
Profile
```

Clicking the bell opens the notification page/panel.

---

# 20. Notification UI

Create a clean notification list.

Example:

```text
Notifications                         Mark all as read

------------------------------------------------

👤  Omkar sent you a connection request
    2 minutes ago

💬  Rahul commented on your post
    15 minutes ago

🔗  Aman created a new post
    30 minutes ago

⚠️  Your post has been reported and is under review
    1 hour ago
```

Unread notifications should be visually different from read notifications.

---

# 21. Notification click behavior

Notifications should be actionable.

Examples:

```text
CONNECTION_REQUEST
        ↓
Open sender's profile / connection requests
```

```text
POST_COMMENTED
        ↓
Open the relevant post/comment
```

```text
POST_RELATED
        ↓
Open the post
```

```text
POST_REPORTED
        ↓
Open the reported post if it still exists
```

```text
CONNECTION_POST
        ↓
Open the connection's post
```

Use the IDs returned by the backend.

Do not make the frontend guess URLs.

---

# 22. Frontend API architecture

Use the existing API/service structure.

If the project already has:

```text
api/
services/
hooks/
```

follow that structure.

Otherwise create something like:

```text
api/
  notifications.ts
```

with functions such as:

```typescript
getNotifications();
getUnreadNotificationCount();
markNotificationAsRead();
markAllNotificationsAsRead();
```

Use the project's existing authentication/session mechanism.

Do not duplicate Better Auth logic.

---

# 23. Notification state

If the project uses TanStack Query, use it for notification data.

Recommended behavior:

```text
Notification list
        ↓
cached server state

Unread count
        ↓
separate query
```

After marking a notification as read:

- Update/invalidate notification query.
- Update/invalidate unread count.

Follow the existing frontend state-management pattern if one exists.

---

# 24. Real-time notifications

For the MVP, do NOT introduce WebSockets/Socket.IO unless the existing project already has a real-time infrastructure.

First implement reliable REST-based notifications.

If the existing application already uses Socket.IO, you may add real-time notification delivery using the existing architecture.

Do not introduce unnecessary infrastructure just for notifications.

The system should work correctly even without real-time delivery.

---

# 25. Prevent duplicate/self notifications

Make sure these cases do not create unnecessary notifications:

```text
User likes own post
User votes on own post
User comments on own post
User receives duplicate connection request
User accepts an already accepted connection
```

Follow the existing backend's constraints.

If the same event can be triggered twice because of repeated requests, use proper database constraints/logic where appropriate.

---

# 26. Privacy and security

Notifications are private user data.

A user can only:

- Read their own notifications.
- Mark their own notifications as read.
- Access their own unread count.

Never trust a `userId` supplied by the frontend for authorization.

Always determine the authenticated user from the Better Auth session.

Do not expose:

- Reporter identity
- Email addresses
- Private user data
- Authentication information
- Internal database information unnecessarily

---

# 27. Database performance

Add appropriate indexes.

At minimum, optimize:

```text
userId + isRead
userId + createdAt
```

The most common query will be:

```text
Give me this user's newest notifications.
```

and:

```text
Give me this user's unread notification count.
```

Design indexes around these queries.

---

# 28. Testing

After implementation, test the complete flows.

### Connection

```text
User A sends request
        ↓
User B receives notification

User B accepts
        ↓
User A receives notification
```

### Post

```text
User A creates post
        ↓
User B marks Related
        ↓
User A receives notification

User B comments
        ↓
User A receives notification
```

### Report

```text
User B reports User A's post
        ↓
User A receives moderation notification
        ↓
User A must NOT know User B reported it
```

### Connection post

```text
User A and User B are connected
        ↓
User A creates post
        ↓
User B receives notification
```

### Self actions

```text
User A interacts with own post
        ↓
No unnecessary notification
```

---

# 29. Do not over-engineer

This is an MVP.

Do NOT add:

- Push notifications
- Email notifications
- SMS notifications
- Notification preferences
- Complex event buses
- Kafka
- Redis streams
- Microservices

unless the existing project already requires them.

Start with:

```text
PostgreSQL
    ↓
Notification table
    ↓
Notification service
    ↓
REST API
    ↓
Frontend notification UI
```

The architecture should be easy to extend later.

---

# 30. Final requirement

Before finishing, give me a concise implementation summary containing:

1. Prisma changes
2. New/modified backend routes
3. Notification service implementation
4. Events that create notifications
5. Frontend pages/components added
6. API functions/hooks added
7. Any backend limitations discovered
8. Any migration required
9. Tests performed
10. Any assumptions made

Most importantly:

**Inspect the existing project first. Reuse existing models, routes, authentication, services, naming conventions and frontend architecture. Do not rewrite working code unnecessarily.**
