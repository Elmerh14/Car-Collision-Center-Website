package com.carcollisioncenter.authservice.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "password_reset_token")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor

public class PasswordResetToken {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToMany(cascade = CascadeType.REMOVE, orphanRemoval = true)
  private Long userId;

  @Column(nullable = false)
  private String tokenHash;

  @Column(nullable = false)
  private LocalDateTime expiresAt;

  @Column(nullable = false)
  private Boolean used;

  @CreationTimestamp
  private LocalDateTime createdAt;

}
