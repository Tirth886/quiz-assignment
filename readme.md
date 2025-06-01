# Quiz Assignment

A RESTful Quiz API built with Node.js and TypeScript, using an in-memory data store for quizzes, questions, and user answers. This service is containerized using Docker and Docker Compose. I have attached the workaround postman collection inside the project root directory.

## Table of Contents

* [Project Overview](#project-overview)
* [Features](#features)
* [Prerequisites](#prerequisites)
* [Getting Started](#getting-started)

  * [Clone the Repository](#clone-the-repository)
  * [Environment Variables](#environment-variables)
  * [Build & Run with Docker](#build--run-with-docker)
* [API Endpoints](#api-endpoints)

  * [Create Session](#create-session)
  * [Create Quiz](#create-quiz)
  * [Create Quiz](#create-quiz)
  * [Get Quiz by ID](#get-quiz-by-id)
  * [Submit Answer](#submit-answer)
  * [Get Results](#get-results)
* [Known Issues & Limitations](#known-issues--limitations)

---

## Project Overview

This service provides a simple quiz engine that supports:

1. **Creating a new user** 
(<b>Note</b>: creating new user is mandatory befor calling fetch quiz, submitting answer, retriving user result)
2. **Fetching quiz information**
3. **Submitting answers**
4. **Retrieving user results**

All data is stored in-memory (no external database). A lightweight in-memory cache layer is used to optimize read performance for quizzes. The entire application is containerized with Docker, allowing you to spin up the service (and any related dependencies) via Docker Compose.

---

## Tech Stack

* **Node.js + TypeScript**
* **Express** 
* **In-Memory Data Store**:
* **Dockerized**
* **Validation & Error Handling using Zod**

---

## Prerequisites

Before you begin, ensure you have the following installed on your workstation:

* [Docker](https://www.docker.com/get-started) (v20.10+)
* [Docker Compose](https://docs.docker.com/compose/install/) (v1.29+)
* (Optional) [Node.js](https://nodejs.org/) & [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/) for local development

> **Note:** If you only plan to run via Docker Compose, you **don’t** need Node.js or npm/yarn installed locally.

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/Tirth886/quiz-assignment.git
cd quiz-assignment
```

### Environment Variables

Create a copy of the example environment file (if provided). For instance:

```bash
cp .env.example .env
```

The `.env` file must include:

```env
APP_NAME="Quiz"
PORT=3000
```

Adjust values as needed..

### Build & Run with Docker

1. **Build the Docker image & start containers**
   ```bash
   docker-compose up --build
   Or 
   npm start --this command will start docker-compose up
   ```

2. **Verify that the service is running**
   ```bash
   curl http://localhost:3000/
   ```

   You should see a response such as:

   ```json
    {
      "status":200,
      "data":{
        "status":"ok"
      }
    }
   ```

3. **Docker down**

   ```bash
   docker-compose down
   ```
---

## API Endpoints

### Create Session

* **URL**: `/api/user/register`
* **Method**: `POST`
* **Description**: Create a new user session.
* **Request Body**:

  ```json
  {
    "name":"Test name"
  }
  ```
* **Success Response**:

  * **Status**: `201 Created`
  * **Body**:

    ```json
    {
        "status": 201,
        "data": {
            "id": "2476cfc5-41f0-4e3f-8656-b59519a7593f",
            "name": "Test name"
        }
    }
    ```
* **Error Responses**:
  * `500 Internal Server Error` – Unexpected server error

### Create Quiz

* **URL**: `/api/quiz/create`
* **Method**: `POST`
* **Description**: Create a new quiz with a set of questions.
* **Request Body**:

  ```json
  {
    "title": "General Knowledge Quiz",
    "questions": [
      {
        "text": "What is the capital of France?",
        "options": ["Berlin", "Madrid", "Paris", "Rome"],
        "correct_option": 2
      },
      {
        "text": "Which planet is known as the Red Planet?",
        "options": ["Earth", "Mars", "Jupiter", "Venus"],
        "correct_option": 1
      }
      // ...more questions
    ]
  }
  ```
* **Success Response**:

  * **Status**: `201 Created`
  * **Body**:

    ```json
    {
        "status": 201,
        "data": {
            "id": "2476cfc5-41f0-4e3f-8656-b59519a7593f"
        }
    }
    ```
* **Error Responses**:

  * `400 Bad Request` – Validation failed (e.g., missing fields, invalid structure)
  * `500 Internal Server Error` – Unexpected server error

### Get Quiz by ID

* **URL**: `/api/quiz/:quizId`
* **Method**: `GET`
* **Description**: Fetch a quiz by its ID. Returns questions **without** revealing the `correct_option`.
* **URL Parameters**:

  * `quizId` (string) – The unique identifier of the quiz
* **Success Response**:

  * **Status**: `200 OK`
  * **Body**:

    ```json
    {
        "status": 200,
        "data": {
            "id": "386343b7-7007-4221-8d35-68df1cdfd00f",
            "title": "JavaScript Basics",
            "questions": [
                {
                    "id": "0d1e5cb8-1700-4f58-b062-5288f8146e1d",
                    "text": "What is the result of `typeof null` in JavaScript?",
                    "options": [
                        "object",
                        "null",
                        "undefined",
                        "number"
                    ]
                },
                // ...more questions
            ]
        }
    }
    ```
* **Error Responses**:

  * `404 Not Found` – No quiz matches the given `quizId`
  * `403 Forbidden` – If user not exist in memory
  * `500 Internal Server Error` – Unexpected server error

### Submit Answer

* **URL**: `/api/quiz/:quizId/feedback?selected_option=0`
* **Method**: `GET`
* **Description**: Submit an answer for a specific question in a quiz. Returns immediate feedback (correct/incorrect).
* **URL Parameters**:

  * `quizId` (string) – The quiz being answered
* **QUERY Parameters**:

  * `selected_option` (number) – User selected index number

* **Success Response**:

  * **Status**: `200 OK`
  * **Body** (if correct):

    ```json
    {
        "status": 200,
        "data": {
            "questionId": "0d1e5cb8-1700-4f58-b062-5288f8146e1d",
            "questionText": "What is the result of `typeof null` in JavaScript?",
            "selectedOption": 0,
            "isCorrect": true,
            "correctOption": null
        }
    }
* **Error Responses**:

  * `400 Bad Request` – Feedback already given
  * `404 Not Found` – `question_id` does not exist
  * `403 Forbidden` – If user not exist in memory
  * `500 Internal Server Error` – Unexpected server error

### Get Results

* **URL**: `/api/quiz/:quizId/result`
* **Method**: `GET`
* **Description**: Retrieve a user’s results for a specific quiz (score + summary of all answers).
* **URL Parameters**:
  * `quizId` (string) – The quiz ID
* **Cookie Parameters**:
  * `sessionId` (string) – The userSessionID
* **Success Response**:
  * **Status**: `200 OK`
  * **Body**:

    ```json
    {
      "status": 200,
      "data": {
          "id": "0a1cc2ec-053f-47fb-a37d-9ba9e2cc3215",
          "name": "Tirth Jain",
          "score": 2,
          "incorrect": 1,
          "summary": [
              {
                  "id": "0a1cc2ec-053f-47fb-a37d-9ba9e2cc3215_1efdec88-c884-47eb-ad07-9f2e26d9b57b",
                  "question": "What is the result of `typeof null` in JavaScript?",
                  "questionId": "1efdec88-c884-47eb-ad07-9f2e26d9b57b",
                  "correct_option": null,
                  "correct_option_index": null,
                  "selected_option": "object",
                  "selected_option_index": 0
              },
              // ...more question summary 
          ]
      }
    }
    ```
* **Error Responses**:

  * `404 Not Found` – No results found for the given `quizId` and `userId`
  * `403 Forbidden` – If user not exist in memory
  * `500 Internal Server Error` – Unexpected server error

---

## Known Issues & Limitations

Some potential limitations to be aware of:

1. **Data Persistence**

   * All data is stored in-memory. If the server restarts, quizzes, user answers, and results are lost.

2. **“No Attempt” and “Zero Score”**  
   * User has not attempted or answerd incorrect both are same considering Zero. 

3. **Session Requirement**  
   * Without a valid user session (or authentication token), the API will not allow quiz submission or fetching quiz results. Users must maintain session state to interact with these endpoints.

4. **Unattempted Quiz Results**  
   * Once a session is created and a quiz exists, anyone who knows the `quizId` can fetch the result endpoint and receive a zero‐score response, even if they are not the original user or never attempted the quiz.

5. **No prevention for Duplication Names**  
    * same names are allowed while creating session their IDs are different.  
---