# Task Types Implementation Plan

## Overview
Implement three types of tasks: **CODING**, **MCQ**, and **THEORY** with different submission and evaluation workflows.

## Database Schema

### 1. Task Entity (Updated)
- Added `taskType` enum field (CODING, MCQ, THEORY)
- Added `mcqQuestions` relationship (OneToMany)
- Existing fields: title, description, starterCode, testCases, course, dayNumber

### 2. McqQuestion Entity (New)
- Fields: question, optionA, optionB, optionC, optionD, correctAnswer, questionOrder
- Relationship: ManyToOne with Task

### 3. McqSubmission Entity (New)
- Fields: task, student, totalQuestions, correctAnswers, percentage, passed, answers, submittedAt
- Auto-graded: passed = percentage >= 60

### 4. TheorySubmission Entity (New)
- Fields: task, student, fileUrl, fileName, submittedAt, status (PENDING/PASS/FAIL), percentage, teacherFeedback, reviewedAt
- Requires manual teacher review

## Backend Implementation

### Repositories Needed:
1. `McqQuestionRepository`
2. `McqSubmissionRepository`
3. `TheorySubmissionRepository`

### Services Needed:
1. **TaskService** (Update)
   - Create tasks with different types
   - Fetch tasks with type-specific data

2. **McqService** (New)
   - Submit MCQ answers
   - Auto-grade submissions
   - Get submission results

3. **TheoryService** (New)
   - Upload theory submission files
   - Teacher review submissions
   - Update status and percentage

### Controllers Needed:
1. **TaskController** (Update)
   - Add taskType to create/update endpoints

2. **McqController** (New)
   - POST `/api/mcq/{taskId}/submit` - Submit answers
   - GET `/api/mcq/{taskId}/submission` - Get student's submission

3. **TheoryController** (New)
   - POST `/api/theory/{taskId}/submit` - Upload file
   - GET `/api/theory/{taskId}/submissions` - Get all submissions (teacher)
   - PUT `/api/theory/submission/{id}/review` - Review submission (teacher)
   - GET `/api/theory/{taskId}/submission` - Get student's submission

### DTOs Needed:
1. `CreateTaskRequestDTO` - Add taskType, mcqQuestions
2. `TaskResponseDTO` - Add taskType, mcqQuestions
3. `McqQuestionDTO`
4. `McqSubmissionDTO`
5. `TheorySubmissionDTO`
6. `ReviewTheorySubmissionDTO`

## Frontend Implementation

### 1. Task Creation (Teacher)
**Location**: `ManageCourse.jsx` or new `CreateTask.jsx`

```javascript
// Task type selector
<select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
  <option value="CODING">Coding Challenge</option>
  <option value="MCQ">Multiple Choice Quiz</option>
  <option value="THEORY">Theory Assignment</option>
</select>

// Conditional rendering based on taskType:
{taskType === 'CODING' && <CodingTaskForm />}
{taskType === 'MCQ' && <McqTaskForm />}
{taskType === 'THEORY' && <TheoryTaskForm />}
```

### 2. MCQ Task Form (Teacher)
- Add multiple questions
- Each question: text + 4 options + correct answer
- Question order management

### 3. Theory Task Form (Teacher)
- Task description/instructions
- No additional fields needed

### 4. Student Task View
**Location**: `CourseLearning.jsx`

```javascript
{task.taskType === 'CODING' && <CodingTaskView task={task} />}
{task.taskType === 'MCQ' && <McqTaskView task={task} />}
{task.taskType === 'THEORY' && <TheoryTaskView task={task} />}
```

### 5. MCQ Task View (Student)
- Display questions one by one or all at once
- Radio buttons for options
- Submit button
- Show results: score, percentage, pass/fail
- Minimum 60% to pass

### 6. Theory Task View (Student)
- File upload interface
- Submit button
- Show submission status: PENDING/PASS/FAIL
- Display teacher feedback and percentage when reviewed

### 7. Theory Review Interface (Teacher)
**New page**: `ReviewTheorySubmissions.jsx`
- List all theory submissions for a task
- Download submitted files
- Review form: Pass/Fail, Percentage, Feedback
- Submit review

## File Upload Configuration

### Backend:
- Configure file upload directory in `application.properties`
- Add file upload service
- Store files in: `uploads/theory/{taskId}/{studentId}/filename`

### Frontend:
- Use FormData for file upload
- Show upload progress
- Display submitted file name

## API Endpoints Summary

### Task Management:
- POST `/api/courses/{courseId}/tasks` - Create task (with type)
- GET `/api/courses/{courseId}/tasks` - Get all tasks
- DELETE `/api/tasks/{id}` - Delete task

### MCQ:
- POST `/api/mcq/{taskId}/submit` - Submit MCQ answers
- GET `/api/mcq/{taskId}/submission` - Get student's submission
- GET `/api/mcq/{taskId}/result` - Get submission result

### Theory:
- POST `/api/theory/{taskId}/submit` - Upload theory file
- GET `/api/theory/{taskId}/submission` - Get student's submission
- GET `/api/theory/task/{taskId}/submissions` - Get all submissions (teacher)
- PUT `/api/theory/submission/{id}/review` - Review submission (teacher)
- GET `/api/theory/submission/{id}/download` - Download file

## Implementation Steps

### Phase 1: Backend Foundation ✅
1. ✅ Create TaskType enum
2. ✅ Create McqQuestion entity
3. ✅ Create McqSubmission entity
4. ✅ Create TheorySubmission entity
5. ✅ Update Task entity

### Phase 2: Backend Services & Controllers
6. Create repositories
7. Create DTOs
8. Implement McqService
9. Implement TheoryService
10. Create McqController
11. Create TheoryController
12. Update TaskService and TaskController

### Phase 3: Frontend - Teacher
13. Update task creation form with type selector
14. Create MCQ question builder
15. Create theory task form

### Phase 4: Frontend - Student
16. Create MCQ task view with quiz interface
17. Create theory task view with file upload
18. Update CourseLearning to route by task type

### Phase 5: Frontend - Teacher Review
19. Create theory submissions list page
20. Create review interface
21. Add file download functionality

### Phase 6: Testing & Polish
22. Test all three task types
23. Test submissions and grading
24. Test teacher review workflow
25. Add error handling and validation

## Notes

- **MCQ Auto-Grading**: Happens immediately on submission
- **Theory Manual Review**: Teacher must review and assign grade
- **Coding Tasks**: Existing functionality remains unchanged
- **Pass Criteria**: MCQ requires 70%, Theory depends on teacher's decision
- **File Storage**: Theory submissions stored on server filesystem
- **Security**: Validate file types, size limits, and user permissions
