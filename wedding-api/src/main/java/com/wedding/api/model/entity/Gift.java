package com.wedding.api.model.entity;

import com.wedding.api.model.enums.EventType;
import com.wedding.api.model.enums.GiftStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "gifts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private GiftStatus status = GiftStatus.AVAILABLE;

    @Column(name = "reserved_by")
    private String reservedBy;

    @Column(name = "reserved_by_phone")
    private String reservedByPhone;

    @Column(name = "reservation_code")
    private String reservationCode;

    @Column(name = "reserved_at")
    private Instant reservedAt;

    @Column(name = "purchased_at")
    private Instant purchasedAt;

    @Column(name = "created_at")
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
