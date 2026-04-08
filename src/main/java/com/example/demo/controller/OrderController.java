package com.example.demo.controller;

import com.example.demo.entity.OrderEntity;
import com.example.demo.entity.OrderItemEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.model.CartItem;
import com.example.demo.repository.BookRepo;
import com.example.demo.repository.OrderItemRepo;
import com.example.demo.repository.OrderRepo;
import com.example.demo.repository.UserRepo;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class OrderController {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private OrderItemRepo orderItemRepo;

    @Autowired
    private BookRepo bookRepo;

    @GetMapping("/checkout")
    public String showCheckout(Model model, HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        if (loggedInUser == null) return "redirect:/login";

        @SuppressWarnings("unchecked")
        List<CartItem> cart = (List<CartItem>) session.getAttribute("cart");
        if (cart == null || cart.isEmpty()) return "redirect:/cart";

        double subtotal = cart.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();
        double shipping = subtotal >= 1000 ? 0 : 40;
        double total = subtotal + shipping;

        model.addAttribute("cart", cart);
        model.addAttribute("subtotal", subtotal);
        model.addAttribute("shipping", shipping);
        model.addAttribute("total", total);
        model.addAttribute("loggedInUser", loggedInUser);
        return "checkout";
    }

    @PostMapping("/place-order")
    public String placeOrder(
            @RequestParam String fullName,
            @RequestParam String phoneNumber,
            @RequestParam String addressLine1,
            @RequestParam(required = false) String addressLine2,
            @RequestParam String city,
            @RequestParam String state,
            @RequestParam String pincode,
            @RequestParam(required = false) String landmark,
            @RequestParam String paymentMethod,
            HttpSession session,
            Model model) {

        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        if (loggedInUser == null) return "redirect:/login";

        @SuppressWarnings("unchecked")
        List<CartItem> cart = (List<CartItem>) session.getAttribute("cart");
        if (cart == null || cart.isEmpty()) return "redirect:/cart";

        double subtotal = cart.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();
        double shipping = subtotal >= 1000 ? 0 : 40;
        double total = subtotal + shipping;

        // Generate order number
        long orderCount = orderRepo.count() + 1;
        String orderNumber = "BK-" + String.format("%04d", orderCount);

        OrderEntity order = new OrderEntity();
        order.setOrderNumber(orderNumber);
        order.setUser(loggedInUser);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(total);
        order.setFullName(fullName);
        order.setPhoneNumber(phoneNumber);
        order.setAddressLine1(addressLine1);
        order.setAddressLine2(addressLine2);
        order.setCity(city);
        order.setState(state);
        order.setPincode(pincode);
        order.setLandmark(landmark);
        order.setPaymentMethod(paymentMethod);
        order.setStatus("CONFIRMED");

        orderRepo.save(order);

        // Save order items and reduce stock
        for (CartItem item : cart) {
            OrderItemEntity orderItem = new OrderItemEntity();
            orderItem.setOrder(order);
            var book = bookRepo.findById(item.getBookId()).orElse(null);
            orderItem.setBook(book);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPriceAtTime(item.getPrice());
            orderItemRepo.save(orderItem);

            if (book != null) {
                int newStock = book.getStock() - item.getQuantity();
                book.setStock(newStock);
                if (newStock <= 0) book.setActive(false);
                bookRepo.save(book);
            }
        }

        session.removeAttribute("cart");

        model.addAttribute("order", order);
        model.addAttribute("orderItems", cart);
        model.addAttribute("total", total);
        model.addAttribute("shipping", shipping);
        model.addAttribute("loggedInUser", loggedInUser);
        return "order-confirmation";
    }
}