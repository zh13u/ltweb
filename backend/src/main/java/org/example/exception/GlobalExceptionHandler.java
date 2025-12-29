package org.example.exception;

import org.example.dto.Response;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.List;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Response> handleAllException(Exception ex, WebRequest request){
        Response errorResponse = Response.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Response> handleNotFoundException(NotFoundException ex, WebRequest request){
        Response errorResponse = Response.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Response> handleInvalidCredentialsExceptionException(InvalidCredentialsException ex, WebRequest request){
        Response errorResponse = Response.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ProductDeletionNotAllowedException.class)
    public ResponseEntity<Response> handleProductDeletionNotAllowedException(ProductDeletionNotAllowedException ex, WebRequest request){
        Response errorResponse = Response.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class})
    public ResponseEntity<Response> handleValidationException(Exception ex) {
        {
            log.error("Validation exception: {}", ex.getMessage());
            String errorMessage = ex.getMessage();
            if (ex instanceof MethodArgumentNotValidException) {
                errorMessage = ((MethodArgumentNotValidException) ex).getBindingResult().getFieldError().getDefaultMessage();
            } else if (ex instanceof ConstraintViolationException) {
                errorMessage = ((ConstraintViolationException) ex).getConstraintViolations().iterator().next().getMessage();
            }
            Response errorResponse = Response.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message(errorMessage)
                    .build();

            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }
}