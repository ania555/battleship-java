package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.Date;
import java.time.LocalDate;
import javax.persistence.CascadeType;


@Entity
public class GamePlayer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;
    private Date creationDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="game_id")
    private Game game;

    @ManyToOne(fetch = FetchType.EAGER)
    //@ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="player_id")
    private Player player;

    public GamePlayer() { }

    public GamePlayer(Date date, Game game, Player player) {
        this.creationDate = date;
        this.game = game;
        this.player = player;
    }

    public Date getCreationDate() { return this.creationDate; }

    public void setCreationDate(Date date) { this.creationDate = date; }

    public Player getPlayer() { return this.player; }

    public void setPlayer(Player player) { this.player = player; }


    public Game getGame() { return this.game; }

    public void setGame(Game game) { this.game = game; }

}
