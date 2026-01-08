# Course Import File Format Guide

## Overview
This document describes the text file format for importing courses with lessons and tasks (CODING, MCQ, and THEORY types).

## File Format Rules

1. **Sections** are defined with square brackets: `[COURSE]`, `[LESSON]`, `[TASK]`
2. **Properties** use the format: `Key: Value`
3. **Keys are case-insensitive** but must include the colon
4. **Blank lines** are ignored
5. **Order matters**: Define COURSE first, then LESSONS and TASKS
6. **Task Types**: CODING (default), MCQ, or THEORY

## Basic Structure

```
[COURSE]
Title: Course Title
Description: Course Description
Paid: true/false
Price: 0.00
Published: false

[LESSON]
Title: Lesson Title
VideoUrl: https://youtube.com/...
Order: 1
Day: 1

[TASK]
Type: CODING/MCQ/THEORY
Title: Task Title
Description: Task Description
Day: 1
... (type-specific fields)
```

## Complete Example with All Task Types

```text
[COURSE]
Title: Complete Java Programming Course
Description: Master Java from basics to advanced concepts with hands-on coding, quizzes, and theory assignments.
Paid: true
Price: 999.00
Published: false

[LESSON]
Title: Introduction to Java
VideoUrl: https://www.youtube.com/watch?v=eIrMbAQSU34
Order: 1
Day: 1

[LESSON]
Title: Variables and Data Types
VideoUrl: https://www.youtube.com/watch?v=8cm1x4bC610
Order: 2
Day: 1

[TASK]
Type: CODING
Title: Hello World Challenge
Description: Write a program that prints "Hello, World!" to the console.
Day: 1
StarterCode: public class Main { public static void main(String[] args) { // Your code here } }
TestCase: Hello, World! | Hello, World!

[TASK]
Type: MCQ
Title: Java Basics Quiz
Description: Test your understanding of Java fundamentals
Day: 1
Question: What is the correct syntax to output "Hello World" in Java?
OptionA: echo("Hello World");
OptionB: System.out.println("Hello World");
OptionC: print("Hello World");
OptionD: Console.WriteLine("Hello World");
CorrectAnswer: B
Question: Which of the following is NOT a primitive data type in Java?
OptionA: int
OptionB: boolean
OptionC: String
OptionD: char
CorrectAnswer: C
Question: What is the default value of a boolean variable in Java?
OptionA: true
OptionB: false
OptionC: null
OptionD: 0
CorrectAnswer: B

[TASK]
Type: THEORY
Title: Java History Essay
Description: Write a 500-word essay about the history and evolution of Java programming language. Include key milestones, major versions, and its impact on modern software development. Submit as a PDF or Word document.
Day: 1

[LESSON]
Title: Control Flow - If Statements
VideoUrl: https://www.youtube.com/watch?v=ldYLYRNaucM
Order: 3
Day: 2

[LESSON]
Title: Loops in Java
VideoUrl: https://www.youtube.com/watch?v=6i_8v5_4P2E
Order: 4
Day: 2

[TASK]
Type: CODING
Title: Sum of Two Numbers
Description: Write a function that takes two integers and prints their sum.
Day: 2
StarterCode: import java.util.Scanner; public class Main { public static void main(String[] args) { Scanner sc = new Scanner(System.in); int a = sc.nextInt(); int b = sc.nextInt(); System.out.println(a + b); } }
TestCase: 5 10 | 15
TestCase: -5 5 | 0
TestCase: 100 200 | 300

[TASK]
Type: MCQ
Title: Control Flow Quiz
Description: Test your knowledge of if statements and loops
Day: 2
Question: Which loop is guaranteed to execute at least once?
OptionA: for loop
OptionB: while loop
OptionC: do-while loop
OptionD: foreach loop
CorrectAnswer: C
Question: What is the output of: if(5 > 3) { System.out.print("A"); } else { System.out.print("B"); }
OptionA: A
OptionB: B
OptionC: AB
OptionD: Error
CorrectAnswer: A

[LESSON]
Title: Arrays and Collections
VideoUrl: https://www.youtube.com/watch?v=NbYgm0r7u6o
Order: 5
Day: 3

[TASK]
Type: CODING
Title: Find Maximum in Array
Description: Given an array of integers, find and print the maximum value.
Day: 3
StarterCode: import java.util.Scanner; public class Main { public static void main(String[] args) { Scanner sc = new Scanner(System.in); int n = sc.nextInt(); int max = Integer.MIN_VALUE; for(int i = 0; i < n; i++) { int num = sc.nextInt(); if(num > max) max = num; } System.out.println(max); } }
TestCase: 5 1 3 7 2 5 | 7
TestCase: 3 -1 -5 -2 | -1
TestCase: 1 42 | 42

[TASK]
Type: THEORY
Title: Array vs ArrayList Comparison
Description: Create a detailed comparison document between Arrays and ArrayLists in Java. Include: 1) Key differences, 2) Performance considerations, 3) Use cases for each, 4) Code examples. Minimum 3 pages.
Day: 3
```

