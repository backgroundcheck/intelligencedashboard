# Intelligence Dashboard
AI-driven data intelligence dashboard for advanced analytics and insights.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Current State
This repository is currently minimal with only a README.md file. The project is in bootstrap phase and needs initial setup for AI-driven data intelligence dashboard development.

## Available Tools and Versions
The following tools are available in the development environment:

- **Python**: 3.12.3 (`python3 --version`)
- **Node.js**: Available via npm 10.8.2 (`npm --version`)
- **Docker**: 28.0.4 (`docker --version`)
- **Git**: Available for version control
- **curl**: Available for API testing
- **Basic Linux tools**: mkdir, cat, ls, find, etc.

## Working Effectively

### Repository Validation
- Verify this is an empty repository: `ls -la` should show only README.md and .git directory
- Current repository contains only basic structure and requires full setup

### Initial Setup and Bootstrapping
Since this is a new repository, you will need to bootstrap the development environment:

1. **Determine Technology Stack**: Based on AI dashboard requirements, recommended stack includes:
   - Frontend: React/Vue.js with TypeScript for dashboard UI
   - Backend: Python with FastAPI/Flask for AI model serving
   - Database: PostgreSQL or MongoDB for data storage
   - AI/ML: Python with scikit-learn, TensorFlow, or PyTorch
   - Containerization: Docker for deployment

2. **Initialize Project Structure**:
   ```bash
   # Create basic directory structure
   mkdir -p frontend backend database docs tests
   mkdir -p frontend/src frontend/public
   mkdir -p backend/app backend/models backend/api
   mkdir -p database/migrations database/seeds
   ```

3. **Frontend Setup (if choosing React/TypeScript)**:
   ```bash
   cd frontend
   npx create-react-app . --template typescript  # Takes 2 minutes. NEVER CANCEL. Set timeout to 10+ minutes.
   npm run build  # Takes 8 seconds. NEVER CANCEL. Set timeout to 5+ minutes.
   npm run test -- --watchAll=false  # Takes 2 seconds. NEVER CANCEL.
   ```

4. **Backend Setup (if choosing Python/FastAPI)**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install fastapi uvicorn pandas numpy scikit-learn  # Takes 30-60 seconds. NEVER CANCEL. Set timeout to 5+ minutes.
   pip freeze > requirements.txt
   
   # Create basic FastAPI app
   cat > main.py << 'EOF'
   from fastapi import FastAPI
   
   app = FastAPI()
   
   @app.get("/")
   def read_root():
       return {"Hello": "World"}
   
   @app.get("/health")
   def health_check():
       return {"status": "healthy"}
   EOF
   
   # Test the server
   uvicorn main:app --host 0.0.0.0 --port 8000  # Starts immediately
   # Visit http://localhost:8000/docs for API documentation
   ```

5. **Docker Setup**:
   ```bash
   # Create docker-compose.yml for full stack
   cat > docker-compose.yml << 'EOF'
   version: '3.8'
   
   services:
     frontend:
       build: ./frontend
       ports:
         - "3000:3000"
       depends_on:
         - backend
   
     backend:
       build: ./backend  
       ports:
         - "8000:8000"
       environment:
         - DATABASE_URL=postgresql://user:password@db:5432/intelligence_db
       depends_on:
         - db
   
     db:
       image: postgres:15
       environment:
         POSTGRES_DB: intelligence_db
         POSTGRES_USER: user
         POSTGRES_PASSWORD: password
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   EOF
   
   # Note: Docker builds may fail due to SSL certificate issues in some environments
   # If docker build fails with SSL errors, use local development instead
   docker-compose build  # Takes 5-15 minutes first time. NEVER CANCEL. Set timeout to 30+ minutes.
   docker-compose up -d  # Takes 1-2 minutes to start services.
   ```

### Build and Test Commands
**Note**: Since this is currently an empty repository, these commands will only work after initial project setup.

- **Frontend Build**: 
  ```bash
  cd frontend
  npx create-react-app . --template typescript  # Takes 2 minutes. NEVER CANCEL. Set timeout to 10+ minutes.
  npm run build  # Takes 8 seconds. NEVER CANCEL. Set timeout to 5+ minutes.
  npm run test -- --watchAll=false  # Takes 2 seconds. NEVER CANCEL.
  ```

- **Backend Testing**:
  ```bash
  cd backend
  source venv/bin/activate
  pip install pytest  # Takes 10-20 seconds. NEVER CANCEL.
  python -m pytest  # Takes 5-30 seconds depending on test suite. NEVER CANCEL.
  
  # Test FastAPI server manually
  uvicorn main:app --host 0.0.0.0 --port 8000 &
  curl http://localhost:8000/  # Should return {"Hello":"World"}
  curl http://localhost:8000/health  # Should return {"status":"healthy"}
  curl http://localhost:8000/docs  # Should return Swagger UI HTML
  ```

- **Full Stack**:
  ```bash
  # Note: Docker builds may fail in some environments due to SSL certificate issues
  # If you encounter SSL errors, use local development instead
  docker-compose build  # Takes 10-30 minutes first time. NEVER CANCEL. Set timeout to 45+ minutes.
  docker-compose up  # Takes 1-5 minutes to start all services.
  docker-compose down  # Cleanup
  
  # Alternative: Local development (if Docker fails)
  # Terminal 1: Backend
  cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000
  # Terminal 2: Frontend  
  cd frontend && npm start
  ```

### Running the Application
**After initial setup is complete**:

1. **Development Mode**:
   ```bash
   # Terminal 1 - Backend
   cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000
   
   # Terminal 2 - Frontend  
   cd frontend && npm start  # Opens browser on http://localhost:3000
   ```

2. **Production Mode**:
   ```bash
   docker-compose up -d  # Starts all services in background
   # Access at http://localhost:3000 (frontend) and http://localhost:8000 (backend)
   ```

## Validation Scenarios
**CRITICAL**: After making any changes, always run these validation scenarios:

1. **Repository State Validation**:
   - Run `ls -la` to confirm current repository structure
   - If only README.md exists, follow bootstrapping steps above

2. **After Frontend Setup**:
   - Navigate to http://localhost:3000
   - Verify React app loads with default page
   - Check browser console for any errors
   - Take screenshot of working frontend

3. **After Backend Setup**:
   - Navigate to http://localhost:8000/docs (FastAPI auto-docs)
   - Test basic API endpoints:
     - `curl http://localhost:8000/` should return `{"Hello":"World"}`
     - `curl http://localhost:8000/health` should return `{"status":"healthy"}`
   - Verify database connection if configured
   - Check server logs for any errors

