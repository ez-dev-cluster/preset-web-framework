# Tutorial 2: GET API (Params & Database)

**Goal:** ดึงข้อมูลจาก Database ผ่าน Model `Reserve` โดยเรียนรู้วิธีรับค่า `Query Params` (?key=value) และ `Path Params` (/1/)

### 1. ความรู้และตัวอย่างโค้ด

**Concept:**

- **Query Params (`request.query_params`):** ใช้สำหรับ Filter หรือ Search (เช่น `?status=pending`)
- **Path Params (`kwargs`):** ใช้ระบุเจาะจง Resource (เช่น `details/5/` เพื่อดู ID 5)

**Example 1: Get All & Search (Query Params)**
**File:** `table_reserves/views.py`

```python
from .models import Reserve

class ReserveListAPI(APIView):
    def get(self, request):
        # 1. รับค่าจาก URL ?search=...
        search_name = request.query_params.get('search')

        # 2. Query ข้อมูล
        if search_name:
            reserves = Reserve.objects.filter(customer_name__icontains=search_name)
        else:
            reserves = Reserve.objects.all()

        # 3. แปลง Object เป็น Dict (Manual Serialization แบบง่าย)
        data = []
        for r in reserves:
            data.append({
                "id": r.id,
                "name": r.customer_name,
                "status": r.status
            })

        return Response(data)
```

**Example 2: Get Specific ID (Path Params)**
**File:** `table_reserves/views.py`

```python
class ReserveDetailAPI(APIView):
    def get(self, request, pk): # pk รับมาจาก urls.py
        try:
            reserve = Reserve.objects.get(pk=pk)
            data = {
                "id": reserve.id,
                "name": reserve.customer_name,
                "pax": reserve.pax
            }
            return Response(data)
        except Reserve.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
```

**File:** `table_reserves/urls.py`

```python
from .views import ReserveListAPI, ReserveDetailAPI

urlpatterns = [
    # ... path เก่า ...
    path('list/', ReserveListAPI.as_view()), # รองรับ ?search=xxx
    path('detail/<int:pk>/', ReserveDetailAPI.as_view()), # รองรับ detail/1/
]
```

**Keyword สรุป:**

- **`request.query_params.get('key')`**: รับค่าหลังเครื่องหมาย `?`
- **`<int:pk>`**: การดักจับตัวเลขจาก URL path ส่งเข้า function view
- **`.objects.filter()`**: ค้นหาแบบมีเงื่อนไข (ได้หลายรายการ)
- **`.objects.get()`**: ค้นหาตัวเดียว (ถ้าไม่เจอจะ Error)

---

### 2. โจทย์แบบฝึกหัด (Tutorial 2)

_(หมายเหตุ: ควรสร้างข้อมูลใน Admin หรือ Shell ไว้ก่อนทดสอบ)_

#### ข้อ 1 (ง่าย): Filter by Status

- **Requirement:** สร้าง API ดึงข้อมูลจองโต๊ะ โดยรับ parameter `status` เพื่อกรองข้อมูล
- **Input:** GET `/api/reserves/filter-status/?status=confirmed`
- **Output:** List ของรายการที่มี status เป็น confirmed
- **TestCase:** ลองส่ง status ที่ไม่มีจริง ต้องได้ List ว่าง `[]`

#### ข้อ 2 (ปานกลาง): Get Reservation by ID with Full Info

- **Requirement:** สร้าง API ดูรายละเอียดการจองตาม ID ที่ระบุใน path
- **Input:** GET `/api/reserves/info/1/`
- **Output:** `{"id": 1, "customer": "John", "pax": 4, "status": "pending", "time": "..."}`
- **TestCase:** ถ้าใส่ ID ที่ไม่มีในระบบ ต้อง return 404 และ message "Booking not found"

#### ข้อ 3 (ยาก): VIP Finder (Logic)

- **Requirement:** ค้นหาการจองที่มีจำนวนคน (`pax`) มากกว่าหรือเท่ากับตัวเลขที่ส่งมา
- **Input:** GET `/api/reserves/vip/?min_pax=5`
- **Output:** List ของการจองที่มีคน >= 5 คน
- **TestCase:** ถ้าไม่ส่ง `min_pax` มา ให้ default เป็น 10 คน

---

### 3. เฉลย (Click to expand)

<details>
<summary><b>คลิกเพื่อดูเฉลย Tutorial 2</b></summary>

**File:** `table_reserves/views.py`

```python
# ข้อ 1
class FilterStatusAPI(APIView):
    def get(self, request):
        status_param = request.query_params.get('status')
        if status_param:
            items = Reserve.objects.filter(status=status_param)
        else:
            items = Reserve.objects.all()

        # ใช้ list comprehension ย่อ code
        data = [{"id": i.id, "name": i.customer_name, "status": i.status} for i in items]
        return Response(data)

# ข้อ 2
class InfoByIDAPI(APIView):
    def get(self, request, booking_id):
        try:
            r = Reserve.objects.get(id=booking_id)
            data = {
                "id": r.id,
                "customer": r.customer_name,
                "pax": r.pax,
                "status": r.status,
                "time": r.created_at
            }
            return Response(data)
        except Reserve.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

# ข้อ 3
class VIPFinderAPI(APIView):
    def get(self, request):
        # รับค่ามาเป็น string ต้องแปลงเป็น int, ถ้าไม่มีให้ default 10
        min_pax = int(request.query_params.get('min_pax', 10))

        # __gte แปลว่า Greater Than or Equal (>=)
        vips = Reserve.objects.filter(pax__gte=min_pax)

        data = [{"id": v.id, "name": v.customer_name, "pax": v.pax} for v in vips]
        return Response(data)
```

**File:** `table_reserves/urls.py`

```python
urlpatterns = [
    # ...
    path('filter-status/', FilterStatusAPI.as_view()),
    path('info/<int:booking_id>/', InfoByIDAPI.as_view()),
    path('vip/', VIPFinderAPI.as_view()),
]
```

</details>
