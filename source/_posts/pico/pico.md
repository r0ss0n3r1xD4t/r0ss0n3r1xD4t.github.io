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