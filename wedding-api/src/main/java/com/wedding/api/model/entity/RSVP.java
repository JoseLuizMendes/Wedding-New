package com.wedding.api.model.entity;

import com.wedding.api.model.enums.EventType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "rsvps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RSVP {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id")
    private Guest guest;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;

    @Builder.Default
    private Boolean attending = true;

    @Column(name = "guests_count")
    @Builder.Default
    private Integer guestsCount = 1;

    private String message;

    @Column(name = "confirmed_at")
    private Instant confirmedAt;

    @PrePersist
    protected void onCreate() {
        confirmedAt = Instant.now();
    }
}
