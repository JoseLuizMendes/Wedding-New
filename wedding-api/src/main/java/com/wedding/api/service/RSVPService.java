package com.wedding.api.service;

import com.wedding.api.exception.BusinessException;
import com.wedding.api.model.dto.RSVPRequest;
import com.wedding.api.model.dto.RSVPResponse;
import com.wedding.api.model.entity.Guest;
import com.wedding.api.model.entity.RSVP;
import com.wedding.api.model.enums.EventType;
import com.wedding.api.repository.GuestRepository;
import com.wedding.api.repository.RSVPRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RSVPService {

    private final RSVPRepository rsvpRepository;
    private final GuestRepository guestRepository;

    @Transactional
    public RSVPResponse confirmPresence(RSVPRequest request) {
        // Find or create guest
        Guest guest = guestRepository.findByPhone(request.contato())
            .orElseGet(() -> createGuest(request));

        // Check if already confirmed for this event
        if (rsvpRepository.existsByGuestIdAndEventType(guest.getId(), request.eventType())) {
            throw new BusinessException("Você já confirmou presença para este evento.");
        }

        // Create RSVP
        RSVP rsvp = RSVP.builder()
            .guest(guest)
            .eventType(request.eventType())
            .attending(true)
            .guestsCount(1)
            .message(request.mensagem())
            .build();

        rsvp = rsvpRepository.save(rsvp);

        return mapToResponse(rsvp);
    }

    @Transactional(readOnly = true)
    public List<RSVPResponse> listByEventType(EventType eventType) {
        return rsvpRepository.findByEventType(eventType)
            .stream()
            .map(this::mapToResponse)
            .toList();
    }

    private Guest createGuest(RSVPRequest request) {
        Guest guest = Guest.builder()
            .name(request.nomeCompleto())
            .phone(request.contato())
            .build();
        return guestRepository.save(guest);
    }

    private RSVPResponse mapToResponse(RSVP rsvp) {
        return new RSVPResponse(
            rsvp.getId(),
            rsvp.getGuest().getName(),
            rsvp.getMessage(),
            rsvp.getConfirmedAt()
        );
    }
}
