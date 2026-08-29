# Vantish Frontend Implementation Task

You are a senior frontend engineer joining an existing project.

I have already completed the **Vantish backend**. Your job is to inspect the existing backend/API implementation and build the complete frontend around it.

## 1. First: Understand the existing backend

Before writing significant frontend code:

1. Inspect the entire backend repository.
2. Identify:

   * API routes
   * HTTP methods
   * Request bodies
   * Query parameters
   * Path parameters
   * Response structures
   * Authentication requirements
   * Error responses
   * User model
   * Post model
   * Comment model
   * Vote model
   * Report model
   * Connection model
   * Any other relevant models
3. Find how authentication is currently handled.
4. Do NOT invent API endpoints when an existing backend endpoint already provides the functionality.
5. Do NOT modify backend routes or database schema unless absolutely necessary.
6. If an API response is unclear, inspect the backend implementation rather than guessing.

Create a mental/API map before implementing the UI.

---

# 2. Authentication

The project uses **Better Auth**.

Support:

* Google login
* GitHub login
* Existing Better Auth session handling
* Login/logout
* Persistent sessions
* Protected routes

The frontend must never store authentication secrets manually if Better Auth already manages them.

After a successful first login, check whether the user has completed the required profile/onboarding information.

---

# 3. First-login onboarding

A newly authenticated user should NOT immediately enter the main application.

Flow:

```text
Login
  ↓
Better Auth authentication
  ↓
Check user profile completion
  ↓
If incomplete
  ↓
Onboarding
  ↓
Community rules / consent
  ↓
Feed
```

If the user has already completed onboarding:

```text
Login
  ↓
Check profile
  ↓
Feed
```

Do not show onboarding again for an already-completed user.

---

# 4. Required onboarding information

Keep onboarding minimal.

Collect only information necessary for Vantish functionality.

Suggested fields:

* Username
* Display name
* Role:

  * Student
  * Employee
  * Founder
  * Freelancer
  * Other
* Organization
* Optional profile information supported by the backend

If the backend has specific required fields, use those fields instead of inventing new ones.

Validate all fields on the frontend, but treat the backend as the source of truth.

After completing onboarding, save the data through the existing backend API.

---

# 5. Community rules / consent

Before allowing the user to explore or post, show a short community-safety screen.

Explain that Vantish is designed for sharing professional/student experiences and frustrations, but users must not:

* Harass people
* Post threats
* Share private/personal information
* Make malicious false accusations
* Post illegal content
* Abuse the reporting system
* Target individuals with hate or harassment

Require the user to acknowledge the rules before entering the application.

Keep this screen simple and not annoying.

---

# 6. Main application

Build the following major features.

## Feed

Create a modern social feed containing posts.

A post can contain:

* Text
* Image
* Author information
* Timestamp
* Organization
* Vote information
* Comment count
* Report action
* Connection/profile action where appropriate

Support both:

```text
Text post
```

and

```text
Image + text post
```

The feed should be responsive and work well on desktop and mobile.

---

# 7. Voting system

Implement the existing backend voting system.

The UI should clearly show:

* Related
* Not Related

Users should be able to vote on a post.

If the backend supports changing/removing a vote, implement that behavior correctly.

Do not create duplicate votes from the frontend.

After voting, update the UI immediately where safe to do so, while keeping the backend as the source of truth.

---

# 8. Comments

Users should be able to:

* View comments
* Add comments
* Report comments

Create a clean comment UI.

Support loading comments without unnecessarily reloading the entire feed.

If the backend supports pagination, use it.

Handle empty comments, loading states and API errors.

---

# 9. Post creation

Create a dedicated post creation experience.

Users should be able to create:

### Text post

```text
Write something...
```

### Image post

Allow:

* Image selection
* Image preview
* Optional text/caption
* Remove selected image before posting

Use the existing backend upload/API mechanism.

Do not invent a new storage solution if the backend already has one.

Show:

* Upload state
* Posting state
* Success state
* Error state

Prevent accidental duplicate submissions.

---

# 10. Report post

Every post should have a report option.

Use the backend's existing report endpoint and report structure.

Create a modal with the available report reasons from the backend.

Example categories only if supported by the backend:

* Spam
* Harassment
* Misleading content
* Inappropriate content
* Other

Do not hardcode reasons that conflict with the backend API.

After successful reporting:

```text
Report submitted
```

and prevent accidental repeated submissions where appropriate.

---

# 11. Report comments

Each comment should have a report option.

Use the existing backend comment-report endpoint.

Provide the same quality of UX as post reporting.

---

# 12. User profile

Create a profile page.

Example:

```text
--------------------------------
        Avatar

        username
        display name

        Student
        ABC University

        127 Connections

        [Connect]
--------------------------------

Posts
--------------------------------
Post
Post
Post
```

Show only profile information that the backend/user privacy model allows.

The profile should contain:

* User information
* Organization
* Role
* Connection count
* User's posts
* Connection status
* Connect button when applicable

If the profile belongs to the currently logged-in user, show:

```text
Edit Profile
```

instead of inappropriate connection actions.

---

# 13. Connections

Implement connection requests using the existing backend.

Users should be able to:

* Send connection request
* See current connection status
* Accept request if applicable
* Handle already-connected state
* Handle pending state

