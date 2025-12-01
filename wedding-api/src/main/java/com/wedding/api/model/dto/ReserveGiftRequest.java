package com.wedding.api.model.dto;

import com.wedding.api.model.enums.EventType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ReserveGiftRequest(
    @NotNull(message = "ID do presente é obrigatório")
    Long giftId,

    @NotNull(message = "Tipo do evento é obrigatório")
    EventType tipo,

    @NotBlank(message = "Nome é obrigatório")
    String name,

    @NotBlank(message = "Telefone é obrigatório")
    String phone
) {}
