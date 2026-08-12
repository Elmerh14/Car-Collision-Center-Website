package com.carcollisioncenter.authservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carcollisioncenter.authservice.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

  Optional<User> findByUserName(String userName);

  List<User> findByRole(User.Role role);

  boolean existsByUserName(String userName);

  boolean existsByEmail(String email);
}
