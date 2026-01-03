# Tutorial 1: API Flow 101

โฟกัส: ทำ API ง่าย ๆ ยังไม่มี business logic แต่ “เข้าใจ flow” ตั้งแต่ `core url → app url → view`

## 1) สอนความรู้ + ตัวอย่างโค้ด + Keywords

### 1.1 เช็ค dependency (DRF) และ app registration

**ไฟล์:** `preset-web-framework/core/settings.py`

ตรวจให้มี:

```python
INSTALLED_APPS = [
    # ...
    "rest_framework",
    "table_reserves",
]
```

> ถ้าโปรเจกต์ preset มี `rest_framework` อยู่แล้ว ข้ามได้ (แต่ `table_reserves` ต้องมี)

---

### 1.2 Wire routing: core → table_reserves

**ไฟล์:** `preset-web-framework/core/urls.py`

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # API gateway ของโปรเจกต์
    path("api/", include("table_reserves.urls")),
]
```

ภาพรวม flow:

- Request เข้า `/api/...`
- Django ส่งต่อไป `table_reserves/urls.py`
- แล้วค่อย map ไป `APIView` ใน `table_reserves/views.py`

---

### 1.3 สร้าง url ของแอป table_reserves

**ไฟล์:** `preset-web-framework/table_reserves/urls.py`

```python
from django.urls import path
from .views import PingAPIView, HealthAPIView

urlpatterns = [
    path("ping/", PingAPIView.as_view(), name="table-reserves-ping"),
    path("health/", HealthAPIView.as_view(), name="table-reserves-health"),
]
```

---

### 1.4 สร้าง APIView แบบ no-auth/no-permission

**ไฟล์:** `preset-web-framework/table_reserves/views.py`

```python
from rest_framework.views import APIView
from rest_framework.response import Response

class PingAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({
            "ok": True,
            "message": "pong",
            "service": "table_reserves"
        })


class HealthAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({
            "status": "UP",
            "dependencies": {
                "db": "UNKNOWN"  # ตอนนี้ยังไม่เช็คจริง
            }
        })
```

---

### 1.5 ทดลองเรียก API (test happy path)

- `GET /api/ping/`
  ผลลัพธ์คาดหวัง (ตัวอย่าง):

```json
{
  "ok": true,
  "message": "pong",
  "service": "table_reserves"
}
```

- `GET /api/health/`
  ผลลัพธ์คาดหวัง:

```json
{
  "status": "UP",
  "dependencies": { "db": "UNKNOWN" }
}
```

---

### Keywords สรุป (Tutorial 1)

- `core/urls.py` = **API gateway / router ชั้นแรก**
- `include("table_reserves.urls")` = **ส่งต่อ routing เป็นโมดูล**
- `APIView.as_view()` = **แปลง class เป็น callable view**
- `authentication_classes = []` และ `permission_classes = []` = **ปิด auth/perm แบบ explicit**
- `Response({...})` = **คืน JSON response (DRF)**

---

## 2) โจทย์ (3–5 ข้อ) พร้อม requirement / input / output / testcase

### โจทย์ 1 (ง่าย): Endpoint “about”

**ต้องการ:** ทีม mobile อยากรู้ version ของ service เพื่อ debug
**API:** `GET /api/about/`
**Input:** ไม่มี
**Output:** JSON ต้องมี `service`, `version`, `environment`
**Testcase:**

- เรียก `/api/about/` ต้องได้ HTTP 200
- JSON ต้องมี key ครบ

---

### โจทย์ 2 (ง่าย-กลาง): Echo path param

**ต้องการ:** QA อยากเช็คว่า path param ส่งถึง view จริง
**API:** `GET /api/echo/<str:text>/` เช่น `/api/echo/hello/`
**Input:** path param `text`
**Output:** JSON `{ "echo": "<text>" }`
**Testcase:**

- `/api/echo/hello/` → `{"echo":"hello"}`
- `/api/echo/123/` → `{"echo":"123"}`

---

### โจทย์ 3 (กลาง): Query param “lang”

**ต้องการ:** Frontend อยากสลับภาษาแบบเบสิค
**API:** `GET /api/ping/?lang=th`
**Input:** query param `lang` ∈ {`th`,`en`}
**Output:** ถ้า `th` ให้ message เป็น `"ปิงแล้วนะ"` ถ้า `en` เป็น `"pong"`
**Testcase:**

- `/api/ping/?lang=th` → message ภาษาไทย
- `/api/ping/?lang=en` → message ภาษาอังกฤษ
- ไม่ส่ง lang → default อังกฤษ

---

### โจทย์ 4 (ยากขึ้น): Standard error contract

**ต้องการ:** ทุก endpoint ต้องคืน error shape เดียวกัน
**Requirement:** ถ้า input ไม่ถูกต้อง ให้คืน

```json
{ "ok": false, "error": { "code": "BAD_REQUEST", "message": "..." } }
```

**Testcase:**

- `/api/ping/?lang=jp` ต้องได้ HTTP 400 + shape ตามสัญญา

---

## 3) เฉลย (กดดูได้)

<details>
<summary><b>เฉลย Tutorial 1</b></summary>

### เพิ่ม routes

**ไฟล์:** `preset-web-framework/table_reserves/urls.py`

```python
from django.urls import path
from .views import PingAPIView, HealthAPIView, AboutAPIView, EchoAPIView

urlpatterns = [
    path("ping/", PingAPIView.as_view(), name="table-reserves-ping"),
    path("health/", HealthAPIView.as_view(), name="table-reserves-health"),
    path("about/", AboutAPIView.as_view(), name="table-reserves-about"),
    path("echo/<str:text>/", EchoAPIView.as_view(), name="table-reserves-echo"),
]
```

### เพิ่ม views

**ไฟล์:** `preset-web-framework/table_reserves/views.py`

```python
from rest_framework.views import APIView
from rest_framework.response import Response

def bad_request(message: str):
    return Response({
        "ok": False,
        "error": {"code": "BAD_REQUEST", "message": message}
    }, status=400)

class AboutAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({
            "service": "table_reserves",
            "version": "0.1.0",
            "environment": "local"
        })

class EchoAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, text: str):
        return Response({"echo": text})

class PingAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        lang = request.query_params.get("lang", "en")
        if lang not in ("th", "en"):
            return bad_request("lang must be 'th' or 'en'")

        message = "ปิงแล้วนะ" if lang == "th" else "pong"
        return Response({"ok": True, "message": message, "service": "table_reserves"})
```

</details>