Use the backend's actual connection model/status values.

Example UI states:

```text
Connect
Pending
Accept
Connected
```

Do not create duplicate connection requests.

Create a connections list page if the backend already supports retrieving connections.

Show:

* Profile
* Username
* Organization
* Role
* Connection status

---

# 14. Search users

Create a user search experience.

Users should be able to search for profiles.

Support the backend's existing search parameters.

Search results should show:

* Username
* Display name
* Role
* Organization
* Avatar
* Connection status

Clicking a result should open the user's profile.

Implement debouncing for search requests.

Do not send an API request on every keystroke.

---

# 15. Navigation

Create a clean navigation system.

Desktop:

```text
LinkedOUT

Feed
Search
Create Post
Connections
Profile
Logout
```

Mobile should use an appropriate responsive navigation pattern.

The currently active section should be visually clear.

---

# 16. Loading and error states

This is extremely important.

Every API-driven section should have:

### Loading

Use skeleton loaders where appropriate.

### Empty

Examples:

```text
No posts yet.
Be the first person to speak out.
```

```text
No connections yet.
```

```text
No users found.
```

### Error

Show a useful error message and retry option where appropriate.

Never leave the user staring at a blank screen.

---

# 17. API architecture

Do NOT scatter fetch calls throughout components.

Create a clean API/service layer.

For example:

```text
src/
  api/
    auth.ts
    users.ts
    posts.ts
    comments.ts
    votes.ts
    reports.ts
    connections.ts
```

Adapt this structure to the existing project.

Centralize:

* API base URL
* Authentication/session handling
* Error handling
* Request configuration

Use the existing frontend/backend architecture if one already exists.

---

# 18. Data fetching and state management

Use the project's existing approach if one exists.

If not, use a sensible modern solution such as:

* TanStack Query for server state
* React state/context for local UI state

Avoid unnecessary global state.

Server data such as posts, profiles, comments and connections should not be duplicated unnecessarily across multiple state stores.

Implement:

* Cache invalidation
* Refetching
* Optimistic updates only where appropriate
* Pagination/infinite scrolling if supported by backend

---

# 19. Security

Never trust frontend validation.

The backend remains authoritative.

Do not expose:

* Secrets
* API keys
* Database credentials
* Private authentication data

Do not store sensitive authentication information in localStorage unless Better Auth explicitly requires it.

Escape/safely render user-generated content.

Images and user-generated content must not break the UI.

---

# 20. Anonymous / LinkedOUT identity

LinkedOUT is based around people expressing their real experiences and frustrations.

Therefore the UI should preserve the application's anonymity/privacy model.

Before implementing profile/post identity behavior, inspect the backend to understand exactly what information is intended to be public.

Do NOT accidentally expose:

* Email addresses
* Internal user IDs unnecessarily
* Private account information
* Authentication information
* Other sensitive backend fields

Only display fields intentionally exposed by the API.

---

# 21. Design direction

The design should NOT look like a cheap Reddit clone.

LinkedOUT should feel like:

**LinkedIn × anonymous community × modern startup product**

Visual characteristics:

* Clean
* Minimal
* Professional
* Slightly rebellious
* Modern
* Strong typography
* Good whitespace
* Responsive
* Accessible

The product should feel credible enough for employees and students.

Avoid excessive gradients, unnecessary animations and visual clutter.

---

# 22. Important UX principle

LinkedOUT's core message is:

> "Say what you can't say on LinkedIn."

Make that idea visible in the product without making the UI toxic.

The feed should encourage:

* Experiences
* Frustrations
* Questions
* Discussions
* Useful information
* Community validation

rather than pure rage bait.

---

# 23. Backend compatibility rule

This is critical:

**The backend already exists.**

Therefore:

1. Inspect backend first.
2. Use the actual routes.
3. Use the actual request schemas.
4. Use the actual response schemas.
5. Use the actual authentication mechanism.
6. Do not assume field names.
7. Do not invent endpoints.
8. Do not silently change backend behavior.
9. If something required by the frontend is genuinely missing from the backend, clearly identify it before changing anything.

If frontend expectations conflict with backend behavior, adapt the frontend to the backend where possible.

---

# 24. Final implementation quality

Before considering the frontend complete, test the complete flow:

```text
New User
 ↓
Google/GitHub Login
 ↓
Onboarding
 ↓
Community Rules
 ↓
Feed
 ↓
Search User
 ↓
Open Profile
 ↓
Send Connection
 ↓
Create Text Post
 ↓
Create Image Post
 ↓
Vote Related/Not Related
 ↓
Comment
 ↓
Report Post
 ↓
Report Comment
 ↓
Open Connections
 ↓
Logout
 ↓
Login Again
 ↓
Directly Enter Feed
```

Also test:

* API failures
* Slow network
* Empty states
* Duplicate clicks
* Unauthorized API responses
* Expired sessions
* Mobile layout
* Image upload failure
* Invalid forms
* User not found
* Post deleted
* Comment deleted
* Connection already exists

## Most important instruction

**Do not start by generating the UI blindly.**

First inspect the backend and produce a concise API/feature map for yourself. Then implement the frontend feature-by-feature using the actual backend contracts.

If you find inconsistencies or missing backend functionality, report them clearly instead of inventing a workaround that changes the application's architecture.
