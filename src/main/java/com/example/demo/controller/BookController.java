package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.demo.entity.BookEntity;
import com.example.demo.repository.BookRepo;

@Controller
public class BookController {

    @Autowired
    private BookRepo bookRepo;

    @GetMapping("/book/{id}")
    public String bookDetail(@PathVariable Integer id, Model model) {

        BookEntity book = bookRepo.findById(id).orElse(null);

        if(book == null){
            return "redirect:/catalog"; // invalid id protection
        }

        model.addAttribute("book", book);
        return "book-detail";
    }
}
