---
title: (English + Vietnamese) Tamu CTF 2026 Writeup (Author)
date: 2026-3-26 16:19:33
top_img: /img/tamu/tamu.png
cover: /img/tamu/tamu.png
categories:
  - Forensics
  - Writeup CTF
toc: true
---
# Colonel - English Version
> An Army Colonel is having trouble decrypting a sensitive file. He remembers it being encrypted with AES CBC with an iv of 1234567890123456, but can't for the life of him remember what key he used. He captured a memory dump while he was trying to decrypt the file. Maybe you can find something in there?

A simple wup but this is first wup in language English 
## Recon
The goal of this exercise is to find the AES key in the memory file to find the flag.

This exercise provides a `memory.dump` file and a `flag.enc` file. Since this is a memory dump, the most natural approach is to use **Volatility3** to mine the artifact in RAM.

This is a memory dump so we can use Volatility3. First get information about OS / kernel.

```
$ vol3 -f memory.dump banners.Banners
0xcb5c6560      Linux version 6.17.0-14-generic (buildd@lcy02-amd64-067) (x86_64-linux-gnu-gcc-13 (Ubuntu 13.3.0-6ubuntu2~24.04) 13.3.0, GNU ld (GNU Binutils for Ubuntu) 2.42) #14~24.04.1-Ubuntu SMP PREEMPT_DYNAMIC Thu Jan 15 15:52:10 UTC 2 (Ubuntu 6.17.0-14.14~24.04.1-generic 6.17.9)
```
![image](https://hackmd.io/_uploads/ryZvR_zoWl.png)


=> Ubuntu 24.04 with kernel 6.17.0-14.

Download symbols from https://github.com/Abyss-W4tcher/volatility3-symbols/blob/master/Ubuntu/amd64/6.17.0/14/generic/Ubuntu_6.17.0-14-generic_6.17.0-14.14~24.04.1_amd64.json.xz and add them to volatility3/linux/ directory.

Check Bash history
![image](https://hackmd.io/_uploads/HynB1FGjbg.png)

Looks like there is a custom kernel module check_service.ko. We can confirm using Lsmod.

```b
$ vol3 -f memory.dump linux.lsmod.Lsmod 
Offset  Module Name     Code Size       Taints  Load Arguments  File Output

0xffffc09b0100  check_service   0x3000  OOT_MODULE,UNSIGNED_MODULE      key_path=pu     N/A
[...]
```

Try to recover the filesystem to see if we can find it (you may need to patch volatility based on this issue if you get an error: https://github.com/volatilityfoundation/volatility3/issues/1943).

```Bash 
$ vol3 -f memory.dump linux.pagecache.RecoverFs
[...]
$ find . -name 'check_service.ko'
./4e2ffbd3-03fb-41cf-8232-7d4f9ac31a47/home/ubuntu/validate/check_service.ko
```

Now we have the compiled kernel module, plus the two files that were used as "key_path" parameter in the Bash history. The two files are very similar, only a few bytes differ.

```
$ ls ./4e2ffbd3-03fb-41cf-8232-7d4f9ac31a47/home/ubuntu/validate/
check_service.ko  check_service_padded.ko  validation  validation2

$ cat ./4e2ffbd3-03fb-41cf-8232-7d4f9ac31a47/home/ubuntu/validate/validation
Qx+KvRQ1N2RR66IxSM5VjkrGKg09FH2f

$ cat ./4e2ffbd3-03fb-41cf-8232-7d4f9ac31a47/home/ubuntu/validate/validation2
Xx+KvRQ1NQRR56IxSM5VjjrRKg09Fl2e
```

Import in Ghidra as raw binary x86 64 bits instead of ELF because it's corrupted, then try to reverse engineer / guess what the module is doing based on strings and instructions:

- "/root/key.txt", probably the AES-CBC key we are looking for, but it's missing from the recovered filesystem.
- "Error: failed to open key file (%ld)\n", "Error: Invalid key length (%zd), expected %d bytes\n".
- "Error: Invalid key %*phN, indices %sincorrect\n", it looks like the root key is compared with the key_path key and printing this when bytes differ.

From my understanding / educated guess, "/root/key.txt" is the correct key and this module is used to compare it with the file given on the command line (key_path). Since we have two very slightly different "validation" keys, the correct key is probably a mix of both. I used this Python script to generate all possibilities from the bytes of both validation keys and it turns out this is a correct guess.

## Solution
The challenge description gives the IV and the algoritm to use.
This script write by chatgpt and stolen because my code is bad 
```python
import itertools
from Crypto.Cipher import AES

v1 = open('fs/4e2ffbd3-03fb-41cf-8232-7d4f9ac31a47/home/ubuntu/validate/validation', 'r').read().strip()
v2 = open('fs/4e2ffbd3-03fb-41cf-8232-7d4f9ac31a47/home/ubuntu/validate/validation2', 'r').read().strip()
enc = open('flag.enc', 'rb').read()

diff_indices = [i for i, (k1, k2) in enumerate(zip(v1, v2)) if k1 != k2]
for it in itertools.product([0, 1], repeat=len(diff_indices)):
    j = 0
    key = ''
    for i in range(len(v1)):
        if i not in diff_indices:
            key += v1[i]
        else:
            key += (v1 if it[j] else v2)[i]
            j += 1
    flag = AES.new(key.encode(), AES.MODE_CBC, iv=b'1234567890123456').decrypt(enc)
    if flag.startswith(b'gigem'):
        print(key, flag)
```

This yields the correct key and the decrypted flag.

```
Qx+KvRQ1NQRR66IxSM5VjjrGKg09FH2e b'gigem{bl3ss3d_4r3_th3_c010n31_m33k}\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
```



# Colonel -  Vietnamese version

> Một Đại tá Quân đội gặp khó khăn trong việc giải mã một file nhạy cảm. Ông nhớ rằng file đã được encrypt bằng AES CBC với IV là 1234567890123456, nhưng không thể nhớ được key nào đã sử dụng. Ông đã capture một memory dump khi đang cố gắng giải mã file. Có thể bạn có thể tìm thấy điều gì đó trong đó?

## Giải thích

Đây là một thử thách memory forensics nơi chúng ta cần tìm encryption key được ẩn trong memory dump của máy tính. Đây là những gì chúng ta biết:
- Đại tá có một file đã được encrypt
- File đã được encrypt sử dụng AES-CBC
- Chúng ta biết IV (initialization vector): `1234567890123456`
- Chúng ta cần tìm encryption key trong memory dump
- Khi tìm được key, chúng ta có thể decrypt file và lấy được flag

**Tools chúng ta cần:**
- Volatility3: Một tool để analyze memory dumps
- Python: Để viết script thử các key khác nhau

**Files được cung cấp:**
- `memory.dump`: Memory dump từ máy tính của đại tá
- `flag.enc`: File flag đã được encrypt

## Bước 1: Hiểu về Memory Dump và Setup Tools

**Memory dump là gì?**
Memory dump là một bản copy của mọi thứ có trong RAM của máy tình khi nó được capture. Điều này bao gồm:
- Các chương trình đang chạy
- Các tệp đang mở
- Mật khẩu và khóa có trong bộ nhớ
- Lịch sử lệnh
- Và nhiều hơn nữa!

**Volatility3 là gì?**
Volatility3 là một công cụ đặc biệt giúp chúng ta phân tích bản sao bộ nhớ. Nó có thể tìm:
- Hệ điều hành nào đang chạy
- Chương trình nào đang hoạt động
- Tệp nào có trong bộ nhớ
- Lịch sử lệnh
- Dữ liệu ẩn hoặc đã bị xóa

### Tìm hiểu Hệ điều hành

Bước đầu tiên là xác định hệ điều hành nào mà bản sao bộ nhớ được tạo từ đó. Điều này giúp chúng ta hiểu công cụ và lệnh nào nên sử dụng.

```bash
$ vol3 -f memory.dump banners.Banners
```

**Lệnh này làm gì:**
- `vol3`: Chạy Volatility3
- `-f memory.dump`: Báo cho nó phân tích tệp bản sao bộ nhớ của chúng ta
- `banners.Banners`: Plugin này tìm kiếm thông tin hệ thống trong bộ nhớ

**Kết quả:**
```
0xcb5c6560      Linux version 6.17.0-14-generic (buildd@lcy02-amd64-067) (x86_64-linux-gnu-gcc-13 (Ubuntu 13.3.0-6ubuntu2~24.04) 13.3.0, GNU ld (GNU Binutils for Ubuntu) 2.42) #14~24.04.1-Ubuntu SMP PREEMPT_DYNAMIC Thu Jan 15 15:52:10 UTC 2 (Ubuntu 6.17.0-14.14~24.04.1-generic 6.17.9)
```

**Điều này cho chúng ta biết:**
- Hệ điều hành: Ubuntu 24.04 Linux
- Phiên bản kernel: 6.17.0-14-generic
- Điều này quan trọng vì chúng ta cần các symbols đúng (tệp đặc biệt) để phân tích phiên bản Linux cụ thể này

![image](https://hackmd.io/_uploads/ryZvR_zoWl.png)

### Lấy Công cụ 

**Tại sao chúng ta cần symbols?**
Symbols giống như một từ điển giúp Volatility3 hiểu cấu trúc bộ nhớ của phiên bản Linux cụ thể này. Không có chúng, chúng ta không thể phân tích bộ nhớ đúng cách.

**Nơi lấy symbols:**
Tải từ: https://github.com/Abyss-W4tcher/volatility3-symbols/blob/master/Ubuntu/amd64/6.17.0/14/generic/Ubuntu_6.17.0-14-generic_6.17.0-14.14~24.04.1_amd64.json.xz

**Cách cài đặt:**
1. Download
2. Giải nén 
3. Đặt tệp .json trong thư mục volatility3/linux/ của bạn

## Bước 2: Tìm kiếm Manh mối

### Kiểm tra Lịch sử Lệnh

Một trong những nơi tốt nhất để tìm manh mối là trong lịch sử lệnh - người dùng đã chạy những lệnh nào trước khi bộ nhớ được ghi lại?

```bash
$ vol3 -f memory.dump linux.bash.Bash
```

**Lệnh này làm gì:**
- Tìm kiếm trong bộ nhớ lịch sử lệnh bash
- Cho chúng ta biết người dùng đang làm gì trước khi bản sao bộ nhớ được tạo

![image](https://hackmd.io/_uploads/HynB1FGjbg.png)

**Khám phá quan trọng:**
Đầu ra cho thấy có một kernel module tùy chỉnh tên `check_service.ko` đã được load với tham số `key_path=pu...`

**Kernel module là gì?**
Kernel module là một đoạn code có thể được load vào Linux kernel để thêm chức năng mới. Trong trường hợp này, có vẻ như module này được sử dụng để kiểm tra hoặc xác thực điều gì đó liên quan đến một khóa.

### Tìm Modules Đã Load

Hãy xác nhận những module nào được load trong bộ nhớ:

```bash
$ vol3 -f memory.dump linux.lsmod.Lsmod 
```

**Kết quả:**
```bash
Offset          Module Name     Code Size       Taints                          Load Arguments  File Output
0xffffc09b0100  check_service   0x3000          OOT_MODULE,UNSIGNED_MODULE      key_path=pu     N/A
[...]
```

**Điều này cho chúng ta biết:**
- Có một module tên `check_service`
- Nó được load với tham số `key_path=pu...`
- Điều này có thể đang kiểm tra một tệp khóa với cái gì đó

## Bước 3: Khôi phục Tệp từ Bộ nhớ

### Trích xuất Hệ thống Tệp

Đôi khi các tệp có trong bộ nhớ có thể được khôi phục, ngay cả khi chúng không còn trên ổ cứng nữa.

```bash
$ vol3 -f memory.dump linux.pagecache.RecoverFs
```

**Lệnh này làm gì:**
- Tìm kiếm trong bộ nhớ dữ liệu hệ thống tệp được cache
- Cố gắng tái tạo các tệp có trong bộ nhớ
- Lưu chúng để chúng ta có thể phân tích

**Tìm mục tiêu của chúng ta:**
```bash
$ find . -name 'check_service.ko'
./4e2ffbd3-03fb-41cf-8232-7d4f9ac31a47/home/ubuntu/validate/check_service.ko
```

**Tuyệt vời! Chúng ta tìm thấy:**
- Tệp kernel module: `check_service.ko`
- Nó trong một thư mục tên là `validate`
- Hãy xem còn gì khác trong thư mục đó

### Kiểm tra các Tệp

```bash
$ ls ./4e2ffbd3-03fb-41cf-8232-7d4f9ac31a47/home/ubuntu/validate/
check_service.ko  check_service_padded.ko  validation  validation2
```

**Các tệp thú vị tìm thấy:**
- `validation` và `validation2`: Hai tệp tương tự
- `check_service.ko`: Kernel module
- `check_service_padded.ko`: Một phiên bản khác của module

**Xem các tệp validation:**
```bash
$ cat ./4e2ffbd3-03fb-41cf-8232-7d4f9ac31a47/home/ubuntu/validate/validation
Qx+KvRQ1N2RR66IxSM5VjkrGKg09FH2f

$ cat ./4e2ffbd3-03fb-41cf-8232-7d4f9ac31a47/home/ubuntu/validate/validation2  
Xx+KvRQ1NQRR56IxSM5VjjrRKg09Fl2e
```

**Quan sát quan trọng:**
Hai tệp này gần như giống hệt nhau, nhưng một vài ký tự khác nhau. Đây là một manh mối mạnh!

## Bước 4: Reverse Engineering Kernel Module

### Sử dụng Ghidra để Phân tích

**Ghidra là gì?**
Ghidra là một công cụ giúp chúng ta hiểu chương trình đã biên dịch làm gì bằng cách hiển thị code ở dạng dễ đọc hơn.

**Cách phân tích:**
1. Import `check_service.ko` trong Ghidra như raw binary x86 64-bit
2. Tìm các chuỗi text cho chúng ta manh mối về chức năng của chương trình

**Các chuỗi quan trọng tìm thấy:**
- `"/root/key.txt"`: Có vẻ như đây là đường dẫn đến khóa AES thực!
- `"Error: failed to open key file (%ld)\n"`: Thông báo lỗi khi không mở được tệp khóa
- `"Error: Invalid key length (%zd), expected %d bytes\n"`: Lỗi cho độ dài khóa sai
- `"Error: Invalid key %*phN, indices %s incorrect\n"`: Lỗi khi so sánh khóa

### Hiểu Module Làm Gì

**Dựa trên bằng chứng:**
1. Module cố gắng đọc `/root/key.txt` (khóa AES thực)
2. Nó so sánh khóa này với tệp được cung cấp như tham số `key_path`
3. Nếu chúng không khớp, nó in thông báo lỗi cho thấy byte nào khác nhau
4. Hai tệp `validation` chúng ta tìm thấy có lẽ là khóa test gần với khóa thực

**Key insight:**
Vì chúng ta có hai file validation rất tương tự, và module so sánh chúng với key thực, key thật có lẽ là một combination các byte từ cả hai file validation!

## Bước 5: Tạo Solution

### Hiểu về AES Encryption

**AES-CBC là gì?**
- AES: Advanced Encryption Standard (một cách để encrypt data)
- CBC: Cipher Block Chaining (một mode cụ thể của AES)
- IV: Initialization Vector (starting value cho encryption)

**Những gì chúng ta biết từ thử thách:**
- Thuật toán: AES-CBC
- IV: `1234567890123456` (được cho trong thử thách)
- Khóa: Không biết (đây là thứ chúng ta cần tìm)



This script write by chatgpt and stolen because my code is bad 
```python
import itertools
from Crypto.Cipher import AES

v1 = open('fs/4e2ffbd3-03fb-41cf-8232-7d4f9ac31a47/home/ubuntu/validate/validation', 'r').read().strip()
v2 = open('fs/4e2ffbd3-03fb-41cf-8232-7d4f9ac31a47/home/ubuntu/validate/validation2', 'r').read().strip()
enc = open('flag.enc', 'rb').read()

diff_indices = [i for i, (k1, k2) in enumerate(zip(v1, v2)) if k1 != k2]
for it in itertools.product([0, 1], repeat=len(diff_indices)):
    j = 0
    key = ''
    for i in range(len(v1)):
        if i not in diff_indices:
            key += v1[i]
        else:
            key += (v1 if it[j] else v2)[i]
            j += 1
    flag = AES.new(key.encode(), AES.MODE_CBC, iv=b'1234567890123456').decrypt(enc)
    if flag.startswith(b'gigem'):
        print(key, flag)
```

This yields the correct key and the decrypted flag.

```
Qx+KvRQ1NQRR66IxSM5VjjrGKg09FH2e b'gigem{bl3ss3d_4r3_th3_c010n31_m33k}\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
```
