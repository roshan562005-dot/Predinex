$brainDir = "C:\Users\A Roshan\.gemini\antigravity-ide\brain"
$dirs = Get-ChildItem -Path $brainDir -Directory | Where-Object { $_.Name -ne "tempmediaStorage" } | Sort-Object LastWriteTime -Descending

foreach ($dir in $dirs) {
    $transcript = Join-Path $dir.FullName ".system_generated\logs\transcript.jsonl"
    if (Test-Path $transcript) {
        $result = Select-String -Path $transcript -Pattern "patent" -CaseSensitive:$false -Quiet
        if ($result) {
            Write-Host "FOUND: $($dir.Name)"
        }
    }
}
Write-Host "SEARCH COMPLETE"
