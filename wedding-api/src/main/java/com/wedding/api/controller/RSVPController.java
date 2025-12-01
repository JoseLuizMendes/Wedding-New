package com.wedding.api.controller;

import com.wedding.api.model.dto.ApiResponse;
import com.wedding.api.model.dto.RSVPRequest;
import com.wedding.api.model.dto.RSVPResponse;
import com.wedding.api.model.enums.EventType;
import com.wedding.api.service.RSVPService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rsvp")
@RequiredArgsConstructor
@Tag(name = "RSVP", description = "Endpoints para confirmação de presença")
public class RSVPController {

    private final RSVPService rsvpService;

    @PostMapping("/casamento")
    @Operation(summary = "Confirmar presença no casamento")
    public ResponseEntity<RSVPResponse> confirmWedding(@Valid @RequestBody RSVPRequest request) {
        RSVPRequest weddingRequest = new RSVPRequest(
            request.nomeCompleto(),
            request.contato(),
            request.mensagem(),
            EventType.CASAMENTO
        );
        RSVPResponse response = rsvpService.confirmPresence(weddingRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cha-panela")
    @Operation(summary = "Confirmar presença no chá de panela")
    public ResponseEntity<RSVPResponse> confirmBridalShower(@Valid @RequestBody RSVPRequest request) {
        RSVPRequest showerRequest = new RSVPRequest(
            request.nomeCompleto(),
            request.contato(),
            request.mensagem(),
            EventType.CHA_PANELA
        );
        RSVPResponse response = rsvpService.confirmPresence(showerRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{eventType}/list")
    @Operation(summary = "Listar confirmações por tipo de evento")
    public ResponseEntity<List<RSVPResponse>> listByEvent(@PathVariable EventType eventType) {
        List<RSVPResponse> responses = rsvpService.listByEventType(eventType);
        return ResponseEntity.ok(responses);
    }
}
