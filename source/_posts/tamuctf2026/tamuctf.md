---
title: (VietNamese) Tamu CTF 2026 Writeup (Author)
date: 2026-3-11 08:19:33
top_img: /img/tamu/tamu.png
cover: /img/tamu/tamu.png
categories:
  - Forensics
  - Writeup CTF
toc: true
---
# Colonel 
> An Army Colonel is having trouble decrypting a sensitive file. He remembers it being encrypted with AES CBC with an iv of 1234567890123456, but can't for the life of him remember what key he used. He captured a memory dump while he was trying to decrypt the file. Maybe you can find something in there?

This is a memory dump so we can use Volatility3. First get information about OS / kernel.

```
$ vol -f memory.dump banners.Banners
0xcb5c6560      Linux version 6.17.0-14-generic (buildd@lcy02-amd64-067) (x86_64-linux-gnu-gcc-13 (Ubuntu 13.3.0-6ubuntu2~24.04) 13.3.0, GNU ld (GNU Binutils for Ubuntu) 2.42) #14~24.04.1-Ubuntu SMP PREEMPT_DYNAMIC Thu Jan 15 15:52:10 UTC 2 (Ubuntu 6.17.0-14.14~24.04.1-generic 6.17.9)
```

=> Ubuntu 24.04 with kernel 6.17.0-14.

Download symbols from https://github.com/Abyss-W4tcher/volatility3-symbols/blob/master/Ubuntu/amd64/6.17.0/14/generic/Ubuntu_6.17.0-14-generic_6.17.0-14.14~24.04.1_amd64.json.xz and add them to volatility3/linux/ directory.

Check Bash history

```
$ vol -f memory.dump linux.bash.Bash
PID     Process CommandTime     Command

4269    bash    2026-02-14 21:48:53.000000 UTC  ls
4269    bash    2026-02-14 21:48:53.000000 UTC  ls /tmp
4269    bash    2026-02-14 21:48:53.000000 UTC  exit
4269    bash    2026-02-14 21:48:56.000000 UTC  cd validate/
4269    bash    2026-02-14 21:49:03.000000 UTC  sudo insmod check_service.ko key_path=validation
4269    bash    2026-02-14 21:49:09.000000 UTC  sudo rmmod check_service
4269    bash    2026-02-14 21:49:11.000000 UTC  sudo insmod check_service.ko key_path=validation2
```

Looks like there is a custom kernel module check_service.ko. We can confirm using Lsmod.

```
$ vol -f memory.dump linux.lsmod.Lsmod 
Offset  Module Name     Code Size       Taints  Load Arguments  File Output

0xffffc09b0100  check_service   0x3000  OOT_MODULE,UNSIGNED_MODULE      key_path=pu     N/A
[...]
```

Try to recover the filesystem to see if we can find it (you may need to patch volatility based on this issue if you get an error: https://github.com/volatilityfoundation/volatility3/issues/1943).

```
$ vol -f memory.dump linux.pagecache.RecoverFs
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

The challenge description gives the IV and the algoritm to use.

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
