package com.codeoftheweb.salvo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;
import java.util.stream.Collector;
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

    @Autowired
    private ShipRepository shipRepository;

    @Autowired
    private SalvoRepository salvoRepository;

    @Autowired
    private ScoreRepository scoreRepository;


    @RequestMapping(value="/games/players/{gamePlayerId}/salvoes", method= RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> sendSalvoes(@PathVariable Long gamePlayerId, @RequestBody Salvo salvo, Authentication authentication) {
        if (isGuest(authentication) == true) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "No name"), HttpStatus.FORBIDDEN);
        }

        Player user = playerRepository.findByUserName(authentication.getName());
        if (user == null) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Unauthorised"), HttpStatus.UNAUTHORIZED);
        }

        GamePlayer thisGmPl = gamePlayerRepository.findOne(gamePlayerId);
        if (thisGmPl == null) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Unauthorised"), HttpStatus.UNAUTHORIZED);
        }

        String thisGmPlName = thisGmPl.getPlayer().getUserName();
        if (user.getUserName() != thisGmPlName) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Unauthorised"), HttpStatus.UNAUTHORIZED);
        }

        Set<Ship> gmPlShips = thisGmPl.getShips();
        if (gmPlShips.size() < 5) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Ships not placed"), HttpStatus.FORBIDDEN);
        }

        GamePlayer opponent = thisGmPl.getGame().getGamePlayers().stream().filter(gPl -> gPl.getPlayer().getUserName() != authentication.getName()).findAny().orElse(null);
        if (opponent == null) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Opponent did not enter the game"), HttpStatus.FORBIDDEN);
        }
        if (opponent.getShips().size() == 0) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Opponent did not placed his ships"), HttpStatus.FORBIDDEN);
        }

        Salvo currentTurn = thisGmPl.getSalvoes().stream().filter(s ->  s.getTurnNumber() == salvo.getTurnNumber()).findAny().orElse(null);
        if (currentTurn != null) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Salvo for this turn shot"), HttpStatus.FORBIDDEN);
        }

        int thisTurnNumb = salvo.getTurnNumber();
        Salvo previousSalvo = thisGmPl.getSalvoes().stream().filter(s ->  s.getTurnNumber() == thisTurnNumb - 1).findAny().orElse(null);
        if (salvo.getTurnNumber() > 1 && previousSalvo == null) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "False turn number"), HttpStatus.FORBIDDEN);
        }

        if (salvo.getLocations().size() > 3) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "To many shots"), HttpStatus.FORBIDDEN);
        }

        if (checkIfgameOver(gamePlayerId) != "continue") {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Game over"), HttpStatus.FORBIDDEN);
        }

        salvoRepository.save(new Salvo(salvo.getTurnNumber(), thisGmPl, salvo.getLocations()));
        setHitsAndSinks(salvo, opponent, "Aircraft Carrier");
        setHitsAndSinks(salvo, opponent, "Battleship");
        setHitsAndSinks(salvo, opponent, "Submarine");
        setHitsAndSinks(salvo, opponent, "Destroyer");
        setHitsAndSinks(salvo, opponent, "Patrol Boat");
        return new ResponseEntity<Map<String, Object>>(makeMap("success", "Salvo created"), HttpStatus.CREATED);
    }

    private void setHitsAndSinks(Salvo salvo, GamePlayer gamePlayer, String shipType) {
        Set<Ship> opponentShips = gamePlayer.getShips();
        Ship currentShip = opponentShips.stream().filter(ship -> ship.getType().equals(shipType)).findAny().orElse(null);
        if (currentShip == null) {return;}
        List<String> hitsCurrentShip = currentShip.getLocations().stream().filter(l -> salvo.getLocations().contains(l)).collect(Collectors.toList());
        if (hitsCurrentShip.size() == 0) {return;}
        currentShip.getHits().addAll(hitsCurrentShip);
        if (currentShip.getHits().size() == currentShip.getLocations().size()) {currentShip.setState("sunk");}
    }

    @RequestMapping(value="/games/players/{gamePlayerId}/ships", method= RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> placeShips(@PathVariable Long gamePlayerId, @RequestBody List<Ship> ships, Authentication authentication) {
        if (isGuest(authentication) == true) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "No name"), HttpStatus.FORBIDDEN);
        }

        Player user = playerRepository.findByUserName(authentication.getName());
        if (user == null) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Unauthorised"), HttpStatus.UNAUTHORIZED);
        }

        GamePlayer thisGmPl = gamePlayerRepository.findOne(gamePlayerId);
        if (thisGmPl == null) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Unauthorised"), HttpStatus.UNAUTHORIZED);
        }

        String thisGmPlName = thisGmPl.getPlayer().getUserName();
        if (user.getUserName() != thisGmPlName) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Unauthorised"), HttpStatus.UNAUTHORIZED);
        }

        Set thisGmPlShips = thisGmPl.getShips();
        if (thisGmPlShips.size() != 0) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Ships already placed"), HttpStatus.FORBIDDEN);
        }

        if (ships.size() != 5) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Not all ships sent"), HttpStatus.FORBIDDEN);
        }
        ships.stream().map(ship -> shipRepository.save(new Ship(ship.getType(), ship.getLocations(), new ArrayList<String>(), "OK", thisGmPl))).collect(Collectors.toList());
        return new ResponseEntity<Map<String, Object>>(makeMap("success", "Ships created"), HttpStatus.CREATED);
    }


    @RequestMapping(path="/game/{gameId}/players", method= RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> joinGame(@PathVariable Long gameId, Authentication authentication) {
        if (isGuest(authentication) == true) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "No name"), HttpStatus.FORBIDDEN);
        }
        Player user = playerRepository.findByUserName(authentication.getName());
        if (user == null) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Unauthorised"), HttpStatus.UNAUTHORIZED);
        }
        Game thisGame = gameRepository.findOne(gameId);
        if (thisGame == null) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "No such game"), HttpStatus.FORBIDDEN);
        }
        int size = thisGame.getGamePlayers().stream().collect(Collectors.toList()).size();
        if (size > 1) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "game is full"), HttpStatus.FORBIDDEN);
        }

        GamePlayer newGamePlayer = new GamePlayer(thisGame, user);
        gamePlayerRepository.save(newGamePlayer);
        return new ResponseEntity<Map<String, Object>>(makeMap("gpId", newGamePlayer.getId()), HttpStatus.CREATED);
    }

    @RequestMapping(value="/games", method= RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> createGame(Authentication authentication) {
        if (isGuest(authentication) == true) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "No name"), HttpStatus.FORBIDDEN);
        }
        Player user = playerRepository.findByUserName(authentication.getName());
        if (user == null) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Unauthorised"), HttpStatus.UNAUTHORIZED);
        }
        Game newGame = gameRepository.save(new Game(new Date()));
        GamePlayer newGamePlayer = gamePlayerRepository.save(new GamePlayer(newGame, user));
        return new ResponseEntity<Map<String, Object>>(makeMap("gpId", newGamePlayer.getId()), HttpStatus.CREATED);
    }

    @RequestMapping(value="/players", method= RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> createUser(@RequestParam String userName, @RequestParam String password) {
        if (userName.isEmpty() || password.isEmpty()) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "No name or password"), HttpStatus.FORBIDDEN);
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
        oneGamePlayer.put("history", gamePlayerRepository.findOne(id).getGame().getGamePlayers().stream()
        .map(gamePl -> makeHitsAndSinksGmPlayerDTO(gamePl))
        .collect(Collectors.toList()));
        oneGamePlayer.put("gameState", showGameState(id));
        if (playerRepository.findByUserName(authentication.getName()).getUserName() == gamePlayerRepository.findOne(id).getPlayer().getUserName()) {
            return new  ResponseEntity<Map<String, Object>>(oneGamePlayer, HttpStatus.OK);
        }
        else {return new  ResponseEntity<Map<String, Object>>(makeMap("error", "unauthorized"), HttpStatus.UNAUTHORIZED);}
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
        Map<String, Object> oneShip = new LinkedHashMap<String, Object>();
        oneShip.put("type", ship.getType());
        oneShip.put("locations", ship.getLocations());
        oneShip.put("hits", ship.getHits());
        oneShip.put("sink", ship.getState());
        return oneShip;
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
        onePlayer.put("win_count", countGameReslts(player, "won"));
        onePlayer.put("loss_count", countGameReslts(player, "lost"));
        onePlayer.put("tie_count", countGameReslts(player, "tied"));
        return onePlayer;
    }

    private int countGameReslts (Player player, String option) {
        List<Object> result = player.getScores().stream().filter(p -> p.getResult().equals(option)).collect(Collectors.toList());
        return result.size();
    }

    private double countTotalScore(Player player) {
        return 1* countGameReslts(player, "won") + 0.5 * countGameReslts(player, "tied");
    }

    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }

    private Map<String, Object> makeHitsAndSinksGmPlayerDTO(GamePlayer gamePlayer) {
        Map<String, Object> oneGamePlHistory = new LinkedHashMap<String, Object>();
        String thisGmPUser = gamePlayer.getPlayer().getUserName();
        oneGamePlHistory.put("gamePlayerId", gamePlayer.getId());
        oneGamePlHistory.put("gamePlayerEmail", gamePlayer.getPlayer().getUserName());
        oneGamePlHistory.put("gamePlayerHitsSinks", gamePlayer.getSalvoes().stream()
                .map(salvo -> makeHitsAndSinksDTO(salvo, thisGmPUser))
                .collect(Collectors.toList()));
        return oneGamePlHistory;
    }

    private Map<String, Object> makeHitsAndSinksDTO(Salvo salvo, String userName) {
        Map<String, Object> oneTurnHitsSinks = new LinkedHashMap<String, Object>();
        oneTurnHitsSinks.put("turn", salvo.getTurnNumber());
        oneTurnHitsSinks.put("hits", makeHitsDTO(salvo, userName));
        oneTurnHitsSinks.put("sinks", makeSinksDTO(salvo, userName));
        return oneTurnHitsSinks;
    }

    private Map<String, Object> makeHitsDTO(Salvo salvo, String userName) {
        GamePlayer me = salvo.getGamePlayer().getGame().getGamePlayers().stream().filter(gPl -> gPl.getPlayer().getUserName().equals(userName)).findAny().orElse(null);
        GamePlayer opponent = salvo.getGamePlayer().getGame().getGamePlayers().stream().filter(gPl -> gPl.getPlayer().getUserName() != userName).findAny().orElse(null);
        Set<Ship> opponentShips = opponent.getShips();
        if (opponent == null) {return null;}
        if (opponentShips.size() == 0) {return null;}
        Set<Salvo> mySalvoesTillNow = me.getSalvoes().stream().filter(s -> s.getTurnNumber() <= salvo.getTurnNumber()).collect(Collectors.toSet());
        List<String> allTurnsShots = new ArrayList<>();
        mySalvoesTillNow.forEach((e) -> {allTurnsShots.addAll(e.getLocations());});
        List<String> allHits = new ArrayList<>();
        opponentShips.forEach((e) -> {allHits.addAll(e.getLocations().stream().filter(l -> allTurnsShots.contains(l)).collect(Collectors.toList()));});

        Map<String, Object> oneTurnHits = new LinkedHashMap<String, Object>();
        oneTurnHits.put("hitsLocations", allHits);
        opponentShips.forEach((e) -> {oneTurnHits.put(e.getType(), e.getLocations().stream().filter(l -> salvo.getLocations().contains(l)).collect(Collectors.toList()));});

        return oneTurnHits;
    }


    private Map<String, Object> makeSinksDTO(Salvo salvo, String userName) {
        GamePlayer me = salvo.getGamePlayer().getGame().getGamePlayers().stream().filter(gPl -> gPl.getPlayer().getUserName().equals(userName)).findAny().orElse(null);
        GamePlayer opponent = salvo.getGamePlayer().getGame().getGamePlayers().stream().filter(gPl -> gPl.getPlayer().getUserName() != userName).findAny().orElse(null);
        Set<Ship> opponentShips = opponent.getShips();
        if (opponent == null) {return null;}
        if (opponentShips.size() == 0) {return null;}
        Set<Salvo> mySalvoesTillNow = me.getSalvoes().stream().filter(s -> s.getTurnNumber() <= salvo.getTurnNumber()).collect(Collectors.toSet());
        List<String> allTurnsShots = new ArrayList<>();
        mySalvoesTillNow.forEach((e) -> {allTurnsShots.addAll(e.getLocations());});
        Set<Ship> leftShips = opponentShips.stream().filter(ship -> ship.getLocations().size() > ship.getLocations().stream().filter(l -> allTurnsShots.contains(l)).collect(Collectors.toList()).size()).collect(Collectors.toSet());

        Map<String, Object> oneTurnSinks = new LinkedHashMap<String, Object>();
        oneTurnSinks.put("left", leftShips.size());
        opponentShips.forEach((e) -> {if (e.getLocations().stream().filter(l -> allTurnsShots.contains(l)).collect(Collectors.toList()).size() == e.getLocations().size()) {
            oneTurnSinks.put(e.getType(), "sunk");
        }
        else {oneTurnSinks.put(e.getType(), "OK");}
        });
        opponentShips.forEach((e) -> {if (e.getLocations().stream().filter(l -> allTurnsShots.contains(l)).collect(Collectors.toList()).size() == e.getLocations().size()) {oneTurnSinks.put(e.getType() + "Sunk", e.getLocations());}});

        return oneTurnSinks;
    }


    private String showGameState(Long id) {
        GamePlayer meGamePl = gamePlayerRepository.findOne(id);
        GamePlayer opponentGmPl =  gamePlayerRepository.findOne(id).getGame().getGamePlayers().stream().filter(gpl -> gpl.getId() != id).findAny().orElse(null);

        if (meGamePl.getShips().size() == 0) {return "PlaceShips";}
        if (meGamePl.getShips().size() == 5 && opponentGmPl == null) {return "WaitForOpponentToEnterGame";}
        if (meGamePl.getShips().size() == 5 && opponentGmPl != null && opponentGmPl.getShips().size() == 0) {return "WaitForOpponentToPlaceShips";}
        //if (opponentGmPl == null && meGamePl.getSalvoes().size() == 0) {return "EnterSalvo";}
        //if (opponentGmPl == null && meGamePl.getSalvoes().size() > 0) {return "WaitForOpponentSalvo";}
        if (meGamePl.getShips().size() == 5 && opponentGmPl != null && opponentGmPl.getShips().size() == 5 && checkIfgameOver(id) == "continue" && meGamePl.getSalvoes().size() > opponentGmPl.getSalvoes().size()) {return "WaitForOpponentSalvo";}
        if (meGamePl.getShips().size() == 5 && opponentGmPl != null && opponentGmPl.getShips().size() == 5 && checkIfgameOver(id) == "continue" && meGamePl.getSalvoes().size() < opponentGmPl.getSalvoes().size()) {return "EnterSalvo";}
        if (meGamePl.getShips().size() == 5 && opponentGmPl != null && opponentGmPl.getShips().size() == 5 && checkIfgameOver(id) != "continue" && meGamePl.getSalvoes().size() < opponentGmPl.getSalvoes().size()) {return "EnterSalvo";}
        if (meGamePl.getShips().size() == 5 && opponentGmPl != null && opponentGmPl.getShips().size() == 5 && checkIfgameOver(id) != "continue" && meGamePl.getSalvoes().size() > opponentGmPl.getSalvoes().size()) {return "WaitForOpponentSalvo";}
        if (meGamePl.getShips().size() == 5 && opponentGmPl != null && opponentGmPl.getShips().size() == 5 && checkIfgameOver(id) != "continue" && meGamePl.getSalvoes().size() == opponentGmPl.getSalvoes().size()) {updateScores(id); return "GameOver";}
        return "EnterSalvo";
    }

    private String checkIfgameOver(Long id) {
        GamePlayer me = gamePlayerRepository.findOne(id);
        GamePlayer oponent =  gamePlayerRepository.findOne(id).getGame().getGamePlayers().stream().filter(gpl -> gpl.getId() != id).findAny().orElse(null);
        if (oponent == null) {return "continue";}
        if (oponent.getShips().size() == 0 || me.getShips().size() == 0) {return "continue";}
        if (me.getSalvoes().size() == 0 || oponent.getSalvoes().size() == 0) {return "continue";}

        Set<Ship> leftShipsOpp = oponent.getShips().stream().filter(ship -> ship.getState().equals("OK")).collect(Collectors.toSet());
        Set<Ship> leftShipsMe = me.getShips().stream().filter(ship -> ship.getState().equals("OK")).collect(Collectors.toSet());

        String result;
        if (leftShipsOpp.size() == 0 && leftShipsMe.size() == 0) result = "game over tied";
        else if (leftShipsMe.size() > 0 && leftShipsOpp.size() == 0) result = "game over meWon";
        else if (leftShipsMe.size() == 0 && leftShipsOpp.size() > 0) result = "game over meLost";
        else result = "continue";

        return result;
    }

    private void updateScores(Long id) {
        GamePlayer meGamePl = gamePlayerRepository.findOne(id);
        Game thisGame = meGamePl.getGame();
        Player mePlayer = meGamePl.getPlayer();
        String myResult;
        if (checkIfgameOver(id) == "continue") myResult = null;
        else if (checkIfgameOver(id) == "game over meWon") myResult = "won";
        else if (checkIfgameOver(id) == "game over tied") myResult = "tied";
        else  myResult = "lost";

        if (myResult != null) {scoreRepository.save(new Score(new Date(), myResult, mePlayer, thisGame));}
    }
}





