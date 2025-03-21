package com.library.library.Library;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


//Find and modify
@Data
@Document(collection = "user_profile")
public class UserProfile {
    @Id
    private String id; //reference to the User ID

    private String location = "";
    private double balance = 0.0;
    private List<String> likedItems = new ArrayList<>();
    private Map<String, Integer> cart = new HashMap<>();

    public UserProfile(String id) {
        this.id = id;
    }


}
