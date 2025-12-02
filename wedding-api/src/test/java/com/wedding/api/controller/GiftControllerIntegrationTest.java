package com.wedding.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wedding.api.model.dto.GiftActionRequest;
import com.wedding.api.model.dto.ReserveGiftRequest;
import com.wedding.api.model.entity.Gift;
import com.wedding.api.model.enums.EventType;
import com.wedding.api.model.enums.GiftStatus;
import com.wedding.api.repository.GiftRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class GiftControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private GiftRepository giftRepository;

    private Gift testGift;

    @BeforeEach
    void setUp() {
        giftRepository.deleteAll();

        testGift = Gift.builder()
            .name("Jogo de Panelas")
            .description("Conjunto de panelas antiaderentes")
            .imageUrl("https://example.com/image.jpg")
            .price(new BigDecimal("299.90"))
            .eventType(EventType.CASAMENTO)
            .status(GiftStatus.AVAILABLE)
            .build();
        testGift = giftRepository.save(testGift);
    }

    @Test
    void shouldListGiftsByEventType() throws Exception {
        mockMvc.perform(get("/api/v1/gifts/CASAMENTO"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].name").value("Jogo de Panelas"))
            .andExpect(jsonPath("$[0].status").value("AVAILABLE"));
    }

    @Test
    void shouldReturnEmptyListForNoGifts() throws Exception {
        giftRepository.deleteAll();

        mockMvc.perform(get("/api/v1/gifts/CHA_PANELA"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void shouldReserveGift() throws Exception {
        ReserveGiftRequest request = new ReserveGiftRequest(
            testGift.getId(),
            EventType.CASAMENTO,
            "João Silva",
            "11999998888"
        );

        mockMvc.perform(post("/api/v1/gifts/reserve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Presente reservado com sucesso!"))
            .andExpect(jsonPath("$.data.reservationCode").isNotEmpty());

        // Verify database
        Gift updatedGift = giftRepository.findById(testGift.getId()).orElseThrow();
        assertThat(updatedGift.getStatus()).isEqualTo(GiftStatus.RESERVED);
        assertThat(updatedGift.getReservedBy()).isEqualTo("João Silva");
        assertThat(updatedGift.getReservedByPhone()).isEqualTo("11999998888");
        assertThat(updatedGift.getReservationCode()).isNotNull();
    }

    @Test
    void shouldNotReserveAlreadyReservedGift() throws Exception {
        // First, reserve the gift
        testGift.setStatus(GiftStatus.RESERVED);
        testGift.setReservedBy("Maria");
        testGift.setReservationCode("ABC123");
        giftRepository.save(testGift);

        // Try to reserve again
        ReserveGiftRequest request = new ReserveGiftRequest(
            testGift.getId(),
            EventType.CASAMENTO,
            "João Silva",
            "11999998888"
        );

        mockMvc.perform(post("/api/v1/gifts/reserve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Este presente não está mais disponível para reserva."));
    }

    @Test
    void shouldMarkGiftAsPurchased() throws Exception {
        // First, reserve the gift
        String reservationCode = "TEST123";
        testGift.setStatus(GiftStatus.RESERVED);
        testGift.setReservationCode(reservationCode);
        giftRepository.save(testGift);

        GiftActionRequest request = new GiftActionRequest(
            testGift.getId(),
            EventType.CASAMENTO,
            reservationCode
        );

        mockMvc.perform(post("/api/v1/gifts/mark-purchased")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Presente marcado como comprado!"));

        // Verify database
        Gift updatedGift = giftRepository.findById(testGift.getId()).orElseThrow();
        assertThat(updatedGift.getStatus()).isEqualTo(GiftStatus.PURCHASED);
        assertThat(updatedGift.getPurchasedAt()).isNotNull();
    }

    @Test
    void shouldNotMarkPurchasedWithWrongCode() throws Exception {
        // First, reserve the gift
        testGift.setStatus(GiftStatus.RESERVED);
        testGift.setReservationCode("CORRECT123");
        giftRepository.save(testGift);

        GiftActionRequest request = new GiftActionRequest(
            testGift.getId(),
            EventType.CASAMENTO,
            "WRONG123"
        );

        mockMvc.perform(post("/api/v1/gifts/mark-purchased")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Código de reserva inválido."));
    }

    @Test
    void shouldCancelReservation() throws Exception {
        // First, reserve the gift
        String reservationCode = "TEST123";
        testGift.setStatus(GiftStatus.RESERVED);
        testGift.setReservedBy("João");
        testGift.setReservedByPhone("11999998888");
        testGift.setReservationCode(reservationCode);
        giftRepository.save(testGift);

        GiftActionRequest request = new GiftActionRequest(
            testGift.getId(),
            EventType.CASAMENTO,
            reservationCode
        );

        mockMvc.perform(post("/api/v1/gifts/cancel-reservation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Reserva cancelada com sucesso!"));

        // Verify database
        Gift updatedGift = giftRepository.findById(testGift.getId()).orElseThrow();
        assertThat(updatedGift.getStatus()).isEqualTo(GiftStatus.AVAILABLE);
        assertThat(updatedGift.getReservedBy()).isNull();
        assertThat(updatedGift.getReservationCode()).isNull();
    }

    @Test
    void shouldNotCancelWithWrongCode() throws Exception {
        // First, reserve the gift
        testGift.setStatus(GiftStatus.RESERVED);
        testGift.setReservationCode("CORRECT123");
        giftRepository.save(testGift);

        GiftActionRequest request = new GiftActionRequest(
            testGift.getId(),
            EventType.CASAMENTO,
            "WRONG123"
        );

        mockMvc.perform(post("/api/v1/gifts/cancel-reservation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Código de reserva inválido."));
    }

    @Test
    void shouldReturnNotFoundForNonExistentGift() throws Exception {
        ReserveGiftRequest request = new ReserveGiftRequest(
            999999L,
            EventType.CASAMENTO,
            "João Silva",
            "11999998888"
        );

        mockMvc.perform(post("/api/v1/gifts/reserve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isNotFound());
    }

    @Test
    void shouldRejectInvalidReserveRequest() throws Exception {
        // Missing required fields
        String invalidRequest = "{\"giftId\": null, \"tipo\": null, \"name\": \"\", \"phone\": \"\"}";

        mockMvc.perform(post("/api/v1/gifts/reserve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidRequest))
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldListMultipleGifts() throws Exception {
        // Add more gifts
        Gift gift2 = Gift.builder()
            .name("Liquidificador")
            .description("Liquidificador 1000W")
            .price(new BigDecimal("199.90"))
            .eventType(EventType.CASAMENTO)
            .status(GiftStatus.RESERVED)
            .build();
        giftRepository.save(gift2);

        Gift gift3 = Gift.builder()
            .name("Cafeteira")
            .description("Cafeteira elétrica")
            .price(new BigDecimal("149.90"))
            .eventType(EventType.CASAMENTO)
            .status(GiftStatus.PURCHASED)
            .build();
        giftRepository.save(gift3);

        mockMvc.perform(get("/api/v1/gifts/CASAMENTO"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(3));
    }
}
