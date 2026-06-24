# readme-generator 🚀

[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Stars](https://img.shields.io/github/stars/harshitsaxena214/readme-generator?style=flat-square)](https://github.com/harshitsaxena214/readme-generator/stargazers)
[![Forks](https://img.shields.io/github/forks/harshitsaxena214/readme-generator?style=flat-square)](https://github.com/harshitsaxena214/readme-generator/network/members)
[![Homepage](https://img.shields.io/badge/Live%20Demo-supadocs.vercel.app-blue.svg?style=flat-square)](https://supadocs.vercel.app)

## Overview

`readme-generator` is an AI-powered tool designed to streamline the creation of professional and comprehensive `README.md` files for your GitHub repositories. By analyzing your actual codebase and leveraging cutting-edge AI models, this application generates project-specific documentation that accurately reflects your project's structure, technologies, and purpose.

The primary goal of `readme-generator` is to help developers produce high-quality, relevant documentation with minimal effort, improving project visibility and understanding for collaborators and users alike. Built with a modern Next.js frontend, it provides a seamless and intuitive user experience for generating detailed project documentation effortlessly.

## Features ✨

*   **AI-Powered Analysis**: Intelligently analyzes your GitHub repository's codebase to understand its core functionalities and tech stack.
*   **Project-Specific Documentation**: Generates unique `README.md` content tailored precisely to your project's characteristics.
*   **Professional Output**: Produces well-structured, easy-to-read, and professional-grade documentation.
*   **Modern User Interface**: A responsive and intuitive interface built with React, Next.js, and Tailwind CSS.
*   **Google Gemini Integration**: Utilizes Google's generative AI models for sophisticated content creation.
*   **Rate Limiting**: Implements robust rate limiting using Upstash Redis to manage API requests efficiently.
*   **Analytics**: Integrated with Vercel Analytics for performance monitoring and usage insights.

## Tech Stack 🛠️

The `readme-generator` project is built using a robust and modern set of technologies:

| Technology         | Version       | Description                                              |
| :----------------- | :------------ | :------------------------------------------------------- |
| **TypeScript**     | `5.x`         | Superset of JavaScript for type-safe development.        |
| **React**          | `19.2.4`      | Frontend library for building user interfaces.           |
| **Next.js**        | `16.2.9`      | React framework for production-grade applications.       |
| **Tailwind CSS**   | `4.x`         | Utility-first CSS framework for rapid UI development.    |
| **Google GenAI**   | `2.9.0`       | Integration with Google's generative AI models (Gemini). |
| **Upstash Redis**  | `1.38.0`      | Serverless Redis for data storage and rate limiting.     |
| **Upstash Ratelimit** | `2.0.8`    | Toolkit for implementing rate limiting with Upstash Redis. |
| **Framer Motion**  | `12.40.0`     | Production-ready motion library for React.               |
| **Lucide React**   | `0.469.0`     | Beautifully simple and consistent icon toolkit.          |
| **Shadcn/ui**      | `4.11.0`      | Reusable components for building modern web apps.        |
| **React Query**    | `5.101.0`     | Powerful asynchronous state management for React.        |
| **React Markdown** | `10.1.0`      | Renders markdown strings as React components.            |
| **Spline Tool**    | `4.1.0`       | Integration for interactive 3D web experiences.          |
| **Vercel Analytics** | `2.0.1`     | Analytics platform by Vercel for Next.js applications.   |

## Prerequisites ⚙️

Before you begin, ensure you have the following software installed on your system:

*   **Node.js**: Version 20.x or higher.
    *   [Download Node.js](https://nodejs.org/en/download/)
*   **npm** (Node Package Manager) or **Yarn** / **pnpm** / **bun**:
    *   npm comes bundled with Node.js.
    *   [Yarn Installation](https://yarnpkg.com/getting-started/install)
    *   [pnpm Installation](https://pnpm.io/installation)
    *   [bun Installation](https://bun.sh/docs/installation)
*   **Git**: For cloning the repository.
    *   [Download Git](https://git-scm.com/downloads)

## Installation 📦

Follow these steps to get a development copy of `readme-generator` up and running on your local machine.

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/harshitsaxena214/readme-generator.git
    cd readme-generator
    ```

2.  **Install Dependencies:**

    Using npm:
    ```bash
    npm install
    ```
    Or using Yarn:
    ```bash
    yarn install
    ```
    Or using pnpm:
    ```bash
    pnpm install
    ```
    Or using bun:
    ```bash
    bun install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root of the project directory and populate it with the necessary environment variables. See the [Environment Variables](#environment-variables-🔒) section for details.

## Usage 🚀

Once the installation is complete and environment variables are set, you can run the application.

1.  **Start the Development Server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

2.  **Access the Application:**

    Open your web browser and navigate to `http://localhost:3000`.

    You will be greeted by the `readme-generator` interface. Input the URL of a GitHub repository you wish to generate a README for, and let the AI do the rest!

## Environment Variables 🔒

This project requires certain environment variables to be set for proper functionality, especially for interacting with AI models and rate limiting services. Create a `.env.local` file in the root directory of your project and add the following:

| Variable                     | Description                                            | Example Value                                  |
| :--------------------------- | :----------------------------------------------------- | :--------------------------------------------- |
| `GOOGLE_GEMINI_API_KEY`      | Your API key for accessing Google's Gemini AI models.  | `YOUR_GEMINI_API_KEY_HERE`                     |
| `UPSTASH_REDIS_REST_URL`     | REST URL for your Upstash Redis database.              | `https://xyz-your-db.upstash.io`               |
| `UPSTASH_REDIS_REST_TOKEN`   | REST Token for authenticating with Upstash Redis.       | `YOUR_UPSTASH_REDIS_TOKEN_HERE`                |

**Example `.env.local` file:**

```dotenv
GOOGLE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
UPSTASH_REDIS_REST_URL="https://xyz-your-db.upstash.io"
UPSTASH_REDIS_REST_TOKEN="YOUR_UPSTASH_REDIS_TOKEN_HERE"
```

## Project Structure 📁

The project follows a standard Next.js application structure with logical separation of concerns:

```
├── .github/                 # GitHub workflows (e.g., CI/CD) - assumed based on professional setup
├── public/                  # Static assets like images, fonts, and favicons
├── src/                     # Main application source code
│   ├── app/                 # Next.js App Router root, containing pages and layouts
│   ├── components/          # Reusable UI components (e.g., Shadcn/ui components)
│   ├── lib/                 # Utility functions, API clients, helpers (e.g., AI client, Redis client)
│   ├── styles/              # Global styles or Tailwind CSS configurations
│   └── types/               # TypeScript custom type definitions
├── components.json          # Configuration for Shadcn/ui components
├── eslint.config.mjs        # ESLint configuration for code quality
├── next.config.ts           # Next.js configuration file
├── package.json             # Project metadata and dependencies
├── postcss.config.mjs       # PostCSS configuration, typically for Tailwind CSS
├── tailwind.config.ts       # Tailwind CSS configuration (inferred from postcss.config.mjs & dependencies)
├── tsconfig.json            # TypeScript compiler configuration
└── README.md                # This README file
```

## API Documentation 🔌

`readme-generator` primarily functions as a frontend application that interacts with internal API routes to process repository data and communicate with the Google Gemini AI. While no public REST API is exposed for external consumption, the internal API routes handle:

*   **Repository Analysis**: Fetching and parsing data from the provided GitHub repository URL.
*   **AI Interaction**: Sending relevant repository context to the Google Gemini API and receiving generated README content.
*   **Rate Limiting**: Managing and enforcing API request limits using Upstash Redis.

These internal APIs are crucial for the application's core functionality, orchestrating the data flow between the UI, GitHub, and the AI models.

## Contributing 🤝

We welcome contributions to `readme-generator`! Whether you're reporting a bug, suggesting a new feature, or submitting code changes, your help is appreciated.

Please follow these steps to contribute:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `git checkout -b bugfix/issue-description`.
3.  **Make your changes** and ensure they adhere to the project's coding style.
4.  **Write clear, concise commit messages.**
5.  **Push your branch** to your forked repository.
6.  **Open a Pull Request** to the `main` branch of this repository, providing a detailed description of your changes.

