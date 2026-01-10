# Tutorial 1: The API Flow (เข้าใจการไหลของข้อมูล)

**Goal:** สร้าง API ง่ายๆ ที่ตอบกลับเป็น Static JSON เพื่อให้เข้าใจว่า Request วิ่งจาก Core URL -> App URL -> View ได้อย่างไร

### 1. ความรู้และตัวอย่างโค้ด

**Concept:**
Django รับ Request เข้ามา จะดูที่ `core/urls.py` ก่อน เพื่อหา path หลัก จากนั้นส่งต่อไปยัง `table_reserves/urls.py` ซึ่งจะระบุว่า path นี้ต้องไปทำงานที่ function ไหนใน `views.py`

**Step 1: เขียน Logic ที่ View**
**File:** `table_reserves/views.py`

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class HelloWorldAPI(APIView):
    # APIView จะ mapping method get, post, put, delete ให้เรา override ได้เลย
    def get(self, request):
        data = {
            "message": "Welcome to Table Reserve API",
            "version": 1.0
        }
        return Response(data, status=status.HTTP_200_OK)
```

**Step 2: สร้าง URL ของ App**
**File:** `table_reserves/urls.py` (สร้างไฟล์นี้ใหม่ถ้ายังไม่มี)

```python
from django.urls import path
from .views import HelloWorldAPI

urlpatterns = [
    # path('route-name/', ViewClass.as_view())
    path('hello/', HelloWorldAPI.as_view()),
]
```

**Step 3: เชื่อม URL เข้ากับ Core Project**
**File:** `core/urls.py` (หรือ folder ชื่อโปรเจคหลัก)

```python
from django.contrib import admin
from django.urls import path, include # อย่าลืม import include

urlpatterns = [
    path('admin/', admin.site.urls),
    # บอกว่าถ้าเจอคำว่า api/reserves/ ให้ไปดูต่อที่ table_reserves.urls
    path('api/reserves/', include('table_reserves.urls')),
]
```

**Result:**
เมื่อเข้า Browser หรือ Postman ไปที่ `http://localhost:8000/api/reserves/hello/` จะได้ JSON response

**Keyword สรุป:**

- **`APIView`**: Class พื้นฐานของ DRF สำหรับสร้าง API
- **`Response`**: Object สำหรับส่งข้อมูลกลับไปหา User (แปลง Dict เป็น JSON อัตโนมัติ)
- **`include`**: คำสั่งเชื่อม URL จาก Project หลักไปยัง App ย่อย

---

### 2. โจทย์แบบฝึกหัด (Tutorial 1)

#### ข้อ 1 (ง่าย): My Info API

- **Requirement:** สร้าง API path `/my-info/` แสดงชื่อและตำแหน่งงานของคุณ
- **Input:** None (Method GET)
- **Output:** `{"name": "Dev Name", "role": "Backend Developer"}`

#### ข้อ 2 (ปานกลาง): Calculator API (Static)

- **Requirement:** จำลอง API คำนวณเลข (Hardcode ไปก่อน)
- **Input:** None (Method GET)
- **Output:** `{"a": 10, "b": 5, "sum": 15, "multiply": 50}`

#### ข้อ 3 (ท้าทาย): List of Menu

- **Requirement:** สร้าง API ที่ return รายชื่อเมนูอาหารเป็น List ภายใน Dictionary
- **Input:** None
- **Output:** `{"count": 2, "menus": ["Fried Rice", "Tom Yum Kung"]}`

---

### 3. เฉลย (Click to expand)

<details>
<summary><b>คลิกเพื่อดูเฉลย Tutorial 1</b></summary>

**File:** `table_reserves/views.py`

```python
class MyInfoAPI(APIView):
    def get(self, request):
        return Response({"name": "Your Name", "role": "Backend Dev"})

class CalcAPI(APIView):
    def get(self, request):
        a = 10
        b = 5
        return Response({"a": a, "b": b, "sum": a+b, "multiply": a*b})

class MenuAPI(APIView):
    def get(self, request):
        menus = ["Fried Rice", "Tom Yum Kung"]
        return Response({"count": len(menus), "menus": menus})
```

**File:** `table_reserves/urls.py`

```python
from .views import HelloWorldAPI, MyInfoAPI, CalcAPI, MenuAPI

urlpatterns = [
    path('hello/', HelloWorldAPI.as_view()),
    path('my-info/', MyInfoAPI.as_view()),
    path('calc/', CalcAPI.as_view()),
    path('menus/', MenuAPI.as_view()),
]
```

</details>
