package org.example.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    private Long id;

    @Email(message = "Email is not valid")
    private String email;

    @Size(min = 3, message = "Name must be at least 3 characters")
    private String name;

    @Size(min = 10, message = "Phone number must be at least 10 characters")
    private String phoneNumber;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    private String role;
    private List<OrderItemDto> orderItemList;
    private AddressDto address;
    private java.time.LocalDateTime createdAt;
}