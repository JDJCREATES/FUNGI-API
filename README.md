# Fungi API

A RESTful service built with Node.js, Express, and MongoDB that provides detailed cultivation data for gourmet and medicinal mushrooms. Designed to power dashboards, mobile apps, or any client needing structured fungi‐cultivation information.

## Table of Contents

1. [Features](#features)  
2. [Prerequisites](#prerequisites)  
3. [Installation](#installation)  
4. [Configuration](#configuration)  
5. [Usage](#usage)  
   - [Base URL](#base-url)  
   - [Endpoints](#endpoints)  
6. [Data Schema](#data-schema)  
7. [Contributing](#contributing)  
8. [License](#license)  
9. [Acknowledgements](#acknowledgements)  

## Features

- **C.R.U.D. Operations**
  Create, Retrieve, Update, and Delete mushroom cultivation information
- **Species Catalog**  
  Retrieve scientific and common names, family info, and descriptive notes.  
- **Substrate Recipes**  
  Ingredient percentages, target moisture, and sterilization methods.  
- **Phase‑Specific Cultivation**  
  Separate colonization and fruiting parameters (temperature, humidity, CO₂, light, durations).  
- **Performance Metrics**  
  Expected yield, biological efficiency, and typical flush counts.  
- **Medicinal & Culinary Data**  
  Active compounds, dosage guidelines, flavor profiles, and cooking methods.  
- **Citation‑Driven Sources**  
  Links to authoritative books, articles, and extension bulletins for each entry.  

## Prerequisites
- **Node.js** ≥ 14.x & **npm** ≥ 6.x  
- **MongoDB** instance (local or Atlas)  

## Installation
1. **Clone the repo**  
   ```bash
   git clone https://github.com/yourusername/fungi-api.git
   cd fungi-api
````

2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Environment variables**
   Create a `.env` file in the project root:

   ```env
   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/fungi?retryWrites=true&w=majority
   PORT=3000
   ```
4. **Start the server**

   ```bash
   npm run dev
   ```

## Configuration

All config values live in `config/default.ts` or can be overridden via environment variables.

## Usage

### Base URL

```
http://localhost:3000/api
```

### Endpoints

* **GET /mushrooms**
  List all mushroom species.
* **GET /mushrooms/\:id**
  Retrieve detailed data for a single species.
* **POST /mushrooms**
  Add a new species record.
* **PUT /mushrooms/\:id**
  Update an existing species’ data.
* **DELETE /mushrooms/\:id**
  Remove a species from the catalog.

## Data Schema

A simplified Mongoose model excerpt:





## Environment Variables

This application requires the following environment variables:

### Authentication
- `JWT_SECRET`: Secret key for signing JWT tokens (required for authentication)
- `JWT_LIFETIME`: Lifetime of JWT tokens (default: "1d")

### Example .env file
```
MONGODB_URI=mongodb://localhost:27017/fungi-api
PORT=3000
JWT_SECRET=your-secret-key-here
JWT_LIFETIME=1d
```

**Important:** Never commit your actual JWT_SECRET to version control. The example above is for illustration only.
