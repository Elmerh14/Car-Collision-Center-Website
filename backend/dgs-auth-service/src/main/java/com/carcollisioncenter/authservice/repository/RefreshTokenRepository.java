package com.carcollisioncenter.authservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.carcollisioncenter.authservice.entity.RefreshToken;
import com.carcollisioncenter.authservice.entity.User;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
  Optional<RefreshToken> findByTokenHash(String tokenHash);

  List<RefreshToken> findByUser(User user);

}
