package com.codeoftheweb.salvo;

import java.util.Date;
import java.time.LocalDate;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.List;
import static java.util.stream.Collectors.toList;
import java.text.SimpleDateFormat;


@Entity
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;
    //private String creationDate;
    private Date creationDate;

    @OneToMany(mappedBy="game", fetch=FetchType.EAGER)
    Set<GamePlayer> gamePlayers;

    @OneToMany(mappedBy="game", fetch=FetchType.EAGER)
    Set<Score> scores;

    public Game() { }

    public Game(Date date) { this.creationDate = date; }

    public Date getCreationDate() { return this.creationDate; }

    public long getId() { return id; }

    public void setCreationDate(Date date) { this.creationDate = date; }

    public String toString() { return "date " + this.creationDate; }

    public Set<GamePlayer> getGamePlayers() { return  gamePlayers; }

    public void addGamePlayer(GamePlayer gamePlayer) {
        gamePlayer.setGame(this);
        gamePlayers.add(gamePlayer);
    }

    @JsonIgnore
    public List<Player> getPlayers() {
        return gamePlayers.stream().map(gmpl -> gmpl.getPlayer()).collect(toList());
    }

    public Set<Score> getScores() { return  scores; }

    public void addScore(Score score) {
        score.setGame(this);
        scores.add(score);
    }

}
