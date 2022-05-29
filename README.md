# Lưu ý

SQL Script nằm trong thư mục migration

# Instruction

## CSDL

- Thông tin đăng nhập CSDL:

> Database name: ewallet
>
> username: root
>
> password: 123456
>
> port: 3306

- Import dữ liệu vào Database (phpMyAdmin): import từ file `migration/initdb.sql`

- Import dữ liệu dùng Docker: chạy lệnh `docker-compose up --build`

## Commands (chạy ứng dụng)

- Trên máy MacOS/Linux chạy thông qua các lệnh:

```bash
# Chạy bình thường
npm run start
```

```bash
# Chạy có thông tin log
npm run dev
```

```bash
# Chạy debug
npm run debug
```

- Trên máy Windows chạy thông qua các lệnh:

```bash
# Chạy bình thường
npm run start
```

```bash
# Chạy có thông tin log
npm run windows:dev
```

```bash
# Chạy debug
npm run windows:debug
```

# Endpoints

## Admin (yêu cầu 2.1)

- GET - http://localhost:8080/admin/accounts/activation/waiting-activation

  Danh sách tài khoản đang chờ kích hoạt: tài khoản mới tạo hoặc mới được bổ sung CMND sẽ hiển thị trước.

- GET - http://localhost:8080/admin/accounts/activation/activated

  Danh sách tài khoản đã kích hoạt: sắp xếp giảm dần theo ngày tạo.

- GET - http://localhost:8080/admin/accounts/activation/disabled

  Danh sách tài khoản đã bị vô hiệu hóa (do không đồng ý kích hoạt): sắp xếp giảm dần theo ngày tạo.

- GET - http://localhost:8080/admin/accounts/activation/locked

  Danh sách tài khoản đang bị khóa vô thời hạn (do nhập đăng nhập sai nhiều lần): sắp xếp giảm dần theo thời gian bị khóa.


- POST http://localhost:8080/admin/accounts/activation/unlock

  FormData: username=Hulda

  Unlock tài khoản đang bị khoá (nếu tài khoản unlock đang không bị khoá sẽ báo lỗi)

- POST http://localhost:8080/admin/accounts/activation/active

  FormData: username=JesusCook

  Xác minh 1 tài khoản (nếu tài khoản đang không trong trạng thái chờ xác minh sẽ báo lỗi)