package com.library.library.Controller;

import com.library.library.Repo.UserRepo;
import com.library.library.Services.UserService;
import com.library.library.Library.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserController {
    private final UserService userService;

    private final UserRepo userRepo;


    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user){
        user.setRole(user.getRole());
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }



//    @GetMapping("/current-user")
//    public String getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
//        return userDetails.getUsername();
//        return LoggedInUserUtil.getLoggedInUser();
//    }

}
