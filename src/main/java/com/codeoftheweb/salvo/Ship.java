package com.codeoftheweb.salvo;

import java.util.ArrayList;
import java.util.Set;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.List;
import static java.util.stream.Collectors.toList;

@Entity
public class Ship {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;
    private String type;
    private ArrayList<String> locations;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    private GamePlayer gamePlayer;

    public Ship() { }

    public Ship(String type, ArrayList<String> locations, GamePlayer gamePlayer) {
        this.type = type;
        this.locations = locations;
        this.gamePlayer = gamePlayer;
    }

    public long getId() { return id; }

    public String getType() { return this.type; }

    public void setType(String type) { this.type = type; }

    public ArrayList<String> getLocations() { return this.locations; }

    public void setLocations(ArrayList<String> locations) { this.locations = locations; }

    public GamePlayer getGamePlayer() { return gamePlayer; }

    public void setGamePlayer(GamePlayer gamePlayer) { this.gamePlayer = gamePlayer; }
}
