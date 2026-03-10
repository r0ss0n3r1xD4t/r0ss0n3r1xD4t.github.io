---
title: OverTheWire Bandit Writeup
date: 2026-01-11 08:19:33
top_img: /img/hinhnen.jpg
cover: /img/hinhnen.jpg
categories:
  - Web Exploit
  - Writeup CTF
toc: true
tags:
  - OverTheWire
  - Bandit
  - Linux
  - SSH
  - CTF
---

# Wup overthewire



## Bandit Level 0 -> 1 
### Login
SSH:`ssh bandit0@bandit.labs.overthewire.org -p 2220`

Password : `bandit0`

---

### Task
The password for the next level is stored in a file called readme located in the home directory. Use this password to log into bandit1 using SSH. Whenever you find a password for a level, use SSH (on port 2220) to log into that level and continue the game.

---


### Solution
Chall này để giúp chúng ta biết về lệnh 
 `ls` là lệnh list giúp in ra các file và folder trong tư mục hiện tại
 `cat` là lệnh in nội dung của tệp tin ra màn hình 
```bash
bandit0@bandit:~$ ls
readme
bandit0@bandit:~$ cat readme
The password you are looking for is: ZjLjTmM6FvvyRnrb2rfNWOZOTa6ip5If
```
## Bandit Level 1 -> 2
### Login
SSH:`ssh bandit1@bandit.labs.overthewire.org -p 2220`

Password : `ZjLjTmM6FvvyRnrb2rfNWOZOTa6ip5If`

---

### Task 
The password for the next level is stored in a file called - located in the home directory

---

### Solution
Tên tệp có dấu gạch ngang (dashed filename) trong Linux/Unix là các tệp có ký tự "-" ở đầu, gây khó khăn vì lệnh thường hiểu "-" là tùy chọn (option) thay vì tên tệp, nhưng có thể xử lý bằng cách dùng ./, --, hoặc -- trước tên tệp để chỉ rõ. 

Sử dụng ./: Chỉ đường dẫn tương đối, lệnh sẽ hiểu - là tên tệp trong thư mục hiện tại.

```bash
bandit1@bandit:~$ ls
bandit1@bandit:~$ cat ./-
263JGJPfgU6LtdEvgfWU1XP5yac29mFx
```

## Bandit Level 2 -> 3
### Login
SSH:`ssh bandit2@bandit.labs.overthewire.org -p 2220`

Password : `263JGJPfgU6LtdEvgfWU1XP5yac29mFx`

---

### Task 
The password for the next level is stored in a file called --spaces in this filename-- located in the home directory

---

### Solution

Giao diện dòng lệnh (CLI): Khi bạn gõ lệnh (ví dụ cat , mv, cp), hệ thống hiểu dấu cách để tách lệnh và đối số. Nếu tên tệp có khoảng trắng, máy tính sẽ nhầm lẫn đó là nhiều tên tệp khác nhau, ví dụ: mv memaybeo.txt thumuc36 sẽ hiểu thành mv memaybeo.txt và thumuc36

So cách xử lí là cho file chứa khoảng trắng vào dấu `""` hoặc `''`


```bash
bandit2@bandit:~$ ls
--spaces in this filename--
bandit2@bandit:~$ cat ./"--spaces in this filename--"
MNk8KNH3Usiio41PRUEoDFPqfxLPlSmx
bandit2@bandit:~$
```



## Bandit Level 3 -> 4
### Login
SSH:`ssh bandit3@bandit.labs.overthewire.org -p 2220`

Password : `MNk8KNH3Usiio41PRUEoDFPqfxLPlSmx`

---

### Task 
The password for the next level is stored in a hidden file in the inhere directory.

---

### Solution

```bash
bandit3@bandit:~$ ls
inhere
bandit3@bandit:~$ cd inhere
bandit3@bandit:~/inhere$ ls
bandit3@bandit:~/inhere$ ls -a
.  ..  ...Hiding-From-You
bandit3@bandit:~/inhere$ cat ...Hiding-From-You
2WmrDFRmJIq3IPxneAaMGhap0pFhF3NJ
```
## Bandit Level 4 -> 5
### Login
SSH:`ssh bandit4@bandit.labs.overthewire.org -p 2220`

Password : `2WmrDFRmJIq3IPxneAaMGhap0pFhF3NJ`

---

### Task 
The password for the next level is stored in the only human-readable file in the inhere directory. Tip: if your terminal is messed up, try the “reset” command.

