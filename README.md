# 📚 BookVerse

A full-stack **Library Management & Bookstore Web Application** built with **Spring Boot**, **Thymeleaf**, and **MySQL**.

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Backend    | Java, Spring Boot, Spring MVC     |
| Frontend   | Thymeleaf, HTML, CSS, JavaScript  |
| Database   | MySQL (JPA / Hibernate)           |
| Build Tool | Maven                             |
| Server     | Embedded Tomcat                   |

---

## 📁 Project Structure

```
src/main/java/com/example/demo/
├── BookStoreApplication.java
├── controller/
│   ├── HomeController.java
│   ├── AuthController.java
│   ├── BookController.java
│   └── AdminController.java
├── entity/
│   ├── BookEntity.java
│   └── UserEntity.java
└── repository/
    ├── BookRepo.java
    └── UserRepo.java

src/main/resources/
├── application.properties
├── static/
│   ├── css/
│   ├── js/
│   └── images/
└── templates/
    ├── index.html
    ├── login.html
    ├── catalog.html
    ├── book-detail.html
    ├── cart.html
    └── admin/
        ├── inventory.html
        ├── addBook.html
        └── editBook.html
```

---

## ✅ Features (Current State)

### 👤 User Side
- Home page with randomized featured books and genre categories
- Book catalog with all books listed
- Individual book detail page
- Cart page (localStorage-based)
- Login & Sign Up (session-less, plain auth)

### 🔧 Admin Panel (`/admin`)
- View all books in inventory table (with stock & status badges)
- Add new book with full details
- Edit existing book
- Delete book

### 📦 Book Fields
`title`, `author`, `genre`, `price`, `description`, `imageUrl`, `isbn`, `publisher`, `publishedYear`, `stock`, `active`

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
- No session management — admin panel is currently open access.
- Cart and wishlist are managed via browser `localStorage`.

---

## 👨‍💻 Author
**Dhwanit** — First Year CS Student
