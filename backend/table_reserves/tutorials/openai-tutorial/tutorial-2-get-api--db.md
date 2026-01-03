# Tutorial 2: GET API + DB

โฟกัส: ทำ **GET API** ที่ใช้ **path params + query params** และ **ดึงข้อมูลจาก database** + “เล่นกับข้อมูล” (filter/sort/meta)

## 1) สอนความรู้ + ตัวอย่างโค้ด + Keywords

### 2.1 สร้าง Model สำหรับการจองโต๊ะ

**ไฟล์:** `preset-web-framework/table_reserves/models.py`

```python
from django.db import models

class TableReserve(models.Model):
    STATUS_PENDING = "PENDING"
    STATUS_CONFIRMED = "CONFIRMED"
    STATUS_CANCELLED = "CANCELLED"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_CONFIRMED, "Confirmed"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=30)
    table_no = models.PositiveIntegerField()
    guests = models.PositiveIntegerField(default=2)
    reserved_at = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    note = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"#{self.id} {self.customer_name} (T{self.table_no})"
```

จากนั้น migrate:

```bash
python manage.py makemigrations
python manage.py migrate
```

---

### 2.2 สร้าง GET endpoints: list + detail

**ไฟล์:** `preset-web-framework/table_reserves/urls.py`

```python
from django.urls import path
from .views import ReserveListAPIView, ReserveDetailAPIView

urlpatterns = [
    path("reserves/", ReserveListAPIView.as_view(), name="reserve-list"),
    path("reserves/<int:reserve_id>/", ReserveDetailAPIView.as_view(), name="reserve-detail"),
]
```

---

### 2.3 เขียน view: list (query params) + detail (path param)

**ไฟล์:** `preset-web-framework/table_reserves/views.py`

```python
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
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


class ReserveListAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        """
        GET /api/reserves/?status=&date=&q=&table_no=&limit=&offset=
        """
        qs = TableReserve.objects.all().order_by("-reserved_at")

        # query params
        status = request.query_params.get("status")
        date_str = request.query_params.get("date")      # YYYY-MM-DD
        q = request.query_params.get("q")                # search
        table_no = request.query_params.get("table_no")
        limit = request.query_params.get("limit", "20")
        offset = request.query_params.get("offset", "0")

        if status:
            qs = qs.filter(status=status)

        if date_str:
            d = parse_date(date_str)
            if not d:
                return Response({"detail": "date must be YYYY-MM-DD"}, status=400)
            qs = qs.filter(reserved_at__date=d)

        if table_no:
            try:
                table_no_int = int(table_no)
            except ValueError:
                return Response({"detail": "table_no must be int"}, status=400)
            qs = qs.filter(table_no=table_no_int)

        if q:
            qs = qs.filter(
                Q(customer_name__icontains=q) |
                Q(customer_phone__icontains=q) |
                Q(note__icontains=q)
            )

        # เล่นกับข้อมูล: meta summary ก่อน paginate
        total = qs.count()
        breakdown = list(
            qs.values("status").annotate(count=Count("id")).order_by("status")
        )

        # paginate แบบเบสิค
        try:
            limit_int = max(1, min(100, int(limit)))
            offset_int = max(0, int(offset))
        except ValueError:
            return Response({"detail": "limit/offset must be int"}, status=400)

        page_qs = qs[offset_int: offset_int + limit_int]
        items = [reserve_to_dict(r) for r in page_qs]

        return Response({
            "meta": {
                "total": total,
                "limit": limit_int,
                "offset": offset_int,
                "returned": len(items),
                "status_breakdown": breakdown,
                "server_time": timezone.now().isoformat(),
            },
            "items": items
        })


class ReserveDetailAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, reserve_id: int):
        """
        GET /api/reserves/<reserve_id>/
        """
        r = get_object_or_404(TableReserve, pk=reserve_id)
        return Response(reserve_to_dict(r))
```

---

### 2.4 ตัวอย่างการเรียกใช้งาน

1. list ทั้งหมด:

- `GET /api/reserves/`

2. filter:

- `GET /api/reserves/?status=CONFIRMED&date=2026-01-03&limit=10&offset=0`

3. search:

- `GET /api/reserves/?q=089`

4. detail:

- `GET /api/reserves/12/`

---

### Keywords สรุป (Tutorial 2)

- `request.query_params` = **อ่าน query params แบบ DRF**
- `path(".../<int:reserve_id>/")` = **path param**
- ORM `filter()`, `Q()` = **search/filter**
- `values().annotate(Count())` = **ทำ summary**
- `get_object_or_404()` = **404 แบบโปร**

---

## 2) โจทย์ (3–5 ข้อ) พร้อม requirement / input / output / testcase

### โจทย์ 1 (ง่าย): เพิ่ม filter `guests_min`

**ต้องการ:** ฝ่ายหน้าร้านอยากดูเฉพาะจองที่มีจำนวนคนตั้งแต่ X ขึ้นไป
**API:** `GET /api/reserves/?guests_min=4`
**Input:** query `guests_min` เป็น int
**Output:** items ที่ `guests >= guests_min`
**Testcase:**

- guests_min=4 ต้องไม่คืน record guests=2
- guests_min=abc ต้องได้ 400

---

### โจทย์ 2 (กลาง): เพิ่ม sorting

**ต้องการ:** Dashboard อยาก sort ได้ 2 แบบ
**API:** `GET /api/reserves/?sort=reserved_at` หรือ `sort=-reserved_at`
**Input:** query `sort` ∈ {`reserved_at`, `-reserved_at`}
**Output:** ลำดับข้อมูลถูกต้อง
**Testcase:**

