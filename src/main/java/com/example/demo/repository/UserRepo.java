package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.UserEntity;

public interface UserRepo extends JpaRepository<UserEntity, Integer>{
	
	boolean existsByEmail(String email);
	
	UserEntity findByEmail(String email);

	
}
