package com.library.library.Controller;


import com.library.library.JWT.JwtUtils;
import com.library.library.Library.UserProfile;
import com.library.library.Repo.UserProfileRepo;
import com.library.library.Repo.UserRepo;
import com.library.library.Services.UserService;
import com.library.library.UserCredentials.Users.Login.ChangePasswordRequest;
import com.library.library.UserCredentials.Users.Login.LoginRequest;
import com.library.library.UserCredentials.Users.Login.LoginResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService userService;
    private final UserProfileRepo userProfileRepo;
    private final UserRepo userRepo;

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String jwt = jwtUtils.generateTokenFromUsername(userDetails);



        return ResponseEntity.ok(new LoginResponse(jwt, userDetails.getUsername(), convertAuthorities(userDetails.getAuthorities())));
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChangePasswordRequest request
            ) {
        try {
            userService.changePassword(userDetails.getUsername(), request);
            return ResponseEntity.ok("Password changed successfully");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/add-credit/{amount}")
    public String addCredit(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Double amount
    ){
        if(amount < 0.0){
            return "Balance amount can't be negative";
        }
        String userId;
        if(userRepo.findByUsername(userDetails.getUsername()).isEmpty()){
            return "User not Found";
        }

        userId = userRepo.findByUsername(userDetails.getUsername()).get().getId();
        if(userProfileRepo.findById(userId).isEmpty()){
            return "User not Found";
        }
        userService.increaseUserBalance(userId, amount);
        return String.format("%f has been successfully added to User with ID %s", amount, userId);
    }


    public List<String> convertAuthorities(Collection<? extends GrantedAuthority> authorities) {
        return authorities.stream()
                .map(GrantedAuthority::getAuthority) // Extract authority as String
                .collect(Collectors.toList()); // Collect into a List<String>
    }
}
