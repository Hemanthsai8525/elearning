# Student View Updates - Task Types Implementation

## Summary
Updated both backend and frontend to properly display and handle student responses for all three task types (CODING, MCQ, THEORY) with appropriate UI indicators and completion tracking.

## Backend Changes

### 1. TaskService.java
**File:** `elearning/src/main/java/com/example/elearning/service/TaskService.java`

**Change:** Added question ID to MCQ DTO mapping
```java
mqDto.setId(mq.getId()); // Include question ID for frontend tracking
```

**Why:** The frontend needs the question ID to properly track which answer belongs to which question when submitting MCQ responses.

## Frontend Changes

### 1. CourseLearning.jsx - Task Type Badge Display
**Location:** Main content area header

**Changes:**
- Dynamic badge colors based on task type:
  - **CODING**: Blue (`border-blue-500/50 text-blue-700`)
  - **MCQ**: Purple (`border-purple-500/50 text-purple-700`)
  - **THEORY**: Green (`border-green-500/50 text-green-700`)
  
- Task type-specific icons and labels:
  - **CODING**: `<Code />` + "Coding Challenge"
  - **MCQ**: `<CheckCircle />` + "Multiple Choice Quiz"
  - **THEORY**: `<FileText />` + "Theory Assignment"
  
- Added completion badge that shows when a task is completed

### 2. CourseLearning.jsx - Sidebar Task Icons
**Location:** Course content sidebar

**Changes:**
- Dynamic icons based on task type:
  - **CODING**: `<Code />` icon
  - **MCQ**: `<CheckCircle />` icon
  - **THEORY**: `<FileText />` icon
  
- Task type labels:
  - **CODING**: "Coding"
  - **MCQ**: "MCQ Quiz"
  - **THEORY**: "Theory"
  
- Icon states:
  - ✅ **Completed**: Green checkmark (all types)
  - 🔒 **Locked**: Lock icon (all types)
  - 🎯 **Active**: Primary color with fill (type-specific icon)
  - ⚪ **Inactive**: Muted color (type-specific icon)

## Student Response Mechanisms

### CODING Tasks
**Student Actions:**
1. Write code in Monaco editor
2. Select programming language (Python, JavaScript, Java, C++)
3. Click "Run Code" to test against test cases
4. View test results (passed/failed for each case)
5. Click "Submit Assignment" when all tests pass

**UI Indicators:**
- Blue badge: "Coding Challenge"
- Code editor with syntax highlighting
- Test case results panel
- Submit button (enabled only when all tests pass)

### MCQ Tasks
**Student Actions:**
1. Read each question
2. Select one answer (A, B, C, or D) using radio buttons
3. Click "Submit Quiz" when all questions answered
4. View results immediately (auto-graded)

**UI Indicators:**
- Purple badge: "Multiple Choice Quiz"
- Radio button interface for each question
- Submit button (enabled only when all questions answered)
- Results card showing:
  - Pass/Fail status (60% threshold)
  - Score percentage
  - Number of correct answers
  - Visual feedback (green for pass, red for fail)

**Response Format:**
```javascript
{
  taskId: number,
  answers: [
    { questionId: number, selectedAnswer: "A" | "B" | "C" | "D" },
    ...
  ]
}
```

### THEORY Tasks
**Student Actions:**
1. Read assignment description
2. Select file to upload (PDF, DOC, DOCX, TXT)
3. Click "Upload Assignment"
4. Wait for teacher review

**UI Indicators:**
- Green badge: "Theory Assignment"
- File upload interface
- Submission status display:
  - **PENDING**: Waiting for teacher review
  - **PASS**: Approved with score and feedback
  - **FAIL**: Rejected with score and feedback
- Download button for submitted file

**Response Format:**
```javascript
FormData with file attachment
```

## Visual Indicators Summary

| Task Type | Badge Color | Icon | Sidebar Label | Completion Method |
|-----------|-------------|------|---------------|-------------------|
| **CODING** | Blue | `<Code />` | "Coding" | Auto (test cases) |
| **MCQ** | Purple | `<CheckCircle />` | "MCQ Quiz" | Auto (60% threshold) |
| **THEORY** | Green | `<FileText />` | "Theory" | Manual (teacher review) |

## Completion Tracking

### Backend
- `TaskDTO.completed` field indicates if student has completed the task
- Checked via `TaskCompletionRepository.existsByTaskAndUser()`
- Works for all three task types

### Frontend Display
- ✅ Green "Completed" badge shown next to task type badge
- ✅ Green checkmark icon in sidebar
- Task remains accessible after completion for review

## API Endpoints Used

### Get Tasks
```
GET /api/courses/{courseId}/tasks
```
**Response includes:**
- `taskType`: "CODING" | "MCQ" | "THEORY"
- `completed`: boolean
- Type-specific fields (testCases, mcqQuestions, etc.)

### Submit Responses

**CODING:**
```
POST /api/tasks/{taskId}/complete
```

**MCQ:**
```
POST /api/mcq/submit
Body: { taskId, answers: [{ questionId, selectedAnswer }] }
```

**THEORY:**
```
POST /api/theory/{taskId}/submit
Body: FormData with file
```

## User Experience Flow

### For CODING Tasks
1. Student sees blue "Coding Challenge" badge
2. Writes code in editor
3. Runs code to test
4. Sees immediate feedback on test cases
5. Submits when all tests pass
6. Task marked as completed

### For MCQ Tasks
1. Student sees purple "Multiple Choice Quiz" badge
2. Answers all questions
3. Submits quiz
4. Sees immediate results (score, pass/fail)
5. Task marked as completed automatically

### For THEORY Tasks
1. Student sees green "Theory Assignment" badge
2. Uploads file
3. Sees "PENDING" status
4. Waits for teacher review
5. Views score and feedback when reviewed
6. Task marked as completed by teacher

## Testing Checklist

### Visual Indicators
- [ ] CODING tasks show blue badge and Code icon
- [ ] MCQ tasks show purple badge and CheckCircle icon
- [ ] THEORY tasks show green badge and FileText icon
- [ ] Completed tasks show green "Completed" badge
- [ ] Sidebar shows correct icons for each task type
- [ ] Sidebar shows correct labels (Coding, MCQ Quiz, Theory)

### Functionality
- [ ] CODING: Can write, run, and submit code
- [ ] MCQ: Can select answers and submit quiz
- [ ] MCQ: Results display correctly with pass/fail
- [ ] THEORY: Can upload files
- [ ] THEORY: Submission status displays correctly
- [ ] All types: Completion status persists after refresh

### Responsive Design
- [ ] Task type badges display correctly on mobile
- [ ] Icons are visible and clear on all screen sizes
- [ ] Sidebar task list is scrollable and accessible

## Notes
- MCQ questions now include `id` field for proper answer tracking
- Task completion works across all three types
- Visual design is consistent with color-coded system
- All task types support day-based locking mechanism
- Teachers and admins can view all task types without restrictions
