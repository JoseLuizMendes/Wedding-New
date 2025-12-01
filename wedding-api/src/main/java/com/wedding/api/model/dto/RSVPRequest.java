package com.wedding.api.model.dto;

import com.wedding.api.model.enums.EventType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RSVPRequest(
    @NotBlank(message = "Nome completo é obrigatório")
    String nomeCompleto,

    @NotBlank(message = "Contato é obrigatório")
    String contato,

    String mensagem,

    @NotNull(message = "Tipo do evento é obrigatório")
    EventType eventType
) {}
