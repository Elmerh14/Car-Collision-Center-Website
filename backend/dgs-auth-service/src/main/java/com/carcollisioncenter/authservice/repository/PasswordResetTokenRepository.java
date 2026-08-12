package com.carcollisioncenter.authservice.repository;

import com.carcollisioncenter.authservice.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

}
