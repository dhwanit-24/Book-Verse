# 📚 BookVerse

A full-stack **Bookstore Web Application** built with **Spring Boot**, **Thymeleaf**, and **MySQL** — developed collaboratively as a college project.

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Backend    | Java, Spring Boot, Spring MVC     |
| Frontend   | Thymeleaf, HTML, CSS, JavaScript  |
| Database   | MySQL (JPA / Hibernate)           |
| PDF Engine | iText (HTML to PDF via Thymeleaf) |
| Build Tool | Maven                             |
| Server     | Embedded Tomcat                   |

---

## 📁 Project Structure

```
src/main/java/com/example/demo/
├── BookStoreApplication.java
├── controller/
│   ├── HomeController.java
│   ├── BookController.java
│   ├── AuthController.java
│   ├── CartController.java
│   ├── OrderController.java
│   └── AdminController.java
├── entity/
│   ├── BookEntity.java
│   ├── UserEntity.java
│   ├── OrderEntity.java
│   └── OrderItemEntity.java
├── model/
│   └── CartItem.java
├── repository/
│   ├── BookRepo.java
│   ├── UserRepo.java
│   ├── OrderRepo.java
│   └── OrderItemRepo.java
└── service/
    └── PdfService.java

src/main/resources/
├── application.properties
├── static/
│   ├── css/
│   │   ├── common.css
│   │   ├── home.css
│   │   ├── catalog.css
│   │   ├── book-detail.css
│   │   ├── cart.css
│   │   ├── loginStyle.css
│   │   └── admin/
│   │       └── admin.css
│   ├── js/
│   │   ├── common.js
│   │   ├── home.js
│   │   ├── catalog.js
│   │   ├── book-detail.js
│   │   └── cart.js
│   └── images/
└── templates/
    ├── index.html
    ├── catalog.html
    ├── book-detail.html
    ├── bestsellers.html
    ├── new-arrivals.html
    ├── login.html
    ├── cart.html
    ├── checkout.html
    ├── order-confirmation.html
    ├── order-history.html
    ├── order-detaiil.html
    ├── invoice-pdf.html
    └── admin/
        ├── inventory.html
        ├── addBook.html
        ├── editBook.html
        └── users.html
```

---

## ✅ Features

### 👤 User Side — Catalog & Discovery
- Home page with randomized featured books, random picks section, and genre category grid
- Live site stats — total active books and registered users displayed on homepage
- Full book catalog with complete active inventory
- Client-side genre filtering, search bar, and sort — all without page reload
- Genre counts shown alongside each filter option in sidebar
- Individual book detail page with full book information
- Related books sidebar — same genre, excludes current book
- Bestsellers page — books with lowest stock surfaced as most popular
- New arrivals page — books sorted by date added, newest first
- Quantity picker on book detail with stock-aware max cap

### 🛒 User Side — Commerce & Orders
- Session-based cart — add, update quantity, and remove items
- Cart auto-caps quantity at available stock
- Free shipping on orders above ₹1000, flat ₹40 below
- Full checkout flow with shipping address and payment method selection
- Order placement with automatic stock deduction and auto-disable when stock hits zero
- Order confirmation page with full summary
- Order history page — all past orders for logged-in user
- Individual order detail view
- PDF invoice download — generated server-side per order

### 🔐 Auth
- Login and signup on a single page with tab switching
- Session-based authentication
- Admin users redirected to inventory on login
- Logout invalidates session cleanly

### 🔧 Admin Panel (`/admin`)
- Full inventory table — all books with stock levels and active/inactive status badges
- Add new book with all fields
- Edit existing book details
- Soft delete — marks book inactive, never removes from database
- Toggle active/inactive status per book
- User management — view all registered users, update roles
- Admin protected — all routes check session role before proceeding

### 📦 Book Fields
`id`, `title`, `author`, `genre`, `price`, `description`, `imageUrl`, `isbn`, `publisher`, `publishedYear`, `stock`, `active`, `arrivedOn`

### 👤 User Fields
`id`, `name`, `email`, `password`, `role`

### 🧾 Order Fields
`id`, `orderNumber`, `user`, `orderDate`, `totalAmount`, `fullName`, `phoneNumber`, `addressLine1`, `addressLine2`, `city`, `state`, `pincode`, `landmark`, `paymentMethod`, `status`

---

## ⚙️ Setup & Run

### Prerequisites
- Java 17+
- Maven
- MySQL

### Database Setup
Create a MySQL database named `bookstore`:
```sql
CREATE DATABASE bookstore;
```

### Configuration
Update `src/main/resources/application.properties` with your MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bookstore
spring.datasource.username=root
spring.datasource.password=your_password
```

### Run
```bash
mvn spring-boot:run
```
Then open: [http://localhost:8080](http://localhost:8080)

---

## 📌 Notes
- This is a college project — built for learning purposes.
- Passwords are stored as plain text (no encryption).
- Session-based auth is manually implemented without Spring Security.
- Cart is managed via HTTP session (server-side), not localStorage.
- Soft delete is used for books — `active = false` instead of database removal.
- PDF invoices are generated server-side using iText and a Thymeleaf template.

---

## 👨‍💻 Authors

This project was built collaboratively. Both developers worked full-stack — each owning a complete feature zone from controller to database to frontend.

| Developer | Feature Zone | Key Contributions |
|-----------|-------------|-------------------|
| **Dhwanit** | Commerce & Admin | Auth system, cart & session management, full order pipeline, PDF invoice generation, admin panel (inventory + user management), order history & detail views |
| **Saumya** | Catalog & Discovery | Homepage (featured, random picks, category grid, stats), catalog with client-side filtering/search/sort, book detail page, related books, bestsellers, new arrivals |

---

*Seconf Year CS Students*
