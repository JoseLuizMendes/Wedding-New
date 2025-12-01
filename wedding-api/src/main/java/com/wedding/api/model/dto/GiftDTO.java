package com.wedding.api.model.dto;

import com.wedding.api.model.enums.EventType;
import com.wedding.api.model.enums.GiftStatus;

import java.math.BigDecimal;

public record GiftDTO(
    Long id,
    String name,
    String description,
    String imageUrl,
    BigDecimal price,
    EventType eventType,
    GiftStatus status
) {}
