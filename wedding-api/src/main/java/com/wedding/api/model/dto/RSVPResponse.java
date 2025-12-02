package com.wedding.api.model.dto;

import java.time.Instant;

public record RSVPResponse(
    Long id,
    String name,
    String message,
    Instant confirmedAt
) {}
