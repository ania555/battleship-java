package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import static java.util.stream.Collectors.toList;


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

    @OneToMany(mappedBy="gamePlayer", fetch=FetchType.EAGER)
    Set<Ship> ships;

    public GamePlayer() { }

    public GamePlayer(Game game, Player player) {
        this.creationDate = new Date();
        this.game = game;
        this.player = player;
    }

    public long getId() { return id; }

    public Date getCreationDate() { return this.creationDate; }

    public void setCreationDate(Date date) { this.creationDate = date; }

    public Player getPlayer() { return this.player; }

    public void setPlayer(Player player) { this.player = player; }

    public Game getGame() { return this.game; }

    public void setGame(Game game) { this.game = game; }

    public Set<Ship> getShips() { return ships; }

    public void addShip(Ship ship) {
        ship.setGamePlayer(this);
        ships.add(ship);
    }

}
