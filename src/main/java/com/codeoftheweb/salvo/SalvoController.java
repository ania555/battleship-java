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
        oneGame.put("gamePlayers", getMyGamePlayers(game));
        return oneGame;
   }

   public List<Object> getMyGamePlayers(Game game) {
        return game.getGamePlayers().stream()
                .map(gamePl -> makeGmPlayerDTO(gamePl))
                .collect(Collectors.toList());
        }

    public Map<String, Object> makeGmPlayerDTO(GamePlayer gamePlayer) {
        Map<String, Object> oneGmPlayer = new LinkedHashMap<String, Object>();
        oneGmPlayer.put("id", gamePlayer.getId());
        oneGmPlayer.put("player", makePlayerDTO(gamePlayer.getPlayer()));
        return oneGmPlayer;
    }

    public Map<String, Object> makePlayerDTO(Player player) {
        Map<String, Object> onePlayer = new LinkedHashMap<String, Object>();
        onePlayer.put("id", player.getId());
        onePlayer.put("email", player.getUserName());
        return onePlayer;
    }
   }

   /* public List<Object> getAllGames() {
    return gameRepository.findAll().stream().map(a -> a.getId()).collect(Collectors.toList());
    }*/




