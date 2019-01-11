package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;
import java.util.stream.Stream;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class SalvoController {


    @Autowired
    private GameRepository gameRepository;

   @RequestMapping("/games")
    public List<Object> getAllGames() {
    return gameRepository.findAll().stream().map(a -> a.getId()).collect(Collectors.toList());
    }

}
