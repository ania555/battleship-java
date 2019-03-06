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
        //String userName = playerRepository.findByUserName(authentication.getName()).getUserName();
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

        Salvo currentTurn = thisGmPl.getSalvoes().stream().filter(s ->  s.getTurnNumber() == salvo.getTurnNumber()).findAny().orElse(null);
        if (currentTurn != null) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Salvo for this turn shot"), HttpStatus.FORBIDDEN);
        }

        int thisTurnNumb = salvo.getTurnNumber();
        Salvo previousSalvo = thisGmPl.getSalvoes().stream().filter(s ->  s.getTurnNumber() == thisTurnNumb - 1).findAny().orElse(null);
        if (salvo.getTurnNumber() > 1 && previousSalvo == null) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "False turn number"), HttpStatus.FORBIDDEN);
        }

        if (salvo.getLocations().size() > 5) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "To many shots"), HttpStatus.FORBIDDEN);
        }

        if (checkIfgameOver(gamePlayerId) != "continue") {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Game over"), HttpStatus.FORBIDDEN);
        }

        salvoRepository.save(new Salvo(salvo.getTurnNumber(), thisGmPl, salvo.getLocations()));
        return new ResponseEntity<Map<String, Object>>(makeMap("success", "Salvo created"), HttpStatus.CREATED);

    }

    @RequestMapping(value="/games/players/{gamePlayerId}/ships", method= RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> placeShips(@PathVariable Long gamePlayerId, @RequestBody List<Ship> ships, Authentication authentication) {
        String userName = playerRepository.findByUserName(authentication.getName()).getUserName();
        Player user = playerRepository.findByUserName(userName);
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
        ships.stream().map(ship -> shipRepository.save(new Ship(ship.getType(), ship.getLocations(), thisGmPl))).collect(Collectors.toList());
        return new ResponseEntity<Map<String, Object>>(makeMap("success", "Ships created"), HttpStatus.CREATED);
    }


    @RequestMapping(path="/game/{gameId}/players", method= RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> joinGame(@PathVariable Long gameId, Authentication authentication) {
        String userName = playerRepository.findByUserName(authentication.getName()).getUserName();
        /*if (userName.isEmpty()) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "No name"), HttpStatus.FORBIDDEN);
        }*/
        Player user = playerRepository.findByUserName(userName);
        System.out.println(user);
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
        String userName = playerRepository.findByUserName(authentication.getName()).getUserName();
        if (userName.isEmpty()) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "No name"), HttpStatus.FORBIDDEN);
        }
        Player user = playerRepository.findByUserName(userName);
        if (user == null) {
            return new ResponseEntity<Map<String, Object>>(makeMap("error", "Unauthorised"), HttpStatus.UNAUTHORIZED);
        }
        Game newGame = gameRepository.save(new Game(new Date()));
        GamePlayer newGamePlayer = gamePlayerRepository.save(new GamePlayer(newGame, user));
        return new ResponseEntity<Map<String, Object>>(makeMap("gpId", newGamePlayer.getId()), HttpStatus.CREATED);
    }

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
        oneGamePlayer.put("history", gamePlayerRepository.findOne(id).getGame().getGamePlayers().stream()
        .map(gamePl -> makeHitsAndSinksGmPlayerDTO(gamePl))
        .collect(Collectors.toList()));
        oneGamePlayer.put("gameState", showGameState(id));
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
        return 1* countWins(player) + 0.5 * countTies(player);
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
        GamePlayer oponent = salvo.getGamePlayer().getGame().getGamePlayers().stream().filter(gPl -> gPl.getPlayer().getUserName() != userName).findAny().orElse(null);
        if (oponent == null) {return null;}
        if (oponent.getShips().size() == 0) {return null;}
        Set<Ship> oponentShips = oponent.getShips();

        Ship carrier = oponentShips.stream().filter(ship -> ship.getType().equals("Aircraft Carrier")).findAny().orElse(null);
        Ship battleship = oponentShips.stream().filter(ship -> ship.getType().equals("Battleship")).findAny().orElse(null);
        Ship submarine = oponentShips.stream().filter(ship -> ship.getType().equals("Submarine")).findAny().orElse(null);
        Ship destroyer = oponentShips.stream().filter(ship -> ship.getType().equals("Destroyer")).findAny().orElse(null);
        Ship boat = oponentShips.stream().filter(ship -> ship.getType().equals("Patrol Boat")).findAny().orElse(null);

        List<String> hitsCarrier = carrier.getLocations().stream().filter(l -> salvo.getLocations().contains(l)).collect(Collectors.toList());
        List<String> hitsBattleship = battleship.getLocations().stream().filter(l -> salvo.getLocations().contains(l)).collect(Collectors.toList());
        List<String> hitsSubmarine = submarine.getLocations().stream().filter(l -> salvo.getLocations().contains(l)).collect(Collectors.toList());
        List<String> hitsDestroyer = destroyer.getLocations().stream().filter(l -> salvo.getLocations().contains(l)).collect(Collectors.toList());
        List<String> hitsBoat = boat.getLocations().stream().filter(l -> salvo.getLocations().contains(l)).collect(Collectors.toList());
        List<String> allHits = new ArrayList<>();
        allHits.addAll(hitsCarrier);
        allHits.addAll(hitsBattleship);
        allHits.addAll(hitsSubmarine);
        allHits.addAll(hitsDestroyer);
        allHits.addAll(hitsBoat);

        Map<String, Object> oneTurnHits = new LinkedHashMap<String, Object>();
        oneTurnHits.put("hitsLocations", allHits);
        oneTurnHits.put("AircraftCarrier", hitsCarrier.size());
        oneTurnHits.put("Battleship", hitsBattleship.size());
        oneTurnHits.put("Submarine", hitsSubmarine.size());
        oneTurnHits.put("Destroyer", hitsDestroyer.size());
        oneTurnHits.put("PatrolBoat", hitsBoat.size());
        return oneTurnHits;
    }

    private Map<String, Object> makeSinksDTO(Salvo salvo, String userName) {
        GamePlayer me = salvo.getGamePlayer().getGame().getGamePlayers().stream().filter(gPl -> gPl.getPlayer().getUserName().equals(userName)).findAny().orElse(null);
        GamePlayer oponent = salvo.getGamePlayer().getGame().getGamePlayers().stream().filter(gPl -> gPl.getPlayer().getUserName() != userName).findAny().orElse(null);
        if (oponent == null) {return null;}
        if (oponent.getShips().size() == 0) {return null;}
        Set<Ship> oponentShips = oponent.getShips();

        Ship carrier = oponentShips.stream().filter(ship -> ship.getType().equals("Aircraft Carrier")).findAny().orElse(null);
        Ship battleship = oponentShips.stream().filter(ship -> ship.getType().equals("Battleship")).findAny().orElse(null);
        Ship submarine = oponentShips.stream().filter(ship -> ship.getType().equals("Submarine")).findAny().orElse(null);
        Ship destroyer = oponentShips.stream().filter(ship -> ship.getType().equals("Destroyer")).findAny().orElse(null);
        Ship boat = oponentShips.stream().filter(ship -> ship.getType().equals("Patrol Boat")).findAny().orElse(null);

        int thisTurnNumber = salvo.getTurnNumber();
        Set<Salvo> allSalvoes = me.getSalvoes().stream().filter(s -> s.getTurnNumber() < thisTurnNumber).collect(Collectors.toSet());
        allSalvoes.add(salvo);

        List<String> allHitsCarrier = allSalvoes.stream().flatMap(sal -> sal.getLocations().stream()).filter(l -> carrier.getLocations().contains(l)).collect(Collectors.toList());
        List<String> allHitsBattleship = allSalvoes.stream().flatMap(sal -> sal.getLocations().stream()).filter(l -> battleship.getLocations().contains(l)).collect(Collectors.toList());
        List<String> allHitsSubmarine = allSalvoes.stream().flatMap(sal -> sal.getLocations().stream()).filter(l -> submarine.getLocations().contains(l)).collect(Collectors.toList());
        List<String> allHitsDestroyer = allSalvoes.stream().flatMap(sal -> sal.getLocations().stream()).filter(l -> destroyer.getLocations().contains(l)).collect(Collectors.toList());
        List<String> allHitsBoat = allSalvoes.stream().flatMap(sal -> sal.getLocations().stream()).filter(l -> boat.getLocations().contains(l)).collect(Collectors.toList());

        int statusCarrier, statusBattleship, statusSubmarine, statusDestroyer, statusBoat;
        if (checkIfSunk(5, allHitsCarrier.size()) == "sunk")  statusCarrier = 0;
        else  statusCarrier = 1;
        if (checkIfSunk(4, allHitsBattleship.size()) == "sunk") statusBattleship = 0;
        else statusBattleship = 1;
        if (checkIfSunk(3, allHitsSubmarine.size()) == "sunk") statusSubmarine = 0;
        else statusSubmarine = 1;
        if (checkIfSunk(3, allHitsDestroyer.size()) == "sunk") statusDestroyer = 0;
        else statusDestroyer = 1;
        if (checkIfSunk(2, allHitsBoat.size()) == "sunk") statusBoat = 0;
        else statusBoat = 1;

        int left = statusCarrier + statusBattleship + statusSubmarine + statusDestroyer + statusBoat;

        Map<String, Object> oneTurnSinks = new LinkedHashMap<String, Object>();
        oneTurnSinks.put("AircraftCarrier", checkIfSunk(5, allHitsCarrier.size()));
        oneTurnSinks.put("Battleship", checkIfSunk(4, allHitsBattleship.size()));
        oneTurnSinks.put("Submarine", checkIfSunk(3, allHitsSubmarine.size()));
        oneTurnSinks.put("Destroyer", checkIfSunk(3, allHitsDestroyer.size()));
        oneTurnSinks.put("PatrolBoat", checkIfSunk(2, allHitsBoat.size()));
        oneTurnSinks.put("left", left);
        if (statusCarrier == 0) {oneTurnSinks.put("AirCarLoc", carrier.getLocations());}
        if (statusBattleship == 0) {oneTurnSinks.put("BattleshipLoc", battleship.getLocations());}
        if (statusSubmarine == 0) {oneTurnSinks.put("SubmarLoc", submarine.getLocations());}
        if (statusDestroyer == 0) {oneTurnSinks.put("Destloc", destroyer.getLocations());}
        if (statusBoat == 0) {oneTurnSinks.put("PatBoatLoc", boat.getLocations());}
        return oneTurnSinks;
    }

    private String checkIfSunk(int shipLength, int allHitsSize) {
        String state;
        if (allHitsSize == shipLength)  state = "sunk";
        else state = "left";
        return state;
    }

    private String showGameState(Long id) {
        GamePlayer meGamePl = gamePlayerRepository.findOne(id);
        GamePlayer opponentGmPl =  gamePlayerRepository.findOne(id).getGame().getGamePlayers().stream().filter(gpl -> gpl.getId() != id).findAny().orElse(null);

        if (meGamePl.getShips().size() == 0) {return "PlaceShips";}
        if (opponentGmPl == null && meGamePl.getSalvoes().size() == 0) {return "EnterSalvo";}
        if (opponentGmPl == null && meGamePl.getSalvoes().size() > 0) {return "WaitForOpponentSalvo";}
        if (meGamePl.getShips().size() == 5 && opponentGmPl != null && checkIfgameOver(id) == "continue" && meGamePl.getSalvoes().size() > opponentGmPl.getSalvoes().size()) {return "WaitForOpponentSalvo";}
        if (meGamePl.getShips().size() == 5 && opponentGmPl != null && checkIfgameOver(id) == "continue" && meGamePl.getSalvoes().size() < opponentGmPl.getSalvoes().size()) {return "EnterSalvo";}
        if (meGamePl.getShips().size() == 5 && opponentGmPl != null && checkIfgameOver(id) != "continue" && meGamePl.getSalvoes().size() < opponentGmPl.getSalvoes().size()) {return "EnterSalvo";}
        if (meGamePl.getShips().size() == 5 && opponentGmPl != null && checkIfgameOver(id) != "continue" && meGamePl.getSalvoes().size() > opponentGmPl.getSalvoes().size()) {return "WaitForOpponentSalvo";}
        System.out.println(opponentGmPl);
        if (meGamePl.getShips().size() == 5 && opponentGmPl != null && checkIfgameOver(id) != "continue" && meGamePl.getSalvoes().size() == opponentGmPl.getSalvoes().size()) {updateScores(id); return "GameOver";}
       return "EnterSalvo";
    }

    private String checkIfgameOver(Long id) {
        GamePlayer me = gamePlayerRepository.findOne(id);
        GamePlayer oponent =  gamePlayerRepository.findOne(id).getGame().getGamePlayers().stream().filter(gpl -> gpl.getId() != id).findAny().orElse(null);
        if (oponent == null) {return "continue";}
        //int currentTurnNumMe = me.getSalvoes().stream().mapToInt(sal -> sal.getTurnNumber()).max().orElse(-1);
        //int currentTurnNumOpp = oponent.getSalvoes().stream().mapToInt(sal -> sal.getTurnNumber()).max().orElse(-1);
        if (oponent.getShips().size() == 0) {return "continue";}
        Set<Ship> oponentShips = oponent.getShips();
        Ship carrierOpp = oponentShips.stream().filter(ship -> ship.getType().equals("Aircraft Carrier")).findAny().get();
        Ship battleshipOpp = oponentShips.stream().filter(ship -> ship.getType().equals("Battleship")).findAny().get();
        Ship submarineOpp = oponentShips.stream().filter(ship -> ship.getType().equals("Submarine")).findAny().get();
        Ship destroyerOpp = oponentShips.stream().filter(ship -> ship.getType().equals("Destroyer")).findAny().get();
        Ship boatOpp = oponentShips.stream().filter(ship -> ship.getType().equals("Patrol Boat")).findAny().get();

        if (me.getSalvoes().size() == 0) {return "continue";}
        List<String> allHitsCarrierOpp = me.getSalvoes().stream().flatMap(sal -> sal.getLocations().stream()).filter(l -> carrierOpp.getLocations().contains(l)).collect(Collectors.toList());
        List<String> allHitsBattleshipOpp = me.getSalvoes().stream().flatMap(sal -> sal.getLocations().stream()).filter(l -> battleshipOpp.getLocations().contains(l)).collect(Collectors.toList());
        List<String> allHitsSubmarineOpp = me.getSalvoes().stream().flatMap(sal -> sal.getLocations().stream()).filter(l -> submarineOpp.getLocations().contains(l)).collect(Collectors.toList());
        List<String> allHitsDestroyerOpp = me.getSalvoes().stream().flatMap(sal -> sal.getLocations().stream()).filter(l -> destroyerOpp.getLocations().contains(l)).collect(Collectors.toList());
        List<String> allHitsBoatOpp = me.getSalvoes().stream().flatMap(sal -> sal.getLocations().stream()).filter(l -> boatOpp.getLocations().contains(l)).collect(Collectors.toList());

        int statusCarrierOpp, statusBattleshipOpp, statusSubmarineOpp, statusDestroyerOpp, statusBoatOpp;
        if (checkIfSunk(5, allHitsCarrierOpp.size()) == "sunk")  statusCarrierOpp = 0;
        else  statusCarrierOpp = 1;
        if (checkIfSunk(4, allHitsBattleshipOpp.size()) == "sunk") statusBattleshipOpp = 0;
        else statusBattleshipOpp = 1;
        if (checkIfSunk(3, allHitsSubmarineOpp.size()) == "sunk") statusSubmarineOpp = 0;
        else statusSubmarineOpp = 1;
        if (checkIfSunk(3, allHitsDestroyerOpp.size()) == "sunk") statusDestroyerOpp = 0;
        else statusDestroyerOpp = 1;
        if (checkIfSunk(2, allHitsBoatOpp.size()) == "sunk") statusBoatOpp = 0;
        else statusBoatOpp = 1;
        int leftOpp = statusCarrierOpp + statusBattleshipOpp + statusSubmarineOpp + statusDestroyerOpp + statusBoatOpp;

        Set<Ship> meShips = me.getShips();
        Ship carrierMe = meShips.stream().filter(ship -> ship.getType().equals("Aircraft Carrier")).findAny().get();
        Ship battleshipMe = meShips.stream().filter(ship -> ship.getType().equals("Battleship")).findAny().get();
        Ship submarineMe = meShips.stream().filter(ship -> ship.getType().equals("Submarine")).findAny().get();
        Ship destroyerMe = meShips.stream().filter(ship -> ship.getType().equals("Destroyer")).findAny().get();
        Ship boatMe = meShips.stream().filter(ship -> ship.getType().equals("Patrol Boat")).findAny().get();

        if (oponent.getSalvoes().size() == 0) {return "continue";}
        List<String> allHitsCarrierMe = oponent.getSalvoes().stream().flatMap(sal -> sal.getLocations().stream()).filter(l -> carrierMe.getLocations().contains(l)).collect(Collectors.toList());
        List<String> allHitsBattleshipMe = oponent.getSalvoes().stream().flatMap(sal -> sal.getLocations().stream()).filter(l -> battleshipMe.getLocations().contains(l)).collect(Collectors.toList());
        List<String> allHitsSubmarineMe = oponent.getSalvoes().stream().flatMap(sal -> sal.getLocations().stream()).filter(l -> submarineMe.getLocations().contains(l)).collect(Collectors.toList());
        List<String> allHitsDestroyerMe = oponent.getSalvoes().stream().flatMap(sal -> sal.getLocations().stream()).filter(l -> destroyerMe.getLocations().contains(l)).collect(Collectors.toList());
        List<String> allHitsBoatMe = oponent.getSalvoes().stream().flatMap(sal -> sal.getLocations().stream()).filter(l -> boatMe.getLocations().contains(l)).collect(Collectors.toList());

        int statusCarrierMe, statusBattleshipMe, statusSubmarineMe, statusDestroyerMe, statusBoatMe;
        if (checkIfSunk(5, allHitsCarrierMe.size()) == "sunk")  statusCarrierMe = 0;
        else  statusCarrierMe = 1;
        if (checkIfSunk(4, allHitsBattleshipMe.size()) == "sunk") statusBattleshipMe = 0;
        else statusBattleshipMe = 1;
        if (checkIfSunk(3, allHitsSubmarineMe.size()) == "sunk") statusSubmarineMe = 0;
        else statusSubmarineMe = 1;
        if (checkIfSunk(3, allHitsDestroyerMe.size()) == "sunk") statusDestroyerMe = 0;
        else statusDestroyerMe = 1;
        if (checkIfSunk(2, allHitsBoatMe.size()) == "sunk") statusBoatMe = 0;
        else statusBoatMe = 1;
        int leftMe = statusCarrierMe + statusBattleshipMe + statusSubmarineMe + statusDestroyerMe + statusBoatMe;

        String result;
        if (leftOpp == 0 && leftMe == 0) result = "game over tied";
        else if (leftMe > 0 && leftOpp == 0) result = "game over meWon";
        else if (leftMe == 0 && leftOpp > 0) result = "game over meLost";
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





