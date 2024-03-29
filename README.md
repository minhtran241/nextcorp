# Nextcorp Documentation

[![Next.js](https://img.shields.io/badge/Frontend-Next.js-blue)](https://nextjs.org/)
[![ElysiaJS](https://img.shields.io/badge/API-ElysiaJS-green)](https://elysia.dev/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-orange)](https://www.postgresql.org/)

## Table of Contents
- [Overview](#overview)
- [Routes](#routes)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Data Flow](#data-flow)
- [Screenshots](#screenshots)
- [Authentication](#authentication)
- [Creator](#creator)

## Overview
Nextcorp is a company showcase website built with Next.js frontend, ElysiaJS as API, and PostgreSQL database. It serves as a platform for companies to showcase their products, services, and blog posts.


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
- **User Authentication**: Provides login and registration functionality for users to access member-only features.
- **Social Media Sharing**: Users can easily share blog posts via social media platforms.

## Technologies Used

- **Frontend**: Next.js
- **API**: ElysiaJS
- **Database**: PostgreSQL


## Data Flow

![Data Flow](/frontend/docs/diagrams/data-flow-diagram.png)

## Screenshots

| Register | Login | Blog Page |
|:---------:|:---------:|:---------:|
| ![Register Page](/frontend/public/screenshots/register.png) | ![Login Page](/frontend/public/screenshots/login.png) | ![Blog Page](/frontend/public/screenshots/blog.png) |


| Home Page | Single Blog Page |
|:---------:|:---------:| 
| ![Home Page](/frontend/public/screenshots/home.png) | ![Single Blog Page](/frontend/public/screenshots/single_blog.png) |

## Authentication

- **Refresh Token**: `/refresh`: Endpoint to refresh JWT token.
- **Revoke Token**: `/revoke`: Endpoint to revoke the refresh token.

## Creator

Created by [Minh Tran](https://minhtran-nine.vercel.app)
