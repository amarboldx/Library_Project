package com.library.library.Library;


import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "authors")

public class Author {
    @Id
    public String id;

    @NotBlank
    public String name;

    public Author(String name){
        this.name = name;
    }

}
