# Tutorial 3: POST Body + Create/Update

โฟกัส: ส่งข้อมูลผ่าน `request.data` (method POST) + โจทย์สร้าง/แก้ไขข้อมูลแบบเห็นผล “DB เปลี่ยนจริง”

## 1) สอนความรู้ + ตัวอย่างโค้ด + Keywords

### 3.1 วาง API endpoints สำหรับ create/edit/cancel (ใช้ POST ตามโจทย์)

**ไฟล์:** `preset-web-framework/table_reserves/urls.py`

```python
from django.urls import path
from .views import ReserveCreateAPIView, ReserveEditAPIView, ReserveCancelAPIView

urlpatterns = [
    path("reserves/", ReserveCreateAPIView.as_view(), name="reserve-create"),  # POST create
    path("reserves/<int:reserve_id>/edit/", ReserveEditAPIView.as_view(), name="reserve-edit"),  # POST update
    path("reserves/<int:reserve_id>/cancel/", ReserveCancelAPIView.as_view(), name="reserve-cancel"),  # POST cancel
]
```

> เชิงมาตรฐาน REST ปกติ update จะใช้ PUT/PATCH แต่ใน tutorial นี้เราทำ POST ให้ตรง requirement ก่อน (ลูกค้าขอ เราก็ส่งมอบ 😄)

---

### 3.2 เขียน create/edit ด้วย APIView (no-auth/no-perm)

**ไฟล์:** `preset-web-framework/table_reserves/views.py`

```python
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response

from .models import TableReserve


def reserve_to_dict(r: TableReserve) -> dict:
    return {
        "id": r.id,
        "customer_name": r.customer_name,
        "customer_phone": r.customer_phone,
        "table_no": r.table_no,
        "guests": r.guests,
        "reserved_at": r.reserved_at.isoformat(),
        "status": r.status,
        "note": r.note,
        "created_at": r.created_at.isoformat(),
        "updated_at": r.updated_at.isoformat(),
    }


def require_fields(data: dict, fields: list[str]) -> list[str]:
    missing = []
    for f in fields:
        if data.get(f) in (None, "", []):
            missing.append(f)
    return missing


class ReserveCreateAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        """
        POST /api/reserves/
        Body (JSON):
          customer_name*, customer_phone*, table_no*, reserved_at* (ISO8601)
          guests, note
        """
        data = request.data if isinstance(request.data, dict) else {}
        missing = require_fields(data, ["customer_name", "customer_phone", "table_no", "reserved_at"])
        if missing:
            return Response({"detail": f"missing fields: {', '.join(missing)}"}, status=400)

        # validate table_no
        try:
            table_no = int(data["table_no"])
            if table_no <= 0:
                raise ValueError
        except Exception:
            return Response({"detail": "table_no must be positive int"}, status=400)

        # validate guests
        guests = data.get("guests", 2)
        try:
            guests = int(guests)
            if guests <= 0:
                raise ValueError
        except Exception:
            return Response({"detail": "guests must be positive int"}, status=400)

        # validate reserved_at
        reserved_at = parse_datetime(str(data["reserved_at"]))
        if not reserved_at:
            return Response({"detail": "reserved_at must be ISO8601 datetime"}, status=400)

        # ถ้าไม่มี timezone ให้ assume เป็น timezone ปัจจุบันของโปรเจกต์
        if timezone.is_naive(reserved_at):
            reserved_at = timezone.make_aware(reserved_at, timezone.get_current_timezone())

        reserve = TableReserve.objects.create(
            customer_name=str(data["customer_name"]).strip(),
            customer_phone=str(data["customer_phone"]).strip(),
            table_no=table_no,
            guests=guests,
            reserved_at=reserved_at,
            note=str(data.get("note", "")).strip(),
            status=TableReserve.STATUS_PENDING,
        )

        return Response(reserve_to_dict(reserve), status=201)


class ReserveEditAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, reserve_id: int):
        """
        POST /api/reserves/<id>/edit/
        Body: ส่งเฉพาะ field ที่อยากแก้ (partial update)
        """
        reserve = get_object_or_404(TableReserve, pk=reserve_id)
        data = request.data if isinstance(request.data, dict) else {}

        if "customer_name" in data:
            reserve.customer_name = str(data["customer_name"]).strip()

        if "customer_phone" in data:
            reserve.customer_phone = str(data["customer_phone"]).strip()

        if "table_no" in data:
            try:
                t = int(data["table_no"])
                if t <= 0:
                    raise ValueError
                reserve.table_no = t
            except Exception:
                return Response({"detail": "table_no must be positive int"}, status=400)

        if "guests" in data:
            try:
                g = int(data["guests"])
                if g <= 0:
                    raise ValueError
                reserve.guests = g
            except Exception:
                return Response({"detail": "guests must be positive int"}, status=400)

        if "reserved_at" in data:
            dt = parse_datetime(str(data["reserved_at"]))
            if not dt:
                return Response({"detail": "reserved_at must be ISO8601 datetime"}, status=400)
            if timezone.is_naive(dt):
                dt = timezone.make_aware(dt, timezone.get_current_timezone())
            reserve.reserved_at = dt

        if "note" in data:
            reserve.note = str(data["note"]).strip()

        if "status" in data:
            st = str(data["status"]).strip()
            allowed = {TableReserve.STATUS_PENDING, TableReserve.STATUS_CONFIRMED, TableReserve.STATUS_CANCELLED}
            if st not in allowed:
                return Response({"detail": f"status must be one of {sorted(allowed)}"}, status=400)
            reserve.status = st

        reserve.save()
        return Response(reserve_to_dict(reserve), status=200)


class ReserveCancelAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, reserve_id: int):
        """
        POST /api/reserves/<id>/cancel/
        """
        reserve = get_object_or_404(TableReserve, pk=reserve_id)
        reserve.status = TableReserve.STATUS_CANCELLED
        reserve.save()
        return Response(reserve_to_dict(reserve), status=200)
```