4. **Full Integration Test**:
   - Start both frontend and backend services
   - Test data flow from backend to frontend dashboard
   - Verify AI model endpoints respond correctly (once implemented)
   - Test user authentication if implemented
   - Check browser console for JavaScript errors
   - Verify API calls are working in browser network tab

5. **Environment Validation**:
   - Verify Python version: `python3 --version` (should be 3.12+)
   - Verify Node.js: `npm --version` (should be 10+)
   - Check Docker: `docker --version` (if using containerization)
   - Test internet connectivity for package installations

## Common Tasks

### Repository Root (Current State)
```bash
ls -la
# Output:
# total 16
# drwxr-xr-x 3 runner docker 4096 Sep  9 11:39 .
# drwxr-xr-x 3 runner docker 4096 Sep  9 11:38 ..
# drwxr-xr-x 7 runner docker 4096 Sep  9 11:39 .git
# -rw-r--r-- 1 runner docker   52 Sep  9 11:39 README.md
```

### README Content (Current)
```bash
cat README.md
# intelligencedashboard
# ai driven data intelligence
```

### Key Development Guidelines
- **Always validate repository state first**: Check if this is still an empty repo before following setup instructions
- **Never cancel long-running builds**: npm install, docker builds, and AI model training can take 15-45 minutes
- **Set appropriate timeouts**: Use 60+ minutes for initial builds, 30+ minutes for tests
- **Follow AI dashboard best practices**: 
  - Implement proper data validation and sanitization
  - Use environment variables for API keys and sensitive data
  - Implement proper error handling for AI model failures
  - Cache AI model results when appropriate
- **Always test with real data scenarios**: Don't just test with mock data
- **Document API endpoints**: Use OpenAPI/Swagger for backend documentation
- **Implement proper monitoring**: Add logging and health check endpoints

### Technology Stack Recommendations
Based on AI-driven data intelligence requirements:

- **Frontend**: React + TypeScript + Chart.js/D3.js for visualizations
- **Backend**: Python + FastAPI + SQLAlchemy
- **Database**: PostgreSQL for structured data, MongoDB for document storage
- **AI/ML**: Python + pandas + scikit-learn + TensorFlow/PyTorch
- **Caching**: Redis for AI model result caching
- **Deployment**: Docker + Docker Compose
- **Testing**: Jest (frontend), pytest (backend)
- **Linting**: ESLint + Prettier (frontend), black + flake8 (backend)

### Pre-commit Validation
Before committing any changes to this repository:
1. **Check repository state**: Verify what's currently in the repo
2. **If code exists**: Run all linting and testing commands
3. **If empty repo**: Ensure your additions follow the recommended structure above
4. **Always run**: git status and git diff to review changes
5. **Validate builds work**: Test that any build commands you document actually work

### Troubleshooting Common Issues

1. **Docker Build Fails with SSL Errors**:
   - Problem: SSL certificate verification failed when pip installing packages
   - Solution: Use local development instead of Docker
   - Alternative: Try `pip install --trusted-host pypi.org --trusted-host pypi.python.org`

2. **Port Already in Use**:
   - Problem: `Error: address already in use` when starting servers
   - Solution: Use different ports (e.g., 8001 instead of 8000)
   - Check running processes: `lsof -i :8000`

3. **React App Deprecation Warnings**:
   - Warning: create-react-app is deprecated  
   - This is expected and doesn't affect functionality
   - For new projects, consider using Vite or Next.js

4. **NPM Vulnerabilities**:
   - Warning: npm audit may show vulnerabilities
   - For development, these can usually be ignored
   - For production, run `npm audit fix` but test thoroughly

5. **Git Commit Failures in create-react-app**:
   - Error: Git commit not created during React app setup
   - This is normal in some environments and doesn't affect functionality

### Future Development Notes
- This repository starts empty - initial setup is required
- Consider implementing CI/CD pipeline once code structure is established
- Plan for scalable AI model serving architecture
- Implement proper data governance and privacy controls
- Consider real-time vs batch processing requirements for data intelligence features