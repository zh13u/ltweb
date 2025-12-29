package org.example.controller;

import org.example.dto.Response;
import org.example.dto.UserDto;
import org.example.service.interf.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping("/get-all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_ADMIN')")
    public ResponseEntity<Response> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/admin/get-all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_ADMIN')")
    public ResponseEntity<Response> getAllAdmins(){
        return ResponseEntity.ok(userService.getAllAdmins());
    }

    @GetMapping("/my-info")
    public ResponseEntity<Response> getUserInfoAndOrderHistory(){
        return ResponseEntity.ok(userService.getUserInfoAndOrderHistory());
    }

    @PostMapping("/admin/create-normal-admin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> createNormalAdmin(@RequestBody UserDto adminDto){
        return ResponseEntity.ok(userService.createNormalAdmin(adminDto));
    }

    @PutMapping("/admin/update-normal-admin/{adminId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> updateNormalAdmin(@PathVariable Long adminId, @RequestBody UserDto adminDto){
        return ResponseEntity.ok(userService.updateNormalAdmin(adminId, adminDto));
    }

    @DeleteMapping("/admin/delete-normal-admin/{adminId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deleteNormalAdmin(@PathVariable Long adminId){
        return ResponseEntity.ok(userService.deleteNormalAdmin(adminId));
    }

    @PutMapping("/admin/change-normal-admin-password/{adminId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> changeNormalAdminPassword(
            @PathVariable Long adminId,
            @RequestParam String oldPassword,
            @RequestParam String newPassword){
        return ResponseEntity.ok(userService.changeNormalAdminPassword(adminId, oldPassword, newPassword));
    }
}