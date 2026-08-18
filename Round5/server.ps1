$port = 3456
$path = "S:\infinity quest\event-1"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server running at http://localhost:$port/"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $localPath = $request.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrEmpty($localPath) -or $localPath -eq '/') {
        $localPath = "index.html"
    }

    $filePath = Join-Path $path $localPath

    if (Test-Path $filePath -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()

        switch ($ext) {
            ".html" { $response.ContentType = "text/html; charset=utf-8" }
            ".css" { $response.ContentType = "text/css; charset=utf-8" }
            ".js" { $response.ContentType = "application/javascript; charset=utf-8" }
            ".json" { $response.ContentType = "application/json; charset=utf-8" }
            ".png" { $response.ContentType = "image/png" }
            ".svg" { $response.ContentType = "image/svg+xml" }
            default { $response.ContentType = "application/octet-stream" }
        }

        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    else {
        $response.StatusCode = 404
        $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
    }
    $response.Close()
}
