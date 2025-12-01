package com.wedding.api.service;

import com.wedding.api.exception.BusinessException;
import com.wedding.api.exception.GiftNotFoundException;
import com.wedding.api.model.dto.GiftActionRequest;
import com.wedding.api.model.dto.GiftDTO;
import com.wedding.api.model.dto.ReserveGiftRequest;
import com.wedding.api.model.entity.Gift;
import com.wedding.api.model.enums.EventType;
import com.wedding.api.model.enums.GiftStatus;
import com.wedding.api.repository.GiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GiftService {

    private static final String ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 6;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final GiftRepository giftRepository;

    @Transactional(readOnly = true)
    public List<GiftDTO> getGiftsByEventType(EventType eventType) {
        return giftRepository.findByEventType(eventType)
            .stream()
            .map(this::mapToDTO)
            .toList();
    }

    @Transactional
    public String reserveGift(ReserveGiftRequest request) {
        Gift gift = giftRepository.findByIdAndEventType(request.giftId(), request.tipo())
            .orElseThrow(() -> new GiftNotFoundException(request.giftId()));

        if (gift.getStatus() != GiftStatus.AVAILABLE) {
            throw new BusinessException("Este presente não está mais disponível para reserva.");
        }

        String reservationCode = generateReservationCode();

        gift.setStatus(GiftStatus.RESERVED);
        gift.setReservedBy(request.name());
        gift.setReservedByPhone(request.phone());
        gift.setReservationCode(reservationCode);
        gift.setReservedAt(Instant.now());

        giftRepository.save(gift);

        return reservationCode;
    }

    @Transactional
    public void markAsPurchased(GiftActionRequest request) {
        Gift gift = giftRepository.findByIdAndEventType(request.giftId(), request.tipo())
            .orElseThrow(() -> new GiftNotFoundException(request.giftId()));

        validateReservationCode(gift, request.code());

        if (gift.getStatus() != GiftStatus.RESERVED) {
            throw new BusinessException("Este presente não está reservado.");
        }

        gift.setStatus(GiftStatus.PURCHASED);
        gift.setPurchasedAt(Instant.now());

        giftRepository.save(gift);
    }

    @Transactional
    public void cancelReservation(GiftActionRequest request) {
        Gift gift = giftRepository.findByIdAndEventType(request.giftId(), request.tipo())
            .orElseThrow(() -> new GiftNotFoundException(request.giftId()));

        validateReservationCode(gift, request.code());

        if (gift.getStatus() != GiftStatus.RESERVED) {
            throw new BusinessException("Este presente não está reservado.");
        }

        gift.setStatus(GiftStatus.AVAILABLE);
        gift.setReservedBy(null);
        gift.setReservedByPhone(null);
        gift.setReservationCode(null);
        gift.setReservedAt(null);

        giftRepository.save(gift);
    }

    private void validateReservationCode(Gift gift, String code) {
        if (gift.getReservationCode() == null || !gift.getReservationCode().equals(code)) {
            throw new BusinessException("Código de reserva inválido.");
        }
    }

    private String generateReservationCode() {
        StringBuilder code = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            code.append(ALPHANUMERIC.charAt(RANDOM.nextInt(ALPHANUMERIC.length())));
        }
        return code.toString();
    }

    private GiftDTO mapToDTO(Gift gift) {
        return new GiftDTO(
            gift.getId(),
            gift.getName(),
            gift.getDescription(),
            gift.getImageUrl(),
            gift.getPrice(),
            gift.getEventType(),
            gift.getStatus()
        );
    }
}
