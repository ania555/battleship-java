package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Stream;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class SalvoController {

    private GamePlayerRepository gamePlayerRepository;

    @Autowired
    private GameRepository gameRepository;


   @RequestMapping("/games")
   public List<Object> getAllGames() {
       return gameRepository.findAll().stream()
               .map(game -> makeGameDTO(game))
               .collect(Collectors.toList());
   }

   public Map<String, Object> makeGameDTO(Game game) {
        Map<String, Object> oneGame = new LinkedHashMap<String, Object>();
        oneGame.put("id", game.getId());
        oneGame.put("created", game.getCreationDate());
        oneGame.put("gamePlayers", getGamePlayers(game));
        return oneGame;
   }

   public List<Object> getGamePlayers(Game game) {
        return game.getGamePlayers().stream()
                .map(gplr -> gplr.getId())
                .collect(Collectors.toList());
        }




   }

   /* public List<Object> getAllGames() {
    return gameRepository.findAll().stream().map(a -> a.getId()).collect(Collectors.toList());
    }*/