---

### Solution
Đề bài yêu cầu tìm password ở trong file only human đọc được nên ta dùng lệnh `file` để kiểm tra định dạng file 


```bash
bandit4@bandit:~$ ls
inhere
bandit4@bandit:~$ cd inhere
bandit4@bandit:~/inhere$ ls -la
total 48
drwxr-xr-x 2 root    root    4096 Oct 14 09:26 .
drwxr-xr-x 3 root    root    4096 Oct 14 09:26 ..
-rw-r----- 1 bandit5 bandit4   33 Oct 14 09:26 -file00
-rw-r----- 1 bandit5 bandit4   33 Oct 14 09:26 -file01
-rw-r----- 1 bandit5 bandit4   33 Oct 14 09:26 -file02
-rw-r----- 1 bandit5 bandit4   33 Oct 14 09:26 -file03
-rw-r----- 1 bandit5 bandit4   33 Oct 14 09:26 -file04
-rw-r----- 1 bandit5 bandit4   33 Oct 14 09:26 -file05
-rw-r----- 1 bandit5 bandit4   33 Oct 14 09:26 -file06
-rw-r----- 1 bandit5 bandit4   33 Oct 14 09:26 -file07
-rw-r----- 1 bandit5 bandit4   33 Oct 14 09:26 -file08
-rw-r----- 1 bandit5 bandit4   33 Oct 14 09:26 -file09
bandit4@bandit:~/inhere$ file ./*
./-file00: data
./-file01: OpenPGP Public Key
./-file02: OpenPGP Public Key
./-file03: data
./-file04: data
./-file05: data
./-file06: data
./-file07: ASCII text
./-file08: data
./-file09: data
bandit4@bandit:~/inhere$ cat ./-file07
4oQYVPkxZOOEOO5pTW81FB8j8lxXGUQw
```

## Bandit Level 5 -> 6
### Login
SSH:`ssh bandit5@bandit.labs.overthewire.org -p 2220`

Password : `4oQYVPkxZOOEOO5pTW81FB8j8lxXGUQw`

---

### Task 
The password for the next level is stored in a file somewhere under the inhere directory and has all of the following properties:

human-readable
1033 bytes in size
not executable

---

### Solution

Đề bài bảo là file human-readable nên dùng lệnh `file` để check file trong các folder nhưng vẫn quá nhiều file nên dùng lệnh `grep` để lọc tìm các file chỉ chứa ASCII 

Hoặc dùng cách khác 
1033 bytes in size nên ta dùng lệnh `du` = **disk usage**
**-b là in ra số byte
-a là all các file**
```bash
bandit5@bandit:~/inhere$ du -b -a | grep 1033
1033    ./maybehere07/.file2
bandit5@bandit:~/inhere$ cat ./maybehere07/.file2
HWasnPhtq9AVKe0dmk45nxy20cvUa6EG
```
                                      
