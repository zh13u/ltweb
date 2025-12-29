package org.example.service.interf;

import org.example.dto.AddressDto;
import org.example.dto.Response;

public interface AddressService {
    Response saveAndUpdateAddress(AddressDto addressDto);
}