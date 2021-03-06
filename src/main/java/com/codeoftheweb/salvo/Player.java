package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.List;
import static java.util.stream.Collectors.toList;
import javax.persistence.OneToMany;
import java.util.Set;


@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;
    private String userName;
    private String password;

    @OneToMany(mappedBy="player", fetch=FetchType.EAGER)
    Set<GamePlayer> gamePlayers;

    @OneToMany(mappedBy="player", fetch=FetchType.EAGER)
    Set<Score> scores;

    public Player() { }

    public Player(String user, String password) {
        this.userName = user;
        this.password = password;
    }

    public long getId() { return id; }

    public String getUserName() { return this.userName; }

    public void setUserName(String user) { this.userName = user; }

    public String getPassword() { return this.password; }

    public void setPassword(String password) { this.password = password; }

    public String toString() { return this.userName; }

    public void addGamePlayer(GamePlayer gamePlayer) {
        gamePlayer.setPlayer(this);
        gamePlayers.add(gamePlayer);
    }

    @JsonIgnore
    public List<Game> getGames() {
        return gamePlayers.stream().map(gmpl -> gmpl.getGame()).collect(toList());
    }

    public Set<Score> getScores() { return  scores; }

    public void addScore(Score score) {
        score.setPlayer(this);
        scores.add(score);
    }
}
