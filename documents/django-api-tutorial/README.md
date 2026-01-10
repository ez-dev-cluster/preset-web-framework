# บทนำ: เตรียม Model สำหรับ Tutorial (Pre-requisite)

เพื่อให้ Tutorial ที่ 2 และ 3 ทำงานได้จริง เราจำเป็นต้องมี Model จำลองข้อมูลการจองโต๊ะ

**File:** `table_reserves/models.py`

```python
from django.db import models

class Reserve(models.Model):
    customer_name = models.CharField(max_length=100)
    pax = models.IntegerField(default=1) # จำนวนคน
    status = models.CharField(max_length=20, default='pending') # pending, confirmed, cancelled
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer_name} ({self.status})"
```

## _หลังจากสร้างเสร็จ อย่าลืม run: `python manage.py makemigrations` และ `python manage.py migrate`_
