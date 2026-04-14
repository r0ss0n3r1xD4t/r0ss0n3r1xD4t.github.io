---
title: (VietNamese) Pico CTF 2026 Writeup (Author)
date: 2026-3-11 08:19:33
top_img: /img/pico/pico.png
cover: /img/pico/pico.png
categories:
  - Forensics
  - Writeup CTF
toc: true
---
> Trong cuộc thi `Pico CTF 2026` năm nay, mình có đóng góp một số thử thách mảng Forensics. Mình rất vui khi Pico năm nay đã thu hút được hàng ngàn đội đến từ khắp thế giới. Đồng thời, mình cũng vô cùng tự hào khi team mình `EHC_Loi_Yeu_Kho_Noi_Pl2s` đã giành top 200 toàn thế giới, một thành tích đáng tự hào đối với một team mới như chúng mình. Dưới đây là chi tiết thử thách mà mình đã đóng góp trong cuộc thi này.
> Mình sẽ đi vào viết chi tiết các bài trong picoCTF 2026 
# Forensics
## Binary Digits
![image](https://hackmd.io/_uploads/By7sPIAtZe.png)
### Recon

File ban đầu chỉ chứa một chuỗi rất dài gồm các ký tự `0` và `1`.  
Điều này cho thấy dữ liệu có thể đang được lưu dưới dạng **bitstream** thay vì bytes thông thường.

Ý tưởng xử lý:

- Đọc toàn bộ chuỗi `0`/`1`
- Chia thành từng nhóm **8 bit**
- Chuyển mỗi nhóm thành **1 byte**
- Ghép lại để khôi phục file gốc
### Solution
Có thể viết một đoạn script **Python** để chuyển dữ liệu theo hướng:
`010101... -> 8 bit -> byte -> file JPEG`
```Python
with open("digits.bin", "r") as f:
    bits = f.read().strip()

data = bytearray()
for i in range(0, len(bits), 8):
    byte = bits[i:i+8]
    if len(byte) == 8:
        data.append(int(byte, 2))

with open("recovered.jpg", "wb") as f:
    f.write(data)
```
Cách 2 bạn có thể ném thẳng lên [Cyperchef](https://gchq.github.io/CyberChef/#recipe=From_Binary('Space',8)Render_Image('Raw'))
![image](https://hackmd.io/_uploads/rJSksURYbl.png)
Vậy flag là : picoCTF{h1dd3n_1n_th3_b1n4ry_d4e39e9e}
So ez =)))
## DISKO 4
![image](https://hackmd.io/_uploads/BJk33ICYbx.png)
### Recon
Đề bài cho một disk image và gợi ý rằng file chứa flag đã bị xóa.  
Với dạng bài này, hướng tiếp cận đầu tiên là mở image bằng công cụ forensic như **FTK Imager** để duyệt filesystem và kiểm tra các file đã bị xóa hoặc các artifact đáng ngờ còn sót lại trong image.

Hint : `How would you look for deleted files?`
### Solution
Ném file disk đó lên FTK Imager :)
![image](https://hackmd.io/_uploads/HyI0pU0tWe.png)
**Flag : picoCTF{d3l_d0n7_h1d3_w3ll_dea2cdae}**

## Forensics Git 0

![image](https://hackmd.io/_uploads/Hky2R80Fbg.png)
### Recon
Tương tự như bài trên bài này cũng cho 1 file disk và bắt chúng ta điều tra 
Hint : How can you extract the directory from the disk image?
### Solution
Đề bài là **Forensics git** nên khả năng là bài này yêu cầu chúng ta phân tích các repo  github
![image](https://hackmd.io/_uploads/ry_kevRYbx.png)
Sau khi vào Partrion 3 và vào repo đó ta thấy được 1 phần của flag 
```
The picoCTF flag format is 'picoCTF{}' where there is 

some leetspeak phrase in between the curly braces
```
Flag được giấu trong msg commit 
![image](https://hackmd.io/_uploads/S1_TlwAt-x.png)
**Flag : picoCTF{g17_1n_7h3_d15k_041217d8}**

## Forensics Git 1
![image](https://hackmd.io/_uploads/ry2ybvCtWg.png)
### Recon
1 chuỗi bài giống nhau :)))
Hint : How can you checkout the files of a previous commit?

Có vẻ bài này yêu cầu chúng ta xem lại các commit cũ 
### Solution
Đúng như ta dự đoán , thấy 1 logs commit bao gồm add flag và remove flag 
![image](https://hackmd.io/_uploads/HJIsZw0tWg.png)
Bây giờ thử checkout lại commit đó xem có gì
Trước khi thử cần export folder từ FTK Imager ra
Sau đó git show hoặc checkout lại commit add flag bằng cách
 `git show 177789af0b300e043ea8f54ea57d6cee352291ae`
![image](https://hackmd.io/_uploads/r1V2GP0tZg.png)
Và ra flag luôn : **picoCTF{g17_r3m3mb3r5_d4ddf904}**
## Forensics Git 2
![image](https://hackmd.io/_uploads/HkNB7DCKWl.png)
### Recon
Vẫn như bài git 1
`The agents interrupted the perpetrator's disk deletion routine. Can you recover this git repo?`
Có vẻ chúng ta cần rcv lại 1 file đã bị xóa

### Solution
Sau khi add disk vào FTK Imager ta tìm được 1 logs commit rất khả nghi
![image](https://hackmd.io/_uploads/By6yEyg5Wl.png)


Và 1 đoạn hội thoại , theo linh cảm của mình có vẻ thiếu mất 1 file 3.txt :)) . Nội dung 3 đoạn hội thoại ở bên dưới
![image](https://hackmd.io/_uploads/r1O841lcWx.png)

```
Jade: Finally beat the Elden Ring DLC tonight.
Marco: Nice! That Messmer fight was brutal but so good.
Jade: Totally worth the grind.

Eva: Are you caught up on The Last of Us?
Nina: Episode 5 wrecked me; the clickers were intense.
Eva: Can't wait for the next season already.

Pip: My cat thinks the keyboard is a napping pad now.
Lou: Maybe it's writing a novel in secret.
Pip: I'd read anything titled "Meowmoirs".

```
Thử export ra và git checkout hoặc git show lại commit mình thấy rất khả nghi. Add secret xong remove luôn 
```
5827632e046a80a1e0d7b4fc5c7800dd539baeaf e80b38b3322a5ba32ac07076ef5eeb4a59449875 ctf-player <ctf-player@example.com> 1763549240 +0000	commit: Add secret hideout chat log
e80b38b3322a5ba32ac07076ef5eeb4a59449875 2151ef0ccc15aed1ab88e1afdc7484aaeff211c4 ctf-player <ctf-player@example.com> 1763549240 +0000	commit: Remove secret hideout log
```
![image](https://hackmd.io/_uploads/SkUWI1gcZe.png)
well đúng như dự đoán 
**flag : picoCTF{g17_r35cu3_16ac6bf3}**
## Rogue Tower
Skip mấy bài disk image xàm ở trên ta đến 1 bài network khá hay :D 
![image](https://hackmd.io/_uploads/rJ2I8Jl5-e.png)

### Recon
Đề bài yêu cầu tìm 1 rogue tower sau đó xác định thiết bị nào đã kết nối vào tower đó
Tìm dữ liệu bị exfiltrate sau đó rcv flag

### Solution
Follow theo UDP stream thấy 1 broadcast rất khả nghi
```
CARRIER: Verizon PLMN=310410 CELLID=25841
CARRIER: AT&T PLMN=310410 CELLID=25842
UNAUTHORIZED-TEST-NETWORK PLMN=00101 CELLID=91043
```
2 dòng đầu thì bình thường nhưng dòng thứ 3 
`UNAUTHORIZED-TEST-NETWORK`
Có thể suy đoán đây là rogue tower
`CELLID = 91043`
Lọc theo các http request mình thấy được 1 request rất quan trọng
`GET /api/register HTTP/1.1
Host: network.carrier.com
User-Agent: MobileDevice/1.0 (IMSI:310410187936156; CELL:91043)`
![image](https://hackmd.io/_uploads/r1m2Oxx9bl.png)
Và ip source của req đó là : **10.100.12.10**

Victim device  **10.100.12.10**
Victim IMSI: **310410187936156**

> **IMSI là gì?**

IMSI là viết tắt của **International Mobile Subscriber Identity.**
Hiểu đơn giản thì đây là mã định danh thuê bao di động của một thiết bị dùng SIM.
IMSI thường gồm 3 phần chính:

MCC: mã quốc gia di động

MNC: mã nhà mạng

MSIN: phần định danh thuê bao riêng

>Thử filter các req từ ip đó mình thấy được dữ liệu exfil bị chia nhỏ qua nhiều POST requests.

![image](https://hackmd.io/_uploads/Skt0Fxlqbe.png)
Ghép các nội dung trong phần body lại thu được 1 chuỗi có vẻ như là bsse64
`SF5aXHVlc01KB15GBW5WBVRbZkcGRgZEZwBYAwBXUQFbSg==`
Nhưng decode ra không thu được gì
Đọc hint thì có 1 cái là 
`The encryption key is derived from the victim device's IMSI`
Vậy nên mình thử key XOR IMSI: **310410187936156**
## Timeline 0
## Timeline 1



# Reverse engineering ( Alight 36 + 1 , aduangduc)
## Gatekeeper
```python
int __fastcall main(int argc, const char **argv, const char **envp)
{
  int v4; // [rsp+8h] [rbp-38h]
  int v5; // [rsp+Ch] [rbp-34h]
  char input[40]; // [rsp+10h] [rbp-30h] BYREF
  unsigned __int64 v7; // [rsp+38h] [rbp-8h]

  v7 = __readfsqword(0x28u);
  printf("Enter a numeric code (must be > 999 ): ");
  fflush(stdout);
  __isoc99_scanf("%31s", input); //nhập input
  v5 = strlen(input);
  if ( (unsigned int)is_valid_decimal(input) ) //check số thập phân
  {
    v4 = atoi(input);
  }
  else
  {
    if ( !(unsigned int)is_valid_hex(input) ) //check hex
    {
      puts("Invalid input.");
      return 1;
    }
    v4 = strtol(input, 0, 16);
  }
  if ( v4 > 999 )
  {
    if ( v4 <= 9999 )
    {
      if ( v5 == 3 ) //check length
        reveal_flag();
      else
        puts("Access Denied.");
    }
    else
    {
      puts("Too high.");
    }
  }
  else
  {
    puts("Too small.");
  }
  return 0;
}
```
bài nó bắt nhập vào 1 số lớn hơn 999 nhỏ hơn 10000 nhưng chỉ được phép có 3 chữ số
--> nhập hex vì nó cho phép
nhập fff
ouput: `}4cdftc_oc_ip6f47ftc_oc_ipa_99ftc_oc_ip9_TGftc_oc_ip_xehftc_oc_ip_tigftc_oc_ipid_3ftc_oc_ip{FTCftc_oc_ipocipftc_oc_ip`
check lại hàm reveal_flag()
``` python
for ( i = n - 1; i >= 0; --i )
      {
        putchar(ptr[i]);
        if ( (i & 3) == 0 )
          printf("ftc_oc_ip");
      }
```
nó in ngược và xen kẽ chúng chèn vào 
``` a
s="}4cdftc_oc_ip6f47ftc_oc_ipa_99ftc_oc_ip9_TGftc_oc_ip_xehftc_oc_ip_tigftc_oc_ipid_3ftc_oc_ip{FTCftc_oc_ipocipftc_oc_ip"
print(s.replace("ftc_oc_ip","")[::-1])
```
picoCTF{3_digit_hex_GT_999_a74f6dc4}
## Hidden Cipher
hàm khai báo các key để xor
``` python
char *get_secret()
{
  s_0 = 83;
  byte_4012 = 51;
  byte_4013 = 67;
  byte_4014 = 114;
  byte_4015 = 51;
  byte_4016 = 116;
  byte_4017 = 0;
  return &s_0;
}
```
chỗ xor
``` a
for ( i = 0; n > i; ++i )
        printf("%02x", *((_BYTE *)ptr + i) ^ *(_BYTE *)(i % 6 + secret));
```
output là 1 chuỗi hex mỗi cái 2 ký tự
`235a201d702015483b1d412b265d3313501f0c072d135f0d2002302d06476350224507462e`
h chỉ cần xor ngược lại là xong

``` python
key=[83,51,67,114,51,116,0]
cipher="235a201d702015483b1d412b265d3313501f0c072d135f0d2002302d06476350224507462e"
for i in range(0,len(cipher),2):
    print(chr(int(cipher[i:i+2],16)^key[int(i/2)%6]),end="")   
```
picoCTF{xor_unpack_4nalys1s_530ca742}
## Hidden Cipher2
chạy chương trình thử
``` python
What is 8 - 2? 6
Encoded flag values:
672, 630, 594, 666, 402, 504, 420, 738, 654, 312, 696, 624, 570, 588, 306, 624, 294, 660, 600, 570, 594, 294, 672, 624, 306, 684, 570, 312, 582, 306, 588, 300, 594, 594, 612, 750
```
``` python
int __fastcall main(int argc, const char **argv, const char **envp)
{
  unsigned int v3; // eax
  char v5; // [rsp+Fh] [rbp-21h] BYREF
  int v6; // [rsp+10h] [rbp-20h] BYREF
  int v7; // [rsp+14h] [rbp-1Ch] BYREF
  int v8; // [rsp+18h] [rbp-18h] BYREF
  int ans; // [rsp+1Ch] [rbp-14h]
  void *ptr; // [rsp+20h] [rbp-10h]
  unsigned __int64 v11; // [rsp+28h] [rbp-8h]

  v11 = __readfsqword(0x28u);
  v3 = time(0);
  srand(v3);
  ans = generate_math_question(&v5, &v6, &v7);
  printf("What is %d %c %d? ", v6, (unsigned int)v5, v7);
  fflush(stdout);
  if ( (unsigned int)__isoc23_scanf("%d", &v8) == 1 )
  {
    if ( ans == v8 )
    {
      ptr = (void *)read_flag_file("flag.txt");
      if ( ptr )
      {
        encode_flag((__int64)ptr, ans);
        free(ptr);
        return 0;
      }
      else
      {
        return 1;
      }
    }
    else
    {
      puts("Wrong answer! No flag for you.");
      return 1;
    }
  }
  else
  {
    puts("Invalid input. Exiting.");
    return 1;
  }
}
```
nó sẽ tạo ra 1 câu hỏi và dùng đáp án đấy để mã hóa
```python
int __fastcall encode_flag(__int64 a1, int a2)
{
  int i; // [rsp+1Ch] [rbp-4h]

  puts("Encoded flag values:");
  for ( i = 0; *(_BYTE *)(i + a1); ++i )
  {
    printf("%d", a2 * *(char *)(i + a1));
    if ( *(_BYTE *)(i + 1LL + a1) )
      printf(", ");
  }
  return putchar(10);
}
```
nó sẽ lấy từng ký tự của flag rồi nhân với đáp án rồi in ra màn hình
``` python
lst=[672, 630, 594, 666, 402, 504, 420, 738, 654, 312, 696, 624, 570, 588, 306, 624, 294, 660, 600, 570, 594, 294, 672, 624, 306, 684, 570, 312, 582, 306, 588, 300, 594, 594, 612, 750]
for i in lst:
    print(chr(int(i/6)),end="")
```
flag:`picoCTF{m4th_b3h1nd_c1ph3r_4a3b2ccf}`

## Bypass me
chal này bắt mình phải dùng LLDB
dùng LLDB với file bypassme.bin
disassemble main thì ta thấy có 1 func là decode_password, đặt breakpoint tại đấy và chạy thì ta thấy được output
```python
Process 96 stopped
* thread #1, name = 'bypassme.bin', stop reason = instruction step into
    frame #0: 0x000063ae81c793a0 bypassme.bin`decode_password(out="SuperSecure") at bypassme.c:18:5
```
pass: SuperSecure 
```  py
ctf-player@pico-chall$ ./bypassme.bin



          ███████╗███████╗ ██████╗██╗   ██╗██████╗ ███████╗    ██████╗  ██████╗ ██████╗ ████████╗ █████╗ ██╗
          ██╔════╝██╔════╝██╔════╝██║   ██║██╔══██╗██╔════╝    ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██║
          ███████╗█████╗  ██║     ██║   ██║██████╔╝█████╗      ██████╔╝██║   ██║██████╔╝   ██║   ███████║██║
          ╚════██║██╔══╝  ██║     ██║   ██║██╔══██╗██╔══╝      ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══██║██║
          ███████║███████╗╚██████╗╚██████╔╝██║  ██║███████╗    ██║     ╚██████╔╝██║  ██║   ██║   ██║  ██║███████╗
          ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝    ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝

 Initializing secure modules...
 Running memory diagnostics...
 All systems online...

 Access to this terminal is restricted.
 Please authenticate below.
----------------------------------------


[3 tries left] Enter password: SuperSecure

Raw Input:      [SuperSecure]
Sanitized Input:[SuperSecure]
Hint: Input must match something special...

Authenticating...
🎉 Flag: picoCTF{d3bugg3r_p0w3r_is_4w3s0m3_52875073}
```
## The Add/On Trap
sau khi tải file về ta có được một file `.xpi`
check nó là dạng file j
```
56102ec0438646c68605-1.0.xpi: Zip archive data, at least v2.0 to extract, compression method=deflate
```
nó là zip nên ta đổi tên rồi unzip nó
sau khi unzip
``` py
.
├── META-INF
│   ├── cose.manifest
│   ├── cose.sig
│   ├── manifest.mf
│   ├── mozilla.rsa
│   └── mozilla.sf
├── a.zip
├── assets
│   ├── script.js
│   └── styles.css
├── background
│   └── main.js
├── icons
│   ├── icon-32.png
│   └── icon-64.png
├── manifest.json
└── popup.html

4 directories, 13 files
```
xem cái file main.js

``` a
function logOnCompleted(details) {
    console.log(`Information to exfiltrate: ${details.url}`);
    const key="cGljb0NURnt5b3UncmUgb24gdGhlIHJpZ2h0IHRyYX0="
    const webhookUrl='gAAAAABmfRjwFKUB-X3GBBqaN1tZYcPg5oLJVJ5XQHFogEgcRSxSis1e4qwicAKohmjqaD-QG8DIN5ie3uijCVAe3xiYmoEHlxATWUP3DC97R00Cgkw4f3HZKsP5xHewOqVPH8ap9FbE'
```
const key sau khi decode thì ra `picoCTF{you're on the right tra}`
nó cho 1 cái cipher text nữa bắt mình giải mã (hint là dùng fernet) --> nhét vào cyberchef
![image](https://hackmd.io/_uploads/ry7uYfL2Zx.png)

flag : `picoCTF{Us3_4dd/0ns_v3ry_c4r3fully1}`

### Silent stream
Đầu tiên xem nó làm gì với file flag.txt trước khi gửi
```python
import socket

def encode_byte(b, key):

    return (b + key) % 256

def simulate_flag_transfer(filename, key=42):
    print(f"[!] flag transfer for '{filename}' using encoding key = {key}")

    with open(filename, "rb") as f: 
        data = f.read()

    print(f"[+] Encoding and sending {len(data)} bytes...")

    for b in data:
        encoded = encode_byte(b, key)
        pass

    print("Transfer complete", encoded)

if __name__ == "__main__":
    simulate_flag_transfer("flag.txt") 


```
Ta thấy nó read byte xong với mỗi byte + key=42 để tạo thành 1 byte mới
dùng wireshark mở file `packets.pcap`
lấy data dưới dạng raw lưu thành 1 file `.bin`
``` py
f=open("data.bin","rb")
s=f.read()
h=bytearray()
for i in s:
    h.append((i-42)%256)
x=open("a","wb")
x.write(h)

```
check file vừa có đc
``` a
a: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, baseline, precision 8, 800x500, components 3
```
đổi tên và mở dưới dạng ảnh
![flag](https://hackmd.io/_uploads/S1K8PX8hWe.jpg)
## Autorev1
Khi nc thì nó sẽ cho ra output là 1 chuỗi hex 2 chữ số và ta nhận thấy `7f454c4` magic number của file ELF
ta copy nó và chuyển nó thành file ELF rồi load vào IDA
``` bash
xxd -r -p a elf
```
ta quan sát được file elf sau khi load vào IDA:
![image](https://hackmd.io/_uploads/HJqN3782Wl.png)
phía trước của cái pass là `c745fc`
-> quy luật : tìm chỗ có `c745fc` rồi lấy 4 byte sau của nó quay ngược lại rồi nạp vào input
Đề bài bắt làm 20 lần như vậy
```python
from pwn import *
p = remote("mysterious-sea.picoctf.net", 57196)
for i in range(20):
    s=p.recvuntil(b"What's the secret?")
    s=s.decode()
    x=s.find("c745fc")
    y=s[x+6:x+14]
    b=bytes.fromhex(y)
    inp=int.from_bytes(b, "little")
    print(inp)
    p.sendline(str(inp).encode())
p.interactive()
```
flag: `picoCTF{4u7o_r3v_g0_brrr_78c345aa}`
## Secure password database
load `system.out` vào IDA
ta cần quan tâm chỗ nhập hash để so sánh
``` python
__int64 __fastcall make_secret(__int64 a1)
{
  __int64 i; // [rsp+10h] [rbp-8h]

  for ( i = 0; obf_bytes[i]; ++i )
    *(_BYTE *)(a1 + i) = obf_bytes[i] ^ 0xAA;
  *(_BYTE *)(a1 + 12) = 0;
  return hash(a1);
}
```
``` c
__int64 __fastcall hash(_BYTE *a1)
{
  _BYTE *v1; // rax
  __int64 i; // [rsp+10h] [rbp-8h]

  for ( i = 5381; ; i = 33 * i + (unsigned __int8)*v1 )
  {
    v1 = a1++;
    if ( !*v1 )
      break;
  }
  return i;
}
```
đây là 2 func tạo hash dựa trên 1 list là `obf_bytes` không liên quan đến những input phía trước

```python
data= [
    0xC3, 0xFF, 0xC8, 0xC2, 0x92, 0x9B, 0x8B, 0xC0, 
    0x80, 0xC2, 0xC4, 0x8B, 
]
for i in range(len(data)):
    data[i]^=0xAA
index=5381
for i in data:
    print(chr(i),end="")
for i in range(len(data)):
    index=(33 * index + data[i])&0xFFFFFFFFFFFFFFFF
print(index)
```
hash : `15237662580160011234`
nhập input bình thường
flag: `picoCTF{d0nt_trust_us3rs}`

# Web Exploitation ( thecatonthemoon)
## Old Sessions

![image](https://hackmd.io/_uploads/HJCUiBj3-e.png)

First, I tried register with the name 'admin' but it already exist - it mean that this maybe the user we wanna take the session, then I pick an random name then login to the account.
After got to the dashboard I can see many comments, but the one is this comment which is a hint for us to go to the suspicious endpoint.

![image](https://hackmd.io/_uploads/Sy0Piri3Zg.png)

Got to `/session` , I found the session for the 'admin' user
![image](https://hackmd.io/_uploads/S1tdsBjhbg.png)

Just change cookie 'session'  value to that value, we got the admin session and found the flag

![image](https://hackmd.io/_uploads/rkGKjHi2-g.png)

## No FA
**200 points**
![image](https://hackmd.io/_uploads/SkhhN9j2Wg.png)
Trong challenge này ta có một file `.db` , dùng lệnh file ta thấy được đây là một file của **SQLite 3**, mở bằng https://sqliteviewer.app/ ta thấy file này chứa thông tin đăng nhập hệ thống gồm username, email, hashed password và two_fa lưu trạng thái có bật two factor authentication không.
![image](https://hackmd.io/_uploads/rylAS5i3Zl.png)
Trong bảng này ta thấy có user admin là user duy nhất có mở two FA. 
Crack password hash của admin với [crackstation](https://crackstation.net/) ta biết được hash này là sha256 với kết quả decrypted là `apple@123`.![image](https://hackmd.io/_uploads/SywVP9o2-g.png)
Đăng nhập vào với username và password, ứng dụng yêu cầu nhập mã OTP gồm 4 chữ số và mã này sẽ hợp lệ trong vòng 2 phút. Đến đây, ban đầu mình nghĩ đến brute force, ta có 10000 mật khẩu có thể có chia cho 180 giây thì sẽ cần khoảng 56 requests/giây, nhưng mình có thử thì có vẻ không thực hiện được. Nhưng nhờ một người bạn gợi ý mình phát hiện là mã OTP được lưu ngay ở cookie (flask session cookie) của người dùng. Vào cyberchef.io chọn decode base64 và Zlib inflate hoặc các trang decode flask session cookie [www.kirsle.net](https://www.kirsle.net/wizards/flask-session.cgi) ta được mã OTP trong cookie
![image](https://hackmd.io/_uploads/rkEE09i3-e.png)
![image](https://hackmd.io/_uploads/rkyeacjnbl.png)
Dùng mã OTP đó đăng nhập và lấy được flag
![image](https://hackmd.io/_uploads/Syoa2qo3be.png)

## Hashgate 
***100 points***

![image](https://hackmd.io/_uploads/SJ0tjSinZx.png)

Đọc qua source html, ta thấy được thông tin đăng nhập vào website. 
Khi đăng nhập ta thấy user guest có id là 3000, trên phần url có dạng

`profile/user/e93028bdc1aacdfb3687181f2031765d `

khi phân tích và crack phần hash `e93028bdc1aacdfb3687181f2031765d` của user hiện tại ta được số 3000 hash bằng md5. Vậy ta IDOR bằng cách hash md5 của các id rồi truy cập. Sau khi thử vài id hay gặp như 1, 0, .. không được, mình bruteforce quanh khoảng 3000 và tìm được id của admin
## Credential Stuffing
***100 points***

![image](https://hackmd.io/_uploads/SkyioBo3Wg.png)

Ở bài này ta có một danh sách với tên đăng nhập và mật khẩu theo từng cặp. Dựa trên ý tưởng là người dùng sẽ sử dụng chung tên đăng nhập và mật khẩu trên nhiều ứng dụng khác nhau, ta sẽ sử thử gửi theo từng cặp tên đăng nhập và mật khẩu để lấy được tài khoản.

## North-South
***100 points***
![image](https://hackmd.io/_uploads/ByYjoronWg.png)

Bài này yêu cầu dải IP phải nằm trong dải IP đến từ Iceland. Ta dùng một proxy Iceland để truy cập vào và lấy được flag.
## Secret Box
***200 points***
![image](https://hackmd.io/_uploads/HJP2iBs3We.png)
Trong source code, ta thấy tại chức năng tạo secret mới (`/secrets/create`), dữ liệu `content` được nối trực tiếp vào câu lệnh SQL thay vì dùng tham số hóa (parameterized query). Điều này dẫn đến **SQL Injection**.
Mục tiêu là lấy secret của admin có id là `e2a66f7d-2ce6-4861-b4aa-be8e069601cb`.

Khi mình thử chèn thêm một cột mới vào lệnh `INSERT` thì bị lỗi lệch số lượng cột (vì bảng chỉ có 2 cột là `owner_id` và `content`). Để xử lý, mình sử dụng toán tử nối chuỗi `||` trong PostgreSQL để ép nội dung của admin vào nội dung secret của chính mình.

 `' || (SELECT content FROM secrets WHERE owner_id = 'e2a66f7d-2ce6-4861-b4aa-be8e069601cb' LIMIT 1)) --`

Khi gửi payload, câu lệnh SQL sẽ thực hiện việc lấy flag của admin nối vào một chuỗi rỗng rồi lưu vào user hiện tại. Quay lại trang chủ, secret của admin (Flag) sẽ hiện chứa ngay trong danh sách secret của user hiện tại.
## Fool the Lockout
***200 points***
![image](https://hackmd.io/_uploads/r1XpsrihZg.png)
Với bài này, khi mở lên ta sẽ thấy một giao diện đăng nhập đơn giản. Theo mô tả của đề bài, hệ thống đã được thiết lập một cơ chế chặn IP (Rate Limit) nếu chúng ta thử đăng nhập sai quá nhiều lần. Mục tiêu của ta là phải thực hiện Credential Stuffing từ danh sách cho sẵn để tìm ra tài khoản đúng và lấy flag.

Nếu ta thử dùng Burp Suite để brute-force theo cách thông thường, chỉ sau vài request, hệ thống sẽ trả về thông báo lỗi hoặc chặn đứng kết nối do IP của ta đã vượt ngưỡng cho phép.

Tuy nhiên, khi đọc kỹ source code được cung cấp, mình nhận thấy hệ thống xác định IP của người dùng thông qua HTTP Header `X-Forwarded-For`. Trong thực tế, header này rất dễ bị thao túng nếu server không được cấu hình chặn hoặc ghi đè từ phía Proxy.

Để bypass cơ chế này, mình sẽ sử dụng một script Python để vừa thực hiện đăng nhập, vừa giả mạo IP liên tục trong mỗi request..
## SQL Map 1
***300 poins***

![image](https://hackmd.io/_uploads/H1XRorinWe.png)

Với bài này, khi mở lên ta sẽ thấy có hai chức năng à đăng nhập và đăng ký tài khoản. Nếu ta thử đăng ký tài khoản với username là admin thì sẽ hiện thông báo lỗi tài khoản đã tồn tại và một cảnh báo warning cho ta biết hệ thống đang sử dụng `SQLIte3`.
Sau đó mình thử tạo một tài khoản tên `cat` và đăng nhập. khi đăng nhập ứng dụng sẽ có một thanh tìm kiếm để tìm flag
![image](https://hackmd.io/_uploads/S15RiHjhWe.png)

Nếu thử tìm ta sẽ thấy có nhiều flag nhưng mà đó đều là fake flag. Vậy flag thật có lẽ không ở bảng này.
Khi thử payload `' OR 1=1 -- ` ứng dụng trả về toàn bộ dữ liệu trong bảng, vậy ta xác nhận có **SQL Injection**.

![image](https://hackmd.io/_uploads/BJE5nHohZe.png)


Ta thử dùng UNION để query và sau khi có kết quả, ta xác nhận sẽ tiến hành **SQL INJECTION UNION BASED** để khai thác.
Thứ nhất, ta liệt kê các bảng trong database bằng cách query từ `sqlite_schema` 
`l' UNION  SELECT name, sql FROM sqlite_schema -- `

Ta thấy có bảng flag và user trong đó bảng user có cấu trúc như sau:
```
users: CREATE TABLE users ( id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL )
```

Sau khi đọc bảng ta thấy có những user sau
```
- **admin**: 5a9a79d9fa477ed163b89088681672c9
- **cat**: 202cb962ac59075b964b07152d234b70
- **ctf-player**: 7a67ab5872843b22b5e14511867c4e43
- **ghost**: 8d2379c40704bed972e55680be2355e2
- **malicious**: a669d60c31ad3d05b9e453c8576c7aab
- **noaccess**: 83806b490e28a7f8e6662646cbdbff1a
- **suspicious**: eb1f3ba6901c65d9b2e09a38f560758b
```
Bảng này có username và password ở dạng hash. Trong đó `cat` là tên username tài khoản của ta, mình thử crack mật khẩu admin bằng [crack station](https://crackstation.net/) nhưng không được, crack tài khoản ctf-player thì ra được mật khẩu là `dyesebel`. Sau khi đăng nhập vào `ctf-player` ta lấy được flag.
![image](https://hackmd.io/_uploads/Hk6snHo3-l.png)

# General Skills ( lykn group)
## Undo
![image](https://hackmd.io/_uploads/HkwxB8s2-l.png)
Bài này yêu cầu sử dụng các lệnh trong linux để recover flag đã encoded qua nhiều bước.
Đầu tiên ta cần decode base64 - sử dụng   `base64 -d`
Tiếp theo, ta cần đảo ngược chuỗi - sử dụng lệnh `rev`
Cuối cùng, ta cần thay đổi một số kí tự này thành kí tự khác và decode [ROT13](https://vi.wikipedia.org/wiki/ROT13), sử dụng lệnh `tr`.
Đây là toàn bộ các bước mình làm để lấy flag
```(bash)
nc foggy-cliff.picoctf.net 61262
===Welcome to the Text Transformations Challenge!===

Your goal: step by step, recover the original flag.
At each step, you'll see the transformed flag and a hint.
Enter the correct Linux command to reverse the last transformation.

--- Step 1 ---
Current flag: KTY4ODhyMjFuLWZhMDFnQHplMHNmYTRlRy1nazNnLXRhMWZlcmlyRShTR1BicHZj
Hint: Base64 encoded the string.
Enter the Linux command to reverse it: base64 -d
Correct!

--- Step 2 ---
Current flag: )6888r21n-fa01g@ze0sfa4eG-gk3g-ta1ferirE(SGPbpvc
Hint: Reversed the text.
Enter the Linux command to reverse it: rev
Correct!

--- Step 3 ---
Current flag: cvpbPGS(Eriref1at-g3kg-Ge4afs0ez@g10af-n12r8886)
Hint: Replaced underscores with dashes.
Enter the Linux command to reverse it: tr '-' '_'
Correct!

--- Step 4 ---
Current flag: cvpbPGS(Eriref1at_g3kg_Ge4afs0ez@g10af_n12r8886)
Hint: Replaced curly braces with parentheses.
Enter the Linux command to reverse it: tr [()] [{}]
Correct!

--- Step 5 ---
Current flag: cvpbPGS{Eriref1at_g3kg_Ge4afs0ez@g10af_n12r8886}
Hint: Applied ROT13 to letters.
Enter the Linux command to reverse it: tr [a-mn-zA-MN-Z] [n-za-mN-ZA-M]
Correct!

Congratulations! You've recovered the original flag:
>>> picoCTF{Revers1ng_t3xt_Tr4nsf0rm@t10ns_a12e8886}
```

## Piece by Piece
![image](https://hackmd.io/_uploads/SJobdIsnWg.png)
Đầu tiên, ta ssh vào challenges và thấy có các file sau
```(bash)
ctf-player@pico-chall$ ls
instructions.txt  part_aa  part_ab  part_ac  part_ad  part_ae
```
Đọc file instructions.txt ta biết được là flag đã bị chia thành nhiều phần và nén lại thành file zip với mật khẩu là `supersecret`.
```
ctf-player@pico-chall$ cat instructions.txt
Hint:

- The flag is split into multiple parts as a zipped file.
- Use Linux commands to combine the parts into one file.
- The zip file is password protected. Use this "supersecret" password to extract the zip file.
- After unzipping, check the extracted text file for the flag.
```
Ta sẽ đưa tất cả các part đã bị zip thành một file zip và giải nén chúng
```(bash)
ctf-player@pico-chall$ cat part* > flag
ctf-player@pico-chall$ file flag
flag: Zip archive data, at least v1.0 to extract
ctf-player@pico-chall$ mv flag flag.zip
ctf-player@pico-chall$ unzip flag.zip
Archive:  flag.zip
[flag.zip] flag.txt password:
 extracting: flag.txt
ctf-player@pico-chall$ cat flag.txt
picoCTF{z1p_and_spl1t_f1l3s_4r3_fun_28d309dc}
```

## SUDO MAKE ME A SANDWICH
![image](https://hackmd.io/_uploads/HyxlnUi3-e.png)
Với bài này sau khi ssh vào thì ta thấy có một file flag.txt. Mình thử mở lên nhưng bị permission denied, mình thử dùng `ls -l` để check quyền thì thấy chỉ có user root hoặc trong group root mới có thể đọc được.
```(bash)
ctf-player@challenge:~$ ls -l
total 4
-r--r----- 1 root root 31 Mar  9 21:32 flag.txt
```
Mình thử dùng `sudo -l` để xem có thể dùng sudo để chạy quyền nào thì thấy có thể chạy một binary emacs.
```(bash)
sudo -l
Matching Defaults entries for ctf-player on challenge:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User ctf-player may run the following commands on challenge:
    (ALL) NOPASSWD: /bin/emacs
```
sau khi search thì mình biết được **emacs** (Editor MACroS) là một trình soạn thảo văn bản tự do, đa chức năng.
Vậy ta sẽ lợi dụng công cụ này để đọc file flag.txt với quyền root bằng lệnh  `sudo emacs flag.txt`
![image](https://hackmd.io/_uploads/rk6_RIjhWx.png)
** Để thoát emacs thì có thể nhấn Crtl-X Crtl-C nhé=))

## Password Profiler
![image](https://hackmd.io/_uploads/ryWQyvo3bg.png)

Baì này cung cấp cho ta thông tin về user, một mật khẩu đã được mã hoá và một tool python có chúc năng password ở hash từ một wordlist có sẵn. Ở trong source code của file python ta thấy file wordlist passwords.txt được tạo bằng `cupp`. `cupp` là một công cụ giúp tạo wordlist từ các thông tin cho sẵn. Mình dùng `cupp -i` để mở chế độ interactive để cupp sẽ prompt từng thông tin, mình nhập thông tin từ file userinfo.txt, phần thông tin nào không có thì chỉ nhấn enter để bỏ qua và sau đó chọn N cho các lựa chọn khác. sau đó dùng check_password.py để kiểm tra password từ file hash và nhận flag
```
python3 check_password.py
Password found: picoCTF{Aj_15901990}
```

## MultiCode
![image](https://hackmd.io/_uploads/Bk0W7vo2We.png)
Ta có một file chứa flag đã bị encoded. Mở vào [cyberberchef.io](https://cyberchef.io) và dùng chức năng magic ta thấy nó giải mã ra được được một vài phần và thấy được cấu trúc của flag.
![image](https://hackmd.io/_uploads/HJ-1Nvj3Wx.png)
Nhưng có lẽ flag ở đây dã bị encoded url và shift vị trí các kí tự (Ceaser ciper). Sau khi decode url và rot13 ta được flag hoàn chỉnh
![image](https://hackmd.io/_uploads/ryiT4wi3Zl.png)



## ABSOLUTE NANO
![image](https://hackmd.io/_uploads/S1servon-l.png)
Bài này sau khi ssh vào thì ta lại thấy một file flag.txt nhưng chỉ root mới có quyền đọc. Thử `sudo -l` thì ta thấy có thể dùng `nano` để chỉnh sửa file `/etc/suoders`. Vậy ta sẽ dùng nano để chỉnh file /etc/suoders cho phép user hiện tại có thể sử dụng tất cả mọi lệnh với quyền sudo.
```(bash)
ctf-player ALL=(ALL) NOPASSWD:ALL
```
Sau đó dùng sudo đẻ đọc file flag.txt
```(bash)
ctf-player@challenge:~$ sudo cat flag.txt
picoCTF{n4n0_411_7h3_w4y_7a258d4b}
```

## Failure Failure
![image](https://hackmd.io/_uploads/ryOg_Djhbe.png)

Trong bài này có một load balencer đứng trước và 2 server đứng sau tạm gọi là A và B. Bình thường, server A không chứa sẽ được serve lên trước còn khi quá tải load balencer dẽ điều hướng qua server B chứa flag. Vậy ý tưởng ở đây là ta sẽ làm quá tải lưu lượng truy cập vào server A để được chuyển sang server B và lấy dược flag. Mình sẽ viết một script python liên tục truy cập vào làm quá tải và sau đó truy cập vào website để lấy flag.
```(python)
import requests
from concurrent.futures import ThreadPoolExecutor

url = "http://mysterious-sea.picoctf.net:62524"
def force_failover(_):
    try:
        resp = requests.get(url, timeout=1)
    except:
        pass
        
with ThreadPoolExecutor(max_workers=200) as executor:
    executor.map(force_failover, range(5000))
```
Và đó một thời gian khi server đã quá tải, truy cập vào trang web và lấy flag.
![image](https://hackmd.io/_uploads/ryAW5DjnZx.png)

# Crypto ( chat lgpt + gemini pr0 + claude opus 36)
## Secure Dot Product 
![image](https://hackmd.io/_uploads/rydYlos3bg.png)
Đề bài cho một server tính Dot Product (tích vô hướng) giữa vector của người dùng và AES Key (32 bytes). Dữ liệu truyền lên được kiểm tra tính toàn vẹn bằng SHA-512(salt + vector_string), với salt cực dài (256 bytes). Mục tiêu: Trích xuất AES Key để giải mã Flag. 
Lỗ hổng nằm ở hàm hash_vector sử dụng cơ chế cộng chuỗi trực tiếp salt + data. Ở đây ta thấy có thể sử dụng kỹ thuật **Hash Length Extension Attack**.Đầu tiên, Kết nối liên tục để lấy được một "Trusted Vector" có độ dài 1 (vị trí $t_0$). Lúc này, tích vô hướng trả về chính là $t_0 \times k_0$. Dễ dàng suy ra $k_0$.
Vậy ta sẽ sử dụng hashpumpy để "bơm" thêm dữ liệu vào hash đã có mà không cần biết salt. Bằng cách chèn thêm các giá trị 1 vào các vị trí tiếp theo (từ index 1 đến 31) thông qua padding hợp lệ, ta lần lượt giải hệ phương trình tuyến tính để tìm ra toàn bộ 32 bytes của Key. Sử dụng unicode_escape để gửi các byte nhị phân của hash padding qua giao diện dòng lệnh của server. Sau khi khôi phục đủ 32 bytes của key, dùng AES-CBC giải mã ciphertext ban đầu lấy được flag.
```(python)
import ast
import hashpumpy
from pwn import *
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

HOST = 'lonely-island.picoctf.net'
PORT = 60639

def get_initial_data():
    """
    Kết nối liên tục cho đến khi server cấp một trusted vector có độ dài đúng bằng 1.
    Đồng thời lưu lại IV và Ciphertext của kết nối đó.
    """
    while True:
        # Tắt log rác của pwntools để output sạch sẽ hơn
        r = remote(HOST, PORT, level='error')
        
        r.recvuntil(b"IV: ")
        iv = bytes.fromhex(r.recvline().decode().strip())
        
        r.recvuntil(b"Ciphertext: ")
        ct = bytes.fromhex(r.recvline().decode().strip())
        
        r.recvuntil(b"Here are the vectors I trust won't leak my key:\n")
        
        for _ in range(5):
            line = r.recvline().decode().strip()
            vec, hsh = ast.literal_eval(line)
            # Nếu tìm thấy vector độ dài 1, trả về ngay lập tức
            if len(vec) == 1:
                return r, iv, ct, vec, hsh
        
        # Nếu không có vector nào dài 1, đóng kết nối và thử lại
        r.close()

def main():
    print("[*] Đang săn trusted vector có độ dài 1...")
    r, iv, ct, vec, hsh = get_initial_data()
    t0 = vec[0]
    print(f"[+] Tìm thấy! Vector: [{t0}], Hash: {hsh}")
    
    key = []
    
    # ==========================================
    # BƯỚC 1: Tìm byte đầu tiên của khóa (k_0)
    # ==========================================
    payload_0 = f"[{t0}]"
    r.recvuntil(b"Enter your vector: ")
    r.sendline(payload_0.encode())
    
    r.recvuntil(b"Enter its salted hash: ")
    r.sendline(hsh.encode())
    
    r.recvuntil(b"The computed dot product is: ")
    d0 = int(r.recvline().decode().strip())
    
    # Server dùng abs(t0) vì hàm parse_vector dọn mất dấu âm (-)
    k0 = d0 // abs(t0)
    key.append(k0)
    print(f"[+] Tìm được k_0: {k0}")
    
    # ==========================================
    # BƯỚC 2: Dùng Hash Pump tìm k_1 đến k_31
    # ==========================================
    for i in range(1, 32):
        # Nối thêm chuỗi để vị trí thứ i có giá trị 1, các vị trí trước là 0
        append_str = ", 0" * (i - 1) + ", 1"
        
        # Khởi tạo hashpump (salt của server dài 256 bytes)
        new_hash, new_data = hashpumpy.hashpump(hsh, str(t0), append_str, 256)
        
        # Format dữ liệu nhị phân để bypass lệnh input().decode('unicode_escape') của server
        escaped_data = ""
        for b in new_data:
            if b < 32 or b >= 127:
                escaped_data += f"\\x{b:02x}"
            else:
                escaped_data += chr(b)
                
        payload_i = f"[{escaped_data}]"
        
        r.recvuntil(b"Enter your vector: ")
        r.sendline(payload_i.encode())
        
        r.recvuntil(b"Enter its salted hash: ")
        r.sendline(new_hash.encode())
        
        r.recvuntil(b"The computed dot product is: ")
        di = int(r.recvline().decode().strip())
        
        # Theo hệ phương trình tuyến tính: k_i = D_i - D_0
        ki = di - d0
        key.append(ki)
        print(f"[+] Tìm được k_{i}: {ki}")
        
    r.close()
    
    print("\n[*] Khóa AES 32-bytes thu được:")
    print(key)
    
    # ==========================================
    # BƯỚC 3: Giải mã AES-CBC lấy Flag
    # ==========================================
    key_bytes = bytes(key)
    cipher = AES.new(key_bytes, AES.MODE_CBC, iv)
    try:
        flag = unpad(cipher.decrypt(ct), AES.block_size).decode()
        print(f"\nFlag: {flag}")
    except Exception as e:
        print(f"\n[!] Lỗi giải mã: {e}")

if __name__ == "__main__":
    main()
```
## Black Cobra Pepper
![image](https://hackmd.io/_uploads/Hk-pwsj3bg.png)

Bài này cho một implementation AES custom trong chall.py, đọc qua tưởng bình thường nhưng nhìn kỹ thì thấy ngay điểm bất thường ở hàm SubBytes:
```(python)
def sub_bytes(state):
    return state
```
tức là S-box bị loại bỏ hoàn toàn → không còn bước phi tuyến quan trọng nhất của AES, mà S-box chính là thứ tạo ra non-linearity để chống lại các dạng tấn công tuyến tính, nên khi bỏ đi thì toàn bộ cipher này bị “linear hóa”, lúc này hành vi của nó gần giống các scheme kiểu XOR-based nên có thể biểu diễn lại dưới dạng:
$$
E_K(P) = E_0(P) ⊕ E_K(0)
$$
trong đó E_K(P) là encrypt plaintext P với key K, E_0(P) là encrypt với key toàn 0, còn E_K(0) là encrypt block toàn 0 với key K, nhìn cái form này là thấy có thể tách phần phụ thuộc key ra được nên hướng đi là lợi dụng known plaintext mà đề cho.

Cụ thể đề cung cấp pt1 (đã biết plaintext) cùng với EK(pt1) và EK(flag) trong output.txt:
```
d7481d89f1aaf5a857f56edd2ae8994c   # EK(pt1)
8c7d66558130eb5796d131beb43c9934   # EK(flag)
```
đầu tiên mình sẽ tự tính E0(pt1) bằng cách encrypt pt1 với key = 0 (do code AES đã có sẵn nên làm được), sau đó từ công thức trên suy ra:
$$
EK(0) = EK(pt1) ⊕ E0(pt1)
$$
lúc này EK(pt1) lấy trực tiếp từ output dòng 1, còn E0(pt1) mình tự tính nên suy ra được EK(0), tiếp theo lấy EK(flag) XOR với EK(0) sẽ ra:
$$
E0(flag) = EK(flag) ⊕ EK(0)
$$
tức là mình đã biến ciphertext của flag về dạng encrypt dưới key = 0, mà key = 0 thì không còn bí mật gì nữa nên chỉ cần dùng AES decrypt với key 0 là recover được plaintext flag.

```(python)
from pwn import xor
import binascii

# --- Key schedule utils ---
def chunk_key(full):
    parts = ["", "", "", ""]
    tmp = full
    for i in range(len(tmp)):
        parts[i % 4] += tmp[0]
        tmp = tmp[1:]
    return parts

def merge_key(blocks):
    res = ""
    for i in range(32):
        res += blocks[i % 4][0]
        blocks[i % 4] = blocks[i % 4][1:]
    return res

def rotate(word):
    return word[2:] + word[:2]

def sub_word(word):   # no-op
    return word

def rcon(word):       # no-op
    return word

def expand_key(master):
    keys = []
    cur = master
    for _ in range(11):
        keys.append(cur)
        blocks = chunk_key(cur)

        blocks[-1] = rotate(blocks[-1])
        blocks[-1] = sub_word(blocks[-1])
        blocks[-1] = rcon(blocks[-1])

        blocks[0] = xor(bytes.fromhex(blocks[0]), bytes.fromhex(blocks[-1])).hex()
        blocks[1] = xor(bytes.fromhex(blocks[1]), bytes.fromhex(blocks[0])).hex()
        blocks[2] = xor(bytes.fromhex(blocks[2]), bytes.fromhex(blocks[1])).hex()
        blocks[3] = xor(bytes.fromhex(blocks[3]), bytes.fromhex(blocks[2])).hex()

        cur = merge_key(blocks)
    return keys

# --- State convert ---
def hex_to_state(h):
    b = [int(h[i:i+2], 16) for i in range(0, 32, 2)]
    s = [[0]*4 for _ in range(4)]
    for i in range(16):
        r, c = i % 4, i // 4
        s[r][c] = hex(b[i])[2:]
    return s

def state_to_hex(s):
    out = ""
    for c in range(4):
        for r in range(4):
            out += s[r][c].zfill(2)
    return out

# --- AES core (broken) ---
def sub_bytes(state):   # intentionally empty
    return state

def shift_rows(s):
    s[1] = s[1][1:] + s[1][:1]
    s[2] = s[2][2:] + s[2][:2]
    s[3] = s[3][3:] + s[3][:3]
    return s

def gmul(a, b):
    b = int(b, 16)
    res = 0
    for _ in range(8):
        if b & 1:
            res ^= a
        a <<= 1
        if a & 0x100:
            a ^= 0x11b
        b >>= 1
    return res

def mix_columns(s):
    tmp = [[0]*4 for _ in range(4)]
    for c in range(4):
        tmp[0][c] = hex(gmul(2, s[0][c]) ^ gmul(3, s[1][c]) ^ int(s[2][c],16) ^ int(s[3][c],16))[2:].zfill(2)
        tmp[1][c] = hex(int(s[0][c],16) ^ gmul(2, s[1][c]) ^ gmul(3, s[2][c]) ^ int(s[3][c],16))[2:].zfill(2)
        tmp[2][c] = hex(int(s[0][c],16) ^ int(s[1][c],16) ^ gmul(2, s[2][c]) ^ gmul(3, s[3][c]))[2:].zfill(2)
        tmp[3][c] = hex(gmul(3, s[0][c]) ^ int(s[1][c],16) ^ int(s[2][c],16) ^ gmul(2, s[3][c]))[2:].zfill(2)
    return tmp

def encrypt_block(pt, key):
    rk = expand_key(key)
    ct = xor(bytes.fromhex(pt), bytes.fromhex(rk[0])).hex()

    for i in range(1, 10):
        s = hex_to_state(ct)
        sub_bytes(s)
        shift_rows(s)
        s = mix_columns(s)
        ct = state_to_hex(s)
        ct = xor(bytes.fromhex(ct), bytes.fromhex(rk[i])).hex()

    s = hex_to_state(ct)
    sub_bytes(s)
    shift_rows(s)
    ct = state_to_hex(s)
    ct = xor(bytes.fromhex(ct), bytes.fromhex(rk[10])).hex()
    return ct

# --- inverse (for E0) ---
def inv_shift(s):
    s[1] = s[1][-1:] + s[1][:-1]
    s[2] = s[2][2:] + s[2][:2]
    s[3] = s[3][1:] + s[3][:1]
    return s

def inv_mix(s):
    tmp = [[0]*4 for _ in range(4)]
    for c in range(4):
        tmp[0][c] = hex(gmul(0x0e,s[0][c]) ^ gmul(0x0b,s[1][c]) ^ gmul(0x0d,s[2][c]) ^ gmul(0x09,s[3][c]))[2:].zfill(2)
        tmp[1][c] = hex(gmul(0x09,s[0][c]) ^ gmul(0x0e,s[1][c]) ^ gmul(0x0b,s[2][c]) ^ gmul(0x0d,s[3][c]))[2:].zfill(2)
        tmp[2][c] = hex(gmul(0x0d,s[0][c]) ^ gmul(0x09,s[1][c]) ^ gmul(0x0e,s[2][c]) ^ gmul(0x0b,s[3][c]))[2:].zfill(2)
        tmp[3][c] = hex(gmul(0x0b,s[0][c]) ^ gmul(0x0d,s[1][c]) ^ gmul(0x09,s[2][c]) ^ gmul(0x0e,s[3][c]))[2:].zfill(2)
    return tmp

def decrypt_E0(ct):
    s = hex_to_state(ct)

    # undo last round
    inv_shift(s)

    # undo rounds 9 -> 1
    for _ in range(9):
        s = inv_mix(s)
        inv_shift(s)

    return state_to_hex(s)

# --- solve ---
if __name__ == "__main__":
    pt1 = "72616e646f6d64617461313131313131"
    c1  = "d7481d89f1aaf5a857f56edd2ae8994c"
    cf  = "8c7d66558130eb5796d131beb43c9934"

    zero = "00" * 16

    # E0(pt1)
    e0_pt1 = encrypt_block(pt1, zero)

    # EK(0)
    ek0 = xor(bytes.fromhex(c1), bytes.fromhex(e0_pt1)).hex()

    # E0(flag)
    e0_flag = xor(bytes.fromhex(cf), bytes.fromhex(ek0)).hex()

    # decrypt
    flag_hex = decrypt_E0(e0_flag)
    print(binascii.unhexlify(flag_hex).decode(errors="ignore"))
```

## Small Trouble
![image](https://hackmd.io/_uploads/HymX8ish-l.png)
Bài này cho n, e, c nhìn qua là RSA bình thường, nhưng đọc source thì thấy ngay điểm chí mạng:

d = getPrime(256)
e = inverse(d, phi)

tức là thay vì chọn e nhỏ (65537) rồi tính d thì bài này làm ngược lại, chọn d rất nhỏ (256-bit) rồi suy ra e, đây chính là điểm chết vì trong RSA nếu private exponent d quá nhỏ thì dính ngay Wiener attack.

Nhìn hint “something small might ruin it all” là phải nghi ngay small private exponent, mà Wiener attack chuyên trị case này, cụ thể nếu d < n^(1/4) thì có thể recover lại d từ (e, n) bằng continued fraction.

Script solve hoạt động đúng theo hướng đó, đầu tiên nó lấy phân số liên tục (continued fraction) của e/n, sau đó generate các convergents (k/d) là các xấp xỉ của phân số này, với mỗi candidate (k, d) nó check điều kiện:
```
(e * d - 1) % k == 0
```
nếu thỏa thì suy ra được:
```
phi = (e * d - 1) // k
```
từ đó tính:
``
b = n - phi + 1
``
``
Δ = b^2 - 4n
``
nếu Δ là perfect square thì gần như chắc chắn đã tìm đúng d (vì lúc đó factor được n), nên return luôn.

Sau khi recover được d thì phần còn lại trivial, chỉ cần:
```(python)
m = pow(c, d, n)
```
rồi decode ra flag bằng long_to_bytes.
```(python)
import math
import sys
from Crypto.Util.number import long_to_bytes

# Increase the limit for integer string conversion to handle large RSA numbers
sys.set_int_max_str_digits(10000)

# Values extracted from message.txt
n = 5594693087516809540399630533662256130165069234399367321216316625813041939300993769469967603569290419832603300499594108772793414518139869665356083286669649260446980521836343923879233640062756943840931863547930310945579712973265137792295790351161076685048473027951375342321268790017586922565818383182756032674465485490251320715340411385624938864566260868602337614069898840915970814299359393740587761535848189108678205178238800280288111230994607337322709256318074861115932027677894091130507029723017060154360297187479229724325679623356440638966942954291313437552982609848032044158878674696384027496524889634696452323607191723997392473
e = 1253741277266526276273737492341769420156287745742446683234137950307473941700753795420946118527838187324934980950852435452652395931456125106860289473635243147451566503774469323896054400225880927948949271325382686728252025525992064502049812510769890170584852893320391805480557992376841338269221082823514780592527932026224041016469532408356349643964521128610552886213674116475363116732306717431311560112424065793590597523162878957727018336437764277170504454532774662559560076329628335685182665402553483091574429654268002692354092642868885921538110973203434318377491643644652734769173448091279268078729903023902968710350828758115786949
c = 1575773147844095818115335246981689507608786190212845187250432450517265485011147541328871869339509244543151221056093233377208864758371954434810015700305579991328875661494910208600661149362933701275626110364421427594488043068010070893043333162678431541790213846097012150446212452859725911076627073141637069389589032187813548754572797526213109169925710036206244271861122294567316906395657015977496683800227620943713798410804779020204823690850145678294088525234958290370183071276300423260384932033932245873934561990566777751374865071948145184698603999279619026875789640532470724368003682471823004876010640755680214225037847875314158626

def wiener_attack(e, n):
    # Calculate the continued fraction expansion
    x, y = e, n
    cf = []
    while y:
        cf.append(x // y)
        x, y = y, x % y

    # Calculate convergents and test each candidate 'd'
    n0, n1 = 1, cf[0]
    d0, d1 = 0, 1

    for a in cf[1:]:
        n2 = a * n1 + n0
        d2 = a * d1 + d0
        k, d = n2, d2

        if k == 0:
            n0, n1 = n1, n2
            d0, d1 = d1, d2
            continue

        # Check if 'd' is a valid candidate for the private exponent
        if (e * d - 1) % k == 0:
            phi = (e * d - 1) // k
            b = n - phi + 1
            discriminant = b * b - 4 * n

            # If the discriminant is a perfect square, we've found the right 'd'
            if discriminant >= 0:
                s = math.isqrt(discriminant)
                if s * s == discriminant:
                    return d

        n0, n1 = n1, n2
        d0, d1 = d1, d2

    return None

print("[*] Launching Wiener's Attack...")
d = wiener_attack(e, n)

if d:
    print(f"[+] Private key 'd' successfully recovered!")
    m = pow(c, d, n)
    print(f"Decrypted Flag: {long_to_bytes(m).decode(errors='ignore')}")
else:
    print("Failed. 'd' was not small enough.")
```
## Related Messages
![image](https://hackmd.io/_uploads/HygHdsi2Zg.png)
Bài này cho 2 ciphertext c1, c2 tương ứng với 2 message có liên hệ với nhau, cụ thể Message_fixed = Message + 3, ngoài ra biết luôn n và e = 17, nhìn cái form này là phải nghĩ ngay tới dạng Franklin-Reiter related message attack vì có 2 plaintext liên quan tuyến tính.

Từ đó set up lại bài toán, gọi m là Message thì có:
```
c1 = m^e mod N
c2 = (m + 3)^e mod N
```
=> dựng 2 đa thức trong Z_N:
```
f1(x) = x^e - c1
f2(x) = (x + 3)^e - c2
```
ý tưởng là nghiệm chung của 2 đa thức này chính là x = m, nên nếu lấy gcd của f1 và f2 thì sẽ thu được đa thức dạng (x - m).

Script solve làm đúng hướng này, đầu tiên dựng polynomial ring trên modulo N:
```
Z_N = Zmod(N)
P.<x> = PolynomialRing(Z_N)
```
sau đó define:
```
f1 = x^e - c1
f2 = (x + 3)^e - c2
```
rồi dùng Euclidean algorithm để tính gcd:
```
def franklin_reiter_gcd(f1, f2):
    while f2:
        f1, f2 = f2, f1 % f2
    return f1.monic()
```
khi chạy xong thì gcd_poly sẽ là dạng (x - m), nên chỉ cần lấy hệ số tự do (constant term) ra là recover được m:

m = -gcd_poly.coefficients()[0]

cuối cùng convert về bytes là ra flag, nếu cần Message_fixed thì chỉ cần cộng thêm 3.

```(python)
# Variables extracted from output.txt
c1 = 3486364849772584627692611749053367200656673358261596068549224442954489368512244047032432842601611650021333218776410522726164792063436874469202000304563253268152374424792827960027328885841727753251809392141585739745846369791063025294100126955644910200403110681150821499366083662061254649865214441429600114378725559898580136692467180690994656443588872905046189428367989340123522629103558929469463071363053880181844717260809141934586548192492448820075030490705363082025344843861901475648208157572346004443100461870519699021342998731173352225724445397168276113254405106732294978648428026500248591322675321980719576323749
c2 = 201982790559548563915678784397933493721879152787419243871599124287434576744055997870874349538398878336345269929647585648144070475012256331468688792105087899416655051702630953882466457932737483198442642588375981620937494661378586614008496182135571457352400128892078765628319466855732569272509655562943410536265866312968101366413636251672211633011159836642751480632253423529271185888171036917413867011031963618529122680143291205470937752671602494831117301480813590683791618751348224964277861127486155552153012612562009905595646626759034581358425916638671884927506025703373056113307665093346439014722219878575598308124
N = 17334845546772507565250479697360218105827285681719530148909779921509619103084219698006014339278818598859177686131922807448182102049966121282308256054696565796008642900453901629937223685292142986689576464581496406676552201407729209985216274086331582917892470955265888718120511814944341755263650688063926284195007148056359887333784052944201212155189546062807573959105963160320187551755272391293705288576724811668369745107148481856135696249862795476376097454818009481550162364943945249601744881676746859305855091288055082626399929893610275614840617858985993338556889612804266896309310999363054134373435198031731045253881
e = 17

# Since Message - Message_fixed = -3, Message_fixed = Message + 3
b = 3

# Define the Polynomial Ring over Z_N
Z_N = Zmod(N)
P.<x> = PolynomialRing(Z_N)

# Construct the two polynomials f1(x) and f2(x)
f1 = x^e - c1
f2 = (x + b)^e - c2

# Custom Euclidean Algorithm to compute the GCD of f1 and f2 over Z_N
def franklin_reiter_gcd(f1, f2):
    while f2:
        f1, f2 = f2, f1 % f2
    return f1.monic()

# Calculate the GCD polynomial
gcd_poly = franklin_reiter_gcd(f1, f2)

# The result is the polynomial (x - m).
# We isolate m by taking the negative of the constant term.
m_int = int(-gcd_poly.coefficients()[0])

# Convert the numerical message back to bytes to read the flag
def long_to_bytes(val, endianness='big'):
    width = val.bit_length()
    width += 8 - ((width % 8) or 8)
    return val.to_bytes(width // 8, byteorder=endianness)

print("\n[+] Success! Flag extracted:")
print(long_to_bytes(m_int).decode('utf-8'))
```