$files = @{
    "c:\Users\heman\Downloads\elearning\frontend\src\services\api.js" = @(
        @{Line = 2; Old = "const API_BASE_URL = 'http:"; New = "const API_BASE_URL = 'http://localhost:8080/api';"}
    )
    "c:\Users\heman\Downloads\elearning\frontend\src\lib\courseImages.js" = @(
        @{Line = 41; Old = "if (!title) return ``https:"; New = "if (!title) return ``https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop``;"}
        @{Line = 45; Old = "return ``https:"; New = "return ``https://images.unsplash.com/photo-`${id}?w=800&auto=format&fit=crop``;"}
        @{Line = 49; Old = "return ``https:"; New = "return ``https://images.unsplash.com/photo-`${fallbacks[index]}?w=800&auto=format&fit=crop``;"}
    )
    "c:\Users\heman\Downloads\elearning\frontend\src\pages\Home.jsx" = @(
        @{Line = 301; Old = "src=`"https:"; New = "src=`"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`""}
    )
}

foreach ($filePath in $files.Keys) {
    Write-Host "Processing: $filePath" -ForegroundColor Yellow
    $content = Get-Content -Path $filePath -Raw
    
    foreach ($fix in $files[$filePath]) {
        $content = $content -replace [regex]::Escape($fix.Old), $fix.New
    }
    
    Set-Content -Path $filePath -Value $content -NoNewline
    Write-Host "  Fixed!" -ForegroundColor Green
}

Write-Host "`nAll frontend URL fixes applied!" -ForegroundColor Cyan
