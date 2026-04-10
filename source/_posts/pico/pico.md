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



# Reverse engineering ( Alight 36 + 1)
## Gatekeeper
```int __fastcall main(int argc, const char **argv, const char **envp)
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
``` a
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
``` a
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

``` a
key=[83,51,67,114,51,116,0]
cipher="235a201d702015483b1d412b265d3313501f0c072d135f0d2002302d06476350224507462e"
for i in range(0,len(cipher),2):
    print(chr(int(cipher[i:i+2],16)^key[int(i/2)%6]),end="")   
```
picoCTF{xor_unpack_4nalys1s_530ca742}
## Hidden Cipher2
chạy chương trình thử
``` a
What is 8 - 2? 6
Encoded flag values:
672, 630, 594, 666, 402, 504, 420, 738, 654, 312, 696, 624, 570, 588, 306, 624, 294, 660, 600, 570, 594, 294, 672, 624, 306, 684, 570, 312, 582, 306, 588, 300, 594, 594, 612, 750
```
``` a
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
``` a
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
``` a
lst=[672, 630, 594, 666, 402, 504, 420, 738, 654, 312, 696, 624, 570, 588, 306, 624, 294, 660, 600, 570, 594, 294, 672, 624, 306, 684, 570, 312, 582, 306, 588, 300, 594, 594, 612, 750]
for i in lst:
    print(chr(int(i/6)),end="")
```
flag:`picoCTF{m4th_b3h1nd_c1ph3r_4a3b2ccf}`

## Bypass me
chal này bắt mình phải dùng LLDB
dùng LLDB với file bypassme.bin
disassemble main thì ta thấy có 1 func là decode_password, đặt breakpoint tại đấy và chạy thì ta thấy được output
``` a
Process 96 stopped
* thread #1, name = 'bypassme.bin', stop reason = instruction step into
    frame #0: 0x000063ae81c793a0 bypassme.bin`decode_password(out="SuperSecure") at bypassme.c:18:5
```
pass: SuperSecure 
```  a
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
``` 
.
├── META-INF
│   ├── cose.manifest
│   ├── cose.sig
│   ├── manifest.mf
│   ├── mozilla.rsa
│   └── mozilla.sf
├── a.zip
├── assets
│   ├── script.js
│   └── styles.css
├── background
│   └── main.js
├── icons
│   ├── icon-32.png
│   └── icon-64.png
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
``` a
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
``` a
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
``` c
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
