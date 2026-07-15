
---
title: "Powershell obfuscation"
date: 2026-07-15T00:00:00+00:00
categories:
  - Tech
toc: true
---
![image](https://hackmd.io/_uploads/Skl8brH4Gx.png)

# Giới thiệu

Trong thời đại mà các cuộc tấn công không sử dụng tệp (fileless attacks) ngày càng gia tăng, việc sử dụng các ứng dụng hợp pháp như PowerShell để thực thi mã độc đã trở thành một chiến thuật phổ biến của kẻ tấn công. Để đối phó với những thách thức này, công cụ Invoke-Obfuscation ra đời, hỗ trợ các nhóm redteam các lệnh PowerShell bị làm rối, từ đó nâng cao khả năng phát hiện và phản ứng trước các mối đe dọa.

Các cuộc tấn công không sử dụng tệp hoạt động bằng cách thực thi mã độc trực tiếp trong bộ nhớ hệ thống mà không lưu lại bất kỳ tệp nào trên ổ đĩa. Điều này giúp chúng vượt qua các phần mềm anti-virus. PowerShell, với khả năng mạnh mẽ và tính phổ biến, thường trở thành công cụ được lựa chọn để thực hiện những cuộc tấn công này. Một đặc điểm đáng chú ý của các cuộc tấn công này là khó bị phát hiện, ngay cả khi hệ thống đã được bật ghi nhật ký. Kẻ tấn công sử dụng các kỹ thuật làm rối (obfuscation) để che giấu mã độc và payload, khiến việc phân tích trở nên phức tạp.

# Công cụ Invoke-Obfuscation

Invoke-Obfuscation là một công cụ mã nguồn mở, được thiết kế bởi Daniel Bohannon, nhằm hỗ trợ các chuyên gia bảo mật mô phỏng kỹ thuật làm rối của kẻ tấn công. Công cụ này cho phép:

Làm Rối Lệnh PowerShell: Che giấu các chuỗi lệnh bằng cách sử dụng các kỹ thuật phức tạp như mã hóa, thay thế, hoặc phân đoạn mã.
Thử nghiệm khả năng phát hiện của các hệ thống hiện có đối với lệnh obfuscated.
Nâng Cao Khả Năng Phát Hiện: Hỗ trợ các nhóm blueteam xây dựng rule phát hiện và cải thiện chiến lược phòng thủ.
Cách Sử Dụng Invoke-Obfuscation

Repo: https://github.com/danielbohannon/Invoke-Obfuscation

Nhập Mô-đun:

`Import-Module .\Invoke-Obfuscation.psd1`
Bắt Đầu obfuscate:

`Invoke-Obfuscation`
Sau đó, ta có thể chọn các tùy chọn làm rối lệnh PowerShell từ giao diện.
![image](https://hackmd.io/_uploads/rkxnbBS4Gx.png)
