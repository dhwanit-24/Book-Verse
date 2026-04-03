package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.BookEntity;
import com.example.demo.repository.BookRepo;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private BookRepo bookRepo;

    @GetMapping("/addBook")
    public String addBook() {
        return "admin/addBook";
    }

    @PostMapping("/saveBook")
    public String saveBook(@ModelAttribute BookEntity book) {
        bookRepo.save(book);
        return "redirect:/admin/inventory";
    }
    
    @GetMapping("/inventory")
    public String showBooks(Model model) {
    	model.addAttribute("books", bookRepo.findAll());
    	return "admin/inventory";
    }
    
    @GetMapping("/editBook/{id}")
    public String editBook(@PathVariable Integer id, Model model)
    {
        BookEntity book = bookRepo.findById(id).orElse(null);
        model.addAttribute("book", book);
        return "admin/editBook";
    }
    
    @PostMapping("/updateBook")
    public String updateBook(@ModelAttribute BookEntity book)
    {
        bookRepo.save(book);
        return "redirect:/admin/inventory";
    }
    
    @GetMapping("/deleteBook/{id}")
    public String deleteBook(@PathVariable Integer id)
    {
        BookEntity book = bookRepo.findById(id).orElse(null);
        if(book != null) {
            book.setActive(false);
            bookRepo.save(book);
        }
        return "redirect:/admin/inventory";
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