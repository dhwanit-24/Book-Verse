package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.entity.BookEntity;

public interface BookRepo extends JpaRepository<BookEntity, Integer>{
	@Query("SELECT b.genre, COUNT(b) FROM BookEntity b GROUP BY b.genre")
	List<Object[]> countBooksByGenre();
	
	long countByActiveTrue();
	
	@Query("SELECT b.genre, COUNT(b) FROM BookEntity b WHERE b.active = true AND b.stock > 0 GROUP BY b.genre ORDER BY b.genre ASC")
	List<Object[]> countAvailableBooksByGenre();
	
	List<BookEntity> findByActiveTrue();
}