![image](https://hackmd.io/_uploads/HyJ2PwcBbx.png)


## Bandit Level 6 -> 7
### Login
SSH:`ssh bandit6@bandit.labs.overthewire.org -p 2220`

Password : `HWasnPhtq9AVKe0dmk45nxy20cvUa6EG`

---

### Task 

The password for the next level is stored somewhere on the server and has all of the following properties:

owned by user bandit7
owned by group bandit6
33 bytes in size

---

### Solution
Ta dùng lệnh find để giải quyết `chall` này
-`type f` vì ta đang tìm kiếm một file nó sẽ loại bỏ d = diretory 
-`user bandit7` để tìm các tệp thuộc sở hữu của người dùng 'bandit7'
-`group bandit6` để tìm các tập tin thuộc sở hữu của nhóm 'bandit6'
-`size 33c`, để tìm các file có kích thước 33 byte

```bash
bandit6@bandit:~$ find / -type f -user bandit7 -group bandit6 -size 33c 2>/dev/null
/var/lib/dpkg/info/bandit7.password
bandit6@bandit:~$ cat /var/lib/dpkg/info/bandit7.password
morbNTDkSW6jIlUc0ymOdMaLnOlFVAaj
```
## Bandit Level 7 -> 8
### Login
SSH:`ssh bandit7@bandit.labs.overthewire.org -p 2220`

Password : `morbNTDkSW6jIlUc0ymOdMaLnOlFVAaj`

---

### Task 
The password for the next level is stored in the file data.txt next to the word **millionth**



---

### Solution
Đề bài có nói passowrd nằm cạnh từ mollionth nên dùng lệnh `grep`
```bash
bandit7@bandit:~$ cat data.txt | grep 'millionth'
millionth       dfwvzFQi4mU0wfNbFOe9RoWskMLg7eEc
```
## Bandit Level 8 -> 9
### Login
SSH:`ssh bandit8@bandit.labs.overthewire.org -p 2220`

Password : `dfwvzFQi4mU0wfNbFOe9RoWskMLg7eEc`

---

### Task 
The password for the next level is stored in the file data.txt and is the only line of text that occurs only once

---

### Solution
Đề bài nói rằng password nằm trong file data.txt và là độc nhất  
Lệnh `uniq` dùng để lọc dữ liệu đầu vào và ghi vào dữ liệu đầu ra. Cụ thể, nó lọc dựa trên các dòng giống hệt nhau. Lệnh option `-u`, dùng để lọc các dòng duy nhất . Một chức năng khác là, nó cũng có thể đếm (-c) hoặc chỉ trả về các dòng trùng lặp (-d).
```bash
bandit8@bandit:~$ l
data.txt
bandit8@bandit:~$ sort data.txt | uniq -u
4CKMh1JI91bUIZZPXDqGanal4xvAg0JM
```

## Bandit Level 9 -> 10
### Login
SSH:`ssh bandit9@bandit.labs.overthewire.org -p 2220`

Password : `4CKMh1JI91bUIZZPXDqGanal4xvAg0JM`

---

### Task 
The password for the next level is stored in the file data.txt in one of the few human-readable strings, preceded by several ‘=’ characters.

---

### Solution
Đề bài nói password là chuỗi kí tự human-readable nên dùng lệnh
`strings`  

Trong Linux `strings` để trích xuất và hiển thị các chuỗi ký tự có thể in được (văn bản) từ các tệp nhị phân (executable files, object files)


```bash
bandit9@bandit:~$ file data.txt
data.txt: data
bandit9@bandit:~$ strings data.txt | grep '='
========== the
9=H`
[!#=Z
========== password
xWf=
f\Z'========== is
e=i{\#
/1=s
nS=F
M=Sl
=LGT
y =1
========== FGUW5ilLVJrxX9kMYMmlN4MgbpfMiqey
'+Y=+
```
## Bandit Level 10 -> 11
### Login
SSH:`ssh bandit10@bandit.labs.overthewire.org -p 2220`
Password : `FGUW5ilLVJrxX9kMYMmlN4MgbpfMiqey`

---

### Task 
The password for the next level is stored in the file data.txt, which contains base64 encoded data

---

### Solution
Dùng `base64 -d` để decode file mã hóa dạng base64

```bash
bandit10@bandit:~$ ls
data.txt
bandit10@bandit:~$ file data.txt
data.txt: ASCII text
bandit10@bandit:~$ cat data.txt | base64 -d
The password is dtR173fZKb0RRsDFSGsg2RWnpNVj3qRr
```

## Bandit Level 11 -> 12
### Login
SSH:`ssh bandit11@bandit.labs.overthewire.org -p 2220`

Password : `dtR173fZKb0RRsDFSGsg2RWnpNVj3qRr`

---

### Task 
The password for the next level is stored in the file data.txt, where all lowercase (a-z) and uppercase (A-Z) letters have been rotated by 13 positions

---

### Solution
Đây là chuỗi kí tự bị mã hóa bởi ROT13
Dùng tool **cyperchef** để giải hoặc cũng có thể dùng lệnh `tr` ( translate) `tr 'A-Za-z' 'N-ZA-Mn-za-m'`
```bash 
bandit11@bandit:~$ l
data.txt
bandit11@bandit:~$ cat data.txt
Gur cnffjbeq vf 7k16JArUVv5LxVuJfsSVdbbtaHGlw9D4
```
![image](https://hackmd.io/_uploads/S1_G5DiBZe.png)

## Bandit Level 12 -> 13
### Login
SSH:`ssh bandit12@bandit.labs.overthewire.org -p 2220`

Password : `7x16WNeHIi5YkIhWsfFIqoognUTyj9Q4`

---

### Task 
The password for the next level is stored in the file data.txt, which is a hexdump of a file that has been repeatedly compressed. For this level it may be useful to create a directory under /tmp in which you can work. Use mkdir with a hard to guess directory name. Or better, use the command “mktemp -d”. Then copy the datafile using cp, and rename it using mv (read the manpages!)

---

### Solution
Bài này thì xử lí đưa file vào tmp sau đó dùng `xxd -r` để đảo ngược lại file từ `hexdump` về `binary`
Sau đó giải nén file cho đến khi k giải nén được nữa

```
Cách giải nén từng loại file 

gunzip : gunzip -d tenfile

bzip2 :  bzip2 -d tenfile

tar :    tar -xvf tenfile 
```

check định dạng là gì trước sau đó mới đổi extention rồi giải nén

``` bash
bandit12@bandit:~$ mkdir /tmp/dat
bandit12@bandit:~$ cp data.txt /tmp/dat
bandit12@bandit:~$ cd /tmp/dat
```
```bash
bandit12@bandit:/tmp/dat$ cat data
The password is FO5dwFsc0cbaIiH0h8J2eUks2vdTDwAn
```
## Bandit Level 13 -> 14
### Login
SSH:`ssh bandit13@bandit.labs.overthewire.org -p 2220`

Password : `FO5dwFsc0cbaIiH0h8J2eUks2vdTDwAn`

---

### Task 
The password for the next level is stored in /etc/bandit_pass/bandit14 and can only be read by user bandit14. For this level, you don’t get the next password, but you get a private SSH key that can be used to log into the next level.

---

### Solution
Bài này password nằm ở lv14 mà đang ở lv13 không có quyền vào chỉ có mỗi sshkey vậy cần copy sshkey từ lv13 sang máy chính r dùng sshkey để vào lv14
```bash
bandit13@bandit:~$ ls
sshkey.private
bandit13@bandit:~$ ls -l
total 4
-rw-r----- 1 bandit14 bandit13 1679 Oct 14 09:26 sshkey.private
bandit13@bandit:~$ l
sshkey.private
bandit13@bandit:~$ logout
Connection to bandit.labs.overthewire.org closed.
```
Dùng lệnh `scp`

`-P 2220` là port của SSH 

`.` Là thư mục hiện tại
`scp -P 2220 bandit13@bandit.labs.overthewire.org:sshkey.private .`
## Bandit Level 14 -> 15
### Login
Ở lv này do login bằng key nên ta phải giảm quyền sử dụng xuống `chmod 700 sshkey.private` đẻ tránh lỗi `Permissions 0640 for 'sshkey.private' are too open.`
```
 nguyendat@NguyenHuuDat-HE210049-CTVBTTSK  ~  chmod 700 sshkey.private
 nguyendat@NguyenHuuDat-HE210049-CTVBTTSK  ~  ssh -i sshkey.private bandit14@bandit.labs.overthewire.org -p 222
```

SSH:`ssh -i sshkey.private bandit14@bandit.labs.overthewire.org -p 2220`

Password : `nothing`

---

### Task 
The password for the next level can be retrieved by submitting the password of the current level to port 30000 on localhost.

---

### Solution
Bài này ta cần tìm mật khẩu hiện tại đến port 30001 sau đó mới có được passoword lv tiếp theo

Mật khẩu hiện tại ta được lưu trong thư mục `/etc/bandit_pass/bandit14`
```bash
bandit14@bandit:~$ cat /etc/bandit_pass/bandit14
MU4VWeTyJk8ROof1qqmcBPaLh7lDCPvS
```
```bash
bandit14@bandit:~$ cat /etc/bandit_pass/bandit14
MU4VWeTyJk8ROof1qqmcBPaLh7lDCPvS
bandit14@bandit:~$ nc localhost 30000
MU4VWeTyJk8ROof1qqmcBPaLh7lDCPvS
Correct!
8xCjnmgoKbGLhHFAZlGE5Tmu4M2tKJQo

^C
bandit14@bandit:~$
```

## Bandit Level 15 -> 16
### Login
SSH:`ssh bandit15@bandit.labs.overthewire.org -p 2220`
Password : `8xCjnmgoKbGLhHFAZlGE5Tmu4M2tKJQo`

---

### Task 
The password for the next level can be retrieved by submitting the password of the current level to port 30001 on localhost using SSL/TLS encryption.

Helpful note: Getting “**DONE**”, “**RENEGOTIATING**” or “**KEYUPDATE**”? Read the “**CONNECTED COMMANDS**” section in the manpage.

---

### Solution
Lần này ta sẽ dùng lệnh `openssl s_client`, giống netcat nhưng cho phép ta sử dụng mã hoá SSL/TLS, kèm theo kiểm tra một số chứng chỉ kết nối
![image](https://hackmd.io/_uploads/HkH446jHWg.png)

## Bandit Level 16 -> 17
### Login
SSH:`ssh bandit16@bandit.labs.overthewire.org -p 2220`
Password : `kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx`

---

### Task 
The credentials for the next level can be retrieved by submitting the password of the current level to a port on localhost in the range 31000 to 32000. First find out which of these ports have a server listening on them. Then find out which of those speak SSL/TLS and which don’t. There is only 1 server that will give the next credentials, the others will simply send back to you whatever you send to it.

---

### Solution
Giống lv trước nhưng lần này ta cần tìm port từ 31000-32000
Có thể dùng nmap để tìm
![image](https://hackmd.io/_uploads/HJn0V6irZg.png)
Có 5 port đang mở  

Thấy port 31790 phản hồi do có TLS/SSL.

`openssl s_client -connect localhost:31790` vào nhưng k thấy password thay vào đó là một sshkey nên ta lấy sshkey để vào màn tiếp theo

## Bandit Level 17 -> 18
### Login
SSH:`ssh bandit17@bandit.labs.overthewire.org -p 2220`
Password : `nothing`

---

### Task 
There are 2 files in the homedirectory: passwords.old and passwords.new. The password for the next level is in passwords.new and is the only line that has been changed between passwords.old and passwords.new

---

### Solution
Cần tìm dòng độc nhất của 2 file
Ở đây ta dùng lện `diff` : so sánh 2 file , folder , giống khác nhau , trả những dòng thêm , xóa , sửa

![image](https://hackmd.io/_uploads/B1oKgAiBWl.png)

Ở trên là pass nhé anh em <(") gõ ngu pass new trước pass old
## Bandit Level 18 -> 19
### Login
SSH:`ssh bandit18@bandit.labs.overthewire.org -p 2220`
Password : `x2gLTTjFwMOhQ8oWNbMN362QKxfRqGlO`

---

### Task 
The password for the next level is stored in a file readme in the homedirectory. Unfortunately, someone has modified .bashrc to log you out when you log in with SSH.

---

### Solution
Ở bài này khi login bằng SSH sẽ bị đá ra và hiện dòng bye bye
Theo đề bài pwd ở trong 1 file readme .
Ta có thể thêm lệnh đọc file readme sau lệnh SSH.

![image](https://hackmd.io/_uploads/Hkh9MCorZl.png)


## Bandit Level 19 -> 20
### Login
SSH:`ssh bandit19@bandit.labs.overthewire.org -p 2220`
Password : `cGWpMaKXVwDUNgPAVJbWYuGHVn9zl3j8`

---

### Task 
To gain access to the next level, you should use the setuid binary in the homedirectory. Execute it without arguments to find out how to use it. The password for this level can be found in the usual place (/etc/bandit_pass), after you have used the setuid binary.

---

### Solution

thử check quyền thì thuộc group 20 nhưng bandit 19 vẫn có thẻ thực thi file vậy ta có thể lấy pass từ `/etc/bandit_pass`
![image](https://hackmd.io/_uploads/HyCpERsSWe.png)
Dùng `./bandit20-do  cat /etc/bandit_pass/bandit20`
![image](https://hackmd.io/_uploads/SyVcH0oBbl.png)



## Bandit Level 20 -> 21
### Login
SSH:`ssh bandit20@bandit.labs.overthewire.org -p 2220`
Password : `0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO`

---

### Task 
There is a setuid binary in the homedirectory that does the following: it makes a connection to localhost on the port you specify as a commandline argument. It then reads a line of text from the connection and compares it to the password in the previous level (bandit20). If the password is correct, it will transmit the password for the next level (bandit21).

NOTE: Try connecting to your own network daemon to see if it works as you think

---

### Solution
Ở lv này ta cần phải mở một port bất kỳ bằng `netcat`
ví dụ `nc -l -p 1234`
Hơi lằng nhằng bài này ta cần truyền tham số vào lệnh nc sau đó chạy file thực thi để lấy password
Cần mở thêm 1 tab ssh để có thể giao tiếp với nhau
![image](https://hackmd.io/_uploads/SJau6CoHWg.png)
![image](https://hackmd.io/_uploads/SkXt6CiBWg.png)




## Bandit Level 21 -> 22
### Login
SSH:`ssh bandit21@bandit.labs.overthewire.org -p 2220`
Password : `EeoULMCra2q0dSkYj561DX7s1CpBuOBt`

---

### Task 
A program is running automatically at regular intervals from cron, the time-based job scheduler. Look in /etc/cron.d/ for the configuration and see what command is being executed.

---

### Solution
lv này nói có 1 cron đang chạy và thử xem cfg trong /etc/cron.d/ xem có file nào thực thi
![image](https://hackmd.io/_uploads/rJzIy1nS-e.png)


## Bandit Level 22 -> 23
### Login
SSH:`ssh bandit22@bandit.labs.overthewire.org -p 2220`

Password : `tRae0UfB9v0UzbCdn9cY0gQnds9GF58Q`

---

### Task 
A program is running automatically at regular intervals from cron, the time-based job scheduler. Look in /etc/cron.d/ for the configuration and see what command is being executed.

NOTE: Looking at shell scripts written by other people is a very useful skill. The script for this level is intentionally made easy to read. If you are having problems understanding what it does, try executing it to see the debug information it prints.

---

### Solution
Vẫn như lv cũ xem trong /etc/cron.d/ cho gì

Ta sẽ cần phân tích file này
![image](https://hackmd.io/_uploads/S1dP-13BWl.png)
Lệnh "whoami"  đưa vào var  "myname", và sử dụng "myname" để chạy một lệnh có kết quả lưu tại "mytarget". 

Vì script crobjob chạy dưới quyền của bandit23 nên có thể suy luận myname ở đây = `bandit23` ( nhìn ở cột user)
![image](https://hackmd.io/_uploads/ByU6ek2r-l.png)

Tóm lại ở LV này ta chỉ cần tìm value của mytarget sau đó `cat` file tmp là ra

## Bandit Level 23 -> 24
### Login
SSH:`ssh bandit23@bandit.labs.overthewire.org -p 2220`

Password : `0Zf11ioIjMVN551jX3CmStKLYqjk54Ga`

---

### Task 
A program is running automatically at regular intervals from cron, the time-based job scheduler. Look in /etc/cron.d/ for the configuration and see what command is being executed.

NOTE: This level requires you to create your own first shell-script. This is a very big step and you should be proud of yourself when you beat this level!

NOTE 2: Keep in mind that your shell script is removed once executed, so you may want to keep a copy around…

---

### Solution
Vẫn như lv trên ta vào cron và thu được 1 script
``` bash
#!/bin/bash
shopt -s nullglob
myname=$(whoami)

cd /var/spool/"$myname"/foo || exit
echo "Executing and deleting all scripts in /var/spool/$myname/foo:"
for i in * .*;
do
    if [ "$i" != "." ] && [ "$i" != ".." ];
    then
        echo "Handling $i"
        owner="$(stat --format "%U" "./$i")"
        if [ "${owner}" = "bandit23" ] && [ -f "$i" ]; then
            timeout -s 9 60 "./$i"
        fi
        rm -rf "./$i"
    fi
done
```
Script này xoá hết tất cả các script nằm trong /var/spool/bandit24/foo trong 60s chỉ giữ lại file `.` và `..`

Cách xử lí bây giờ là cd vào `/var/spool/bandit24/foo` tạo một script copy pass của level tiếp theo vào 1 file trong /tmp,   và chờ nó được chạy tự động bởi user bandit24
![image](https://hackmd.io/_uploads/Bk7hty3SWg.png)
Chạy scipt đó xong đợi script cron tự xóa hết file rồi cat file tmp đã tạo ra để lấy password
![image](https://hackmd.io/_uploads/B1Ai9yhrWg.png)

```bash
#!/bin/bash'
cat /etc/bandit_pass/bandit24 > /tmp/bandit24_pass'
```
## Bandit Level 24 -> 25
### Login
SSH:`ssh bandit24@bandit.labs.overthewire.org -p 2220`
Password : `gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8`

---

### Task 


---

### Solution
## Bandit Level 25 -> 26
### Login
SSH:`ssh bandit2@bandit.labs.overthewire.org -p 2220`
Password : `263JGJPfgU6LtdEvgfWU1XP5yac29mFx`

---

### Task 


---

### Solution
## Bandit Level 26 -> 27
### Login
SSH:`ssh bandit2@bandit.labs.overthewire.org -p 2220`
Password : `263JGJPfgU6LtdEvgfWU1XP5yac29mFx`

---

### Task 


---

### Solution