package com.wedding.api.repository;

import com.wedding.api.model.entity.Gift;
import com.wedding.api.model.enums.EventType;
import com.wedding.api.model.enums.GiftStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GiftRepository extends JpaRepository<Gift, Long> {

    List<Gift> findByEventType(EventType eventType);

    List<Gift> findByEventTypeAndStatus(EventType eventType, GiftStatus status);

    Optional<Gift> findByIdAndEventType(Long id, EventType eventType);

    Optional<Gift> findByIdAndReservationCode(Long id, String reservationCode);
}
