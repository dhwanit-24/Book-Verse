package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.UserEntity;
import com.example.demo.repository.UserRepo;

import jakarta.servlet.http.HttpSession;

@Controller
public class AuthController {

    @Autowired
    private UserRepo userRepo;

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @PostMapping("/signupData")
    public String signupData(@ModelAttribute UserEntity UsEn) {
        userRepo.save(UsEn);
        return "redirect:/";
    }

    @PostMapping("/doLogin")
    public String doLogin(@RequestParam String email,
                          @RequestParam String password,
                          Model model,
                          HttpSession session)
    {
        UserEntity dbUser = userRepo.findByEmail(email);

        if(dbUser == null){
            model.addAttribute("error", "User does not exist");
            return "login";
        }

        if(!dbUser.getPassword().equals(password)){
            model.addAttribute("error", "Incorrect password");
            return "login";
        }
        
        session.setAttribute("loggedInUser", dbUser);
        return "redirect:/";
    }
    
}