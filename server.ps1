$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "Server listening on port 8080"
while ($listener.IsListening) {
    $context = $listener.GetContext()
    $response = $context.Response
    $reqPath = $context.Request.Url.LocalPath
    Write-Host "Requested: $reqPath"
    if ($reqPath -eq "/") { $reqPath = "/index.html" }
    
    # Fix path slashes for Windows and remove leading slash so Join-Path doesn't treat it as root
    $reqPath = $reqPath.TrimStart('/', '\').Replace("/", "\")
    $file = Join-Path $PSScriptRoot $reqPath
    Write-Host "Resolved to: $file"
    
    if (Test-Path $file -PathType Leaf) {
        if ($file.EndsWith(".html")) { $response.ContentType = "text/html" }
        elseif ($file.EndsWith(".css")) { $response.ContentType = "text/css" }
        elseif ($file.EndsWith(".js")) { $response.ContentType = "application/javascript" }
        elseif ($file.EndsWith(".jpg") -or $file.EndsWith(".jpeg")) { $response.ContentType = "image/jpeg" }
        elseif ($file.EndsWith(".png")) { $response.ContentType = "image/png" }
        
        try {
            $bytes = [System.IO.File]::ReadAllBytes($file)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } catch {
            Write-Host "Connection aborted by browser"
        }
    } else {
        $response.StatusCode = 404
    }
    
    try {
        $response.Close()
    } catch {}
}
