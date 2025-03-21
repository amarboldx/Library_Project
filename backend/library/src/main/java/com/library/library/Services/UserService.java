package com.library.library.Services;

import com.library.library.Library.UserProfile;
import com.library.library.Repo.BookRepo;
import com.library.library.Repo.UserProfileRepo;
import com.library.library.Repo.UserRepo;
import com.library.library.Library.User;
import com.library.library.UserCredentials.Users.Login.ChangePasswordRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserService {
    private final UserRepo userRepo;
    private final UserProfileRepo userProfileRepo;
    private final PasswordEncoder passwordEncoder;
    private final MongoTemplate mongoTemplate;
    private final BookRepo bookRepo;


    public void registerUser(User user){
        Optional<User> existingUser = userRepo.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            throw new IllegalStateException("Username already taken");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);

        existingUser = userRepo.findByUsername(user.getUsername());

        if(existingUser.isPresent()){
            String userId = existingUser.get().getId();
            userProfileRepo.save(new UserProfile(userId));
        }

    }

    public UserProfile increaseUserBalance(String userId, double balance) {
        Query query = new Query(Criteria.where("id").is(userId));
        Update update = new Update().inc("balance", balance);

        return mongoTemplate.findAndModify(
                query,
                update,
                UserProfile.class
        );
    }



    public void changePassword(String username, ChangePasswordRequest request) {
        Optional<User> optionalUser = userRepo.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new IllegalStateException("User not found");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalStateException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepo.save(user);
    }
}
