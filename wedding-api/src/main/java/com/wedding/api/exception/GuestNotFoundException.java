package com.wedding.api.exception;

public class GuestNotFoundException extends BusinessException {

    public GuestNotFoundException(Long id) {
        super("Convidado não encontrado com ID: " + id);
    }

    public GuestNotFoundException(String message) {
        super(message);
    }
}
