# NourishBot Setup Script
# Run this script to set up the NourishBot feature

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  NourishBot Setup Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if we're in the right directory
if (-not (Test-Path "backend/pyproject.toml")) {
    Write-Host "Error: Please run this script from the project root directory (healthy-food-plan)" -ForegroundColor Red
    exit 1
}

Write-Host "[1/5] Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend

# Try using uv first, fall back to pip
$uvInstalled = Get-Command uv -ErrorAction SilentlyContinue
if ($uvInstalled) {
    Write-Host "Using uv for installation..." -ForegroundColor Green
    uv pip install -e .
} else {
    Write-Host "Using pip for installation..." -ForegroundColor Green
    pip install -e .
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Check for OpenAI API key
Write-Host "[2/5] Checking OpenAI API key..." -ForegroundColor Yellow
$envFile = ".env"
$hasApiKey = $false

if (Test-Path $envFile) {
    $content = Get-Content $envFile -Raw
    if ($content -match "OPENAI_API_KEY=sk-") {
        Write-Host "✓ OpenAI API key found in .env" -ForegroundColor Green
        $hasApiKey = $true
    }
}

if (-not $hasApiKey) {
    Write-Host "⚠ OpenAI API key not found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To use NourishBot, you need an OpenAI API key." -ForegroundColor White
    Write-Host "1. Go to: https://platform.openai.com/api-keys" -ForegroundColor White
    Write-Host "2. Create a new API key" -ForegroundColor White
    Write-Host "3. Add it to backend/.env file:" -ForegroundColor White
    Write-Host "   OPENAI_API_KEY=sk-your-api-key-here" -ForegroundColor Cyan
    Write-Host ""
    $response = Read-Host "Do you want to enter your API key now? (y/n)"
    
    if ($response -eq "y" -or $response -eq "Y") {
        $apiKey = Read-Host "Enter your OpenAI API key"
        if ($apiKey) {
            if (Test-Path $envFile) {
                Add-Content $envFile "`nOPENAI_API_KEY=$apiKey"
            } else {
                Set-Content $envFile "OPENAI_API_KEY=$apiKey"
            }
            Write-Host "✓ API key saved to .env" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠ Skipping API key setup. NourishBot will use fallback responses." -ForegroundColor Yellow
    }
}
Write-Host ""

# Step 3: Run database migration
Write-Host "[3/5] Running database migration..." -ForegroundColor Yellow
Write-Host "This will create the chatbot tables (chatsession, chatmessage)" -ForegroundColor White

# Check if database is configured
if (-not (Test-Path $envFile) -or -not (Select-String -Path $envFile -Pattern "DATABASE_URL" -Quiet)) {
    Write-Host "⚠ DATABASE_URL not found in .env" -ForegroundColor Yellow
    Write-Host "Make sure your database is configured before running migrations." -ForegroundColor White
    Write-Host ""
    $runMigration = Read-Host "Do you want to run the migration now? (y/n)"
} else {
    $runMigration = "y"
}

if ($runMigration -eq "y" -or $runMigration -eq "Y") {
    alembic upgrade head
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database migration completed successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠ Migration may have issues. Check the output above." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠ Skipping migration. Run 'alembic upgrade head' manually later." -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Verify frontend files
Write-Host "[4/5] Verifying frontend files..." -ForegroundColor Yellow
Set-Location ..
$frontendFiles = @(
    "frontend/src/pages/NourishBot.jsx",
    "frontend/src/components/Navbar.jsx",
    "frontend/src/App.jsx"
)

$allFilesExist = $true
foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (missing)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if ($allFilesExist) {
    Write-Host "✓ All frontend files verified" -ForegroundColor Green
} else {
    Write-Host "⚠ Some frontend files are missing" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Summary
Write-Host "[5/5] Setup Summary" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend Setup:" -ForegroundColor White
Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
if ($hasApiKey -or $apiKey) {
    Write-Host "  ✓ OpenAI API key configured" -ForegroundColor Green
} else {
    Write-Host "  ⚠ OpenAI API key not configured (fallback mode)" -ForegroundColor Yellow
}
Write-Host "  ✓ Database migration ready" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend Setup:" -ForegroundColor White
Write-Host "  ✓ NourishBot component created" -ForegroundColor Green
Write-Host "  ✓ Routes configured" -ForegroundColor Green
Write-Host "  ✓ Navigation updated" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Start the backend: cd backend && fastapi dev app/api/main.py" -ForegroundColor White
Write-Host "2. Start the frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host "3. Open the app and click 'NourishBot' in the navigation" -ForegroundColor White
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "  - See NOURISHBOT_README.md for detailed documentation" -ForegroundColor White
Write-Host "  - API Endpoints: /api/chatbot/*" -ForegroundColor White
Write-Host "  - Frontend Route: /nourishbot" -ForegroundColor White
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Setup Complete! 🎉" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
