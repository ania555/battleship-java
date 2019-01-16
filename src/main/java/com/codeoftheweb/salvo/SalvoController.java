package com.codeoftheweb.salvo;

import org.springframework.web.bind.annotation.PathVariable;
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

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private GamePlayerRepository gamePlayerRepository;

    @Autowired
    private GameRepository gameRepository;


    @RequestMapping("/leader_board")
    public Object getLeaderBoard() {
        return playerRepository.findAll().stream()
                .map(player -> makeLeaderBoardDTO(player))
                .collect(Collectors.toList());
    }

    @RequestMapping("/game_view/{id}")
    public Object getGamePlayerView(@PathVariable Long id) {
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
        return oneGamePlayer;
    }

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
        oneGmPlayer.put("score", showResult(gamePlayer.getScore()));
        oneGmPlayer.put("player", makePlayerDTO(gamePlayer.getPlayer()));
        return oneGmPlayer;
    }

    public Map<String, Object> makePlayerDTO(Player player) {
        Map<String, Object> onePlayer = new LinkedHashMap<String, Object>();
        onePlayer.put("id", player.getId());
        onePlayer.put("email", player.getUserName());
        return onePlayer;
    }

    public  Map<String, Object> makeShipsDTO(Ship ship) {
        Map<String, Object> aoneShip = new LinkedHashMap<String, Object>();
        aoneShip.put("type", ship.getType());
        aoneShip.put("locations", ship.getLocations());
        return aoneShip;
    }

    /*public List<Object> getSalGmPlayers(id) {
        return gamePlayerRepository.findOne(id).getGame().getGamePlayers().stream()
                .map(gamePl -> makeGmPlayerDTO(gamePl))
                .collect(Collectors.toList());
    }*/

    public Map<String, Object> makeSalGmPlayerDTO(GamePlayer gamePlayer) {
        Map<String, Object> oneSalGmPl = new LinkedHashMap<String, Object>();
        oneSalGmPl.put("gamePlayerId", gamePlayer.getId());
        oneSalGmPl.put("gamePlayerEmail", gamePlayer.getPlayer().getUserName());
        oneSalGmPl.put("gamePlayerSalvoes", gamePlayer.getSalvoes().stream()
        .map(salvo -> makeSalvoesDTO(salvo))
        .collect(Collectors.toList()));
        return oneSalGmPl;
    }

    public Map<String, Object> makeSalvoesDTO(Salvo salvo) {
        Map<String, Object> oneSalvo = new LinkedHashMap<String, Object>();
        oneSalvo.put("turn", salvo.getTurnNumber());
        oneSalvo.put("locations", salvo.getLocations());
        return oneSalvo;
    }

    public String showResult(Score score) {
        if (score == null) { return "game not finished"; }
        else { return score.getResult(); }
    }

    public Map<String, Object> makeLeaderBoardDTO(Player player) {
        Map<String, Object> onePlayer = new LinkedHashMap<String, Object>();
        onePlayer.put("id", player.getId());
        onePlayer.put("email", player.getUserName());
        onePlayer.put("totalScore", countTotalScore(player));
        onePlayer.put("win_count", countWins(player));
        onePlayer.put("loss_count", countLosses(player));
        onePlayer.put("tie_count", countTies(player));
        return onePlayer;
    }

    public int countWins(Player player) {
        List<Object> wins = player.getScores().stream().filter(p -> p.getResult().equals("won")).collect(Collectors.toList());
        return wins.size();
    }

    public int countLosses(Player player) {
        List<Object> losses = player.getScores().stream().filter(p -> p.getResult().equals("lost")).collect(Collectors.toList());
        return losses.size();
    }

    public int countTies(Player player) {
        List<Object> ties = player.getScores().stream().filter(p -> p.getResult().equals("tied")).collect(Collectors.toList());
        return ties.size();
    }

    public double countTotalScore(Player player) {
        //double wins = countWins(player);
        //double ties = countTies(player);
        //double total = 1 * wins + 0.5 * ties;
        return 1* countWins(player) + 0.5 * countTies(player);
    }

    }


   /* public List<Object> getAllGames() {
    return gameRepository.findAll().stream().map(a -> a.getId()).collect(Collectors.toList());
    }*/




