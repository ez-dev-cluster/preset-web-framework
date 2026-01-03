หากไม่สามารถใช้ AGY Command ได้ ต้องการให้ช่วย


ทดสอบว่ามี antigravity อยู่หรือไม่
```cmd
Get-Command antigravity
```

ถ้าไม่มี ต้องการให้ช่วยสร้าง agy.cmd เป็น shortcut ของ antigravity
```cmd
$bin = Split-Path -Parent (Get-Command antigravity).Source
Copy-Item "$bin\antigravity.cmd" "$bin\agy.cmd" -Force
```

ทดสอบว่าสามารถใช้ agy ได้หรือไม่
```cmd
agy --help
agy .
```