package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.BookEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.model.CartItem;
import com.example.demo.repository.BookRepo;

import jakarta.servlet.http.HttpSession;

@Controller
public class CartController {

    @Autowired
    private BookRepo bookRepo;

    @PostMapping("/cart/add")
    public String addToCart(@RequestParam Integer bookId,
                            @RequestParam Integer quantity,
                            HttpSession session) {
    	UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        if (loggedInUser == null) { session.setAttribute("redirectAfterLogin", "/book/" + bookId); return "redirect:/login"; }


        BookEntity book = bookRepo.findById(bookId).orElse(null);
        if (book == null) return "redirect:/catalog";

        List<CartItem> cart = getCart(session);

        // check if already in cart
        CartItem existing = null;
        for (CartItem item : cart) {
            if (item.getBookId().equals(bookId)) {
                existing = item;
                break;
            }
        }

        if (existing != null) {
            int newQty = existing.getQuantity() + quantity;
            existing.setQuantity(Math.min(newQty, book.getStock()));
        } else {
            cart.add(new CartItem(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getImageUrl(),
                book.getPrice(),
                quantity
            ));
        }

        session.setAttribute("cart", cart);
        return "redirect:/cart";
    }

    @GetMapping("/cart")
    public String viewCart(Model model, HttpSession session) {
    	UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        if (loggedInUser == null) { return "redirect:/login"; }
        
        List<CartItem> cart = getCart(session);
        double subtotal = 0;
        for (CartItem item : cart) {
            subtotal += item.getPrice() * item.getQuantity();
        }
        double shipping = subtotal >= 1000 ? 0 : 40;
        double total = subtotal + shipping;

        model.addAttribute("cart", cart);
        model.addAttribute("subtotal", subtotal);
        model.addAttribute("shipping", shipping);
        model.addAttribute("total", total);
        model.addAttribute("loggedInUser", session.getAttribute("loggedInUser"));
        return "cart";
    }

    @GetMapping("/cart/update")
    public String updateCart(@RequestParam Integer bookId,
                             @RequestParam Integer quantity,
                             HttpSession session) {
        List<CartItem> cart = getCart(session);
        if (quantity <= 0) {
            cart.removeIf(item -> item.getBookId().equals(bookId));
        } else {
            BookEntity book = bookRepo.findById(bookId).orElse(null);
            for (CartItem item : cart) {
                if (item.getBookId().equals(bookId)) {
                    item.setQuantity(Math.min(quantity, book != null ? book.getStock() : quantity));
                    break;
                }
            }
        }
        session.setAttribute("cart", cart);
        return "redirect:/cart";
    }

    @GetMapping("/cart/remove/{bookId}")
    public String removeFromCart(@PathVariable Integer bookId, HttpSession session) {
        List<CartItem> cart = getCart(session);
        cart.removeIf(item -> item.getBookId().equals(bookId));
        session.setAttribute("cart", cart);
        return "redirect:/cart";
    }

    @SuppressWarnings("unchecked")
    private List<CartItem> getCart(HttpSession session) {
        List<CartItem> cart = (List<CartItem>) session.getAttribute("cart");
        if (cart == null) cart = new ArrayList<>();
        return cart;
    }
}