---

### 3.3 ตัวอย่าง request/response ที่ “DB เปลี่ยนจริง”

#### Create

**Request**

- `POST /api/reserves/`

```json
{
  "customer_name": "Nina",
  "customer_phone": "0899999999",
  "table_no": 7,
  "guests": 3,
  "reserved_at": "2026-01-10T18:30:00+07:00",
  "note": "ริมหน้าต่าง"
}
```

**Response (201)**

```json
{
  "id": 1,
  "customer_name": "Nina",
  "customer_phone": "0899999999",
  "table_no": 7,
  "guests": 3,
  "reserved_at": "2026-01-10T18:30:00+07:00",
  "status": "PENDING",
  "note": "ริมหน้าต่าง",
  "created_at": "...",
  "updated_at": "..."
}
```

#### Edit

- `POST /api/reserves/1/edit/`

```json
{ "status": "CONFIRMED" }
```

DB เปลี่ยน: record id=1 status กลายเป็น CONFIRMED

---

### Keywords สรุป (Tutorial 3)

- `request.data` = **body JSON**
- `parse_datetime()` = **parse ISO8601**
- `timezone.make_aware()` = **กัน timezone bug แบบไม่สร้าง incident**
- `POST create` + `POST edit` = **ทำตาม contract ที่ consumer ขอ (แม้ไม่ REST เป๊ะ)**

---

## 2) โจทย์ (3–5 ข้อ) พร้อม requirement / input / output / testcase

### โจทย์ 1 (ง่าย): Confirm endpoint

**ต้องการ:** แคชเชียร์อยากกด “ยืนยันการจอง”
**API:** `POST /api/reserves/<id>/confirm/`
**Input:** ไม่มี body ก็ได้
**Output:** คืน reservation หลังแก้ `status=CONFIRMED`
**Testcase:**

- id มีอยู่ → 200 และ status=CONFIRMED
- id ไม่เจอ → 404

---

### โจทย์ 2 (กลาง): กัน double booking

**ต้องการ:** ระบบต้องกันการจองโต๊ะเดียวกันเวลาเดียวกัน (table_no + reserved_at)
**API:** `POST /api/reserves/`
**Requirement:** ถ้ามี record เดิมที่ `table_no` และ `reserved_at` เท่ากัน และ status ไม่ใช่ CANCELLED → ต้อง reject
**Output:** 409 Conflict พร้อม message ชัด
**Testcase:**

- จองซ้ำ → 409
- ถ้า record เดิม CANCELLED แล้ว → สร้างใหม่ได้ 201

---

### โจทย์ 3 (กลาง-ยาก): Bulk create

**ต้องการ:** ฝ่ายจัดอีเวนต์อยาก import หลายรายการในครั้งเดียว
**API:** `POST /api/reserves/bulk_create/`
**Input:** body เป็น list ของ reservation objects
**Output:** สร้างสำเร็จบางส่วนได้ (partial success) โดย response ต้องมี `created` และ `errors`
**Testcase:**

- 3 รายการ: 2 valid, 1 invalid → created=2, errors=1

---

### โจทย์ 4 (ยาก): Edit ต้องคืน “diff”

**ต้องการ:** Frontend อยากแสดง “แก้อะไรไปบ้าง” หลังแก้ไข
**API:** `POST /api/reserves/<id>/edit/`
**Output:**

```json
{
  "before": {...},
  "after": {...},
  "changed_fields": ["status","note"]
}
```

**Testcase:**

- ส่ง body ที่ไม่เปลี่ยนค่าอะไรเลย → changed_fields เป็น []

---

## 3) เฉลย (กดดูได้)

<details>
<summary><b>เฉลย Tutorial 3</b></summary>

### 1) confirm endpoint

**ไฟล์:** `preset-web-framework/table_reserves/urls.py`

```python
from django.urls import path
from .views import ReserveConfirmAPIView

urlpatterns = [
    path("reserves/<int:reserve_id>/confirm/", ReserveConfirmAPIView.as_view(), name="reserve-confirm"),
]
```

**ไฟล์:** `preset-web-framework/table_reserves/views.py`

```python
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import TableReserve
from .views import reserve_to_dict  # ถ้าอยู่ไฟล์เดียวกันไม่ต้อง import

class ReserveConfirmAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, reserve_id: int):
        r = get_object_or_404(TableReserve, pk=reserve_id)
        r.status = TableReserve.STATUS_CONFIRMED
        r.save()
        return Response(reserve_to_dict(r), status=200)
```

---

### 2) กัน double booking (ใน ReserveCreateAPIView)

**ไฟล์:** `preset-web-framework/table_reserves/views.py` (เพิ่มก่อน create)

```python
conflict = TableReserve.objects.filter(
    table_no=table_no,
    reserved_at=reserved_at,
).exclude(status=TableReserve.STATUS_CANCELLED).exists()

if conflict:
    return Response({"detail": "double booking: table is already reserved at that time"}, status=409)
```

---

### 4) edit diff

**ไฟล์:** `preset-web-framework/table_reserves/views.py` (แนวคิดเพิ่มใน ReserveEditAPIView)

```python
before = reserve_to_dict(reserve)

# ... ทำการแก้ field ตามเดิม ...

reserve.save()
after = reserve_to_dict(reserve)

changed_fields = [k for k in after.keys() if before.get(k) != after.get(k)]
return Response({"before": before, "after": after, "changed_fields": changed_fields}, status=200)
```

</details>
