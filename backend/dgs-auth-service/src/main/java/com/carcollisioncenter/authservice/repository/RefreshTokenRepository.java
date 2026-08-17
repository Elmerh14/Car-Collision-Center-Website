package com.carcollisioncenter.authservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.carcollisioncenter.authservice.entity.RefreshToken;
import com.carcollisioncenter.authservice.entity.User;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
  Optional<RefreshToken> findByTokenHash(String tokenHash);

  @Modifying
  @Query("UPDATE RefreshToken r SET r.revoked = true WHERE r.user = :user")
  void revokeAllByUser(@Param("user") User user);
}
