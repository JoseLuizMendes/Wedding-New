package com.wedding.api.exception;

public class GiftNotFoundException extends BusinessException {

    public GiftNotFoundException(Long id) {
        super("Presente não encontrado com ID: " + id);
    }

    public GiftNotFoundException(String message) {
        super(message);
    }
}
