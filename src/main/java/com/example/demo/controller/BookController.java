package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.demo.entity.BookEntity;
import com.example.demo.repository.BookRepo;

import jakarta.servlet.http.HttpSession;

@Controller
public class BookController {

    @Autowired
    private BookRepo bookRepo;

    @GetMapping("/book/{id}")
    public String bookDetail(@PathVariable Integer id, Model model, HttpSession session) {
    	model.addAttribute("loggedInUser", session.getAttribute("loggedInUser"));
        BookEntity book = bookRepo.findById(id).orElse(null);

        if(book == null){
            return "redirect:/catalog"; // invalid id protection
        }
        List<BookEntity> relatedBooks = bookRepo.findByGenreAndActiveTrueAndIdNot(book.getGenre(), id);

        model.addAttribute("book", book);
        model.addAttribute("relatedBooks", relatedBooks);
        return "book-detail";
    }
    
    
}
