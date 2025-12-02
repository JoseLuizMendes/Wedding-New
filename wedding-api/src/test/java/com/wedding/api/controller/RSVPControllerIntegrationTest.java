package com.wedding.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wedding.api.model.dto.RSVPRequest;
import com.wedding.api.model.entity.Guest;
import com.wedding.api.model.entity.RSVP;
import com.wedding.api.model.enums.EventType;
import com.wedding.api.repository.GuestRepository;
import com.wedding.api.repository.RSVPRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RSVPControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RSVPRepository rsvpRepository;

    @Autowired
    private GuestRepository guestRepository;

    @BeforeEach
    void setUp() {
        rsvpRepository.deleteAll();
        guestRepository.deleteAll();
    }

    @Test
    void shouldConfirmWeddingPresence() throws Exception {
        RSVPRequest request = new RSVPRequest(
            "João Silva",
            "11999998888",
            "Parabéns pelo casamento!",
            null
        );

        mockMvc.perform(post("/api/v1/rsvp/casamento")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("João Silva"))
            .andExpect(jsonPath("$.message").value("Parabéns pelo casamento!"))
            .andExpect(jsonPath("$.confirmedAt").isNotEmpty());

        // Verify database
        assertThat(rsvpRepository.count()).isEqualTo(1);
        assertThat(guestRepository.count()).isEqualTo(1);

        RSVP savedRsvp = rsvpRepository.findAll().get(0);
        assertThat(savedRsvp.getEventType()).isEqualTo(EventType.CASAMENTO);
        assertThat(savedRsvp.getGuest().getName()).isEqualTo("João Silva");
    }

    @Test
    void shouldConfirmBridalShowerPresence() throws Exception {
        RSVPRequest request = new RSVPRequest(
            "Maria Santos",
            "21988887777",
            "Felicidades!",
            null
        );

        mockMvc.perform(post("/api/v1/rsvp/cha-panela")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Maria Santos"))
            .andExpect(jsonPath("$.id").isNumber());

        // Verify database
        RSVP savedRsvp = rsvpRepository.findAll().get(0);
        assertThat(savedRsvp.getEventType()).isEqualTo(EventType.CHA_PANELA);
    }

    @Test
    void shouldRejectDuplicateConfirmation() throws Exception {
        // First confirmation
        RSVPRequest request = new RSVPRequest(
            "João Silva",
            "11999998888",
            "Mensagem",
            null
        );

        mockMvc.perform(post("/api/v1/rsvp/casamento")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk());

        // Second confirmation with same phone (should fail)
        mockMvc.perform(post("/api/v1/rsvp/casamento")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldRejectInvalidRequest() throws Exception {
        // Empty required fields
        RSVPRequest request = new RSVPRequest(
            "",
            "",
            null,
            null
        );

        mockMvc.perform(post("/api/v1/rsvp/casamento")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldListConfirmationsByEventType() throws Exception {
        // Create a guest and RSVP first
        Guest guest = Guest.builder()
            .name("Test Guest")
            .phone("11999991111")
            .build();
        guest = guestRepository.save(guest);

        RSVP rsvp = RSVP.builder()
            .guest(guest)
            .eventType(EventType.CASAMENTO)
            .attending(true)
            .message("Test message")
            .build();
        rsvpRepository.save(rsvp);

        mockMvc.perform(get("/api/v1/rsvp/CASAMENTO/list"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void shouldReturnEmptyListWhenNoConfirmations() throws Exception {
        mockMvc.perform(get("/api/v1/rsvp/CASAMENTO/list"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void shouldAllowSameGuestForDifferentEvents() throws Exception {
        RSVPRequest request = new RSVPRequest(
            "João Silva",
            "11999998888",
            "Mensagem",
            null
        );

        // Confirm for wedding
        mockMvc.perform(post("/api/v1/rsvp/casamento")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk());

        // Confirm for bridal shower (same person, different event - should work)
        mockMvc.perform(post("/api/v1/rsvp/cha-panela")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk());

        assertThat(rsvpRepository.count()).isEqualTo(2);
        assertThat(guestRepository.count()).isEqualTo(1); // Same guest
    }
}
