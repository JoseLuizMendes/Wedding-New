package com.wedding.api.model.dto;

import com.wedding.api.model.enums.EventType;
import jakarta.validation.constraints.NotBlank;

public record RSVPRequest(
    @NotBlank(message = "Nome completo é obrigatório")
    String nomeCompleto,

    @NotBlank(message = "Contato é obrigatório")
    String contato,

    String mensagem,

    EventType eventType
) {}
