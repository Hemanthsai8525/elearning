try {
    $loginBody = @{
        email = "teacher@example.com"
        password = "teacher123"
    } | ConvertTo-Json

    $tokenResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $tokenResponse.token
    
    $lesson = Invoke-RestMethod -Uri "http://localhost:8080/api/courses/1/lessons" -Method Get -Headers @{ Authorization = "Bearer $token" }
    
    Write-Host "Current Lesson Data:"
    $lesson | ConvertTo-Json
    
} catch {
    Write-Host "Error: $_"
}
