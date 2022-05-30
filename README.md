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

- GET http://localhost:8080/admin/accounts/{accountId}

  Xem tất cả các thông tin chi tiết của tài khoản

- POST - http://localhost:8080/admin/trades/confirmation/confirm

  FormData: id=2

  admin đồng ý phê duyệt giao dịch (id: id của tradingHistory). Sau khi phê duyệt tiến hành cập nhật số dư trong tài khoản. Nếu tài khoản không đủ số dư hoặc k tìm thấy thông tin số dư thì thao tác thất bại

- POST - http://localhost:8080/admin/trades/confirmation/cancel

  FormData: id=1

  admin KHÔNG đồng ý phê duyệt giao dịch (id: id của tradingHistory)

- POST - http://localhost:8080/me/balance/recharge

  FormData: amount=2000000&cardnumber=1111111&exp=2022-10-10&cvv=411

  Nạp tiền từ thẻ tín dụng vào tài khoản

- POST - http://localhost:8080/me/balance/withdrawal

  FormData: amount=1000000&cardnumber=1111111&exp=2022-10-10&cvv=411&note=RutTienMuaTraSua

  Rút tiền đang có trong ví về thẻ tín dụng

### Hoạt động chuyển tiền

- (1) GET - http://localhost:8080/me/balance/transfers

  user truy cap page chuyển tiền

- (2) POST - http://localhost:8080/me/balance/transfers

  FormData: amountMoney=100000&receiverPhone=0123456789&feeBearer=0&message

  - feeBearer:
    - 0: Người gửi là người chịu phí giao dịch (5%)
    - 1: Người nhận là người chịu phí giao dịch (5%)
  - user submit form, trả dữ liệu về cho user so khớp và chờ user confirm giao dịch.

- (3) POST - http://localhost:8080/me/balance/transfers/confirm

  user đồng ý giao dịch (confirm), gửi OTP cho user thông qua email

- (4) POST - http://localhost:8080/me/balance/transfers/transfer/{OTP_CODE}

  OTP_CODE: mã OTP được user nhập

  Chuyển tiền giữa các tài khoản (thực hiện chuyển tiền), mã OTP của user nhập cần phải truyền vào
