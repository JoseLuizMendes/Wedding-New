package com.wedding.api.model.dto;

import com.wedding.api.model.enums.EventType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GiftActionRequest(
    @NotNull(message = "ID do presente é obrigatório")
    Long giftId,

    @NotNull(message = "Tipo do evento é obrigatório")
    EventType tipo,

    @NotBlank(message = "Código é obrigatório")
    String code
) {}
