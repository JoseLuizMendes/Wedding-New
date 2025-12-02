package com.wedding.api.controller;

import com.wedding.api.model.dto.ApiResponse;
import com.wedding.api.model.dto.GiftActionRequest;
import com.wedding.api.model.dto.GiftDTO;
import com.wedding.api.model.dto.ReserveGiftRequest;
import com.wedding.api.model.enums.EventType;
import com.wedding.api.service.GiftService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/gifts")
@RequiredArgsConstructor
@Tag(name = "Gifts", description = "Endpoints para gerenciamento de presentes")
public class GiftController {

    private final GiftService giftService;

    @GetMapping("/{tipo}")
    @Operation(summary = "Listar presentes por tipo de evento")
    public ResponseEntity<List<GiftDTO>> getGifts(@PathVariable EventType tipo) {
        List<GiftDTO> gifts = giftService.getGiftsByEventType(tipo);
        return ResponseEntity.ok(gifts);
    }

    @PostMapping("/reserve")
    @Operation(summary = "Reservar um presente")
    public ResponseEntity<ApiResponse> reserveGift(@Valid @RequestBody ReserveGiftRequest request) {
        String reservationCode = giftService.reserveGift(request);
        return ResponseEntity.ok(ApiResponse.success(
            "Presente reservado com sucesso!",
            Map.of("reservationCode", reservationCode)
        ));
    }

    @PostMapping("/mark-purchased")
    @Operation(summary = "Marcar presente como comprado")
    public ResponseEntity<ApiResponse> markAsPurchased(@Valid @RequestBody GiftActionRequest request) {
        giftService.markAsPurchased(request);
        return ResponseEntity.ok(ApiResponse.success("Presente marcado como comprado!"));
    }

    @PostMapping("/cancel-reservation")
    @Operation(summary = "Cancelar reserva de presente")
    public ResponseEntity<ApiResponse> cancelReservation(@Valid @RequestBody GiftActionRequest request) {
        giftService.cancelReservation(request);
        return ResponseEntity.ok(ApiResponse.success("Reserva cancelada com sucesso!"));
    }
}
