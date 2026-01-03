# Tutorial 3: POST API (Body & Database Mutation)

**Goal:** สร้างและแก้ไขข้อมูลใน Database โดยการส่งข้อมูลผ่าน Body (JSON format) ด้วย Method POST

### 1. ความรู้และตัวอย่างโค้ด

**Concept:**

- **`request.data`**: ใช้รับข้อมูล JSON ที่ส่งมาใน Body (ต่างจาก `query_params` ที่รับจาก URL)
- **Mutation:** การใช้ `.create()` หรือดึงมาแล้ว `.save()` เพื่อเปลี่ยนข้อมูลใน DB

**Example 1: Create Reservation**
**File:** `table_reserves/views.py`

```python
class CreateReserveAPI(APIView):
    def post(self, request):
        # 1. รับ Data
        name = request.data.get('customer_name')
        pax = request.data.get('pax', 1)

        # 2. Validate ง่ายๆ
        if not name:
            return Response({"error": "Name is required"}, status=400)

        # 3. Create ลง Database
        new_reserve = Reserve.objects.create(
            customer_name=name,
            pax=pax,
            status='pending'
        )

        # 4. Return ผลลัพธ์
        return Response({
            "message": "Created successfully",
            "id": new_reserve.id
        }, status=201)
```

**Example 2: Update Status (Action)**
**File:** `table_reserves/views.py`

```python
class ConfirmReserveAPI(APIView):
    def post(self, request, pk):
        try:
            # 1. หา Object
            reserve = Reserve.objects.get(pk=pk)

            # 2. Update ค่า
            reserve.status = 'confirmed'
            reserve.save() # สำคัญมาก ต้อง save()

            return Response({"message": f"Booking {pk} confirmed!"})
        except Reserve.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
```

**File:** `table_reserves/urls.py`

```python
urlpatterns = [
    # ...
    path('create/', CreateReserveAPI.as_view()),
    path('confirm/<int:pk>/', ConfirmReserveAPI.as_view()),
]
```

**Keyword สรุป:**

- **`request.data`**: ข้อมูล JSON Body ที่ Client ส่งมา
- **HTTP 201 Created**: Status Code มาตรฐานเมื่อสร้างข้อมูลสำเร็จ
- **HTTP 400 Bad Request**: Status Code เมื่อ Input ผิดพลาด

---

### 2. โจทย์แบบฝึกหัด (Tutorial 3)

#### ข้อ 1 (ง่าย): Cancel Reservation

- **Requirement:** API สำหรับยกเลิกการจอง (เปลี่ยน status เป็น 'cancelled')
- **Input:** POST `/api/reserves/cancel/<id>/` (ไม่ต้องส่ง Body)
- **Output:** `{"message": "Booking <id> cancelled"}` และข้อมูลใน DB เปลี่ยนเป็น cancelled
- **TestCase:** เช็ค DB ว่า status เปลี่ยนจริงหรือไม่

#### ข้อ 2 (ปานกลาง): Update Pax (แก้ไขจำนวนคน)

- **Requirement:** API แก้ไขจำนวนคนจอง
- **Input:** POST `/api/reserves/update-pax/<id>/`
  - Body: `{"pax": 5}`
- **Logic:** ต้องตรวจสอบว่า `pax` ที่ส่งมาต้อง > 0 ถ้าไม่ใช่ให้ return 400
- **Output:** `{"id": <id>, "new_pax": 5}`

#### ข้อ 3 (ยาก): Create Walk-in (Logic ซับซ้อนขึ้น)

- **Requirement:** สร้างการจองแบบ Walk-in
- **Input:** POST `/api/reserves/walk-in/`
  - Body: `{"name": "Guest 1"}` (ไม่ต้องส่ง pax, default = 1)
- **Logic:**
  1. สร้าง record ใหม่
  2. บังคับ set `status = 'confirmed'` ทันที (เพราะมาหน้าร้านแล้ว)
  3. บังคับ set `customer_name` ให้เติมคำว่า "(Walk-in)" ต่อท้าย เช่น "Guest 1 (Walk-in)"
- **Output:** Return object ที่สร้างเสร็จแล้ว

---

### 3. เฉลย (Click to expand)

<details>
<summary><b>คลิกเพื่อดูเฉลย Tutorial 3</b></summary>

**File:** `table_reserves/views.py`

```python
# ข้อ 1
class CancelReserveAPI(APIView):
    def post(self, request, pk):
        try:
            r = Reserve.objects.get(pk=pk)
            r.status = 'cancelled'
            r.save()
            return Response({"message": f"Booking {pk} cancelled"})
        except Reserve.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

# ข้อ 2
class UpdatePaxAPI(APIView):
    def post(self, request, pk):
        new_pax = request.data.get('pax')

        # Validation
        if new_pax is None or int(new_pax) <= 0:
            return Response({"error": "Invalid pax number"}, status=400)

        try:
            r = Reserve.objects.get(pk=pk)
            r.pax = int(new_pax)
            r.save()
            return Response({"id": r.id, "new_pax": r.pax})
        except Reserve.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

# ข้อ 3
class WalkInAPI(APIView):
    def post(self, request):
        name = request.data.get('name')
        if not name:
             return Response({"error": "Name required"}, status=400)

        # Logic
        full_name = f"{name} (Walk-in)"

        new_r = Reserve.objects.create(
            customer_name=full_name,
            pax=1,
            status='confirmed' # บังคับ confirm
        )

        return Response({
            "id": new_r.id,
            "name": new_r.customer_name,
            "status": new_r.status
        }, status=201)
```

**File:** `table_reserves/urls.py`

```python
urlpatterns = [
    # ...
    path('cancel/<int:pk>/', CancelReserveAPI.as_view()),
    path('update-pax/<int:pk>/', UpdatePaxAPI.as_view()),
    path('walk-in/', WalkInAPI.as_view()),
]
```

</details>