## Field Specifications

### COURSE Section (Required, appears once)
- **Title**: Course name (required)
- **Description**: Course description (required)
- **Paid**: `true` or `false` (required)
- **Price**: Decimal number (required if Paid=true)
- **Published**: `true` or `false` (optional, defaults to false)

### LESSON Section (Optional, can appear multiple times)
- **Title**: Lesson name (required)
- **VideoUrl**: YouTube URL (required)
- **Order**: Integer, lesson sequence (required)
- **Day**: Integer, day number (optional, defaults to 1)

### TASK Section (Optional, can appear multiple times)

#### Common Fields (All Task Types)
- **Type**: `CODING`, `MCQ`, or `THEORY` (optional, defaults to CODING)
- **Title**: Task name (required)
- **Description**: Task description (required)
- **Day**: Integer, day number (optional, defaults to 1)

#### CODING Task Specific Fields
- **StarterCode**: Initial code template (required)
- **TestCase**: Format: `input | expected_output` (at least one required)
  - Can have multiple TestCase lines
  - Each on a new line

#### MCQ Task Specific Fields
- **Question**: Question text (required, can have multiple)
- **OptionA**: First option (required for each question)
- **OptionB**: Second option (required for each question)
- **OptionC**: Third option (required for each question)
- **OptionD**: Fourth option (required for each question)
- **CorrectAnswer**: `A`, `B`, `C`, or `D` (required for each question)

**Note**: For MCQ tasks, repeat the Question/Options/CorrectAnswer block for each question.

#### THEORY Task Specific Fields
- **No additional fields required**
- Students will upload files (PDF, DOC, DOCX, TXT)
- Teacher will review and grade manually

## Important Notes

1. **Day-Based Access**: Students can only access content for their current day
2. **Task Completion**: 
   - CODING: Auto-graded via test cases
   - MCQ: Auto-graded, 70% pass threshold
   - THEORY: Manual teacher review required
3. **Default Values**:
   - Day: 1
   - Published: false
   - Task Type: CODING
4. **MCQ Questions**: Each question must have all 4 options and a correct answer
5. **Test Cases**: Format is `input | expected_output` with pipe separator
6. **File Size**: Keep file under 10MB for smooth upload

## Validation Rules

- Course must have at least a title and description
- Lessons must have title, video URL, and order
- CODING tasks must have at least one test case
- MCQ tasks must have at least one complete question (with 4 options)
- THEORY tasks only need title and description

## Tips for Creating Import Files

1. **Start Simple**: Begin with one lesson and one task
2. **Test Incrementally**: Import and verify before adding more content
3. **Use Consistent Formatting**: Keep spacing and structure uniform
4. **Validate URLs**: Ensure YouTube URLs are correct
5. **Number Sequentially**: Use sequential order numbers for lessons
6. **Group by Day**: Organize lessons and tasks by day number
7. **Mix Task Types**: Combine CODING, MCQ, and THEORY for variety
8. **Proofread MCQs**: Double-check correct answers before importing

## Example: Minimal Course

```text
[COURSE]
Title: Quick Java Intro
Description: A brief introduction to Java programming
Paid: false
Price: 0

[LESSON]
Title: Java Basics
VideoUrl: https://www.youtube.com/watch?v=eIrMbAQSU34
Order: 1
Day: 1

[TASK]
Type: CODING
Title: Print Your Name
Description: Write a program to print your name
Day: 1
StarterCode: public class Main { public static void main(String[] args) { System.out.println("Your Name"); } }
TestCase: | Your Name
```

## Troubleshooting

**Import Failed?**
- Check for missing required fields
- Verify correct section headers `[COURSE]`, `[LESSON]`, `[TASK]`
- Ensure proper key:value format
- Validate MCQ questions have all 4 options
- Check test case format: `input | output`

**Tasks Not Showing?**
- Verify Day number is set correctly
- Check task Type is spelled correctly
- Ensure task has required fields for its type