- sort=reserved_at ต้องเรียงเก่า→ใหม่
- sort=-reserved_at ต้องเรียงใหม่→เก่า
- sort=customer_name ต้อง 400 (กันมั่ว)

---

### โจทย์ 3 (กลาง-ยาก): ทำ endpoint summary รายวัน

**ต้องการ:** ผู้จัดการอยากเห็นจำนวนจองแยกตาม status ในวันเดียว
**API:** `GET /api/reserves/summary/?date=2026-01-03`
**Input:** date (YYYY-MM-DD)
**Output:** JSON เช่น

```json
{
  "date": "2026-01-03",
  "summary": [
    {"status":"CONFIRMED","count":10},
    {"status":"PENDING","count":4}
  ]
}
```

**Testcase:**

- date invalid → 400
- date ถูกต้องแต่ไม่มีข้อมูล → summary เป็น [] หรือ count=0 (กำหนดให้ชัด)

---

### โจทย์ 4 (ยาก): filter ช่วงเวลา (from/to)

**ต้องการ:** ทีม data อยาก export จองในช่วงเวลา
**API:** `GET /api/reserves/?from=2026-01-03&to=2026-01-10`
**Input:** `from`, `to` เป็น date
**Output:** ข้อมูล reserved_at\_\_date อยู่ในช่วง (รวมปลายทั้งสอง)
**Testcase:**

- from > to ต้อง 400
- from/to invalid ต้อง 400

---

## 3) เฉลย (กดดูได้)

<details>
<summary><b>เฉลย Tutorial 2</b></summary>

### เพิ่ม endpoint summary + เพิ่ม guests_min + sort + from/to

**ไฟล์:** `preset-web-framework/table_reserves/urls.py`

```python
from django.urls import path
from .views import ReserveListAPIView, ReserveDetailAPIView, ReserveSummaryAPIView

urlpatterns = [
    path("reserves/", ReserveListAPIView.as_view(), name="reserve-list"),
    path("reserves/summary/", ReserveSummaryAPIView.as_view(), name="reserve-summary"),
    path("reserves/<int:reserve_id>/", ReserveDetailAPIView.as_view(), name="reserve-detail"),
]
```

**ไฟล์:** `preset-web-framework/table_reserves/views.py` (เฉพาะส่วนเพิ่มใน ReserveListAPIView + class ใหม่)

```python
from django.db.models import Q, Count
from django.utils.dateparse import parse_date
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import TableReserve

class ReserveListAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        qs = TableReserve.objects.all()

        status = request.query_params.get("status")
        date_str = request.query_params.get("date")
        q = request.query_params.get("q")
        table_no = request.query_params.get("table_no")
        guests_min = request.query_params.get("guests_min")
        sort = request.query_params.get("sort", "-reserved_at")
        from_str = request.query_params.get("from")
        to_str = request.query_params.get("to")

        if status:
            qs = qs.filter(status=status)

        if date_str:
            d = parse_date(date_str)
            if not d:
                return Response({"detail": "date must be YYYY-MM-DD"}, status=400)
            qs = qs.filter(reserved_at__date=d)

        if from_str or to_str:
            d_from = parse_date(from_str) if from_str else None
            d_to = parse_date(to_str) if to_str else None
            if from_str and not d_from:
                return Response({"detail": "from must be YYYY-MM-DD"}, status=400)
            if to_str and not d_to:
                return Response({"detail": "to must be YYYY-MM-DD"}, status=400)
            if d_from and d_to and d_from > d_to:
                return Response({"detail": "from must be <= to"}, status=400)

            if d_from:
                qs = qs.filter(reserved_at__date__gte=d_from)
            if d_to:
                qs = qs.filter(reserved_at__date__lte=d_to)

        if table_no:
            try:
                qs = qs.filter(table_no=int(table_no))
            except ValueError:
                return Response({"detail": "table_no must be int"}, status=400)

        if guests_min:
            try:
                qs = qs.filter(guests__gte=int(guests_min))
            except ValueError:
                return Response({"detail": "guests_min must be int"}, status=400)

        if q:
            qs = qs.filter(
                Q(customer_name__icontains=q) |
                Q(customer_phone__icontains=q) |
                Q(note__icontains=q)
            )

        if sort not in ("reserved_at", "-reserved_at"):
            return Response({"detail": "sort must be reserved_at or -reserved_at"}, status=400)
        qs = qs.order_by(sort)

        # ... (คง pagination + meta ตามของเดิมได้เลย)
        # เพื่อให้สั้น: สมมติ reuse โค้ดเดิมต่อ

        total = qs.count()
        items = [{
            "id": r.id,
            "customer_name": r.customer_name,
            "customer_phone": r.customer_phone,
            "table_no": r.table_no,
            "guests": r.guests,
            "reserved_at": r.reserved_at.isoformat(),
            "status": r.status,
        } for r in qs[:20]]

        return Response({"meta": {"total": total}, "items": items})


class ReserveSummaryAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        date_str = request.query_params.get("date")
        d = parse_date(date_str) if date_str else None
        if not d:
            return Response({"detail": "date must be YYYY-MM-DD"}, status=400)

        qs = TableReserve.objects.filter(reserved_at__date=d)
        summary = list(qs.values("status").annotate(count=Count("id")).order_by("status"))

        return Response({
            "date": d.isoformat(),
            "summary": summary
        })
```

</details>
