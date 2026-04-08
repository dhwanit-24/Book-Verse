package com.example.demo.controller;

import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.demo.entity.BookEntity;
import com.example.demo.repository.BookRepo;
import com.example.demo.repository.UserRepo;

import jakarta.servlet.http.HttpSession;

@Controller
public class HomeController {

    @Autowired
    private BookRepo bookRepo;
    
    @Autowired
    private UserRepo userRepo;

    @GetMapping("/")
    public String home(Model model, HttpSession session) {
    	//session
    	model.addAttribute("loggedInUser", session.getAttribute("loggedInUser"));

        List<BookEntity> allBooks = bookRepo.findByActiveTrue();
        //featured books random 3
        Collections.shuffle(allBooks);        // random order
        List<BookEntity> featured = allBooks.stream().limit(3).toList();
        model.addAttribute("books", allBooks);
        model.addAttribute("featuredBooks", featured);
        
        
        long activeBookCount = bookRepo.countByActiveTrue();
        long totalUserCount = userRepo.count();
        
        model.addAttribute("activeBookCount", activeBookCount);
        model.addAttribute("totalUserCount", totalUserCount);
        
        // random 4
        Collections.shuffle(allBooks);
        List<BookEntity> randomFour = allBooks.stream().limit(4).toList();
        model.addAttribute("books", randomFour);

        //category
        List<Object[]> genreCounts = bookRepo.countBooksByGenre();
        // Convert to list of Map entries
        List<Map.Entry<String, Long>> categoryList = new ArrayList<>();
        for (Object[] row : genreCounts) {
            categoryList.add(
                new AbstractMap.SimpleEntry<>(
                    (String) row[0],
                    (Long) row[1]
                )
            );
        }

        // Shuffle categories
        Collections.shuffle(categoryList);
        // Limit to 4
        List<Map.Entry<String, Long>> randomFourCategories = categoryList.stream().limit(4).toList();
        model.addAttribute("categoryCounts", randomFourCategories);        
        
        return "index";
    }
    
    @GetMapping("/catalog")
    public String catalog(Model model, HttpSession session) {
    	//session 
    	model.addAttribute("loggedInUser", session.getAttribute("loggedInUser"));
    	
    	model.addAttribute("books", bookRepo.findByActiveTrue());
    	model.addAttribute("totalBooks", bookRepo.count());
    	model.addAttribute("activeBooks", bookRepo.countByActiveTrue());
    	
    	//genre count for catalog page
    	List<Object[]> genreCounts = bookRepo.countAvailableBooksByGenre();
    	List<Map.Entry<String, Long>> categoryList = new ArrayList<>();
    	for(Object[] row : genreCounts) {
    		categoryList.add(
    				new AbstractMap.SimpleEntry<>(
    						(String) row[0],
    						(Long) row[1]
    					)
    			);
    	}
    	model.addAttribute("categoryCounts", categoryList);
    	return "catalog";
    }
    
    @GetMapping("/bestsellers")
    public String bestsellers(Model model, HttpSession session) {
        model.addAttribute("books", bookRepo.findByStockLessThanAndActiveTrueOrderByStockAsc(10));
        model.addAttribute("loggedInUser", session.getAttribute("loggedInUser"));
        return "bestsellers";
    }

    @GetMapping("/new-arrivals")
    public String newArrivals(Model model, HttpSession session) {
        model.addAttribute("books", bookRepo.findByActiveTrueOrderByArrivedOnDesc());
        model.addAttribute("loggedInUser", session.getAttribute("loggedInUser"));
        return "new-arrivals";
    }
}