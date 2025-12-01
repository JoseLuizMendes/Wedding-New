package com.wedding.api.repository;

import com.wedding.api.model.entity.RSVP;
import com.wedding.api.model.enums.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RSVPRepository extends JpaRepository<RSVP, Long> {

    List<RSVP> findByEventType(EventType eventType);

    List<RSVP> findByGuestId(Long guestId);

    boolean existsByGuestIdAndEventType(Long guestId, EventType eventType);
}
