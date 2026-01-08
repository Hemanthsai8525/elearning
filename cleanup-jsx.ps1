$files = Get-ChildItem -Path "c:\Users\heman\Downloads\elearning\frontend\src" -Include "*.jsx","*.js" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    $content = $content -replace '(?m)^\s*\{\}\s*[\r\n]+', ''
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Cleaned: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nAll empty JSX comment placeholders removed!" -ForegroundColor Cyan
