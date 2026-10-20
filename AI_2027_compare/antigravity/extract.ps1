[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -AssemblyName System.IO.Compression.FileSystem

$docxItem = Get-ChildItem -Path . -Filter "*.docx" | Select-Object -First 1
Write-Host "Found file: $($docxItem.FullName)"

$zip = [System.IO.Compression.ZipFile]::OpenRead($docxItem.FullName)
$entry = $zip.GetEntry("word/document.xml")
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
$xmlText = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()

[xml]$xml = $xmlText
$nsManager = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$nsManager.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")

$pNodes = $xml.SelectNodes("//w:p", $nsManager)
$sb = New-Object System.Text.StringBuilder

foreach ($p in $pNodes) {
    $tNodes = $p.SelectNodes(".//w:t", $nsManager)
    $line = ""
    foreach ($t in $tNodes) {
        $line += $t.InnerText
    }
    if ($line.Trim().Length -gt 0) {
        [void]$sb.AppendLine($line)
    }
}

$fullText = $sb.ToString()
[System.IO.File]::WriteAllText("docx_extracted.txt", $fullText, [System.Text.Encoding]::UTF8)
Write-Output ("Extracted chars: " + $fullText.Length)
