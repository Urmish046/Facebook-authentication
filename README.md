# Facebook Authentication

A Facebook-inspired authentication system built with Next.js 14 following MVC Architecture. Users can sign up, log in, reset their password via email, and receive JWT tokens on login.

---

## Tech Stack

- **Next.js 14** (App Router)
- **MongoDB** with Mongoose
- **bcryptjs** for password hashing
- **jsonwebtoken** for JWT authentication
- **Resend** for sending emails
- **Tailwind CSS** for styling

---

## Project Structure

The project follows MVC (Model-View-Controller) architecture.

**Model** lives in `src/model/User.js` and defines the MongoDB schema for users including fields for name, email, password, date of birth, gender, and password reset tokens.

**View** lives in `src/app/` — all the pages and components that the user sees. These files only handle UI and call the API. No business logic here.

**Controller** lives in `src/controllers/authController.js` — this is where all the business logic lives. Every function like registering a user, logging in, sending a reset email, and updating a password is handled here.

**Routes** live in `src/app/api/` — these are thin files that receive the HTTP request, pass it to the controller, and return the response. Nothing else.

```
src/
├── app/
│   ├── (auth)/login/page.jsx
│   ├── (auth)/signup/page.jsx
│   ├── api/
│   │   ├── auth/login/route.js
│   │   ├── sign-up/route.js
│   │   ├── forgot-password/route.js
│   │   └── reset-password/route.js
│   ├── components/auth/
│   │   ├── login-form.jsx
│   │   └── signup-form.jsx
│   ├── forgot-password/page.js
│   ├── reset-password/page.js
│   └── home/page.js
├── controllers/
│   └── authController.js
├── lib/
│   ├── dbConnect.js
│   └── validators.js
└── model/
    └── User.js
```

---

## Getting Started

Clone the repository and install dependencies.

```bash
git clone https://github.com/Urmish046/Facebook-authentication.git
cd Facebook-authentication
npm install
```

Create a `.env` file in the root with the following variables.

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RESEND_API_KEY=your_resend_api_key
NEXTAUTH_URL=http://localhost:3000
```

Run the development server.

```bash
npm run dev
```

---

## API Endpoints

**POST /api/sign-up**
Creates a new user account.
```json
{
  "firstName": "name",
  "surname": "name",
  "emailOrMobile": "name@example.com",
  "password": "Test@1234",
  "dateOfBirth": "2000-01-01",
  "gender": "male"
}
```

**POST /api/auth/login**
Logs in a user and returns a JWT token.
```json
{
  "emailOrMobile": "name@example.com",
  "password": "Test@1234"
}
```

**POST /api/forgot-password**
Sends a password reset link to the user's email.
```json
{
  "email": "name@example.com"
}
```

**POST /api/reset-password**
Resets the user's password using the token from the email.
```json
{
  "token": "token_from_email",
  "email": "name@example.com",
  "newPassword": "NewPass@1234"
}
```

---

## Author

Urmish Zaman — [@Urmish046](https://github.com/Urmish046)