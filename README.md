# Nextcorp Documentation

[![Next.js](https://img.shields.io/badge/Frontend-Next.js-blue)](https://nextjs.org/)
[![ElysiaJS](https://img.shields.io/badge/API-ElysiaJS-green)](https://elysia.dev/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-orange)](https://www.postgresql.org/)

## Table of Contents

- [Overview](#overview)
- [Routes](#routes)
- [Features](#features)
- [Diagrams](#diagrams)
  - [Use Case Diagram](#use-case-diagram)
  - [High-Level Architecture](#high-level-architecture)
  - [Database ER Diagram](#database-er-diagram)
- [Screenshots](#screenshots)
- [Creator](#creator)

## Overview

Nextcorp is a comprehensive toolkit designed to cater to the diverse needs of businesses and enterprises. Developed using Next.js, Nextcorp boasts a modern and versatile framework that seamlessly integrates essential pages, ensuring a cohesive user experience.

From showcasing your products and services to engaging with your audience through a dynamic blog page, Nextcorp provides the perfect platform to elevate your online presence. With its sleek design and intuitive navigation, visitors will be effortlessly guided through your site, enhancing their overall experience.

## Routes

1. `/`: Home page showcasing company information and featured products/services.
2. `/blog`: Displays a list of blog posts.
3. `/login`: Login page for users to authenticate.
4. `/register`: Registration page for new users.
5. `/blog/slug-of-blog`: Displays a specific blog post identified by its slug.
6. `/refresh`: Endpoint to refresh JWT token.
7. `/revoke`: Endpoint to revoke the refresh token.

## Features

- **Company Showcase**: Nextcorp highlights company information and featured products/services on the home page.
- **Blog**: Users can read and share blog posts on various topics related to the company's domain.
- **User Authentication and Authorization**: Provides login and registration functionality for users to access member-only features. 2 types of users: Admin and Regular.
- **Social Media Sharing**: Users can easily share blog posts via social media platforms.
- **Admin Dashboard**: Admins can create, edit, and delete blog posts through a secure dashboard.
- **Dark/Light/System Theme**: Users can switch between dark, light, and system themes for a personalized experience.
- **Message Submissions**: Users can submit messages to the company for inquiries or feedback.
- **Schedule Meeting**: Users can schedule a meeting with the company through a simple form.

## Diagrams

### Use Case Diagram

![Use Case Diagram](/frontend/docs/diagrams/usecase.png)

### High-Level Architecture

![High-Level Architecture](/frontend/docs/diagrams/data-flow-diagram.png)

### Database ER Diagram

![Database ER Diagram](/frontend/docs/diagrams/nextcorp-erdiagram.png)

## Screenshots

### Home Page (Light/Dark Theme)

| Light Theme | Dark Theme |
|:---------:|:---------:|
| ![Light Theme](/frontend/public/screenshots/home.png) | ![Dark Theme](/frontend/public/screenshots/home_dark.png) |

### Blog Page

![Blog Page](/frontend/public/screenshots/blog.png)

### Single Blog Page

![Single Blog Page](/frontend/public/screenshots/single_blog.png)

### Contact Page

![Contact Page](/frontend/public/screenshots/contact.png)

### Login Page

![Login Page](/frontend/public/screenshots/login.png)

### Register Page

![Register Page](/frontend/public/screenshots/register.png)

### Admin Dashboard

![Admin Dashboard](/frontend/public/screenshots/admin.png)

## System Testing and Code Coverage Report

While Elysia.js is a relatively new framework, it boasts a robust Unit Testing capability when paired with the Bun runtime. Leveraging the Bun runtime, which incorporates a built-in test runner accessible through the [bun:test](https://bun.sh/docs/cli/test) module, developers can easily conduct unit tests akin to Jest.

### Unit Testing

To ensure the reliability and stability of Nextcorp, I meticulously crafted a comprehensive suite of unit tests. These tests cover a spectrum of scenarios that Nextcorp's API might encounter, including various HTTP status codes such as *200, 401, 404, 409, and 500*. Below, you'll find details regarding the test endpoint, descriptions, and associated status codes.

![Unit Testing](/frontend/public/screenshots/unittest.png)

### Code Coverage Report

Bun's test runner supports [built-in code coverage reporting](https://bun.sh/guides/test/coverage). This makes it easy to see how much of the codebase is covered by tests and find areas not currently well-tested. I write the *bunfig.toml* file to enable this feature. This will print out the coverage reporting for me as below.

![Code Coverage Report](/frontend/public/screenshots/code_coverage.png)

## Creator

Created by [Minh Tran](https://minhtran-nine.vercel.app)
