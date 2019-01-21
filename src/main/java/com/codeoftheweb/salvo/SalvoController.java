package com.codeoftheweb.salvo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Stream;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private GamePlayerRepository gamePlayerRepository;

    @Autowired
    private GameRepository gameRepository;

    @RequestMapping(value="/players", method= RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> createUser(@RequestParam String userName, @RequestParam String password) {
        Map<String, Object> showCrPlayer = new LinkedHashMap<String, Object>();
        if (userName.isEmpty()) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "No name"), HttpStatus.FORBIDDEN);
        }
        Player user = playerRepository.findByUserName(userName);
        if (user != null) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Username already exists"), HttpStatus.CONFLICT);
        }
        Player newPlayer = playerRepository.save(new Player(userName, password));
        return new ResponseEntity<Map<String, Object>>(makeMap("userName", newPlayer.getUserName()), HttpStatus.CREATED);
    }

    @RequestMapping("/leader_board")
    public Object getLeaderBoard() {
        return playerRepository.findAll().stream()
                .map(player -> makeLeaderBoardDTO(player))
                .collect(Collectors.toList());
    }

    @RequestMapping("/game_view/{id}")
    public ResponseEntity<Map<String, Object>> getGamePlayerView(@PathVariable Long id, Authentication authentication) {
        Map<String, Object> oneGamePlayer = new LinkedHashMap<String, Object>();
        oneGamePlayer.put("id", gamePlayerRepository.findOne(id).getGame().getId());
        oneGamePlayer.put("created", gamePlayerRepository.findOne(id).getGame().getCreationDate());
        oneGamePlayer.put("gamePlayers", gamePlayerRepository.findOne(id).getGame().getGamePlayers().stream()
        .map(gamePl -> makeGmPlayerDTO(gamePl))
        .collect(Collectors.toList()));
        oneGamePlayer.put("ships", gamePlayerRepository.findOne(id).getShips().stream()
        .map(oneShip -> makeShipsDTO(oneShip))
        .collect(Collectors.toList()));
        oneGamePlayer.put("salvoes", gamePlayerRepository.findOne(id).getGame().getGamePlayers().stream()
        .map(gamePl -> makeSalGmPlayerDTO(gamePl))
        .collect(Collectors.toList()));
        if (playerRepository.findByUserName(authentication.getName()).getUserName() == gamePlayerRepository.findOne(id).getPlayer().getUserName()) {
            return new  ResponseEntity<Map<String, Object>>(oneGamePlayer, HttpStatus.OK);
        }
        else {return new  ResponseEntity<Map<String, Object>>(makeMap("error", "unauthorized"), HttpStatus.UNAUTHORIZED);}
        //return oneGamePlayer;
    }

   @RequestMapping("/games")
   public Map<String, Object> makeLogedPlayerGamesDTO(Authentication authentication) {
       Map<String, Object> logPlayerGames = new LinkedHashMap<String, Object>();
       if (isGuest(authentication) == false) {
           logPlayerGames.put("player", makeLogPlayerDTO(playerRepository.findByUserName(authentication.getName())));
           logPlayerGames.put("games", getAllGames());
       }
       else {
           logPlayerGames.put("player", makeEmptyDTO());
           logPlayerGames.put("games", getAllGames());
       }
       return logPlayerGames;
   }

   private Map<String, Object> makeLogPlayerDTO(Player player) {
       Map<String, Object> logPlayer = new LinkedHashMap<String, Object>();
           logPlayer.put("id", player.getId());
           logPlayer.put("name", player.getUserName());
           return logPlayer;
    }

   private Map<String, Object> makeEmptyDTO() {
       Map<String, Object> emptyPlayer = new LinkedHashMap<String, Object>();
        emptyPlayer.put("id", null);
        emptyPlayer.put("name", null);
        return emptyPlayer;
   }

    private boolean isGuest(Authentication authentication) {
        return authentication == null || authentication instanceof AnonymousAuthenticationToken;
    }


   private List<Object> getAllGames() {
       return gameRepository.findAll().stream()
               .map(game -> makeGameDTO(game))
               .collect(Collectors.toList());
   }

   private Map<String, Object> makeGameDTO(Game game) {
        Map<String, Object> oneGame = new LinkedHashMap<String, Object>();
        oneGame.put("id", game.getId());
        oneGame.put("created", game.getCreationDate());
        oneGame.put("gamePlayers", getMyGamePlayers(game));
        return oneGame;
   }

   private List<Object> getMyGamePlayers(Game game) {
        return game.getGamePlayers().stream()
                .map(gamePl -> makeGmPlayerDTO(gamePl))
                .collect(Collectors.toList());
        }

   private Map<String, Object> makeGmPlayerDTO(GamePlayer gamePlayer) {
        Map<String, Object> oneGmPlayer = new LinkedHashMap<String, Object>();
        oneGmPlayer.put("id", gamePlayer.getId());
        oneGmPlayer.put("score", showResult(gamePlayer.getScore()));
        oneGmPlayer.put("player", makePlayerDTO(gamePlayer.getPlayer()));
        return oneGmPlayer;
   }

   private Map<String, Object> makePlayerDTO(Player player) {
        Map<String, Object> onePlayer = new LinkedHashMap<String, Object>();
        onePlayer.put("id", player.getId());
        onePlayer.put("email", player.getUserName());
        return onePlayer;
   }

   private  Map<String, Object> makeShipsDTO(Ship ship) {
        Map<String, Object> aoneShip = new LinkedHashMap<String, Object>();
        aoneShip.put("type", ship.getType());
        aoneShip.put("locations", ship.getLocations());
        return aoneShip;
   }


   private Map<String, Object> makeSalGmPlayerDTO(GamePlayer gamePlayer) {
       Map<String, Object> oneSalGmPl = new LinkedHashMap<String, Object>();
       oneSalGmPl.put("gamePlayerId", gamePlayer.getId());
       oneSalGmPl.put("gamePlayerEmail", gamePlayer.getPlayer().getUserName());
       oneSalGmPl.put("gamePlayerSalvoes", gamePlayer.getSalvoes().stream()
       .map(salvo -> makeSalvoesDTO(salvo))
       .collect(Collectors.toList()));
       return oneSalGmPl;
   }

    private Map<String, Object> makeSalvoesDTO(Salvo salvo) {
        Map<String, Object> oneSalvo = new LinkedHashMap<String, Object>();
        oneSalvo.put("turn", salvo.getTurnNumber());
        oneSalvo.put("locations", salvo.getLocations());
        return oneSalvo;
    }

    private String showResult(Score score) {
        if (score == null) { return "game not finished"; }
        else { return score.getResult(); }
    }

    private Map<String, Object> makeLeaderBoardDTO(Player player) {
        Map<String, Object> onePlayer = new LinkedHashMap<String, Object>();
        onePlayer.put("id", player.getId());
        onePlayer.put("email", player.getUserName());
        onePlayer.put("totalScore", countTotalScore(player));
        onePlayer.put("win_count", countWins(player));
        onePlayer.put("loss_count", countLosses(player));
        onePlayer.put("tie_count", countTies(player));
        return onePlayer;
    }

    private int countWins(Player player) {
        List<Object> wins = player.getScores().stream().filter(p -> p.getResult().equals("won")).collect(Collectors.toList());
        return wins.size();
    }

    private int countLosses(Player player) {
        List<Object> losses = player.getScores().stream().filter(p -> p.getResult().equals("lost")).collect(Collectors.toList());
        return losses.size();
    }

    private int countTies(Player player) {
        List<Object> ties = player.getScores().stream().filter(p -> p.getResult().equals("tied")).collect(Collectors.toList());
        return ties.size();
    }

    private double countTotalScore(Player player) {
        //double wins = countWins(player);
        //double ties = countTies(player);
        //double total = 1 * wins + 0.5 * ties;
        return 1* countWins(player) + 0.5 * countTies(player);
    }

    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }

  }





