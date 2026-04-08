package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.BookEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.BookRepo;
import com.example.demo.repository.UserRepo;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private BookRepo bookRepo;

    @Autowired
    private UserRepo userRepo;
    
    @GetMapping("/addBook")
    public String addBook(HttpSession session) {
    	if(!isAdmin(session)) return "redirect:/login";
        return "admin/addBook";
    }

    @PostMapping("/saveBook")
    public String saveBook(@ModelAttribute BookEntity book, HttpSession session) {
    	if(!isAdmin(session)) return "redirect:/login";
        bookRepo.save(book);
        return "redirect:/admin/inventory";
    }
    
    @GetMapping("/inventory")
    public String showBooks(Model model, HttpSession session) {
    	if(!isAdmin(session)) return "redirect:/login";
    	model.addAttribute("books", bookRepo.findAll());
    	return "admin/inventory";
    }
    
    @GetMapping("/editBook/{id}")
    public String editBook(@PathVariable Integer id, Model model, HttpSession session)
    {
    	if(!isAdmin(session)) return "redirect:/login";
        BookEntity book = bookRepo.findById(id).orElse(null);
        model.addAttribute("book", book);
        return "admin/editBook";
    }
    
    @PostMapping("/updateBook")
    public String updateBook(@ModelAttribute BookEntity book, HttpSession session)
    {
    	if(!isAdmin(session)) return "redirect:/login";
        bookRepo.save(book);
        return "redirect:/admin/inventory";
    }
    
    @GetMapping("/deleteBook/{id}")
    public String deleteBook(@PathVariable Integer id, HttpSession session)
    {
    	if(!isAdmin(session)) return "redirect:/login";
        BookEntity book = bookRepo.findById(id).orElse(null);
        if(book != null) {
            book.setActive(false);
            bookRepo.save(book);
        }
        return "redirect:/admin/inventory";
    }
    
    @GetMapping("/toggleActive/{id}")
    public String toggleActive(@PathVariable Integer id, HttpSession session) {
    	if(!isAdmin(session)) return "redirect:/login";
        BookEntity book = bookRepo.findById(id).orElse(null);
        if(book != null) {
            book.setActive(!book.getActive());
            bookRepo.save(book);
        }
        return "redirect:/admin/inventory";
    }
    
    private boolean isAdmin(HttpSession session) {
        UserEntity user = (UserEntity) session.getAttribute("loggedInUser");
        return user != null && user.getRole().equals("ADMIN");
    }
    
    @GetMapping("/users")
    public String manageUsers(Model model, HttpSession session) {
        if(!isAdmin(session)) return "redirect:/login";
        
        List<UserEntity> users = userRepo.findAllByOrderByIdDesc();
        model.addAttribute("users", users);
        model.addAttribute("loggedInUser", session.getAttribute("loggedInUser"));
        return "admin/users";
    }

    @PostMapping("/users/update-role")
    public String updateUserRole(@RequestParam Integer userId,
                                 @RequestParam String role,
                                 HttpSession session) {
        if(!isAdmin(session)) return "redirect:/login";
        
        UserEntity loggedInAdmin = (UserEntity) session.getAttribute("loggedInUser");
        UserEntity userToUpdate = userRepo.findById(userId).orElse(null);
        
        // Don't allow admin to change their own role
        if(userToUpdate != null && !userToUpdate.getId().equals(loggedInAdmin.getId())) {
            userToUpdate.setRole(role);
            userRepo.save(userToUpdate);
        }
        
        return "redirect:/admin/users";
    }	
    
//to add book from here 
//	@GetMapping("/addbook")
//	public String addBook()
//	{
//	    BookEntity b = new BookEntity();
//	    b.setImageUrl("/images/Atomic_Habits.jpg");
//	    b.setTitle("Atomic Habits");
//	    b.setAuthor("James Clear");
//	    b.setGenre("Self Help");
//	    b.setPrice(499.0);
//
//	    bookRepo.save(b);
//
//	    return "redirect:/home";
//	}
}